# Stock Market Simulator - Frontend Technical Documentation

This document provides comprehensive technical information about the frontend client application for the Stock Market Simulator. The frontend is built with React 19, Vite, Tailwind CSS, and Socket.io-client to deliver a modern, responsive trading interface with real-time updates.

## Frontend Features & Capabilities

### User Interface Components
- **Real-time Dashboard** - Live stock price updates delivered via WebSocket connections with automatic refresh
- **Interactive Charts** - Visualize stock price movements and portfolio performance with Chart.js and react-chartjs-2
- **Portfolio Management Interface** - Display holdings, track profit/loss, manage stock positions with intuitive UI
- **Virtual Wallet Management** - View balance, deposit and withdraw virtual funds, track transaction history
- **Stock Watchlist** - Create and manage personalized stock watchlists for quick access and monitoring
- **Price Alert Configuration** - Set up price-based notifications for tracked stocks
- **Trading Interface** - Execute buy and sell operations with order validation and confirmation
- **Global Leaderboard** - View competitive rankings and trader statistics
- **User Authentication** - Secure login and registration with JWT token management
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices using Tailwind CSS
- **Admin Dashboard** - System monitoring and user management for administrators
- **AI Analysis Tools** - Access AI-powered stock analysis and recommendations

## Technology Stack

**Frontend Framework:** React 19 with functional components and hooks
**Build Tool:** Vite (ultra-fast build and development server)
**CSS Framework:** Tailwind CSS with PostCSS for styling
**Charts & Visualization:** Chart.js with react-chartjs-2 wrapper
**Real-time Communication:** Socket.io-client for WebSocket connections
**HTTP Client:** Axios with interceptors for API calls
**Routing:** React Router DOM v6 for navigation
**State Management:** React Context API for global state
**Code Quality:** ESLint for linting and code standards
**Deployment:** Vercel configuration included

## Complete File Structure with Descriptions

