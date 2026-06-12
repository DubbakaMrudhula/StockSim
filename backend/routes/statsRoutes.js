const express = require('express');
const router = express.Router();
const { getPlatformStats } = require('../API/stats_api');

// GET /api/stats — public, no auth needed
router.get('/', getPlatformStats);

module.exports = router;
