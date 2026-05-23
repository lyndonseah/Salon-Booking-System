const jwt = require('jsonwebtoken');

const { config } = require('../config/env');
const { createHttpError } = require('./createHttpError');

function ensureJwtSecret() {
  if (!config.jwt.secret) {
    throw createHttpError(500, 'JWT_SECRET is not configured');
  }
}

function signAuthToken(user) {
  ensureJwtSecret();

  const payload = {
    userId: user.user_id,
    role: user.role
  };
  const options = {
    expiresIn: config.jwt.expiresIn
  };

  return jwt.sign(
    payload,
    config.jwt.secret,
    options
  );
}

function verifyAuthToken(token) {
  ensureJwtSecret();

  return jwt.verify(token, config.jwt.secret);
}

module.exports = {
  signAuthToken,
  verifyAuthToken
};
