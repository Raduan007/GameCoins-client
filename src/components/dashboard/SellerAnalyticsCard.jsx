"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function SellerAnalyticsCard({ title, value, icon: Icon, loading, trend }) {
  if (loading) {
    return (
      <Card className="border border-secondary/20 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg h-[120px]">
        <CardContent className="p-6 flex items-center justify-between h-full">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-surface-light rounded-md w-24 animate-pulse" />
            <div className="h-8 bg-surface-light rounded-md w-20 animate-pulse" />
          </div>
          <div className="h-12 w-12 rounded-xl bg-surface-light animate-pulse flex-shrink-0" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = trend && !trend.startsWith("-");

  return (
    <Card className="border border-secondary/20 bg-secondary/5 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:bg-secondary/10 shadow-lg shadow-secondary/5 group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none group-hover:from-primary/20 transition-all duration-300" />
      
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-primary tracking-tight transition-all duration-300 group-hover:text-primary-light">
            {value}
          </p>
          {trend && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? <TrendingUp className="h-3 w-3 animate-bounce" /> : <TrendingDown className="h-3 w-3" />}
              {trend}
            </span>
          )}
        </div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-primary border border-secondary/20 shadow-md group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300 flex-shrink-0">
          {Icon && <Icon className="h-6 w-6 transition-transform group-hover:scale-110 duration-300" />}
        </div>
      </CardContent>
    </Card>
  );
}
