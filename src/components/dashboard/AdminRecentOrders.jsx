"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import { Calendar, User, Tag, ShoppingBag, Gamepad2, CreditCard, ChevronRight } from "lucide-react";

export default function AdminRecentOrders({ orders = [], loading }) {
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
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="hidden md:block h-64 bg-surface-light/20 border border-border/10 rounded-2xl animate-pulse" />
        <div className="block md:hidden space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-surface-light/20 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="border border-border/15 bg-secondary/5 rounded-2xl p-12 text-center">
        <CardContent className="flex flex-col items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-text-dim mb-3" />
          <h4 className="text-sm font-bold text-white mb-1">No orders found</h4>
          <p className="text-xs text-text-muted">There has been no recent order activities logged on the server.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl shadow-secondary/2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-surface-light/30 text-xs font-bold uppercase tracking-wider text-text-muted">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Game & Package</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Order Status</th>
                <th className="p-4 pr-6">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => {
                const buyer = ord.user || {};
                return (
                  <tr key={ord._id} className="border-b border-border/10 last:border-0 hover:bg-surface-light/20 transition-colors duration-200">
                    <td className="p-4 pl-6 font-bold text-text-dim text-xs select-all">
                      #{ord._id ? ord._id.slice(-6).toUpperCase() : "N/A"}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-white truncate max-w-[130px]" title={ord.playerName || buyer.name}>
                        {ord.playerName || buyer.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-text-dim truncate max-w-[130px]" title={buyer.email}>
                        {buyer.email || "No email"}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {ord.game?.logo && (
                          <img
                            src={ord.game.logo}
                            alt={ord.game.name}
                            className="w-7 h-7 rounded-md object-cover border border-border"
                          />
                        )}
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{ord.game?.name || "Game Token"}</p>
                          <p className="text-xs text-text-muted leading-tight">{ord.package?.name || "Coins Bundle"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-black text-primary">
                      ${ord.totalPrice ? ord.totalPrice.toFixed(2) : "0.00"}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getPaymentStatusBadge(ord.paymentStatus)}`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getOrderStatusBadge(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-xs text-text-muted font-semibold">
                      {formatDate(ord.createdAt)}
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
        {orders.map((ord) => {
          const buyer = ord.user || {};
          return (
            <Card key={ord._id} className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300">
              <CardContent className="p-5 space-y-3.5 text-xs">
                {/* Header */}
                <div className="flex justify-between items-center pb-2.5 border-b border-border/20">
                  <span className="font-bold text-text-dim text-xs select-all">
                    #{ord._id ? ord._id.slice(-6).toUpperCase() : "N/A"}
                  </span>
                  <span className="text-[10px] text-text-muted font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-secondary" /> {formatDate(ord.createdAt)}
                  </span>
                </div>

                {/* Grid */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-dim font-semibold flex items-center gap-1"><User className="h-3.5 w-3.5" /> Buyer</span>
                    <span className="font-bold text-white">{ord.playerName || buyer.name || "Anonymous"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-dim font-semibold flex items-center gap-1"><Gamepad2 className="h-3.5 w-3.5" /> Game Item</span>
                    <span className="font-bold text-white text-right max-w-[180px] truncate">
                      {ord.game?.name || "Game Token"} ({ord.package?.name || "Coins Pack"})
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-dim font-semibold flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Total Price</span>
                    <span className="font-black text-primary">${ord.totalPrice ? ord.totalPrice.toFixed(2) : "0.00"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-dim font-semibold flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> Payment</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getPaymentStatusBadge(ord.paymentStatus)}`}>
                      {ord.paymentStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-dim font-semibold flex items-center gap-1"><ShoppingBag className="h-3.5 w-3.5" /> Status</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getOrderStatusBadge(ord.orderStatus)}`}>
                      {ord.orderStatus}
                    </span>
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
