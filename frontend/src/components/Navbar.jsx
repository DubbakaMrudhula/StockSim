import { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'border-primary-500 text-primary-700'
        : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 mr-8">
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">StockSim</span>
            </Link>

            {/* Nav Links — only shown when logged in */}
            {user && (
              <div className="hidden sm:flex sm:space-x-6">
                <NavLink to="/" end className={navLinkClass}>
                  Explore
                </NavLink>
                <NavLink to="/portfolio" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/watchlist" className={navLinkClass}>
                  Wishlist
                </NavLink>
                <NavLink to="/leaderboard" className={navLinkClass}>
                  Leaderboard
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkClass}>
                    Admin
                  </NavLink>
                )}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Wallet balance */}
                <div className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-primary-100">
                  ₹{user.walletBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>

                {/* User + logout */}
                <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Logout"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-700 font-medium px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign up free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
