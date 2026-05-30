const {
  getSalonProfile,
  listBusinessHours,
  replaceBusinessHours,
  upsertSalonProfile
} = require('../models/salonModel');
const {
  normalizeBusinessHours,
  normalizeOptionalText,
  trimmedString
} = require('../validators/domainValidators');

function optionalEmail(email) {
  const trimmedEmail = trimmedString(email);

  if (!trimmedEmail) {
    return null;
  }

  return trimmedEmail;
}

function buildSalonProfilePayload(req) {
  return {
    name: trimmedString(req.body.name),
    address: normalizeOptionalText(req.body.address),
    phone: normalizeOptionalText(req.body.phone),
    email: optionalEmail(req.body.email),
    description: normalizeOptionalText(req.body.description)
  };
}

async function getPublicSalonProfile(_req, res) {
  const profile = await getSalonProfile();

  return res.status(200).json({
    profile
  });
}

async function updateManagedSalonProfile(req, res) {
  const payload = buildSalonProfilePayload(req);
  const profile = await upsertSalonProfile(payload);

  return res.status(200).json({
    profile
  });
}

async function getPublicBusinessHours(_req, res) {
  const businessHours = await listBusinessHours();

  return res.status(200).json({
    business_hours: businessHours
  });
}

async function updateManagedBusinessHours(req, res) {
  const hours = normalizeBusinessHours(req.body);
  const businessHours = await replaceBusinessHours(hours);

  return res.status(200).json({
    business_hours: businessHours
  });
}

module.exports = {
  getPublicBusinessHours,
  getPublicSalonProfile,
  updateManagedBusinessHours,
  updateManagedSalonProfile
};
