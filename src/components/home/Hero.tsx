"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerItem,
  fadeIn,
  floatAnimation,
  floatAnimationSlow,
} from "@/lib/animations";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-24">
      {/* Floating decorative orbs */}
      <motion.div
        animate={floatAnimation}
        className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={floatAnimationSlow}
        className="absolute top-40 right-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={floatAnimation}
        className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div
            variants={fadeIn}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-light/50 px-4 py-1.5 text-sm text-text-muted"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-2 w-2 rounded-full bg-success"
            />
            Trusted by 100,000+ gamers worldwide
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={staggerItem}
            className="text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl"
          >
            Top Up Your Favorite{" "}
            <span className="text-primary">Games Instantly</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={staggerItem}
            className="mt-6 text-lg leading-relaxed text-text-muted sm:text-xl"
          >
            Get game credits, diamonds, and premium currency delivered to your
            account in seconds. Fast, secure, and at the best prices — every
            time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={staggerItem}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Link
                href="#popular-games"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark sm:w-auto"
              >
                Browse Games
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Link
                href="#featured-packages"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-light/50 px-8 py-3.5 text-base font-semibold text-text transition-all hover:bg-surface-light sm:w-auto"
              >
                View Packages
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={staggerContainer}
            className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8"
          >
            {[
              { value: "50+", label: "Games Supported" },
              { value: "1M+", label: "Transactions" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={staggerItem} className="text-center">
                <div className="text-2xl font-bold text-text sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}