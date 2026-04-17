'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { createChallenge, createEscrowTransaction } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function ChallengePage() {
  const { userId, analysis } = useAppContext();
  const [step, setStep] = useState<'setup' | 'escrow' | 'processing' | 'complete'>('setup');
  const [challengeData, setChallengeData] = useState({
    duration: 30,
    stakeAmount: 0.01,
    targetReduction: 30,
  });
  const [loading, setLoading] = useState(false);
  const [challengeId, setChallengeId] = useState('');
  const [escrowTx, setEscrowTx] = useState('');
  const [error, setError] = useState('');

  const handleCreateChallenge = async () => {
    if (!userId || !analysis.highest_spend_category) {
      setError('Complete analysis first');
      return;
    }

    setLoading(true);
    setError('');
    setStep('processing');

    try {
      const challenge = await createChallenge({
        user_id: userId,
        analysis_id: analysis.statement_id || 'N/A',
        highest_spend_category: analysis.highest_spend_category,
        initial_monthly_spend: analysis.highest_spend_amount || 0,
        challenge_duration: challengeData.duration,
        stake_amount: challengeData.stakeAmount,
        target_reduction_percentage: challengeData.targetReduction,
      });

      setChallengeId(challenge.id);
      setStep('escrow');
    } catch (err) {
      setError((err as Error).message);
      setStep('setup');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEscrow = async () => {
    if (!userId || !challengeId) {
      setError('Challenge setup required');
      return;
    }

    setLoading(true);
    setError('');
    setStep('processing');

    try {
      const escrow = await createEscrowTransaction({
        challenge_id: challengeId,
        user_id: userId,
        amount: challengeData.stakeAmount,
        wallet_address: 'MOCK_WALLET', // TODO: Get from wallet connection
      });

      setEscrowTx(escrow.tx_hash);
      setStep('complete');
    } catch (err) {
      setError((err as Error).message);
      setStep('escrow');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Processing Challenge...</h2>
          <p className="text-slate-400 mt-2">Setting up your commitment</p>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-2xl text-center">
          <div className="mb-6 text-6xl">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-4">Challenge Created!</h1>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6 text-left">
            <div className="grid gap-4">
              <div>
                <p className="text-slate-400 text-sm">Challenge ID</p>
                <p className="text-white font-mono">{challengeId}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Category</p>
                <p className="text-white">{analysis.highest_spend_category}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Duration</p>
                <p className="text-white">{challengeData.duration} days</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Staked Amount</p>
                <p className="text-emerald-400 font-bold">{challengeData.stakeAmount} ETH</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Transaction Hash</p>
                <p className="text-white font-mono text-sm break-all">{escrowTx}</p>
              </div>
            </div>
          </div>

          <p className="text-slate-300 mb-6">
            Your funds are now locked in escrow on Sepolia Testnet. Reduce your {analysis.highest_spend_category} spending by {challengeData.targetReduction}% to unlock your stake.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => (window.location.href = '/leaderboard')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'escrow') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Confirm Escrow</h1>

          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Staking Amount</span>
                <span className="text-2xl font-bold text-emerald-400">{challengeData.stakeAmount} ETH</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Network</span>
                <span className="text-white">Sepolia Testnet</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Duration</span>
                <span className="text-white">{challengeData.duration} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Target Reduction</span>
                <span className="text-white font-semibold">{challengeData.targetReduction}%</span>
              </div>
            </div>
          </div>

          {error && <div className="bg-rose-500/20 border border-rose-500 text-rose-200 px-4 py-3 rounded-lg mb-6">{error}</div>}

          <p className="text-slate-400 mb-6">
            By confirming, you're locking {challengeData.stakeAmount} ETH in an escrow contract. Your funds will be released when you successfully reduce spending by {challengeData.targetReduction}%.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('setup')}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              Back
            </button>
            <button
              onClick={handleCreateEscrow}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Confirming...' : 'Confirm & Lock ETH'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Create a Challenge</h1>
        <p className="text-slate-400 mb-8">Lock ETH and commit to reducing your spending</p>

        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 space-y-6">
          {/* Current Category */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Target Category</label>
            <div className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
              {analysis.highest_spend_category || 'Complete analysis first'}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Challenge Duration</label>
            <select
              value={challengeData.duration}
              onChange={(e) => setChallengeData({ ...challengeData, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>

          {/* Stake Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Stake Amount (ETH)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={challengeData.stakeAmount}
                onChange={(e) => setChallengeData({ ...challengeData, stakeAmount: parseFloat(e.target.value) })}
                className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="text-slate-400">ETH</span>
            </div>
            <p className="text-slate-400 text-sm mt-1">Testnet Sepolia ETH for demonstration</p>
          </div>

          {/* Target Reduction */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Target Reduction (%)</label>
            <select
              value={challengeData.targetReduction}
              onChange={(e) => setChallengeData({ ...challengeData, targetReduction: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={15}>15% Reduction</option>
              <option value={30}>30% Reduction (Recommended)</option>
              <option value={50}>50% Reduction</option>
              <option value={75}>75% Reduction</option>
            </select>
          </div>

          {error && <div className="bg-rose-500/20 border border-rose-500 text-rose-200 px-4 py-3 rounded-lg">{error}</div>}

          <div className="flex gap-4">
            <button
              onClick={() => (window.location.href = '/analysis')}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              Back
            </button>
            <button
              onClick={handleCreateChallenge}
              disabled={loading || !analysis.highest_spend_category}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Creating...' : 'Create Challenge'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
