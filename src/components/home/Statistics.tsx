"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { staggerContainer, staggerItem } from "@/lib/animations";

const stats = [
  { value: "100K+", label: "Active Users", description: "Gamers trust GameCoins for their top-up needs" },
  { value: "50+", label: "Games Supported", description: "From battle royale to MOBA and RPGs" },
  { value: "1M+", label: "Transactions Completed", description: "Successfully processed with 100% satisfaction" },
  { value: "99.9%", label: "Uptime Guarantee", description: "Reliable service you can count on 24/7" },
];

export default function Statistics() {
  return (
    <section id="statistics" className="relative overflow-hidden py-20 sm:py-28">
      {/* Background Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-primary/5"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection variant="fadeInUp" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            GameCoins by the Numbers
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Our platform has grown to serve thousands of gamers worldwide with
            unmatched reliability.
          </p>
        </AnimatedSection>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              whileHover={{
                y: -4,
                scale: 1.03,
                transition: { type: "spring", stiffness: 400, damping: 22 },
              }}
              className="rounded-2xl border border-border bg-surface-light/50 p-8 text-center backdrop-blur-sm"
              style={{ willChange: "transform" }}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="text-4xl font-extrabold text-text sm:text-5xl"
              >
                <span className="text-primary">
                  {stat.value}
                </span>
              </motion.div>
              <div className="mt-3 text-lg font-semibold text-text">{stat.label}</div>
              <div className="mt-2 text-sm text-text-muted">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}