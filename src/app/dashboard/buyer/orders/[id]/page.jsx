"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard";
import StatusTimeline from "@/components/dashboard/StatusTimeline";
import { Card, CardContent, Button } from "@heroui/react";
import {
  Gamepad2,
  User,
  Clock,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Hash,
} from "lucide-react";

export default function BuyerOrderDetailsPage({ params }) {
  // Unwrap params using React.use() to comply with Next.js 15+ async params
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        const data = await dashboardService.getBuyerOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message || "Order not found");
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Badge helpers
  const getPaymentBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-success/15 text-success border-success/30";
      case "failed":
        return "bg-error/15 text-error border-error/30";
      case "pending":
      default:
        return "bg-warning/15 text-warning border-warning/30";
    }
  };

  const getOrderBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-success/15 text-success border-success/30";
      case "cancelled":
        return "bg-error/15 text-error border-error/30";
      case "pending":
      case "processing":
      default:
        return "bg-primary/15 text-primary border-primary/30";
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="space-y-2">
          <div className="h-8 bg-surface-light rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-surface-light rounded w-1/2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/40 bg-surface/40 h-48 animate-pulse" />
            <Card className="border border-border/40 bg-surface/40 h-48 animate-pulse" />
          </div>
          <Card className="border border-border/40 bg-surface/40 h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6 max-w-lg mx-auto py-12 text-center animate-fadeIn">
        <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Order Not Found</h3>
        <p className="text-text-muted">
          The requested purchase record could not be loaded or you do not have permission to view it.
        </p>
        <Link href="/dashboard/buyer/orders">
          <Button className="mt-6 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark cursor-pointer">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const {
    playerId,
    playerName,
    quantity,
    totalPrice,
    unitPrice,
    paymentMethod,
    paymentStatus,
    orderStatus,
    createdAt,
    updatedAt,
    game,
    package: pkg,
  } = order;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/buyer/orders"
              className="text-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Details</h1>
          </div>
          <p className="text-text-muted">
            Viewing purchase reference ID: <span className="text-primary font-mono select-all">{orderId}</span>
          </p>
        </div>
        <Link href="/dashboard/buyer/orders">
          <Button
            className="rounded-xl font-bold bg-surface-light border border-border text-text-muted hover:text-white transition-all cursor-pointer py-5.5"
          >
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details (Left/Center columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Game & Package Info Card */}
          <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-8 space-y-6">
              {/* Game details header */}
              <div className="flex items-start gap-4 pb-6 border-b border-border/40">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-2xl blur-sm opacity-50" />
                  {game?.logo ? (
                    <img
                      src={game.logo}
                      alt={game.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-border relative z-10"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-16 h-16 rounded-2xl bg-surface-light border border-border items-center justify-center text-text-muted relative z-10 hidden"
                    style={{ display: game?.logo ? "none" : "flex" }}
                  >
                    <Gamepad2 className="h-8 w-8" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wide">{game?.name || "Game Token"}</h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-text-muted">
                    <span className="font-semibold px-2 py-0.5 bg-surface-light border border-border rounded-md">
                      {game?.category || "Category"}
                    </span>
                    <span className="font-semibold px-2 py-0.5 bg-surface-light border border-border rounded-md">
                      {game?.platform || "Platform"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[11px] text-text-dim font-bold uppercase tracking-wider mb-2">Package Selected</h4>
                  <p className="text-base font-bold text-white">{pkg?.name || "Coins Package"}</p>
                  <p className="text-xs text-text-muted font-medium mt-1">
                    Delivering amount: <span className="text-primary font-bold">{pkg?.amount || 0} Coins</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-[11px] text-text-dim font-bold uppercase tracking-wider mb-2">Package Description</h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {pkg?.description || "No description available."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Player & Payment & Order info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player Information Card */}
            <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-border/30 pb-2">Player Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Player ID:</span>
                    <span className="font-bold text-white font-mono">{playerId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Player Name:</span>
                    <span className="font-bold text-white">{playerName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Quantity Ordered:</span>
                    <span className="font-bold text-white">{quantity}x</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Unit Price:</span>
                    <span className="font-bold text-white">${(unitPrice || totalPrice / quantity).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information Card */}
            <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-border/30 pb-2">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Payment Method:</span>
                    <span className="font-bold text-white uppercase">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Payment Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getPaymentBadgeColor(paymentStatus)}`}>
                      {paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Transaction ID:</span>
                    <span className="font-bold text-white font-mono max-w-[130px] truncate" title={order.transactionId || "N/A"}>
                      {order.transactionId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Billing Amount:</span>
                    <span className="font-black text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Tracker & Timeline (Right column) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-base font-bold text-white border-b border-border/30 pb-2">Fulfillment Tracker</h3>

              {/* Status & Price summary */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider mb-1">Order Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getOrderBadgeColor(orderStatus)}`}>
                    {orderStatus}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider mb-1">Total Paid</p>
                  <p className="text-xl font-black text-primary">${totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-border/30 pt-4">
                <p className="text-[11px] text-text-dim font-bold uppercase tracking-wider mb-4">Processing Steps</p>
                <StatusTimeline orderStatus={orderStatus} paymentStatus={paymentStatus} />
              </div>

              {/* Timestamps */}
              <div className="border-t border-border/30 pt-4 space-y-2 text-xs text-text-muted">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="font-medium text-white">{formatDate(createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium text-white">{formatDate(updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
