"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { dashboardService, DashboardOverviewData } from "@/services/dashboard";
import { Card, CardContent, Avatar, Spinner } from "@heroui/react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Gamepad2,
  CreditCard,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOverview() {
      try {
        setLoading(true);
        const data = await dashboardService.getOverview();
        setMetrics(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching dashboard overview:", err);
        setError(err.message || "Failed to load dashboard overview");
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, []);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          Welcome back, <span className="text-primary">{user?.name || "Gamer"}</span>!
        </h1>
        <p className="text-text-muted">
          Here's an overview of your gaming credits purchase history and profile activity.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders Card */}
        <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-muted">Total Orders</p>
              {loading ? (
                <div className="h-8 w-16 bg-surface-light rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-black text-white">{metrics?.totalOrders ?? 0}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15">
              <Gamepad2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Total Spent Card */}
        <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-secondary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-muted">Total Spent</p>
              {loading ? (
                <div className="h-8 w-24 bg-surface-light rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-black text-white">
                  ${(metrics?.totalSpent ?? 0).toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary border border-secondary/15">
              <CreditCard className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders Card */}
        <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-warning/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-muted">Pending Orders</p>
              {loading ? (
                <div className="h-8 w-16 bg-surface-light rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-black text-white">{metrics?.pendingOrders ?? 0}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning border border-warning/15">
              <Clock className="h-6 w-6 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Completed Orders Card */}
        <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-success/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-muted">Completed Orders</p>
              {loading ? (
                <div className="h-8 w-16 bg-surface-light rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-black text-white">{metrics?.completedOrders ?? 0}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success border border-success/15">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Profile Details */}
        <div className="lg:col-span-1">
          <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl shadow-xl rounded-2xl h-full">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                <Avatar className="w-24 h-24 text-3xl font-bold border-2 border-primary/40 relative z-10 bg-surface-light text-white flex items-center justify-center">
                  <Avatar.Fallback>{(user?.name || "G").charAt(0).toUpperCase()}</Avatar.Fallback>
                </Avatar>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize mb-6">
                <Shield className="h-3 w-3" />
                {user?.role || "User"}
              </span>

              <div className="w-full space-y-4 border-t border-border/50 pt-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-light border border-border text-text-muted">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-text-dim">Email Address</p>
                    <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-light border border-border text-text-muted">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-text-dim">Member Since</p>
                    <p className="text-sm font-medium text-white">{formattedDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Activity Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl shadow-xl rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6">
                <h3 className="text-lg font-bold text-white">Recent Top-ups Activity</h3>
                <span className="text-xs text-text-dim flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Live history
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Spinner size="md" />
                  <span className="text-sm text-text-muted font-medium">Loading data summary...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 bg-surface-light border border-border rounded-full flex items-center justify-center text-text-dim mb-4">
                    <ShoppingBag className="h-8 w-8 text-primary/80" />
                  </div>
                  <h4 className="text-base font-semibold text-white mb-1">
                    {metrics && metrics.totalOrders > 0 ? "Browse Full History" : "No Orders Found"}
                  </h4>
                  <p className="text-sm text-text-muted max-w-sm">
                    {metrics && metrics.totalOrders > 0
                      ? `You have placed ${metrics.totalOrders} order(s) with us. Head to our store to make another purchase!`
                      : "You haven't made any game coins top-ups yet. Head over to our shop to start!"}
                  </p>
                  <Link
                    href="/#popular-games"
                    className="mt-6 inline-flex h-10 items-center justify-center px-6 py-2 text-sm font-bold bg-primary text-white hover:bg-primary-dark rounded-xl transition-all shadow-md shadow-primary/20"
                  >
                    Browse Games & Top-Up
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
