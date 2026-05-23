const jwt = require('jsonwebtoken');

const { findActiveUserById } = require('../models/userModel');
const { config } = require('../config/env');
const { createHttpError } = require('../utils/createHttpError');
const { verifyAuthToken } = require('../utils/authTokens');
const { toPublicUser } = require('../utils/users');

function getAuthCookieToken(req) {
  if (!req.cookies) {
    return null;
  }

  return req.cookies[config.authCookie.name] || null;
}

async function requireAuth(req, _res, next) {
  const token = getAuthCookieToken(req);

  if (!token) {
    return next(createHttpError(401, 'Authentication cookie is required'));
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await findActiveUserById(payload.userId);

    if (!user || user.role !== payload.role) {
      return next(createHttpError(401, 'Authentication token is invalid'));
    }

    req.user = toPublicUser(user);
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(createHttpError(401, 'Authentication token is invalid'));
    }

    return next(error);
  }
}

function requireRoles(...allowedRoles) {
  function checkUserRole(req, _res, next) {
    if (!req.user) {
      return next(createHttpError(401, 'Authentication cookie is required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createHttpError(403, 'Insufficient role permissions'));
    }

    return next();
  }

  return checkUserRole;
}

module.exports = {
  requireAuth,
  requireRoles
};
