const express = require('express');
const router = express.Router();
const { buyStock, sellStock, getTransactionHistory } = require('../API/trade_api');
const { protect } = require('../middleware/authMiddleware');

router.post('/buy', protect, buyStock);
router.post('/sell', protect, sellStock);
router.get('/history', protect, getTransactionHistory);

module.exports = router;
