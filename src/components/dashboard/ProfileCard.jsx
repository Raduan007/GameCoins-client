"use client";

import React, { useState } from "react";
import { Card, CardContent, Button, Avatar, Input } from "@heroui/react";
import { User, Mail, Shield, ShieldCheck, Edit3, Save, X, Calendar } from "lucide-react";

export default function ProfileCard({ profile, onSave, mode }) {
  const { name, email, role, isActive, createdAt } = profile;

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editedName || editedName.trim() === "") {
      setValidationError("Name is required");
      return;
    }

    try {
      setSaving(true);
      setValidationError("");
      setSuccessMsg("");
      setErrorMsg("");

      await onSave(editedName.trim());

      setSuccessMsg("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMsg(err.message || "Failed to update profile name");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(name);
    setIsEditing(false);
    setValidationError("");
    setSuccessMsg("");
    setErrorMsg("");
  };

  const getRoleLabel = (roleStr) => {
    const lower = roleStr?.toLowerCase();
    if (lower === "user") return "Buyer";
    if (lower === "seller") return "Seller";
    if (lower === "admin") return "Admin";
    return roleStr || "Gamer";
  };

  return (
    <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
      <CardContent className="p-8 space-y-8">
        {/* Top Header: Avatar & Title */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-border/30">
          <div className="relative group mb-4">
            <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-70" />
            <Avatar className="w-28 h-28 text-4xl font-black border-2 border-primary/40 relative z-10 bg-surface-light text-white flex items-center justify-center font-bold">
              <Avatar.Fallback>{(name || "G").charAt(0).toUpperCase()}</Avatar.Fallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">{name}</h2>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize mt-2">
            <Shield className="h-3.5 w-3.5" />
            {getRoleLabel(role)}
          </span>
        </div>

        {/* Action Success / Error banners */}
        {successMsg && (
          <div className="rounded-xl border border-success/20 bg-success/10 p-4 text-sm font-semibold text-success text-center">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-xl border border-error/20 bg-error/10 p-4 text-sm font-semibold text-error text-center">
            {errorMsg}
          </div>
        )}

        {/* Profile details form / list */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-text-dim font-bold uppercase tracking-wider block">
                Edit Full Name
              </label>
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                isInvalid={!!validationError}
                errorMessage={validationError}
                placeholder="Enter full name"
                className="w-full text-white"
                classNames={{
                  inputWrapper: "bg-surface-light border-border/80 group-data-[focus=true]:border-primary",
                  input: "text-white font-semibold",
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                isLoading={saving}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark cursor-pointer py-5.5"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                type="button"
                onPress={handleCancel}
                className="rounded-xl font-bold bg-surface-light border border-border text-text-muted hover:text-white cursor-pointer py-5.5"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Display Readonly Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex items-center gap-3 bg-surface-light/30 border border-border/30 rounded-xl p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-light border border-border text-text-muted">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-semibold text-white">{name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 bg-surface-light/30 border border-border/30 rounded-xl p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-light border border-border text-text-muted">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-white truncate">{email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-3 bg-surface-light/30 border border-border/30 rounded-xl p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-light border border-border text-text-muted">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">User Role</p>
                  <p className="text-sm font-semibold text-white">{getRoleLabel(role)}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-center gap-3 bg-surface-light/30 border border-border/30 rounded-xl p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-light border border-border text-text-muted">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Account Status</p>
                  <span className="inline-flex px-2 py-0.5 rounded bg-success/15 border border-success/30 text-xs font-bold text-success capitalize">
                    {isActive ? "active" : "inactive"}
                  </span>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center gap-3 bg-surface-light/30 border border-border/30 rounded-xl p-4 md:col-span-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-light border border-border text-text-muted">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-semibold text-white">{formattedDate}</p>
                </div>
              </div>
            </div>

            {/* Edit button */}
            <div className="flex pt-4">
              <Button
                onPress={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl font-bold bg-secondary text-white hover:bg-secondary-dark cursor-pointer py-5.5 shadow-md shadow-secondary/15"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
