"use client";

import React from "react";
import { Avatar, Button } from "@heroui/react";
import { X, User, Mail, Shield, ShieldCheck, Calendar, Heart, ShoppingBag, CreditCard, Loader2 } from "lucide-react";

export default function UserDetailsModal({ isOpen, onClose, userDetails, loading }) {
  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl border border-secondary/20 bg-surface/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-surface/30">
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-primary" /> User Profile Summary
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-text-muted">Loading user profile details...</span>
            </div>
          ) : !userDetails ? (
            <div className="text-center py-10 text-text-muted text-sm">
              Failed to load profile details.
            </div>
          ) : (
            <>
              {/* Top Banner: Profile Card readout */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border border-border/10 rounded-2xl bg-surface-light/10">
                <Avatar
                  src={userDetails.user?.avatar}
                  name={userDetails.user?.name}
                  className="w-16 h-16 font-black border-2 border-primary/20 bg-surface-light text-white text-xl flex-shrink-0"
                  fallback={userDetails.user?.name?.charAt(0).toUpperCase()}
                />
                <div className="space-y-1.5 text-center sm:text-left min-w-0">
                  <h4 className="text-lg font-bold text-white truncate">{userDetails.user?.name}</h4>
                  <p className="text-xs text-text-dim truncate">{userDetails.user?.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 border border-primary/20 text-primary uppercase">
                      {userDetails.user?.role}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${
                      userDetails.user?.isActive !== false
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-error/10 text-error border-error/20"
                    }`}>
                      {userDetails.user?.isActive !== false ? "Active" : "Inactive"}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary/10 border border-secondary/20 text-secondary items-center gap-1">
                      <Heart className="h-2.5 w-2.5 fill-secondary" /> {userDetails.wishlistCount} in wishlist
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid profile metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2.5 bg-surface-light/5 border border-border/10 rounded-xl p-3.5">
                  <Calendar className="h-4.5 w-4.5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Member Since</p>
                    <p className="font-semibold text-white mt-0.5">{formatDate(userDetails.user?.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-surface-light/5 border border-border/10 rounded-xl p-3.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Account ID</p>
                    <p className="font-mono text-white select-all mt-0.5">{userDetails.user?._id}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-1.5 pb-1.5 border-b border-border/10">
                  <ShoppingBag className="h-4 w-4 text-primary" /> Recent Orders (Last 5)
                </h4>
                {userDetails.recentOrders?.length === 0 ? (
                  <p className="text-xs text-text-muted italic pl-1">No orders placed by this user.</p>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {userDetails.recentOrders.map((ord) => (
                      <div key={ord._id} className="flex justify-between items-center p-3 border border-border/10 bg-surface-light/5 rounded-xl text-xs hover:bg-surface-light/10 transition-colors">
                        <div>
                          <p className="font-bold text-white">{ord.game?.name || "Game Token"} ({ord.package?.name || "Coins Pack"})</p>
                          <p className="text-[10px] text-text-muted mt-0.5">ID: #{ord._id?.slice(-6).toUpperCase()} • {formatDate(ord.createdAt)}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-black text-primary">${ord.totalPrice?.toFixed(2)}</p>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border capitalize ${getOrderStatusBadge(ord.orderStatus)}`}>
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Payments List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-1.5 pb-1.5 border-b border-border/10">
                  <CreditCard className="h-4 w-4 text-primary" /> Recent Payments (Last 5)
                </h4>
                {userDetails.payments?.length === 0 ? (
                  <p className="text-xs text-text-muted italic pl-1">No payment transactions recorded.</p>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {userDetails.payments.map((pay) => (
                      <div key={pay._id} className="flex justify-between items-center p-3 border border-border/10 bg-surface-light/5 rounded-xl text-xs hover:bg-surface-light/10 transition-colors">
                        <div>
                          <p className="font-bold text-white capitalize">{pay.paymentMethod || "gateway"} Payment</p>
                          <p className="text-[10px] text-text-muted mt-0.5">TXID: {pay.transactionId || "N/A"} • {formatDate(pay.createdAt)}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-black text-secondary">${pay.amount?.toFixed(2)}</p>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border capitalize ${getPaymentStatusBadge(pay.paymentStatus)}`}>
                            {pay.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/20 bg-surface/30 flex justify-end">
          <Button
            size="sm"
            onPress={onClose}
            className="bg-secondary/15 hover:bg-secondary/30 text-white rounded-xl font-bold py-4.5 px-4 cursor-pointer text-xs transition-all"
          >
            Close Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
