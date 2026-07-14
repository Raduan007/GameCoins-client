"use client";

/**
 * AnimatedSection
 *
 * A reusable wrapper that animates its children into view when the element
 * enters the viewport. Uses Framer Motion's `useInView` hook with `once: true`
 * so the animation fires only once per page load.
 *
 * It also checks `prefers-reduced-motion` and skips all animations when the
 * user has requested reduced motion.
 */

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { fadeInUp, fadeIn, scaleIn } from "@/lib/animations";
import type { Variants } from "framer-motion";

type VariantName = "fadeInUp" | "fadeIn" | "scaleIn";

const variantMap: Record<VariantName, Variants> = {
  fadeInUp,
  fadeIn,
  scaleIn,
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: VariantName;
  delay?: number;
  className?: string;
  /** Override the viewport threshold (0–1). Default 0.15 */
  threshold?: number;
  as?: React.ElementType;
}

export default function AnimatedSection({
  children,
  variant = "fadeInUp",
  delay = 0,
  className,
  threshold = 0.15,
  as: Tag = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, render children without animation
  if (shouldReduceMotion) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  const selectedVariant = variantMap[variant];

  // Inject a custom delay into the transition
  const variantWithDelay: Variants = {
    hidden: selectedVariant.hidden,
    show: {
      ...(selectedVariant.show as object),
      transition: {
        ...((selectedVariant.show as any)?.transition ?? {}),
        delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variantWithDelay}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}
