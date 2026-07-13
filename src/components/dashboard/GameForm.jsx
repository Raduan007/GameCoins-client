"use client";

import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { Loader2, Gamepad2, Info } from "lucide-react";

export default function GameForm({ initialData = null, onSubmit, onCancel, submitting }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    banner: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    platform: "",
    publisher: "",
    rating: 0,
    isActive: true,
    isPopular: false,
    isFeatured: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        logo: initialData.logo || "",
        banner: initialData.banner || "",
        shortDescription: initialData.shortDescription || "",
        fullDescription: initialData.fullDescription || "",
        category: initialData.category || "",
        platform: initialData.platform || "",
        publisher: initialData.publisher || "",
        rating: initialData.rating || 0,
        isActive: initialData.isActive !== false,
        isPopular: !!initialData.isPopular,
        isFeatured: !!initialData.isFeatured
      });
    }
  }, [initialData]);

  // Auto-generate slug from name if creating a new game
  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData(prev => {
      const update = { ...prev, name: val };
      if (!initialData) {
        update.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      }
      return update;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Game name is required";
    if (!formData.slug.trim()) newErrors.slug = "Game slug is required";
    if (!formData.logo.trim()) newErrors.logo = "Logo URL is required";
    if (!formData.banner.trim()) newErrors.banner = "Banner URL is required";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    if (!formData.fullDescription.trim()) newErrors.fullDescription = "Full description is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.platform.trim()) newErrors.platform = "Platform is required";
    if (!formData.publisher.trim()) newErrors.publisher = "Publisher is required";
    
    const numRating = Number(formData.rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        rating: Number(formData.rating)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Game Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Game Name</label>
          <Input
            placeholder="e.g. Mobile Legends"
            value={formData.name}
            onChange={handleNameChange}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.name && <span className="text-[10px] text-error pl-1 font-bold">{errors.name}</span>}
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Slug</label>
          <Input
            placeholder="e.g. mobile-legends"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.slug && <span className="text-[10px] text-error pl-1 font-bold">{errors.slug}</span>}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Category</label>
          <Input
            placeholder="e.g. MOBA, RPG, Action"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.category && <span className="text-[10px] text-error pl-1 font-bold">{errors.category}</span>}
        </div>

        {/* Platform */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Platform</label>
          <Input
            placeholder="e.g. Mobile, PC, PlayStation"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.platform && <span className="text-[10px] text-error pl-1 font-bold">{errors.platform}</span>}
        </div>

        {/* Publisher */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Publisher</label>
          <Input
            placeholder="e.g. Moonton"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.publisher && <span className="text-[10px] text-error pl-1 font-bold">{errors.publisher}</span>}
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Initial Rating (0-5)</label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="4.5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.rating && <span className="text-[10px] text-error pl-1 font-bold">{errors.rating}</span>}
        </div>

        {/* Logo URL */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Logo Image URL</label>
          <Input
            placeholder="https://example.com/logo.png"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.logo && <span className="text-[10px] text-error pl-1 font-bold">{errors.logo}</span>}
        </div>

        {/* Banner URL */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Banner Image URL</label>
          <Input
            placeholder="https://example.com/banner.jpg"
            value={formData.banner}
            onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.banner && <span className="text-[10px] text-error pl-1 font-bold">{errors.banner}</span>}
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Short Description</label>
          <Input
            placeholder="Brief overview summary displayed in list catalog..."
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.shortDescription && <span className="text-[10px] text-error pl-1 font-bold">{errors.shortDescription}</span>}
        </div>

        {/* Full Description */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Full Description</label>
          <textarea
            placeholder="Detailed description, gameplay notes, or key requirements..."
            rows={4}
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            className="w-full p-3 border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus:border-primary transition-all text-xs"
          />
          {errors.fullDescription && <span className="text-[10px] text-error pl-1 font-bold">{errors.fullDescription}</span>}
        </div>

        {/* Status flags row */}
        <div className="sm:col-span-2 flex flex-wrap gap-5 py-2 pl-1 select-none">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="accent-primary h-4 w-4"
            />
            Is Active (Published)
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
            <input
              type="checkbox"
              checked={formData.isPopular}
              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              className="accent-primary h-4 w-4"
            />
            Mark as Popular
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="accent-primary h-4 w-4"
            />
            Mark as Featured
          </label>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
        <Button
          type="button"
          onPress={onCancel}
          className="bg-secondary/15 hover:bg-secondary/30 text-white rounded-xl font-bold py-5 px-6 cursor-pointer text-xs transition-all"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-5 px-6 cursor-pointer text-xs transition-all flex items-center gap-1.5 shadow-md shadow-primary/20"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Create Game"}
        </Button>
      </div>
    </form>
  );
}
