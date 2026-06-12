const { getStockQuote, getTrendingStocks, searchStocks, getStockHistory } = require('../utils/stockApi');

// @desc    Get trending/popular stocks
// @route   GET /api/stocks
// @access  Public
const getTrending = async (req, res, next) => {
  try {
    const stocks = await getTrendingStocks();
    res.status(200).json({ success: true, count: stocks.length, data: stocks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stock details by symbol
// @route   GET /api/stocks/:symbol
// @access  Public
const getStockDetails = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const stock = await getStockQuote(symbol.toUpperCase());

    if (!stock) {
      return res.status(404).json({ success: false, message: `Stock symbol '${symbol}' not found` });
    }

    res.status(200).json({ success: true, data: stock });
  } catch (error) {
    next(error);
  }
};

// @desc    Get historical price data
// @route   GET /api/stocks/history/:symbol
// @access  Public
const getHistory = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { resolution = 'D', from, to } = req.query;

    const history = await getStockHistory(
      symbol.toUpperCase(),
      resolution,
      from ? parseInt(from) : undefined,
      to ? parseInt(to) : undefined
    );

    if (!history.length) {
      return res.status(404).json({ success: false, message: 'No historical data found' });
    }

    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

// @desc    Search stocks by query
// @route   GET /api/stocks/search
// @access  Public
const searchStock = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const results = await searchStocks(q.trim());
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get multiple stock quotes at once
// @route   POST /api/stocks/batch
// @access  Public
const getBatchQuotes = async (req, res, next) => {
  try {
    const { symbols } = req.body;
    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ success: false, message: 'Provide an array of symbols' });
    }

    const quotes = await Promise.all(
      symbols.slice(0, 20).map((s) => getStockQuote(s.toUpperCase()))
    );

    res.status(200).json({
      success: true,
      data: quotes.filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTrending, getStockDetails, getHistory, searchStock, getBatchQuotes };
