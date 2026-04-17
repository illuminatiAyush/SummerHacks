"use client";

import { TrendingDown, AlertCircle, BarChart3 } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-sans">Insights</h1>
        <p className="text-secondary mt-1">Deep dive into your behavioral spending patterns.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6 col-span-2">
          <div className="flex items-center gap-2 mb-6 text-secondary text-sm uppercase tracking-wider font-semibold">
            <BarChart3 className="w-4 h-4" /> Spending Breakdown
          </div>
          <div className="space-y-6">
            <BreakdownRow label="Food Delivery" amount="₹2,100" percentage={45} color="bg-red-500" />
            <BreakdownRow label="Shopping" amount="₹1,200" percentage={25} color="bg-amber-500" />
            <BreakdownRow label="Entertainment" amount="₹800" percentage={18} color="bg-blue-500" />
            <BreakdownRow label="Travel" amount="₹400" percentage={12} color="bg-accent" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 text-secondary text-sm uppercase tracking-wider font-semibold">
            <AlertCircle className="w-4 h-4" /> Highest Category
          </div>
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-red-500 mb-2">Food</div>
            <p className="text-sm text-secondary">45% of total leakage</p>
          </div>
          <div className="mt-4 p-4 bg-background rounded-lg border border-border">
            <p className="text-xs text-secondary leading-relaxed font-medium">
              Recommendation: Establishing a hard protocol on weekend delivery could compress waste by 20%.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-surface border border-border rounded-xl p-6">
         <div className="flex items-center gap-2 mb-6 text-secondary text-sm uppercase tracking-wider font-semibold">
            <TrendingDown className="w-4 h-4" /> Trend Analysis
         </div>
         <div className="h-40 flex items-center justify-center border border-border border-dashed rounded-lg bg-background">
            <span className="text-secondary text-sm font-mono">[ Graph Processing Engine ]</span>
         </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, amount, percentage, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold mb-2">
        <span className="text-foreground">{label}</span>
        <span className="text-secondary">{amount} ({percentage}%)</span>
      </div>
      <div className="w-full bg-border h-2 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
