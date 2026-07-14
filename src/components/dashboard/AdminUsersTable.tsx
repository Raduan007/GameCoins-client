"use client";

import React, { useState } from "react";
import { Avatar, Button, Card, CardContent } from "@heroui/react";
import { Mail, Calendar, Shield, Eye, ShieldAlert, Loader2 } from "lucide-react";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  isActive?: boolean;
  avatar?: string | null;
  createdAt: string;
}

interface AdminUsersTableProps {
  users?: UserType[];
  onUpdateRole: (userId: string, newRole: string) => Promise<any> | void;
  onSuspend: (userId: string) => void;
  onBlock: (userId: string) => void;
  onActivate: (userId: string) => void;
  onViewDetails: (user: UserType) => void;
  loading: boolean;
  currentAdminId?: string | null;
}

function UserStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    suspended: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    blocked: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  
  const selectedStyle = styles[status] || "bg-border/10 text-text-muted border-border/20";

  return (
    <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold capitalize ${selectedStyle}`}>
      {status}
    </span>
  );
}

export default function AdminUsersTable({
  users = [],
  onUpdateRole,
  onSuspend,
  onBlock,
  onActivate,
  onViewDetails,
  loading,
  currentAdminId
}: AdminUsersTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string, currentRole: string) => {
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

  const formatDate = (dateStr: string) => {
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
                const status = usr.status || (usr.isActive !== false ? "active" : "suspended");

                return (
                  <tr key={usr._id} className="border-b border-border/10 last:border-0 hover:bg-surface-light/20 transition-colors duration-200">
                    {/* User Avatar + Name */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 font-semibold bg-surface-light border border-border text-white text-xs flex-shrink-0">
                          {usr.avatar && <Avatar.Image src={usr.avatar} />}
                          <Avatar.Fallback>{usr.name?.charAt(0).toUpperCase()}</Avatar.Fallback>
                        </Avatar>
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

                    {/* Status Badge */}
                    <td className="p-4">
                      <UserStatusBadge status={status} />
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 text-xs text-text-muted font-semibold">
                      {formatDate(usr.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end items-center gap-2 flex-wrap">
                        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-primary font-bold mr-1" />}
                        {!isSelf && (
                          <div className="flex gap-1.5 mr-1">
                            {status === "active" && (
                              <>
                                <Button
                                  size="sm"
                                  onPress={() => onSuspend(usr._id)}
                                  className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 rounded-lg text-[10px] font-bold px-2.5 py-1 cursor-pointer transition-all"
                                >
                                  Suspend
                                </Button>
                                <Button
                                  size="sm"
                                  onPress={() => onBlock(usr._id)}
                                  className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-[10px] font-bold px-2.5 py-1 cursor-pointer transition-all"
                                >
                                  Block
                                </Button>
                              </>
                            )}
                            {status === "suspended" && (
                              <>
                                <Button
                                  size="sm"
                                  onPress={() => onActivate(usr._id)}
                                  className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-lg text-[10px] font-bold px-2.5 py-1 cursor-pointer transition-all"
                                >
                                  Activate
                                </Button>
                                <Button
                                  size="sm"
                                  onPress={() => onBlock(usr._id)}
                                  className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-[10px] font-bold px-2.5 py-1 cursor-pointer transition-all"
                                >
                                  Block
                                </Button>
                              </>
                            )}
                            {status === "blocked" && (
                              <Button
                                size="sm"
                                onPress={() => onActivate(usr._id)}
                                className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-lg text-[10px] font-bold px-2.5 py-1 cursor-pointer transition-all"
                              >
                                Activate
                              </Button>
                            )}
                          </div>
                        )}
                        <Button
                          size="sm"
                          onPress={() => onViewDetails(usr)}
                          className="bg-secondary/15 hover:bg-secondary/30 text-white rounded-lg font-bold min-w-0 px-3 py-1 cursor-pointer text-[10px] flex items-center gap-1 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" /> Details
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
          const status = usr.status || (usr.isActive !== false ? "active" : "suspended");

          return (
            <Card key={usr._id} className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl relative overflow-hidden transition-all duration-300">
              <CardContent className="p-5 space-y-4 text-xs">
                {/* Header */}
                <div className="flex justify-between items-center pb-2.5 border-b border-border/20">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7 bg-surface-light border border-border text-white text-[10px] font-semibold">
                      {usr.avatar && <Avatar.Image src={usr.avatar} />}
                      <Avatar.Fallback>{usr.name?.charAt(0).toUpperCase()}</Avatar.Fallback>
                    </Avatar>
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
                      <UserStatusBadge status={status} />
                    )}
                  </div>
                </div>

                {/* Actions Row */}
                <div className="space-y-2 pt-2 border-t border-border/20">
                  {!isSelf && (
                    <div className="flex gap-2">
                      {status === "active" && (
                        <>
                          <Button
                            size="sm"
                            onPress={() => onSuspend(usr._id)}
                            className="flex-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 rounded-xl text-xs font-bold py-2 cursor-pointer transition-all"
                          >
                            Suspend
                          </Button>
                          <Button
                            size="sm"
                            onPress={() => onBlock(usr._id)}
                            className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-xs font-bold py-2 cursor-pointer transition-all"
                          >
                            Block
                          </Button>
                        </>
                      )}
                      {status === "suspended" && (
                        <>
                          <Button
                            size="sm"
                            onPress={() => onActivate(usr._id)}
                            className="flex-1 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-xl text-xs font-bold py-2 cursor-pointer transition-all"
                          >
                            Activate
                          </Button>
                          <Button
                            size="sm"
                            onPress={() => onBlock(usr._id)}
                            className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-xs font-bold py-2 cursor-pointer transition-all"
                          >
                            Block
                          </Button>
                        </>
                      )}
                      {status === "blocked" && (
                        <Button
                          size="sm"
                          onPress={() => onActivate(usr._id)}
                          className="w-full bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-xl text-xs font-bold py-2 cursor-pointer transition-all"
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  )}
                  <div className="flex justify-end items-center gap-2">
                    {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
                    <Button
                      size="sm"
                      onPress={() => onViewDetails(usr)}
                      className="w-full bg-secondary/15 hover:bg-secondary/30 text-white rounded-lg font-bold min-w-0 py-2.5 cursor-pointer text-xs flex items-center justify-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Full Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
