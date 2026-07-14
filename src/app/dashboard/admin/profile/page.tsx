"use client";

import React, { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard";
import AdminProfileCard from "@/components/dashboard/AdminProfileCard";
import EditProfileForm from "@/components/dashboard/EditProfileForm";
import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";
import { Button } from "@heroui/react";
import { Shield, AlertCircle, RefreshCw } from "lucide-react";

interface AdminProfile {
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Demo fallback state if API call fails
  const [showDemo, setShowDemo] = useState<boolean>(false);

  const demoProfile: AdminProfile = {
    name: "Apex Administrator",
    email: "admin@gamecoins.com",
    role: "admin",
    isActive: true,
    avatar: "https://placehold.co/128x128/000000/ffffff.png?text=Admin",
    createdAt: new Date(Date.now() - 3600 * 24 * 60 * 1000).toISOString(), // 60 days ago
    updatedAt: new Date().toISOString(),
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getAdminProfile();
      setProfile(res.data);
    } catch (err: any) {
      console.warn("Backend profile API unreachable, activating offline visual demo mockup profile:", err);
      setError("Admin profile API connection failed. Offline preview mode active.");
      setProfile(demoProfile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (updateData: any) => {
    // API trigger
    if (!showDemo && !error) {
      const res = await dashboardService.updateAdminProfile(updateData);
      setProfile(res.data);
      return res;
    } else {
      // Offline mode mock update
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };
      });
      return { data: { ...profile, ...updateData } };
    }
  };

  const handleChangePassword = async (passwordData: any) => {
    // API trigger
    if (!showDemo && !error) {
      return await dashboardService.changeAdminPassword(passwordData);
    } else {
      // Offline mode mockup check
      if (passwordData.currentPassword !== "admin_secure_pass_123" && showDemo) {
        throw { response: { data: { message: "Incorrect current password (mock demo password is 'admin_secure_pass_123')" } } };
      }
      return { success: true };
    }
  };

  const activeProfile = showDemo ? demoProfile : profile;
  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Admin Profile & Settings
          </h1>
          <p className="text-text-muted">
            Manage your console account credentials, personal credentials, and settings.
          </p>
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          <Button
            size="sm"
            onPress={fetchProfile}
            isDisabled={loading && !showDemo}
            className="bg-secondary/15 border border-secondary/20 hover:bg-secondary/30 text-white rounded-xl font-bold py-5 px-4 cursor-pointer text-xs flex items-center gap-1.5 transition-all flex-1 sm:flex-initial"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading && !showDemo ? "animate-spin" : ""}`} /> Refresh
          </Button>
          {error && !showDemo && (
            <Button
              size="sm"
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-5 rounded-xl transition-all text-xs flex-1 sm:flex-initial"
              onPress={() => setShowDemo(true)}
            >
              Load Demo Profile
            </Button>
          )}
          {showDemo && (
            <Button
              size="sm"
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold px-4 py-5 rounded-xl transition-all text-xs flex-1 sm:flex-initial"
              onPress={() => setShowDemo(false)}
            >
              Show API Status
            </Button>
          )}
        </div>
      </div>

      {activeError && (
        <div className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="text-sm font-semibold">{activeError}</div>
          </div>
          <p className="text-xs text-text-muted pl-8">
            Make sure your database server is running and your account is logged in as an administrator. To check the profile layout, click "Load Demo Profile" above.
          </p>
        </div>
      )}

      {/* Grid Layout: Profile Card left, edit forms right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Admin details summary */}
        <div className="lg:col-span-1">
          {loading && !showDemo && !error ? (
            <div className="h-[360px] w-full bg-secondary/5 rounded-2xl border border-secondary/15 flex items-center justify-center text-text-dim text-xs animate-pulse">
              Loading profile summary...
            </div>
          ) : (
            <AdminProfileCard profile={activeProfile} />
          )}
        </div>

        {/* Right Column: Update forms */}
        <div className="lg:col-span-2 space-y-6">
          {loading && !showDemo && !error ? (
            <div className="h-[500px] w-full bg-secondary/5 rounded-2xl border border-secondary/15 flex items-center justify-center text-text-dim text-xs animate-pulse">
              Loading configurations...
            </div>
          ) : (
            <>
              {/* Edit name/avatar */}
              <EditProfileForm
                key={activeProfile ? `${activeProfile.name}-${activeProfile.avatar}-${activeProfile.updatedAt}` : "empty"}
                profile={activeProfile}
                onUpdateSuccess={handleUpdateProfile}
              />

              {/* Password change */}
              <ChangePasswordForm
                onPasswordChangeSuccess={handleChangePassword}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
