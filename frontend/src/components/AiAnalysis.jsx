import { useState } from 'react';
import axiosInstance from '../api/axios';
import { Sparkles, TrendingUp, TrendingDown, Minus, ShieldCheck, ShieldAlert, Shield, ChevronDown, ChevronUp, Brain, AlertTriangle, BarChart3, Target, Zap } from 'lucide-react';

export default function AiAnalysis({ symbol, stock, history }) {
  const [analysis, setAnalysis] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [analyzedAt, setAnalyzedAt] = useState(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await axiosInstance.get(`/ai/analyze/${symbol}`);
      if (res.data.success) {
        setAnalysis(res.data.data.analysis);
        setIndicators(res.data.data.indicators);
        setAnalyzedAt(res.data.data.analyzedAt);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'AI analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const recConfig = {
    BUY: {
      gradient: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      glow: 'shadow-emerald-200/50',
      icon: TrendingUp,
      label: 'Strong Buy Signal',
    },
    SELL: {
      gradient: 'from-red-500 to-rose-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      glow: 'shadow-red-200/50',
      icon: TrendingDown,
      label: 'Sell Signal',
    },
    HOLD: {
      gradient: 'from-amber-500 to-yellow-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      glow: 'shadow-amber-200/50',
      icon: Minus,
      label: 'Hold Position',
    },
  };

  const riskConfig = {
    LOW: { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Low Risk' },
    MEDIUM: { icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Medium Risk' },
    HIGH: { icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50', label: 'High Risk' },
  };

  // ─── Shimmer Loading State ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/40 p-6">
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">AI is analyzing {symbol}...</p>
            <p className="text-xs text-purple-500 animate-pulse">Processing market data & technical indicators</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-16 rounded-xl bg-gradient-to-r from-purple-100/50 to-indigo-100/50 animate-pulse" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-14 rounded-lg bg-purple-100/40 animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="h-14 rounded-lg bg-purple-100/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="h-14 rounded-lg bg-purple-100/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <div className="h-20 rounded-lg bg-purple-100/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Decorative dots */}
        <div className="absolute top-4 right-4 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    );
  }

  // ─── Initial State (No Analysis Yet) ──────────────────────────────
  if (!analysis) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/30 p-6">
        {/* Decorative background gradient circles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">AI Stock Analysis</h3>
              <p className="text-xs text-gray-500">Powered by Gemini AI</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-5">
            Get an AI-powered analysis of <span className="font-semibold text-gray-800">{stock?.companyName || symbol}</span> based on current market data, 
            historical trends, and technical indicators.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={fetchAnalysis}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 px-6 py-3.5 text-white font-semibold shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Analyze with AI
            </span>
            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>
        </div>
      </div>
    );
  }

  // ─── Analysis Results ─────────────────────────────────────────────
  const rec = recConfig[analysis.recommendation] || recConfig.HOLD;
  const risk = riskConfig[analysis.risk] || riskConfig.MEDIUM;
  const RecIcon = rec.icon;
  const RiskIcon = risk.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/30 shadow-sm">
      {/* Decorative background */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-purple-200/15 to-indigo-200/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-br from-violet-200/15 to-purple-200/15 rounded-full blur-2xl" />

      {/* Header */}
      <div
        className="relative flex items-center justify-between p-5 cursor-pointer hover:bg-purple-50/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200/50">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">AI Analysis</h3>
            <p className="text-xs text-gray-500">
              {analyzedAt ? new Date(analyzedAt).toLocaleString() : 'Just now'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini recommendation badge in header */}
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rec.gradient} shadow-md ${rec.glow}`}>
            {analysis.recommendation}
          </span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 space-y-5">
          {/* ── Recommendation Card ──────────────────────────────────── */}
          <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${rec.gradient} p-5 text-white shadow-lg ${rec.glow}`}>
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 mb-1">{rec.label}</p>
                <p className="text-3xl font-extrabold tracking-tight">{analysis.recommendation}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <RecIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* ── Confidence + Risk + Indicators Row ───────────────── */}
          <div className="grid grid-cols-3 gap-3">
            {/* Confidence */}
            <div className="rounded-xl bg-white border border-gray-100 p-3.5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5 text-purple-500" />
                <p className="text-xs font-medium text-gray-500">Confidence</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{analysis.confidence}%</p>
              <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${rec.gradient} transition-all duration-1000 ease-out`}
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
            </div>

            {/* Risk */}
            <div className="rounded-xl bg-white border border-gray-100 p-3.5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <RiskIcon className={`w-3.5 h-3.5 ${risk.color}`} />
                <p className="text-xs font-medium text-gray-500">Risk Level</p>
              </div>
              <p className={`text-xl font-bold ${risk.color}`}>{risk.label.split(' ')[0]}</p>
              <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${risk.bg} ${risk.color}`}>
                {analysis.risk}
              </div>
            </div>

            {/* RSI Indicator */}
            <div className="rounded-xl bg-white border border-gray-100 p-3.5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                <p className="text-xs font-medium text-gray-500">RSI</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{indicators?.rsi ?? '--'}</p>
              <p className={`mt-1 text-xs font-medium ${
                indicators?.rsi > 70 ? 'text-red-500' : indicators?.rsi < 30 ? 'text-green-500' : 'text-gray-500'
              }`}>
                {indicators?.rsi > 70 ? 'Overbought' : indicators?.rsi < 30 ? 'Oversold' : 'Neutral'}
              </p>
            </div>
          </div>

          {/* ── Technical Indicators Bar ──────────────────────────── */}
          {indicators && (
            <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-semibold text-gray-700">Technical Indicators</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">SMA (7d)</p>
                  <p className="text-sm font-bold text-gray-800">₹{indicators.sma7 ?? '--'}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">SMA (20d)</p>
                  <p className="text-sm font-bold text-gray-800">₹{indicators.sma20 ?? '--'}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Volatility</p>
                  <p className="text-sm font-bold text-gray-800">{indicators.volatility ?? '--'}%</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Momentum (5d)</p>
                  <p className={`text-sm font-bold ${indicators.momentum5d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {indicators.momentum5d >= 0 ? '+' : ''}{indicators.momentum5d ?? '--'}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Key Reasons ──────────────────────────────────────── */}
          {analysis.reasons?.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                Key Insights
              </p>
              <div className="grid gap-2">
                {analysis.reasons.map((reason, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg ${rec.bg} border ${rec.border} transition-all duration-300`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${rec.gradient} flex items-center justify-center text-white text-xs font-bold mt-0.5`}>
                      {i + 1}
                    </span>
                    <p className={`text-sm ${rec.text} leading-relaxed`}>{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AI Summary ───────────────────────────────────────── */}
          {analysis.summary && (
            <div className="rounded-xl bg-gradient-to-r from-purple-50/60 to-indigo-50/60 border border-purple-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-600 mb-1">AI Summary</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Re-analyze button ────────────────────────────────── */}
          <button
            onClick={fetchAnalysis}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 px-5 py-3 text-white font-semibold shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Re-analyze
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>

          {/* ── Disclaimer ───────────────────────────────────────── */}
          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            ⚠️ This is an AI-generated analysis for educational purposes in a stock market simulator. 
            This is not real financial advice. Always do your own research before making real investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
