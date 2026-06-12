# Stock Market Simulator - Backend Technical Documentation

This document provides comprehensive technical details about the backend server that powers the Stock Market Simulator platform. The backend is built with Express.js, MongoDB, and Socket.io to deliver real-time stock trading and portfolio management capabilities.

## Backend Features & Capabilities

### Core Functionality
- **User Authentication System** - Secure user registration and login using JWT (JSON Web Token) authentication with bcryptjs password hashing
- **Real-time Stock Data Broadcasting** - Live stock price updates delivered via WebSockets (Socket.io) for instant updates across all connected clients
- **Complete Trading System** - Comprehensive buy and sell operations with full transaction history tracking and trade validation
- **Portfolio Management Engine** - Real-time portfolio valuation, profit/loss calculations, and performance metrics
- **Virtual Wallet System** - User funds management with deposit and withdrawal capabilities, starting balance of ₹10,000 per user
- **Watchlist & Alert Management** - Users can save favorite stocks and set price-based alerts for notifications
- **Global Leaderboard System** - Real-time ranking of traders based on portfolio performance and trading activity
- **Administrative Dashboard** - System monitoring, user management, and platform health tracking for administrators
- **AI Integration** - Google Generative AI integration for stock analysis and recommendations

## Technology Stack

**Framework & Server:** Express.js (Node.js runtime)
**Database:** MongoDB with Mongoose ODM (Object Document Mapper)
**Real-time Communication:** Socket.io for WebSocket connections
**Authentication:** JWT tokens with bcryptjs for password hashing
**External APIs:** Google Generative AI API for AI analysis features
**Development Tools:** npm for package management

## Complete File Structure with Descriptions

