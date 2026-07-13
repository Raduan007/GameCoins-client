"use client";

import React, { useState } from "react";
import { Avatar, Button } from "@heroui/react";
import { User, Mail, Calendar, Shield, Eye, ShieldAlert, Loader2 } from "lucide-react";

export default function AdminUsersTable({
  users = [],
  onUpdateRole,
  onUpdateStatus,
  onViewDetails,
  loading,
  currentAdminId
}) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleRoleChange = async (userId, newRole, currentRole) => {
    if (userId === currentAdminId) {
      alert("You cannot change your own admin role.");
      return;
    }
    if (newRole === currentRole) return;

    if (window.confirm(`Are you sure you want to update this user's role to ${newRole.toUpperCase()}?`)) {
      try {
        setUpdatingId(userId);
        await onUpdateRole(userId, newRole);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleStatusToggle = async (userId, currentActive) => {
    if (userId === currentAdminId) {
      alert("You cannot disable your own admin account.");
      return;
    }

    const nextActive = !currentActive;
    const action = nextActive ? "enable" : "disable";
    
    if (window.confirm(`Are you sure you want to ${action} this user's account?`)) {
      try {
        setUpdatingId(userId);
        await onUpdateStatus(userId, nextActive);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="hidden md:block h-64 bg-surface-light/20 border border-border/10 rounded-2xl animate-pulse" />
        <div className="block md:hidden space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-surface-light/20 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/15 bg-secondary/5 rounded-2xl">
        <ShieldAlert className="h-10 w-10 text-text-dim mb-3" />
        <h4 className="text-sm font-bold text-white mb-1">No users found</h4>
        <p className="text-xs text-text-muted">No users match your query parameters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl shadow-secondary/2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-surface-light/30 text-xs font-bold uppercase tracking-wider text-text-muted">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usr) => {
                const isSelf = usr._id === currentAdminId;
                const isUpdating = updatingId === usr._id;

                return (
                  <tr key={usr._id} className="border-b border-border/10 last:border-0 hover:bg-surface-light/20 transition-colors duration-200">
                    {/* User Avatar + Name */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={usr.avatar}
                          name={usr.name}
                          className="w-8 h-8 font-semibold bg-surface-light border border-border text-white text-xs flex-shrink-0"
                          fallback={usr.name?.charAt(0).toUpperCase()}
                        />
                        <span className="text-sm font-semibold text-white flex items-center gap-1">
                          {usr.name} {isSelf && <span className="text-[9px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full font-bold">You</span>}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 text-xs font-semibold text-white select-all">
                      {usr.email}
                    </td>

                    {/* Role Dropdown */}
                    <td className="p-4">
                      {isSelf ? (
                        <span className="inline-flex px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary capitalize">
                          admin
                        </span>
                      ) : (
                        <select
                          value={usr.role || "user"}
                          disabled={isUpdating}
                          onChange={(e) => handleRoleChange(usr._id, e.target.value, usr.role)}
                          className="h-8 px-2 border border-border/50 rounded-lg bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer disabled:opacity-50"
                        >
                          <option value="user">Buyer (User)</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4">
                      {isSelf ? (
                        <span className="inline-flex px-2 py-0.5 rounded bg-success/15 border border-success/30 text-[10px] font-bold text-success capitalize">
                          active
                        </span>
                      ) : (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStatusToggle(usr._id, usr.isActive !== false)}
                          className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer disabled:opacity-50 select-none ${
                            usr.isActive !== false
                              ? "bg-success/10 text-success border-success/30 hover:bg-success/20"
                              : "bg-error/10 text-error border-error/30 hover:bg-error/20"
                          }`}
                        >
                          {usr.isActive !== false ? "Active" : "Inactive"}
                        </button>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 text-xs text-text-muted font-semibold">
                      {formatDate(usr.createdAt)}
                    </td>

                    {/* Actions: View Details */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        <Button
                          size="sm"
                          onPress={() => onViewDetails(usr)}
                          className="bg-secondary/15 hover:bg-secondary/30 text-white rounded-lg font-bold min-w-0 px-3 cursor-pointer text-xs flex items-center gap-1 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Details
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

      {/* Mobile Stack Cards View */}
      <div className="block md:hidden space-y-4">
        {users.map((usr) => {
          const isSelf = usr._id === currentAdminId;
          const isUpdating = updatingId === usr._id;

          return (
            <Card key={usr._id} className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300">
              <CardContent className="p-5 space-y-4 text-xs">
                {/* Header */}
                <div className="flex justify-between items-center pb-2.5 border-b border-border/20">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={usr.avatar}
                      name={usr.name}
                      className="w-7 h-7 bg-surface-light border border-border text-white text-[10px] font-semibold"
                      fallback={usr.name?.charAt(0).toUpperCase()}
                    />
                    <span className="font-bold text-white text-sm">
                      {usr.name} {isSelf && <span className="text-[8px] bg-primary/20 text-primary border border-primary/30 px-1 py-0.5 rounded-full font-bold ml-1">You</span>}
                    </span>
                  </div>
                  <span className="text-[10px] text-text-muted font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-secondary" /> Joined {formatDate(usr.createdAt)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3.5">
                  <div className="flex justify-between">
                    <span className="text-text-dim font-semibold flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</span>
                    <span className="font-bold text-white select-all">{usr.email}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-dim font-semibold flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Role</span>
                    {isSelf ? (
                      <span className="inline-flex px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary capitalize">
                        admin
                      </span>
                    ) : (
                      <select
                        value={usr.role || "user"}
                        disabled={isUpdating}
                        onChange={(e) => handleRoleChange(usr._id, e.target.value, usr.role)}
                        className="h-8 px-2 border border-border/50 rounded-lg bg-surface text-white outline-none focus:border-primary transition-all text-xs cursor-pointer disabled:opacity-50"
                      >
                        <option value="user">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-dim font-semibold flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> Status</span>
                    {isSelf ? (
                      <span className="inline-flex px-2 py-0.5 rounded bg-success/15 border border-success/30 text-[10px] font-bold text-success capitalize">
                        active
                      </span>
                    ) : (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusToggle(usr._id, usr.isActive !== false)}
                        className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer disabled:opacity-50 select-none ${
                          usr.isActive !== false
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-error/10 text-error border-error/30"
                        }`}
                      >
                        {usr.isActive !== false ? "Active" : "Inactive"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex justify-end items-center gap-2 pt-2 border-t border-border/20">
                  {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
                  <Button
                    size="sm"
                    onPress={() => onViewDetails(usr)}
                    className="w-full bg-secondary/15 hover:bg-secondary/30 text-white rounded-lg font-bold min-w-0 py-4.5 cursor-pointer text-xs flex items-center justify-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
