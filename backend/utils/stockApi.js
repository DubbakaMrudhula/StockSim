const axios = require('axios');

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINNHUB_API_KEY;

// Fallback mock data when API key is not set
const MOCK_STOCKS = [
 { symbol: 'AAPL', companyName: 'Apple Inc.', price: 189.3, change: 2.45, changePercent: 1.31, high: 191.2, low: 186.5, volume: 55234567 },
 { symbol: 'GOOGL', companyName: 'Alphabet Inc.', price: 175.8, change: -1.2, changePercent: -0.68, high: 177.5, low: 174.2, volume: 23456789 },
 { symbol: 'MSFT', companyName: 'Microsoft Corp.', price: 415.6, change: 5.3, changePercent: 1.29, high: 417.8, low: 410.1, volume: 32145678 },
 { symbol: 'TSLA', companyName: 'Tesla Inc.', price: 248.5, change: -8.7, changePercent: -3.38, high: 260.0, low: 245.2, volume: 98765432 },
 { symbol: 'AMZN', companyName: 'Amazon.com Inc.', price: 192.4, change: 3.1, changePercent: 1.64, high: 194.5, low: 189.8, volume: 45678901 },
 { symbol: 'NVDA', companyName: 'NVIDIA Corp.', price: 875.4, change: 22.5, changePercent: 2.64, high: 880.0, low: 852.3, volume: 67890123 },
 { symbol: 'META', companyName: 'Meta Platforms Inc.', price: 512.3, change: 7.8, changePercent: 1.55, high: 515.6, low: 505.2, volume: 28901234 },
 { symbol: 'NFLX', companyName: 'Netflix Inc.', price: 680.9, change: -3.4, changePercent: -0.50, high: 686.5, low: 677.2, volume: 12345678 },
 { symbol: 'AMD', companyName: 'Advanced Micro Devices', price: 165.7, change: 4.2, changePercent: 2.60, high: 167.8, low: 161.3, volume: 34567890 },
 { symbol: 'DIS', companyName: 'Walt Disney Co.', price: 112.5, change: -1.5, changePercent: -1.32, high: 114.8, low: 111.2, volume: 19876543 },
];

// Add small random fluctuation to simulate live prices
const addFluctuation = (price, pct = 0.02) => {
 const fluctuation = (Math.random() - 0.5) * pct * price;
 return parseFloat((price + fluctuation).toFixed(2));
};

// In-memory caches to avoid rate-limiting (Finnhub API free tier limit is 60 requests/minute)
const profileCache = new Map();
const quoteCache = new Map();
const QUOTE_CACHE_TTL = 30000; // 30 seconds cache

// Pre-populate profile cache with MOCK_STOCKS data to avoid fetching profile2 for popular stocks
MOCK_STOCKS.forEach((stock) => {
 profileCache.set(stock.symbol.toUpperCase(), {
 name: stock.companyName,
 shareOutstanding: stock.volume,
 });
});

// Cache for rate-limited error logging
const errorLogTracker = new Map();
const LOG_THROTTLE_MS = 60000; // Log error at most once per minute per stock symbol

const logThrottledError = (symbol, message) => {
 const now = Date.now();
 const lastLog = errorLogTracker.get(symbol) || 0;
 if (now - lastLog > LOG_THROTTLE_MS) {
 console.error(`Stock API Error for ${symbol}: ${message}`);
 console.log(` Falling back to mock data (or cached data) for ${symbol} due to API error.`);
 errorLogTracker.set(symbol, now);
 }
};

