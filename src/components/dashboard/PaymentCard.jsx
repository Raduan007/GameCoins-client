"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, Button } from "@heroui/react";
import { CreditCard, Calendar, ArrowUpRight, ShieldCheck, Clock, ShieldX, Gamepad2, ShoppingBag } from "lucide-react";

export default function PaymentCard({ payment }) {
  const {
    _id,
    amount,
    paymentMethod,
    paymentStatus,
    transactionId,
    createdAt,
    order,
  } = payment;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  // Badges helper
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          classes: "bg-success/10 text-success border-success/20",
          icon: ShieldCheck,
        };
      case "failed":
        return {
          classes: "bg-error/10 text-error border-error/20",
          icon: ShieldX,
        };
      case "pending":
      default:
        return {
          classes: "bg-warning/10 text-warning border-warning/20",
          icon: Clock,
        };
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

  // Format payment method text
  const getPaymentMethodLabel = (method) => {
    switch (method?.toLowerCase()) {
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "sslcommerz":
        return "SSLCommerz";
      case "card":
        return "Credit Card";
      default:
        return method || "Other";
    }
  };

  const badge = getStatusBadge(paymentStatus);
  const StatusIcon = badge.icon;

  return (
    <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-primary/20">
      <CardContent className="p-6 space-y-6">
        {/* Top Header: Amount & Date */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/20">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Payment ID: {_id}</p>
              <h4 className="text-xl font-black text-white tracking-wide mt-0.5">
                ${amount.toFixed(2)}{" "}
                <span className="text-xs text-text-muted font-normal uppercase">USD</span>
              </h4>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Payment Date</p>
            <p className="text-sm font-semibold text-white mt-0.5 flex items-center gap-1.5 justify-start sm:justify-end">
              <Calendar className="h-3.5 w-3.5 text-text-muted" />
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Middle Section: Payment details & related order details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Payment attributes */}
          <div className="space-y-3">
            <p className="text-[11px] text-text-dim font-bold uppercase tracking-wider">Payment Info</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Method:</span>
                <span className="font-bold text-white">{getPaymentMethodLabel(paymentMethod)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Transaction ID:</span>
                <span className="font-bold text-white font-mono max-w-[130px] truncate" title={transactionId || "N/A"}>
                  {transactionId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Status:</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${badge.classes}`}>
                  <StatusIcon className="h-3 w-3" />
                  {paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Order attributes */}
          <div className="md:col-span-2 space-y-3 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
            <p className="text-[11px] text-text-dim font-bold uppercase tracking-wider">Related Purchase Order</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-white truncate max-w-[170px]">
                    {order?.game?.name || "Game Token"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-text-muted" />
                  <span className="text-xs text-text-muted font-medium truncate max-w-[170px]">
                    {order?.package?.name || "Diamonds Bundle"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Order ID:</span>
                  <span className="font-mono text-white max-w-[100px] truncate" title={order?._id}>
                    {order?._id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Order Status:</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getOrderStatusBadge(order?.orderStatus)}`}>
                    {order?.orderStatus || "pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Actions */}
        {order?._id && (
          <div className="flex justify-end pt-4 border-t border-border/30">
            <Link href={`/dashboard/buyer/orders/${order._id}`}>
              <Button
                className="flex items-center justify-center gap-1.5 rounded-xl font-bold px-5 bg-secondary text-white hover:bg-secondary-dark transition-all duration-200 cursor-pointer py-5 shadow-md shadow-secondary/15"
              >
                View Order
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
