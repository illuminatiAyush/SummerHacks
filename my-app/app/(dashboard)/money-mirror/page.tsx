"use client";

import { LineChart, Calendar } from "lucide-react";
import MoneyMirrorChart from "@/components/dashboard/MoneyMirrorChart";

export default function MoneyMirrorPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-sans">Money Mirror</h1>
          <p className="text-secondary mt-1">Full trajectory projection engine.</p>
        </div>
        <div className="flex bg-surface border border-border rounded-lg p-1">
          <button className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground bg-border rounded-md transition-colors">5 Years</button>
          <button className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary hover:text-foreground transition-colors">10 Years</button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-surface border border-border rounded-xl p-6 md:col-span-3">
          <MoneyMirrorChart />
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-center space-y-8">
           <div>
              <div className="text-xs uppercase text-secondary font-bold tracking-wider mb-2">Projected Value Loss</div>
              <div className="text-3xl font-bold text-red-500 font-mono">-$23,400</div>
           </div>
           <div className="w-full h-px bg-border" />
           <div>
              <div className="text-xs uppercase text-secondary font-bold tracking-wider mb-2">If Diverted to S&P 500</div>
              <div className="text-3xl font-bold text-accent font-mono">+$31,250</div>
           </div>
        </div>
      </div>
    </div>
  );
}
