const express = require('express');

const {
  getMyAvailability,
  getStylistAvailability,
  replaceMyAvailability
} = require('../controllers/availabilityController');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth, requireRoles } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const {
  validateReplaceAvailability,
  validateStylistIdParam
} = require('../validators/domainValidators');

const router = express.Router();

router.use(asyncHandler(requireAuth));

router.get(
  '/me',
  requireRoles('Stylist'),
  asyncHandler(getMyAvailability)
);

router.put(
  '/me',
  requireRoles('Stylist'),
  validateRequest(validateReplaceAvailability),
  asyncHandler(replaceMyAvailability)
);

router.get(
  '/:stylistId',
  validateRequest(validateStylistIdParam),
  asyncHandler(getStylistAvailability)
);

module.exports = router;
