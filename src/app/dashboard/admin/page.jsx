"use client";

import React, { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard";
import AdminStatCard from "@/components/dashboard/AdminStatCard";
import AdminRecentOrders from "@/components/dashboard/AdminRecentOrders";
import { Button, Card, CardContent } from "@heroui/react";
import { Users, ShieldCheck, ShoppingBag, DollarSign, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo fallback state
  const [showDemo, setShowDemo] = useState(false);

  const demoData = {
    totalUsers: 142,
    totalSellers: 18,
    totalOrders: 395,
    totalRevenue: 8520.50,
    recentOrders: [
      {
        _id: "660000000000000000000901",
        playerName: "Alex Mercer",
        totalPrice: 25.00,
        paymentStatus: "paid",
        orderStatus: "completed",
        createdAt: new Date().toISOString(),
        game: { name: "Mobile Legends", logo: "" },
        package: { name: "500 Diamonds Bundle" },
        user: { name: "Alex Mercer", email: "alex.m@example.com" }
      },
      {
        _id: "660000000000000000000902",
        playerName: "John Doe",
        totalPrice: 19.98,
        paymentStatus: "paid",
        orderStatus: "processing",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        game: { name: "Free Fire", logo: "" },
        package: { name: "200 Diamonds Pack" },
        user: { name: "John Doe", email: "johndoe@example.com" }
      },
      {
        _id: "660000000000000000000903",
        playerName: "Sarah Connor",
        totalPrice: 49.99,
        paymentStatus: "pending",
        orderStatus: "pending",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        game: { name: "PUBG Mobile", logo: "" },
        package: { name: "UC Elite Royale" },
        user: { name: "Sarah Connor", email: "sarahc@example.com" }
      }
    ]
  };

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getAdminOverview();
      setData(res);
    } catch (err) {
      console.warn("Backend admin overview endpoint unreachable, loading visual demo mock statistics:", err);
      setError("Admin overview API connection failed. Offline preview mode active.");
      setData(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const activeData = showDemo ? demoData : data;
  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Admin Console
          </h1>
          <p className="text-text-muted">
            Global metrics overview, merchant tallies, transaction flows, and recent orders.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            onClick={fetchOverview}
            disabled={loading && !showDemo}
            className="bg-secondary/15 border border-secondary/20 hover:bg-secondary/30 text-white rounded-xl font-bold py-5 px-4 cursor-pointer text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading && !showDemo ? "animate-spin" : ""}`} /> Refresh
          </Button>
          {error && !showDemo && (
            <Button
              size="sm"
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-5 rounded-xl transition-all text-xs"
              onPress={() => setShowDemo(true)}
            >
              Load Demo Stats
            </Button>
          )}
          {showDemo && (
            <Button
              size="sm"
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold px-4 py-5 rounded-xl transition-all text-xs"
              onPress={() => setShowDemo(false)}
            >
              Show API Status
            </Button>
          )}
        </div>
      </div>

      {activeError && (
        <div className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="text-sm font-semibold">{activeError}</div>
          </div>
          <p className="text-xs text-text-muted pl-8">
            Make sure your database server is running and your account is logged in as an administrator. To check the layout details, click "Load Demo Stats" above.
          </p>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Users"
          value={activeData?.totalUsers ?? 0}
          icon={Users}
          loading={loading && !showDemo && !error}
          isPrimary={false}
        />
        <AdminStatCard
          title="Total Sellers"
          value={activeData?.totalSellers ?? 0}
          icon={ShieldCheck}
          loading={loading && !showDemo && !error}
          isPrimary={false}
        />
        <AdminStatCard
          title="Total Orders"
          value={activeData?.totalOrders ?? 0}
          icon={ShoppingBag}
          loading={loading && !showDemo && !error}
          isPrimary={false}
        />
        <AdminStatCard
          title="Total Revenue"
          value={`$${(activeData?.totalRevenue ?? 0).toFixed(2)}`}
          icon={DollarSign}
          loading={loading && !showDemo && !error}
          isPrimary={true}
        />
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="border-b border-border/20 pb-2">
          <h3 className="text-lg font-bold text-white tracking-wide">Recent Transactions</h3>
          <p className="text-xs text-text-dim">The latest purchase entries registered globally across the storefront.</p>
        </div>
        <AdminRecentOrders
          orders={activeData?.recentOrders ?? []}
          loading={loading && !showDemo && !error}
        />
      </div>
    </div>
  );
}
