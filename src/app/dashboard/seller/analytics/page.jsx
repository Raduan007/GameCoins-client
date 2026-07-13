"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, CardContent } from "@heroui/react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Calendar,
  AlertCircle,
  BarChart3,
  Percent
} from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import SellerAnalyticsCard from "@/components/dashboard/SellerAnalyticsCard";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";

export default function SellerAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateFilter, setDateFilter] = useState("last-30-days");
  
  // Demo mock option
  const [showDemo, setShowDemo] = useState(false);

  // High-fidelity interactive datasets for each timeline filter option
  const demoDataSets = {
    "last-7-days": {
      totalRevenue: 285.50,
      totalSales: 12,
      totalOrders: 10,
      averageOrderValue: 28.55,
      chartData: [
        { date: "Mon", revenue: 40.00, sales: 2 },
        { date: "Tue", revenue: 25.00, sales: 1 },
        { date: "Wed", revenue: 55.50, sales: 2 },
        { date: "Thu", revenue: 15.00, sales: 1 },
        { date: "Fri", revenue: 80.00, sales: 3 },
        { date: "Sat", revenue: 35.00, sales: 1 },
        { date: "Sun", revenue: 35.00, sales: 2 }
      ],
      topProducts: [
        { name: "500 Diamonds Bundle", gameName: "Mobile Legends", sales: 6, revenue: 150.00 },
        { name: "200 Diamonds Pack", gameName: "Free Fire", sales: 4, revenue: 39.96 },
        { name: "UC Elite Royale", gameName: "PUBG Mobile", sales: 2, revenue: 99.98 }
      ]
    },
    "last-30-days": {
      totalRevenue: 1280.50,
      totalSales: 48,
      totalOrders: 36,
      averageOrderValue: 35.57,
      chartData: [
        { date: "Week 1", revenue: 220.00, sales: 8 },
        { date: "Week 2", revenue: 310.50, sales: 11 },
        { date: "Week 3", revenue: 450.00, sales: 16 },
        { date: "Week 4", revenue: 300.00, sales: 13 }
      ],
      topProducts: [
        { name: "500 Diamonds Bundle", gameName: "Mobile Legends", sales: 22, revenue: 550.00 },
        { name: "UC Elite Royale", gameName: "PUBG Mobile", sales: 10, revenue: 499.90 },
        { name: "200 Diamonds Pack", gameName: "Free Fire", sales: 16, revenue: 159.84 }
      ]
    },
    "last-6-months": {
      totalRevenue: 7420.00,
      totalSales: 240,
      totalOrders: 198,
      averageOrderValue: 37.47,
      chartData: [
        { date: "Jan", revenue: 850.00, sales: 25 },
        { date: "Feb", revenue: 1100.00, sales: 34 },
        { date: "Mar", revenue: 950.00, sales: 30 },
        { date: "Apr", revenue: 1400.00, sales: 48 },
        { date: "May", revenue: 1620.00, sales: 52 },
        { date: "Jun", revenue: 1500.00, sales: 51 }
      ],
      topProducts: [
        { name: "500 Diamonds Bundle", gameName: "Mobile Legends", sales: 110, revenue: 2750.00 },
        { name: "UC Elite Royale", gameName: "PUBG Mobile", sales: 55, revenue: 2749.45 },
        { name: "Points Master pack", gameName: "Valorant", sales: 15, revenue: 1500.00 }
      ]
    },
    "all-time": {
      totalRevenue: 18500.00,
      totalSales: 610,
      totalOrders: 504,
      averageOrderValue: 36.70,
      chartData: [
        { date: "2023 Q1", revenue: 3500.00, sales: 110 },
        { date: "2023 Q2", revenue: 4200.00, sales: 135 },
        { date: "2023 Q3", revenue: 4800.00, sales: 154 },
        { date: "2023 Q4", revenue: 6000.00, sales: 211 }
      ],
      topProducts: [
        { name: "500 Diamonds Bundle", gameName: "Mobile Legends", sales: 290, revenue: 7250.00 },
        { name: "UC Elite Royale", gameName: "PUBG Mobile", sales: 145, revenue: 7248.55 },
        { name: "Points Master pack", gameName: "Valorant", sales: 40, revenue: 4000.00 }
      ]
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getSellerAnalytics();
      setData(res);
    } catch (err) {
      console.warn("Backend analytics API offline, loading offline fallback dataset for layout testing:", err);
      setError("Analytics server connection failed. Offline catalog preview active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const activeData = showDemo || error ? demoDataSets[dateFilter] : data;
  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Store Analytics
          </h1>
          <p className="text-text-muted">
            Track business growth, gross revenue distribution, and top performing package listings.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {error && !showDemo && (
            <Button
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-2 rounded-xl transition-all"
              onPress={() => setShowDemo(true)}
            >
              Load Demo Graphs
            </Button>
          )}
          {showDemo && (
            <Button
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold px-4 py-2 rounded-xl transition-all"
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
            Make sure your backend is running. If you are developing or testing, click "Load Demo Graphs" above.
          </p>
        </div>
      )}

      {/* Date Range Selector Panel */}
      <div className="flex items-center justify-between p-4 border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl">
        <span className="text-xs text-text-muted font-bold uppercase tracking-wider flex items-center gap-1.5 pl-1">
          <Clock className="h-4 w-4 text-primary" /> Select Analysis Range
        </span>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-9 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
        >
          <option value="last-7-days" className="bg-surface text-white">Last 7 Days</option>
          <option value="last-30-days" className="bg-surface text-white">Last 30 Days</option>
          <option value="last-6-months" className="bg-surface text-white">Last 6 Months</option>
          <option value="all-time" className="bg-surface text-white">All Time</option>
        </select>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SellerAnalyticsCard
          title="Total Revenue"
          value={`$${(activeData?.totalRevenue ?? 0).toFixed(2)}`}
          icon={DollarSign}
          trend="+15.2% than last period"
          loading={loading && !showDemo && !error}
        />
        <SellerAnalyticsCard
          title="Total Sales"
          value={activeData?.totalSales ?? 0}
          icon={TrendingUp}
          trend="+8.4% than last period"
          loading={loading && !showDemo && !error}
        />
        <SellerAnalyticsCard
          title="Total Orders"
          value={activeData?.totalOrders ?? 0}
          icon={ShoppingBag}
          trend="+10.1% than last period"
          loading={loading && !showDemo && !error}
        />
        <SellerAnalyticsCard
          title="Average Order Value"
          value={`$${(activeData?.averageOrderValue ?? 0).toFixed(2)}`}
          icon={Percent}
          trend="+3.5% than last period"
          loading={loading && !showDemo && !error}
        />
      </div>

      {/* Main visual panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Line Chart (Span 2) */}
        <div className="lg:col-span-2">
          <SalesChart
            data={activeData?.chartData ?? []}
            loading={loading && !showDemo && !error}
          />
        </div>

        {/* Best Sellers Leaderboard (Span 1) */}
        <div className="lg:col-span-1">
          <TopProducts
            products={activeData?.topProducts ?? []}
            loading={loading && !showDemo && !error}
          />
        </div>
      </div>
    </div>
  );
}
