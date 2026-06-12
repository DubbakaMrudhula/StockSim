const express = require('express');
const router = express.Router();
const { addFunds, withdrawFunds, getBalance, getWalletHistory } = require('../API/wallet_api');
const { protect } = require('../middleware/authMiddleware');

router.post('/add-funds', protect, addFunds);
router.post('/withdraw', protect, withdrawFunds);
router.get('/balance', protect, getBalance);
router.get('/history', protect, getWalletHistory);

module.exports = router;
