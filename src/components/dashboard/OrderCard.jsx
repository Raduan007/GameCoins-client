"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, Button } from "@heroui/react";
import { Gamepad2, User, Clock, CreditCard, ShoppingBag, Eye } from "lucide-react";

export default function OrderCard({ order }) {
  const {
    _id,
    playerId,
    playerName,
    quantity,
    totalPrice,
    paymentMethod,
    paymentStatus,
    orderStatus,
    createdAt,
    game,
    package: pkg,
  } = order;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  // Badges styling helper
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

  return (
    <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-primary/20">
      <CardContent className="p-6 space-y-6">
        {/* Top Section: Game Details & Date */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-xl blur-sm opacity-50" />
              {game?.logo ? (
                <img
                  src={game.logo}
                  alt={game.name}
                  className="w-12 h-12 rounded-xl object-cover border border-border relative z-10"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-12 h-12 rounded-xl bg-surface-light border border-border items-center justify-center text-text-muted relative z-10 hidden"
                style={{ display: game?.logo ? "none" : "flex" }}
              >
                <Gamepad2 className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-wide">{game?.name || "Game Token"}</h4>
              <p className="text-xs text-text-muted font-medium">
                {pkg?.name || "Diamonds Bundle"} ({pkg?.amount || 0} Coins)
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[11px] text-text-dim font-bold uppercase tracking-wider">Date Placed</p>
            <p className="text-sm font-semibold text-white">{formattedDate}</p>
          </div>
        </div>

        {/* Middle Section: Player info & stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-[11px] text-text-dim font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
              <User className="h-3 w-3" /> Player ID
            </p>
            <p className="text-sm font-bold text-white truncate max-w-[130px]">{playerId}</p>
          </div>

          <div>
            <p className="text-[11px] text-text-dim font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
              <User className="h-3 w-3" /> Player Name
            </p>
            <p className="text-sm font-bold text-white truncate max-w-[130px]">{playerName || "N/A"}</p>
          </div>

          <div>
            <p className="text-[11px] text-text-dim font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
              <ShoppingBag className="h-3 w-3" /> Quantity & Price
            </p>
            <p className="text-sm font-bold text-white">
              {quantity}x <span className="text-text-muted font-normal text-xs">(${pkg?.price || totalPrice})</span>
            </p>
          </div>

          <div>
            <p className="text-[11px] text-text-dim font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
              <CreditCard className="h-3 w-3" /> Total price
            </p>
            <p className="text-lg font-black text-primary">${totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Bottom Section: Badges & View Details */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-border/30">
          <div className="flex flex-wrap items-center gap-3">
            {/* Order Status Badge */}
            <div className="flex flex-col">
              <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider mb-1">Order Status</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getOrderStatusBadge(orderStatus)}`}>
                {orderStatus}
              </span>
            </div>

            {/* Payment Status Badge */}
            <div className="flex flex-col">
              <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider mb-1">Payment ({paymentMethod?.toUpperCase()})</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getPaymentStatusBadge(paymentStatus)}`}>
                {paymentStatus}
              </span>
            </div>
          </div>

          <Link href={`/dashboard/buyer/orders/${_id}`} className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl font-bold px-5 bg-secondary text-white hover:bg-secondary-dark transition-all duration-200 cursor-pointer shadow-md shadow-secondary/15 py-5.5"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
