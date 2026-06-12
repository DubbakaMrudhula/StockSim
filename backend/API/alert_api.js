const Alert = require('../Models/Alert_model');
const { getStockQuote } = require('../utils/stockApi');


const createAlert = async (req, res, next) => {
  try {
    const stockSymbol = req.body.stockSymbol || req.body.symbol;
    const { targetPrice, condition } = req.body;

    if (!stockSymbol || !targetPrice || !condition) {
      return res.status(400).json({ success: false, message: 'stockSymbol, targetPrice and condition are required' });
    }

    if (!['ABOVE', 'BELOW'].includes(condition.toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Condition must be ABOVE or BELOW' });
    }

    const symbol = stockSymbol.toUpperCase();
    const quote = await getStockQuote(symbol);
    if (!quote) {
      return res.status(404).json({ success: false, message: `Stock '${symbol}' not found` });
    }

    // Check for duplicate active alert
    const existing = await Alert.findOne({
      userId: req.user._id,
      stockSymbol: symbol,
      targetPrice: parseFloat(targetPrice),
      condition: condition.toUpperCase(),
      isActive: true,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Similar active alert already exists' });
    }

    const alert = await Alert.create({
      userId: req.user._id,
      stockSymbol: symbol,
      companyName: quote.companyName,
      targetPrice: parseFloat(targetPrice),
      condition: condition.toUpperCase(),
    });

    res.status(201).json({
      success: true,
      message: `Alert created: notify when ${symbol} goes ${condition.toUpperCase()} ₹${targetPrice}`,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    }

    const alerts = await Alert.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an alert
// @route   DELETE /api/alerts/delete/:id
// @access  Private
const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOne({ _id: req.params.id, userId: req.user._id });

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    await Alert.deleteOne({ _id: alert._id });

    res.status(200).json({ success: true, message: 'Alert deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Check & trigger alerts (called by socket service)
const checkAndTriggerAlerts = async (io) => {
  try {
    const activeAlerts = await Alert.find({ isActive: true, isTriggered: false });

    for (const alert of activeAlerts) {
      const quote = await getStockQuote(alert.stockSymbol);
      if (!quote) continue;

      const triggered =
        (alert.condition === 'ABOVE' && quote.price >= alert.targetPrice) ||
        (alert.condition === 'BELOW' && quote.price <= alert.targetPrice);

      if (triggered) {
        alert.isTriggered = true;
        alert.isActive = false;
        alert.triggeredAt = new Date();
        await alert.save();

        if (io) {
          io.to(alert.userId.toString()).emit('alertTriggered', {
            stockSymbol: alert.stockSymbol,
            companyName: alert.companyName,
            targetPrice: alert.targetPrice,
            currentPrice: quote.price,
            condition: alert.condition,
            message: ` ${alert.stockSymbol} hit ₹${quote.price} (target: ${alert.condition} ₹${alert.targetPrice})`,
          });
        }
      }
    }
  } catch (error) {
    console.error('Alert check error:', error.message);
  }
};

module.exports = { createAlert, getAlerts, deleteAlert, checkAndTriggerAlerts };
