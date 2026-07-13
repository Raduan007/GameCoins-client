"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { dashboardService } from "@/services/dashboard";
import { Avatar, Button, Card, CardContent } from "@heroui/react";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Gamepad2,
  Mail,
  Shield,
  Calendar,
  AlertCircle,
  PlusCircle,
  BarChart3,
  Clock
} from "lucide-react";
import SellerStatCard from "@/components/dashboard/SellerStatCard";
import SellerRecentOrders from "@/components/dashboard/SellerRecentOrders";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSellerData() {
      try {
        setLoading(true);
        setError(null);
        const res = await dashboardService.getSellerOverview();
        // The API returns the wrapper format { success: true, data: { ... } } or just the data depending on client api.ts behavior.
        // The client api.ts returns response.data directly.
        setData(res);
      } catch (err) {
        console.error("Error fetching seller overview:", err);
        setError(err.message || "Failed to load seller dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchSellerData();
  }, []);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  // Mock/Demo data option to let the user see the premium UI even if the backend is not running/implemented
  const [showDemo, setShowDemo] = useState(false);

  const demoData = {
    totalProducts: 12,
    totalOrders: 48,
    totalSales: 36,
    totalRevenue: 1280.50,
    recentOrders: [
      {
        _id: "660000000000000000000001",
        playerName: "Alex Mercer",
        playerId: "ALEX_ML_992",
        quantity: 1,
        totalPrice: 25.00,
        paymentStatus: "paid",
        orderStatus: "completed",
        createdAt: new Date().toISOString(),
        game: { name: "Mobile Legends", logo: "" },
        package: { name: "500 Diamonds Bundle" }
      },
      {
        _id: "660000000000000000000002",
        playerName: "John Doe",
        playerId: "JOHND_FF_881",
        quantity: 2,
        totalPrice: 19.98,
        paymentStatus: "paid",
        orderStatus: "pending",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        game: { name: "Free Fire", logo: "" },
        package: { name: "200 Diamonds Pack" }
      },
      {
        _id: "660000000000000000000003",
        playerName: "Sarah Connor",
        playerId: "SARAH_PUBG_11",
        quantity: 1,
        totalPrice: 49.99,
        paymentStatus: "pending",
        orderStatus: "pending",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        game: { name: "PUBG Mobile", logo: "" },
        package: { name: "UC Elite Royale" }
      }
    ]
  };

  const activeData = showDemo ? demoData : data;
  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Seller Overview for <span className="text-primary">{user?.name || "Merchant"}</span>
          </h1>
          <p className="text-text-muted">
            Manage your store inventory, trace sales volume, and check recent top-up requests.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {error && !showDemo && (
            <Button
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-2 rounded-xl transition-all"
              onPress={() => setShowDemo(true)}
            >
              Load Demo Data
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
          <Link href="/dashboard/seller/products/new">
            <Button
              className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-primary/25 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {activeError && (
        <div className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="text-sm font-semibold">{activeError}</div>
          </div>
          <p className="text-xs text-text-muted pl-8">
            Please make sure your backend is running and that you are logged in as a seller. If you are testing the interface layout, you can click "Load Demo Data" above.
          </p>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SellerStatCard
          title="Total Products"
          value={activeData?.totalProducts ?? 0}
          icon={Package}
          loading={loading && !showDemo}
        />
        <SellerStatCard
          title="Total Orders"
          value={activeData?.totalOrders ?? 0}
          icon={ShoppingBag}
          loading={loading && !showDemo}
        />
        <SellerStatCard
          title="Total Sales"
          value={activeData?.totalSales ?? 0}
          icon={TrendingUp}
          loading={loading && !showDemo}
        />
        <SellerStatCard
          title="Total Revenue"
          value={`$${(activeData?.totalRevenue ?? 0).toFixed(2)}`}
          icon={DollarSign}
          loading={loading && !showDemo}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Store profile details */}
        <div className="lg:col-span-1">
          <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl shadow-xl rounded-2xl h-full border-secondary/10">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                <Avatar className="w-24 h-24 text-3xl font-bold border-2 border-primary/40 relative z-10 bg-surface-light text-white flex items-center justify-center font-bold">
                  <Avatar.Fallback>{(user?.name || "M").charAt(0).toUpperCase()}</Avatar.Fallback>
                </Avatar>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize mb-6">
                <Shield className="h-3 w-3" />
                Store Partner ({user?.role || "Seller"})
              </span>

              <div className="w-full space-y-4 border-t border-border/50 pt-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-light border border-border text-text-muted">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-text-dim">Store Email</p>
                    <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-light border border-border text-text-muted">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-text-dim">Partner Since</p>
                    <p className="text-sm font-medium text-white">{formattedDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Recent orders table/list */}
        <div className="lg:col-span-2">
          <SellerRecentOrders
            orders={activeData?.recentOrders ?? []}
            loading={loading && !showDemo}
            error={activeError}
          />
        </div>
      </div>
    </div>
  );
}
