# Stock Market Simulator

A comprehensive full-stack MERN (MongoDB, Express.js, React, Node.js) web application that simulates real-time stock market trading, portfolio management, and provides a global leaderboard system.

## Project Structure

This project is structured as a monorepo containing two main directories:

- `/frontend` - The React application (built with Vite, Tailwind CSS, Chart.js)
- `/backend` - The Node.js/Express REST API and Socket.io server

## Technologies Used

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Chart.js & react-chartjs-2
- Socket.io-client
- Axios
- React Router DOM

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Socket.io (Real-time updates)
- JWT (JSON Web Tokens) for Authentication
- bcryptjs for password hashing
- Google Generative AI (for AI integration)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas cluster)

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "stock market"
   ```

2. **Setup the Backend:**
   Open a new terminal and run:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the backend directory (refer to `backend/README.md` for variables).
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   Open another terminal and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the App:**
   Open your browser and navigate to the frontend URL (usually `http://localhost:5173`).

## Documentation

For detailed information about each part of the system, including deployment instructions and exact file structures, please refer to their respective README files:

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
