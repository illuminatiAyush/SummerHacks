"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useTheme } from "@/lib/hooks/useTheme";

const COLORS = ["#EF4444", "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#14B8A6"];

export function SpendingDonutChart({ data }: { data: Record<string, number> }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const chartData = Object.entries(data)
    .filter(([_, val]) => val > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const tooltipBg = isDark ? "#09090B" : "#FFFFFF";
  const tooltipBorder = isDark ? "#1F1F1F" : "#E5E7EB";
  const tooltipText = isDark ? "#A1A1AA" : "#52525B";

  if (chartData.length === 0) {
     return <div className="flex bg-surface items-center justify-center h-full text-secondary text-sm">No data available</div>;
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1500}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Amount"]}
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: `1px solid ${tooltipBorder}`, 
              borderRadius: "8px",
              boxShadow: "none",
              color: tooltipText,
              fontWeight: 600,
              fontSize: "12px"
            }}
            itemStyle={{ color: isDark ? "#E4E4E7" : "#18181B" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ComparativeImpactChart({ wasteBefore, wasteAfter }: { wasteBefore: number, wasteAfter: number }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartData = [
    {
      name: "Monthly Impact",
      "Current Loss": wasteBefore,
      "Loss After Changes": wasteAfter,
    }
  ];

  const tooltipBg = isDark ? "#09090B" : "#FFFFFF";
  const tooltipBorder = isDark ? "#1F1F1F" : "#E5E7EB";
  const textColor = isDark ? "#A1A1AA" : "#52525B";
  const gridColor = isDark ? "#27272A" : "#F4F4F5";

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12, fontWeight: 600 }} dy={10} />
          <YAxis hide />
          <Tooltip 
            formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, undefined]}
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: `1px solid ${tooltipBorder}`, 
              borderRadius: "8px",
              boxShadow: "none"
            }}
            itemStyle={{ fontSize: "12px", fontWeight: 700, color: textColor }}
            cursor={{ fill: isDark ? '#27272A' : '#F4F4F5' }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px", fontWeight: 600, color: textColor }} />
          <Bar dataKey="Current Loss" fill="#EF4444" radius={[4, 4, 0, 0]} animationDuration={1500} />
          <Bar dataKey="Loss After Changes" fill="#10B981" radius={[4, 4, 0, 0]} animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
