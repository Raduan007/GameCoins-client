"use client";

import React, { useEffect, useState } from "react";
import { Input, Button, Card, CardContent } from "@heroui/react";
import { Search, Filter, ShieldCheck, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import AdminUsersTable from "@/components/dashboard/AdminUsersTable";
import UserDetailsModal from "@/components/dashboard/UserDetailsModal";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Demo fallback state
  const [showDemo, setShowDemo] = useState(false);

  const demoUsers = [
    {
      _id: "660000000000000000000801",
      name: "Alex Mercer",
      email: "alex.m@example.com",
      role: "user",
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: "660000000000000000000802",
      name: "Sarah Connor",
      email: "sarahc@example.com",
      role: "seller",
      isActive: true,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      _id: "660000000000000000000803",
      name: "John Doe",
      email: "johndoe@example.com",
      role: "user",
      isActive: false,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
      _id: "660000000000000000000804",
      name: "Test Admin User",
      email: "test-admin-verify@gamecoins.com",
      role: "admin",
      isActive: true,
      createdAt: new Date(Date.now() - 3600000 * 240).toISOString()
    }
  ];

  const demoDetails = {
    "660000000000000000000801": {
      user: { _id: "660000000000000000000801", name: "Alex Mercer", email: "alex.m@example.com", role: "user", isActive: true, createdAt: new Date().toISOString() },
      recentOrders: [
        { _id: "ord001", totalPrice: 25.00, orderStatus: "completed", createdAt: new Date().toISOString(), game: { name: "Mobile Legends" }, package: { name: "500 Diamonds" } }
      ],
      payments: [
        { _id: "pay001", amount: 25.00, paymentStatus: "paid", paymentMethod: "bkash", transactionId: "BK1829910", createdAt: new Date().toISOString() }
      ],
      wishlistCount: 3
    },
    "660000000000000000000802": {
      user: { _id: "660000000000000000000802", name: "Sarah Connor", email: "sarahc@example.com", role: "seller", isActive: true, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
      recentOrders: [],
      payments: [],
      wishlistCount: 0
    },
    "660000000000000000000803": {
      user: { _id: "660000000000000000000803", name: "John Doe", email: "johndoe@example.com", role: "user", isActive: false, createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
      recentOrders: [
        { _id: "ord002", totalPrice: 10.00, orderStatus: "cancelled", createdAt: new Date().toISOString(), game: { name: "Free Fire" }, package: { name: "100 Diamonds" } }
      ],
      payments: [
        { _id: "pay002", amount: 10.00, paymentStatus: "failed", paymentMethod: "nagad", transactionId: "NG8810291", createdAt: new Date().toISOString() }
      ],
      wishlistCount: 1
    },
    "660000000000000000000804": {
      user: { _id: "660000000000000000000804", name: "Test Admin User", email: "test-admin-verify@gamecoins.com", role: "admin", isActive: true, createdAt: new Date(Date.now() - 3600000 * 240).toISOString() },
      recentOrders: [],
      payments: [],
      wishlistCount: 5
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
        sort: sortOption
      };

      const res = await dashboardService.getAdminUsers(params);
      if (res && res.success && res.data) {
        setUsers(res.data.users || []);
        setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.warn("Backend user listing failed, using offline fallback preview catalog:", err);
      setError("Admin users API connection failed. Offline list viewer active.");
      
      // Calculate local filtering for demo catalog
      let list = [...demoUsers];
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        list = list.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
      }
      if (roleFilter !== "all") {
        list = list.filter(u => u.role === roleFilter);
      }
      if (statusFilter !== "all") {
        list = list.filter(u => u.isActive === (statusFilter === "active"));
      }
      if (sortOption === "oldest") {
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortOption === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setUsers(list);
      setPagination({ page: 1, limit: 10, total: list.length, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, sortOption, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      if (showDemo || error) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        toast.success("User role updated successfully (Demo).");
        return;
      }
      await dashboardService.updateAdminUserRole(userId, newRole);
      toast.success("User role updated successfully.");
      fetchUsers();
    } catch (err) {
      console.error("Error updating user role:", err);
      toast.error(err.message || "Failed to update user role");
    }
  };

  const handleUpdateStatus = async (userId, newActive) => {
    try {
      if (showDemo || error) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: newActive } : u));
        toast.success(`User status updated to ${newActive ? 'Active' : 'Inactive'} (Demo).`);
        return;
      }
      await dashboardService.updateAdminUserStatus(userId, newActive);
      toast.success(`User account ${newActive ? 'activated' : 'deactivated'} successfully.`);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error(err.message || "Failed to update user status");
    }
  };

  const handleOpenDetails = async (usr) => {
    setSelectedUser(usr);
    setModalOpen(true);
    setDetailsLoading(true);

    try {
      if (showDemo || error) {
        setUserDetails(demoDetails[usr._id] || { user: usr, recentOrders: [], payments: [], wishlistCount: 0 });
        return;
      }
      const res = await dashboardService.getAdminUser(usr._id);
      if (res && res.success && res.data) {
        setUserDetails(res.data);
      }
    } catch (err) {
      console.warn("Could not load user profile details, using mock details fallback:", err);
      setUserDetails(demoDetails[usr._id] || { user: usr, recentOrders: [], payments: [], wishlistCount: 0 });
    } finally {
      setDetailsLoading(false);
    }
  };

  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            User Management
          </h1>
          <p className="text-text-muted">
            Search, filter, view purchase sheets, and adjust accounts roles or access statuses globally.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {error && !showDemo && (
            <Button
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-2 rounded-xl transition-all text-xs"
              onPress={() => setShowDemo(true)}
            >
              Load Demo Users
            </Button>
          )}
          {showDemo && (
            <Button
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold px-4 py-2 rounded-xl transition-all text-xs"
              onPress={() => setShowDemo(false)}
            >
              Show API Status
            </Button>
          )}
        </div>
      </div>

      {activeError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200 text-xs">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <strong>Notice:</strong> {activeError} User database fallback viewer active.
          </div>
        </div>
      )}

      {/* Query Filter and Search panel */}
      <div className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-text-dim z-10" />
            <Input
              placeholder="Search by name or email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 h-10 border border-border/50 rounded-xl bg-surface/50 text-white placeholder:text-text-dim outline-none focus-within:border-primary transition-all text-xs"
            />
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-5 px-6 cursor-pointer text-xs transition-all shadow-md shadow-primary/10 shrink-0"
          >
            Search Accounts
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/10">
          {/* Role Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Filter Role</label>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Filter Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Sort Orders</label>
            <select
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Alphabetical (Name)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table / list view */}
      <AdminUsersTable
        users={users}
        onUpdateRole={handleUpdateRole}
        onUpdateStatus={handleUpdateStatus}
        onViewDetails={handleOpenDetails}
        loading={loading}
        currentAdminId={currentUser?._id || currentUser?.userId}
      />

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4 select-none">
          <Button
            size="sm"
            disabled={currentPage === 1 || loading}
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="bg-secondary/15 hover:bg-secondary/30 text-white rounded-lg font-bold min-w-0 px-3 cursor-pointer text-xs flex items-center gap-1 transition-all disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="text-xs font-bold text-text-muted">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <Button
            size="sm"
            disabled={currentPage === pagination.totalPages || loading}
            onPress={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            className="bg-secondary/15 hover:bg-secondary/30 text-white rounded-lg font-bold min-w-0 px-3 cursor-pointer text-xs flex items-center gap-1 transition-all disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modal Dialog */}
      <UserDetailsModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedUser(null); setUserDetails(null); }}
        userDetails={userDetails}
        loading={detailsLoading}
      />
    </div>
  );
}
