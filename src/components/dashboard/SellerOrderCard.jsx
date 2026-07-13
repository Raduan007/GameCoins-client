"use client";

import React, { useState } from "react";
import { Card, CardContent, Button } from "@heroui/react";
import { Calendar, User, Tag, ShoppingBag, Gamepad2, ShieldAlert, CreditCard, ChevronRight, Loader2 } from "lucide-react";

export default function SellerOrderCard({ order, onUpdateStatus }) {
  const {
    _id,
    playerName,
    playerId,
    quantity,
    totalPrice,
    paymentMethod,
    paymentStatus,
    orderStatus,
    createdAt,
    game,
    package: pkg,
    user: buyer // user object sometimes contains name/email
  } = order;

  const [selectedStatus, setSelectedStatus] = useState(orderStatus || "pending");
  const [updating, setUpdating] = useState(false);

  const handleStatusChangeSubmit = async () => {
    try {
      setUpdating(true);
      await onUpdateStatus(_id, selectedStatus);
    } finally {
      setUpdating(false);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 hover:bg-secondary/10 shadow-lg shadow-secondary/2">
      <CardContent className="p-5 space-y-4">
        {/* Header: Order ID & Date */}
        <div className="flex justify-between items-center pb-3 border-b border-border/20">
          <span className="font-bold text-text-dim text-xs select-all">
            #{_id ? _id.slice(-6).toUpperCase() : "N/A"}
          </span>
          <span className="text-[11px] text-text-muted font-semibold flex items-center gap-1">
            <Calendar className="h-3 w-3 text-secondary" /> {formatDate(createdAt)}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 text-xs">
          {/* Buyer */}
          <div className="flex justify-between">
            <span className="text-text-dim font-bold flex items-center gap-1"><User className="h-3.5 w-3.5" /> Buyer</span>
            <span className="font-bold text-white max-w-[180px] truncate">
              {playerName || buyer?.name || buyer?.email || "Anonymous"}
            </span>
          </div>

          {/* Game & Package */}
          <div className="flex justify-between">
            <span className="text-text-dim font-bold flex items-center gap-1"><Gamepad2 className="h-3.5 w-3.5" /> Game Item</span>
            <span className="font-bold text-white text-right max-w-[200px] truncate">
              {game?.name || "Game Token"} ({pkg?.name || "Bundle"})
            </span>
          </div>

          {/* Player ID */}
          <div className="flex justify-between">
            <span className="text-text-dim font-bold flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> Player ID</span>
            <span className="font-mono font-bold text-white select-all">{playerId || "N/A"}</span>
          </div>

          {/* Quantity */}
          <div className="flex justify-between">
            <span className="text-text-dim font-bold flex items-center gap-1"><ShoppingBag className="h-3.5 w-3.5" /> Quantity</span>
            <span className="font-bold text-white">{quantity}x</span>
          </div>

          {/* Amount */}
          <div className="flex justify-between">
            <span className="text-text-dim font-bold flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Total Price</span>
            <span className="font-black text-primary text-sm">${totalPrice ? totalPrice.toFixed(2) : "0.00"}</span>
          </div>

          {/* Payment Status */}
          <div className="flex justify-between items-center">
            <span className="text-text-dim font-bold flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> Payment ({paymentMethod?.toUpperCase()})</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getPaymentStatusBadge(paymentStatus)}`}>
              {paymentStatus}
            </span>
          </div>

          {/* Order Status */}
          <div className="flex justify-between items-center">
            <span className="text-text-dim font-bold flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Status</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getOrderStatusBadge(orderStatus)}`}>
              {orderStatus}
            </span>
          </div>
        </div>

        {/* Status Update Dropdown */}
        <div className="flex flex-col gap-2 pt-3 border-t border-border/20">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Update Order Status</label>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 h-9 px-2 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-secondary transition-all text-xs cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button
              className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-4.5 px-3 cursor-pointer text-xs flex items-center gap-1 transition-all shadow-md shadow-primary/20 shrink-0"
              onPress={handleStatusChangeSubmit}
              disabled={updating}
            >
              {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Update"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
