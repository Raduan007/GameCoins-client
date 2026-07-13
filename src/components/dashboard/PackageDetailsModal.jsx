"use client";

import React from "react";
import { Avatar, Button } from "@heroui/react";
import { X, Tag, Calendar, ShieldCheck, Coins, DollarSign, Layers } from "lucide-react";

export default function PackageDetailsModal({ isOpen, onClose, pkg }) {
  if (!isOpen || !pkg) return null;

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
      <div className="relative w-full max-w-md border border-secondary/20 bg-surface/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-surface/30">
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Tag className="h-4.5 w-4.5 text-primary" /> Package Details
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs overflow-y-auto max-h-[80vh]">
          {/* Game Banner Header */}
          <div className="flex items-center gap-3 p-4 border border-border/10 rounded-2xl bg-surface-light/10">
            <Avatar
              src={pkg.game?.logo}
              name={pkg.game?.name || "Game"}
              radius="lg"
              className="w-12 h-12 font-black border border-primary/20 bg-surface text-white text-base flex-shrink-0"
              fallback={(pkg.game?.name || "G").charAt(0).toUpperCase()}
            />
            <div className="space-y-1 text-left min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{pkg.game?.name || "N/A"}</h4>
              <p className="text-[10px] text-text-dim truncate">Associated Marketplace Game</p>
            </div>
          </div>

          {/* Details Stack */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center py-2.5 border-b border-border/10">
              <span className="text-text-dim font-bold uppercase tracking-wider text-[9px]">Package Name</span>
              <span className="font-bold text-white select-all text-right">{pkg.name}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-border/10">
              <span className="text-text-dim font-bold uppercase tracking-wider text-[9px]">Coin Amount</span>
              <span className="font-bold text-white flex items-center gap-1">
                <Coins className="h-3.5 w-3.5 text-primary" /> {pkg.amount?.toLocaleString()} Coins
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-border/10">
              <span className="text-text-dim font-bold uppercase tracking-wider text-[9px]">Retail Price</span>
              <span className="font-bold text-primary text-sm">${pkg.price?.toFixed(2)} {pkg.currency || "USD"}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-border/10">
              <span className="text-text-dim font-bold uppercase tracking-wider text-[9px]">Status</span>
              <div className="flex gap-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border capitalize ${
                  pkg.isActive !== false ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"
                }`}>
                  {pkg.isActive !== false ? "Active" : "Inactive"}
                </span>
                {pkg.isPopular && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary/10 border border-primary/20 text-primary">
                    Popular
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-border/10">
              <span className="text-text-dim font-bold uppercase tracking-wider text-[9px]">Package ID</span>
              <span className="font-mono text-white select-all text-right">{pkg._id}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-border/10">
              <span className="text-text-dim font-bold uppercase tracking-wider text-[9px]">Created Date</span>
              <span className="font-semibold text-white text-right">{formatDate(pkg.createdAt)}</span>
            </div>

            {pkg.description && (
              <div className="pt-2">
                <p className="text-text-dim font-bold uppercase tracking-wider text-[9px] mb-1">Description</p>
                <p className="p-3 border border-border/10 bg-surface-light/5 rounded-xl text-text-muted leading-relaxed select-text">
                  {pkg.description}
                </p>
              </div>
            )}
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
