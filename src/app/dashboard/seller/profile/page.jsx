"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { Card, CardContent, Button } from "@heroui/react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SellerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo fallback state
  const [showDemo, setShowDemo] = useState(false);

  const getDemoProfile = () => ({
    name: user?.name || "Premium Store Partner",
    email: user?.email || "merchant@gamecoins.com",
    role: "seller",
    isActive: true,
    createdAt: user?.createdAt || new Date().toISOString()
  });

  async function fetchProfile() {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getSellerProfile();
      setProfile(data);
    } catch (err) {
      console.warn("Backend getBuyerProfile() failed, loading local fallback profile:", err);
      setError("Could not connect to profile server. Offline mode active.");
      setProfile(getDemoProfile());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (updatedName) => {
    try {
      if (showDemo || error) {
        setProfile(prev => ({ ...prev, name: updatedName }));
        return;
      }
      const response = await dashboardService.updateSellerProfile(updatedName);
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

  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/seller"
              className="text-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Settings</h1>
          </div>
          <p className="text-text-muted pl-8">
            Manage your store merchant name, email address, and verify account roles.
          </p>
        </div>
        <div className="flex gap-2">
          {error && !showDemo && (
            <Button
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-2 rounded-xl transition-all text-xs"
              onPress={() => setShowDemo(true)}
            >
              Load Demo Profile
            </Button>
          )}
          {showDemo && (
            <Button
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold px-4 py-2 rounded-xl transition-all text-xs"
              onPress={() => setShowDemo(false)}
            >
              Show API Status
            </Button>
          )}
        </div>
      </div>

      {activeError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200 max-w-2xl mx-auto text-xs">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <strong>Notice:</strong> {activeError} Editable demo profile loaded.
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !showDemo ? (
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
        <ProfileCard profile={profile} onSave={handleSave} mode="seller" />
      ) : null}
    </div>
  );
}
