"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { Menu, Sun, Moon, LogOut, LayoutDashboard, User } from "lucide-react";
import { Avatar, Button } from "@heroui/react";

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Only show theme-dependent UI after client mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/40 bg-surface/80 px-6 backdrop-blur-lg lg:px-8">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted hover:text-white lg:hidden transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Dashboard
          </h2>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle — uses fallback icon until mounted to prevent hydration mismatch */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-surface-light hover:text-white cursor-pointer"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {mounted ? (
            theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />
          ) : (
            <Sun className="h-4.5 w-4.5" />
          )}
        </button>

        {/* User Info & Quick Action */}
        <div className="flex items-center gap-3 pl-3 border-l border-border/50">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white truncate max-w-[120px]">
              {user?.name}
            </span>
            <span className="text-[10px] text-text-muted font-semibold truncate max-w-[120px]">
              {user?.email}
            </span>
          </div>

          <Avatar
            size="sm"
            className="w-8 h-8 font-semibold bg-primary/20 text-primary border border-primary/20 flex items-center justify-center"
          >
            <Avatar.Fallback>{(user?.name || "U").charAt(0).toUpperCase()}</Avatar.Fallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
