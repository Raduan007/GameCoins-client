"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import { Gamepad2, ShoppingBag, Clock, CreditCard, AlertCircle, Calendar } from "lucide-react";

export default function SellerRecentOrders({ orders = [], loading, error }) {
  // Badges styling helpers
  const getPaymentStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "failed":
        return "bg-error/10 text-error border-error/20";
      case "pending":
      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  const getOrderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
        return "bg-error/10 text-error border-error/20";
      case "pending":
      case "processing":
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <Card className="border border-error/20 bg-error/10 p-6 rounded-2xl text-red-200">
        <CardContent className="flex items-center gap-3 p-0">
          <AlertCircle className="h-5 w-5 text-error flex-shrink-0" />
          <div className="text-sm font-semibold">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Desktop Skeleton Table */}
        <div className="hidden md:block border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/40">
            <div className="h-6 bg-surface-light rounded-md w-36 animate-pulse" />
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-surface-light/20 text-xs font-bold uppercase tracking-wider text-text-muted">
                <th className="p-4">Order ID</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Game / Package</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((idx) => (
                <tr key={idx} className="border-b border-border/20 last:border-0">
                  <td className="p-4"><div className="h-4 bg-surface-light rounded w-16 animate-pulse" /></td>
                  <td className="p-4"><div className="h-4 bg-surface-light rounded w-24 animate-pulse" /></td>
                  <td className="p-4"><div className="h-4 bg-surface-light rounded w-40 animate-pulse" /></td>
                  <td className="p-4"><div className="h-4 bg-surface-light rounded w-12 animate-pulse" /></td>
                  <td className="p-4"><div className="h-6 bg-surface-light rounded-full w-16 animate-pulse" /></td>
                  <td className="p-4"><div className="h-6 bg-surface-light rounded-full w-20 animate-pulse" /></td>
                  <td className="p-4"><div className="h-4 bg-surface-light rounded w-20 animate-pulse" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Skeleton Cards */}
        <div className="block md:hidden space-y-4">
          {[1, 2, 3].map((idx) => (
            <Card key={idx} className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl animate-pulse">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/20">
                  <div className="h-4 bg-surface-light rounded w-20" />
                  <div className="h-4 bg-surface-light rounded w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-light rounded w-44" />
                  <div className="h-4 bg-surface-light rounded w-28" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-surface-light rounded-full w-16" />
                  <div className="h-6 bg-surface-light rounded-full w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl shadow-xl rounded-2xl">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-surface-light border border-border rounded-full flex items-center justify-center text-text-dim mb-4">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">No orders found</h4>
          <p className="text-sm text-text-muted max-w-sm">
            There are currently no orders placed for your packages.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop view: Table */}
      <div className="hidden md:block border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl shadow-secondary/2 border-secondary/10">
        <div className="p-6 border-b border-border/40 bg-surface/10 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-wide">Recent Orders</h3>
          <span className="text-xs text-text-dim font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-primary" /> Live history
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-surface-light/30 text-xs font-bold uppercase tracking-wider text-text-muted">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Game / Package</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const { _id, playerName, playerId, quantity, totalPrice, paymentStatus, orderStatus, createdAt, game, package: pkg } = order;
                return (
                  <tr key={_id} className="border-b border-border/10 last:border-0 hover:bg-surface-light/20 transition-colors duration-200">
                    <td className="p-4 pl-6 font-bold text-text-dim text-xs select-all">
                      #{_id ? _id.slice(-6).toUpperCase() : "N/A"}
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {playerName || playerId || "Anonymous"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {game?.logo && (
                          <img
                            src={game.logo}
                            alt={game.name}
                            className="w-7 h-7 rounded-md object-cover border border-border"
                          />
                        )}
                        <div>
                          <p className="text-sm font-bold text-white">{game?.name || "Game Token"}</p>
                          <p className="text-xs text-text-muted">{pkg?.name || "Coins Package"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-black text-primary">
                      ${totalPrice ? totalPrice.toFixed(2) : "0.00"}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getPaymentStatusBadge(paymentStatus)}`}>
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getOrderStatusBadge(orderStatus)}`}>
                        {orderStatus}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-sm text-text-muted font-medium">
                      {formatDate(createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view: Cards list */}
      <div className="block md:hidden space-y-4">
        <h3 className="text-lg font-bold text-white tracking-wide px-1">Recent Orders</h3>
        {orders.map((order) => {
          const { _id, playerName, playerId, quantity, totalPrice, paymentStatus, orderStatus, createdAt, game, package: pkg } = order;
          return (
            <Card key={_id} className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 border-secondary/10">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/20">
                  <span className="font-bold text-text-dim text-xs select-all">
                    #{_id ? _id.slice(-6).toUpperCase() : "N/A"}
                  </span>
                  <span className="text-xs text-text-muted font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formatDate(createdAt)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider block">Buyer</span>
                    <span className="text-sm font-bold text-white">{playerName || playerId || "Anonymous"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider block">Item</span>
                    <span className="text-sm font-bold text-white">{game?.name || "Game Token"} — {pkg?.name || "Bundle"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider block">Amount</span>
                      <span className="text-base font-black text-primary">${totalPrice ? totalPrice.toFixed(2) : "0.00"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getPaymentStatusBadge(paymentStatus)}`}>
                        {paymentStatus}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getOrderStatusBadge(orderStatus)}`}>
                        {orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
