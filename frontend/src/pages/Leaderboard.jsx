import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Medal, Crown, User, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function Leaderboard() {
  const { user } = useContext(AuthContext);
  const [leaders, setLeaders] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axiosInstance.get('/leaderboard');
        // filter out dummy/test accounts and ensure sorting by totalAssets desc
        const raw = res.data.data || [];
        const filtered = raw
          .filter((l) => l.username && !l.username.toLowerCase().startsWith('test'))
          .sort((a, b) => (b.totalAssets || 0) - (a.totalAssets || 0));
        setLeaders(filtered);
        if (res.data.myRank) {
          setMyRank(res.data.myRank.rank);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
      default:
        return 'bg-white border-gray-100';
    }
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
          <Trophy className="w-6 h-6 text-primary-600" /> Leaderboard
        </h1>
        {myRank && (
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium border border-primary-100">
            Your Rank: #{myRank}
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {/* 2nd Place */}
          <div className="card p-6 text-center border-2 border-gray-200 mt-8">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Medal className="w-7 h-7 text-gray-400" />
            </div>
            <div className="text-sm text-gray-500 font-medium mb-1">2nd Place</div>
            <div className="font-bold text-gray-900 truncate">{leaders[1]?.username}</div>
            <div className="text-lg font-bold text-primary-600 mt-2">
              ₹{leaders[1]?.totalAssets?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className={`text-sm mt-1 font-medium ${(leaders[1]?.profitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(leaders[1]?.profitLoss || 0) >= 0 ? '+' : ''}
              {leaders[1]?.roi?.toFixed(2) || '0.00'}%
            </div>
          </div>

          {/* 1st Place */}
          <div className="card p-6 text-center border-2 border-yellow-300 bg-gradient-to-b from-yellow-50 to-white">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-yellow-200">
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-sm text-yellow-600 font-bold mb-1">1st Place</div>
            <div className="font-bold text-gray-900 text-lg truncate">{leaders[0]?.username}</div>
            <div className="text-xl font-bold text-primary-600 mt-2">
              ₹{leaders[0]?.totalAssets?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className={`text-sm mt-1 font-medium ${(leaders[0]?.profitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(leaders[0]?.profitLoss || 0) >= 0 ? '+' : ''}
              {leaders[0]?.roi?.toFixed(2) || '0.00'}%
            </div>
          </div>

          {/* 3rd Place */}
          <div className="card p-6 text-center border-2 border-orange-200 mt-8">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Medal className="w-7 h-7 text-amber-600" />
            </div>
            <div className="text-sm text-amber-600 font-medium mb-1">3rd Place</div>
            <div className="font-bold text-gray-900 truncate">{leaders[2]?.username}</div>
            <div className="text-lg font-bold text-primary-600 mt-2">
              ₹{leaders[2]?.totalAssets?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className={`text-sm mt-1 font-medium ${(leaders[2]?.profitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(leaders[2]?.profitLoss || 0) >= 0 ? '+' : ''}
              {leaders[2]?.roi?.toFixed(2) || '0.00'}%
            </div>
          </div>
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Full Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-sm text-gray-500">
                <th className="px-6 py-4 font-medium w-16">Rank</th>
                <th className="px-6 py-4 font-medium">Trader</th>
                <th className="px-6 py-4 font-medium text-right">Net Worth</th>
                <th className="px-6 py-4 font-medium text-right">Profit/Loss</th>
                <th className="px-6 py-4 font-medium text-right">Return %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaders.map((leader, index) => {
                const rank = index + 1;
                const isCurrentUser = user && leader.username === user.username;
                const pl = leader.profitLoss || 0;
                const isProfit = pl >= 0;

                return (
                  <tr
                    key={leader._id || leader.username}
                    className={`transition-colors ${isCurrentUser ? 'bg-primary-50 border-l-4 border-l-primary-500' : 'hover:bg-gray-50'} ${getRankBg(rank)}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCurrentUser ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                          {leader.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className={`font-medium ${isCurrentUser ? 'text-primary-700' : 'text-gray-900'}`}>
                            {leader.username}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">You</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ₹{(leader.totalAssets || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="inline-flex items-center gap-1">
                        {isProfit ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {isProfit ? '+' : ''}₹{Math.abs(pl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      {isProfit ? '+' : ''}{leader.roi?.toFixed(2) || '0.00'}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {leaders.length === 0 && (
          <div className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No traders yet</h3>
            <p className="text-gray-500">Be the first to start trading and claim the top spot!</p>
          </div>
        )}
      </div>
    </div>
  );
}
