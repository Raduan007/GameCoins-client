"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@heroui/react";
import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  loading?: boolean;
  isPrimary?: boolean;
  /** Stagger delay index (0, 1, 2, 3) */
  index?: number;
}

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  loading,
  isPrimary,
  index = 0,
}: AdminStatCardProps) {
  if (loading) {
    return (
      <Card className="border border-secondary/20 bg-secondary/5 backdrop-blur-xl rounded-2xl h-[120px]">
        <CardContent className="p-6 flex items-center justify-between h-full">
          <div className="space-y-3 flex-1">
            {/* Shimmer skeleton */}
            <div className="h-4 bg-surface-light rounded-md w-24 relative overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: index * 0.1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent"
              />
            </div>
            <div className="h-8 bg-surface-light rounded-md w-16 relative overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: index * 0.1 + 0.1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent"
              />
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-surface-light flex-shrink-0 relative overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: index * 0.1 + 0.2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 22 },
      }}
      style={{ willChange: "transform" }}
    >
      <Card
        className={`border rounded-2xl relative overflow-hidden transition-colors duration-300 group ${
          isPrimary
            ? "border-primary/30 bg-primary/5 hover:border-primary/50"
            : "border-secondary/20 bg-secondary/5 hover:border-secondary/40"
        }`}
      >
        {/* Decorative Gradient */}
        <div
          className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none transition-all duration-300 opacity-20 group-hover:opacity-30 ${
            isPrimary
              ? "bg-gradient-to-bl from-primary to-transparent"
              : "bg-gradient-to-bl from-secondary to-transparent"
          }`}
        />

        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</p>
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.07 + 0.15, type: "spring", stiffness: 300, damping: 20 }}
              className={`text-3xl font-black tracking-tight transition-all duration-300 ${
                isPrimary ? "text-primary group-hover:text-primary-light" : "text-secondary group-hover:text-secondary-light"
              }`}
            >
              {value}
            </motion.p>
          </div>

          <motion.div
            whileHover={{ rotate: 8, scale: 1.12 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm transition-all duration-300 flex-shrink-0 ${
              isPrimary
                ? "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20"
                : "bg-secondary/10 border-secondary/20 text-secondary group-hover:bg-secondary/20"
            }`}
          >
            {Icon && <Icon className="h-5 w-5" />}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
