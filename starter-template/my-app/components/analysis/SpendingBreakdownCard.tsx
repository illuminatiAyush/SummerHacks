'use client';

import { motion } from 'framer-motion';
import { PieChart, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpendingBreakdownCardProps {
  breakdown: Record<string, number>;
}

export default function SpendingBreakdownCard({ breakdown }: SpendingBreakdownCardProps) {
  const items = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const total = items.reduce((acc, curr) => acc + curr[1], 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
          <PieChart size={20} />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Spending Breakdown</h2>
      </div>

      <div className="flex-1 space-y-6">
        {items.map(([category, amount], index) => {
          const percentage = (amount / total) * 100;
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-slate-300">{category}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">₹{amount.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 ml-2">{percentage.toFixed(0)}%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    index === 0 ? "from-indigo-500 to-purple-500" :
                    index === 1 ? "from-purple-500 to-pink-500" :
                    index === 2 ? "from-pink-500 to-orange-500" : "from-slate-600 to-slate-400"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-medium">Total Analyzed</span>
          <span className="text-2xl font-black text-white">₹{total.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
