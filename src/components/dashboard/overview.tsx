"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Seg", total: 12 },
  { name: "Ter", total: 45 },
  { name: "Qua", total: 32 },
  { name: "Qui", total: 80 },
  { name: "Sex", total: 54 },
  { name: "Sáb", total: 95 },
  { name: "Dom", total: 142 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "4 4" }}
          contentStyle={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--sidebar-border)", 
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            fontSize: "12px",
            color: "var(--foreground)"
          }}
          itemStyle={{ color: "var(--accent)", fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="var(--accent)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorTotal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
