const { createHttpError } = require('../utils/createHttpError');

function validateRequest(validator) {
  return function handleRequestValidation(req, _res, next) {
    const errors = validator(req) || [];

    if (errors.length > 0) {
      const error = createHttpError(400, 'Validation failed', errors);
      return next(error);
    }

    return next();
  };
}

module.exports = { validateRequest };
