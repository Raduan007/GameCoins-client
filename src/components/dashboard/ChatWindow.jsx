"use client";

import React, { useState, useEffect, useRef } from "react";
import { Avatar, Button } from "@heroui/react";
import { Send, Loader2, ArrowLeft, Gamepad2 } from "lucide-react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({
  activeConversation,
  messages = [],
  onSendMessage,
  onBack,
  sending,
  loadingMessages
}) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    onSendMessage(text.trim());
    setText("");
  };

  if (!activeConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-secondary/15 bg-secondary/5 rounded-2xl">
        <div className="h-16 w-16 bg-surface-light border border-border rounded-full flex items-center justify-center text-text-dim mb-4">
          <Gamepad2 className="h-8 w-8 text-secondary" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Select a Conversation</h3>
        <p className="text-sm text-text-muted max-w-xs">Choose a buyer from the list on the left to start checking top-up requests and sending instructions.</p>
      </div>
    );
  }

  const buyerName = activeConversation.buyer?.name || activeConversation.buyer?.email || "Buyer Partner";
  const initial = buyerName.charAt(0).toUpperCase();

  return (
    <div className="h-full flex flex-col border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl shadow-secondary/2">
      
      {/* Header Panel */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/20 bg-surface/20">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-white transition-colors cursor-pointer mr-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <Avatar size="sm" className="w-9 h-9 text-xs font-bold bg-surface-light border border-border text-white flex-shrink-0">
          <Avatar.Fallback>{initial}</Avatar.Fallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white leading-tight truncate">{buyerName}</h3>
          <p className="text-[10px] text-text-dim font-semibold leading-tight mt-0.5">{activeConversation.buyer?.email || "Buyer User"}</p>
        </div>
      </div>

      {/* Message History bubble list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[420px] min-h-[300px]">
        {loadingMessages ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 h-full">
            <Loader2 className="h-6 w-6 animate-spin text-secondary" />
            <span className="text-xs text-text-muted">Loading messages history...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-text-dim text-xs h-full">
            <MessageBubble message={{ text: "Hello! How can I assist you with your top-up request today?", sender: { name: "System" }, createdAt: new Date().toISOString() }} isSeller={true} />
            <p className="mt-4 italic">Conversation opened. Send a message below to start chatting.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg._id || i}
                message={msg}
                isSeller={msg.senderRole === "seller" || msg.sender?._id === activeConversation.seller?._id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/20 bg-surface/10 flex gap-2">
        <input
          type="text"
          placeholder="Type your message details here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={sending}
          className="flex-1 h-11 px-4 border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus:border-secondary transition-all text-sm placeholder:text-text-dim"
        />
        <Button
          type="submit"
          disabled={!text.trim() || sending}
          className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-5.5 px-5 cursor-pointer text-sm flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 transition-transform shrink-0"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" /> Send
            </>
          )}
        </Button>
      </form>

    </div>
  );
}
