const User = require('../Models/User_model');
const WalletTransaction = require('../Models/WalletTransaction_model');

// @desc    Add funds to wallet
// @route   POST /api/wallet/add-funds
// @access  Private
const addFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid amount greater than 0' });
    }

    if (amount > 1000000) {
      return res.status(400).json({ success: false, message: 'Maximum single deposit is ₹10,00,000' });
    }

    const user = await User.findById(req.user._id);
    user.walletBalance = parseFloat((user.walletBalance + parseFloat(amount)).toFixed(2));
    user.totalDeposits = parseFloat((user.totalDeposits + parseFloat(amount)).toFixed(2));
    await user.save({ validateBeforeSave: false });

    await WalletTransaction.create({
      userId: req.user._id,
      type: 'ADD',
      amount: parseFloat(amount),
      description: `Added ₹${amount} to wallet`,
      balanceAfter: user.walletBalance,
    });

    res.status(200).json({
      success: true,
      message: `₹${amount} added to your wallet successfully`,
      data: {
        walletBalance: user.walletBalance,
        totalDeposits: user.totalDeposits,
        amountAdded: parseFloat(amount),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw funds from wallet
// @route   POST /api/wallet/withdraw
// @access  Private
const withdrawFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid amount greater than 0' });
    }

    const user = await User.findById(req.user._id);

    if (user.walletBalance < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ₹${user.walletBalance.toFixed(2)}`,
      });
    }

    user.walletBalance = parseFloat((user.walletBalance - parseFloat(amount)).toFixed(2));
    await user.save({ validateBeforeSave: false });

    await WalletTransaction.create({
      userId: req.user._id,
      type: 'WITHDRAW',
      amount: parseFloat(amount),
      description: `Withdrew ₹${amount} from wallet`,
      balanceAfter: user.walletBalance,
    });

    res.status(200).json({
      success: true,
      message: `₹${amount} withdrawn successfully`,
      data: {
        walletBalance: user.walletBalance,
        amountWithdrawn: parseFloat(amount),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
const getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        totalDeposits: user.totalDeposits,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get wallet transaction history
// @route   GET /api/wallet/history
// @access  Private
const getWalletHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };
    if (req.query.type) filter.type = req.query.type.toUpperCase();

    const [transactions, total] = await Promise.all([
      WalletTransaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      WalletTransaction.countDocuments(filter),
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

module.exports = { addFunds, withdrawFunds, getBalance, getWalletHistory };
