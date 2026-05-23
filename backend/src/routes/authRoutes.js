const express = require('express');

const {
  getCurrentUser,
  login,
  logout,
  register
} = require('../controllers/authController');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const { validateLogin, validateRegister } = require('../validators/userValidators');

const router = express.Router();

router.post(
  '/register',
  validateRequest(validateRegister),
  asyncHandler(register)
);

router.post(
  '/login',
  validateRequest(validateLogin),
  asyncHandler(login)
);

router.post(
  '/logout',
  logout
);

router.get(
  '/me',
  asyncHandler(requireAuth),
  asyncHandler(getCurrentUser)
);

module.exports = router;
