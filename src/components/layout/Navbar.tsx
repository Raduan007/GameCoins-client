"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut, LayoutDashboard, Menu, X, Sun, Moon, LogIn, UserPlus,
} from "lucide-react";
import { Avatar } from "@heroui/react";
import { slideInDown, staggerContainerFast, staggerItemFade } from "@/lib/animations";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect scroll to add enhanced blur/shadow on the navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Games", href: "/#popular-games" },
    { label: "Offer", href: "/#featured-packages" },
  ];

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled
          ? "border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg shadow-black/20"
          : "border-border/40 bg-surface/80 backdrop-blur-lg"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.1, rotate: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex h-8 w-8 items-center justify-center"
            >
              <img src="/assets/gamecoins.png" alt="GameCoins" className="h-8 w-8 object-contain" />
            </motion.div>
            <span className="text-xl font-bold text-white tracking-wide">
              Game<span className="text-primary">Coins</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.35, ease: "easeOut" }}
                className="relative group"
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-text-muted transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
                {/* Animated underline */}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <motion.div
            variants={staggerContainerFast}
            initial={shouldReduceMotion ? false : "hidden"}
            animate="show"
            className="hidden items-center gap-3 md:flex"
          >
            {/* Theme Toggle */}
            <motion.button
              variants={staggerItemFade}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-surface-light hover:text-white cursor-pointer"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {mounted ? (
                theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </motion.button>

            {isAuthenticated ? (
              <motion.div variants={staggerItemFade} className="flex items-center gap-4">
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-text-muted hover:text-white hover:bg-surface-light transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </motion.div>
                <div className="flex items-center gap-2">
                  <Avatar size="sm" className="w-8 h-8 text-xs font-semibold bg-primary/20 text-primary border border-primary/20 flex items-center justify-center">
                    <Avatar.Fallback>{(user?.name || "U").charAt(0).toUpperCase()}</Avatar.Fallback>
                  </Avatar>
                  <span className="text-xs font-medium text-text-muted max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </div>
                <motion.button
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                  onClick={logout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-danger/30 text-danger/85 transition-colors hover:bg-danger/10 hover:text-danger cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div variants={staggerItemFade} className="flex items-center gap-3">
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-text-muted hover:text-white hover:bg-surface-light transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark shadow-sm shadow-primary/20"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-surface-light hover:text-white cursor-pointer"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {mounted ? (
                theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </motion.button>

            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center rounded-lg p-2 text-text-muted hover:text-white cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu — animated slide down */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={shouldReduceMotion ? undefined : slideInDown}
              initial="hidden"
              animate="show"
              exit="exit"
              className="border-t border-border/40 py-4 md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-light hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
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
                      onClick={() => { setIsMobileMenuOpen(false); logout(); }}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}