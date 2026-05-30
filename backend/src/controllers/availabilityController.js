const {
  listAvailabilityForStylist,
  replaceAvailabilityForStylist
} = require('../models/availabilityModel');
const { listBusinessHoursByDay } = require('../models/salonModel');
const { findActiveStylistById } = require('../models/stylistModel');
const { createHttpError } = require('../utils/createHttpError');
const { normalizeAvailabilityBlocks } = require('../validators/domainValidators');

function timeValue(time) {
  if (typeof time === 'string') {
    return time;
  }

  return String(time);
}

function buildBusinessHourErrors(blocks, businessHoursByDay) {
  const errors = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const businessHour = businessHoursByDay.get(block.dayOfWeek);

    if (!businessHour || businessHour.is_closed) {
      errors.push({
        field: `availability[${index}].day_of_week`,
        message: 'Availability must be within a day when the salon is open'
      });
      continue;
    }

    const openTime = timeValue(businessHour.open_time);
    const closeTime = timeValue(businessHour.close_time);
    const startsBeforeOpen = block.startTime < openTime;
    const endsAfterClose = block.endTime > closeTime;

    if (startsBeforeOpen || endsAfterClose) {
      errors.push({
        field: `availability[${index}]`,
        message: `Availability must be within business hours ${openTime}-${closeTime}`
      });
    }
  }

  return errors;
}

async function ensureActiveStylist(stylistId, next) {
  const stylist = await findActiveStylistById(stylistId);

  if (!stylist) {
    return next(createHttpError(404, 'Stylist not found'));
  }

  return stylist;
}

async function getMyAvailability(req, res) {
  const availability = await listAvailabilityForStylist(req.user.user_id);

  return res.status(200).json({
    availability
  });
}

async function replaceMyAvailability(req, res, next) {
  const blocks = normalizeAvailabilityBlocks(req.body);
  const businessHoursByDay = await listBusinessHoursByDay();
  const businessHourErrors = buildBusinessHourErrors(blocks, businessHoursByDay);

  if (businessHourErrors.length > 0) {
    return next(createHttpError(400, 'Validation failed', businessHourErrors));
  }

  const availability = await replaceAvailabilityForStylist(req.user.user_id, blocks);

  return res.status(200).json({
    availability
  });
}

async function getStylistAvailability(req, res, next) {
  const stylistId = Number(req.params.stylistId);
  const stylist = await ensureActiveStylist(stylistId, next);

  if (!stylist) {
    return null;
  }

  const availability = await listAvailabilityForStylist(stylistId);

  return res.status(200).json({
    availability
  });
}

module.exports = {
  getMyAvailability,
  getStylistAvailability,
  replaceMyAvailability
};
