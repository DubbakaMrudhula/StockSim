# Stock Market Simulator - Frontend

The frontend client for the Stock Market Simulator, built using **React 19**, **Vite**, **Tailwind CSS**, and **Socket.io-client** for real-time stock market data updates.

## Features
- **Real-time Dashboard:** View live stock prices updating dynamically via WebSockets.
- **Interactive Charts:** Powered by Chart.js and react-chartjs-2 for visualizing stock performance trends.
- **Portfolio & Wallet Management:** Monitor your current holdings and virtual funds with a modern, dynamic UI.
- **Responsive Design:** Styled heavily with Tailwind CSS to ensure mobile and desktop compatibility.
- **Modern Routing:** Structured navigation using React Router DOM.

## Quick Start (Local Development)

### Initial Commands
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the frontend folder to configure connection to the backend API:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173` (or the available port Vite assigns).

## Project Structure & File Roles

```text
frontend/
├── public/                      # Static assets that are served at the root path (e.g., favicon)
├── src/
│   ├── api/                     # Axios instances, interceptors, and API call definitions
│   ├── assets/                  # Images, icons, and other imported static assets
│   ├── components/              # Reusable React components (Navbar, Buttons, StockCards, Forms, etc.)
│   ├── context/                 # React Context API files for global state management (Auth, Portfolio, Socket state)
│   ├── pages/                   # Main route pages corresponding to URLs (Home, Dashboard, Login, Register, Profile)
│   ├── utils/                   # Helper functions (currency formatting, date calculations, etc.)
│   ├── App.css                  # App-specific global component styles
│   ├── App.jsx                  # Main application component and React Router setup
│   ├── index.css                # Global CSS variables and Tailwind CSS directives
│   └── main.jsx                 # React DOM rendering entry point and Context Provider wrappers
├── .env                         # Environment variables (Must be VITE_ prefixed to be exposed to the client)
├── .gitignore                   # Ignored files and folders for Git
├── eslint.config.js             # ESLint rules configuration for code linting
├── index.html                   # Main HTML template file where the React app mounts
├── package.json                 # Project dependencies, metadata, and npm scripts (dev, build, preview)
├── package-lock.json            # Exact versions of installed frontend dependencies
├── postcss.config.js            # PostCSS configuration, required for Tailwind CSS integration
├── tailwind.config.js           # Tailwind CSS configuration (theme, plugins, content paths)
├── vercel.json                  # Deployment configuration specifically for Vercel hosting
└── vite.config.js               # Vite bundler configuration and React plugin setup
```

## Deployment

The frontend is ready to be deployed on static hosting platforms like **Vercel**, **Netlify**, or **Render**. A `vercel.json` file is already included in the root directory for seamless Vercel deployment.

### Deploying to Vercel
1. Push your code to a GitHub repository.
2. Log into **Vercel** and select "Add New Project" to import your repository.
3. Set the **Root Directory** to `frontend`.
4. In the Environment Variables section, add your variables (`VITE_API_URL`, `VITE_SOCKET_URL`) pointing to your deployed backend URL.
5. Click **Deploy**. Vercel will automatically detect Vite, run the `npm run build` command, and host the output from the `dist/` directory.
