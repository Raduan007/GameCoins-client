"use client";

import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { Search, Plus, Filter, AlertCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import AdminGamesTable from "@/components/dashboard/AdminGamesTable";
import GameForm from "@/components/dashboard/GameForm";
import GameDetailsModal from "@/components/dashboard/GameDetailsModal";
import toast from "react-hot-toast";

export default function AdminGamesPage() {
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter params
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [popularFilter, setPopularFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Form / modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Offline fallback catalog
  const [showDemo, setShowDemo] = useState(false);

  const demoGames = [
    {
      _id: "game111",
      name: "Mobile Legends",
      slug: "mobile-legends",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvyf7fRjRz2g-3932rB-o_yGfX99jZ1zG1ng&s",
      banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvyf7fRjRz2g-3932rB-o_yGfX99jZ1zG1ng&s",
      shortDescription: "Top multiplayer battle arena game.",
      fullDescription: "Detailed info about Mobile Legends battle arena game.",
      category: "MOBA",
      platform: "Mobile",
      publisher: "Moonton",
      rating: 4.8,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: "game222",
      name: "PUBG Mobile",
      slug: "pubg-mobile",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvyf7fRjRz2g-3932rB-o_yGfX99jZ1zG1ng&s",
      banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvyf7fRjRz2g-3932rB-o_yGfX99jZ1zG1ng&s",
      shortDescription: "Survival shooter battle royale.",
      fullDescription: "Detailed battle royale survival rules and updates.",
      category: "Shooter",
      platform: "Mobile",
      publisher: "Tencent Games",
      rating: 4.6,
      isActive: true,
      isFeatured: false,
      isPopular: true,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      _id: "game333",
      name: "Genshin Impact",
      slug: "genshin-impact",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvyf7fRjRz2g-3932rB-o_yGfX99jZ1zG1ng&s",
      banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvyf7fRjRz2g-3932rB-o_yGfX99jZ1zG1ng&s",
      shortDescription: "Open-world adventure role-playing.",
      fullDescription: "Immersive open world exploration details.",
      category: "RPG",
      platform: "PC, Mobile, Console",
      publisher: "Hoyoverse",
      rating: 4.7,
      isActive: false,
      isFeatured: true,
      isPopular: false,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ];

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        isActive: statusFilter,
        isFeatured: featuredFilter,
        isPopular: popularFilter,
        sort: sortOption
      };

      const res = await dashboardService.getAdminGames(params);
      if (res && res.success && res.data) {
        setGames(res.data.games || []);
        setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.warn("Backend catalog listing error. Using local fallback list:", err);
      setError("Admin games API endpoint unreachable. Displaying fallback catalog.");

      // Local filter calculations for demo layout preview
      let list = [...demoGames];
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        list = list.filter(g => g.name.toLowerCase().includes(query) || g.category.toLowerCase().includes(query));
      }
      if (statusFilter !== "all") {
        list = list.filter(g => g.isActive === (statusFilter === "true"));
      }
      if (featuredFilter !== "all") {
        list = list.filter(g => g.isFeatured === (featuredFilter === "true"));
      }
      if (popularFilter !== "all") {
        list = list.filter(g => g.isPopular === (popularFilter === "true"));
      }
      if (sortOption === "oldest") {
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortOption === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === "rating") {
        list.sort((a, b) => b.rating - a.rating);
      } else {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setGames(list);
      setPagination({ page: 1, limit: 10, total: list.length, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [statusFilter, featuredFilter, popularFilter, sortOption, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchGames();
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setSubmitting(true);
      if (showDemo || error) {
        if (editingGame) {
          setGames(prev => prev.map(g => g._id === editingGame._id ? { ...g, ...formData } : g));
          toast.success("Game details modified (Demo Catalog).");
        } else {
          const newG = { ...formData, _id: "game_" + Date.now(), createdAt: new Date().toISOString() };
          setGames(prev => [newG, ...prev]);
          toast.success("New game catalog profile added (Demo Catalog).");
        }
        setFormOpen(false);
        setEditingGame(null);
        return;
      }

      if (editingGame) {
        await dashboardService.updateAdminGame(editingGame._id, formData);
        toast.success("Game details modified successfully.");
      } else {
        await dashboardService.createAdminGame(formData);
        toast.success("New game catalog profile added successfully.");
      }
      setFormOpen(false);
      setEditingGame(null);
      fetchGames();
    } catch (err) {
      console.error("Game submission error:", err);
      toast.error(err.message || "Failed to update game details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (gameId) => {
    try {
      if (showDemo || error) {
        setGames(prev => prev.filter(g => g._id !== gameId));
        toast.success("Game profile removed (Demo Catalog).");
        return;
      }
      await dashboardService.deleteAdminGame(gameId);
      toast.success("Game catalog profile removed successfully.");
      fetchGames();
    } catch (err) {
      console.error("Game delete error:", err);
      toast.error(err.message || "Failed to delete game catalog profile.");
    }
  };

  const handleOpenEdit = (game) => {
    setEditingGame(game);
    setFormOpen(true);
  };

  const handleOpenDetails = (game) => {
    setSelectedGame(game);
    setDetailsOpen(true);
  };

  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Game Catalog</h1>
          <p className="text-text-muted">Create, inspect, modify, and delete game profiles globally in the marketplace.</p>
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
            onPress={() => { setEditingGame(null); setFormOpen(true); }}
            className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-5 px-5 cursor-pointer text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4" /> Add Catalog Game
          </Button>
        </div>
      </div>

      {activeError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200 text-xs">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <strong>Notice:</strong> {activeError} Games listing catalog is running on local fallback mode.
          </div>
        </div>
      )}

      {/* Query Filter and Search panel */}
      <div className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-text-dim z-10" />
            <Input
              placeholder="Search by game name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 h-10 border border-border/50 rounded-xl bg-surface/50 text-white placeholder:text-text-dim outline-none focus-within:border-primary transition-all text-xs"
            />
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-5 px-6 cursor-pointer text-xs transition-all shadow-md shadow-primary/10 shrink-0"
          >
            Filter Games
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-border/10">
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

          {/* Featured Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Featured</label>
            <select
              value={featuredFilter}
              onChange={(e) => { setFeaturedFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
            >
              <option value="all">Featured - Any</option>
              <option value="true">Featured Only</option>
              <option value="false">Standard Only</option>
            </select>
          </div>

          {/* Popular Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Popular</label>
            <select
              value={popularFilter}
              onChange={(e) => { setPopularFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
            >
              <option value="all">Popularity - Any</option>
              <option value="true">Popular Only</option>
              <option value="false">Standard Only</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Sort Catalog</label>
            <select
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Alphabetical (Name)</option>
              <option value="rating">Rating (Highest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <AdminGamesTable
        games={games}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onViewDetails={handleOpenDetails}
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
          <div className="relative w-full max-w-2xl border border-secondary/20 bg-surface/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col animate-scaleUp">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-surface/30">
              <h3 className="text-base font-bold text-white tracking-wide">
                {editingGame ? "Edit Catalog Game Info" : "Create New Catalog Game"}
              </h3>
              <button
                onClick={() => setFormOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <GameForm
                initialData={editingGame}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => setFormOpen(false)}
                submitting={submitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      <GameDetailsModal
        isOpen={detailsOpen}
        onClose={() => { setDetailsOpen(false); setSelectedGame(null); }}
        game={selectedGame}
      />
    </div>
  );
}
