const Portfolio = require('../Models/Portfolio_model');
const User = require('../Models/User_model');
const calculatePortfolio = require('../utils/calculatePortfolio');

// @desc    Get user's portfolio holdings
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res, next) => {
  try {
    const result = await calculatePortfolio(req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get portfolio profit/loss breakdown
// @route   GET /api/portfolio/profit-loss
// @access  Private
const getProfitLoss = async (req, res, next) => {
  try {
    const result = await calculatePortfolio(req.user._id);

    const breakdown = result.holdings.map((h) => ({
      stockSymbol: h.stockSymbol,
      companyName: h.companyName,
      quantity: h.quantity,
      averageBuyPrice: h.averageBuyPrice,
      currentPrice: h.currentPrice,
      investedAmount: h.investedAmount,
      currentValue: h.currentValue,
      profitLoss: h.profitLoss,
      profitLossPercent: h.profitLossPercent,
    }));

    res.status(200).json({
      success: true,
      data: {
        breakdown,
        summary: {
          totalInvested: result.totalInvested,
          currentValue: result.currentValue,
          totalProfitLoss: result.totalProfitLoss,
          totalProfitLossPercent: result.totalProfitLossPercent,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get portfolio summary with ROI
// @route   GET /api/portfolio/summary
// @access  Private
const getPortfolioSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const result = await calculatePortfolio(req.user._id);

    const totalDeposits = user.totalDeposits || 0;
    const roi =
      totalDeposits > 0
        ? parseFloat((((result.currentValue + user.walletBalance - totalDeposits) / totalDeposits) * 100).toFixed(2))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        totalDeposits,
        totalInvested: result.totalInvested,
        currentPortfolioValue: result.currentValue,
        totalAssets: parseFloat((result.currentValue + user.walletBalance).toFixed(2)),
        totalProfitLoss: result.totalProfitLoss,
        totalProfitLossPercent: result.totalProfitLossPercent,
        roi,
        holdingsCount: result.holdings.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolio, getProfitLoss, getPortfolioSummary };
