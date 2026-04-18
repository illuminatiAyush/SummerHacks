"use client";

import { Flame, CalendarDays } from "lucide-react";

export default function StreaksPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-black">Streaks</h1>
        <p className="text-gray-500 mt-1 font-medium">Measure consistency.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="flex-1 w-full bg-white border border-gray-200 shadow-sm rounded-2xl p-6 flex items-center justify-between">
             <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Current Streak</div>
                <div className="text-4xl font-bold text-black font-sans">12 <span className="text-xl text-gray-400">Days</span></div>
             </div>
             <Flame className="w-10 h-10 text-orange-500" />
          </div>
          <div className="flex-1 w-full bg-white border border-gray-200 shadow-sm rounded-2xl p-6 flex items-center justify-between">
             <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Longest Streak</div>
                <div className="text-4xl font-bold text-black font-sans">41 <span className="text-xl text-gray-400">Days</span></div>
             </div>
             <CalendarDays className="w-10 h-10 text-green-600" />
          </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
         <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">30-Day Activity History</h3>
         <div className="flex flex-wrap gap-3">
            {Array.from({length: 30}).map((_, i) => (
              <div 
                key={i} 
                className={`w-10 h-10 rounded-lg hover:scale-110 transition-transform shadow-sm flex items-center justify-center ${i > 25 ? 'bg-gray-50 border border-gray-100' : i % 8 === 0 ? 'bg-red-500 border border-red-600' : 'bg-green-500 border border-green-600'}`} 
              />
            ))}
         </div>
      </div>
    </div>
  );
}
