const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getStockQuote, getStockHistory } = require('../utils/stockApi');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Technical Indicator Helpers ───────────────────────────────────────────

const calcSMA = (prices, period) => {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return parseFloat((slice.reduce((a, b) => a + b, 0) / period).toFixed(2));
};

const calcRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return parseFloat((100 - 100 / (1 + rs)).toFixed(2));
};

const calcVolatility = (prices) => {
  if (prices.length < 2) return null;
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, r) => a + Math.pow(r - mean, 2), 0) / returns.length;
  return parseFloat((Math.sqrt(variance) * 100).toFixed(2)); // as percentage
};

const calcMomentum = (prices, period = 5) => {
  if (prices.length < period + 1) return null;
  const current = prices[prices.length - 1];
  const past = prices[prices.length - 1 - period];
  return parseFloat(((current - past) / past * 100).toFixed(2));
};

// ─── Main AI Analysis Handler ──────────────────────────────────────────────

// @desc    Get AI-powered stock analysis
// @route   GET /api/ai/analyze/:symbol
// @access  Private
const getAiAnalysis = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const sym = symbol.toUpperCase();

    // 1. Fetch current quote & history in parallel
    const [quote, history] = await Promise.all([
      getStockQuote(sym),
      getStockHistory(sym, 'D'),
    ]);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: `Stock symbol '${sym}' not found`,
      });
    }

    // 2. Compute technical indicators
    const closingPrices = history.map((h) => h.close);
    const sma7 = calcSMA(closingPrices, 7);
    const sma20 = calcSMA(closingPrices, 20);
    const rsi = calcRSI(closingPrices, 14);
    const volatility = calcVolatility(closingPrices);
    const momentum5d = calcMomentum(closingPrices, 5);
    const momentum10d = calcMomentum(closingPrices, 10);
    const highestHigh = Math.max(...history.map((h) => h.high));
    const lowestLow = Math.min(...history.map((h) => h.low));
    const avgVolume = history.length
      ? Math.round(history.reduce((a, h) => a + (h.volume || 0), 0) / history.length)
      : 0;

    // Recent price trend (last 5 days)
    const recentPrices = closingPrices.slice(-5);
    const priceDirection = recentPrices.length >= 2
      ? recentPrices[recentPrices.length - 1] > recentPrices[0] ? 'upward' : 'downward'
      : 'neutral';

    // 3. Build structured prompt
    const prompt = `You are an expert stock market analyst. Analyze the following stock data and provide an investment recommendation.

STOCK: ${sym} (${quote.companyName})

CURRENT DATA:
- Current Price: ₹${quote.price}
- Today's Change: ${quote.change >= 0 ? '+' : ''}${quote.change} (${quote.changePercent}%)
- Open: ₹${quote.open || 'N/A'}
- High: ₹${quote.high || 'N/A'}
- Low: ₹${quote.low || 'N/A'}
- Previous Close: ₹${quote.previousClose || 'N/A'}

TECHNICAL INDICATORS (30-day window):
- 7-Day SMA: ${sma7 !== null ? '₹' + sma7 : 'N/A'}
- 20-Day SMA: ${sma20 !== null ? '₹' + sma20 : 'N/A'}
- RSI (14-period): ${rsi !== null ? rsi : 'N/A'}
- Volatility (Std Dev of Daily Returns): ${volatility !== null ? volatility + '%' : 'N/A'}
- 5-Day Momentum: ${momentum5d !== null ? momentum5d + '%' : 'N/A'}
- 10-Day Momentum: ${momentum10d !== null ? momentum10d + '%' : 'N/A'}
- 30-Day High: ₹${highestHigh}
- 30-Day Low: ₹${lowestLow}
- Average Volume: ${avgVolume.toLocaleString()}
- Recent Price Trend: ${priceDirection}

RECENT CLOSING PRICES (last 10 days, oldest to newest):
${closingPrices.slice(-10).map((p, i) => `Day ${i + 1}: ₹${p}`).join('\n')}

Based on this data, provide your analysis in the following EXACT JSON format (no markdown, no code blocks, just raw JSON):
{
  "recommendation": "BUY" or "SELL" or "HOLD",
  "confidence": <number between 1 and 100>,
  "risk": "LOW" or "MEDIUM" or "HIGH",
  "reasons": ["reason 1", "reason 2", "reason 3", "reason 4"],
  "summary": "A 2-3 sentence summary of the overall analysis and outlook."
}

Important:
- Base your recommendation purely on the technical data provided.
- Give exactly 4 concise reasons.
- Be specific with numbers in your reasons (e.g., "RSI at 72 indicates overbought conditions").
- The confidence should reflect how strong the signals are.`;

    // 4. Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. Parse JSON from response (handle potential markdown wrapping)
    let analysis;
    try {
      // Strip markdown code fences if present
      const cleaned = responseText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();
      analysis = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText);
      return res.status(500).json({
        success: false,
        message: 'AI returned an invalid response. Please try again.',
      });
    }

    // 6. Validate and normalize
    const validRecs = ['BUY', 'SELL', 'HOLD'];
    const validRisks = ['LOW', 'MEDIUM', 'HIGH'];

    analysis.recommendation = validRecs.includes(analysis.recommendation?.toUpperCase())
      ? analysis.recommendation.toUpperCase()
      : 'HOLD';
    analysis.risk = validRisks.includes(analysis.risk?.toUpperCase())
      ? analysis.risk.toUpperCase()
      : 'MEDIUM';
    analysis.confidence = Math.min(100, Math.max(1, Number(analysis.confidence) || 50));
    analysis.reasons = Array.isArray(analysis.reasons) ? analysis.reasons.slice(0, 4) : [];
    analysis.summary = analysis.summary || 'Analysis completed.';

    // 7. Return enriched response
    res.status(200).json({
      success: true,
      data: {
        symbol: sym,
        companyName: quote.companyName,
        currentPrice: quote.price,
        analysis,
        indicators: {
          sma7,
          sma20,
          rsi,
          volatility,
          momentum5d,
          momentum10d,
          highestHigh,
          lowestLow,
          priceDirection,
        },
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('AI Analysis error:', error.message);
    next(error);
  }
};

module.exports = { getAiAnalysis };
