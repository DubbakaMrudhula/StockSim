const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
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
      default: '',
    },
    targetPrice: {
      type: Number,
      required: true,
      min: [0, 'Target price must be positive'],
    },
    condition: {
      type: String,
      enum: ['ABOVE', 'BELOW'],
      required: true,
    },
    isTriggered: {
      type: Boolean,
      default: false,
    },
    triggeredAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Alert', alertSchema);
