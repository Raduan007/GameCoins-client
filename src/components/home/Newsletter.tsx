"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { floatAnimationSlow } from "@/lib/animations";

export default function Newsletter() {
  return (
    <section id="newsletter" className="relative overflow-hidden py-20 sm:py-28">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection variant="scaleIn">
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface-light/50 p-8 text-center backdrop-blur-xl sm:p-12">
            {/* Icon — floating */}
            <motion.div
              animate={floatAnimationSlow}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20"
            >
              <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mt-6 text-3xl font-bold tracking-tight text-text sm:text-4xl"
            >
              Stay Updated
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mt-4 text-lg text-text-muted"
            >
              Subscribe to our newsletter and be the first to know about new games,
              exclusive deals, and special promotions.
            </motion.p>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-all duration-200 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                required
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                type="submit"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
              >
                Subscribe
              </motion.button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-4 text-xs text-text-dim"
            >
              No spam ever. Unsubscribe anytime. We respect your privacy.
            </motion.p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}