'use client';

import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface MoneyMirrorCardProps {
  monthlyWaste: number;
  rawFiveYearLoss: number;
  futureInvestedValue: number;
}

export default function MoneyMirrorCard({ 
  monthlyWaste, 
  rawFiveYearLoss, 
  futureInvestedValue 
}: MoneyMirrorCardProps) {
  
  // Generate projection data for the chart
  const data = Array.from({ length: 6 }, (_, i) => {
    const years = i;
    const months = years * 12;
    const raw = monthlyWaste * months;
    
    // FV = P * [((1 + r)^n - 1) / r]
    // r = 0.08 / 12 (8% annual)
    const r = 0.08 / 12;
    const invested = months === 0 ? 0 : monthlyWaste * ((Math.pow(1 + r, months) - 1) / r);
    
    return {
      year: `Year ${years}`,
      raw: Math.round(raw),
      invested: Math.round(invested),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <TrendingUp size={20} />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">5-Year Money Mirror</h2>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-700/50">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Raw 5-Year Spend</p>
          <p className="text-2xl font-black text-white">₹{rawFiveYearLoss.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <p className="text-emerald-500/70 text-xs font-bold uppercase tracking-wider mb-1">Potential Wealth</p>
          <p className="text-2xl font-black text-emerald-400">₹{futureInvestedValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full relative">
        {monthlyWaste === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-center p-4">
            <TrendingUp size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Provide more transactions to see your financial future.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRaw" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="year" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
              />
              <Legend iconType="circle" />
              <Area 
                type="monotone" 
                dataKey="raw" 
                name="Raw Spend"
                stroke="#f43f5e" 
                fillOpacity={1} 
                fill="url(#colorRaw)" 
                strokeWidth={3}
              />
              <Area 
                type="monotone" 
                dataKey="invested" 
                name="If Invested @ 8%"
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorInvested)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex gap-4 items-center">
        <AlertTriangle size={24} className="text-rose-500 shrink-0" />
        <div>
          <p className="text-white text-sm font-bold">Opportunity Cost</p>
          <p className="text-slate-400 text-xs">
            You're losing <span className="text-rose-400 font-bold">₹{(futureInvestedValue - rawFiveYearLoss).toLocaleString()}</span> in potential gains.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
