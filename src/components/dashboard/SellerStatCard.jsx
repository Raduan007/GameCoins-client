"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";

export default function SellerStatCard({ title, value, icon: Icon, loading }) {
  if (loading) {
    return (
      <Card className="border border-secondary/20 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg shadow-secondary/5 h-[116px]">
        <CardContent className="p-6 flex items-center justify-between h-full">
          <div className="space-y-3 flex-1">
            {/* Title Skeleton */}
            <div className="h-4 bg-surface-light rounded-md w-24 animate-pulse" />
            {/* Value Skeleton */}
            <div className="h-8 bg-surface-light rounded-md w-16 animate-pulse" />
          </div>
          {/* Icon Skeleton */}
          <div className="h-12 w-12 rounded-xl bg-surface-light animate-pulse flex-shrink-0" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-secondary/20 bg-secondary/5 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:bg-secondary/10 shadow-lg shadow-secondary/5 group">
      {/* Decorative subtle blue/orange glow inside */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none group-hover:from-primary/20 transition-all duration-300" />
      
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-primary tracking-tight transition-all duration-300 group-hover:text-primary-light">
            {value}
          </p>
        </div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-primary border border-secondary/20 shadow-md shadow-secondary/5 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300 flex-shrink-0">
          {Icon && <Icon className="h-6 w-6 transition-transform group-hover:scale-110 duration-300" />}
        </div>
      </CardContent>
    </Card>
  );
}
