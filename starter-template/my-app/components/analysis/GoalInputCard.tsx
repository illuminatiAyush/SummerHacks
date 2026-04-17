'use client';

import { motion } from 'framer-motion';
import { Target, Wallet, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalInputCardProps {
  selectedGoal: string;
  stipend: number;
  onGoalChange: (goal: string) => void;
  onStipendChange: (value: number) => void;
  disabled?: boolean;
}

const goalOptions = [
  'Buy a Bike',
  'Goa Trip',
  'Gaming Laptop',
  'Emergency Fund',
  'New Phone',
  'Custom'
];

export default function GoalInputCard({
  selectedGoal,
  stipend,
  onGoalChange,
  onStipendChange,
  disabled
}: GoalInputCardProps) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Target size={20} />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Financial Blueprint</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Goal Selector */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
            What are you saving for?
          </label>
          <div className="relative group">
            <select
              value={selectedGoal}
              onChange={(e) => onGoalChange(e.target.value)}
              disabled={disabled}
              className={cn(
                "w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                !selectedGoal && "text-slate-500"
              )}
            >
              <option value="" disabled>Select your objective</option>
              {goalOptions.map((option) => (
                <option key={option} value={option} className="bg-slate-900">{option}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* Stipend Input */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Monthly Inflow (₹)
          </label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
              <Wallet size={20} />
            </div>
            <input
              type="number"
              value={stipend || ''}
              onChange={(e) => onStipendChange(Number(e.target.value))}
              placeholder="e.g. 15000"
              disabled={disabled}
              className="w-full pl-14 pr-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-600"
            />
          </div>
          <p className="text-slate-500 text-xs italic">
            Your total monthly pocket money or stipend.
          </p>
        </div>
      </div>
    </div>
  );
}
