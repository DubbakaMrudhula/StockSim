import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axiosInstance.get('/auth/profile');
          setUser(res.data.data);
        } catch (error) {
          console.error("Token invalid or expired", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    const { token: newToken, ...userData } = res.data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await axiosInstance.post('/auth/register', { username, email, password });
    const { token: newToken, ...userData } = res.data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Helper to sync updated wallet balance globally
  const updateWalletBalance = (newBalance) => {
    setUser((prev) => ({ ...prev, walletBalance: newBalance }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateWalletBalance }}>
      {children}
    </AuthContext.Provider>
  );
};