```
backend/
├── config/
│   └── db.js                         # Database connection configuration
│                                     # - Establishes MongoDB connection using Mongoose
│                                     # - Handles connection pooling and error management
│                                     # - Returns the mongoose connection object for use in server.js
│
├── API/
│   ├── auth_api.js                   # User authentication business logic
│   │                                 # - JWT token generation and verification
│   │                                 # - User registration and login processing
│   │                                 # - Password hashing with bcryptjs
│   │                                 # - Session management logic
│   │
│   ├── stock_api.js                  # Stock data retrieval and management
│   │                                 # - Fetches real-time stock quotes from external API
│   │                                 # - Caches stock data for performance
│   │                                 # - Processes stock search and filtering
│   │                                 # - Calculates price changes and trends
│   │
│   ├── trade_api.js                  # Trading operations processing
│   │                                 # - Executes buy/sell transactions
│   │                                 # - Validates trade eligibility (funds, permissions)
│   │                                 # - Records transaction history
│   │                                 # - Calculates trade prices and commissions
│   │
│   ├── portfolio_api.js              # Portfolio management and calculations
│   │                                 # - Calculates total portfolio value
│   │                                 # - Computes profit/loss metrics
│   │                                 # - Tracks individual stock holdings
│   │                                 # - Generates portfolio performance reports
│   │
│   ├── wallet_api.js                 # Virtual wallet operations
│   │                                 # - Manages user fund deposits
│   │                                 # - Processes withdrawals
│   │                                 # - Tracks wallet balance and transactions
│   │                                 # - Validates transaction limits
│   │
│   ├── watchlist_api.js              # Watchlist management logic
│   │                                 # - Adds/removes stocks from user watchlist
│   │                                 # - Retrieves user's watchlist items
│   │                                 # - Updates watchlist stock data in real-time
│   │
│   ├── alert_api.js                  # Price alert creation and management
│   │                                 # - Creates price-based alerts
│   │                                 # - Triggers notifications when conditions met
│   │                                 # - Manages alert settings and preferences
│   │                                 # - Handles alert deletion and updates
│   │
│   ├── leaderboard_api.js            # Leaderboard calculation and ranking
│   │                                 # - Ranks users by portfolio value
│   │                                 # - Calculates return percentages
│   │                                 # - Generates top trader lists
│   │                                 # - Retrieves user's leaderboard position
│   │
│   ├── stats_api.js                  # Statistical data and analytics
│   │                                 # - Calculates market statistics
│   │                                 # - Computes user trading analytics
│   │                                 # - Generates performance reports
│   │                                 # - Analyzes trading patterns
│   │
│   ├── admin_api.js                  # Administrative operations
│   │                                 # - User management functions
│   │                                 # - System health monitoring
│   │                                 # - Data audit and cleanup
│   │                                 # - Access control management
│   │
│   └── ai_api.js                     # AI-powered analysis features
│                                     # - Integrates with Google Generative AI
│                                     # - Generates stock analysis reports
│                                     # - Provides investment recommendations
│                                     # - Processes natural language queries
│
├── models/
│   ├── User_model.js                 # User account schema
│   │                                 # - Email, password, profile information
│   │                                 # - User role (trader/admin)
│   │                                 # - Account creation and update timestamps
│   │                                 # - User preferences and settings
│   │
│   ├── Portfolio_model.js            # Portfolio holdings schema
│   │                                 # - References to stocks owned
│   │                                 # - Quantity of shares held
│   │                                 # - Average purchase price
│   │                                 # - Current value calculations
│   │
│   ├── Transaction_model.js          # Trade transaction records schema
│   │                                 # - Buy/sell transaction details
│   │                                 # - Quantity and price information
│   │                                 # - Transaction timestamp
│   │                                 # - Transaction status (pending/completed/failed)
│   │
│   ├── WalletTransaction_model.js    # Financial transaction history schema
│   │                                 # - Deposit/withdrawal records
│   │                                 # - Transaction amount and date
│   │                                 # - Balance before and after transaction
│   │                                 # - Transaction type and status
│   │
│   ├── Watchlist_model.js            # User watchlist schema
│   │                                 # - User reference
│   │                                 # - List of stock symbols
│   │                                 # - Date added to watchlist
│   │                                 # - Watchlist metadata
│   │
│   └── Alert_model.js                # Price alert configuration schema
│                                     # - User reference
│                                     # - Stock symbol to monitor
│                                     # - Alert price threshold
│                                     # - Alert type (above/below)
│                                     # - Alert status (active/triggered)
│
├── middleware/
│   ├── authMiddleware.js             # JWT authentication middleware
│   │                                 # - Validates JWT tokens
│   │                                 # - Extracts user information from token
│   │                                 # - Protects authenticated routes
│   │                                 # - Handles token expiration
│   │
│   ├── adminMiddleware.js            # Admin role verification middleware
│   │                                 # - Checks if user has admin permissions
│   │                                 # - Restricts admin-only endpoints
│   │                                 # - Logs admin actions for audit
│   │
│   └── errorMiddleware.js            # Global error handling middleware
│                                     # - Catches and formats errors
│                                     # - Sends standardized error responses
│                                     # - Logs errors for debugging
│                                     # - Handles HTTP status codes
│
├── routes/
│   ├── authRoutes.js                 # Authentication route definitions
│   │                                 # - POST /register - User registration
│   │                                 # - POST /login - User login
│   │                                 # - POST /logout - User logout
│   │                                 # - POST /refresh-token - Token refresh
│   │
│   ├── stockRoutes.js                # Stock information routes
│   │                                 # - GET /stocks - List all stocks
│   │                                 # - GET /stocks/:symbol - Get specific stock details
│   │                                 # - GET /stocks/search - Search stocks
│   │                                 # - GET /stocks/trending - Get trending stocks
│   │
│   ├── tradeRoutes.js                # Trading operation routes
│   │                                 # - POST /trades/buy - Buy stocks
│   │                                 # - POST /trades/sell - Sell stocks
│   │                                 # - GET /trades/history - Transaction history
│   │                                 # - GET /trades/:id - Specific trade details
│   │
│   ├── portfolioRoutes.js            # Portfolio routes
│   │                                 # - GET /portfolio - User's portfolio overview
│   │                                 # - GET /portfolio/holdings - Current holdings
│   │                                 # - GET /portfolio/performance - Performance metrics
│   │
│   ├── walletRoutes.js               # Wallet management routes
│   │                                 # - GET /wallet/balance - Current balance
│   │                                 # - POST /wallet/deposit - Deposit funds
│   │                                 # - POST /wallet/withdraw - Withdraw funds
│   │                                 # - GET /wallet/transactions - Transaction history
│   │
│   ├── watchlistRoutes.js            # Watchlist routes
│   │                                 # - GET /watchlist - Retrieve user's watchlist
│   │                                 # - POST /watchlist/add - Add stock to watchlist
│   │                                 # - DELETE /watchlist/:symbol - Remove from watchlist
│   │
│   ├── alertRoutes.js                # Alert management routes
│   │                                 # - POST /alerts/create - Create new alert
│   │                                 # - GET /alerts - Get user's alerts
│   │                                 # - PUT /alerts/:id - Update alert
│   │                                 # - DELETE /alerts/:id - Delete alert
│   │
│   ├── leaderboardRoutes.js          # Leaderboard routes
│   │                                 # - GET /leaderboard - Global rankings
│   │                                 # - GET /leaderboard/user/:id - User's ranking
│   │                                 # - GET /leaderboard/top - Top 10 traders
│   │
│   ├── statsRoutes.js                # Statistics routes
│   │                                 # - GET /stats/market - Market statistics
│   │                                 # - GET /stats/user - User statistics
│   │                                 # - GET /stats/trading-history - Trading analytics
│   │
│   ├── adminRoutes.js                # Admin operation routes
│   │                                 # - GET /admin/users - Manage users
│   │                                 # - GET /admin/system-health - System status
│   │                                 # - POST /admin/reset-user - Reset user account
│   │
│   └── aiRoutes.js                   # AI analysis routes
│                                     # - POST /ai/analyze - Analyze stock
│                                     # - POST /ai/recommendation - Get recommendation
│                                     # - POST /ai/chat - Chat with AI
│
├── sockets/
│   └── stockSocket.js                # WebSocket event handlers
│                                     # - Handles Socket.io connections and disconnections
│                                     # - Broadcasts real-time stock price updates
│                                     # - Manages client subscriptions to stock data
│                                     # - Handles real-time notifications
│                                     # - Manages multiple client connections
│
├── utils/
│   ├── generateToken.js              # JWT token generation utility
│   │                                 # - Creates JWT tokens with user payload
│   │                                 # - Sets token expiration
│   │                                 # - Handles token signing with secret
│   │
│   ├── stockApi.js                   # External stock API integration
│   │                                 # - Fetches real-time stock prices
│   │                                 # - Caches API responses
│   │                                 # - Handles API rate limiting
│   │                                 # - Processes API errors gracefully
│   │
│   └── calculatePortfolio.js         # Portfolio calculation utility
│                                     # - Calculates total portfolio value
│                                     # - Computes profit/loss amounts
│                                     # - Calculates return percentages
│                                     # - Generates portfolio metrics
│
├── .env                              # Environment variables (Git ignored)
│                                     # - Database connection strings
│                                     # - API keys and secrets
│                                     # - Server port and URLs
│                                     # - JWT secret key
│
├── .gitignore                        # Git ignore configuration
│                                     # - Excludes node_modules
│                                     # - Excludes .env files
│                                     # - Excludes system files
│
├── package.json                      # Project dependencies and configuration
│                                     # - Lists all npm packages and versions
│                                     # - Defines npm scripts (dev, start)
│                                     # - Contains project metadata
│                                     # - Specifies Node version requirements
│
├── package-lock.json                 # Exact dependency versions (auto-generated)
│                                     # - Locks exact versions of all packages
│                                     # - Ensures reproducible installations
│                                     # - Generated by npm automatically
│
├── requests.http                     # REST API test requests
│                                     # - Example API calls for all endpoints
│                                     # - Used with VS Code REST Client extension
│                                     # - Includes headers and authentication examples
│
├── server.js                         # Main application entry point
│                                     # - Initializes Express application
│                                     # - Sets up Socket.io server
│                                     # - Connects to MongoDB database
│                                     # - Registers all routes and middleware
│                                     # - Starts listening on configured port
│
└── BACKENDREADME.md                  # This documentation file
                                      # - Complete technical reference
                                      # - Setup and deployment instructions
                                      # - File structure explanation
```

