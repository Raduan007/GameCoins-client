"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data = [], period }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-72 w-full bg-secondary/5 rounded-2xl border border-secondary/15 flex items-center justify-center text-text-dim text-xs animate-pulse">
        Initializing charts...
      </div>
    );
  }

  // Format data for chart display
  const chartData = data.map((item) => {
    let label = "";
    if (item.date) label = item.date;
    else if (item.week) label = item.week;
    else if (item.month) label = item.month;
    else if (item.year) label = item.year;

    return {
      name: label,
      revenue: item.revenue || 0,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="h-72 w-full bg-secondary/5 rounded-2xl border border-secondary/15 flex flex-col items-center justify-center p-6 text-center text-text-dim">
        <p className="text-sm font-semibold mb-1">No revenue entries found</p>
        <p className="text-xs">There are no paid orders recorded in the database during this period.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2547" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#a5a2cc"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#a5a2cc"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#161328",
              borderColor: "rgba(79, 70, 229, 0.3)",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "12px",
            }}
            formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, "Revenue"]}
            labelStyle={{ fontWeight: "bold", color: "#a5a2cc" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4f46e5"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
