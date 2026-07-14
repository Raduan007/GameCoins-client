"use client";

/**
 * PageTransition
 *
 * Wraps page content with a fade + slight slide transition on route change.
 * Uses Framer Motion's AnimatePresence to handle enter/exit animations.
 * Respects `prefers-reduced-motion`.
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { pageVariants } from "@/lib/animations";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
}
