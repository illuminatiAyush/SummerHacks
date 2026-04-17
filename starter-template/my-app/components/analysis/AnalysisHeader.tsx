'use client';

import { motion } from 'framer-motion';

export default function AnalysisHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
        Expense <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Autopsy</span>
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Upload your statement and discover what your habits are really costing you.
      </p>
      <p className="text-slate-400 mt-2 text-sm">
        We will analyze your spending, calculate your future loss, and show you where your money is leaking.
      </p>
    </motion.div>
  );
}
