const User = require('../Models/User_model');
const Portfolio = require('../Models/Portfolio_model');
const Transaction = require('../Models/Transaction_model');
const WalletTransaction = require('../Models/WalletTransaction_model');
const { getStockQuote } = require('../utils/stockApi');

// @desc    Buy stock
// @route   POST /api/trade/buy
// @access  Private
const buyStock = async (req, res, next) => {
  try {
    const stockSymbol = req.body.stockSymbol || req.body.symbol;
    const { quantity } = req.body;

    if (!stockSymbol || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide stockSymbol and valid quantity' });
    }

    const qty = parseInt(quantity);

    // 1. Fetch live stock price
    const stockData = await getStockQuote(stockSymbol.toUpperCase());
    if (!stockData) {
      return res.status(404).json({ success: false, message: `Stock symbol '${stockSymbol}' not found` });
    }

    const price = stockData.price;
    const totalCost = parseFloat((price * qty).toFixed(2));

    // 2. Check wallet balance
    const user = await User.findById(req.user._id);
    if (user.walletBalance < totalCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Required: ₹${totalCost.toFixed(2)}, Available: ₹${user.walletBalance.toFixed(2)}`,
      });
    }

    // 3. Deduct from wallet
    user.walletBalance = parseFloat((user.walletBalance - totalCost).toFixed(2));
    await user.save({ validateBeforeSave: false });

    // 4. Update portfolio (upsert)
    const existing = await Portfolio.findOne({ userId: req.user._id, stockSymbol: stockSymbol.toUpperCase() });

    if (existing) {
      const newQty = existing.quantity + qty;
      const newInvested = parseFloat((existing.investedAmount + totalCost).toFixed(2));
      existing.quantity = newQty;
      existing.investedAmount = newInvested;
      existing.averageBuyPrice = parseFloat((newInvested / newQty).toFixed(2));
      await existing.save();
    } else {
      await Portfolio.create({
        userId: req.user._id,
        stockSymbol: stockSymbol.toUpperCase(),
        companyName: stockData.companyName,
        quantity: qty,
        averageBuyPrice: price,
        investedAmount: totalCost,
      });
    }

    // 5. Save transaction record
    await Transaction.create({
      userId: req.user._id,
      stockSymbol: stockSymbol.toUpperCase(),
      companyName: stockData.companyName,
      orderType: 'BUY',
      quantity: qty,
      price,
      totalAmount: totalCost,
      status: 'COMPLETED',
    });

    // 6. Log wallet transaction
    await WalletTransaction.create({
      userId: req.user._id,
      type: 'BUY',
      amount: totalCost,
      description: `Bought ${qty} shares of ${stockSymbol.toUpperCase()} @ ₹${price}`,
      balanceAfter: user.walletBalance,
    });

    res.status(200).json({
      success: true,
      message: `Successfully bought ${qty} shares of ${stockSymbol.toUpperCase()}`,
      data: {
        stockSymbol: stockSymbol.toUpperCase(),
        companyName: stockData.companyName,
        quantity: qty,
        price,
        totalCost,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};


const sellStock = async (req, res, next) => {
  try {
    const stockSymbol = req.body.stockSymbol || req.body.symbol;
    const { quantity } = req.body;

    if (!stockSymbol || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide stockSymbol and valid quantity' });
    }

    const qty = parseInt(quantity);

    // 1. Verify ownership
    const holding = await Portfolio.findOne({
      userId: req.user._id,
      stockSymbol: stockSymbol.toUpperCase(),
    });

    if (!holding || holding.quantity < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient shares. You own ${holding ? holding.quantity : 0} shares of ${stockSymbol.toUpperCase()}`,
      });
    }

    // 2. Fetch current price
    const stockData = await getStockQuote(stockSymbol.toUpperCase());
    if (!stockData) {
      return res.status(404).json({ success: false, message: `Stock symbol '${stockSymbol}' not found` });
    }

    const price = stockData.price;
    const totalRevenue = parseFloat((price * qty).toFixed(2));

    // 3. Credit wallet
    const user = await User.findById(req.user._id);
    user.walletBalance = parseFloat((user.walletBalance + totalRevenue).toFixed(2));
    await user.save({ validateBeforeSave: false });

    // 4. Update or remove portfolio
    const soldValue = parseFloat(((holding.investedAmount / holding.quantity) * qty).toFixed(2));

    if (holding.quantity === qty) {
      await Portfolio.deleteOne({ _id: holding._id });
    } else {
      holding.quantity -= qty;
      holding.investedAmount = parseFloat((holding.investedAmount - soldValue).toFixed(2));
      await holding.save();
    }

    // 5. Save transaction
    await Transaction.create({
      userId: req.user._id,
      stockSymbol: stockSymbol.toUpperCase(),
      companyName: stockData.companyName,
      orderType: 'SELL',
      quantity: qty,
      price,
      totalAmount: totalRevenue,
      status: 'COMPLETED',
    });

    // 6. Log wallet transaction
    await WalletTransaction.create({
      userId: req.user._id,
      type: 'SELL',
      amount: totalRevenue,
      description: `Sold ${qty} shares of ${stockSymbol.toUpperCase()} @ ₹${price}`,
      balanceAfter: user.walletBalance,
    });

    const profitLoss = parseFloat((totalRevenue - soldValue).toFixed(2));

    res.status(200).json({
      success: true,
      message: `Successfully sold ${qty} shares of ${stockSymbol.toUpperCase()}`,
      data: {
        stockSymbol: stockSymbol.toUpperCase(),
        companyName: stockData.companyName,
        quantity: qty,
        price,
        totalRevenue,
        profitLoss,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction history
// @route   GET /api/trade/history
// @access  Private
const getTransactionHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };
    if (req.query.type) filter.orderType = req.query.type.toUpperCase();
    if (req.query.symbol) filter.stockSymbol = req.query.symbol.toUpperCase();

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
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

module.exports = { buyStock, sellStock, getTransactionHistory };
