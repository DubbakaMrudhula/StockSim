const express = require('express');
const router = express.Router();
const { getTrending, getStockDetails, getHistory, searchStock, getBatchQuotes } = require('../API/stock_api');

// Note: /search and /batch must come BEFORE /:symbol to avoid route conflicts
router.get('/search', searchStock);
router.post('/batch', getBatchQuotes);
router.get('/history/:symbol', getHistory);
router.get('/:symbol', getStockDetails);
router.get('/', getTrending);

module.exports = router;
