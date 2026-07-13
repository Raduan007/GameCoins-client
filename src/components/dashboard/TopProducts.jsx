"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import { Trophy, Star, Gamepad2, Tag, TrendingUp } from "lucide-react";

export default function TopProducts({ products = [], loading }) {
  if (loading) {
    return (
      <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl shadow-xl border-secondary/10 h-[340px]">
        <CardContent className="p-6 flex flex-col justify-between h-full animate-pulse">
          <div className="h-5 bg-surface-light rounded w-36 mb-4" />
          <div className="space-y-4 flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded bg-surface-light" />
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-light rounded w-24" />
                    <div className="h-3 bg-surface-light rounded w-16" />
                  </div>
                </div>
                <div className="h-4 bg-surface-light rounded w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl p-6 text-center border-secondary/10 h-[340px] flex items-center justify-center">
        <p className="text-text-muted text-sm">No best selling statistics recorded.</p>
      </Card>
    );
  }

  return (
    <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl shadow-xl border-secondary/10 h-full">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-border/20 mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Trophy className="h-4.5 w-4.5 text-warning" /> Top Performing Products
            </h3>
            <p className="text-xs text-text-dim">Your highest grossing game coin bundles.</p>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {products.map((item, idx) => {
            const { name, gameName, sales, revenue } = item;
            
            // Medals or ratings visual indicators
            const getRankIcon = (index) => {
              switch (index) {
                case 0:
                  return <Star className="h-4 w-4 text-warning fill-warning" />;
                case 1:
                  return <Star className="h-4 w-4 text-slate-300 fill-slate-300" />;
                case 2:
                  return <Star className="h-4 w-4 text-amber-600 fill-amber-600" />;
                default:
                  return <span className="text-[10px] text-text-muted font-bold px-1.5">{index + 1}</span>;
              }
            };

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 border border-border/10 rounded-xl bg-surface-light/10 hover:bg-surface-light/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  {/* Medal badge */}
                  <div className="h-6 w-6 rounded-md flex items-center justify-center bg-surface-light border border-border">
                    {getRankIcon(idx)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{name}</h4>
                    <p className="text-[11px] text-text-muted font-semibold leading-tight mt-0.5">{gameName || "Unknown Game"}</p>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <p className="text-sm font-black text-primary">${revenue ? revenue.toFixed(2) : "0.00"}</p>
                  <p className="text-[10px] text-text-muted font-semibold">{sales} bundle sales</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
