"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Eye, CreditCard, Clock, CheckCircle, XCircle, ShieldCheck, ShieldX } from "lucide-react";

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  paid:     "bg-green-500/10 text-green-400 border-green-500/20",
  approved: "bg-green-500/10 text-green-400 border-green-500/20",
  failed:   "bg-red-500/10 text-red-400 border-red-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PAYMENT_STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pending:  Clock,
  paid:     CheckCircle,
  approved: CheckCircle,
  failed:   XCircle,
  rejected: XCircle,
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  card: "Credit Card",
  sslcommerz: "SSLCommerz",
};

function StatusBadge({ status }: { status: string }) {
  const styles = PAYMENT_STATUS_STYLES[status] || "bg-border/10 text-text-muted border-border/20";
  const Icon = PAYMENT_STATUS_ICONS[status] || Clock;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${styles}`}>
      <Icon className="h-2.5 w-2.5" />
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

interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

interface GameInfo {
  _id: string;
  name: string;
}

interface OrderInfo {
  _id: string;
  game?: GameInfo | null;
}

interface Payment {
  _id: string;
  user?: UserInfo | null;
  order?: OrderInfo | null;
  createdAt: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  transactionId?: string | null;
}

interface AdminPaymentsTableProps {
  payments?: Payment[];
  loading: boolean;
  onViewDetails: (payment: Payment) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function AdminPaymentsTable({ payments = [], loading, onViewDetails, onApprove, onReject }: AdminPaymentsTableProps) {
  if (loading && payments.length === 0) {
    return (
      <div className="space-y-4">
        {/* Desktop skeleton */}
        <div className="hidden md:block border border-secondary/15 bg-secondary/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30 bg-surface-light/20 text-xs font-bold uppercase tracking-wider text-text-muted">
                <th className="p-4 pl-6 text-left">Payment</th>
                <th className="p-4 text-left">Buyer</th>
                <th className="p-4 text-left">Game / Order</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Status</th>
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

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-14 text-center border border-border/15 bg-secondary/5 rounded-2xl">
        <CreditCard className="h-12 w-12 text-text-dim mb-4" />
        <h4 className="text-sm font-bold text-white mb-1">No payments found</h4>
        <p className="text-xs text-text-muted">No payments match the current filter or search criteria.</p>
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
                <th className="p-4 pl-6">Payment ID</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Game / Order</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/15">
              {payments.map((payment, rowIndex) => {
                const paymentId = payment._id?.toString() || "";
                const shortId = paymentId.slice(-8).toUpperCase();
                const buyer = payment.user;
                const order = payment.order;
                const game = order?.game;
                const date = payment.createdAt
                  ? new Date(payment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "—";
                const status = payment.status || (payment.paymentStatus === "paid" ? "approved" : payment.paymentStatus === "failed" ? "rejected" : "pending");

                return (
                  <motion.tr
                    key={paymentId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.04, duration: 0.3, ease: "easeOut" }}
                    className="hover:bg-surface-light/10 transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div>
                        <p className="font-mono text-xs font-bold text-primary">#{shortId}</p>
                        <p className="text-[10px] text-text-dim mt-0.5">{date}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-semibold text-white truncate max-w-[140px]">{buyer?.name || "—"}</p>
                        <p className="text-[10px] text-text-dim truncate max-w-[140px]">{buyer?.email || "—"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-xs font-bold text-white truncate max-w-[160px]">{game?.name || "—"}</p>
                        <p className="text-[10px] text-text-dim truncate max-w-[160px] font-mono">
                          Order #{order?._id?.toString()?.slice(-8)?.toUpperCase() || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-extrabold text-primary">
                        ${Number(payment.amount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide bg-secondary/10 text-secondary border-secondary/20">
                        {PAYMENT_METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod || "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              onPress={() => onApprove(paymentId)}
                              className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-lg text-[10px] font-bold px-2.5 py-1 cursor-pointer transition-all"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onPress={() => onReject(paymentId)}
                              className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-[10px] font-bold px-2.5 py-1 cursor-pointer transition-all"
                            >
                              Reject
                            </Button>
                          </>
                        ) : status === "approved" ? (
                          <span className="text-[11px] font-bold text-green-400 select-none mr-2">
                            ✓ Approved
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-red-400 select-none mr-2">
                            ✕ Rejected
                          </span>
                        )}
                        <Button
                          size="sm"
                          onPress={() => onViewDetails(payment)}
                          className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-lg text-[10px] font-bold px-2.5 py-1 flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-3">
        {payments.map((payment, cardIndex) => {
          const paymentId = payment._id?.toString() || "";
          const shortId = paymentId.slice(-8).toUpperCase();
          const buyer = payment.user;
          const order = payment.order;
          const game = order?.game;
          const date = payment.createdAt
            ? new Date(payment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "—";

          const status = payment.status || (payment.paymentStatus === "paid" ? "approved" : payment.paymentStatus === "failed" ? "rejected" : "pending");

          return (
            <motion.div
              key={paymentId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cardIndex * 0.05, duration: 0.35, ease: "easeOut" }}
              className="border border-secondary/15 bg-secondary/5 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-bold text-primary">#{shortId}</p>
                  <p className="text-[10px] text-text-dim mt-0.5">{date}</p>
                </div>
                <span className="text-sm font-extrabold text-primary">${Number(payment.amount || 0).toFixed(2)}</span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-white font-semibold">{buyer?.name || "Unknown Buyer"}</p>
                <p className="text-text-dim">{buyer?.email || "—"}</p>
                <p className="text-text-muted">{game?.name || "—"}</p>
                <p className="text-text-dim font-mono text-[10px]">Order #{order?._id?.toString()?.slice(-8)?.toUpperCase() || "—"}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusBadge status={status} />
                <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide bg-secondary/10 text-secondary border-secondary/20">
                  {PAYMENT_METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod || "—"}
                </span>
              </div>

              {status === "pending" ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onPress={() => onApprove(paymentId)}
                    className="flex-1 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-xl text-xs font-bold py-2 cursor-pointer transition-all"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onPress={() => onReject(paymentId)}
                    className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-xs font-bold py-2 cursor-pointer transition-all"
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <div className="text-xs font-bold py-1">
                  {status === "approved" ? (
                    <span className="text-green-400">✓ Approved</span>
                  ) : (
                    <span className="text-red-400">✕ Rejected</span>
                  )}
                </div>
              )}

              <Button
                size="sm"
                onPress={() => onViewDetails(payment)}
                className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-xl text-xs font-bold py-2 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                View Details
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}