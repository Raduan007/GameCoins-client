"use client";

import React, { useState } from "react";
import { Card, CardContent, Button, Input } from "@heroui/react";
import { Key, Eye, EyeOff, Check, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ChangePasswordForm({ onPasswordChangeSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await onPasswordChangeSuccess({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password failed:", err);
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-secondary/15 bg-secondary/5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] shadow-lg">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1 pb-2 border-b border-border/20">
          <h4 className="text-sm font-bold text-white tracking-wide">Change Password</h4>
          <p className="text-xs text-text-dim">Update your profile security credentials regularly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-text-dim flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-text-muted" /> Current Password
            </label>
            <div className="relative flex items-center">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="bg-secondary/10 border border-secondary/15 rounded-xl text-white font-medium focus-within:border-primary/50 w-full"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 text-text-dim hover:text-white cursor-pointer"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-text-dim flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-text-muted" /> New Password (min. 8 chars)
            </label>
            <div className="relative flex items-center">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-secondary/10 border border-secondary/15 rounded-xl text-white font-medium focus-within:border-primary/50 w-full"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 text-text-dim hover:text-white cursor-pointer"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-text-dim flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-text-muted" /> Confirm Password
            </label>
            <div className="relative flex items-center">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-secondary/10 border border-secondary/15 rounded-xl text-white font-medium focus-within:border-primary/50 w-full"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 text-text-dim hover:text-white cursor-pointer"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-xl cursor-pointer transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Saving Password...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
