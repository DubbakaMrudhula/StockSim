import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { socket, subscribeToStocks, unsubscribeFromStocks } from '../utils/socket';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Clock, ArrowLeft } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StockDetails() {
  const { symbol } = useParams();
  const { user, updateWalletBalance } = useContext(AuthContext);
  
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Trade state
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState('buy'); // buy or sell
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeMessage, setTradeMessage] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [quoteRes, historyRes] = await Promise.all([
          axiosInstance.get(`/stocks/${symbol}`),
          axiosInstance.get(`/stocks/history/${symbol}`)
        ]);
        setStock(quoteRes.data.data);
        setHistory(historyRes.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock:", error);
        setLoading(false);
      }
    };

    fetchStockData();

    // Subscribe to live updates for this specific stock
    socket.connect();
    subscribeToStocks(symbol);

    socket.on('stockPriceUpdate', (data) => {
      if (data && data.symbol === symbol.toUpperCase()) {
        setStock(prev => prev ? { ...prev, ...data } : data);
      }
    });

    return () => {
      unsubscribeFromStocks(symbol);
      socket.off('stockPriceUpdate');
    };
  }, [symbol]);

  const handleTrade = async (e) => {
    e.preventDefault();
    setTradeLoading(true);
    setTradeMessage(null);
    try {
      const endpoint = tradeType === 'buy' ? '/trade/buy' : '/trade/sell';
      const res = await axiosInstance.post(endpoint, {
        stockSymbol: symbol.toUpperCase(),
        symbol: symbol.toUpperCase(),
        quantity: Number(quantity),
        price: stock.price
      });
      
      setTradeMessage({ type: 'success', text: res.data.message });
      if (res.data.data && res.data.data.walletBalance !== undefined) {
        updateWalletBalance(res.data.data.walletBalance);
      }
      setQuantity(1);
    } catch (error) {
      setTradeMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Trade failed' 
      });
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading || !stock) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  // Chart data
  const chartData = {
    labels: history.map(h => h.date),
    datasets: [
      {
        label: `${symbol.toUpperCase()} Price`,
        data: history.map(h => h.close),
        borderColor: isPositive ? '#16a34a' : '#dc2626',
        backgroundColor: isPositive ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: { display: false },
      y: { 
        display: true,
        grid: { color: '#f3f4f6' }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => window.history.back()} className="flex items-center text-sm font-medium text-gray-500 hover:text-primary-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Chart & Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{stock.symbol}</h1>
                <p className="text-lg text-gray-500">{stock.companyName}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">₹{stock.price?.toFixed(2)}</p>
                <p className={`flex items-center justify-end font-medium text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                  {isPositive ? '+' : ''}{stock.change?.toFixed(2)} ({stock.changePercent?.toFixed(2)}%)
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              {history.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">Loading chart data...</div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Open</p>
                <p className="font-semibold text-gray-900">₹{stock.open?.toFixed(2) || '--'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">High</p>
                <p className="font-semibold text-gray-900">₹{stock.high?.toFixed(2) || '--'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Low</p>
                <p className="font-semibold text-gray-900">₹{stock.low?.toFixed(2) || '--'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Prev Close</p>
                <p className="font-semibold text-gray-900">₹{stock.previousClose?.toFixed(2) || '--'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Trade Panel */}
        <div className="card p-6 h-fit sticky top-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Trade {stock.symbol}</h3>
          
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tradeType === 'buy' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setTradeType('buy')}
            >
              Buy
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tradeType === 'sell' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setTradeType('sell')}
            >
              Sell
            </button>
          </div>

          <form onSubmit={handleTrade} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex items-center">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100">-</button>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="flex-1 text-center py-2 border-y border-gray-300 outline-none focus:ring-0"
                />
                <button type="button" onClick={() => setQuantity(Number(quantity) + 1)} className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100">+</button>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-500">Market Price</span>
              <span className="font-semibold">₹{stock.price?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-900 font-medium">Estimated Total</span>
              <span className="font-bold text-lg">₹{(stock.price * quantity || 0).toFixed(2)}</span>
            </div>

            {tradeMessage && (
              <div className={`p-3 rounded-md text-sm ${tradeMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {tradeMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={tradeLoading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                tradeType === 'buy' 
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {tradeLoading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${stock.symbol}`}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              Available Balance: <span className="font-semibold text-gray-700">₹{user.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
