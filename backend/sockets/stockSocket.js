const { getTrendingStocks } = require('../utils/stockApi');
const { checkAndTriggerAlerts } = require('../API/alert_api');

const initializeSocket = (io) => {
 // Store connected users: socketId -> userId
 const connectedUsers = new Map();

 io.on('connection', (socket) => {
 console.log(` Socket connected: ${socket.id}`);

 // User joins their personal room for private events (alerts, portfolio)
 socket.on('joinRoom', (userId) => {
 if (userId) {
 socket.join(userId.toString());
 connectedUsers.set(socket.id, userId.toString());
 console.log(` User ${userId} joined room`);
 socket.emit('joined', { message: 'Connected to live updates' });
 }
 });

 // Client subscribes to specific stock live updates
 socket.on('subscribeStock', (symbol) => {
 if (symbol) {
 socket.join(`stock_${symbol.toUpperCase()}`);
 console.log(` ${socket.id} subscribed to ${symbol.toUpperCase()}`);
 }
 });

 socket.on('unsubscribeStock', (symbol) => {
 if (symbol) {
 socket.leave(`stock_${symbol.toUpperCase()}`);
 }
 });

 socket.on('disconnect', () => {
 connectedUsers.delete(socket.id);
 console.log(` Socket disconnected: ${socket.id}`);
 });
 });

 //  Broadcast live stock prices every 5 seconds 
 setInterval(async () => {
 try {
 const stocks = await getTrendingStocks();
 // Broadcast to all connected clients
 io.emit('stockUpdate', {
 timestamp: new Date().toISOString(),
 stocks,
 });

 // Broadcast per-stock to subscribers
 stocks.forEach((stock) => {
 io.to(`stock_${stock.symbol}`).emit('stockPriceUpdate', {
 symbol: stock.symbol,
 price: stock.price,
 change: stock.change,
 changePercent: stock.changePercent,
 timestamp: new Date().toISOString(),
 });
 });
 } catch (error) {
 console.error('Stock broadcast error:', error.message);
 }
 }, 5000);

 //  Check price alerts every 30 seconds 
 setInterval(async () => {
 try {
 await checkAndTriggerAlerts(io);
 } catch (error) {
 console.error('Alert check error:', error.message);
 }
 }, 30000);

 //  Broadcast leaderboard every 60 seconds 
 setInterval(async () => {
 try {
 io.emit('leaderboardUpdate', {
 message: 'Leaderboard refreshed',
 timestamp: new Date().toISOString(),
 });
 } catch (error) {
 console.error('Leaderboard broadcast error:', error.message);
 }
 }, 60000);

 console.log(' Socket.io initialized with live price, alert, and leaderboard broadcasts');
};

module.exports = initializeSocket;
