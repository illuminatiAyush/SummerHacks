'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search, PieChart, TrendingDown, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';

const loadingSteps = [
  { text: 'Parsing statement...', icon: Search },
  { text: 'Categorizing merchants...', icon: PieChart },
  { text: 'Detecting spending leaks...', icon: TrendingDown },
  { text: 'Calculating future value...', icon: TrendingUp },
  { text: 'Generating emotional coaching...', icon: Brain },
  { text: 'Finalizing insights...', icon: Sparkles }
];

export default function AnalysisLoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-4 border-dashed border-indigo-500/30"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center text-indigo-400"
        >
          <Brain size={48} />
        </motion.div>
      </div>

      <div className="w-full max-w-sm space-y-6">
        {loadingSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: isActive || isCompleted ? 1 : 0.3, 
                x: 0,
                scale: isActive ? 1.05 : 1
              }}
              className="flex items-center gap-4"
            >
              <div className={`p-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-500/20 text-indigo-400' : 
                isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {isCompleted ? <CheckCircle size={18} /> : <Icon size={18} />}
              </div>
              <span className={`font-medium transition-colors ${
                isActive ? 'text-white' : 
                isCompleted ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                {step.text}
              </span>
              {isActive && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 12 }}
                  className="flex gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-slate-500 text-sm mt-12 animate-pulse">
        Our multi-agent system is processing your data...
      </p>
    </div>
  );
}
