"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, Gamepad2, Menu, X, Sun, Moon, LogIn, UserPlus } from "lucide-react";
import { Avatar, Button } from "@heroui/react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  // Only show theme-dependent UI after client mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Games", href: "/#popular-games" },
    { label: "Offer", href: "/#featured-packages" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-surface/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary transition-transform group-hover:scale-105">
              <Gamepad2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              Game<span className="text-primary">Coins</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle — uses fallback icon until mounted to prevent hydration mismatch */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-surface-light hover:text-white cursor-pointer"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {mounted ? (
                theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-text-muted hover:text-white hover:bg-surface-light transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <Avatar size="sm" className="w-8 h-8 text-xs font-semibold bg-primary/20 text-primary border border-primary/20 flex items-center justify-center">
                    <Avatar.Fallback>{(user?.name || "U").charAt(0).toUpperCase()}</Avatar.Fallback>
                  </Avatar>
                  <span className="text-xs font-medium text-text-muted max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-danger/30 text-danger/85 transition-colors hover:bg-danger/10 hover:text-danger cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-text-muted hover:text-white hover:bg-surface-light transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark shadow-sm shadow-primary/20"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Theme Toggle — uses fallback icon until mounted to prevent hydration mismatch */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-surface-light hover:text-white cursor-pointer"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {mounted ? (
                theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center rounded-lg p-2 text-text-muted hover:text-white cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border/40 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-light hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="border-t border-border/40 my-1 pt-3 px-3 flex items-center gap-3">
                    <Avatar size="sm" className="w-8 h-8 text-xs font-semibold bg-primary/20 text-primary border border-primary/20 flex items-center justify-center">
                      <Avatar.Fallback>{(user?.name || "U").charAt(0).toUpperCase()}</Avatar.Fallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-text-muted">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-light hover:text-white transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger hover:bg-danger/10 transition-all cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-light hover:text-white transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white transition-all hover:bg-primary-dark shadow-sm shadow-primary/20"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}