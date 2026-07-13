"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, Button } from "@heroui/react";
import { Star, Gamepad2, ShoppingCart, Trash2, ShieldAlert } from "lucide-react";

export default function WishlistCard({ item, onRemove }) {
  const { _id, game } = item;
  const [deleting, setDeleting] = useState(false);

  const handleRemove = async () => {
    try {
      setDeleting(true);
      await onRemove(_id);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setDeleting(false);
    }
  };

  return (
    <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 flex flex-col h-full">
      {/* Game Banner Thumbnail */}
      <div className="relative h-40 w-full overflow-hidden border-b border-border/40 bg-surface-light">
        {game?.banner ? (
          <img
            src={game.banner}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-full h-full bg-surface-light items-center justify-center text-text-muted hidden"
          style={{ display: game?.banner ? "none" : "flex" }}
        >
          <Gamepad2 className="h-10 w-10 opacity-30" />
        </div>

        {/* Rating tag */}
        {game?.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-yellow-500 z-10">
            <Star className="h-3.5 w-3.5 fill-current" />
            {game.rating.toFixed(1)}
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Game Info */}
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-white tracking-wide truncate" title={game?.name}>
            {game?.name || "Game Token"}
          </h4>
          <p className="text-xs text-text-muted font-bold truncate">
            {game?.publisher || "Unknown Publisher"}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-surface-light border border-border rounded text-text-muted">
              {game?.category || "Action"}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-surface-light border border-border rounded text-text-muted">
              {game?.platform || "PC"}
            </span>
          </div>
        </div>

        {/* Actions Button Panel */}
        <div className="flex items-center gap-3 pt-3 border-t border-border/30">
          <Link href={`/#popular-games`} className="flex-1">
            <Button
              className="w-full flex items-center justify-center gap-1.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-all duration-200 cursor-pointer py-5.5 shadow-md shadow-primary/10"
            >
              <ShoppingCart className="h-4 w-4" />
              Buy Now
            </Button>
          </Link>

          <Button
            onPress={handleRemove}
            isLoading={deleting}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border hover:border-error/40 hover:bg-error/10 text-text-muted hover:text-error transition-all duration-200 cursor-pointer p-0"
            title="Remove from Wishlist"
          >
            {!deleting && <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
