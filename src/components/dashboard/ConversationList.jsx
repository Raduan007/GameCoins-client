"use client";

import React from "react";
import { Avatar, Card, CardContent } from "@heroui/react";
import { MessageSquare } from "lucide-react";

export default function ConversationList({
  conversations = [],
  activeId,
  onSelect,
  loading
}) {
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 p-3.5 border border-border/10 rounded-xl bg-surface-light/10 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-surface-light" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-light rounded w-20" />
              <div className="h-3 bg-surface-light rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center p-4">
        <div className="h-12 w-12 bg-surface-light border border-border rounded-full flex items-center justify-center text-text-dim mb-3">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-bold text-white mb-1">No chats found</p>
        <p className="text-xs text-text-muted">You have no active customer messages.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => {
        const { _id, buyer = {}, lastMessage = {}, unreadCount = 0 } = conv;
        const isActive = _id === activeId;
        const buyerName = buyer.name || buyer.email || "Anonymous Buyer";
        const initial = buyerName.charAt(0).toUpperCase();

        return (
          <div
            key={_id}
            onClick={() => onSelect(conv)}
            className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-secondary/20 border-secondary/40 shadow-md shadow-secondary/5"
                : "border-border/10 bg-surface-light/5 hover:bg-surface-light/20"
            }`}
          >
            {/* Buyer Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="w-10 h-10 text-xs font-bold bg-surface-light border border-border text-white">
                <Avatar.Fallback>{initial}</Avatar.Fallback>
              </Avatar>
              {/* Green active dot or similar indicator could go here */}
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="text-sm font-bold text-white truncate max-w-[120px]">{buyerName}</h4>
                <span className="text-[10px] text-text-dim font-semibold">
                  {formatTime(lastMessage.createdAt)}
                </span>
              </div>
              <p className="text-xs text-text-muted truncate pr-2">
                {lastMessage.text || "No messages yet"}
              </p>
            </div>

            {/* Unread Badge */}
            {unreadCount > 0 && (
              <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-extrabold bg-primary text-white shadow-md shadow-primary/20 shrink-0 animate-pulse">
                {unreadCount}
              </span>
            )}

          </div>
        );
      })}
    </div>
  );
}
