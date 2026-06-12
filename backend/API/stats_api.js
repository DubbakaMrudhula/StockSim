const User = require('../Models/User_model');
const Transaction = require('../Models/Transaction_model');
const { MOCK_STOCKS } = require('../utils/stockApi');

// @desc    Get public platform stats (no auth required)
// @route   GET /api/stats
// @access  Public
const getPlatformStats = async (req, res, next) => {
  try {
    const [userCount, tradeCount] = await Promise.all([
      User.countDocuments({ role: 'user', isActive: true }),
      Transaction.countDocuments({ status: 'COMPLETED' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        traders: userCount,
        trades: tradeCount,
        stocks: MOCK_STOCKS.length,
        startingCapital: 10000,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlatformStats };
