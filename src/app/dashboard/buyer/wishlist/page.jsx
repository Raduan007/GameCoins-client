"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard";
import WishlistCard from "@/components/dashboard/WishlistCard";
import { Card, CardContent, Spinner } from "@heroui/react";
import { Heart, ArrowLeft, AlertCircle } from "lucide-react";

export default function BuyerWishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchWishlist() {
    try {
      setLoading(true);
      const data = await dashboardService.getBuyerWishlist();
      setWishlist(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      if (err.message?.includes("No wishlist items found") || err.message?.includes("not found")) {
        setWishlist([]);
        setError(null);
      } else {
        setError(err.message || "Failed to load wishlist");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await dashboardService.removeFromWishlist(id);
      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
      throw err;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/buyer"
              className="text-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">My Saved Wishlist</h1>
          </div>
          <p className="text-text-muted">
            Check rates, popularity, and purchase status of your favorite saved games.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        /* Empty State */
        <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl shadow-xl rounded-2xl">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-surface-light border border-border rounded-full flex items-center justify-center text-text-dim mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Games In Wishlist</h3>
            <p className="text-text-muted max-w-sm mb-6">
              Your wishlist is currently empty. Explore our popular catalogue of games to bookmark your favorites.
            </p>
            <Link
              href="/#popular-games"
              className="inline-flex h-11 items-center justify-center px-6 py-2.5 text-sm font-bold bg-primary text-white hover:bg-primary-dark rounded-xl transition-all shadow-md shadow-primary/20"
            >
              Browse Games
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((item) => (
            <WishlistCard key={item._id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
