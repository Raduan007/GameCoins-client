"use client";

import React from "react";
import { Avatar } from "@heroui/react";

export default function MessageBubble({ message, isSeller }) {
  const { sender, message: text, createdAt } = message;

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const senderName = sender?.name || (isSeller ? "You" : "Buyer");
  const initial = senderName.charAt(0).toUpperCase();

  return (
    <div className={`flex gap-3 items-end max-w-[80%] ${isSeller ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
      
      {/* Sender Avatar */}
      <Avatar
        size="sm"
        className={`w-7 h-7 flex-shrink-0 text-[10px] font-bold ${
          isSeller
            ? "bg-primary text-white border border-primary/20 shadow-md shadow-primary/15"
            : "bg-secondary text-white border border-secondary/20 shadow-md shadow-secondary/15"
        }`}
      >
        <Avatar.Fallback>{initial}</Avatar.Fallback>
      </Avatar>

      {/* Message Content Bubble */}
      <div className="space-y-1">
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed border shadow-md ${
            isSeller
              ? "bg-primary/20 border-primary/30 text-white rounded-br-none"
              : "bg-secondary/15 border-secondary/20 text-white rounded-bl-none"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{text}</p>
        </div>
        
        {/* Time Stamp */}
        <p className={`text-[10px] text-text-dim px-1 font-semibold ${isSeller ? "text-right" : "text-left"}`}>
          {formatTime(createdAt)}
        </p>
      </div>

    </div>
  );
}