## Project Directory Structure & File Organization

### Configuration
- `db.js` - MongoDB connection setup and initialization

### Route Handlers
All route files follow the pattern `*Routes.js` and include:
- `authRoutes.js` - User authentication endpoints (login, register, logout)
- `stockRoutes.js` - Stock information and market data endpoints
- `tradeRoutes.js` - Trading endpoints (buy, sell, order history)
- `portfolioRoutes.js` - Portfolio information and holdings endpoints
- `walletRoutes.js` - Virtual wallet and fund management endpoints
- `watchlistRoutes.js` - User watchlist management endpoints
- `alertRoutes.js` - Price alert creation and management endpoints
- `leaderboardRoutes.js` - Leaderboard and ranking endpoints
- `statsRoutes.js` - Statistical data and analytics endpoints
- `adminRoutes.js` - Administrative functions and system management
- `aiRoutes.js` - AI-powered analysis endpoints

### API Implementation Layer
Corresponding API files in the API directory handle business logic:
- `auth_api.js` - Authentication logic and token management
- `stock_api.js` - Stock data retrieval and market information
- `trade_api.js` - Trading operations and transaction processing
- `portfolio_api.js` - Portfolio calculations and tracking
- `wallet_api.js` - Wallet operations and fund transfers
- `watchlist_api.js` - Watchlist management logic
- `alert_api.js` - Alert processing and notifications
- `leaderboard_api.js` - Ranking calculations and leaderboard generation
- `stats_api.js` - Statistical computations and analytics
- `admin_api.js` - Administrative operations
- `ai_api.js` - AI analysis and recommendations

