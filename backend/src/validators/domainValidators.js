const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
const POSITIVE_INTEGER_PATTERN = /^\d+$/;

function trimmedString(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function hasOwnField(source, fieldName) {
  return Object.prototype.hasOwnProperty.call(source, fieldName);
}

function isPositiveInteger(value) {
  return POSITIVE_INTEGER_PATTERN.test(String(value)) && Number(value) > 0;
}

function isValidEmailOrBlank(value) {
  const email = trimmedString(value);

  return !email || (EMAIL_PATTERN.test(email) && email.length <= 100);
}

function isValidTime(value) {
  return TIME_PATTERN.test(trimmedString(value));
}

function normalizeTime(value) {
  const time = trimmedString(value);

  if (!isValidTime(time)) {
    return '';
  }

  if (time.length === 5) {
    return `${time}:00`;
  }

  return time;
}

function isValidDayOfWeek(value) {
  return Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 6;
}

function normalizeOptionalText(value) {
  if (value === undefined || value === null) {
    return null;
  }

  return trimmedString(value);
}

function isValidPrice(value) {
  const price = Number(value);

  return Number.isFinite(price) && price >= 0 && price <= 999999.99;
}

function validateServiceFields(body, options = {}) {
  const requireAll = options.requireAll === true;
  const errors = [];

  if (requireAll || hasOwnField(body, 'name')) {
    const name = trimmedString(body.name);

    if (!name || name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Service name is required and must be up to 100 characters'
      });
    }
  }

  if (requireAll || hasOwnField(body, 'duration')) {
    if (!isPositiveInteger(body.duration)) {
      errors.push({
        field: 'duration',
        message: 'Duration must be a positive number of minutes'
      });
    }
  }

  if (requireAll || hasOwnField(body, 'price')) {
    if (!isValidPrice(body.price)) {
      errors.push({
        field: 'price',
        message: 'Price must be a non-negative amount up to 999999.99'
      });
    }
  }

  return errors;
}

function validatePositiveIdParam(req, paramName, label) {
  const errors = [];

  if (!isPositiveInteger(req.params[paramName])) {
    errors.push({
      field: paramName,
      message: `${label} must be a positive integer`
    });
  }

  return errors;
}

function validateServiceIdParam(req) {
  return validatePositiveIdParam(req, 'id', 'Service ID');
}

function validateStylistIdParam(req) {
  return validatePositiveIdParam(req, 'stylistId', 'Stylist ID');
}

function validateCreateService(req) {
  return validateServiceFields(req.body || {}, { requireAll: true });
}

function validateUpdateService(req) {
  const body = req.body || {};
  const errors = validateServiceIdParam(req);
  const allowedFields = ['name', 'duration', 'price', 'is_active'];
  const hasUpdate = allowedFields.some((field) => hasOwnField(body, field));

  if (!hasUpdate) {
    errors.push({
      field: 'body',
      message: 'At least one service field must be provided'
    });
  }

  errors.push(...validateServiceFields(body));

  if (hasOwnField(body, 'is_active') && typeof body.is_active !== 'boolean') {
    errors.push({
      field: 'is_active',
      message: 'is_active must be true or false'
    });
  }

  return errors;
}

const validateDeactivateService = validateServiceIdParam;

function validateUpdateSalonProfile(req) {
  const body = req.body || {};
  const errors = [];
  const name = trimmedString(body.name);
  const address = normalizeOptionalText(body.address);
  const phone = normalizeOptionalText(body.phone);
  const description = normalizeOptionalText(body.description);

  if (!name || name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Salon name is required and must be up to 100 characters'
    });
  }

  if (address !== null && address.length > 255) {
    errors.push({
      field: 'address',
      message: 'Address must be up to 255 characters'
    });
  }

  if (phone !== null && phone.length > 20) {
    errors.push({
      field: 'phone',
      message: 'Phone must be up to 20 characters'
    });
  }

  if (!isValidEmailOrBlank(body.email)) {
    errors.push({
      field: 'email',
      message: 'Email must be a valid email address up to 100 characters'
    });
  }

  if (description !== null && description.length > 5000) {
    errors.push({
      field: 'description',
      message: 'Description must be up to 5000 characters'
    });
  }

  return errors;
}

