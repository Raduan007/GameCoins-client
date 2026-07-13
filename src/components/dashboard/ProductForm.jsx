"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@heroui/react";
import { Gamepad2, Tag, FileText, ImageIcon, Image, Layers, ArrowLeft, Loader2 } from "lucide-react";

export default function ProductForm({ games = [], onSubmit, submitting, error, initialData = null, mode = "create" }) {
  const [gameId, setGameId] = useState(initialData?.gameId || initialData?.game?._id || initialData?.game || "");
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [banner, setBanner] = useState(initialData?.banner || "");
  const [isActive, setIsActive] = useState(initialData?.status === undefined ? true : initialData.status === "active");

  // Sync state if initialData loads asynchronously
  React.useEffect(() => {
    if (initialData) {
      setGameId(initialData.gameId || initialData.game?._id || initialData.game || "");
      setName(initialData.name || "");
      setPrice(initialData.price ? String(initialData.price) : "");
      setDescription(initialData.description || "");
      setImage(initialData.image || "");
      setBanner(initialData.banner || "");
      setIsActive(initialData.status === "active" || initialData.isActive !== false);
    }
  }, [initialData]);

  // Validation errors state
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!gameId) newErrors.game = "Game is required";
    if (!name.trim()) newErrors.name = "Package name is required";
    if (!price || parseFloat(price) <= 0) newErrors.price = "Price is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      gameId,
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim(),
      image: image.trim(),
      banner: banner.trim(),
      status: isActive ? "active" : "inactive"
    });
  };

  return (
    <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl shadow-2xl rounded-2xl max-w-2xl mx-auto">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Game Selection */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-white text-sm font-semibold flex items-center gap-1.5">
              <Gamepad2 className="h-4 w-4 text-text-dim" /> Game *
            </label>
            <div className={`flex items-center bg-surface-light/40 border rounded-xl px-3 transition-all focus-within:border-secondary ${errors.game ? 'border-danger' : 'border-border/60'}`}>
              <select
                value={gameId}
                onChange={(e) => {
                  setGameId(e.target.value);
                  if (errors.game) setErrors(prev => ({ ...prev, game: "" }));
                }}
                className="w-full h-11 bg-transparent border-none outline-none text-white text-sm placeholder:text-text-dim focus:ring-0 focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-surface text-text-dim">-- Select Game --</option>
                {games.map((g) => (
                  <option key={g._id} value={g._id} className="bg-surface text-white">
                    {g.name} ({g.platform} - {g.category})
                  </option>
                ))}
              </select>
            </div>
            {errors.game && (
              <p className="text-danger text-xs mt-0.5">{errors.game}</p>
            )}
          </div>

          {/* Package Name */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-white text-sm font-semibold flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-text-dim" /> Package Name *
            </label>
            <div className={`flex items-center bg-surface-light/40 border rounded-xl px-3 py-2.5 focus-within:border-secondary transition-all ${errors.name ? 'border-danger' : 'border-border/60'}`}>
              <input
                type="text"
                placeholder="e.g. 500 Diamonds Pack, UC Royale Bundle"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                }}
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-dim focus:ring-0 focus:outline-none"
              />
            </div>
            {errors.name && (
              <p className="text-danger text-xs mt-0.5">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-white text-sm font-semibold flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-text-dim" /> Price ($) *
            </label>
            <div className={`flex items-center bg-surface-light/40 border rounded-xl px-3 py-2.5 focus-within:border-secondary transition-all ${errors.price ? 'border-danger' : 'border-border/60'}`}>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors(prev => ({ ...prev, price: "" }));
                }}
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-dim focus:ring-0 focus:outline-none"
              />
            </div>
            {errors.price && (
              <p className="text-danger text-xs mt-0.5">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-white text-sm font-semibold flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-text-dim" /> Description *
            </label>
            <div className={`flex items-start bg-surface-light/40 border rounded-xl px-3 py-2.5 focus-within:border-secondary transition-all ${errors.description ? 'border-danger' : 'border-border/60'}`}>
              <textarea
                placeholder="Provide bundle description, item quantities, or top-up rules..."
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: "" }));
                }}
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-dim focus:ring-0 focus:outline-none resize-none"
              />
            </div>
            {errors.description && (
              <p className="text-danger text-xs mt-0.5">{errors.description}</p>
            )}
          </div>

          {/* Image URL (Optional) */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-white text-sm font-semibold flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-text-dim" /> Image URL (Optional)
            </label>
            <div className="flex items-center bg-surface-light/40 border border-border/60 rounded-xl px-3 py-2.5 focus-within:border-secondary transition-all">
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-dim focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Banner URL (Optional) */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-white text-sm font-semibold flex items-center gap-1.5">
              <Image className="h-4 w-4 text-text-dim" /> Banner URL (Optional)
            </label>
            <div className="flex items-center bg-surface-light/40 border border-border/60 rounded-xl px-3 py-2.5 focus-within:border-secondary transition-all">
              <input
                type="url"
                placeholder="https://example.com/banner.png"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-dim focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl bg-surface-light/20">
            <div>
              <p className="text-sm font-semibold text-white">Product Status</p>
              <p className="text-xs text-text-muted">Inactive products cannot be purchased by buyers.</p>
            </div>
            <select
              value={isActive ? "active" : "inactive"}
              onChange={(e) => setIsActive(e.target.value === "active")}
              className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-secondary transition-all text-xs cursor-pointer"
            >
              <option value="active" className="bg-surface text-white">Active</option>
              <option value="inactive" className="bg-surface text-white">Inactive</option>
            </select>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2.5 p-4 border border-danger/20 bg-danger/10 text-danger rounded-xl text-xs">
              <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" style={{ display: "none" }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border/30">
            <Link href="/dashboard/seller/products" className="flex-1">
              <Button
                type="button"
                className="w-full bg-surface-light hover:bg-surface-lighter text-white border border-border rounded-xl py-5.5 font-bold flex items-center justify-center gap-1.5 cursor-pointer text-sm"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl py-5.5 font-bold flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md shadow-primary/20 transition-all duration-200"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : mode === "edit" ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
