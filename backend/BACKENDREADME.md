# Stock Market Simulator - Backend

A real-time stock trading and portfolio management API built with **Express.js**, **MongoDB**, and **Socket.io**. Features real-time stock updates, trading capabilities, portfolio tracking, and a global leaderboard system.

## Features
- **User Authentication** - Secure registration and login with JWT tokens
- **Real-time Stock Quotes** - Live stock price updates via WebSockets
- **Trading System** - Buy and sell stocks with transaction history
- **Portfolio Management** - Track holdings, profit/loss, and portfolio performance
- **Virtual Wallet** - Deposit and withdraw virtual funds (₹10,000 starting balance)
- **Watchlist & Price Alerts** - Save favorite stocks and set notifications
- **Global Leaderboard & Admin Dashboard** - Compete with other traders and manage system health
- **AI Integration** - Utilize AI tools via Google Generative AI

## Quick Start (Local Development)

### Initial Commands
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the backend folder:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/stock-market
   JWT_SECRET=your_super_secret_key_here_min_32_chars
   CLIENT_URL=http://localhost:5173
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The server will be running on `http://localhost:5000`.

## Project Structure & File Roles

```text
backend/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── controllers/
│   └── *.js                     # Request handling logic (auth, stock, trade, portfolio, alert, etc.)
├── middleware/
│   ├── authMiddleware.js        # JWT verification logic and route protection
│   ├── adminMiddleware.js       # Admin role validation
│   └── errorMiddleware.js       # Centralized error handling for the API
├── Models/
│   └── *.js                     # Mongoose Schemas (User, Portfolio, Transaction, Watchlist, Alert, etc.)
├── routes/
│   └── *Routes.js               # Express route definitions pointing to specific controller methods
├── sockets/
│   └── stockSocket.js           # WebSocket event handlers for real-time stock data broadcasting
├── utils/
│   └── *.js                     # Helper functions (token generation, stock API fetches, portfolio calculations)
├── .env                         # Environment variables configuration (ignored in git)
├── .gitignore                   # Ignored files and folders for Git
├── BACKENDREADME.md             # Deprecated documentation file
├── package.json                 # Project dependencies, metadata, and npm scripts
├── package-lock.json            # Exact versions of installed dependencies
├── requests.http                # API request examples for the VS Code REST Client extension
└── server.js                    # Main application entry point; sets up Express, Socket.io, and DB connection
```

## Deployment

To deploy the backend to a cloud provider like **Render**, **Heroku**, or **Railway**:

1. **Set Environment Variables:** Ensure all required variables from your `.env` file (e.g., `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`) are configured in your hosting provider's dashboard. 
2. **Set Node Environment:** Change `NODE_ENV` to `production`.
3. **Database Configuration:** Use a remote MongoDB instance, such as a **MongoDB Atlas** cluster connection string, for the `MONGODB_URI`.
4. **CORS:** Make sure the `CLIENT_URL` accurately matches the URL of your deployed frontend to avoid cross-origin request issues.
5. **Start Command:** Your hosting provider should use `npm start` (which executes `node server.js`) to run the backend instead of the `dev` script.
