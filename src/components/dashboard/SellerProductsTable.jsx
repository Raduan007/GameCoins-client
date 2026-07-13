"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Gamepad2, Edit2, Trash2, Calendar } from "lucide-react";

export default function SellerProductsTable({ products = [], onDelete }) {
  const getStatusBadge = (active) => {
    return active
      ? "bg-success/10 text-success border-success/20"
      : "bg-text-dim/10 text-text-dim border-border";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl shadow-secondary/2">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-surface-light/30 text-xs font-bold uppercase tracking-wider text-text-muted">
              <th className="p-4 pl-6">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Platform</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date Added</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const { _id, name, price, isActive, createdAt, game } = product;
              return (
                <tr
                  key={_id}
                  className="border-b border-border/10 last:border-0 hover:bg-surface-light/20 transition-colors duration-200"
                >
                  {/* Game & Bundle Details */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      {game?.logo ? (
                        <img
                          src={game.logo}
                          alt={game.name}
                          className="w-9 h-9 rounded-md object-cover border border-border"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-9 h-9 rounded-md bg-surface-light border border-border items-center justify-center text-text-muted hidden"
                        style={{ display: game?.logo ? "none" : "flex" }}
                      >
                        <Gamepad2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white tracking-wide">{game?.name || "Game Token"}</p>
                        <p className="text-xs text-text-muted font-medium">{name || "Bundle Pack"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4 text-sm font-medium text-white">
                    {game?.category || "Gaming"}
                  </td>

                  {/* Platform */}
                  <td className="p-4 text-sm font-medium text-white">
                    {game?.platform || "Multiplatform"}
                  </td>

                  {/* Price */}
                  <td className="p-4 text-sm font-black text-primary">
                    ${price ? price.toFixed(2) : "0.00"}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(isActive)}`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Date Created */}
                  <td className="p-4 text-sm text-text-muted font-semibold">
                    {formatDate(createdAt)}
                  </td>

                  {/* Actions Row */}
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/seller/products/${_id}/edit`}>
                        <Button
                          size="sm"
                          className="bg-secondary hover:bg-secondary-dark text-white rounded-lg font-bold min-w-0 p-2 cursor-pointer shadow-md shadow-secondary/15 transition-all duration-200"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/20 rounded-lg font-bold min-w-0 p-2 cursor-pointer transition-all duration-200"
                        onPress={() => onDelete(_id)}
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
