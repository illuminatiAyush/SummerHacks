'use client';

import { motion } from 'framer-motion';
import { Sparkles, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  status: 'idle' | 'uploading' | 'running' | 'completed' | 'error';
}

export default function AnalyzeButton({
  onClick,
  disabled,
  loading,
  status
}: AnalyzeButtonProps) {
  const getButtonContent = () => {
    switch (status) {
      case 'uploading':
        return (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Uploading Statement...</span>
          </>
        );
      case 'running':
        return (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Analyzing Your Habits...</span>
          </>
        );
      case 'completed':
        return (
          <>
            <CheckCircle2 size={20} />
            <span>Analysis Ready</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle size={20} />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <Sparkles size={20} />
            <span>Analyze My Spending</span>
            <ArrowRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </>
        );
    }
  };

  const getButtonStyles = () => {
    switch (status) {
      case 'completed':
        return "from-emerald-600 to-teal-600 shadow-emerald-500/20";
      case 'error':
        return "from-rose-600 to-red-600 shadow-rose-500/20";
      case 'uploading':
      case 'running':
        return "from-indigo-600/50 to-purple-600/50 cursor-not-allowed";
      default:
        return "from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-indigo-500/20";
    }
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "group w-full py-5 rounded-2xl bg-gradient-to-r text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl border border-white/10 disabled:opacity-70 disabled:grayscale",
        getButtonStyles()
      )}
    >
      {getButtonContent()}
    </motion.button>
  );
}
