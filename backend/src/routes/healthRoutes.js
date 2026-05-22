const express = require('express');

const { getHealth } = require('../controllers/healthController');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(getHealth));

module.exports = router;
