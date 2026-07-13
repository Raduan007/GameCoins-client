"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Eye, ShoppingBag, Loader2, AlertCircle, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const ORDER_STATUS_STYLES = {
  pending:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed:  "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled:  "bg-red-500/10 text-red-400 border-red-500/20",
};

const PAYMENT_STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  paid:    "bg-green-500/10 text-green-400 border-green-500/20",
  failed:  "bg-red-500/10 text-red-400 border-red-500/20",
};

const ORDER_STATUS_ICONS = {
  pending:    Clock,
  processing: RefreshCw,
  completed:  CheckCircle,
  cancelled:  XCircle,
};

function StatusBadge({ status, type = "order" }) {
  const styles = type === "payment" ? PAYMENT_STATUS_STYLES : ORDER_STATUS_STYLES;
  const Icon = type === "order" ? (ORDER_STATUS_ICONS[status] || Clock) : null;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${styles[status] || "bg-border/10 text-text-muted border-border/20"}`}>
      {Icon && <Icon className="h-2.5 w-2.5" />}
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border/20">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-surface-light/30 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/20 bg-surface-light/10 p-4 space-y-3 animate-pulse">
      <div className="h-4 bg-surface-light/30 rounded w-2/3" />
      <div className="h-3 bg-surface-light/20 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-surface-light/20 rounded-full" />
        <div className="h-6 w-16 bg-surface-light/20 rounded-full" />
      </div>
    </div>
  );
}

export default function AdminOrdersTable({ orders = [], loading, onViewDetails }) {
  if (loading && orders.length === 0) {
    return (
      <div className="space-y-4">
        {/* Desktop skeleton */}
        <div className="hidden md:block border border-secondary/15 bg-secondary/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30 bg-surface-light/20 text-xs font-bold uppercase tracking-wider text-text-muted">
                <th className="p-4 pl-6 text-left">Order</th>
                <th className="p-4 text-left">Buyer</th>
                <th className="p-4 text-left">Game / Package</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Order Status</th>
                <th className="p-4 text-left">Payment</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
        {/* Mobile skeleton */}
        <div className="md:hidden space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-14 text-center border border-border/15 bg-secondary/5 rounded-2xl">
        <ShoppingBag className="h-12 w-12 text-text-dim mb-4" />
        <h4 className="text-sm font-bold text-white mb-1">No orders found</h4>
        <p className="text-xs text-text-muted">No orders match the current filter or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Desktop Table ── */}
      <div className="hidden md:block border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-surface-light/30 text-xs font-bold uppercase tracking-wider text-text-muted">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Game / Package</th>
                <th className="p-4">Total</th>
                <th className="p-4">Order Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/15">
              {orders.map((order) => {
                const orderId = order._id?.toString() || "";
                const shortId = orderId.slice(-8).toUpperCase();
                const buyer = order.user || {};
                const game = order.game || {};
                const pkg = order.package || {};
                const date = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "—";

                return (
                  <tr key={orderId} className="hover:bg-surface-light/10 transition-colors group">
                    <td className="p-4 pl-6">
                      <div>
                        <p className="font-mono text-xs font-bold text-primary">#{shortId}</p>
                        <p className="text-[10px] text-text-dim mt-0.5">{date}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-semibold text-white truncate max-w-[140px]">{buyer.name || "—"}</p>
                        <p className="text-[10px] text-text-dim truncate max-w-[140px]">{buyer.email || "—"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-xs font-bold text-white truncate max-w-[160px]">{game.name || "—"}</p>
                        <p className="text-[10px] text-text-dim truncate max-w-[160px]">{pkg.name || "—"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-extrabold text-primary">
                        ${Number(order.totalPrice || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.orderStatus || "pending"} type="order" />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.paymentStatus || "pending"} type="payment" />
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        onPress={() => onViewDetails(order)}
                        className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-lg text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => {
          const orderId = order._id?.toString() || "";
          const shortId = orderId.slice(-8).toUpperCase();
          const buyer = order.user || {};
          const game = order.game || {};
          const pkg = order.package || {};
          const date = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "—";

          return (
            <div key={orderId} className="border border-secondary/15 bg-secondary/5 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-bold text-primary">#{shortId}</p>
                  <p className="text-[10px] text-text-dim mt-0.5">{date}</p>
                </div>
                <span className="text-sm font-extrabold text-primary">${Number(order.totalPrice || 0).toFixed(2)}</span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-white font-semibold">{buyer.name || "Unknown Buyer"}</p>
                <p className="text-text-dim">{buyer.email || "—"}</p>
                <p className="text-text-muted">{game.name || "—"} — {pkg.name || "—"}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusBadge status={order.orderStatus || "pending"} type="order" />
                <StatusBadge status={order.paymentStatus || "pending"} type="payment" />
              </div>

              <Button
                size="sm"
                onPress={() => onViewDetails(order)}
                className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-xl text-xs font-bold py-2 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                View Details
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
