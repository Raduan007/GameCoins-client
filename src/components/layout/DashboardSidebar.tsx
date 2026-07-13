"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Gamepad2,
  User,
  LogOut,
  X,
  Shield,
  Home,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  Heart,
} from "lucide-react";
import { Avatar, Button } from "@heroui/react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      label: "Overview",
      href: "/dashboard/buyer",
      icon: LayoutDashboard,
    },
    {
      label: "My Orders",
      href: "/dashboard/buyer/orders",
      icon: ShoppingBag,
    },
    {
      label: "My Payments",
      href: "/dashboard/buyer/payments",
      icon: CreditCard,
    },
    {
      label: "My Wishlist",
      href: "/dashboard/buyer/wishlist",
      icon: Heart,
    },
    {
      label: "Browse Games",
      href: "/#popular-games",
      icon: Gamepad2,
    },
    {
      label: "Home Page",
      href: "/",
      icon: Home,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/40 bg-surface/80 backdrop-blur-xl transition-all duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header/Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary transition-transform group-hover:scale-105">
              <Gamepad2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              Game<span className="text-primary">Coins</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-white lg:hidden transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User profile section */}
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-sm opacity-60" />
              <Avatar className="w-11 h-11 border border-primary/20 bg-surface-light text-white relative z-10 flex items-center justify-center font-bold">
                <Avatar.Fallback>{(user?.name || "U").charAt(0).toUpperCase()}</Avatar.Fallback>
              </Avatar>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">{user?.name}</span>
              <span className="inline-flex items-center gap-1 mt-0.5 self-start px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/15 uppercase">
                <Shield className="h-2.5 w-2.5" />
                {user?.role || "user"}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 space-y-1.5 p-6 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-dim mb-4 px-3">
            Menu Navigation
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isOpen) onClose();
                }}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-text-muted hover:bg-surface-light hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-text-muted group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {!isActive && (
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-text-dim" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer/Logout */}
        <div className="p-6 border-t border-border/40">
          <Button
            variant="danger"
            onPress={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-5.5 font-bold cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
