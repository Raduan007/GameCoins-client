"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Gamepad2, Loader2, Calendar } from "lucide-react";

// Encapsulated row component to manage local state of status updates for each individual order row
function SellerOrderTableRow({ order, onUpdateStatus }) {
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
    user: buyer
  } = order;

  const [selectedStatus, setSelectedStatus] = useState(orderStatus || "pending");
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
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
      minute: "2-digit"
    });
  };

  return (
    <tr className="border-b border-border/10 last:border-0 hover:bg-surface-light/20 transition-colors duration-200">
      {/* Order ID */}
      <td className="p-4 pl-6 font-bold text-text-dim text-xs select-all">
        #{_id ? _id.slice(-6).toUpperCase() : "N/A"}
      </td>

      {/* Buyer */}
      <td className="p-4">
        <p className="text-sm font-semibold text-white truncate max-w-[140px]" title={playerName || buyer?.name}>
          {playerName || buyer?.name || "Anonymous"}
        </p>
        <p className="text-xs text-text-dim truncate max-w-[140px]" title={buyer?.email}>
          {buyer?.email || "No email"}
        </p>
      </td>

      {/* Game/Package */}
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
            <p className="text-sm font-bold text-white leading-tight">{game?.name || "Game Token"}</p>
            <p className="text-xs text-text-muted leading-tight">{pkg?.name || "Coins Pack"}</p>
          </div>
        </div>
      </td>

      {/* Player ID */}
      <td className="p-4 font-mono text-xs font-semibold text-white select-all">
        {playerId || "N/A"}
      </td>

      {/* Quantity */}
      <td className="p-4 text-sm font-medium text-white">
        {quantity}x
      </td>

      {/* Total Amount */}
      <td className="p-4 text-sm font-black text-primary">
        ${totalPrice ? totalPrice.toFixed(2) : "0.00"}
      </td>

      {/* Payment Info */}
      <td className="p-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getPaymentStatusBadge(paymentStatus)}`}>
          {paymentStatus}
        </span>
        <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider block mt-1">
          {paymentMethod?.toUpperCase()}
        </span>
      </td>

      {/* Order Status */}
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getOrderStatusBadge(orderStatus)}`}>
          {orderStatus}
        </span>
      </td>

      {/* Date Created */}
      <td className="p-4 text-xs text-text-muted font-semibold">
        {formatDate(createdAt)}
      </td>

      {/* Actions */}
      <td className="p-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 px-2 border border-border/50 rounded-lg bg-surface text-white outline-none focus:border-secondary transition-all text-xs cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary-dark text-white rounded-lg font-bold min-w-0 px-3 cursor-pointer text-xs flex items-center gap-1 transition-all shadow-md shadow-primary/20"
            onPress={handleUpdate}
            disabled={updating}
          >
            {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Update"}
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function SellerOrdersTable({ orders = [], onUpdateStatus }) {
  return (
    <div className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl shadow-secondary/2">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-surface-light/30 text-xs font-bold uppercase tracking-wider text-text-muted">
              <th className="p-4 pl-6">Order ID</th>
              <th className="p-4">Buyer</th>
              <th className="p-4">Game / Package</th>
              <th className="p-4">Player ID</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <SellerOrderTableRow
                key={order._id}
                order={order}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
