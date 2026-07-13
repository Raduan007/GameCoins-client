"use client";

import React, { useState } from "react";
import { Avatar, Button } from "@heroui/react";
import { ShieldAlert, Edit2, Trash2, Tag, Coins, DollarSign, Loader2 } from "lucide-react";

export default function AdminPackagesTable({
  packages = [],
  onEdit,
  onDelete,
  loading
}) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteClick = async (pkgId, pkgName) => {
    if (window.confirm(`Are you sure you want to permanently delete package "${pkgName}"?`)) {
      try {
        setDeletingId(pkgId);
        await onDelete(pkgId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading && packages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="hidden md:block h-64 bg-surface-light/20 border border-border/10 rounded-2xl animate-pulse" />
        <div className="block md:hidden space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-surface-light/20 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/15 bg-secondary/5 rounded-2xl">
        <ShieldAlert className="h-10 w-10 text-text-dim mb-3" />
        <h4 className="text-sm font-bold text-white mb-1">No packages found</h4>
        <p className="text-xs text-text-muted">Add a package or coins amount to get started.</p>
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
                <th className="p-4 pl-6">Associated Game</th>
                <th className="p-4">Package Name</th>
                <th className="p-4">Coin Amount</th>
                <th className="p-4">Retail Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => {
                const isDeleting = deletingId === pkg._id;

                return (
                  <tr key={pkg._id} className="border-b border-border/10 last:border-0 hover:bg-surface-light/20 transition-colors duration-200">
                    {/* Game Link Info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={pkg.game?.logo}
                          name={pkg.game?.name || "Game"}
                          radius="md"
                          className="w-8 h-8 border border-border bg-surface-light text-white text-xs flex-shrink-0"
                          fallback={(pkg.game?.name || "G").charAt(0).toUpperCase()}
                        />
                        <span className="text-sm font-bold text-white truncate">{pkg.game?.name || "N/A"}</span>
                      </div>
                    </td>

                    {/* Package Name */}
                    <td className="p-4 text-xs font-bold text-white select-all">
                      {pkg.name}
                    </td>

                    {/* Coin Amount */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <Coins className="h-3.5 w-3.5 text-primary" />
                        <span>{pkg.amount?.toLocaleString()} Coins</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-black text-xs text-primary">
                      ${pkg.price?.toFixed(2)} {pkg.currency || "USD"}
                    </td>

                    {/* Status Badges */}
                    <td className="p-4">
                      <div className="flex gap-1.5">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border capitalize ${
                          pkg.isActive !== false
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-error/10 text-error border-error/30"
                        }`}>
                          {pkg.isActive !== false ? "Active" : "Inactive"}
                        </span>
                        {pkg.isPopular && (
                          <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-primary/10 border border-primary/20 text-primary">
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
                          onPress={() => onEdit(pkg)}
                          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg font-bold min-w-0 px-2.5 cursor-pointer text-xs flex items-center gap-1 transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          disabled={isDeleting}
                          onPress={() => handleDeleteClick(pkg._id, pkg.name)}
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
        {packages.map((pkg) => {
          const isDeleting = deletingId === pkg._id;

          return (
            <div key={pkg._id} className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl p-5 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-border/20">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    src={pkg.game?.logo}
                    name={pkg.game?.name || "Game"}
                    radius="md"
                    className="w-7 h-7 border border-border bg-surface-light text-white text-[10px] flex-shrink-0"
                    fallback={(pkg.game?.name || "G").charAt(0).toUpperCase()}
                  />
                  <span className="font-bold text-white text-sm truncate max-w-[130px]">{pkg.game?.name || "N/A"}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-primary text-sm">${pkg.price?.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-dim font-semibold">Package:</span>
                  <span className="font-bold text-white truncate max-w-[170px] select-all">{pkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim font-semibold">Coins Amount:</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5 text-primary" /> {pkg.amount?.toLocaleString()} Coins
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-dim font-semibold">Status:</span>
                  <div className="flex gap-1.5">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border capitalize ${
                      pkg.isActive !== false ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"
                    }`}>
                      {pkg.isActive !== false ? "Active" : "Inactive"}
                    </span>
                    {pkg.isPopular && (
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary/10 border border-primary/20 text-primary">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2.5 border-t border-border/20">
                <Button
                  size="sm"
                  onPress={() => onEdit(pkg)}
                  className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg font-bold min-w-0 py-3.5 text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Info
                </Button>
                <Button
                  size="sm"
                  disabled={isDeleting}
                  onPress={() => handleDeleteClick(pkg._id, pkg.name)}
                  className="bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-lg font-bold min-w-0 px-3.5 py-3.5 text-xs flex items-center justify-center transition-all disabled:opacity-50"
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
