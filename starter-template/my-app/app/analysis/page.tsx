'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { useSubmitAnalysis } from '@/hooks/useSubmitAnalysis';
import { usePollAnalysis } from '@/hooks/usePollAnalysis';
import { toast } from 'sonner';

// Components
import AnalysisHeader from '@/components/analysis/AnalysisHeader';
import StatementUploadCard from '@/components/analysis/StatementUploadCard';
import GoalInputCard from '@/components/analysis/GoalInputCard';
import AnalyzeButton from '@/components/analysis/AnalyzeButton';
import AnalysisLoadingState from '@/components/analysis/AnalysisLoadingState';
import SavingsScoreCard from '@/components/analysis/SavingsScoreCard';
import SpendingBreakdownCard from '@/components/analysis/SpendingBreakdownCard';
import MoneyMirrorCard from '@/components/analysis/MoneyMirrorCard';
import EmotionalCoachCard from '@/components/analysis/EmotionalCoachCard';

import { useRouter } from 'next/navigation';

export default function AnalysisPage() {
  const router = useRouter();
  const {
    uploadedFile,
    selectedGoal,
    stipend,
    status,
    analysisResult,
    setUploadedFile,
    setSelectedGoal,
    setStipend,
    resetAnalysis
  } = useAnalysisStore();

  const { submit } = useSubmitAnalysis();
  usePollAnalysis(); // Hook handles polling and updating store

  const handleAnalyze = async () => {
    if (!uploadedFile || !selectedGoal || stipend <= 0) {
      toast.error('Please complete all fields');
      return;
    }

    try {
      // In a real app, we'd upload the file first and get text, 
      // but for this demo/PRD flow, we'll simulate the input extraction
      const mockRawInput = `Simulated transaction data from ${uploadedFile.name}`;
      
      await submit({
        goal: selectedGoal,
        stipend: stipend,
        raw_input: mockRawInput
      });
      
      toast.info('Analysis started. Please wait...');
    } catch (err: any) {
      toast.error(err.message || 'Failed to start analysis');
    }
  };

  const isIdle = status === 'idle' || status === 'error';
  const isProcessing = status === 'uploading' || status === 'running';
  const isCompleted = status === 'completed';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <AnalysisHeader />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input (Only show if not processing or completed) */}
          <AnimatePresence mode="wait">
            {(isIdle || (isCompleted && !analysisResult)) && (
              <motion.div 
                key="input-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-5 space-y-8"
              >
                <StatementUploadCard 
                  uploadedFile={uploadedFile}
                  onFileSelect={setUploadedFile}
                  onFileRemove={() => setUploadedFile(null)}
                  disabled={isProcessing}
                />
                <GoalInputCard 
                  selectedGoal={selectedGoal}
                  stipend={stipend}
                  onGoalChange={setSelectedGoal}
                  onStipendChange={setStipend}
                  disabled={isProcessing}
                />
                <AnalyzeButton 
                  onClick={handleAnalyze}
                  disabled={!uploadedFile || !selectedGoal || stipend <= 0}
                  loading={isProcessing}
                  status={status}
                />
              </motion.div>
            )}

            {/* Loading State */}
            {isProcessing && (
              <motion.div 
                key="loading-section"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="lg:col-span-12"
              >
                <AnalysisLoadingState />
              </motion.div>
            )}

            {/* Results Section */}
            {isCompleted && analysisResult && (
              <motion.div 
                key="results-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4">
                    <SavingsScoreCard 
                      score={analysisResult.savings_score} 
                      explanation={`Your habits are resulting in ${analysisResult.savings_score}% avoidable spending.`}
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <SpendingBreakdownCard 
                      breakdown={analysisResult.spending_breakdown} 
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <MoneyMirrorCard 
                      monthlyWaste={analysisResult.monthly_waste}
                      rawFiveYearLoss={analysisResult.raw_5_year_loss}
                      futureInvestedValue={analysisResult.future_invested_value}
                    />
                  </div>
                  <div className="lg:col-span-12">
                    <EmotionalCoachCard 
                      message={analysisResult.emotional_message} 
                    />
                  </div>
                </div>

                <div className="mt-12 flex justify-center gap-6">
                  <button
                    onClick={resetAnalysis}
                    className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700"
                  >
                    Start New Analysis
                  </button>
                  <button
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all shadow-xl shadow-indigo-500/20"
                    onClick={() => router.push('/challenge')}
                  >
                    Commit to Challenge
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
