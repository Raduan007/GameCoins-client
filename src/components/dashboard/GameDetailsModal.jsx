"use client";

import React from "react";
import { Avatar, Button } from "@heroui/react";
import { X, Gamepad2, Info, Star, Calendar, ShieldCheck, Layers, Server } from "lucide-react";

export default function GameDetailsModal({ isOpen, onClose, game }) {
  if (!isOpen || !game) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl border border-secondary/20 bg-surface/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-surface/30">
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Gamepad2 className="h-4.5 w-4.5 text-primary" /> Game Catalog Profile
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Banner + Logo layout */}
          <div className="relative rounded-2xl overflow-hidden border border-border/10">
            {/* Banner Image */}
            <div className="h-48 w-full bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${game.banner})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40" />
            </div>
            
            {/* Profile overlay */}
            <div className="p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 -mt-10 relative z-10">
              <Avatar
                src={game.logo}
                name={game.name}
                radius="lg"
                className="w-20 h-20 font-black border-2 border-primary/20 bg-surface text-white text-2xl flex-shrink-0 shadow-lg"
                fallback={game.name?.charAt(0).toUpperCase()}
              />
              <div className="space-y-1.5 text-center sm:text-left min-w-0 pt-10 sm:pt-11 flex-1">
                <h4 className="text-lg font-bold text-white truncate">{game.name}</h4>
                <p className="text-xs text-text-dim truncate">slug: <span className="font-mono">{game.slug}</span></p>
              </div>
            </div>
          </div>

          {/* Quick status details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
            <div className="bg-surface-light/5 border border-border/10 rounded-xl p-3 text-center">
              <p className="text-[9px] text-text-dim font-bold uppercase tracking-wider">Rating</p>
              <p className="font-bold text-white mt-1 flex items-center justify-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {Number(game.rating || 0).toFixed(1)}
              </p>
            </div>
            <div className="bg-surface-light/5 border border-border/10 rounded-xl p-3 text-center">
              <p className="text-[9px] text-text-dim font-bold uppercase tracking-wider">Category</p>
              <p className="font-bold text-white mt-1 flex items-center justify-center gap-1">
                <Layers className="h-3.5 w-3.5 text-secondary" /> {game.category}
              </p>
            </div>
            <div className="bg-surface-light/5 border border-border/10 rounded-xl p-3 text-center">
              <p className="text-[9px] text-text-dim font-bold uppercase tracking-wider">Platform</p>
              <p className="font-bold text-white mt-1 flex items-center justify-center gap-1">
                <Server className="h-3.5 w-3.5 text-secondary" /> {game.platform}
              </p>
            </div>
            <div className="bg-surface-light/5 border border-border/10 rounded-xl p-3 text-center">
              <p className="text-[9px] text-text-dim font-bold uppercase tracking-wider">Status</p>
              <div className="mt-1 flex flex-wrap gap-1 justify-center">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border capitalize ${
                  game.isActive !== false ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"
                }`}>
                  {game.isActive !== false ? "Active" : "Inactive"}
                </span>
                {game.isFeatured && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary/10 border border-primary/20 text-primary">
                    Featured
                  </span>
                )}
                {game.isPopular && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-secondary/10 border border-secondary/20 text-secondary">
                    Popular
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Publisher and metadata info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2.5 bg-surface-light/5 border border-border/10 rounded-xl p-3.5">
              <ShieldCheck className="h-4.5 w-4.5 text-secondary flex-shrink-0" />
              <div>
                <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Publisher</p>
                <p className="font-semibold text-white mt-0.5">{game.publisher || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-surface-light/5 border border-border/10 rounded-xl p-3.5">
              <Calendar className="h-4.5 w-4.5 text-secondary flex-shrink-0" />
              <div>
                <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Added Date</p>
                <p className="font-semibold text-white mt-0.5">{formatDate(game.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Game Description */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-1.5 pb-1 border-b border-border/10">
              <Info className="h-4 w-4 text-primary" /> Descriptions & Details
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-text-muted font-bold uppercase">Short Description</p>
                <p className="text-xs text-white leading-relaxed mt-1 font-medium">{game.shortDescription}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted font-bold uppercase">Full Description</p>
                <p className="text-xs text-text-muted leading-relaxed whitespace-pre-wrap mt-1">{game.fullDescription}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/20 bg-surface/30 flex justify-end">
          <Button
            size="sm"
            onPress={onClose}
            className="bg-secondary/15 hover:bg-secondary/30 text-white rounded-xl font-bold py-4.5 px-4 cursor-pointer text-xs transition-all"
          >
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
}
