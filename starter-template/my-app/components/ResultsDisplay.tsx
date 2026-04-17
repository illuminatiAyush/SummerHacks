"use client";

import { motion } from "framer-motion";
import SavingsScoreCard from "./analysis/SavingsScoreCard";
import SpendingBreakdownCard from "./analysis/SpendingBreakdownCard";
import MoneyMirrorCard from "./analysis/MoneyMirrorCard";
import EmotionalCoachCard from "./analysis/EmotionalCoachCard";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  data: any;
  onReset: () => void;
}

export default function ResultsDisplay({ data, onReset }: Props) {
  const router = useRouter();

  if (!data) return null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Analysis Result</h2>
          <p className="text-gray-400 mt-1">The blunt truth about your spending habits.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <RefreshCcw size={18} />
          New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <SavingsScoreCard 
            score={data.savings_score} 
            explanation={`Your habits are resulting in ${data.savings_score}% avoidable spending.`}
          />
        </div>
        <div className="lg:col-span-4">
          <SpendingBreakdownCard 
            breakdown={data.spending_breakdown} 
          />
        </div>
        <div className="lg:col-span-4">
          <MoneyMirrorCard 
            monthlyWaste={data.monthly_waste}
            rawFiveYearLoss={data.raw_5_year_loss}
            futureInvestedValue={data.future_invested_value}
          />
        </div>
        <div className="lg:col-span-12">
          <EmotionalCoachCard 
            message={data.emotional_message} 
          />
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={() => router.push('/challenge')}
          className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-3"
        >
          Stake ETH & Start Challenge
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
