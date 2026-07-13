"use client";

import React from "react";
import { User2, TrendingUp } from "lucide-react";

export default function SellerPerformanceTable({ sellers = [] }) {
  if (sellers.length === 0) {
    return (
      <div className="min-h-72 border border-secondary/15 bg-secondary/5 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-text-dim">
        <User2 className="h-10 w-10 text-text-muted mb-3" />
        <p className="text-sm font-semibold mb-1">No merchant records found</p>
        <p className="text-xs">Registered sellers and their sales logs will show up here.</p>
      </div>
    );
  }

  return (
    <div className="border border-secondary/15 bg-secondary/5 rounded-2xl p-5 space-y-4">
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white tracking-wide">Seller Performance Tally</h4>
        <p className="text-xs text-text-dim">Sales indicators and listing counts compiled per active merchant.</p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/20 text-text-dim uppercase tracking-wider font-extrabold text-[10px]">
              <th className="py-3 px-2">Merchant Name</th>
              <th className="py-3 px-2 text-center">Products Listed</th>
              <th className="py-3 px-2 text-center">Orders Fulfilled</th>
              <th className="py-3 px-2 text-right">Revenue Generated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10 font-medium text-white">
            {sellers.map((seller, index) => (
              <tr key={index} className="hover:bg-secondary/5 transition-all">
                <td className="py-3.5 px-2 font-bold text-white flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs">
                    {seller.sellerName.charAt(0).toUpperCase()}
                  </div>
                  {seller.sellerName}
                </td>
                <td className="py-3.5 px-2 text-center text-text-muted">{seller.totalProducts}</td>
                <td className="py-3.5 px-2 text-center text-text-muted">{seller.totalOrders}</td>
                <td className="py-3.5 px-2 text-right font-extrabold text-primary">
                  ${parseFloat(seller.revenueGenerated).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {sellers.map((seller, index) => (
          <div
            key={index}
            className="border border-secondary/15 bg-secondary/5 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                {seller.sellerName.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-sm text-white">{seller.sellerName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="bg-surface-light/35 border border-border/10 p-2 rounded-lg space-y-0.5">
                <span className="text-text-dim uppercase font-bold block">Products</span>
                <span className="font-extrabold text-white text-xs">{seller.totalProducts}</span>
              </div>
              <div className="bg-surface-light/35 border border-border/10 p-2 rounded-lg space-y-0.5">
                <span className="text-text-dim uppercase font-bold block">Orders</span>
                <span className="font-extrabold text-white text-xs">{seller.totalOrders}</span>
              </div>
              <div className="bg-surface-light/35 border border-border/10 p-2 rounded-lg space-y-0.5">
                <span className="text-text-dim uppercase font-bold block">Revenue</span>
                <span className="font-extrabold text-primary text-xs">
                  ${parseFloat(seller.revenueGenerated).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
