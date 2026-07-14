/**
 * GameCoins — Central Animation Variants Library
 *
 * All animation variants are defined here and shared across the app.
 */

import type { Variants, Transition } from "framer-motion";

// ---------------------------------------------------------------------------
// Shared spring / easing configs
// ---------------------------------------------------------------------------

export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 28,
};

export const smooth: Transition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.45,
};

export const fast: Transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.25,
};

// ---------------------------------------------------------------------------
// Fade + slide upward  (section reveals, hero text)
// ---------------------------------------------------------------------------

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: smooth,
  },
};

// ---------------------------------------------------------------------------
// Simple fade
// ---------------------------------------------------------------------------

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ---------------------------------------------------------------------------
// Scale + fade  (modals, cards)
// ---------------------------------------------------------------------------

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: fast,
  },
};

// ---------------------------------------------------------------------------
// Slide in from top  (dropdowns, mobile nav)
// ---------------------------------------------------------------------------

export const slideInDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: fast,
  },
};

// ---------------------------------------------------------------------------
// Stagger container
// ---------------------------------------------------------------------------

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

// ---------------------------------------------------------------------------
// Stagger item
// ---------------------------------------------------------------------------

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.45 },
  },
};

export const staggerItemFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// ---------------------------------------------------------------------------
// Modal backdrop
// ---------------------------------------------------------------------------

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

// ---------------------------------------------------------------------------
// Modal panel
// ---------------------------------------------------------------------------

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.35 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 12,
    transition: fast,
  },
};

// ---------------------------------------------------------------------------
// Page-level transition
// ---------------------------------------------------------------------------

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// ---------------------------------------------------------------------------
// Floating / breathing animation — use as animate={} prop directly
// Using typed ease values to satisfy Framer Motion 12.x strict types
// ---------------------------------------------------------------------------

export const floatAnimation = {
  y: [0, -14, 0],
  transition: {
    duration: 5,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
  },
};

export const floatAnimationSlow = {
  y: [0, -8, 0],
  transition: {
    duration: 7,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
  },
};

// ---------------------------------------------------------------------------
// Pulse / glow
// ---------------------------------------------------------------------------

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 2.5,
    ease: "easeInOut" as const,
    repeat: Infinity,
  },
};

// ---------------------------------------------------------------------------
// Card hover gesture — inline spring props for whileHover / whileTap
// We do NOT include a nested `transition` inside whileHover to avoid
// Framer Motion's strict type conflict; instead pass transition at element level.
// ---------------------------------------------------------------------------

export const cardHoverProps = {
  whileHover: { y: -5, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 400, damping: 22 },
};

export const buttonHoverProps = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 400, damping: 22 },
};

export const iconHoverProps = {
  whileHover: { rotate: 8, scale: 1.15 },
  transition: { type: "spring" as const, stiffness: 400, damping: 20 },
};
