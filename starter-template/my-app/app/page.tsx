'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { onboardUser } from '@/lib/api';
import { useAppContext } from '@/lib/context';
import SubmissionView from '@/components/SubmissionView';
import GodModeDashboard from '@/components/GodModeDashboard';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Toaster } from 'sonner';

type ViewMode = 'onboarding' | 'user' | 'god';

export default function Home() {
  const router = useRouter();
  const { userId, setUserId, analysis, setAnalysis } = useAppContext();
  const [viewMode, setViewMode] = useState<ViewMode>(userId ? 'user' : 'onboarding');
  const [loading, setLoading] = useState(false);
  const [activePayloadId, setActivePayloadId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wallet_address: '',
    stipend: '',
    selected_goal: '',
  });

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await onboardUser({
        name: formData.name,
        email: formData.email,
        wallet_address: formData.wallet_address,
        stipend: parseFloat(formData.stipend),
        selected_goal: formData.selected_goal,
      });
      setUserId(user.id);
      setViewMode('user');
    } catch (error) {
      console.error('Onboarding failed:', error);
      alert('Failed to onboard. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  if (viewMode === 'onboarding') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Toaster theme="dark" position="bottom-right" richColors />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-4">
              Expense Autopsy
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              See what your spending habits will really cost you.
            </p>
            <p className="text-slate-400">
              Understand your financial future. Commit to change. Build accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">✨ Key Features</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>📊 AI-powered spending analysis</li>
                <li>🎯 Goal-based financial coaching</li>
                <li>💰 5-year investment projections</li>
                <li>🔐 Crypto escrow commitment system</li>
                <li>🏆 Community leaderboards</li>
                <li>🎖️ Savings streaks & achievements</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur border border-indigo-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🚀 How It Works</h3>
              <ol className="space-y-2 text-slate-300 text-sm">
                <li>1. Upload your spending data</li>
                <li>2. AI analyzes your habits</li>
                <li>3. Stake ETH on a commitment</li>
                <li>4. Track your progress</li>
                <li>5. Unlock funds when you succeed</li>
              </ol>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>
            <form onSubmit={handleOnboard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Wallet Address (0x...)
                </label>
                <input
                  type="text"
                  required
                  value={formData.wallet_address}
                  onChange={(e) =>
                    setFormData({ ...formData, wallet_address: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono text-sm"
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Monthly Stipend (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Your Financial Goal
                </label>
                <select
                  required
                  value={formData.selected_goal}
                  onChange={(e) =>
                    setFormData({ ...formData, selected_goal: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select a goal</option>
                  <option value="Bike">Buy a Bike</option>
                  <option value="Laptop">Gaming Laptop</option>
                  <option value="Trip">Goa Trip</option>
                  <option value="Phone">New Phone</option>
                  <option value="Emergency Fund">Emergency Fund</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Setting up...' : 'Start My Journey'}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <Toaster theme="dark" position="bottom-right" richColors />

      <header className="border-b border-indigo-500/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full p-4 flex items-center justify-between">
          <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
            ExpenseAutopsy
          </h1>
          <nav className="flex gap-2 p-1.5 rounded-2xl bg-[#0f1225] border border-indigo-500/10 shadow-inner">
            <button
              onClick={() => setViewMode('user')}
              className={`tab-pill ${viewMode === 'user' ? 'active' : ''}`}
            >
              1. Analysis
            </button>
            <button
              onClick={() => setViewMode('god')}
              className={`tab-pill ${viewMode === 'god' ? 'active' : ''}`}
            >
              2. Admin Dashboard
            </button>
          </nav>
          <button
            onClick={() => setViewMode('onboarding')}
            className="text-sm text-slate-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 w-full flex items-start justify-center p-6">
        {viewMode === 'user' && (
          analysisResult ? (
            <ResultsDisplay 
              data={analysisResult} 
              onReset={() => {
                setAnalysisResult(null);
                setActivePayloadId(null);
              }} 
            />
          ) : (
            <SubmissionView onSuccess={(data) => {
              setAnalysisResult(data);
              setActivePayloadId(data.payload_id);
              setAnalysis({
                ...analysis,
                highest_spend_category: data.highest_spend_category,
                highest_spend_amount: data.monthly_waste,
                savings_score: data.savings_score,
                monthly_waste: data.monthly_waste,
                statement_id: data.payload_id
              });
            }} />
          )
        )}
        {viewMode === 'god' && <GodModeDashboard activePayloadId={activePayloadId} />}
      </div>
    </main>
  );
}
