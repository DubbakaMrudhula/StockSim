// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// Connect MongoDB database
const connectDB = require('./config/db');

// Import routes
const alertRoutes = require('./routes/alertRoutes');
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const statsRoutes = require('./routes/statsRoutes');
const stockRoutes = require('./routes/stockRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const walletRoutes = require('./routes/walletRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

// Import error handlers
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import socket setup
const initializeSocket = require('./sockets/stockSocket');

// Connect database
connectDB();

// Create express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Make socket available everywhere
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Stock Market API Running',
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is healthy',
  });
});

// API Routes
app.use('/api/alerts', alertRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize socket events
initializeSocket(io);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unexpected errors
process.on('unhandledRejection', (err) => {
  console.log(err.message);
  server.close(() => process.exit(1));
});