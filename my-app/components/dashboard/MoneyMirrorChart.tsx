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

import { useEffect, useState, useMemo } from "react";
import { useTheme } from "@/lib/hooks/useTheme";

interface MoneyMirrorChartProps {
  wasteBefore?: number;
  wasteAfter?: number;
}

export default function MoneyMirrorChart({ wasteBefore = 4000, wasteAfter = 2500 }: MoneyMirrorChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const data = useMemo(() => {
    return [
      { name: "Month 3", waste: 2000, save: 1000 },
      { name: "Month 6", waste: 4000, save: 2000 },
      { name: "Month 9", waste: 7000, save: 3000 },
      { name: "Month 12", waste: 12000, save: 5000 },
      { name: "Month 24", waste: 30000, save: 12000 }
    ];
  }, []);

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
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentGreen} stopOpacity={0.4} />
              <stop offset="95%" stopColor={accentGreen} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentRed} stopOpacity={0.3} />
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
            tick={{ fill: tickColor, fontSize: 12, fontWeight: 600 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            formatter={(value: any, name: any) => {
              const numVal = Number(value);
              if (name === "waste") return [`₹${numVal.toLocaleString()} wasted`, "Baseline (Red)"];
              if (name === "save") return [`₹${numVal.toLocaleString()} saved`, "Optimized (Green)"];
              return [`₹${numVal.toLocaleString()}`, String(name)];
            }}
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: `1px solid ${tooltipBorder}`, 
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
            }}
            itemStyle={{ fontSize: "13px", fontWeight: 700 }}
            labelStyle={{ color: tickColor, marginBottom: "8px", fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            name="waste"
            dataKey="waste" 
            stroke={accentRed} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#redGradient)" 
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Area 
            type="monotone" 
            name="save"
            dataKey="save" 
            stroke={accentGreen} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#greenGradient)" 
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              if (payload.name === "Month 9") {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={accentGreen}
                    stroke={tooltipBg}
                    strokeWidth={2}
                    key={`dot-${payload.name}`}
                  />
                );
              }
              return <svg key={`empty-${payload?.name || Math.random()}`}></svg>;
            }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