const getStockQuote = async (symbol) => {
 const sym = symbol.toUpperCase();
 try {
 if (!API_KEY || API_KEY === 'your_finnhub_api_key') {
 const mock = MOCK_STOCKS.find((s) => s.symbol === sym);
 if (mock) {
 return {
 symbol: mock.symbol,
 companyName: mock.companyName,
 price: addFluctuation(mock.price),
 change: mock.change,
 changePercent: mock.changePercent,
 high: mock.high,
 low: mock.low,
 volume: mock.volume,
 };
 }
 return null;
 }

 // 1. Get profile details from cache, otherwise fetch
 let profile = profileCache.get(sym);
 if (!profile) {
 try {
 const profileRes = await axios.get(`${FINNHUB_BASE_URL}/stock/profile2`, {
 params: { symbol: sym, token: API_KEY },
 });
 if (profileRes.data && profileRes.data.name) {
 profile = {
 name: profileRes.data.name,
 shareOutstanding: profileRes.data.shareOutstanding || 0,
 };
 profileCache.set(sym, profile);
 }
 } catch (err) {
 profile = { name: sym, shareOutstanding: 0 };
 }
 }
 if (!profile) {
 profile = { name: sym, shareOutstanding: 0 };
 }

 // 2. Check if a valid cached quote exists
 const cachedEntry = quoteCache.get(sym);
 const now = Date.now();
 let quoteData;

 if (cachedEntry && now - cachedEntry.timestamp < QUOTE_CACHE_TTL) {
 quoteData = cachedEntry.quote;
 
 // Serve from cache but add a micro-fluctuation (+/- 0.05%) to make price look live
 const fluctuatedPrice = addFluctuation(quoteData.c, 0.001);
 const change = parseFloat((fluctuatedPrice - quoteData.pc).toFixed(2));
 const changePercent = parseFloat((((fluctuatedPrice - quoteData.pc) / quoteData.pc) * 100).toFixed(2));

 return {
 symbol: sym,
 companyName: profile.name,
 price: fluctuatedPrice,
 change,
 changePercent,
 high: quoteData.h,
 low: quoteData.l,
 open: quoteData.o,
 previousClose: quoteData.pc,
 volume: profile.shareOutstanding,
 isCached: true,
 };
 }

 // 3. Fetch fresh quote from API
 const quoteRes = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
 params: { symbol: sym, token: API_KEY },
 });

 const quote = quoteRes.data;

 if (!quote || quote.c === 0 || quote.c === null) {
 if (cachedEntry) {
 quoteData = cachedEntry.quote;
 } else {
 throw new Error(`Invalid response for symbol ${sym}`);
 }
 } else {
 quoteData = quote;
 quoteCache.set(sym, {
 quote: quoteData,
 timestamp: now,
 });
 }

 const price = quoteData.c;
 const change = parseFloat((price - quoteData.pc).toFixed(2));
 const changePercent = parseFloat((((price - quoteData.pc) / quoteData.pc) * 100).toFixed(2));

 return {
 symbol: sym,
 companyName: profile.name,
 price,
 change,
 changePercent,
 high: quoteData.h,
 low: quoteData.l,
 open: quoteData.o,
 previousClose: quoteData.pc,
 volume: profile.shareOutstanding,
 };
 } catch (error) {
 logThrottledError(sym, error.message);

 // Try fallback to expired cache entry
 const cachedEntry = quoteCache.get(sym);
 let profile = profileCache.get(sym) || { name: sym, shareOutstanding: 0 };
 if (cachedEntry) {
 const quoteData = cachedEntry.quote;
 const fluctuatedPrice = addFluctuation(quoteData.c, 0.001);
 return {
 symbol: sym,
 companyName: profile.name,
 price: fluctuatedPrice,
 change: parseFloat((fluctuatedPrice - quoteData.pc).toFixed(2)),
 changePercent: parseFloat((((fluctuatedPrice - quoteData.pc) / quoteData.pc) * 100).toFixed(2)),
 high: quoteData.h,
 low: quoteData.l,
 open: quoteData.o,
 previousClose: quoteData.pc,
 volume: profile.shareOutstanding,
 };
 }

 // Fallback to mock data
 const mock = MOCK_STOCKS.find((s) => s.symbol === sym);
 if (mock) {
 return {
 symbol: mock.symbol,
 companyName: mock.companyName,
 price: addFluctuation(mock.price),
 change: mock.change,
 changePercent: mock.changePercent,
 high: mock.high,
 low: mock.low,
 volume: mock.volume,
 };
 }
 return null;
 }
};

