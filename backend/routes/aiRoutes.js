const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAiAnalysis } = require('../API/ai_api');

// GET /api/ai/analyze/:symbol — AI-powered stock analysis
router.get('/analyze/:symbol', protect, getAiAnalysis);

module.exports = router;
