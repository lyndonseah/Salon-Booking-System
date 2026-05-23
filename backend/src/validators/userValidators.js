const VALID_ROLES = ['Customer', 'Stylist', 'Manager'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,50}$/;
const POSITIVE_INTEGER_PATTERN = /^\d+$/;

function trimmedString(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function isEmail(value) {
  return EMAIL_PATTERN.test(value);
}

function isUsername(value) {
  return USERNAME_PATTERN.test(value);
}

function isPositiveInteger(value) {
  return POSITIVE_INTEGER_PATTERN.test(String(value)) && Number(value) > 0;
}

function hasOwnField(source, fieldName) {
  return Object.prototype.hasOwnProperty.call(source, fieldName);
}

function optionalTrimmedPhone(phone) {
  if (phone === undefined || phone === null) {
    return null;
  }

  return trimmedString(phone);
}

function validateUserIdParam(req) {
  const errors = [];

  if (!isPositiveInteger(req.params.id)) {
    errors.push({
      field: 'id',
      message: 'User ID must be a positive integer'
    });
  }

  return errors;
}

function validateUserIdentityFields(body, options = {}) {
  const requirePassword = options.requirePassword !== false;
  const errors = [];
  const username = trimmedString(body.username);
  const email = trimmedString(body.email);
  const fullName = trimmedString(body.full_name);
  const phone = optionalTrimmedPhone(body.phone);
  let password = '';

  if (typeof body.password === 'string') {
    password = body.password;
  }

  if (!isUsername(username)) {
    errors.push({
      field: 'username',
      message: 'Username must be 3-50 characters and contain only letters, numbers, or underscores'
    });
  }

  if (!isEmail(email) || email.length > 100) {
    errors.push({
      field: 'email',
      message: 'Email must be a valid email address up to 100 characters'
    });
  }

  if (!fullName || fullName.length > 100) {
    errors.push({
      field: 'full_name',
      message: 'Full name is required and must be up to 100 characters'
    });
  }

  if (phone !== null && phone.length > 20) {
    errors.push({
      field: 'phone',
      message: 'Phone must be up to 20 characters'
    });
  }

  if (requirePassword && (!password || password.length < 8 || password.length > 72)) {
    errors.push({
      field: 'password',
      message: 'Password must be 8-72 characters'
    });
  }

  return errors;
}

function validateRegister(req) {
  return validateUserIdentityFields(req.body);
}

function validateLogin(req) {
  const errors = [];
  const username = trimmedString(req.body.username);
  let password = '';

  if (typeof req.body.password === 'string') {
    password = req.body.password;
  }

  if (!username) {
    errors.push({
      field: 'username',
      message: 'Username is required'
    });
  }

  if (!password) {
    errors.push({
      field: 'password',
      message: 'Password is required'
    });
  }

  return errors;
}

function validateCreateStylist(req) {
  return validateUserIdentityFields(req.body);
}

function validateUpdateUser(req) {
  const errors = validateUserIdParam(req);
  const body = req.body || {};
  const allowedFields = ['username', 'email', 'full_name', 'phone', 'role', 'is_active'];
  let hasUpdate = false;

  for (const field of allowedFields) {
    if (hasOwnField(body, field)) {
      hasUpdate = true;
      break;
    }
  }

  if (!hasUpdate) {
    errors.push({
      field: 'body',
      message: 'At least one user field must be provided'
    });
  }

  if (hasOwnField(body, 'username') && !isUsername(trimmedString(body.username))) {
    errors.push({
      field: 'username',
      message: 'Username must be 3-50 characters and contain only letters, numbers, or underscores'
    });
  }

  if (hasOwnField(body, 'email')) {
    const email = trimmedString(body.email);

    if (!isEmail(email) || email.length > 100) {
      errors.push({
        field: 'email',
        message: 'Email must be a valid email address up to 100 characters'
      });
    }
  }

  if (hasOwnField(body, 'full_name')) {
    const fullName = trimmedString(body.full_name);

    if (!fullName || fullName.length > 100) {
      errors.push({
        field: 'full_name',
        message: 'Full name must be up to 100 characters'
      });
    }
  }

  if (hasOwnField(body, 'phone')) {
    let phone = trimmedString(body.phone);

    if (body.phone === null) {
      phone = null;
    }

    if (phone !== null && phone.length > 20) {
      errors.push({
        field: 'phone',
        message: 'Phone must be up to 20 characters'
      });
    }
  }

  const hasInvalidRole =
    hasOwnField(body, 'role') &&
    !VALID_ROLES.includes(trimmedString(body.role));

  if (hasInvalidRole) {
    errors.push({
      field: 'role',
      message: 'Role must be Customer, Stylist, or Manager'
    });
  }

  const hasInvalidActiveFlag =
    hasOwnField(body, 'is_active') &&
    typeof body.is_active !== 'boolean';

  if (hasInvalidActiveFlag) {
    errors.push({
      field: 'is_active',
      message: 'is_active must be true or false'
    });
  }

  return errors;
}

const validateDeactivateUser = validateUserIdParam;

module.exports = {
  trimmedString,
  validateCreateStylist,
  validateDeactivateUser,
  validateLogin,
  validateRegister,
  validateUpdateUser
};
