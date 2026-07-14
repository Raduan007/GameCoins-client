"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  staggerContainer,
  staggerItem,
  fadeIn,
  floatAnimation,
  floatAnimationSlow,
} from "@/lib/animations";
import { dashboardService } from "@/services/dashboard";

const leftColumnVariants: Variants = {
  hidden: { opacity: 0, x: -80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const leftItemVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const rightColumnVariants: Variants = {
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: 0.3,
    },
  },
};

export default function Hero() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const demoGames = [
    { name: "Free Fire", category: "Battle Royale", slug: "free-fire", logo: "", platform: "Mobile", color: "from-orange-500 to-red-500", icon: "FF" },
    { name: "PUBG Mobile", category: "Battle Royale", slug: "pubg-mobile", logo: "", platform: "Mobile", color: "from-yellow-500 to-orange-500", icon: "PM" },
    { name: "Mobile Legends", category: "MOBA", slug: "mobile-legends", logo: "", platform: "Mobile", color: "from-blue-500 to-cyan-500", icon: "ML" },
    { name: "Valorant", category: "Tactical Shooter", slug: "valorant", logo: "", platform: "PC", color: "from-red-500 to-pink-500", icon: "VA" },
    { name: "Genshin Impact", category: "Action RPG", slug: "genshin-impact", logo: "", platform: "PC, Mobile", color: "from-teal-500 to-green-500", icon: "GI" },
    { name: "Call of Duty Mobile", category: "First-Person Shooter", slug: "call-of-duty-mobile", logo: "", platform: "Mobile", color: "from-gray-600 to-gray-900", icon: "CM" },
  ];

  useEffect(() => {
    async function loadGames() {
      try {
        const data: any = await dashboardService.getGames();
        let list: any[] = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.games)) list = data.games;
        setGames(list.length > 0 ? list : demoGames);
      } catch {
        setGames(demoGames);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  const getRandomGradient = (name: string) => {
    const gradients = [
      "from-orange-500 to-red-500",
      "from-yellow-500 to-orange-500",
      "from-blue-500 to-cyan-500",
      "from-red-500 to-pink-500",
      "from-teal-500 to-green-500",
      "from-gray-600 to-gray-900",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return gradients[sum % gradients.length];
  };

  // Duplicate the list to ensure gapless infinite marquee scrolling
  const marqueeGames = [...games, ...games, ...games, ...games];

  return (
    <section id="hero" className="relative overflow-hidden pt-24 min-h-[90vh] flex items-center bg-background">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-slow {
          animation: marquee 35s linear infinite;
        }
      `}</style>

      {/* Floating decorative orbs */}
      <motion.div
        animate={floatAnimation}
        className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={floatAnimationSlow}
        className="absolute top-40 right-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text (6 cols on lg) */}
          <div className="lg:col-span-6 text-left">
            <motion.div
              className="space-y-6"
              variants={leftColumnVariants}
              initial="hidden"
              animate="show"
            >
              {/* Badge */}
              <motion.div
                variants={leftItemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-light/50 px-4 py-1.5 text-sm text-text-muted"
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
                variants={leftItemVariants}
                className="text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl"
              >
                Top Up Your Favorite{" "}
                <span className="text-primary">Games Instantly</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={leftItemVariants}
                className="text-lg leading-relaxed text-text-muted sm:text-xl"
              >
                Get game credits, diamonds, and premium currency delivered to your
                account in seconds. Fast, secure, and at the best prices — every
                time.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={leftItemVariants}
                className="flex flex-col sm:flex-row gap-4 items-center justify-start"
              >
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    href="#popular-games"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
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
                  className="w-full sm:w-auto"
                >
                  <Link
                    href="#featured-packages"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-light/50 px-8 py-3.5 text-base font-semibold text-text transition-all hover:bg-surface-light"
                  >
                    View Packages
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                variants={leftItemVariants}
                className="grid grid-cols-3 gap-6 border-t border-border pt-8"
              >
                {[
                  { value: "50+", label: "Games Supported" },
                  { value: "1M+", label: "Transactions" },
                  { value: "99.9%", label: "Uptime" },
                ].map((stat) => (
                  <motion.div key={stat.label} variants={staggerItem} className="text-left">
                    <div className="text-2xl font-bold text-text sm:text-3xl">{stat.value}</div>
                    <div className="mt-1 text-sm text-text-muted">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Game Cards Marquee (6 cols on lg) */}
          <motion.div 
            className="lg:col-span-6 relative w-full overflow-hidden py-6 select-none"
            variants={rightColumnVariants}
            initial="hidden"
            animate="show"
          >
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            {loading ? (
              <div className="flex gap-6 w-full overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-64 h-80 rounded-2xl border border-border bg-surface-light/40 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex w-max gap-6 animate-marquee-slow">
                {marqueeGames.map((game, index) => {
                  const color = game.color || getRandomGradient(game.name);
                  const initials = game.icon || game.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

                  return (
                    <motion.div
                      key={`${game.slug}-${index}`}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 450, damping: 20 },
                      }}
                      className="w-64 h-80 shrink-0 cursor-pointer"
                    >
                      <Link
                        href={`/games/${game.slug}`}
                        className="group flex flex-col h-full rounded-2xl border border-border bg-surface-light hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 overflow-hidden transition-all duration-300"
                      >
                        {/* Game Cover Area */}
                        <div className="h-44 w-full overflow-hidden relative bg-surface-lighter">
                          {game.banner || game.logo ? (
                            <img 
                              src={game.banner || game.logo} 
                              alt={game.name} 
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                            />
                          ) : (
                            <div className={`h-full w-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xl`}>
                              {initials}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                        </div>

                        {/* Content Details Area */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-text truncate w-full group-hover:text-primary transition-colors">{game.name}</h3>
                            <p className="mt-1 text-xs text-text-muted truncate w-full">{game.category || game.platform || "Action"}</p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-[10px] bg-primary/15 text-primary font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                              {game.platform || "Mobile"}
                            </span>
                            <span className="text-xs font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              Top Up &rarr;
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}