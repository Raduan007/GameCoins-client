"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";
import {
  Search, Filter, ChevronLeft, ChevronRight, X,
  ShoppingBag, AlertCircle, RefreshCw
} from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import AdminOrdersTable from "@/components/dashboard/AdminOrdersTable";
import AdminOrderDetailsModal from "@/components/dashboard/AdminOrderDetailsModal";
import toast from "react-hot-toast";

const ORDER_STATUS_OPTIONS = ["all", "pending", "processing", "completed", "cancelled"];
const PAYMENT_STATUS_OPTIONS = ["all", "pending", "paid", "failed"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: 10,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (orderStatusFilter !== "all") params.orderStatus = orderStatusFilter;
      if (paymentStatusFilter !== "all") params.paymentStatus = paymentStatusFilter;

      const res = await dashboardService.getAdminOrders(params);
      const data = res?.data || res;
      setOrders(data?.orders || []);
      setPagination(data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, orderStatusFilter, paymentStatusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, orderStatusFilter, paymentStatusFilter]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleStatusUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? { ...o, orderStatus: updatedOrder.orderStatus } : o))
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setOrderStatusFilter("all");
    setPaymentStatusFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || orderStatusFilter !== "all" || paymentStatusFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Order Management
          </h1>
          <p className="text-sm text-text-muted mt-1">
            View, search, and manage all platform orders.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold">
            {pagination.total} Total Orders
          </span>
          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl border border-border/30 text-text-muted hover:text-white hover:border-border transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
          <input
            type="text"
            placeholder="Search by buyer, game, or player ID…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-surface/50 border border-border/40 rounded-xl text-white text-xs outline-none focus:border-primary transition-all placeholder:text-text-dim"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Order Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-dim flex-shrink-0" />
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="h-10 px-3 pr-8 bg-surface/50 border border-border/40 rounded-xl text-white text-xs outline-none focus:border-primary transition-all cursor-pointer"
          >
            {ORDER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[#0f0f1a]">
                Order: {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="h-10 px-3 pr-8 bg-surface/50 border border-border/40 rounded-xl text-white text-xs outline-none focus:border-primary transition-all cursor-pointer"
          >
            {PAYMENT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[#0f0f1a]">
                Payment: {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="h-10 px-3 flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-white border border-border/30 hover:border-border rounded-xl transition-all cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
          <button onClick={fetchOrders} className="ml-auto text-xs font-bold underline cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Orders Table */}
      <AdminOrdersTable
        orders={orders}
        loading={loading}
        onViewDetails={handleViewDetails}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && !loading && (
        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <p className="text-xs text-text-muted">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            <span className="font-bold text-white">{pagination.total}</span> orders
          </p>

          <div className="flex items-center gap-2">
            <Button
              isDisabled={currentPage <= 1}
              onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-9 px-3 bg-surface-light border border-border/30 text-text-muted hover:text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </Button>

            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    p === currentPage
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-surface-light border border-border/30 text-text-muted hover:text-white"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <Button
              isDisabled={currentPage >= pagination.totalPages}
              onPress={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="h-9 px-3 bg-surface-light border border-border/30 text-text-muted hover:text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 transition-all"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {modalOpen && selectedOrder && (
        <AdminOrderDetailsModal
          order={selectedOrder}
          onClose={() => { setModalOpen(false); setSelectedOrder(null); }}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}
