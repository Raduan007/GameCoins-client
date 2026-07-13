"use client";

import React from "react";
import { Button } from "@heroui/react";
import {
  X, CreditCard, User, Gamepad2, ShoppingBag,
  Clock, CheckCircle, XCircle, ShieldCheck, ShieldX
} from "lucide-react";

const STATUS_STYLES = {
  order: {
    pending:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed:  "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled:  "bg-red-500/10 text-red-400 border-red-500/20",
  },
  payment: {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    paid:    "bg-green-500/10 text-green-400 border-green-500/20",
    failed:  "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

const ORDER_STATUS_ICONS = {
  pending:    Clock,
  processing: Clock,
  completed:  CheckCircle,
  cancelled:  XCircle,
};

const PAYMENT_STATUS_ICONS = {
  pending: Clock,
  paid:    ShieldCheck,
  failed:  ShieldX,
};

const PAYMENT_METHOD_LABELS = {
  bkash: "bKash",
  nagad: "Nagad",
  card: "Credit Card",
  sslcommerz: "SSLCommerz",
};

function StatusBadge({ status, type = "payment" }) {
  const styles = type === "order" ? STATUS_STYLES.order : STATUS_STYLES.payment;
  const Icon = type === "order" ? (ORDER_STATUS_ICONS[status] || Clock) : (PAYMENT_STATUS_ICONS[status] || Clock);
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${styles[status] || "bg-border/10 text-text-muted border-border/20"}`}>
      <Icon className="h-2.5 w-2.5" />
      {status}
    </span>
  );
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border/10 last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim whitespace-nowrap">{label}</span>
      <span className={`text-xs font-semibold text-white text-right ${mono ? "font-mono" : ""}`}>{value || "—"}</span>
    </div>
  );
}

export default function PaymentDetailsModal({ payment, onClose }) {
  if (!payment) return null;

  const buyer = payment.user || {};
  const order = payment.order || {};
  const game = order?.game || {};
  const pkg = order?.package || {};
  const paymentId = payment._id?.toString() || "";
  const shortId = paymentId.slice(-8).toUpperCase();
  const date = payment.createdAt
    ? new Date(payment.createdAt).toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-[#0f0f1a] border border-border/40 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-surface-light/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Payment Details</h2>
              <p className="text-[10px] text-text-dim font-mono">#{shortId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/30 text-text-muted hover:text-white hover:border-border transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Status Badges Row */}
            <div className="flex flex-wrap gap-3">
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-wider font-bold mb-1">Payment Status</p>
                <StatusBadge status={payment.paymentStatus || "pending"} type="payment" />
              </div>
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-wider font-bold mb-1">Order Status</p>
                <StatusBadge status={order?.orderStatus || "pending"} type="order" />
              </div>
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-wider font-bold mb-1">Method</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide bg-secondary/10 text-secondary border-secondary/20">
                  {PAYMENT_METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod || "—"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Buyer Info */}
              <div className="bg-surface-light/10 border border-border/15 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Buyer</h3>
                </div>
                <InfoRow label="Name" value={buyer.name} />
                <InfoRow label="Email" value={buyer.email} />
                <InfoRow label="Role" value={buyer.role} />
              </div>

              {/* Game & Order */}
              <div className="bg-surface-light/10 border border-border/15 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Game & Order</h3>
                </div>
                <InfoRow label="Game" value={game.name} />
                <InfoRow label="Platform" value={game.platform} />
                <InfoRow label="Package" value={pkg.name} />
                <InfoRow label="Order ID" value={`#${order?._id?.toString()?.slice(-8)?.toUpperCase() || "—"}`} mono />
                <InfoRow label="Player ID" value={order?.playerId} mono />
              </div>

              {/* Payment Details */}
              <div className="bg-surface-light/10 border border-border/15 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Payment Info</h3>
                </div>
                <InfoRow label="Payment ID" value={`#${shortId}`} mono />
                <InfoRow label="Transaction ID" value={payment.transactionId || "N/A"} mono />
                <InfoRow label="Method" value={PAYMENT_METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod} />
                <InfoRow label="Amount" value={`$${Number(payment.amount || 0).toFixed(2)}`} />
                <InfoRow label="Date" value={date} />
              </div>

              {/* Order Details */}
              <div className="bg-surface-light/10 border border-border/15 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Order Summary</h3>
                </div>
                <InfoRow label="Order ID" value={`#${order?._id?.toString()?.slice(-8)?.toUpperCase() || "—"}`} mono />
                <InfoRow label="Unit Price" value={`$${Number(order?.unitPrice || 0).toFixed(2)}`} />
                <InfoRow label="Quantity" value={order?.quantity?.toString()} />
                <InfoRow label="Total" value={`$${Number(order?.totalPrice || 0).toFixed(2)}`} />
                <InfoRow label="Order Status" value={order?.orderStatus} />
                <InfoRow label="Order Payment" value={order?.paymentStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}