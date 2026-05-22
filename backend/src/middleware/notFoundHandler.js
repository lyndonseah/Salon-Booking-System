const { createHttpError } = require('../utils/createHttpError');

function notFoundHandler(req, _res, next) {
  const message = `Route not found: ${req.method} ${req.originalUrl}`;
  const error = createHttpError(404, message);

  next(error);
}

module.exports = { notFoundHandler };
