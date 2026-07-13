"use client";

import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { Loader2 } from "lucide-react";

export default function PackageForm({ initialData = null, gamesList = [], onSubmit, onCancel, submitting }) {
  const [formData, setFormData] = useState({
    game: "",
    name: "",
    amount: "",
    price: "",
    currency: "USD",
    description: "",
    isActive: true,
    isPopular: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        game: typeof initialData.game === "object" ? initialData.game?._id || "" : initialData.game || "",
        name: initialData.name || "",
        amount: initialData.amount || "",
        price: initialData.price || "",
        currency: initialData.currency || "USD",
        description: initialData.description || "",
        isActive: initialData.isActive !== false,
        isPopular: !!initialData.isPopular
      });
    } else if (gamesList.length > 0 && !formData.game) {
      // Default to first game in list
      setFormData(prev => ({ ...prev, game: gamesList[0]._id }));
    }
  }, [initialData, gamesList]);

  const validate = () => {
    const newErrors = {};
    if (!formData.game) newErrors.game = "Game reference is required";
    if (!formData.name.trim()) newErrors.name = "Package name is required";
    
    const numAmount = Number(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    const numPrice = Number(formData.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        amount: Number(formData.amount),
        price: Number(formData.price)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Game Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Associate Game</label>
        <select
          value={formData.game}
          onChange={(e) => setFormData({ ...formData, game: e.target.value })}
          className="h-10 px-3 border border-border/50 rounded-xl bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer"
        >
          {gamesList.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name} ({g.platform})
            </option>
          ))}
        </select>
        {errors.game && <span className="text-[10px] text-error pl-1 font-bold">{errors.game}</span>}
      </div>

      {/* Package Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Package Name</label>
        <Input
          placeholder="e.g. 500 Diamonds Pack"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
        />
        {errors.name && <span className="text-[10px] text-error pl-1 font-bold">{errors.name}</span>}
      </div>

      {/* Amount of coins */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Coin Amount</label>
        <Input
          type="number"
          placeholder="500"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
        />
        {errors.amount && <span className="text-[10px] text-error pl-1 font-bold">{errors.amount}</span>}
      </div>

      {/* Price & Currency */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Price</label>
          <Input
            type="number"
            step="0.01"
            placeholder="9.99"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus-within:border-primary transition-all text-xs"
          />
          {errors.price && <span className="text-[10px] text-error pl-1 font-bold">{errors.price}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Currency</label>
          <Input
            value={formData.currency}
            disabled
            className="border border-border/50 rounded-xl bg-surface/50 text-white opacity-60 outline-none text-xs"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Description (Optional)</label>
        <textarea
          placeholder="Package description or requirements..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-3 border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus:border-primary transition-all text-xs"
        />
      </div>

      {/* Status flags */}
      <div className="flex flex-wrap gap-5 py-2 pl-1 select-none">
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
          {initialData ? "Save Changes" : "Create Package"}
        </Button>
      </div>
    </form>
  );
}
