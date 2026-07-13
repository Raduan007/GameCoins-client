"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@heroui/react";
import { dashboardService } from "@/services/dashboard";
import ConversationList from "@/components/dashboard/ConversationList";
import ChatWindow from "@/components/dashboard/ChatWindow";
import toast from "react-hot-toast";

export default function SellerMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [sending, setSending] = useState(false);
  
  // Mobile responsive views state
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // Demo fallback state
  const [showDemo, setShowDemo] = useState(false);

  const demoConversations = [
    {
      _id: "conv01",
      unreadCount: 2,
      lastMessage: {
        text: "Hi, I just placed an order. When will the Free Fire coins top-up be completed?",
        createdAt: new Date().toISOString()
      },
      buyer: {
        _id: "buyer01",
        name: "Alex Mercer",
        email: "alex.m@example.com"
      },
      seller: { _id: "seller01" }
    },
    {
      _id: "conv02",
      unreadCount: 0,
      lastMessage: {
        text: "Thank you for the quick transfer! Awesome service.",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      buyer: {
        _id: "buyer02",
        name: "Sarah Connor",
        email: "sarahc@example.com"
      },
      seller: { _id: "seller01" }
    }
  ];

  const demoMessages = {
    "conv01": [
      {
        _id: "m1",
        senderRole: "buyer",
        message: "Hi, I just placed an order. When will the Free Fire coins top-up be completed?",
        createdAt: new Date(Date.now() - 600000).toISOString()
      }
    ],
    "conv02": [
      {
        _id: "m2",
        senderRole: "buyer",
        message: "Hello, I made a purchase for 500 MLBB Diamonds. Here is my player ID: 12839912.",
        createdAt: new Date(Date.now() - 3600000 * 25).toISOString()
      },
      {
        _id: "m3",
        senderRole: "seller",
        message: "Hi Sarah! I have received your transaction and processed the top-up. Please check your in-game mailbox.",
        createdAt: new Date(Date.now() - 3600000 * 24.5).toISOString()
      },
      {
        _id: "m4",
        senderRole: "buyer",
        message: "Thank you for the quick transfer! Awesome service.",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ]
  };

  const loadConversations = async () => {
    try {
      setConversationsLoading(true);
      setError(null);
      const res = await dashboardService.getSellerMessages();
      setConversations(res || []);
    } catch (err) {
      console.warn("Backend messages catalog failed, utilizing fallback local catalog for UI testing:", err);
      setError("Messages API failed to connect. Offline demo mode activated.");
      setConversations(demoConversations);
    } finally {
      setConversationsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleSelectConversation = async (conv) => {
    setActiveConversation(conv);
    setMobileChatOpen(true);
    
    // Reset local unread count visual
    setConversations(prev =>
      prev.map(c => c._id === conv._id ? { ...c, unreadCount: 0 } : c)
    );

    try {
      setMessagesLoading(true);
      if (showDemo || error) {
        setMessages(demoMessages[conv._id] || []);
        return;
      }
      const res = await dashboardService.getConversation(conv._id);
      setMessages(res || []);
    } catch (err) {
      console.warn("Could not load message history, loading mock data:", err);
      setMessages(demoMessages[conv._id] || []);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!activeConversation) return;

    const newMessageObj = {
      _id: `msg-${Date.now()}`,
      senderRole: "seller",
      message: text,
      createdAt: new Date().toISOString()
    };

    try {
      setSending(true);

      if (showDemo || error) {
        // Mock offline response save
        setMessages(prev => [...prev, newMessageObj]);
        
        // Update last message in list
        setConversations(prev =>
          prev.map(c =>
            c._id === activeConversation._id
              ? { ...c, lastMessage: { text, createdAt: new Date().toISOString() } }
              : c
          )
        );

        // Simulate automatic buyer response after 1 second to wow user
        setTimeout(() => {
          const replyObj = {
            _id: `msg-reply-${Date.now()}`,
            senderRole: "buyer",
            message: "Thanks! Got it, checking now.",
            createdAt: new Date().toISOString()
          };
          setMessages(prev => [...prev, replyObj]);
          setConversations(prev =>
            prev.map(c =>
              c._id === activeConversation._id
                ? { ...c, lastMessage: { text: replyObj.message, createdAt: new Date().toISOString() } }
                : c
            )
          );
          toast.success("New message received from buyer.");
        }, 1200);

        return;
      }

      await dashboardService.sendMessage({
        conversationId: activeConversation._id,
        message: text
      });

      // Reload messages list
      const res = await dashboardService.getConversation(activeConversation._id);
      setMessages(res || []);

      // Reload conversation previews list
      const convs = await dashboardService.getSellerMessages();
      setConversations(convs || []);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(err.message || "Failed to deliver message");
    } finally {
      setSending(false);
    }
  };

  const activeError = showDemo ? null : error;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Store Messages
          </h1>
          <p className="text-text-muted">
            Resolve buyer inquiries, provide transfer slips, or confirm player IDs directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {error && !showDemo && (
            <Button
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-4 py-2 rounded-xl transition-all"
              onPress={() => setShowDemo(true)}
            >
              Load Demo Chats
            </Button>
          )}
          {showDemo && (
            <Button
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold px-4 py-2 rounded-xl transition-all"
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
            Make sure your backend is running and you are logged in. If you are developing or testing, click "Load Demo Chats" above.
          </p>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
        {/* Left column: Conversation previews list */}
        <div className={`${mobileChatOpen ? "hidden md:block" : "block"} md:col-span-1 border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl p-4 overflow-y-auto h-full shadow-xl shadow-secondary/2`}>
          <p className="text-xs font-bold uppercase tracking-wider text-text-dim mb-4 pl-1">Inbox Conversations</p>
          <ConversationList
            conversations={conversations}
            activeId={activeConversation?._id}
            onSelect={handleSelectConversation}
            loading={conversationsLoading && !showDemo && !error}
          />
        </div>

        {/* Right column: Active chat window */}
        <div className={`${mobileChatOpen ? "block" : "hidden md:block"} md:col-span-2 h-full`}>
          <ChatWindow
            activeConversation={activeConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={() => setMobileChatOpen(false)}
            sending={sending}
            loadingMessages={messagesLoading}
          />
        </div>
      </div>
    </div>
  );
}
