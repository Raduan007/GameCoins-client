"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Avatar } from "@heroui/react";
import { Shield, Mail, Calendar, Clock, CircleDot } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface AdminProfile {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminProfileCardProps {
  profile?: AdminProfile | null;
}

export default function AdminProfileCard({ profile }: AdminProfileCardProps) {
  const {
    name = "Admin",
    email = "",
    role = "admin",
    isActive = true,
    avatar = "",
    createdAt,
    updatedAt,
  } = profile || {};

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const infoRows = [
    {
      icon: <Mail className="h-3.5 w-3.5 text-text-muted" />,
      label: "Email Address",
      value: <span className="text-white font-medium select-all">{email}</span>,
    },
    {
      icon: <CircleDot className="h-3.5 w-3.5 text-text-muted" />,
      label: "Account Status",
      value: (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
            isActive
              ? "bg-success/10 text-success border-success/20"
              : "bg-danger/10 text-danger border-danger/20"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      icon: <Calendar className="h-3.5 w-3.5 text-text-muted" />,
      label: "Member Since",
      value: <span className="text-white font-medium">{formatDate(createdAt)}</span>,
    },
    {
      icon: <Clock className="h-3.5 w-3.5 text-text-muted" />,
      label: "Last Updated",
      value: <span className="text-white font-medium">{formatDate(updatedAt)}</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.01, transition: { type: "spring", stiffness: 400, damping: 25 } }}
      style={{ willChange: "transform" }}
    >
      <Card className="border border-secondary/15 bg-secondary/5 rounded-2xl relative overflow-hidden shadow-lg group">
        {/* Animated top accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
          className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary opacity-60"
        />

        <CardContent className="p-6 space-y-6">
          {/* Avatar Header */}
          <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b border-border/20">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 22, delay: 0.1 }}
              className="relative"
            >
              <motion.div
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-md"
              />
              <Avatar className="w-20 h-20 border-2 border-primary/20 bg-surface-light text-white font-extrabold text-xl relative z-10 flex items-center justify-center">
                {avatar && <Avatar.Image src={avatar} />}
                <Avatar.Fallback>{name.charAt(0).toUpperCase()}</Avatar.Fallback>
              </Avatar>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="space-y-1"
            >
              <h3 className="text-lg font-extrabold text-white tracking-wide">{name}</h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/20 uppercase tracking-wider">
                <Shield className="h-3 w-3" /> {role}
              </span>
            </motion.div>
          </div>

          {/* Profile Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-4 text-xs font-semibold"
          >
            {infoRows.map((row, i) => (
              <motion.div
                key={row.label}
                variants={staggerItem}
                className={`flex items-center justify-between py-1 ${
                  i < infoRows.length - 1 ? "border-b border-border/10" : ""
                }`}
              >
                <span className="text-text-dim flex items-center gap-2">
                  {row.icon} {row.label}
                </span>
                {row.value}
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
