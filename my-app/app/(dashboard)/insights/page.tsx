"use client";

import { TrendingDown, AlertCircle, BarChart3, Info } from "lucide-react";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { useMemo, useEffect, useState } from "react";

export default function InsightsPage() {
  const { spendingBreakdown, highestSpendCategory, insight, trendDetection } = useDashboardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSpend = useMemo(() => {
    return Object.values(spendingBreakdown || {}).reduce((acc: number, val) => acc + (val as number), 0);
  }, [spendingBreakdown]);

  const breakdownArray = useMemo(() => {
    if (!spendingBreakdown) return [];
    return Object.entries(spendingBreakdown)
      .filter(([_, val]) => (val as number) > 0)
      .sort((a, b) => (b[1] as number) - (a[1] as number));
  }, [spendingBreakdown]);

  const colors = ["bg-red-500", "bg-amber-500", "bg-blue-500", "bg-accent", "bg-purple-500"];

  if (!mounted) return null;
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-black">Insights</h1>
        <p className="text-gray-500 mt-1 font-medium">Deep dive into your behavioral spending patterns.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 col-span-2">
          <div className="flex items-center gap-2 mb-6 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            <BarChart3 className="w-4 h-4 text-green-600" /> Spending Breakdown
          </div>
          <div className="space-y-6">
            {breakdownArray.length > 0 ? (
              breakdownArray.map(([category, amount], i) => {
                const percentage = totalSpend > 0 ? Math.round(((amount as number) / totalSpend) * 100) : 0;
                return (
                  <BreakdownRow 
                    key={category}
                    label={category} 
                    amount={`₹${(amount as number).toLocaleString()}`} 
                    percentage={percentage} 
                    color={colors[i % colors.length]} 
                  />
                );
              })
            ) : (
              <div className="text-sm text-secondary py-4 text-center border border-dashed border-border rounded-lg">No data. Connect your bank to see breakdown.</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            <AlertCircle className="w-4 h-4 text-green-600" /> Highest Category
          </div>
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-red-500 mb-2">{highestSpendCategory || "N/A"}</div>
            {highestSpendCategory && spendingBreakdown?.[highestSpendCategory] && (
               <p className="text-sm text-secondary">
                 {totalSpend > 0 ? Math.round((spendingBreakdown[highestSpendCategory] as number / totalSpend) * 100) : 0}% of your total discretionary spend.
               </p>
            )}
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-600 leading-relaxed font-bold">
              AI Analysis: {insight || "Run the AI pipeline to see your personalized recommendation."}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
         <div className="flex items-center gap-2 mb-6 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            <TrendingDown className="w-4 h-4 text-green-600" /> Trend Analysis
         </div>
         <div className="min-h-[9rem] flex items-center justify-center border border-gray-100 border-dashed rounded-xl bg-gray-50 p-6">
            {trendDetection ? (
              <p className="text-sm text-black leading-relaxed font-medium">
                 <Info className="inline-block w-4 h-4 text-green-600 mr-2 mb-0.5" />
                 {trendDetection}
              </p>
            ) : (
              <span className="text-secondary text-sm font-mono">[ Graph Processing Engine ]</span>
            )}
         </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, amount, percentage, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-2">
        <span className="text-black uppercase tracking-tight">{label}</span>
        <span className="text-gray-500">{amount} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