### Data Models
Mongoose schema definitions for database collections:
- `User_model.js` - User account schema with profile information
- `Portfolio_model.js` - User portfolio and holdings schema
- `Transaction_model.js` - Trade transaction records schema
- `WalletTransaction_model.js` - Financial transaction history schema
- `Watchlist_model.js` - User watchlist items schema
- `Alert_model.js` - Price alert configuration schema

### Middleware
- `authMiddleware.js` - JWT verification and protected route authentication
- `adminMiddleware.js` - Role-based access control for administrator endpoints
- `errorMiddleware.js` - Global error handling and response standardization

### Real-time Communication
- `stockSocket.js` - Socket.io event handlers for real-time stock price broadcasting and client communication

### Utility Functions
- `generateToken.js` - JWT token generation and management
- `stockApi.js` - External stock market API integration and data fetching
- `calculatePortfolio.js` - Complex portfolio valuation and performance calculations

### Configuration Files
- `package.json` - Project dependencies and npm scripts for running the server
- `server.js` - Main entry point that initializes Express app, Socket.io, database connection, and middleware
- `requests.http` - Sample API requests for testing with VS Code REST Client extension

## Setting Up the Backend Locally

### Prerequisites
Before beginning, ensure you have:
- Node.js installed (version 14 or higher recommended)
- MongoDB installed locally, OR access to MongoDB Atlas (cloud) with a connection string
- A Google Cloud project with Generative AI API enabled (for AI features)

### Installation Steps

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install All Dependencies**
   ```bash
   npm install
   ```
   This command reads package.json and installs all required packages and their dependencies.

