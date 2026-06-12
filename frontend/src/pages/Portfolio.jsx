import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const [portfolioRes, summaryRes, historyRes] = await Promise.all([
          axiosInstance.get('/portfolio/profit-loss'),
          axiosInstance.get('/portfolio/summary'),
          axiosInstance.get('/trade/history?limit=10')
        ]);

        setPortfolioData(portfolioRes.data.data);
        setSummaryData(summaryRes.data.data);
        setTransactions(historyRes.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load portfolio data");
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

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

  const { breakdown, summary } = portfolioData;

  // Chart 1: Portfolio Allocation (Doughnut)
  const allocationChart = {
    labels: breakdown.map(h => h.stockSymbol),
    datasets: [
      {
        data: breakdown.map(h => h.currentValue),
        backgroundColor: [
          '#8b5cf6', '#a78bfa', '#c4b5fd', '#6d28d9', '#4c1d95',
          '#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#fbbf24'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart 2: Profit/Loss per Stock (Bar)
  const plChart = {
    labels: breakdown.map(h => h.stockSymbol),
    datasets: [
      {
        label: 'Profit/Loss (₹)',
        data: breakdown.map(h => h.profitLoss),
        backgroundColor: breakdown.map(h => h.profitLoss >= 0 ? '#10b981' : '#ef4444'),
        borderRadius: 4,
      }
    ]
  };

  const plChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Profit & Loss by Company' }
    }
  };

  const isTotalProfit = summary.totalProfitLoss >= 0;

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch (e) {
      return d;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-primary-600" /> My Portfolio
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <p className="text-primary-100 text-sm mb-1">Total Assets (Value + Wallet)</p>
          <h2 className="text-3xl font-bold">₹{summaryData?.totalAssets?.toLocaleString(undefined, {minimumFractionDigits:2})}</h2>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Current Portfolio Value</p>
              <h2 className="text-2xl font-bold text-gray-900">₹{summary.currentValue?.toLocaleString(undefined, {minimumFractionDigits:2})}</h2>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Activity className="w-5 h-5"/></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Invested: ₹{summary.totalInvested?.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Profit / Loss</p>
              <h2 className={`text-2xl font-bold ${isTotalProfit ? 'text-green-600' : 'text-red-600'}`}>
                {isTotalProfit ? '+' : ''}₹{summary.totalProfitLoss?.toLocaleString(undefined, {minimumFractionDigits:2})}
              </h2>
            </div>
            <div className={`p-2 rounded-lg ${isTotalProfit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {isTotalProfit ? <TrendingUp className="w-5 h-5"/> : <TrendingDown className="w-5 h-5"/>}
            </div>
          </div>
          <p className={`text-sm mt-2 font-medium ${isTotalProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isTotalProfit ? '+' : ''}{summary.totalProfitLossPercent?.toFixed(2)}% All time
          </p>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Wallet Balance</p>
              <h2 className="text-2xl font-bold text-gray-900">₹{summaryData?.walletBalance?.toLocaleString(undefined, {minimumFractionDigits:2})}</h2>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><DollarSign className="w-5 h-5"/></div>
          </div>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <div className="card p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Your portfolio is empty</h3>
          <p className="text-gray-500 mb-6">You haven't bought any stocks yet. Head to the dashboard to start trading.</p>
          <Link to="/" className="btn-primary inline-flex items-center">
            Explore Stocks
          </Link>
        </div>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card p-6 lg:col-span-1 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Asset Allocation</h3>
              <div className="h-64 relative">
                <Doughnut data={allocationChart} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
            
            <div className="card p-6 lg:col-span-2">
              <div className="h-72">
                <Bar data={plChart} options={plChartOptions} />
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Your Holdings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium text-right">Shares</th>
                    <th className="px-6 py-4 font-medium text-right">Avg Price</th>
                    <th className="px-6 py-4 font-medium text-right">LTP</th>
                    <th className="px-6 py-4 font-medium text-right">Current Value</th>
                    <th className="px-6 py-4 font-medium text-right">P&L</th>
                    <th className="px-6 py-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {breakdown.map((item) => (
                    <tr key={item.stockSymbol} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{item.stockSymbol}</div>
                        <div className="text-xs text-gray-500">{item.companyName}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-gray-600">₹{item.averageBuyPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-medium">₹{item.currentPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">₹{item.currentValue.toFixed(2)}</td>
                      <td className={`px-6 py-4 text-right font-medium ${item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.profitLoss >= 0 ? '+' : ''}{item.profitLoss.toFixed(2)}<br/>
                        <span className="text-xs">({item.profitLossPercent.toFixed(2)}%)</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link to={`/stock/${item.stockSymbol}`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                          Trade
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Transaction History - always visible */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Symbol</th>
                <th className="px-6 py-4 font-medium text-right">Qty</th>
                <th className="px-6 py-4 font-medium text-right">Price</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No transactions yet</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(t.createdAt)}</td>
                    <td className={`px-6 py-4 font-medium ${t.orderType === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>{t.orderType}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{t.stockSymbol}</td>
                    <td className="px-6 py-4 text-right font-medium">{t.quantity}</td>
                    <td className="px-6 py-4 text-right text-gray-600">₹{t.price?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold">₹{t.totalAmount?.toFixed(2)}</td>
                    <td className="px-6 py-4">{t.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
