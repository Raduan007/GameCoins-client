"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import ProductForm from "@/components/dashboard/ProductForm";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [games, setGames] = useState([]);
  const [product, setProduct] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fallbacks for testing/offline support
  const fallbackGames = [
    { _id: "660000000000000000000091", name: "Mobile Legends", platform: "Mobile", category: "MOBA" },
    { _id: "660000000000000000000092", name: "Free Fire", platform: "Mobile", category: "Shooter" },
    { _id: "660000000000000000000093", name: "PUBG Mobile", platform: "Mobile", category: "Battle Royale" },
    { _id: "660000000000000000000094", name: "Valorant", platform: "PC", category: "FPS" }
  ];

  const getFallbackProduct = (prodId) => ({
    _id: prodId,
    name: "500 Diamonds Bundle",
    price: 25.00,
    description: "Standard diamonds top-up bundle details.",
    image: "",
    banner: "",
    status: "active",
    gameId: "660000000000000000000091"
  });

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch games list and product bundle in parallel
        const [gamesList, productDetails] = await Promise.all([
          dashboardService.getGames(),
          dashboardService.getSellerProductById(id)
        ]);

        setGames(gamesList || []);
        setProduct(productDetails);
      } catch (err) {
        console.warn("Backend endpoints offline or failed to fetch, loading local mock fallbacks for layout testing:", err);
        setError("API server connection failed. Switched to offline catalog mode.");
        setGames(fallbackGames);
        setProduct(getFallbackProduct(id));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleUpdateProduct = async (formData) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      // If we are editing offline / demo mock data
      const isFallbackProduct = product?._id === id && error;
      if (isFallbackProduct) {
        toast.success("Product updated successfully (Offline demo mode).");
        router.push("/dashboard/seller/products");
        return;
      }

      await dashboardService.updateSellerProduct(id, formData);
      toast.success("Product updated successfully.");
      router.push("/dashboard/seller/products");
    } catch (err) {
      console.error("Error updating product:", err);
      setSubmitError(err.message || "Failed to update package bundle details");
      toast.error(err.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/seller/products"
            className="text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Edit Product Bundle
          </h1>
        </div>
        <p className="text-text-muted pl-8">
          Modify the price, descriptions, or availability status of this game package.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200 text-xs ml-8">
          <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
          <div>
            <strong>Notice:</strong> {error} Offline testing fields loaded.
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm text-text-muted">Loading product bundle details...</span>
        </div>
      ) : !product ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-border/40 bg-surface/40 rounded-2xl p-8">
          <AlertCircle className="h-12 w-12 text-danger mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Product Not Found</h3>
          <p className="text-sm text-text-muted mb-4">The bundle ID you are trying to edit does not exist or has been deleted.</p>
          <Link href="/dashboard/seller/products">
            <button className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl transition-all">
              Back to Products List
            </button>
          </Link>
        </div>
      ) : (
        <ProductForm
          games={games}
          initialData={product}
          onSubmit={handleUpdateProduct}
          submitting={submitting}
          error={submitError}
          mode="edit"
        />
      )}
    </div>
  );
}
