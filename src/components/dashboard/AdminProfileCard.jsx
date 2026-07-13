"use client";

import React from "react";
import { Card, CardContent, Avatar } from "@heroui/react";
import { Shield, Mail, Calendar, Sparkles, Clock, CircleDot } from "lucide-react";

export default function AdminProfileCard({ profile }) {
  const {
    name = "Admin",
    email = "",
    role = "admin",
    isActive = true,
    avatar = "",
    createdAt,
    updatedAt,
  } = profile || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="border border-secondary/15 bg-secondary/5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] shadow-lg group">
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary opacity-60" />
      <CardContent className="p-6 space-y-6">
        {/* Profile Avatar Header */}
        <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b border-border/20">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-md opacity-60 transition-transform group-hover:scale-105" />
            <Avatar
              src={avatar}
              className="w-20 h-20 border-2 border-primary/20 bg-surface-light text-white font-extrabold text-xl relative z-10 flex items-center justify-center"
            >
              <Avatar.Fallback>{name.charAt(0).toUpperCase()}</Avatar.Fallback>
            </Avatar>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-white tracking-wide">{name}</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/20 uppercase tracking-wider">
              <Shield className="h-3 w-3" /> {role}
            </span>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="space-y-4 text-xs font-semibold">
          <div className="flex items-center justify-between py-1 border-b border-border/10">
            <span className="text-text-dim flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-text-muted" /> Email Address
            </span>
            <span className="text-white font-medium select-all">{email}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-border/10">
            <span className="text-text-dim flex items-center gap-2">
              <CircleDot className="h-3.5 w-3.5 text-text-muted" /> Account Status
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
              isActive
                ? "bg-success/10 text-success border-success/20"
                : "bg-danger/10 text-danger border-danger/20"
            }`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-border/10">
            <span className="text-text-dim flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-text-muted" /> Member Since
            </span>
            <span className="text-white font-medium">{formatDate(createdAt)}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-text-dim flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-text-muted" /> Last Updated
            </span>
            <span className="text-white font-medium">{formatDate(updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