function validateBusinessHour(hour, index) {
  const errors = [];
  const prefix = `hours[${index}]`;
  const openTime = normalizeTime(hour.open_time);
  const closeTime = normalizeTime(hour.close_time);

  if (!isValidDayOfWeek(hour.day_of_week)) {
    errors.push({
      field: `${prefix}.day_of_week`,
      message: 'Day of week must be an integer from 0 to 6'
    });
  }

  if (!openTime) {
    errors.push({
      field: `${prefix}.open_time`,
      message: 'Open time must use HH:MM or HH:MM:SS format'
    });
  }

  if (!closeTime) {
    errors.push({
      field: `${prefix}.close_time`,
      message: 'Close time must use HH:MM or HH:MM:SS format'
    });
  }

  if (typeof hour.is_closed !== 'boolean') {
    errors.push({
      field: `${prefix}.is_closed`,
      message: 'is_closed must be true or false'
    });
  }

  if (openTime && closeTime && !hour.is_closed && closeTime <= openTime) {
    errors.push({
      field: `${prefix}.close_time`,
      message: 'Close time must be after open time when the salon is open'
    });
  }

  return errors;
}

function validateUpdateBusinessHours(req) {
  const body = req.body || {};
  const errors = [];

  if (!Array.isArray(body.hours) || body.hours.length !== 7) {
    return [{
      field: 'hours',
      message: 'Business hours must include exactly 7 day records'
    }];
  }

  const days = new Set();

  for (let index = 0; index < body.hours.length; index += 1) {
    const hour = body.hours[index] || {};
    const dayOfWeek = Number(hour.day_of_week);

    errors.push(...validateBusinessHour(hour, index));

    if (isValidDayOfWeek(hour.day_of_week)) {
      if (days.has(dayOfWeek)) {
        errors.push({
          field: `hours[${index}].day_of_week`,
          message: 'Each day of week can appear only once'
        });
      }

      days.add(dayOfWeek);
    }
  }

  return errors;
}

function normalizeBusinessHours(body) {
  return body.hours.map((hour) => ({
    dayOfWeek: Number(hour.day_of_week),
    openTime: normalizeTime(hour.open_time),
    closeTime: normalizeTime(hour.close_time),
    isClosed: hour.is_closed
  }));
}

function validateAvailabilityBlock(block, index) {
  const errors = [];
  const prefix = `availability[${index}]`;
  const startTime = normalizeTime(block.start_time);
  const endTime = normalizeTime(block.end_time);

  if (!isValidDayOfWeek(block.day_of_week)) {
    errors.push({
      field: `${prefix}.day_of_week`,
      message: 'Day of week must be an integer from 0 to 6'
    });
  }

  if (!startTime) {
    errors.push({
      field: `${prefix}.start_time`,
      message: 'Start time must use HH:MM or HH:MM:SS format'
    });
  }

  if (!endTime) {
    errors.push({
      field: `${prefix}.end_time`,
      message: 'End time must use HH:MM or HH:MM:SS format'
    });
  }

  if (startTime && endTime && endTime <= startTime) {
    errors.push({
      field: `${prefix}.end_time`,
      message: 'End time must be after start time'
    });
  }

  return errors;
}

function validateReplaceAvailability(req) {
  const body = req.body || {};
  const errors = [];

  if (!Array.isArray(body.availability)) {
    return [{
      field: 'availability',
      message: 'Availability must be an array'
    }];
  }

  const seenBlocks = new Set();

  for (let index = 0; index < body.availability.length; index += 1) {
    const block = body.availability[index] || {};
    const dayOfWeek = Number(block.day_of_week);
    const startTime = normalizeTime(block.start_time);
    const endTime = normalizeTime(block.end_time);
    const blockKey = `${dayOfWeek}:${startTime}:${endTime}`;

    errors.push(...validateAvailabilityBlock(block, index));

    if (startTime && endTime && isValidDayOfWeek(block.day_of_week)) {
      if (seenBlocks.has(blockKey)) {
        errors.push({
          field: `availability[${index}]`,
          message: 'Duplicate availability blocks are not allowed'
        });
      }

      seenBlocks.add(blockKey);
    }
  }

  return errors;
}

function normalizeAvailabilityBlocks(body) {
  return body.availability.map((block) => ({
    dayOfWeek: Number(block.day_of_week),
    startTime: normalizeTime(block.start_time),
    endTime: normalizeTime(block.end_time)
  }));
}

module.exports = {
  normalizeAvailabilityBlocks,
  normalizeBusinessHours,
  normalizeOptionalText,
  normalizeTime,
  trimmedString,
  validateCreateService,
  validateDeactivateService,
  validateReplaceAvailability,
  validateServiceIdParam,
  validateStylistIdParam,
  validateUpdateBusinessHours,
  validateUpdateSalonProfile,
  validateUpdateService
};