```
frontend/
├── public/                           # Static assets served at root path
│   ├── favicon.ico                   # Browser tab icon
│   ├── robots.txt                    # Search engine crawler instructions
│   └── [other static assets]         # Images, fonts, etc. copied as-is
│
├── src/
│   ├── api/
│   │   └── axios.js                  # Axios HTTP client configuration
│   │                                 # - Creates Axios instance with base URL
│   │                                 # - Configures request/response interceptors
│   │                                 # - Handles authentication token injection
│   │                                 # - Manages API error responses
│   │                                 # - Centralized API call handling
│   │
│   ├── assets/                       # Static images and icons
│   │   ├── images/                   # Product images and graphics
│   │   ├── icons/                    # SVG and PNG icons
│   │   └── [other media files]       # Logos, backgrounds, etc.
│   │
│   ├── components/                   # Reusable React components
│   │   ├── Navbar.jsx                # Navigation header component
│   │   │                             # - User menu and authentication status
│   │   │                             # - Navigation links to all pages
│   │   │                             # - Logo and branding
│   │   │                             # - Responsive mobile menu
│   │   │
│   │   ├── AiAnalysis.jsx            # AI stock analysis component
│   │   │                             # - Displays AI-generated analysis
│   │   │                             # - Shows recommendations and insights
│   │   │                             # - Formats AI response data
│   │   │
│   │   ├── StockCard.jsx             # Reusable stock display component
│   │   │                             # - Shows stock name, symbol, price
│   │   │                             # - Displays price change indicators
│   │   │                             # - Handles click navigation
│   │   │
│   │   ├── PortfolioCard.jsx         # Portfolio holding display card
│   │   │                             # - Shows stock holdings with quantity
│   │   │                             # - Displays current value and profit/loss
│   │   │                             # - Quick sell button
│   │   │
│   │   ├── PriceChart.jsx            # Stock price chart component
│   │   │                             # - Renders Chart.js price visualization
│   │   │                             # - Updates in real-time via Socket.io
│   │   │                             # - Handles different time periods
│   │   │
│   │   ├── TradeForm.jsx             # Buy/Sell trading form component
│   │   │                             # - Input fields for quantity and price
│   │   │                             # - Order preview and confirmation
│   │   │                             # - Form validation
│   │   │
│   │   └── [other components]        # Additional UI components
│   │
│   ├── context/
│   │   └── AuthContext.jsx           # Authentication state management
│   │                                 # - Manages current user login state
│   │                                 # - Stores JWT authentication token
│   │                                 # - Handles login/logout functions
│   │                                 # - Provides global auth context to all pages
│   │                                 # - Manages user profile information
│   │
│   ├── pages/                        # Full-page components (React Router pages)
│   │   ├── Landing.jsx               # Home page for unauthenticated users
│   │   │                             # - Project overview and features
│   │   │                             # - Call-to-action buttons
│   │   │                             # - Feature highlights
│   │   │                             # - Navigation to login/signup
│   │   │
│   │   ├── Login.jsx                 # User login page
│   │   │                             # - Email and password input fields
│   │   │                             # - Login form submission
│   │   │                             # - Links to signup and forgot password
│   │   │                             # - Error message display
│   │   │
│   │   ├── Dashboard.jsx             # Main trading dashboard
│   │   │                             # - Real-time stock market display
│   │   │                             # - User portfolio overview
│   │   │                             # - Wallet balance display
│   │   │                             # - Quick trading interface
│   │   │                             # - Market trends and top movers
│   │   │
│   │   ├── StockDetails.jsx          # Individual stock details page
│   │   │                             # - Stock price chart and history
│   │   │                             # - Company information
│   │   │                             # - Trading volume and statistics
│   │   │                             # - Buy/Sell button and form
│   │   │                             # - Add to watchlist option
│   │   │
│   │   ├── Portfolio.jsx             # User portfolio page
│   │   │                             # - Lists all current stock holdings
│   │   │                             # - Shows total value and gain/loss
│   │   │                             # - Allocation breakdown visualization
│   │   │                             # - Individual stock performance
│   │   │
│   │   ├── Watchlist.jsx             # User's watchlist page
│   │   │                             # - Displays saved stocks
│   │   │                             # - Shows current prices and changes
│   │   │                             # - Remove from watchlist option
│   │   │                             # - Set price alerts
│   │   │
│   │   ├── Leaderboard.jsx           # Global trader rankings page
│   │   │                             # - Lists top traders by portfolio value
│   │   │                             # - Shows user rankings and statistics
│   │   │                             # - Displays profit/loss percentages
│   │   │                             # - User's own ranking position
│   │   │
│   │   └── AdminDashboard.jsx        # Administrator system panel
│   │                                 # - System health and statistics
│   │                                 # - User management interface
│   │                                 # - Platform monitoring
│   │                                 # - Access controls and permissions
│   │
│   ├── utils/
│   │   ├── formatCurrency.js         # Currency formatting utility
│   │   │                             # - Formats numbers to currency display
│   │   │                             # - Handles thousand separators
│   │   │                             # - Currency symbol placement
│   │   │
│   │   ├── formatDate.js             # Date formatting utility
│   │   │                             # - Formats timestamps to readable dates
│   │   │                             # - Handles different date formats
│   │   │
│   │   ├── calculatePercentage.js    # Percentage calculation utility
│   │   │                             # - Calculates profit/loss percentages
│   │   │                             # - Computes return on investment
│   │   │
│   │   └── socket.js                 # Socket.io client configuration
│   │                                 # - Initializes Socket.io connection
│   │                                 # - Connects to backend WebSocket server
│   │                                 # - Listens for real-time stock updates
│   │                                 # - Handles connection/disconnection events
│   │                                 # - Manages event listeners and emitters
│   │
│   ├── App.jsx                       # Root application component
│   │                                 # - React Router configuration
│   │                                 # - Route definitions for all pages
│   │                                 # - Layout wrapper component
│   │                                 # - Provider setup for contexts
│   │
│   ├── App.css                       # Application-wide component styles
│   │                                 # - App layout and structure styles
│   │                                 # - Responsive breakpoints
│   │                                 # - Theme-specific styling
│   │
│   ├── index.css                     # Global styles and Tailwind directives
│   │                                 # - CSS variables for theming
│   │                                 # - Tailwind CSS @import directives
│   │                                 # - Global element styles
│   │                                 # - Font and typography setup
│   │
│   └── main.jsx                      # React application entry point
│                                     # - React DOM root rendering
│                                     # - AuthContext provider wrapper
│                                     # - Bootstrap the entire application
│
├── .env                              # Environment variables (Git ignored)
│                                     # - VITE_API_URL - Backend API base URL
│                                     # - VITE_SOCKET_URL - WebSocket server URL
│
├── .env.production                   # Production environment variables
│                                     # - Production API and socket URLs
│                                     # - Used during 'npm run build'
│
├── .gitignore                        # Git ignore configuration
│                                     # - Excludes node_modules
│                                     # - Excludes .env files
│                                     # - Excludes dist/ build folder
│                                     # - Excludes system and IDE files
│
├── package.json                      # Project dependencies and npm scripts
│                                     # - React and related dependencies
│                                     # - Build tools (Vite, Tailwind, PostCSS)
│                                     # - npm scripts: dev, build, preview, lint
│                                     # - Project metadata and version
│
├── package-lock.json                 # Exact dependency versions (auto-generated)
│                                     # - Locks exact versions of all packages
│                                     # - Ensures reproducible installations
│
├── index.html                        # Main HTML entry point
│                                     # - HTML template
│                                     # - References main.jsx script
│                                     # - Sets up meta tags and head content
│                                     # - Root div element for React mounting
│
├── vite.config.js                    # Vite build tool configuration
│                                     # - React plugin configuration
│                                     # - Build and development options
│                                     # - Asset optimization settings
│                                     # - Development server configuration
│
├── tailwind.config.js                # Tailwind CSS configuration
│                                     # - Theme customization (colors, fonts)
│                                     # - Content file paths for purging unused CSS
│                                     # - Plugin configuration
│                                     # - Extend default Tailwind themes
│
├── postcss.config.js                 # PostCSS configuration
│                                     # - Tailwind CSS plugin setup
│                                     # - CSS processing pipeline configuration
│
├── eslint.config.js                  # ESLint code quality configuration
│                                     # - Code style rules
│                                     # - Warning and error thresholds
│                                     # - Environment and parser settings
│
├── vercel.json                       # Vercel deployment configuration
│                                     # - Build command settings
│                                     # - Output directory configuration
│                                     # - Environment variables for Vercel
│                                     # - Rewrite rules for SPA routing
│
└── FRONTENDREADME.md                 # This documentation file
                                      # - Complete technical reference
                                      # - Setup and deployment instructions
                                      # - File structure explanation
```

