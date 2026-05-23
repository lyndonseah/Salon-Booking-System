const {
  createUser,
  deactivateUser,
  findUserById,
  findUserByUsernameOrEmail,
  listUsers,
  updateUser
} = require('../models/userModel');
const { createHttpError } = require('../utils/createHttpError');
const { hashPassword } = require('../utils/passwords');
const { toPublicUser } = require('../utils/users');
const { trimmedString } = require('../validators/userValidators');

function requestHasField(req, fieldName) {
  return Object.prototype.hasOwnProperty.call(req.body, fieldName);
}

function optionalTrimmedPhone(phone) {
  if (phone === undefined || phone === null) {
    return null;
  }

  return trimmedString(phone);
}

async function getUsers(_req, res) {
  const users = await listUsers();
  const publicUsers = users.map(toPublicUser);

  return res.status(200).json({
    users: publicUsers
  });
}

async function createStylist(req, res, next) {
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
      role: 'Stylist'
    });

    return res.status(201).json({
      user: toPublicUser(user)
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(createHttpError(409, 'Username or email is already in use'));
    }

    return next(error);
  }
}

function buildUserUpdateFields(req) {
  const fields = {};

  if (requestHasField(req, 'username')) {
    fields.username = trimmedString(req.body.username);
  }

  if (requestHasField(req, 'email')) {
    fields.email = trimmedString(req.body.email);
  }

  if (requestHasField(req, 'full_name')) {
    fields.fullName = trimmedString(req.body.full_name);
  }

  if (requestHasField(req, 'phone')) {
    if (req.body.phone === null) {
      fields.phone = null;
    } else {
      fields.phone = trimmedString(req.body.phone);
    }
  }

  if (requestHasField(req, 'role')) {
    fields.role = trimmedString(req.body.role);
  }

  if (requestHasField(req, 'is_active')) {
    fields.isActive = req.body.is_active;
  }

  return fields;
}

async function updateManagedUser(req, res, next) {
  const userId = Number(req.params.id);
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    return next(createHttpError(404, 'User not found'));
  }

  const fields = buildUserUpdateFields(req);

  try {
    const updatedUser = await updateUser(userId, fields);

    return res.status(200).json({
      user: toPublicUser(updatedUser)
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(createHttpError(409, 'Username or email is already in use'));
    }

    return next(error);
  }
}

async function deactivateManagedUser(req, res, next) {
  const userId = Number(req.params.id);
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    return next(createHttpError(404, 'User not found'));
  }

  const user = await deactivateUser(userId);

  return res.status(200).json({
    user: toPublicUser(user)
  });
}

module.exports = {
  createStylist,
  deactivateManagedUser,
  getUsers,
  updateManagedUser
};
