"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { Card, CardContent, Spinner } from "@heroui/react";
import { User, ArrowLeft, AlertCircle } from "lucide-react";

export default function BuyerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProfile() {
    try {
      setLoading(true);
      const data = await dashboardService.getBuyerProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (updatedName) => {
    try {
      const response = await dashboardService.updateBuyerProfile(updatedName);
      // Wait, check response format. In our controller, we returned:
      // success: true, data: updatedUser (which is user schema document).
      // Let's check response properties.
      if (response && response.success && response.data) {
        setProfile(response.data);
      } else if (response && response.data) {
        setProfile(response.data);
      } else if (response) {
        setProfile(response);
      }
    } catch (err) {
      console.error("Error updating profile name:", err);
      throw err;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/buyer"
              className="text-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Settings</h1>
          </div>
          <p className="text-text-muted">
            Manage your personal credentials, identity roles, and account specifications.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200 max-w-2xl mx-auto">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl max-w-2xl mx-auto h-96 animate-pulse">
          <CardContent className="p-8 flex flex-col items-center justify-center space-y-6">
            <div className="w-28 h-28 rounded-full bg-surface-light animate-pulse" />
            <div className="h-6 bg-surface-light rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-surface-light rounded w-1/4 animate-pulse" />
            <div className="grid grid-cols-2 gap-4 w-full pt-8">
              <div className="h-14 bg-surface-light rounded" />
              <div className="h-14 bg-surface-light rounded" />
              <div className="h-14 bg-surface-light rounded col-span-2" />
            </div>
          </CardContent>
        </Card>
      ) : profile ? (
        /* Profile Display */
        <ProfileCard profile={profile} onSave={handleSave} />
      ) : null}
    </div>
  );
}
