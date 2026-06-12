const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../API/watchlist_api');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWatchlist);
router.post('/add', protect, addToWatchlist);
router.delete('/remove', protect, removeFromWatchlist);

module.exports = router;
