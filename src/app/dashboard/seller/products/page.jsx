"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, Input, Select, SelectItem } from "@heroui/react";
import {
  PlusCircle,
  Search,
  Filter,
  Package,
  AlertCircle,
  Clock,
  Layers,
  HelpCircle
} from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import SellerProductsTable from "@/components/dashboard/SellerProductsTable";
import SellerProductCard from "@/components/dashboard/SellerProductCard";
import toast from "react-hot-toast";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive'

  // Demo fallback state
  const [showDemo, setShowDemo] = useState(false);

  const demoProducts = [
    {
      _id: "660000000000000000000101",
      name: "500 Diamonds Bundle",
      amount: 500,
      price: 25.00,
      isActive: true,
      createdAt: new Date().toISOString(),
      game: {
        name: "Mobile Legends",
        logo: "",
        category: "MOBA",
        platform: "Mobile"
      }
    },
    {
      _id: "660000000000000000000102",
      name: "1000 Diamonds Pack",
      amount: 1000,
      price: 45.00,
      isActive: true,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      game: {
        name: "Mobile Legends",
        logo: "",
        category: "MOBA",
        platform: "Mobile"
      }
    },
    {
      _id: "660000000000000000000103",
      name: "300 UC Bundle",
      amount: 300,
      price: 15.50,
      isActive: false,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      game: {
        name: "PUBG Mobile",
        logo: "",
        category: "Battle Royale",
        platform: "Mobile"
      }
    },
    {
      _id: "660000000000000000000104",
      name: "110 Diamonds Starter",
      amount: 110,
      price: 9.99,
      isActive: true,
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      game: {
        name: "Free Fire",
        logo: "",
        category: "Shooter",
        platform: "Mobile"
      }
    }
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getSellerProducts();
      setProducts(res || []);
    } catch (err) {
      console.error("Error fetching seller products:", err);
      setError(err.message || "Failed to load products list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product bundle? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      if (showDemo) {
        toast.success("Demo product deleted successfully.");
        // local delete for demo state
        return;
      }

      await dashboardService.deleteSellerProduct(id);
      toast.success("Product deleted successfully.");
      // Refresh list
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error(err.message || "Failed to delete product");
    }
  };

  const activeProducts = showDemo ? demoProducts : products;
  const activeError = showDemo ? null : error;

  // Client Search & Filter logic
  const filteredProducts = activeProducts.filter((prod) => {
    const gameName = (prod.game?.name || "").toLowerCase();
    const pkgName = (prod.name || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = gameName.includes(search) || pkgName.includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && prod.isActive) ||
      (statusFilter === "inactive" && !prod.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Manage Products
          </h1>
          <p className="text-text-muted">
            Create, update, or remove top-up coin bundles from your store catalog.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {error && !showDemo && (
            <Button
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-2 rounded-xl transition-all"
              onPress={() => setShowDemo(true)}
            >
              Load Demo Products
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
          <Link href="/dashboard/seller/products/create">
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
            Make sure your backend is running and you are logged in. If you are developing or testing, click "Load Demo Products" above.
          </p>
        </div>
      )}

      {/* Search and Filters panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl">
        <div className="md:col-span-2 relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-text-dim z-10" />
          <Input
            placeholder="Search by game or package name..."
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
            <option value="active" className="bg-surface text-white">Active Only</option>
            <option value="inactive" className="bg-surface text-white">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Loading state skeleton */}
      {loading && !showDemo ? (
        <div className="space-y-4">
          <div className="hidden md:block border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl overflow-hidden h-[250px] animate-pulse" />
          <div className="block md:hidden space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 bg-surface-light rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty state */
        <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl shadow-xl rounded-2xl border-secondary/10">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-surface-light border border-border rounded-full flex items-center justify-center text-text-dim mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">No products found</h4>
            <p className="text-sm text-text-muted max-w-sm mb-6">
              {searchTerm || statusFilter !== "all"
                ? "No products match your current search queries or filters."
                : "You don't have any top-up packages in your store inventory yet."}
            </p>
            <Link href="/dashboard/seller/products/create">
              <Button
                className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-primary/25"
              >
                Create Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Content layout (Table on desktop, Cards on mobile) */
        <div className="space-y-6">
          <div className="hidden md:block">
            <SellerProductsTable
              products={filteredProducts}
              onDelete={handleDelete}
            />
          </div>
          <div className="block md:hidden grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
              <SellerProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
