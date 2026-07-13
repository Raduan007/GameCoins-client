"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function OrderStatusChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-72 w-full bg-secondary/5 rounded-2xl border border-secondary/15 flex items-center justify-center text-text-dim text-xs animate-pulse">
        Initializing chart...
      </div>
    );
  }

  // Format data
  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count,
    }));

  const COLORS = {
    Pending: "#f59e0b",     // Amber
    Processing: "#8b5cf6",  // Purple/Violet
    Completed: "#10b981",   // Emerald
    Cancelled: "#f43f5e",   // Rose
  };

  if (chartData.length === 0) {
    return (
      <div className="h-72 w-full bg-secondary/5 rounded-2xl border border-secondary/15 flex flex-col items-center justify-center p-6 text-center text-text-dim">
        <p className="text-sm font-semibold mb-1">No orders found</p>
        <p className="text-xs">There are no orders registered during this period.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name] || "#6b7280"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#161328",
              borderColor: "rgba(139, 92, 246, 0.3)",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry) => (
              <span className="text-xs font-bold text-white px-1">
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
