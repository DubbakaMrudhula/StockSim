import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { socket } from '../utils/socket';
import { 
  List, TrendingUp, TrendingDown, Trash2, Plus, Search, 
  AlertCircle, CheckCircle, X 
} from 'lucide-react';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add stock form
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Feedback
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchWatchlist();

    socket.connect();
    socket.on('stockUpdate', (data) => {
      if (data && data.stocks) {
        setWatchlist((prev) =>
          prev.map((item) => {
            const updated = data.stocks.find(
              (s) => s.symbol === item.symbol
            );
            return updated ? { ...item, ...updated } : item;
          })
        );
      }
    });

    return () => {
      socket.off('stockUpdate');
      socket.disconnect();
    };
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await axiosInstance.get('/watchlist');
      setWatchlist(res.data.data?.stocks || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load watchlist');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await axiosInstance.get(`/stocks/search?q=${searchQuery}`);
      setSearchResults(res.data.data || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (symbol) => {
    try {
      await axiosInstance.post('/watchlist/add', { symbol });
      setFeedback({ type: 'success', text: `${symbol} added to watchlist` });
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      fetchWatchlist();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add stock',
      });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRemove = async (symbol) => {
    try {
      await axiosInstance.delete('/watchlist/remove', { data: { symbol } });
      setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
      setFeedback({ type: 'success', text: `${symbol} removed from watchlist` });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to remove stock',
      });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <List className="w-6 h-6 text-primary-600" /> My Watchlist
        </h1>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {showSearch ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showSearch ? 'Cancel' : 'Add Stock'}
        </button>
      </div>

      {/* Feedback message */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm border ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-100'
              : 'bg-red-50 text-red-700 border-red-100'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {feedback.text}
        </div>
      )}

      {/* Search Panel */}
      {showSearch && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Search and Add Stocks</h3>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by symbol or company name..."
                className="input-field pl-10"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button onClick={handleSearch} className="btn-primary" disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              {searchResults.map((result) => (
                <div
                  key={result.symbol}
                  className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <span className="font-bold text-gray-900">{result.symbol}</span>
                    <span className="text-sm text-gray-500 ml-2">{result.name || result.companyName}</span>
                  </div>
                  <button
                    onClick={() => handleAdd(result.symbol)}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Watchlist Table */}
      {watchlist.length === 0 ? (
        <div className="card p-12 text-center">
          <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Your watchlist is empty</h3>
          <p className="text-gray-500 mb-6">
            Add stocks to your watchlist to track their prices in real-time.
          </p>
          <button
            onClick={() => setShowSearch(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Your First Stock
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="px-6 py-4 font-medium">Symbol</th>
                  <th className="px-6 py-4 font-medium text-right">Price</th>
                  <th className="px-6 py-4 font-medium text-right">Change</th>
                  <th className="px-6 py-4 font-medium text-right">Change %</th>
                  <th className="px-6 py-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {watchlist.map((stock) => {
                  const isPositive = (stock.change || 0) >= 0;
                  return (
                    <tr key={stock.symbol} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/stock/${stock.symbol}`} className="group">
                          <div className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {stock.symbol}
                          </div>
                          <div className="text-xs text-gray-500">{stock.companyName}</div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {stock.price != null ? `₹${stock.price.toFixed(2)}` : '--'}
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="inline-flex items-center gap-1">
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {isPositive ? '+' : ''}{stock.change?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2) || '0.00'}%
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/stock/${stock.symbol}`}
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                          >
                            Trade
                          </Link>
                          <button
                            onClick={() => handleRemove(stock.symbol)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                            title="Remove from watchlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
