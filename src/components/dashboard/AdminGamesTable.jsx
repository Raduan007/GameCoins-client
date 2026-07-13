"use client";

import React, { useState } from "react";
import { Avatar, Button } from "@heroui/react";
import { Star, ShieldAlert, Edit2, Trash2, Eye, Server, Layers, Award, Loader2 } from "lucide-react";

export default function AdminGamesTable({
  games = [],
  onEdit,
  onDelete,
  onViewDetails,
  loading
}) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteClick = async (gameId, gameName) => {
    if (window.confirm(`Are you sure you want to permanently delete "${gameName}"? This will affect all packages linked to this game.`)) {
      try {
        setDeletingId(gameId);
        await onDelete(gameId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading && games.length === 0) {
    return (
      <div className="space-y-4">
        <div className="hidden md:block h-64 bg-surface-light/20 border border-border/10 rounded-2xl animate-pulse" />
        <div className="block md:hidden space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-surface-light/20 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/15 bg-secondary/5 rounded-2xl">
        <ShieldAlert className="h-10 w-10 text-text-dim mb-3" />
        <h4 className="text-sm font-bold text-white mb-1">No games found</h4>
        <p className="text-xs text-text-muted">Get started by adding a new game to the marketplace catalog.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-surface-light/30 text-xs font-bold uppercase tracking-wider text-text-muted">
                <th className="p-4 pl-6">Game Logo & Name</th>
                <th className="p-4">Category & Platform</th>
                <th className="p-4">Publisher</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status Badges</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((gm) => {
                const isDeleting = deletingId === gm._id;

                return (
                  <tr key={gm._id} className="border-b border-border/10 last:border-0 hover:bg-surface-light/20 transition-colors duration-200">
                    {/* Logo & Name */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={gm.logo}
                          name={gm.name}
                          radius="md"
                          className="w-10 h-10 border border-border bg-surface-light text-white text-xs flex-shrink-0"
                          fallback={gm.name?.charAt(0).toUpperCase()}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-white truncate">{gm.name}</span>
                          <span className="text-[10px] text-text-dim truncate">slug: {gm.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Platform */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white flex items-center gap-1">
                          <Layers className="h-3 w-3 text-secondary" /> {gm.category}
                        </span>
                        <span className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1">
                          <Server className="h-2.5 w-2.5" /> {gm.platform}
                        </span>
                      </div>
                    </td>

                    {/* Publisher */}
                    <td className="p-4 text-xs text-white font-medium">
                      {gm.publisher || "N/A"}
                    </td>

                    {/* Rating */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-primary">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span>{gm.rating !== undefined ? Number(gm.rating).toFixed(1) : "0.0"}</span>
                      </div>
                    </td>

                    {/* Status Badges */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border capitalize ${
                          gm.isActive !== false
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-error/10 text-error border-error/30"
                        }`}>
                          {gm.isActive !== false ? "Active" : "Inactive"}
                        </span>
                        {gm.isFeatured && (
                          <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-primary/10 border border-primary/20 text-primary">
                            Featured
                          </span>
                        )}
                        {gm.isPopular && (
                          <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-secondary/10 border border-secondary/20 text-secondary">
                            Popular
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
                        <Button
                          size="sm"
                          onPress={() => onViewDetails(gm)}
                          className="bg-secondary/15 hover:bg-secondary/30 text-white rounded-lg font-bold min-w-0 px-2.5 cursor-pointer text-xs flex items-center gap-1 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          onPress={() => onEdit(gm)}
                          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg font-bold min-w-0 px-2.5 cursor-pointer text-xs flex items-center gap-1 transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          disabled={isDeleting}
                          onPress={() => handleDeleteClick(gm._id, gm.name)}
                          className="bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-lg font-bold min-w-0 px-2.5 cursor-pointer text-xs flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stack Cards View */}
      <div className="block md:hidden space-y-4">
        {games.map((gm) => {
          const isDeleting = deletingId === gm._id;

          return (
            <div key={gm._id} className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl relative overflow-hidden p-5 space-y-4 text-xs">
              {/* Header Info */}
              <div className="flex justify-between items-start pb-2.5 border-b border-border/20">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={gm.logo}
                    name={gm.name}
                    radius="md"
                    className="w-10 h-10 border border-border bg-surface-light text-white text-xs flex-shrink-0"
                    fallback={gm.name?.charAt(0).toUpperCase()}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">{gm.name}</span>
                    <span className="text-[10px] text-text-dim">Category: {gm.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span>{gm.rating !== undefined ? Number(gm.rating).toFixed(1) : "0.0"}</span>
                </div>
              </div>

              {/* Attributes stack */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-dim font-semibold">Platform:</span>
                  <span className="font-bold text-white">{gm.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim font-semibold">Publisher:</span>
                  <span className="font-bold text-white truncate max-w-[150px]">{gm.publisher || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-dim font-semibold">Status:</span>
                  <div className="flex gap-1">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border capitalize ${
                      gm.isActive !== false ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"
                    }`}>
                      {gm.isActive !== false ? "Active" : "Inactive"}
                    </span>
                    {gm.isFeatured && (
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary/10 border border-primary/20 text-primary">
                        Featured
                      </span>
                    )}
                    {gm.isPopular && (
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold bg-secondary/10 border border-secondary/20 text-secondary">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex justify-between items-center pt-2.5 border-t border-border/20 gap-2">
                <Button
                  size="sm"
                  onPress={() => onViewDetails(gm)}
                  className="flex-1 bg-secondary/15 hover:bg-secondary/30 text-white rounded-lg font-bold min-w-0 py-3.5 text-[11px] flex items-center justify-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" /> Details
                </Button>
                <Button
                  size="sm"
                  onPress={() => onEdit(gm)}
                  className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg font-bold min-w-0 py-3.5 text-[11px] flex items-center justify-center gap-1"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  disabled={isDeleting}
                  onPress={() => handleDeleteClick(gm._id, gm.name)}
                  className="bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-lg font-bold min-w-0 px-3 py-3.5 text-[11px] flex items-center justify-center disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
