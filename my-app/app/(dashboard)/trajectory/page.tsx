"use client";

import { TrendingUp, Flame, Activity, Zap } from "lucide-react";
import MoneyMirrorChart from "@/components/dashboard/MoneyMirrorChart";

export default function TrajectoryPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">System Trajectory</h1>
        <p className="text-secondary font-medium">Visualizing the behavioral shift and capital retention rate.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard 
          icon={<Flame className="w-5 h-5 text-orange-500" />} 
          label="Current Streak" 
          value="12 Days" 
          subValue="Record: 41 Days"
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-accent" />} 
          label="Savings Velocity" 
          value="+24%" 
          subValue="Compounding Active"
        />
        <StatCard 
          icon={<Zap className="w-5 h-5 text-blue-500" />} 
          label="Score Delta" 
          value="+8 Pts" 
          subValue="Last 7 Days"
        />
      </div>

      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-xl font-bold text-foreground tracking-tight">Macro Mapping</h2>
           <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest bg-background border border-border px-3 py-1.5 rounded-lg">
              <Activity className="w-3 h-3 text-accent" /> Live Telemetry
           </div>
        </div>
        <div className="h-[400px]">
          <MoneyMirrorChart />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
         <h2 className="text-xl font-bold text-foreground mb-8 tracking-tight">Adherence Heatmap</h2>
         <div className="flex flex-wrap gap-2">
            {Array.from({length: 30}).map((_, i) => (
              <div 
                key={i} 
                className={`w-10 h-10 rounded-sm hover:scale-110 transition-transform ${i > 25 ? 'bg-background border border-border' : i % 5 === 0 ? 'bg-red-500' : 'bg-accent'}`} 
                title={`Day ${i+1}`}
              />
            ))}
         </div>
         <div className="mt-8 pt-6 border-t border-border flex items-center gap-6">
            <LegendItem color="bg-accent" label="Protocol Maintained" />
            <LegendItem color="bg-red-500" label="Detection Triggered" />
            <LegendItem color="bg-background border border-border" label="Pending Verification" />
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue }: any) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-5 hover:border-accent/20 transition-colors">
      <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-bold text-foreground font-mono">{value}</div>
        <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1 opacity-60">{subValue}</div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
       <div className={`w-3 h-3 rounded-sm ${color}`} />
       <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{label}</span>
    </div>
  );
}
