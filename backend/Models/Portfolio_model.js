const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stockSymbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    averageBuyPrice: {
      type: Number,
      required: true,
      min: [0, 'Average buy price cannot be negative'],
    },
    investedAmount: {
      type: Number,
      required: true,
      min: [0, 'Invested amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: one entry per user per stock
portfolioSchema.index({ userId: 1, stockSymbol: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
