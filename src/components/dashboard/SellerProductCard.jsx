"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, Button } from "@heroui/react";
import { Gamepad2, Shield, Calendar, Edit2, Trash2, Tag, Layers, Server } from "lucide-react";

export default function SellerProductCard({ product, onDelete }) {
  const {
    _id,
    name, // Package name
    price,
    amount,
    currency = "USD",
    isActive,
    createdAt,
    game
  } = product;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const getStatusBadge = (active) => {
    return active
      ? "bg-success/10 text-success border-success/20"
      : "bg-text-dim/10 text-text-dim border-border";
  };

  return (
    <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 hover:bg-secondary/10 shadow-lg shadow-secondary/2 group">
      <CardContent className="p-5 space-y-4">
        {/* Header: Game Info & Status */}
        <div className="flex justify-between items-start gap-4 pb-3 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-lg blur-xs opacity-40" />
              {game?.logo ? (
                <img
                  src={game.logo}
                  alt={game.name}
                  className="w-10 h-10 rounded-lg object-cover border border-border relative z-10"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-10 h-10 rounded-lg bg-surface-light border border-border items-center justify-center text-text-muted relative z-10 hidden"
                style={{ display: game?.logo ? "none" : "flex" }}
              >
                <Gamepad2 className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">{game?.name || "Game Product"}</h4>
              <p className="text-xs text-text-muted font-semibold">{name || "Coins Package"}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(isActive)}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Layers className="h-3 w-3" /> Category
            </span>
            <span className="font-bold text-white">{game?.category || "Gaming"}</span>
          </div>

          <div>
            <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Server className="h-3 w-3" /> Platform
            </span>
            <span className="font-bold text-white">{game?.platform || "Multiplatform"}</span>
          </div>

          <div>
            <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Calendar className="h-3 w-3" /> Date Added
            </span>
            <span className="font-bold text-white">{formattedDate}</span>
          </div>

          <div>
            <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Tag className="h-3 w-3" /> Price
            </span>
            <span className="font-black text-primary text-sm">${price ? price.toFixed(2) : "0.00"}</span>
          </div>
        </div>

        {/* Actions Button Row */}
        <div className="flex gap-2 pt-3 border-t border-border/20">
          <Link href={`/dashboard/seller/products/${_id}/edit`} className="flex-1">
            <Button
              className="w-full bg-secondary hover:bg-secondary-dark text-white rounded-xl py-4.5 font-bold flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-md shadow-secondary/15 transition-all duration-200"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </Button>
          </Link>
          <Button
            className="flex-1 bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/25 rounded-xl py-4.5 font-bold flex items-center justify-center gap-1.5 text-xs cursor-pointer transition-all duration-200"
            onPress={() => onDelete(_id)}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
