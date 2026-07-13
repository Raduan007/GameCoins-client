"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, Input } from "@heroui/react";
import { Search, Filter, ShoppingBag, AlertCircle, Clock } from "lucide-react";
import { Button } from "@heroui/react";
import { dashboardService } from "@/services/dashboard";
import SellerOrdersTable from "@/components/dashboard/SellerOrdersTable";
import SellerOrderCard from "@/components/dashboard/SellerOrderCard";
import toast from "react-hot-toast";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'processing', 'completed', 'cancelled'

  // Demo state
  const [showDemo, setShowDemo] = useState(false);

  const demoOrders = [
    {
      _id: "660000000000000000000501",
      playerName: "Alex Mercer",
      playerId: "ALEX_ML_992",
      quantity: 1,
      totalPrice: 25.00,
      paymentMethod: "stripe",
      paymentStatus: "paid",
      orderStatus: "completed",
      createdAt: new Date().toISOString(),
      game: { name: "Mobile Legends", logo: "" },
      package: { name: "500 Diamonds Bundle" },
      user: { name: "Alex Mercer", email: "alex.m@example.com" }
    },
    {
      _id: "660000000000000000000502",
      playerName: "John Doe",
      playerId: "JOHND_FF_881",
      quantity: 2,
      totalPrice: 19.98,
      paymentMethod: "paypal",
      paymentStatus: "paid",
      orderStatus: "processing",
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      game: { name: "Free Fire", logo: "" },
      package: { name: "200 Diamonds Pack" },
      user: { name: "John Doe", email: "johndoe@example.com" }
    },
    {
      _id: "660000000000000000000503",
      playerName: "Sarah Connor",
      playerId: "SARAH_PUBG_11",
      quantity: 1,
      totalPrice: 49.99,
      paymentMethod: "stripe",
      paymentStatus: "pending",
      orderStatus: "pending",
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      game: { name: "PUBG Mobile", logo: "" },
      package: { name: "UC Elite Royale" },
      user: { name: "Sarah Connor", email: "sarahc@example.com" }
    },
    {
      _id: "660000000000000000000504",
      playerName: "Bruce Wayne",
      playerId: "BATMAN_PC_1",
      quantity: 1,
      totalPrice: 100.00,
      paymentMethod: "stripe",
      paymentStatus: "failed",
      orderStatus: "cancelled",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      game: { name: "Valorant", logo: "" },
      package: { name: "Points Master pack" },
      user: { name: "Bruce Wayne", email: "bruce@waynecorp.com" }
    }
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getSellerOrders();
      setOrders(res || []);
    } catch (err) {
      console.error("Error fetching seller orders:", err);
      setError(err.message || "Failed to load orders history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      if (showDemo) {
        toast.success(`Order status updated to ${newStatus} (Demo mode).`);
        // Local mutate for demo mode
        return;
      }

      await dashboardService.updateSellerOrderStatus(id, newStatus);
      toast.success(`Order status updated to ${newStatus} successfully.`);
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error(err.message || "Failed to update order status");
    }
  };

  const activeOrders = showDemo ? demoOrders : orders;
  const activeError = showDemo ? null : error;

  // Search & Filter Logic
  const filteredOrders = activeOrders.filter((ord) => {
    const buyerName = (ord.playerName || ord.user?.name || "").toLowerCase();
    const buyerEmail = (ord.user?.email || "").toLowerCase();
    const orderId = (ord._id || "").toLowerCase();
    const gameName = (ord.game?.name || "").toLowerCase();
    
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      buyerName.includes(search) ||
      buyerEmail.includes(search) ||
      orderId.includes(search) ||
      gameName.includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      ord.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Manage Orders
          </h1>
          <p className="text-text-muted">
            Track user top-up request details and dispatch/process pending orders.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {error && !showDemo && (
            <Button
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-2 rounded-xl transition-all"
              onPress={() => setShowDemo(true)}
            >
              Load Demo Orders
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
            Make sure your backend is running and you are logged in. If you are developing or testing, click "Load Demo Orders" above.
          </p>
        </div>
      )}

      {/* Search and Filters panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl">
        <div className="md:col-span-2 relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-text-dim z-10" />
          <Input
            placeholder="Search by buyer, order ID, or game name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 h-10 border border-border/50 rounded-xl bg-surface/50 text-white placeholder:text-text-dim outline-none focus-within:border-primary transition-all text-xs"
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <Filter className="h-4 w-4 text-text-dim" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
          >
            <option value="all" className="bg-surface text-white">All Statuses</option>
            <option value="pending" className="bg-surface text-white">Pending</option>
            <option value="processing" className="bg-surface text-white">Processing</option>
            <option value="completed" className="bg-surface text-white">Completed</option>
            <option value="cancelled" className="bg-surface text-white">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Loading state skeleton */}
      {loading && !showDemo ? (
        <div className="space-y-4">
          <div className="hidden md:block border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl overflow-hidden h-[300px] animate-pulse" />
          <div className="block md:hidden space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-surface-light rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty state */
        <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl shadow-xl rounded-2xl border-secondary/10">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-surface-light border border-border rounded-full flex items-center justify-center text-text-dim mb-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">No orders found</h4>
            <p className="text-sm text-text-muted max-w-sm">
              {searchTerm || statusFilter !== "all"
                ? "No customer orders match your current searches or filters."
                : "You don't have any customer purchases recorded yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Content layout (Table on desktop, Cards on mobile) */
        <div className="space-y-6">
          <div className="hidden md:block">
            <SellerOrdersTable
              orders={filteredOrders}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
          <div className="block md:hidden grid grid-cols-1 gap-4">
            {filteredOrders.map((order) => (
              <SellerOrderCard
                key={order._id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
