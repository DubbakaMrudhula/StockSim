import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Shield,
  Zap,
  Trophy,
  BarChart2,
} from 'lucide-react';

const STOCK_CARDS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '₹189.30', change: '+1.31%', up: true },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '₹875.40', change: '+2.64%', up: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '₹248.50', change: '-3.38%', up: false },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '₹415.60', change: '+1.29%', up: true },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '₹175.80', change: '-0.68%', up: false },
  { symbol: 'META', name: 'Meta Platforms', price: '₹512.30', change: '+1.55%', up: true },
];

const FEATURES = [
  {
    icon: Zap,
    iconColor: 'text-orange-500',
    bg: 'bg-orange-50',
    title: 'Real-Time Prices',
    desc: 'Live market data streamed directly to your dashboard. React to movements the moment they happen.',
  },
  {
    icon: Shield,
    iconColor: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Risk-Free Learning',
    desc: 'Trade with virtual capital. Build confidence and test strategies with zero financial risk.',
  },
  {
    icon: Trophy,
    iconColor: 'text-primary-600',
    bg: 'bg-primary-50',
    title: 'Compete & Climb',
    desc: 'Rank against other traders on our live leaderboard. Prove who the best trader is.',
  },
  {
    icon: BarChart2,
    iconColor: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Portfolio Analytics',
    desc: 'Track your P&L, ROI, and holdings with intuitive real-time analytics.',
  },
];

export default function Landing() {
  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center bg-white border-b border-gray-100">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-semibold text-sm mb-6 border border-primary-100">
          <span className="w-2 h-2 rounded-full bg-primary-500 inline-block"></span>
          Paper Trading Simulator — No Real Money Needed
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
          Trade Smarter.{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            Risk Nothing.
          </span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Experience real-time stock trading with virtual money.
          Build strategies, track portfolios, and compete on a leaderboard — all for free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            id="cta-signup"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            Start for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/login"
            id="cta-login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-gray-700 font-bold text-lg bg-white border-2 border-gray-200 hover:border-primary-300 hover:text-primary-700 transition-all duration-200"
          >
            Already a trader? Log In
          </Link>
        </div>

        {/* Stock Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STOCK_CARDS.map((stock) => (
            <div
              key={stock.symbol}
              className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-gray-900">
                  {stock.symbol}
                </span>

                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold ${
                    stock.up ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {stock.up ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stock.change}
                </span>
              </div>

              <div className="text-xs text-gray-400 truncate mb-1">
                {stock.name}
              </div>

              <div className="text-base font-extrabold text-gray-800">
                {stock.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
            Everything You Need to Trade
          </h2>

          <p className="text-gray-500 text-center mb-10 text-lg">
            A complete paper trading platform — no credit card required.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, iconColor, bg, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-5"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {title}
                  </h3>

                  <p className="text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-10 text-center text-white shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #6d28d9, #4338ca)',
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to prove your trading skills?
          </h2>

          <p className="text-purple-200 text-lg mb-8 max-w-xl mx-auto">
            Join traders practicing on StockSim. It's free, real-time, and the
            best way to learn.
          </p>

          <Link
            to="/register"
            id="cta-bottom-signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-200 shadow-md hover:scale-105"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}