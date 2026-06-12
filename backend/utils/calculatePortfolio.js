const Portfolio = require('../Models/Portfolio_model');
const { getStockQuote } = require('./stockApi');

// Calculate current portfolio value and P&L for a user
const calculatePortfolio = async (userId) => {
  try {
    const holdings = await Portfolio.find({ userId });

    if (!holdings.length) {
      return {
        holdings: [],
        totalInvested: 0,
        currentValue: 0,
        totalProfitLoss: 0,
        totalProfitLossPercent: 0,
      };
    }

    let totalInvested = 0;
    let currentValue = 0;

    const enrichedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        const quote = await getStockQuote(holding.stockSymbol);
        const currentPrice = quote ? quote.price : holding.averageBuyPrice;
        const currentStockValue = currentPrice * holding.quantity;
        const profitLoss = currentStockValue - holding.investedAmount;
        const profitLossPercent =
          holding.investedAmount > 0
            ? ((profitLoss / holding.investedAmount) * 100).toFixed(2)
            : 0;

        totalInvested += holding.investedAmount;
        currentValue += currentStockValue;

        return {
          _id: holding._id,
          stockSymbol: holding.stockSymbol,
          companyName: holding.companyName,
          quantity: holding.quantity,
          averageBuyPrice: holding.averageBuyPrice,
          investedAmount: holding.investedAmount,
          currentPrice,
          currentValue: parseFloat(currentStockValue.toFixed(2)),
          profitLoss: parseFloat(profitLoss.toFixed(2)),
          profitLossPercent: parseFloat(profitLossPercent),
          dayChange: quote ? quote.changePercent : 0,
        };
      })
    );

    const totalProfitLoss = currentValue - totalInvested;
    const totalProfitLossPercent =
      totalInvested > 0
        ? parseFloat(((totalProfitLoss / totalInvested) * 100).toFixed(2))
        : 0;

    return {
      holdings: enrichedHoldings,
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      currentValue: parseFloat(currentValue.toFixed(2)),
      totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
      totalProfitLossPercent,
    };
  } catch (error) {
    console.error('Portfolio calculation error:', error.message);
    throw error;
  }
};

module.exports = calculatePortfolio;
