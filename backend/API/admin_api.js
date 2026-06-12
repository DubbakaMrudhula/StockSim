const User = require('../Models/User_model');
const Transaction = require('../Models/Transaction_model');
const Portfolio = require('../Models/Portfolio_model');
const Watchlist = require('../Models/Watchlist_model');
const Alert = require('../Models/Alert_model');
const WalletTransaction = require('../Models/WalletTransaction_model');

// ─── Dashboard Stats ───────────────────────────────────────────────────────

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalTrades,
      tradeAgg,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isActive: true }),
      Transaction.countDocuments({ status: 'COMPLETED' }),
      Transaction.aggregate([
        { $match: { status: 'COMPLETED' } },
        { $group: { _id: null, totalVolume: { $sum: '$totalAmount' }, avgTrade: { $avg: '$totalAmount' } } },
      ]),
      User.find({ role: 'user' })
        .select('username email walletBalance isActive createdAt lastLogin')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const volume = tradeAgg.length ? tradeAgg[0].totalVolume : 0;
    const avgTrade = tradeAgg.length ? tradeAgg[0].avgTrade : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalTrades,
        totalVolume: parseFloat(volume.toFixed(2)),
        avgTradeSize: parseFloat(avgTrade.toFixed(2)),
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── All Users ──────────────────────────────────────────────────────────────

// @desc    Get all users with search & pagination
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const filter = { role: 'user' };
    if (search.trim()) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Toggle User Active/Inactive ────────────────────────────────────────────

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private/Admin
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot modify admin accounts' });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `User ${user.username} has been ${user.isActive ? 'activated' : 'deactivated'}`,
      data: { _id: user._id, username: user.username, isActive: user.isActive },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Reset User Wallet ──────────────────────────────────────────────────────

// @desc    Reset user wallet to ₹10,000 and clear portfolio
// @route   PUT /api/admin/users/:id/reset-wallet
// @access  Private/Admin
const resetUserWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot modify admin accounts' });
    }

    // Reset wallet
    user.walletBalance = 10000;
    user.totalDeposits = 10000;
    await user.save({ validateBeforeSave: false });

    // Clear portfolio
    await Portfolio.deleteMany({ userId: user._id });

    // Log the reset
    await WalletTransaction.create({
      userId: user._id,
      type: 'ADD',
      amount: 10000,
      description: 'Wallet reset by admin',
      balanceAfter: 10000,
    });

    res.status(200).json({
      success: true,
      message: `Wallet for ${user.username} has been reset to ₹10,000 and portfolio cleared`,
      data: { _id: user._id, username: user.username, walletBalance: user.walletBalance },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete User ─────────────────────────────────────────────────────────────

// @desc    Delete a user and all their data
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin accounts' });
    }

    // Delete all related data
    await Promise.all([
      Portfolio.deleteMany({ userId: user._id }),
      Transaction.deleteMany({ userId: user._id }),
      WalletTransaction.deleteMany({ userId: user._id }),
      Watchlist.deleteMany({ userId: user._id }),
      Alert.deleteMany({ userId: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    res.status(200).json({
      success: true,
      message: `User ${user.username} and all associated data have been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

// ─── All Transactions ────────────────────────────────────────────────────────

// @desc    Get all platform transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
const getAllTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const filter = { status: 'COMPLETED' };
    if (req.query.type) filter.orderType = req.query.type.toUpperCase();
    if (req.query.symbol) filter.stockSymbol = req.query.symbol.toUpperCase();

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('userId', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  toggleUserActive,
  resetUserWallet,
  deleteUser,
  getAllTransactions,
};
