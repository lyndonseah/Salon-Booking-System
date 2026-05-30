const express = require('express');

const { getStylists } = require('../controllers/stylistController');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(asyncHandler(requireAuth));

router.get('/', asyncHandler(getStylists));

module.exports = router;
