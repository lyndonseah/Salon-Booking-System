const express = require('express');

const {
  createStylist,
  deactivateManagedUser,
  getUsers,
  updateManagedUser
} = require('../controllers/userController');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth, requireRoles } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const {
  validateCreateStylist,
  validateDeactivateUser,
  validateUpdateUser
} = require('../validators/userValidators');

const router = express.Router();

router.use(asyncHandler(requireAuth));
router.use(requireRoles('Manager'));

router.get('/', asyncHandler(getUsers));

router.post(
  '/stylist',
  validateRequest(validateCreateStylist),
  asyncHandler(createStylist)
);

router.put(
  '/:id',
  validateRequest(validateUpdateUser),
  asyncHandler(updateManagedUser)
);

router.delete(
  '/:id',
  validateRequest(validateDeactivateUser),
  asyncHandler(deactivateManagedUser)
);

module.exports = router;