## Project Directory Structure & File Organization

### Source Code Directory (`src/`)

**API Integration:**
- `api/axios.js` - Axios instance configuration with base URL, interceptors, and error handling

**Reusable Components:**
- `components/` - Modular, reusable React components including:
  - `Navbar.jsx` - Navigation header with user menu and app branding
  - `AiAnalysis.jsx` - AI-powered stock analysis component
  - Additional components for forms, cards, and UI elements

**Page Components:**
- `pages/` - Full-page components for each route:
  - `Landing.jsx` - Home/landing page for unauthenticated users
  - `Login.jsx` - User authentication page
  - `Dashboard.jsx` - Main trading dashboard with real-time data
  - `StockDetails.jsx` - Detailed stock information and analysis page
  - `Portfolio.jsx` - User portfolio and holdings display
  - `Watchlist.jsx` - Personal watchlist management page
  - `Leaderboard.jsx` - Global trader rankings and statistics
  - `AdminDashboard.jsx` - Administrative system panel

**Global State Management:**
- `context/AuthContext.jsx` - Authentication state and user session management

**Utility Functions:**
- `utils/socket.js` - Socket.io client configuration and connection handlers
- Additional utilities for formatting, calculations, and data manipulation

**Static Assets:**
- `assets/` - Images, icons, logos, and other static files

