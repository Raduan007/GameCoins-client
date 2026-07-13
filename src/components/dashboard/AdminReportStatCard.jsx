"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";

export default function AdminReportStatCard({ title, value, icon: Icon, loading, isPrimary }) {
  return (
    <Card className={`border relative overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-lg ${
      isPrimary
        ? "border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/5"
        : "border-secondary/15 bg-secondary/5 hover:bg-secondary/10"
    }`}>
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-dim truncate">
            {title}
          </p>
          {loading ? (
            <div className="h-7 w-2/3 bg-surface-light/35 rounded animate-pulse" />
          ) : (
            <h3 className={`text-xl font-extrabold tracking-tight truncate ${
              isPrimary ? "text-primary bg-clip-text" : "text-white"
            }`}>
              {value}
            </h3>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border flex-shrink-0 ${
          isPrimary
            ? "bg-primary/20 border-primary/30 text-primary shadow-md shadow-primary/25"
            : "bg-surface-light/30 border-border/30 text-text-muted"
        }`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </CardContent>
    </Card>
  );
}
