"use client";

import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { Search, Plus, Filter, AlertCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import AdminPackagesTable from "@/components/dashboard/AdminPackagesTable";
import PackageForm from "@/components/dashboard/PackageForm";
import PackageDetailsModal from "@/components/dashboard/PackageDetailsModal";
import toast from "react-hot-toast";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [gameFilter, setGameFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Forms state
  const [formOpen, setFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Offline fallback catalog
  const [showDemo, setShowDemo] = useState(false);

  const demoGames = [
    { _id: "game111", name: "Mobile Legends", platform: "Mobile" },
    { _id: "game222", name: "PUBG Mobile", platform: "Mobile" },
    { _id: "game333", name: "Genshin Impact", platform: "PC" }
  ];

  const demoPackages = [
    {
      _id: "pkg101",
      game: { _id: "game111", name: "Mobile Legends", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvyf7fRjRz2g-3932rB-o_yGfX99jZ1zG1ng&s" },
      name: "250 Diamonds Pack",
      amount: 250,
      price: 4.99,
      currency: "USD",
      isActive: true,
      isPopular: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: "pkg102",
      game: { _id: "game111", name: "Mobile Legends", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvyf7fRjRz2g-3932rB-o_yGfX99jZ1zG1ng&s" },
      name: "1000 Diamonds Pack",
      amount: 1000,
      price: 19.99,
      currency: "USD",
      isActive: true,
      isPopular: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: "pkg201",
      game: { _id: "game222", name: "PUBG Mobile", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvyf7fRjRz2g-3932rB-o_yGfX99jZ1zG1ng&s" },
      name: "60 Unknown Cash (UC)",
      amount: 60,
      price: 0.99,
      currency: "USD",
      isActive: false,
      isPopular: false,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];

  const fetchGamesList = async () => {
    try {
      const res = await dashboardService.getAdminGames({ limit: 100 });
      if (res && res.success && res.data) {
        setGames(res.data.games || []);
      }
    } catch (err) {
      console.warn("Could not retrieve games list dropdown from API. Using local fallback list:", err);
      setGames(demoGames);
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        game: gameFilter,
        isActive: statusFilter
      };

      const res = await dashboardService.getAdminPackages(params);
      if (res && res.success && res.data) {
        setPackages(res.data.packages || []);
        setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.warn("Backend packages list API connection failed. Fallback list catalog active:", err);
      setError("Admin packages API endpoint unreachable. Displaying fallback catalog.");

      // Calculate offline search filter criteria
      let list = [...demoPackages];
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(query));
      }
      if (gameFilter !== "all") {
        list = list.filter(p => {
          const gameId = typeof p.game === "object" ? p.game?._id : p.game;
          return gameId === gameFilter;
        });
      }
      if (statusFilter !== "all") {
        list = list.filter(p => p.isActive === (statusFilter === "true"));
      }

      setPackages(list);
      setPagination({ page: 1, limit: 10, total: list.length, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamesList();
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [gameFilter, statusFilter, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPackages();
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setSubmitting(true);
      if (showDemo || error) {
        if (editingPackage) {
          setPackages(prev => prev.map(p => p._id === editingPackage._id ? { ...p, ...formData, game: games.find(g => g._id === formData.game) } : p));
          toast.success("Package details modified (Demo Catalog).");
        } else {
          const newP = {
            ...formData,
            _id: "pkg_" + Date.now(),
            game: games.find(g => g._id === formData.game),
            createdAt: new Date().toISOString()
          };
          setPackages(prev => [newP, ...prev]);
          toast.success("New package created (Demo Catalog).");
        }
        setFormOpen(false);
        setEditingPackage(null);
        return;
      }

      if (editingPackage) {
        await dashboardService.updateAdminPackage(editingPackage._id, formData);
        toast.success("Package details modified successfully.");
      } else {
        await dashboardService.createAdminPackage(formData);
        toast.success("New package added successfully.");
      }
      setFormOpen(false);
      setEditingPackage(null);
      fetchPackages();
    } catch (err) {
      console.error("Package submission error:", err);
      toast.error(err.message || "Failed to update package details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (pkgId) => {
    try {
      if (showDemo || error) {
        setPackages(prev => prev.filter(p => p._id !== pkgId));
        toast.success("Package profile removed (Demo Catalog).");
        return;
      }
      await dashboardService.deleteAdminPackage(pkgId);
      toast.success("Package profile removed successfully.");
      fetchPackages();
    } catch (err) {
      console.error("Package delete error:", err);
      toast.error(err.message || "Failed to delete package profile.");
    }
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormOpen(true);
  };

  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Packages</h1>
          <p className="text-text-muted">Create, inspect, modify, and delete coin amounts and packages linked to games.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {error && !showDemo && (
            <Button
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-2 rounded-xl transition-all text-xs"
              onPress={() => setShowDemo(true)}
            >
              Load Offline Preview
            </Button>
          )}
          {showDemo && (
            <Button
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold px-4 py-2 rounded-xl transition-all text-xs"
              onPress={() => setShowDemo(false)}
            >
              Check API Connection
            </Button>
          )}
          <Button
            onPress={() => { setEditingPackage(null); setFormOpen(true); }}
            className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-5 px-5 cursor-pointer text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4" /> Add Package
          </Button>
        </div>
      </div>

      {activeError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200 text-xs">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <strong>Notice:</strong> {activeError} Package listings catalog is running on local fallback mode.
          </div>
        </div>
      )}

      {/* Query Filter and Search panel */}
      <div className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-text-dim z-10" />
            <Input
              placeholder="Search by package name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 h-10 border border-border/50 rounded-xl bg-surface/50 text-white placeholder:text-text-dim outline-none focus-within:border-primary transition-all text-xs"
            />
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-5 px-6 cursor-pointer text-xs transition-all shadow-md shadow-primary/10 shrink-0"
          >
            Filter Packages
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/10">
          {/* Associated Game Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Associate Game</label>
            <select
              value={gameFilter}
              onChange={(e) => { setGameFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
            >
              <option value="all">All Games</option>
              {games.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name} ({g.platform})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="true">Active (Published)</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Packages Table List */}
      <AdminPackagesTable
        packages={packages}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        loading={loading}
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

      {/* Create / Edit Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <div className="relative w-full max-w-lg border border-secondary/20 bg-surface/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col animate-scaleUp">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-surface/30">
              <h3 className="text-base font-bold text-white tracking-wide">
                {editingPackage ? "Edit Package Information" : "Add New Coins Package"}
              </h3>
              <button
                onClick={() => setFormOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <PackageForm
                initialData={editingPackage}
                gamesList={games}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => setFormOpen(false)}
                submitting={submitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
