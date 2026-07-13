"use client";

import React from "react";
import { Gamepad2, Award } from "lucide-react";

export default function TopSellingGames({ games = [] }) {
  if (games.length === 0) {
    return (
      <div className="min-h-72 border border-secondary/15 bg-secondary/5 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-text-dim">
        <Gamepad2 className="h-10 w-10 text-text-muted mb-3" />
        <p className="text-sm font-semibold mb-1">No top selling games available</p>
        <p className="text-xs">Once orders are completed and payments are processed, game sales performance will be ranked here.</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...games.map((g) => g.revenue), 1);

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case 2:
        return "bg-slate-300/10 text-slate-300 border-slate-300/30";
      case 3:
        return "bg-amber-700/10 text-amber-700 border-amber-700/30";
      default:
        return "bg-secondary/10 text-text-dim border-border/30";
    }
  };

  return (
    <div className="border border-secondary/15 bg-secondary/5 rounded-2xl p-5 space-y-4">
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white tracking-wide">Top Selling Games</h4>
        <p className="text-xs text-text-dim">Performance ranking by total collected revenue.</p>
      </div>
      <div className="space-y-3.5">
        {games.map((game, index) => {
          const rank = index + 1;
          const percentage = ((game.revenue / maxRevenue) * 100).toFixed(0);

          return (
            <div key={game.gameId || index} className="space-y-1.5 group">
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`h-6 w-6 rounded-lg border flex items-center justify-center text-xs font-black ${getRankBadgeColor(rank)}`}>
                    {rank <= 3 ? <Award className="h-3.5 w-3.5" /> : rank}
                  </span>
                  <span className="font-bold text-xs text-white truncate group-hover:text-primary transition-all">
                    {game.name}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-extrabold text-xs text-primary block">
                    ${parseFloat(game.revenue).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-text-dim font-bold">
                    {game.orders} {game.orders === 1 ? "order" : "orders"}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-surface-light/45 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
