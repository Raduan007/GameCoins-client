"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";

export default function AdminStatCard({ title, value, icon: Icon, loading, isPrimary }) {
  if (loading) {
    return (
      <Card className="border border-secondary/20 bg-secondary/5 backdrop-blur-xl rounded-2xl h-[120px]">
        <CardContent className="p-6 flex items-center justify-between h-full animate-pulse">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-surface-light rounded-md w-24" />
            <div className="h-8 bg-surface-light rounded-md w-16" />
          </div>
          <div className="h-12 w-12 rounded-xl bg-surface-light flex-shrink-0" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group ${
      isPrimary
        ? "border-primary/30 bg-primary/5 hover:border-primary/50"
        : "border-secondary/20 bg-secondary/5 hover:border-secondary/40"
    }`}>
      {/* Decorative Gradient Background */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none transition-all duration-300 opacity-20 group-hover:opacity-30 ${
        isPrimary ? "bg-gradient-to-bl from-primary to-transparent" : "bg-gradient-to-bl from-secondary to-transparent"
      }`} />

      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</p>
          <p className={`text-3xl font-black tracking-tight transition-all duration-300 ${
            isPrimary ? "text-primary group-hover:text-primary-light" : "text-secondary group-hover:text-secondary-light"
          }`}>
            {value}
          </p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm transition-all duration-300 flex-shrink-0 ${
          isPrimary
            ? "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20"
            : "bg-secondary/10 border-secondary/20 text-secondary group-hover:bg-secondary/20"
        }`}>
          {Icon && <Icon className="h-5.5 w-5.5 transition-transform group-hover:scale-110 duration-300" />}
        </div>
      </CardContent>
    </Card>
  );
}
