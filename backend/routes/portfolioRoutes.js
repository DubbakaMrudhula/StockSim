const express = require('express');
const router = express.Router();
const { getPortfolio, getProfitLoss, getPortfolioSummary } = require('../API/portfolio_api');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPortfolio);
router.get('/profit-loss', protect, getProfitLoss);
router.get('/summary', protect, getPortfolioSummary);

module.exports = router;
