const express = require('express');

const {
  createManagedService,
  deactivateManagedService,
  getService,
  getServices,
  updateManagedService
} = require('../controllers/serviceController');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth, requireRoles } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const {
  validateCreateService,
  validateDeactivateService,
  validateServiceIdParam,
  validateUpdateService
} = require('../validators/domainValidators');

const router = express.Router();
const requireManager = [
  asyncHandler(requireAuth),
  requireRoles('Manager')
];

router.get('/', asyncHandler(getServices));

router.get(
  '/:id',
  validateRequest(validateServiceIdParam),
  asyncHandler(getService)
);

router.post(
  '/',
  ...requireManager,
  validateRequest(validateCreateService),
  asyncHandler(createManagedService)
);

router.put(
  '/:id',
  ...requireManager,
  validateRequest(validateUpdateService),
  asyncHandler(updateManagedService)
);

router.delete(
  '/:id',
  ...requireManager,
  validateRequest(validateDeactivateService),
  asyncHandler(deactivateManagedService)
);

module.exports = router;
