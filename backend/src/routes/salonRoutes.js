const express = require('express');

const {
  getPublicBusinessHours,
  getPublicSalonProfile,
  updateManagedBusinessHours,
  updateManagedSalonProfile
} = require('../controllers/salonController');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth, requireRoles } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const {
  validateUpdateBusinessHours,
  validateUpdateSalonProfile
} = require('../validators/domainValidators');

const router = express.Router();
const requireManager = [
  asyncHandler(requireAuth),
  requireRoles('Manager')
];

router.get('/', asyncHandler(getPublicSalonProfile));

router.put(
  '/',
  ...requireManager,
  validateRequest(validateUpdateSalonProfile),
  asyncHandler(updateManagedSalonProfile)
);

router.get('/hours', asyncHandler(getPublicBusinessHours));

router.put(
  '/hours',
  ...requireManager,
  validateRequest(validateUpdateBusinessHours),
  asyncHandler(updateManagedBusinessHours)
);

module.exports = router;
