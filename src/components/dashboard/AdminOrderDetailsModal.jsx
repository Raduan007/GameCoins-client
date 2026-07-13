"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import {
  X, ShoppingBag, User, Gamepad2, Package, CreditCard,
  Clock, CheckCircle, XCircle, RefreshCw, Loader2, AlertCircle
} from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["pending", "processing", "completed", "cancelled"];

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
  processing: RefreshCw,
  completed:  CheckCircle,
  cancelled:  XCircle,
};

function StatusBadge({ status, type = "order" }) {
  const styles = STATUS_STYLES[type] || STATUS_STYLES.order;
  const Icon = type === "order" ? (ORDER_STATUS_ICONS[status] || Clock) : null;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${styles[status] || "bg-border/10 text-text-muted border-border/20"}`}>
      {Icon && <Icon className="h-2.5 w-2.5" />}
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

export default function AdminOrderDetailsModal({ order, onClose, onStatusUpdated }) {
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "pending");
  const [updating, setUpdating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!order) return null;

  const buyer = order.user || {};
  const game = order.game || {};
  const pkg = order.package || {};
  const orderId = order._id?.toString() || "";
  const shortId = orderId.slice(-8).toUpperCase();
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  const hasChanged = selectedStatus !== order.orderStatus;

  const handleUpdate = async () => {
    if (!hasChanged) return;
    setConfirmOpen(false);
    setUpdating(true);
    try {
      await dashboardService.updateAdminOrderStatus(orderId, selectedStatus);
      toast.success(`Order status updated to "${selectedStatus}"`);
      onStatusUpdated?.({ ...order, orderStatus: selectedStatus });
      onClose();
    } catch (err) {
      toast.error("Failed to update order status.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

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
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Order Details</h2>
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
                <p className="text-[9px] text-text-dim uppercase tracking-wider font-bold mb-1">Order Status</p>
                <StatusBadge status={order.orderStatus || "pending"} type="order" />
              </div>
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-wider font-bold mb-1">Payment Status</p>
                <StatusBadge status={order.paymentStatus || "pending"} type="payment" />
              </div>
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-wider font-bold mb-1">Payment Method</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide bg-secondary/10 text-secondary border-secondary/20">
                  {order.paymentMethod || "—"}
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

              {/* Game & Package */}
              <div className="bg-surface-light/10 border border-border/15 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Game & Package</h3>
                </div>
                <InfoRow label="Game" value={game.name} />
                <InfoRow label="Platform" value={game.platform} />
                <InfoRow label="Package" value={pkg.name} />
                <InfoRow label="Credits" value={pkg.amount ? `${pkg.amount} credits` : undefined} />
              </div>

              {/* Order Details */}
              <div className="bg-surface-light/10 border border-border/15 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Order Details</h3>
                </div>
                <InfoRow label="Order ID" value={`#${shortId}`} mono />
                <InfoRow label="Player ID" value={order.playerId} mono />
                {order.playerName && <InfoRow label="Player Name" value={order.playerName} />}
                <InfoRow label="Quantity" value={order.quantity?.toString()} />
                <InfoRow label="Unit Price" value={`$${Number(order.unitPrice || 0).toFixed(2)}`} />
                <InfoRow label="Total" value={`$${Number(order.totalPrice || 0).toFixed(2)}`} />
                <InfoRow label="Date" value={date} />
              </div>

              {/* Update Status */}
              <div className="bg-surface-light/10 border border-border/15 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Update Status</h3>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-9 px-3 bg-surface/50 border border-border/50 rounded-xl text-white text-xs outline-none focus:border-primary transition-all cursor-pointer"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#0f0f1a]">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>

                <Button
                  isDisabled={!hasChanged || updating}
                  onPress={() => setConfirmOpen(true)}
                  className={`mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-5 text-xs font-bold cursor-pointer transition-all ${
                    hasChanged
                      ? "bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20"
                      : "bg-surface-light/30 text-text-dim cursor-not-allowed"
                  }`}
                >
                  {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  {updating ? "Updating…" : "Apply Status Change"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm bg-[#0f0f1a] border border-border/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-warning flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">Confirm Status Update</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Change order <span className="font-mono text-primary">#{shortId}</span> status from{" "}
                  <strong className="text-white">{order.orderStatus}</strong> to{" "}
                  <strong className="text-primary">{selectedStatus}</strong>?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onPress={() => setConfirmOpen(false)}
                className="flex-1 bg-surface-light border border-border rounded-xl py-5 text-xs font-bold text-text-muted hover:text-white cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onPress={handleUpdate}
                className="flex-1 bg-primary text-white hover:bg-primary-dark rounded-xl py-5 text-xs font-bold cursor-pointer shadow-md shadow-primary/20"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
