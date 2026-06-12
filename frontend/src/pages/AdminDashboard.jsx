import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { 
  Users, Activity, TrendingUp, AlertTriangle, Search, 
  Trash2, Ban, CheckCircle, RefreshCw, BarChart2
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User Tab States
  const [searchQuery, setSearchQuery] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPagination, setUserPagination] = useState(null);
  
  // Transaction Tab States
  const [txPage, setTxPage] = useState(1);
  const [txTypeFilter, setTxTypeFilter] = useState('');
  const [txPagination, setTxPagination] = useState(null);

  // Modals
  const [actionModal, setActionModal] = useState({ show: false, action: '', user: null });

  // ─── Data Fetching ───────────────────────────────────────────
  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/admin/users?page=${userPage}&search=${searchQuery}`);
      setUsersList(res.data.data);
      setUserPagination(res.data.pagination);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const typeParam = txTypeFilter ? `&type=${txTypeFilter}` : '';
      const res = await axiosInstance.get(`/admin/transactions?page=${txPage}${typeParam}`);
      setTransactions(res.data.data);
      setTxPagination(res.data.pagination);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (activeTab === 'overview') await fetchStats();
      if (activeTab === 'users') await fetchUsers();
      if (activeTab === 'transactions') await fetchTransactions();
      setLoading(false);
    };
    loadData();
  }, [activeTab, userPage, searchQuery, txPage, txTypeFilter]);

  // ─── Actions ──────────────────────────────────────────────────
  const handleAction = async () => {
    const { action, user: targetUser } = actionModal;
    try {
      if (action === 'toggleActive') {
        await axiosInstance.put(`/admin/users/${targetUser._id}/toggle-active`);
      } else if (action === 'resetWallet') {
        await axiosInstance.put(`/admin/users/${targetUser._id}/reset-wallet`);
      } else if (action === 'delete') {
        await axiosInstance.delete(`/admin/users/${targetUser._id}`);
      }
      
      // Refresh list
      fetchUsers();
      setActionModal({ show: false, action: '', user: null });
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0);

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage users, view platform stats, and monitor transactions.</p>
        </div>
      </div>

      {/* ─── Tabs ────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200 gap-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <BarChart2 className="w-4 h-4" /> Overview
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'users' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Users className="w-4 h-4" /> Manage Users
        </button>
        <button 
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Activity className="w-4 h-4" /> Transactions
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* ─── Overview Tab ──────────────────────────────────────────── */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="w-3 h-3" /> {stats.activeUsers} Active</span>
                    <span className="flex items-center gap-1 text-red-500"><Ban className="w-3 h-3" /> {stats.inactiveUsers} Inactive</span>
                  </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-emerald-50 to-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Trades</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.totalTrades.toLocaleString()}</h3>
                    </div>
                  </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-purple-50 to-white lg:col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Trading Volume</p>
                      <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalVolume)}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-medium text-gray-500">Avg Trade Size: {formatCurrency(stats.avgTradeSize)}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Recent Signups</h3>
              <div className="card overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Wallet Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recentUsers.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{u.username}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right font-medium">{formatCurrency(u.walletBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Users Tab ─────────────────────────────────────────────── */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Wallet Balance</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usersList.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{u.username}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {u.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right font-medium">{formatCurrency(u.walletBalance)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => setActionModal({ show: true, action: 'toggleActive', user: u })}
                              className={`p-1.5 rounded text-white ${u.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                              title={u.isActive ? 'Suspend User' : 'Activate User'}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setActionModal({ show: true, action: 'resetWallet', user: u })}
                              className="p-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white"
                              title="Reset Wallet & Portfolio"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setActionModal({ show: true, action: 'delete', user: u })}
                              className="p-1.5 rounded bg-red-500 hover:bg-red-600 text-white"
                              title="Delete User Permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {userPagination && userPagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button 
                    disabled={userPage === 1} 
                    onClick={() => setUserPage(p => p - 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                  >Prev</button>
                  <span className="px-3 py-1">Page {userPage} of {userPagination.pages}</span>
                  <button 
                    disabled={userPage === userPagination.pages} 
                    onClick={() => setUserPage(p => p + 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                  >Next</button>
                </div>
              )}
            </div>
          )}

          {/* ─── Transactions Tab ───────────────────────────────────────── */}
          {activeTab === 'transactions' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex gap-2">
                <select 
                  className="input-field max-w-xs" 
                  value={txTypeFilter} 
                  onChange={(e) => setTxTypeFilter(e.target.value)}
                >
                  <option value="">All Transactions</option>
                  <option value="BUY">Buys Only</option>
                  <option value="SELL">Sells Only</option>
                </select>
              </div>

              <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Qty</th>
                      <th className="px-6 py-4 text-right">Price</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map(t => (
                      <tr key={t._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{new Date(t.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium">{t.userId?.username || 'Unknown'}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">{t.stockSymbol}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${t.orderType === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {t.orderType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">{t.quantity}</td>
                        <td className="px-6 py-4 text-right">{formatCurrency(t.price)}</td>
                        <td className="px-6 py-4 text-right font-medium">{formatCurrency(t.totalAmount)}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {txPagination && txPagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button 
                    disabled={txPage === 1} 
                    onClick={() => setTxPage(p => p - 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                  >Prev</button>
                  <span className="px-3 py-1">Page {txPage} of {txPagination.pages}</span>
                  <button 
                    disabled={txPage === txPagination.pages} 
                    onClick={() => setTxPage(p => p + 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                  >Next</button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ─── Action Confirmation Modal ─────────────────────────────── */}
      {actionModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-6">
              {actionModal.action === 'toggleActive' && `Are you sure you want to ${actionModal.user.isActive ? 'suspend' : 'activate'} ${actionModal.user.username}?`}
              {actionModal.action === 'resetWallet' && `Are you sure you want to reset ${actionModal.user.username}'s wallet to ₹10,000 and clear their entire portfolio? This cannot be undone.`}
              {actionModal.action === 'delete' && `Are you sure you want to PERMANENTLY DELETE ${actionModal.user.username} and all their data? This action is irreversible.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setActionModal({ show: false, action: '', user: null })}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleAction}
                className={`px-4 py-2 rounded-lg font-medium text-white ${
                  actionModal.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
