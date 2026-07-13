"use client";

import React, { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard";
import AdminReportStatCard from "@/components/dashboard/AdminReportStatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import OrderStatusChart from "@/components/dashboard/OrderStatusChart";
import TopSellingGames from "@/components/dashboard/TopSellingGames";
import SellerPerformanceTable from "@/components/dashboard/SellerPerformanceTable";
import { Button } from "@heroui/react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Calendar,
  Gamepad2,
  Package,
} from "lucide-react";

export default function AdminReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("30days");

  // Demo fallback state if API call fails
  const [showDemo, setShowDemo] = useState(false);

  const demoData = {
    overview: {
      totalRevenue: 3450.75,
      totalOrders: 154,
      totalCompletedOrders: 120,
      totalPendingOrders: 24,
      totalUsers: 84,
      totalSellers: 12,
      totalGames: 8,
      totalPackages: 22,
    },
    revenue: {
      daily: [
        { date: "2026-07-08", revenue: 120.0 },
        { date: "2026-07-09", revenue: 235.5 },
        { date: "2026-07-10", revenue: 95.0 },
        { date: "2026-07-11", revenue: 410.0 },
        { date: "2026-07-12", revenue: 310.25 },
        { date: "2026-07-13", revenue: 620.0 },
        { date: "2026-07-14", revenue: 150.0 },
      ],
      weekly: [
        { week: "2026-W25", revenue: 980.0 },
        { week: "2026-W26", revenue: 1240.5 },
        { week: "2026-W27", revenue: 1230.25 },
      ],
      monthly: [
        { month: "2026-05", revenue: 2100.0 },
        { month: "2026-06", revenue: 4800.5 },
        { month: "2026-07", revenue: 3450.75 },
      ],
      yearly: [{ year: "2026", revenue: 10351.25 }],
    },
    orderStatus: [
      { status: "completed", count: 120 },
      { status: "pending", count: 24 },
      { status: "processing", count: 8 },
      { status: "cancelled", count: 2 },
    ],
    sales: {
      topSellingGames: [
        { gameId: "g1", name: "Mobile Legends", orders: 64, revenue: 1850.0 },
        { gameId: "g2", name: "Free Fire", orders: 48, revenue: 980.5 },
        { gameId: "g3", name: "PUBG Mobile", orders: 32, revenue: 540.25 },
        { gameId: "g4", name: "Valorant", orders: 10, revenue: 80.0 },
      ],
      topSellingPackages: [
        { packageId: "p1", name: "500 Diamonds Bundle", gameName: "Mobile Legends", numberSold: 42, revenue: 1260.0 },
        { packageId: "p2", name: "200 Diamonds Pack", gameName: "Free Fire", numberSold: 35, revenue: 700.0 },
        { packageId: "p3", name: "UC Elite Royale", gameName: "PUBG Mobile", numberSold: 28, revenue: 480.0 },
      ],
    },
    sellerPerformance: [
      { sellerName: "Apex Merchant", totalProducts: 8, totalOrders: 75, revenueGenerated: 2150.0 },
      { sellerName: "Global Coins", totalProducts: 6, totalOrders: 42, revenueGenerated: 980.75 },
      { sellerName: "BD Gamer Shop", totalProducts: 4, totalOrders: 20, revenueGenerated: 320.0 },
      { sellerName: "Fast Topup", totalProducts: 4, totalOrders: 17, revenueGenerated: 0.0 },
    ],
  };

  const fetchReports = async (selectedPeriod = period) => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getAdminReports({ period: selectedPeriod });
      setData(res.data);
    } catch (err) {
      console.warn("Backend reports API unreachable, activating offline visual demo mockup reports:", err);
      setError("Admin reports API connection failed. Offline preview mode active.");
      setData(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchReports(newPeriod);
  };

  const activeData = showDemo ? demoData : data;
  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Reports & Analytics
          </h1>
          <p className="text-text-muted">
            Track gaming product revenues, order metrics, sales aggregates, and seller performance.
          </p>
        </div>

        {/* Period Selector & Action Tools */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Period Selector Buttons */}
          <div className="flex bg-secondary/10 border border-secondary/15 rounded-xl p-1 gap-1 w-full sm:w-auto">
            {[
              { id: "7days", label: "7 Days" },
              { id: "30days", label: "30 Days" },
              { id: "6months", label: "6 Months" },
              { id: "1year", label: "1 Year" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePeriodChange(opt.id)}
                className={`flex-1 sm:flex-initial text-xs font-bold py-2 px-3.5 rounded-lg transition-all cursor-pointer ${
                  period === opt.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2.5 w-full sm:w-auto">
            <Button
              size="sm"
              onClick={() => fetchReports()}
              disabled={loading && !showDemo}
              className="bg-secondary/15 border border-secondary/20 hover:bg-secondary/30 text-white rounded-xl font-bold py-5 px-4 cursor-pointer text-xs flex items-center gap-1.5 transition-all flex-1 sm:flex-initial"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading && !showDemo ? "animate-spin" : ""}`} /> Refresh
            </Button>
            {error && !showDemo && (
              <Button
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-5 rounded-xl transition-all text-xs flex-1 sm:flex-initial"
                onPress={() => setShowDemo(true)}
              >
                Load Demo Stats
              </Button>
            )}
            {showDemo && (
              <Button
                size="sm"
                className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold px-4 py-5 rounded-xl transition-all text-xs flex-1 sm:flex-initial"
                onPress={() => setShowDemo(false)}
              >
                Show API Status
              </Button>
            )}
          </div>
        </div>
      </div>

      {activeError && (
        <div className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="text-sm font-semibold">{activeError}</div>
          </div>
          <p className="text-xs text-text-muted pl-8">
            Make sure your database server is running and your account is logged in as an administrator. To check the dashboard layout, click "Load Demo Stats" above.
          </p>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AdminReportStatCard
          title="Revenue"
          value={`$${(activeData?.overview?.totalRevenue ?? 0).toFixed(2)}`}
          icon={TrendingUp}
          loading={loading && !showDemo && !error}
          isPrimary={true}
        />
        <AdminReportStatCard
          title="Orders Count"
          value={activeData?.overview?.totalOrders ?? 0}
          icon={ShoppingBag}
          loading={loading && !showDemo && !error}
          isPrimary={false}
        />
        <AdminReportStatCard
          title="Total Users"
          value={activeData?.overview?.totalUsers ?? 0}
          icon={Users}
          loading={loading && !showDemo && !error}
          isPrimary={false}
        />
        <AdminReportStatCard
          title="Total Sellers"
          value={activeData?.overview?.totalSellers ?? 0}
          icon={ShieldCheck}
          loading={loading && !showDemo && !error}
          isPrimary={false}
        />
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Graph Card */}
        <div className="lg:col-span-2 border border-secondary/15 bg-secondary/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white tracking-wide">Revenue Trend</h4>
            <p className="text-xs text-text-dim">Graphical performance of merchant purchases over time.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {loading && !showDemo && !error ? (
              <div className="h-72 w-full bg-secondary/5 rounded-xl border border-secondary/15 flex items-center justify-center text-text-dim text-xs animate-pulse">
                Loading revenue trend...
              </div>
            ) : (
              <RevenueChart data={activeData?.revenue?.daily} period={period} />
            )}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="border border-secondary/15 bg-secondary/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white tracking-wide">Order Distribution</h4>
            <p className="text-xs text-text-dim">Ratio of order fulfillment states processed within the system.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {loading && !showDemo && !error ? (
              <div className="h-72 w-full bg-secondary/5 rounded-xl border border-secondary/15 flex items-center justify-center text-text-dim text-xs animate-pulse">
                Loading order stats...
              </div>
            ) : (
              <OrderStatusChart data={activeData?.orderStatus} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Rankings & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Games Ranking */}
        <div className="lg:col-span-1">
          {loading && !showDemo && !error ? (
            <div className="h-72 w-full bg-secondary/5 rounded-2xl border border-secondary/15 flex items-center justify-center text-text-dim text-xs animate-pulse">
              Loading top games...
            </div>
          ) : (
            <TopSellingGames games={activeData?.sales?.topSellingGames} />
          )}
        </div>

        {/* Seller Performance Table */}
        <div className="lg:col-span-2">
          {loading && !showDemo && !error ? (
            <div className="h-72 w-full bg-secondary/5 rounded-2xl border border-secondary/15 flex items-center justify-center text-text-dim text-xs animate-pulse">
              Loading merchant logs...
            </div>
          ) : (
            <SellerPerformanceTable sellers={activeData?.sellerPerformance} />
          )}
        </div>
      </div>
    </div>
  );
}
