"use client";

import React, { useState } from "react";
import { Card, CardContent, Button, Input } from "@heroui/react";
import { User, Image as ImageIcon, Save, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EditProfileForm({ profile, onUpdateSuccess }) {
  const [name, setName] = useState(profile?.name || "");
  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await onUpdateSuccess({ name: name.trim(), avatar: avatar.trim() });
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update profile failed:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-secondary/15 bg-secondary/5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] shadow-lg">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1 pb-2 border-b border-border/20">
          <h4 className="text-sm font-bold text-white tracking-wide">Edit Profile Details</h4>
          <p className="text-xs text-text-dim">Modify your display name and avatar URL representation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Display Name Input */}
          <div className="space-y-1.5">
            <label className="text-text-dim flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-text-muted" /> Display Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-secondary/10 border border-secondary/15 rounded-xl text-white font-medium focus-within:border-primary/50"
            />
          </div>

          {/* Avatar URL Input */}
          <div className="space-y-1.5">
            <label className="text-text-dim flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-text-muted" /> Avatar URL
            </label>
            <Input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="bg-secondary/10 border border-secondary/15 rounded-xl text-white font-medium focus-within:border-primary/50"
            />
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
                  <RefreshCw className="h-4 w-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
