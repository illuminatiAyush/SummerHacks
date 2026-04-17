'use client';

import { motion } from 'framer-motion';
import { Brain, Quote, Sparkles } from 'lucide-react';

interface EmotionalCoachCardProps {
  message: string;
}

export default function EmotionalCoachCard({ message }: EmotionalCoachCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/40 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-10 shadow-2xl"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 p-8 text-indigo-500/10 -rotate-12 transform translate-x-1/4 -translate-y-1/4">
        <Brain size={240} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white">
            <Quote size={20} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-widest text-sm opacity-70">AI Financial Coach</h2>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-slate-100 leading-tight italic">
            "{message}"
          </blockquote>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Tough Love Mode Active</span>
          </div>
          
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                AI
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Animated accent lines */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
    </motion.div>
  );
}
