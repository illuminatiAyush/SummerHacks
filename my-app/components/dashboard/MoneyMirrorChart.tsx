"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const data = [
  { name: "Month 1", actual: 4000, projected: 4000 },
  { name: "Month 3", actual: 3800, projected: 4200 },
  { name: "Month 6", actual: 3500, projected: 4800 },
  { name: "Month 9", actual: 3200, projected: 5500 },
  { name: "Month 12", actual: 3000, projected: 6500 },
  { name: "Month 18", actual: 2800, projected: 8000 },
  { name: "Month 24", actual: 2500, projected: 12000 },
];

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/hooks/useTheme";

export default function MoneyMirrorChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-surface/50 rounded-lg animate-pulse" />;

  const isDark = theme === 'dark';
  const gridColor = isDark ? "#1F1F1F" : "#E5E7EB";
  const tickColor = isDark ? "#A1A1AA" : "#6B7280";
  const tooltipBg = isDark ? "#111111" : "#FFFFFF";
  const tooltipText = isDark ? "#FFFFFF" : "#111111";
  const tooltipBorder = isDark ? "#1F1F1F" : "#E5E7EB";
  const accentGreen = isDark ? "#22C55E" : "#16A34A";
  const accentRed = isDark ? "#EF4444" : "#DC2626";

  return (
    <div className="w-full h-full min-h-[250px] font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentGreen} stopOpacity={0.3} />
              <stop offset="95%" stopColor={accentGreen} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentRed} stopOpacity={0.2} />
              <stop offset="95%" stopColor={accentRed} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={gridColor} 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: tickColor, fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: `1px solid ${tooltipBorder}`, 
              borderRadius: "8px",
              boxShadow: "none"
            }}
            itemStyle={{ fontSize: "12px", fontWeight: 700, color: tooltipText, textTransform: "uppercase" }}
            labelStyle={{ display: "none" }}
          />
          <Area 
            type="monotone" 
            dataKey="projected" 
            stroke={accentGreen} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorProjected)" 
            name="Compounded Value"
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <Area 
            type="monotone" 
            dataKey="actual" 
            stroke={accentRed} 
            strokeDasharray="4 4"
            strokeWidth={2}
            fillOpacity={0}
            name="Baseline Trajectory"
            isAnimationActive={true}
            animationDuration={1800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