**Styling:**
- `App.css` - Application-specific component styles
- `index.css` - Global styles, CSS variables, and Tailwind directives

**Main Application Files:**
- `App.jsx` - Root component with route definitions and provider setup
- `main.jsx` - React DOM rendering entry point with Context wrappers

### Configuration Files

- `package.json` - Project dependencies and npm scripts (dev, build, preview, lint)
- `package-lock.json` - Exact dependency versions for reproducible builds
- `vite.config.js` - Vite bundler configuration and React plugin settings
- `tailwind.config.js` - Tailwind CSS theme customization and content paths
- `postcss.config.js` - PostCSS configuration for Tailwind CSS processing
- `eslint.config.js` - ESLint rules for code quality and consistency
- `index.html` - Main HTML template where React app mounts

### Static Files
- `public/` - Static assets served at the root (favicon, robots.txt, etc.)

### Deployment Configuration
- `vercel.json` - Vercel-specific deployment settings and routing rules

## Setting Up the Frontend Locally

### Prerequisites
Ensure you have:
- Node.js installed (version 16 or higher recommended)
- npm or yarn package manager
- Backend server running on localhost:5000 (or accessible remote URL)
- Text editor or IDE (VS Code recommended)

### Installation Steps

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install All Dependencies**
   ```bash
   npm install
   ```
   This installs React, Vite, Tailwind CSS, and all other required packages.

