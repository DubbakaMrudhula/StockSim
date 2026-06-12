
#  Stock Market Simulator Backend

A real-time stock trading and portfolio management API built with **Express.js**, **MongoDB**, and **Socket.io**. Features real-time stock updates, trading capabilities, portfolio tracking, and a global leaderboard system.

##  Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Real-time Stock Quotes** - Live stock price updates via WebSockets
- **Trading System** - Buy and sell stocks with transaction history
- **Portfolio Management** - Track holdings, profit/loss, and portfolio performance
- **Virtual Wallet** - Deposit and withdraw virtual funds (₹10,000 starting balance)
- **Watchlist** - Save favorite stocks for quick access
- **Price Alerts** - Set notifications for specific price points
- **Global Leaderboard** - Compete with other traders
- **Admin Dashboard** - Manage users and monitor system health

---

##  Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone and navigate to backend folder**
   ```bash
   cd "c:\MERN STACK ATP\stock market\backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the backend directory
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/stock-market
   
   # JWT Secret
   JWT_SECRET=your_super_secret_key_here_min_32_chars

   # Frontend URL (for CORS)
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

---

##  Project Structure

```
backend/
 config/
    db.js                    # MongoDB connection configuration
 controllers/
    authController.js        # User registration, login, profile
    stockController.js       # Stock data and quotes
    tradeController.js       # Buy/sell operations
    portfolioController.js   # Holdings and performance
    walletController.js      # Fund management
    watchlistController.js   # Favorite stocks
    alertController.js       # Price alerts
    leaderboardController.js # Rankings
 middleware/
    authMiddleware.js        # JWT verification
    adminMiddleware.js       # Admin role check
    errorMiddleware.js       # Error handling
 Models/
    User.js                  # User schema with authentication
    Portfolio.js             # Stock holdings
    Transaction.js           # Trading history
    Alert.js                 # Price alerts
    Watchlist.js             # Favorite stocks
    WalletTransaction.js     # Fund transactions
  Trade.js                   # Trade history
 routes/
    authRoutes.js            # /api/auth endpoints
    stockRoutes.js           # /api/stocks endpoints
    tradeRoutes.js           # /api/trade endpoints
    portfolioRoutes.js       # /api/portfolio endpoints
    walletRoutes.js          # /api/wallet endpoints
    watchlistRoutes.js       # /api/watchlist endpoints
    alertRoutes.js           # /api/alerts endpoints
    leaderboardRoutes.js     # /api/leaderboard endpoints
 sockets/
    stockSocket.js           # WebSocket event handlers
 utils/
    generateToken.js         # JWT token generation
    stockApi.js              # External stock API integration
    calculatePortfolio.js    # Portfolio calculations
 server.js                    # Main application file
 package.json                 # Dependencies
 .env.example                 # Environment template
 requests.http                # API request examples (REST Client)
```

---

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/users` - Get all users (admin only)

### Stocks
- `GET /api/stocks` - Get trending stocks
- `GET /api/stocks/:symbol` - Get stock details
- `GET /api/stocks/history/:symbol` - Get price history
- `GET /api/stocks/search?q=query` - Search stocks
- `POST /api/stocks/batch` - Get multiple stocks

### Trading
- `POST /api/trade/buy` - Buy stocks
- `POST /api/trade/sell` - Sell stocks
- `GET /api/trade/history` - Get transaction history

### Portfolio
- `GET /api/portfolio` - Get all holdings
- `GET /api/portfolio/profit-loss` - Get P&L summary
- `GET /api/portfolio/summary` - Get portfolio stats

### Wallet
- `GET /api/wallet/balance` - Check balance
- `POST /api/wallet/add-funds` - Deposit money
- `POST /api/wallet/withdraw` - Withdraw money
- `GET /api/wallet/history` - Get fund history

### Watchlist
- `GET /api/watchlist` - Get saved stocks
- `POST /api/watchlist/add` - Add to watchlist
- `DELETE /api/watchlist/remove` - Remove from watchlist

### Alerts
- `POST /api/alerts/create` - Create price alert
- `GET /api/alerts` - Get all alerts
- `DELETE /api/alerts/delete/:id` - Delete alert

### Leaderboard
- `GET /api/leaderboard` - Get top traders
- `GET /api/leaderboard?period=monthly` - Monthly rankings
- `GET /api/leaderboard/rank` - User's rank

### System
- `GET /` - API info and available endpoints
- `GET /api/health` - Health check

---

##  Testing with REST Client

### Setup
1. Install **REST Client** extension in VS Code
2. Open `requests.http` file in the backend folder
3. Update the `@token` variable after logging in

### Example Workflow
```http
### 1. Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "trader_john",
  "email": "john@example.com",
  "password": "SecurePass123"
}

### 2. Login (copy the token from response)
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

### 3. Get Profile (paste token here)
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

---

##  Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

1. Register or login to get a token
2. Include token in `Authorization` header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

### Protected Routes
All routes except `/api/auth/register` and `/api/auth/login` require authentication.

---

##  Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  walletBalance: Number,
  totalDeposits: Number,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### Portfolio
```javascript
{
  userId: ObjectId,
  symbol: String,
  quantity: Number,
  averagePrice: Number,
  currentPrice: Number,
  totalValue: Number,
  createdAt: Date
}
```

### Transaction
```javascript
{
  userId: ObjectId,
  symbol: String,
  type: String (buy/sell),
  quantity: Number,
  price: Number,
  totalAmount: Number,
  timestamp: Date
}
```

---

##  Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` \| `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost/stock-market` |
| `JWT_SECRET` | JWT signing key (min 32 chars) | `your_secret_key_here` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:3000` |

---

##  Real-time Features

### WebSocket Events
- `stock:update` - Stock price update
- `trade:executed` - Trade completion notification
- `portfolio:update` - Portfolio change
- `alert:triggered` - Price alert notification

---

##  Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Make sure MongoDB is running
```bash
# Windows
mongod

# Or use MongoDB Atlas and update MONGODB_URI in .env
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in .env or kill the process using port 5000

### JWT Token Expired
```
Error: jwt expired
```
**Solution:** Login again to get a new token

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Make sure `CLIENT_URL` is set correctly in .env

---

##  API Response Format

All responses follow a consistent format:

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

##  Development

### Run in Development Mode
```bash
npm run dev
```
Uses `nodemon` for automatic reload on file changes.

### Run in Production Mode
```bash
npm start
```

### View Logs
Check the console output for:
- Request logs
- Database queries
- WebSocket events
- Error messages

---

##  Additional Resources

- **Express.js** - https://expressjs.com
- **MongoDB** - https://www.mongodb.com
- **Socket.io** - https://socket.io
- **JWT** - https://jwt.io
- **Mongoose** - https://mongoosejs.com

---

##  Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

##  License

ISC License - Feel free to use in your projects!

---

##  Support

For issues or questions, please open an issue in the repository.

---

**Happy Trading! **
