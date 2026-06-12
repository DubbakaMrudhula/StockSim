import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { socket } from '../utils/socket';
import { TrendingUp, TrendingDown, Clock, Search } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialStocks = async () => {
      try {
        const res = await axiosInstance.get('/stocks');
        setStocks(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setLoading(false);
      }
    };

    fetchInitialStocks();

    // Setup socket connection
    socket.connect();
    
    socket.on('stockUpdate', (data) => {
      if (data && data.stocks) {
        setStocks(data.stocks);
        setLastUpdated(new Date(data.timestamp));
      }
    });

    return () => {
      socket.off('stockUpdate');
      socket.disconnect();
    };
  }, []);

  const doSearch = () => {
    const q = (query || '').trim();
    if (!q) return;
    const ql = q.toLowerCase();
    const exact = stocks.find(s => s.symbol.toLowerCase() === ql);
    if (exact) return navigate(`/stock/${exact.symbol}`);
    const first = stocks.find(s => s.symbol.toLowerCase().includes(ql) || (s.companyName || '').toLowerCase().includes(ql));
    if (first) return navigate(`/stock/${first.symbol}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Overview</h1>
          <p className="text-gray-500 flex items-center gap-1 text-sm mt-1">
            <Clock className="w-4 h-4" /> Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search stocks..."
            className="input-field pl-10 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
          />
          <button type="button" onClick={doSearch} className="absolute left-3 top-2.5 p-0">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        { (query.trim() ? stocks.filter(s => {
            const ql = query.trim().toLowerCase();
            return s.symbol.toLowerCase().includes(ql) || (s.companyName || '').toLowerCase().includes(ql);
          }) : stocks).map((stock) => (
          <Link to={`/stock/${stock.symbol}`} key={stock.symbol} className="block">
            <div className="card hover:shadow-md transition-shadow duration-300 p-5 group cursor-pointer border border-transparent hover:border-primary-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{stock.symbol}</h3>
                  <p className="text-sm text-gray-500 truncate w-32" title={stock.companyName}>
                    {stock.companyName}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stock.change >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-gray-900">₹{stock.price?.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)} ({stock.changePercent?.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