3. **Create Environment Configuration File**
   Create a new file named `.env` in the backend root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/stock-market
   JWT_SECRET=your_super_secret_key_here_min_32_chars_long_for_security
   CLIENT_URL=http://localhost:5173
   GOOGLE_API_KEY=your_google_generative_ai_api_key_here
   ```

   **Environment Variable Descriptions:**
   - `PORT` - Server port number (default 5000)
   - `NODE_ENV` - Set to development for local work, production for deployed servers
   - `MONGODB_URI` - Connection string to MongoDB instance
   - `JWT_SECRET` - Secret key for signing JWT tokens (use a long random string)
   - `CLIENT_URL` - URL of the frontend application for CORS configuration
   - `GOOGLE_API_KEY` - API key for Google Generative AI services

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The server will initialize and output a message confirming it's running on the specified port.

### Verifying Local Setup
Once running, you should see:
- MongoDB connection confirmation message
- Server listening message on your configured PORT
- Socket.io server initialized message

You can test the API using the included requests.http file in VS Code with the REST Client extension.

## Deploying Backend to Production

### Supported Hosting Platforms
The backend can be deployed to various cloud providers:
- **Render** (recommended for Node.js apps)
- **Railway** (Git-integrated platform)
- **Heroku** (popular choice, may require paid plans)
- **AWS Elastic Beanstalk**
- **DigitalOcean App Platform**

### Deployment Prerequisites
1. Push your code to a GitHub repository (ensure `.env` is in .gitignore)
2. Create an account on your chosen hosting platform
3. Have your production MongoDB connection string ready (use MongoDB Atlas)
4. Have your production Google API credentials ready

### Step-by-Step Deployment Instructions

#### Step 1: Configure Environment Variables
In your hosting provider's dashboard:
1. Create environment variables for your production environment:
   - `PORT` - Use 8000 or auto-assigned port (check platform documentation)
   - `NODE_ENV` - Set to `production`
   - `MONGODB_URI` - Production MongoDB Atlas connection string
   - `JWT_SECRET` - A different, long random string for production
   - `CLIENT_URL` - Your deployed frontend URL (e.g., https://yourapp.vercel.app)
   - `GOOGLE_API_KEY` - Production Google API key

#### Step 2: Configure Database
1. Create a MongoDB Atlas cluster (cloud database)
2. Create a database user with strong password
3. Whitelist your hosting provider's IP addresses
4. Copy the connection string and set as `MONGODB_URI` environment variable

#### Step 3: Deploy
The process varies by platform:

**For Render:**
1. Connect your GitHub repository
2. Select the backend directory as the root
3. Set buildcommand to `npm install`
4. Set start command to `npm start`
5. Add all environment variables
6. Click Deploy

**For Railway:**
1. Connect your GitHub account
2. Import your repository
3. Railway auto-detects Node.js projects
4. Add all environment variables in project settings
5. Deploy automatically on git push

**For Heroku (legacy, may require paid plan):**
1. Install Heroku CLI
2. Run `heroku create your-app-name`
3. Add buildpack: `heroku buildpacks:add heroku/nodejs`
4. Set environment variables: `heroku config:set KEY=value`
5. Push to Heroku: `git push heroku main`

#### Step 4: Verify Deployment
1. Access your backend URL from the hosting provider
2. Test API endpoints using Postman or the included requests.http file
3. Monitor logs in the hosting provider dashboard
4. Ensure Socket.io connections are working
5. Confirm database connectivity

### Production Best Practices
- Always use strong, randomly generated JWT secrets
- Enable HTTPS/SSL on your domain
- Set `NODE_ENV` to production for performance optimizations
- Use environment variables for all sensitive information
- Configure proper CORS headers with your frontend domain
- Set up monitoring and error tracking (optional: Sentry, LogRocket)
- Regularly backup your MongoDB database
- Keep all dependencies updated for security patches
- Use connection pooling for database efficiency

## API Endpoints Overview

The backend provides REST API endpoints organized by functionality:
- `/api/auth` - Authentication operations
- `/api/stocks` - Stock information and quotes
- `/api/trades` - Trading operations
- `/api/portfolio` - Portfolio information
- `/api/wallet` - Wallet operations
- `/api/watchlist` - Watchlist management
- `/api/alerts` - Alert management
- `/api/leaderboard` - Leaderboard data
- `/api/stats` - Statistics and analytics
- `/api/admin` - Administrative functions
- `/api/ai` - AI analysis endpoints

Detailed endpoint documentation can be found in the requests.http file.

## Troubleshooting

**Port Already in Use:** Change the PORT in .env file
**MongoDB Connection Error:** Verify MONGODB_URI and network connectivity
**CORS Errors:** Ensure CLIENT_URL in .env matches your frontend URL
**Token Errors:** Verify JWT_SECRET is set and consistent
**Socket.io Connection Failed:** Check CLIENT_URL and firewall settings