const getTrendingStocks = async () => {
 try {
 if (!API_KEY || API_KEY === 'your_finnhub_api_key') {
 return MOCK_STOCKS.map((s) => ({
 ...s,
 price: addFluctuation(s.price),
 }));
 }

 const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX', 'AMD', 'DIS'];
 const quotes = [];
 for (const s of symbols) {
 quotes.push(await getStockQuote(s));
 // small delay to avoid socket disconnects from too many concurrent requests
 await new Promise(resolve => setTimeout(resolve, 50));
 }
 const validQuotes = quotes.filter(Boolean);
 if (validQuotes.length === 0) {
 return MOCK_STOCKS.map((s) => ({
 ...s,
 price: addFluctuation(s.price),
 }));
 }
 return validQuotes;
 } catch (error) {
 console.error('Trending stocks error:', error.message);
 return MOCK_STOCKS.map((s) => ({
 ...s,
 price: addFluctuation(s.price),
 }));
 }
};

const searchStocks = async (query) => {
 try {
 if (!API_KEY || API_KEY === 'your_finnhub_api_key') {
 const q = query.toLowerCase();
 return MOCK_STOCKS.filter(
 (s) =>
 s.symbol.toLowerCase().includes(q) ||
 s.companyName.toLowerCase().includes(q)
 ).map((s) => ({ symbol: s.symbol, description: s.companyName, type: 'Common Stock' }));
 }

 const res = await axios.get(`${FINNHUB_BASE_URL}/search`, {
 params: { q: query, token: API_KEY },
 });

 return (res.data.result || [])
 .filter((r) => r.type === 'Common Stock')
 .slice(0, 10)
 .map((r) => ({
 symbol: r.symbol,
 description: r.description,
 type: r.type,
 }));
 } catch (error) {
 console.error('Stock search error:', error.message);
 return [];
 }
};

const generateMockHistory = (symbol) => {
  const days = 30;
  const basePrice = MOCK_STOCKS.find((s) => s.symbol === symbol.toUpperCase())?.price || 100;
  const history = [];
  let price = basePrice * 0.85;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price = price * (1 + (Math.random() - 0.48) * 0.03);
    history.push({
      time: Math.floor(date.getTime() / 1000),
      date: date.toISOString().split('T')[0],
      open: parseFloat((price * 0.99).toFixed(2)),
      high: parseFloat((price * 1.02).toFixed(2)),
      low: parseFloat((price * 0.98).toFixed(2)),
      close: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000 + 10000000),
    });
  }
  return history;
};

const getStockHistory = async (symbol, resolution = 'D', from, to) => {
  try {
    if (!API_KEY || API_KEY === 'your_finnhub_api_key') {
      return generateMockHistory(symbol);
    }

    const nowTs = to || Math.floor(Date.now() / 1000);
    const fromTs = from || nowTs - 30 * 24 * 60 * 60;

    const res = await axios.get(`${FINNHUB_BASE_URL}/stock/candle`, {
      params: {
        symbol: symbol.toUpperCase(),
        resolution,
        from: fromTs,
        to: nowTs,
        token: API_KEY,
      },
    });

    if (res.data.s !== 'ok') {
      console.warn(`Finnhub returned status ${res.data.s} for ${symbol}. Falling back to mock history.`);
      return generateMockHistory(symbol);
    }

    return res.data.t.map((timestamp, i) => ({
      time: timestamp,
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      open: res.data.o[i],
      high: res.data.h[i],
      low: res.data.l[i],
      close: res.data.c[i],
      volume: res.data.v[i],
    }));
  } catch (error) {
    console.error('Stock history error:', error.message);
    console.log(`Falling back to mock history data for ${symbol} due to API error.`);
    return generateMockHistory(symbol);
  }
};

module.exports = { getStockQuote, getTrendingStocks, searchStocks, getStockHistory, MOCK_STOCKS };
