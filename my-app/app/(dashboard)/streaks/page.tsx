"use client";

import { Flame, CalendarDays } from "lucide-react";

export default function StreaksPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-sans">Streaks</h1>
        <p className="text-secondary mt-1">Measure consistency.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
         <div className="flex-1 w-full bg-surface border border-border rounded-xl p-6 flex items-center justify-between">
            <div>
               <div className="text-xs uppercase font-bold tracking-wider text-secondary mb-1">Current Streak</div>
               <div className="text-4xl font-bold text-foreground font-mono">12 <span className="text-xl text-secondary">Days</span></div>
            </div>
            <Flame className="w-10 h-10 text-orange-500" />
         </div>
         <div className="flex-1 w-full bg-surface border border-border rounded-xl p-6 flex items-center justify-between">
            <div>
               <div className="text-xs uppercase font-bold tracking-wider text-secondary mb-1">Longest Streak</div>
               <div className="text-4xl font-bold text-foreground font-mono">41 <span className="text-xl text-secondary">Days</span></div>
            </div>
            <CalendarDays className="w-10 h-10 text-accent" />
         </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
         <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-6">30-Day Activity History</h3>
         <div className="flex flex-wrap gap-2">
            {Array.from({length: 30}).map((_, i) => (
              <div 
                key={i} 
                className={`w-10 h-10 rounded-sm hover:scale-110 transition-transform ${i > 25 ? 'bg-background border border-border' : i % 8 === 0 ? 'bg-red-500' : 'bg-accent'}`} 
              />
            ))}
         </div>
      </div>
    </div>
  );
}
