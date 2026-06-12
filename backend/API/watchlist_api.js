const Watchlist = require('../Models/Watchlist_model');
const { getStockQuote } = require('../utils/stockApi');

// @desc    Get user watchlist with live prices
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res, next) => {
  try {
    let watchlist = await Watchlist.findOne({ userId: req.user._id });

    if (!watchlist) {
      return res.status(200).json({ success: true, data: { stocks: [] } });
    }

    // Enrich with live prices
    const enriched = await Promise.all(
      watchlist.stocks.map(async (s) => {
        const quote = await getStockQuote(s.symbol);
        return {
          symbol: s.symbol,
          companyName: s.companyName || (quote ? quote.companyName : s.symbol),
          addedAt: s.addedAt,
          price: quote ? quote.price : null,
          change: quote ? quote.change : null,
          changePercent: quote ? quote.changePercent : null,
        };
      })
    );

    res.status(200).json({ success: true, data: { stocks: enriched } });
  } catch (error) {
    next(error);
  }
};

// @desc    Add stock to watchlist
// @route   POST /api/watchlist/add
// @access  Private
const addToWatchlist = async (req, res, next) => {
  try {
    const stockSymbol = req.body.stockSymbol || req.body.symbol;
    if (!stockSymbol) {
      return res.status(400).json({ success: false, message: 'stockSymbol is required' });
    }

    const symbol = stockSymbol.toUpperCase();

    // Validate stock exists
    const quote = await getStockQuote(symbol);
    if (!quote) {
      return res.status(404).json({ success: false, message: `Stock '${symbol}' not found` });
    }

    let watchlist = await Watchlist.findOne({ userId: req.user._id });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        userId: req.user._id,
        stocks: [{ symbol, companyName: quote.companyName }],
      });
    } else {
      const alreadyAdded = watchlist.stocks.some((s) => s.symbol === symbol);
      if (alreadyAdded) {
        return res.status(400).json({ success: false, message: `${symbol} is already in your watchlist` });
      }

      if (watchlist.stocks.length >= 50) {
        return res.status(400).json({ success: false, message: 'Watchlist limit of 50 stocks reached' });
      }

      watchlist.stocks.push({ symbol, companyName: quote.companyName });
      await watchlist.save();
    }

    res.status(200).json({
      success: true,
      message: `${symbol} added to watchlist`,
      data: { symbol, companyName: quote.companyName },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/remove
// @access  Private
const removeFromWatchlist = async (req, res, next) => {
  try {
    const stockSymbol = req.body.stockSymbol || req.body.symbol;
    if (!stockSymbol) {
      return res.status(400).json({ success: false, message: 'stockSymbol is required' });
    }

    const symbol = stockSymbol.toUpperCase();
    const watchlist = await Watchlist.findOne({ userId: req.user._id });

    if (!watchlist) {
      return res.status(404).json({ success: false, message: 'Watchlist not found' });
    }

    const beforeLen = watchlist.stocks.length;
    watchlist.stocks = watchlist.stocks.filter((s) => s.symbol !== symbol);

    if (watchlist.stocks.length === beforeLen) {
      return res.status(404).json({ success: false, message: `${symbol} not found in watchlist` });
    }

    await watchlist.save();

    res.status(200).json({ success: true, message: `${symbol} removed from watchlist` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