3. **Create Environment Configuration File**
   Create a new file named `.env` in the frontend root directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

   **Environment Variable Descriptions:**
   - `VITE_API_URL` - Backend API base URL for HTTP requests (must start with VITE_ for Vite exposure)
   - `VITE_SOCKET_URL` - Backend server URL for WebSocket connections

   **Important:** All Vite environment variables must be prefixed with `VITE_` to be accessible in the client code.

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The development server will start and display the URL in your terminal (usually http://localhost:5173).

5. **Open in Browser**
   Navigate to the provided URL in your web browser. You should see the Stock Market Simulator landing page.

### Development Workflow
While the dev server is running:
- Edit any file in `src/` and changes will auto-reload in the browser
- Tailwind CSS changes apply instantly
- Check the terminal for any build warnings or errors
- Use browser DevTools for debugging React components

## Building for Production

### Creating Production Build
```bash
npm run build
```
This command:
- Minifies all JavaScript and CSS files
- Bundles assets for optimal loading
- Outputs a `dist/` folder with production-ready files
- Takes 1-2 minutes depending on project size

### Preview Production Build Locally
```bash
npm run preview
```
This runs a local server that serves the production build to verify everything works correctly.

## Deploying Frontend to Production

### Supported Hosting Platforms
The frontend is a static site and can be deployed to:
- **Vercel** (recommended, optimized for Vite)
- **Netlify** (excellent performance, easy setup)
- **GitHub Pages** (free, good for static sites)
- **Render** (supports Node.js static hosting)
- **AWS S3 + CloudFront** (scalable, enterprise option)
- **Firebase Hosting** (Google's platform)

### Deployment to Vercel (Recommended)

Vercel is the platform created by the Vite team and provides optimal performance.

**Step 1: Prepare Code**
1. Ensure all code is committed to a GitHub repository
2. Confirm `.env` file is in `.gitignore` (not committed to GitHub)
3. Push all changes to the main branch

**Step 2: Connect to Vercel**
1. Visit vercel.com and sign in (you can use your GitHub account)
2. Click "Add New" and select "Project"
3. Find and select your GitHub repository
4. Click "Import"

**Step 3: Configure Project**
1. Set the **Root Directory** to `frontend` (this tells Vercel where your project is)
2. Keep the build command as default (Vercel auto-detects Vite)
3. Keep the output directory as default (`dist`)

**Step 4: Add Environment Variables**
1. In the "Environment Variables" section, add:
   - Key: `VITE_API_URL`
   - Value: Your deployed backend URL (e.g., `https://backend-app.onrender.com/api`)
   - Key: `VITE_SOCKET_URL`
   - Value: Your backend server URL (e.g., `https://backend-app.onrender.com`)
2. Click "Add Environment Variable" for each one

**Step 5: Deploy**
1. Click the "Deploy" button
2. Vercel will build your project and deploy it
3. You'll receive a deployment URL upon completion
4. The app will auto-deploy on every git push to main

**Step 6: Verify Deployment**
1. Visit your Vercel-provided URL
2. Test user authentication (login/signup)
3. Verify real-time socket connections work
4. Test API calls by viewing data on the dashboard

### Deployment to Netlify

**Step 1: Build Locally**
```bash
npm run build
```

**Step 2: Deploy**
1. Visit netlify.com and sign in
2. Click "Add New Site" and select "Deploy Manually"
3. Drag and drop the `dist/` folder generated from the build
4. Netlify will deploy immediately

Alternatively, connect your GitHub repository for automatic deployments:
1. Click "Add New Site"
2. Select "Connect to Git"
3. Choose your repository
4. Set Build command to `npm run build`
5. Set Publish directory to `dist`
6. Add environment variables `VITE_API_URL` and `VITE_SOCKET_URL`
7. Deploy

### Deployment to Other Platforms

**GitHub Pages:**
1. Build: `npm run build`
2. Push the `dist/` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

**Firebase Hosting:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

**AWS S3 + CloudFront:**
1. Build: `npm run build`
2. Upload `dist/` contents to S3 bucket
3. Create CloudFront distribution pointing to S3
4. Set up your domain with CloudFront

## Environment Variables Guide

### Available Variables
- `VITE_API_URL` - Base URL for backend API calls (REQUIRED)
- `VITE_SOCKET_URL` - Backend server URL for WebSocket (REQUIRED)

### Variable Naming Convention
All client-side environment variables **must** start with `VITE_` to be exposed by Vite. Variables without this prefix are ignored.

### Setting Variables for Different Environments

**Local Development (.env):**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Production (.env.production):**
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

Vite automatically uses `.env.production` when running `npm run build`.

## NPM Scripts Reference

**Development:**
```bash
npm run dev      # Start development server with hot reload
```

**Production:**
```bash
npm run build    # Create optimized production build
npm run preview  # Preview production build locally
```

**Code Quality:**
```bash
npm run lint     # Check code for linting errors
```

## Performance Optimization

### Already Optimized
- Vite provides ultra-fast bundling with native ES modules
- Tailwind CSS automatically removes unused styles
- React is optimized for quick re-renders
- Socket.io is configured for efficient real-time updates

### Additional Optimization Tips
- Use React.memo for expensive components
- Implement code splitting with React.lazy for pages
- Optimize images in `assets/` folder
- Monitor bundle size with Vite's build analyzer

## Troubleshooting

**Cannot Connect to Backend:** Verify VITE_API_URL and VITE_SOCKET_URL in .env match your backend URL

**Socket.io Connection Fails:** Ensure backend WebSocket is enabled and CORS is configured correctly

**Build Fails:** Clear node_modules and reinstall: `rm -r node_modules && npm install`

**Port 5173 Already in Use:** Vite will auto-assign the next available port

**Tailwind Styles Not Applied:** Check that CSS files are imported in main.jsx or App.jsx

**Environment Variables Not Working:** Ensure variables start with VITE_ and restart dev server

## Browser Compatibility

The frontend supports modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers on iOS 12+ and Android 5+
