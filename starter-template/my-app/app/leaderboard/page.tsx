'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const COMMUNITIES = ['Bike Builders', 'Goa Squad', 'Laptop Hunters', 'Future Funders', 'Phone Dreams'];

export default function LeaderboardPage() {
  const [selectedCommunity, setSelectedCommunity] = useState(COMMUNITIES[0]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, [selectedCommunity]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLeaderboard(selectedCommunity, 50);
      setLeaderboard(data);
    } catch (err) {
      setError((err as Error).message);
      // Mock data for demo
      setLeaderboard([
        {
          rank: 1,
          user_id: 'u1',
          name: 'Rahul',
          community_name: selectedCommunity,
          savings_score: 82,
          streak_days: 28,
          total_saved: 4200,
          reduction_percentage: 45,
          challenges_completed: 3,
        },
        {
          rank: 2,
          user_id: 'u2',
          name: 'Priya',
          community_name: selectedCommunity,
          savings_score: 76,
          streak_days: 21,
          total_saved: 3600,
          reduction_percentage: 38,
          challenges_completed: 2,
        },
        {
          rank: 3,
          user_id: 'u3',
          name: 'You',
          community_name: selectedCommunity,
          savings_score: 71,
          streak_days: 14,
          total_saved: 2900,
          reduction_percentage: 32,
          challenges_completed: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboards</h1>
        <p className="text-slate-400 mb-8">Compete with others on your financial goals</p>

        {/* Community Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-200 mb-3">Select Community</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {COMMUNITIES.map((community) => (
              <button
                key={community}
                onClick={() => setSelectedCommunity(community)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCommunity === community
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {community}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="bg-amber-500/20 border border-amber-500 text-amber-200 px-4 py-3 rounded-lg mb-6">Using demo data</div>}

        {/* Leaderboard */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.user_id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  idx === 0
                    ? 'bg-yellow-500/20 border-yellow-500'
                    : idx === 1
                      ? 'bg-slate-600/30 border-slate-600'
                      : idx === 2
                        ? 'bg-orange-500/20 border-orange-500'
                        : 'bg-slate-800/30 border-slate-700'
                }`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-10 text-center">
                  {idx === 0 && <span className="text-2xl">🥇</span>}
                  {idx === 1 && <span className="text-2xl">🥈</span>}
                  {idx === 2 && <span className="text-2xl">🥉</span>}
                  {idx > 2 && <span className="text-xl font-bold text-slate-400">{entry.rank}</span>}
                </div>

                {/* Name & Streak */}
                <div className="flex-1">
                  <p className="text-lg font-semibold text-white">{entry.name}</p>
                  <p className="text-sm text-slate-400">🔥 {entry.streak_days}-day streak</p>
                </div>

                {/* Stats */}
                <div className="flex-shrink-0 grid grid-cols-3 gap-6 text-right">
                  <div>
                    <p className="text-xs text-slate-400">Savings Score</p>
                    <p className="text-lg font-bold text-indigo-400">{entry.savings_score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Saved</p>
                    <p className="text-lg font-bold text-emerald-400">₹{entry.total_saved?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Reduction</p>
                    <p className="text-lg font-bold text-white">{entry.reduction_percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Join the Challenge</h2>
          <p className="text-slate-300 mb-6">Upload your spending statement and challenge yourself against the community</p>
          <button
            onClick={() => (window.location.href = '/analysis')}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
          >
            Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
