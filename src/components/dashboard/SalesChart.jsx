"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@heroui/react";
import { Calendar, TrendingUp } from "lucide-react";

export default function SalesChart({ data = [], loading }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (loading) {
    return (
      <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl shadow-xl border-secondary/10 h-[340px]">
        <CardContent className="p-6 flex flex-col justify-between h-full animate-pulse">
          <div className="flex justify-between items-center pb-4 border-b border-border/20">
            <div className="h-5 bg-surface-light rounded w-36" />
            <div className="h-5 bg-surface-light rounded w-24" />
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 px-4 py-8">
            {[30, 45, 60, 40, 80, 50, 75].map((h, i) => (
              <div key={i} className="bg-surface-light rounded-t-lg flex-1" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-surface-light rounded w-12" />
            <div className="h-3 bg-surface-light rounded w-12" />
            <div className="h-3 bg-surface-light rounded w-12" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl p-6 text-center border-secondary/10 h-[340px] flex items-center justify-center">
        <p className="text-text-muted text-sm">No sales chart details recorded.</p>
      </Card>
    );
  }

  // Chart Dimensions
  const w = 600;
  const h = 250;
  const padX = 50;
  const padY = 30;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  const maxVal = Math.max(...data.map(d => d.revenue), 10);
  const minVal = 0;
  const valRange = maxVal - minVal;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + chartH - ((d.revenue - minVal) / valRange) * chartH;
    return { x, y, date: d.date, revenue: d.revenue, sales: d.sales };
  });

  // SVG Line & Area path generators
  const lineD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = points.length > 0 
    ? `${lineD} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`
    : "";

  return (
    <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl shadow-xl border-secondary/10 relative overflow-hidden group">
      <CardContent className="p-6">
        {/* Chart Header */}
        <div className="flex justify-between items-center pb-4 border-b border-border/20 mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Revenue & Sales Trend
            </h3>
            <p className="text-xs text-text-dim">Historical sales volume and turnover growth.</p>
          </div>
          <span className="text-xs text-text-muted font-semibold flex items-center gap-1.5 bg-secondary/10 border border-secondary/15 px-3 py-1 rounded-xl">
            <Calendar className="h-3.5 w-3.5 text-primary" /> Active Timeline
          </span>
        </div>

        {/* Custom SVG Graph */}
        <div className="relative">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible select-none">
            {/* Definitions for Gradients */}
            <defs>
              <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.00" />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="var(--color-primary)" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const yVal = padY + chartH * ratio;
              const gridLabel = Math.round(maxVal - (maxVal * ratio));
              return (
                <g key={i} className="opacity-25 hover:opacity-40 transition-opacity">
                  <line
                    x1={padX}
                    y1={yVal}
                    x2={w - padX}
                    y2={yVal}
                    stroke="var(--color-text-dim)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padX - 8}
                    y={yVal + 3}
                    textAnchor="end"
                    fill="var(--color-text-muted)"
                    className="text-[10px] font-bold"
                  >
                    ${gridLabel}
                  </text>
                </g>
              );
            })}

            {/* SVG Area (Gradient fill) */}
            {areaD && (
              <path
                d={areaD}
                fill="url(#chartAreaGrad)"
                className="transition-all duration-300"
              />
            )}

            {/* SVG Line (Orange outline) */}
            {lineD && (
              <path
                d={lineD}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#shadow)"
                className="transition-all duration-300"
              />
            )}

            {/* Hover Guides */}
            {hoveredIdx !== null && points[hoveredIdx] && (
              <g>
                <line
                  x1={points[hoveredIdx].x}
                  y1={padY}
                  x2={points[hoveredIdx].x}
                  y2={padY + chartH}
                  stroke="var(--color-primary)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="animate-pulse"
                />
                <circle
                  cx={points[hoveredIdx].x}
                  cy={points[hoveredIdx].y}
                  r="6"
                  fill="var(--color-primary)"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="shadow-lg shadow-primary/40"
                />
              </g>
            )}

            {/* X-Axis labels (Dates) */}
            {points.map((p, i) => {
              // Only render subset of dates to prevent clutter
              const shouldRenderLabel = points.length < 8 || i % Math.round(points.length / 5) === 0 || i === points.length - 1;
              if (!shouldRenderLabel) return null;
              return (
                <text
                  key={i}
                  x={p.x}
                  y={h - padY + 16}
                  textAnchor="middle"
                  fill="var(--color-text-muted)"
                  className="text-[10px] font-semibold"
                >
                  {p.date}
                </text>
              );
            })}

            {/* Interactive vertical hover columns */}
            {points.map((p, i) => {
              const colWidth = chartW / (points.length - 1 || 1);
              const colX = p.x - colWidth / 2;
              return (
                <rect
                  key={i}
                  x={colX}
                  y={padY}
                  width={colWidth}
                  height={chartH}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Floating Tooltip Box */}
          {hoveredIdx !== null && points[hoveredIdx] && (
            <div
              className="absolute pointer-events-none bg-surface-light border border-secondary/20 p-3 rounded-xl shadow-xl text-left space-y-1 z-20 animate-fadeIn"
              style={{
                left: `${(points[hoveredIdx].x / w) * 100}%`,
                top: `${(points[hoveredIdx].y / h) * 100 - 45}%`,
                transform: "translateX(-50%)",
              }}
            >
              <p className="text-[9px] font-bold text-text-dim uppercase tracking-wider">{points[hoveredIdx].date}</p>
              <div className="flex flex-col text-xs font-bold space-y-0.5">
                <span className="text-primary">Revenue: ${points[hoveredIdx].revenue.toFixed(2)}</span>
                <span className="text-white">Sales: {points[hoveredIdx].sales} orders</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
