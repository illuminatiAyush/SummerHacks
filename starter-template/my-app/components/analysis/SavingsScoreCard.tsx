'use client';

import { motion } from 'framer-motion';
import { Gauge, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavingsScoreCardProps {
  score: number;
  explanation: string;
}

export default function SavingsScoreCard({ score, explanation }: SavingsScoreCardProps) {
  const getScoreColor = (s: number) => {
    if (s <= 30) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (s <= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
  };

  const getLevel = (s: number) => {
    if (s <= 30) return 'Low Leakage';
    if (s <= 60) return 'Moderate Leakage';
    return 'High Leakage';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Gauge size={20} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Savings Score</h2>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
          getScoreColor(score)
        )}>
          {getLevel(score)}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-800"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={552.92}
              initial={{ strokeDashoffset: 552.92 }}
              animate={{ strokeDashoffset: 552.92 - (552.92 * score) / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className={cn(
                "transition-colors duration-1000",
                score <= 30 ? "text-emerald-500" : score <= 60 ? "text-amber-500" : "text-rose-500"
              )}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-5xl font-black text-white"
            >
              {score}
            </motion.span>
            <span className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">/ 100</span>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex gap-4 items-start">
        <Info size={20} className="text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-slate-300 text-sm leading-relaxed">
          {explanation}
        </p>
      </div>
    </motion.div>
  );
}
