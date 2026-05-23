const {
  createUser,
  findActiveUserById,
  findUserByUsername,
  findUserByUsernameOrEmail
} = require('../models/userModel');
const { config } = require('../config/env');
const { signAuthToken } = require('../utils/authTokens');
const { createHttpError } = require('../utils/createHttpError');
const { comparePassword, hashPassword } = require('../utils/passwords');
const { toPublicUser } = require('../utils/users');
const { trimmedString } = require('../validators/userValidators');

function createInvalidLoginError() {
  return createHttpError(401, 'Invalid username or password');
}

function optionalTrimmedPhone(phone) {
  if (phone === undefined || phone === null) {
    return null;
  }

  return trimmedString(phone);
}

function getAuthCookieOptions(includeMaxAge) {
  const options = {
    httpOnly: true,
    sameSite: config.authCookie.sameSite,
    secure: config.authCookie.secure,
    path: '/'
  };

  if (includeMaxAge) {
    options.maxAge = config.authCookie.maxAgeMs;
  }

  return options;
}

function setAuthCookie(res, token) {
  res.cookie(
    config.authCookie.name,
    token,
    getAuthCookieOptions(true)
  );
}

function clearAuthCookie(res) {
  res.clearCookie(
    config.authCookie.name,
    getAuthCookieOptions(false)
  );
}

async function register(req, res, next) {
  const username = trimmedString(req.body.username);
  const email = trimmedString(req.body.email);
  const fullName = trimmedString(req.body.full_name);
  const phone = optionalTrimmedPhone(req.body.phone);

  const existingUser = await findUserByUsernameOrEmail(username, email);

  if (existingUser) {
    return next(createHttpError(409, 'Username or email is already in use'));
  }

  try {
    const passwordHash = await hashPassword(req.body.password);
    const user = await createUser({
      username,
      email,
      fullName,
      phone,
      passwordHash,
      role: 'Customer'
    });
    const publicUser = toPublicUser(user);

    return res.status(201).json({
      message: 'Registration successful. Please log in.',
      user: publicUser
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(createHttpError(409, 'Username or email is already in use'));
    }

    return next(error);
  }
}

async function login(req, res, next) {
  const username = trimmedString(req.body.username);
  const user = await findUserByUsername(username);

  if (!user || !user.is_active) {
    return next(createInvalidLoginError());
  }

  const passwordMatches = await comparePassword(req.body.password, user.password);

  if (!passwordMatches) {
    return next(createInvalidLoginError());
  }

  const publicUser = toPublicUser(user);
  const token = signAuthToken(publicUser);
  setAuthCookie(res, token);

  return res.status(200).json({
    user: publicUser
  });
}

function logout(_req, res) {
  clearAuthCookie(res);

  return res.status(200).json({
    message: 'Logged out'
  });
}

async function getCurrentUser(req, res, next) {
  const user = await findActiveUserById(req.user.user_id);

  if (!user) {
    return next(createHttpError(401, 'Authentication token is invalid'));
  }

  return res.status(200).json({
    user: toPublicUser(user)
  });
}

module.exports = {
  getCurrentUser,
  login,
  logout,
  register
};
