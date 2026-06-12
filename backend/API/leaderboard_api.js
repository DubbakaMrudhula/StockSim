const User = require('../Models/User_model');
const Portfolio = require('../Models/Portfolio_model');
const { getStockQuote } = require('../utils/stockApi');

// @desc    Get leaderboard rankings
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get all users (excluding admins)
    const users = await User.find({ role: 'user', isActive: true })
      .select('username walletBalance totalDeposits createdAt')
      .lean();

    // Calculate portfolio value for each user
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const holdings = await Portfolio.find({ userId: user._id }).lean();

        let portfolioValue = 0;
        for (const h of holdings) {
          const quote = await getStockQuote(h.stockSymbol);
          portfolioValue += quote ? quote.price * h.quantity : h.investedAmount;
        }

        const totalAssets = parseFloat((portfolioValue + user.walletBalance).toFixed(2));
        const totalDeposits = user.totalDeposits || 0;

        const roi =
          totalDeposits > 0
            ? parseFloat((((totalAssets - totalDeposits) / totalDeposits) * 100).toFixed(2))
            : 0;

        const profitLoss = parseFloat((totalAssets - totalDeposits).toFixed(2));

        return {
          userId: user._id,
          username: user.username,
          walletBalance: user.walletBalance,
          portfolioValue: parseFloat(portfolioValue.toFixed(2)),
          totalAssets,
          totalDeposits,
          profitLoss,
          roi,
          holdingsCount: holdings.length,
          memberSince: user.createdAt,
        };
      })
    );

    // Sort by ROI descending
    leaderboardData.sort((a, b) => b.roi - a.roi);

    // Add rank
    const ranked = leaderboardData.slice(0, limit).map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    // Find current user's rank if authenticated
    let myRank = null;
    if (req.user) {
      const myIndex = leaderboardData.findIndex(
        (e) => e.userId.toString() === req.user._id.toString()
      );
      if (myIndex !== -1) {
        myRank = { rank: myIndex + 1, ...leaderboardData[myIndex] };
      }
    }

    res.status(200).json({
      success: true,
      count: ranked.length,
      data: ranked,
      ...(myRank && { myRank }),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaderboard };
