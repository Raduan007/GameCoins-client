"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { dashboardService } from "@/services/dashboard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function PopularGames() {
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

  return (
    <section id="popular-games" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection variant="fadeInUp" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Popular Games
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Choose from a wide selection of supported games and top up your account in minutes.
          </p>
        </AnimatedSection>

        {/* Games Grid */}
        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-44 rounded-xl border border-border bg-surface-light/40 relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-4"
          >
            {games.map((game) => {
              const color = game.color || getRandomGradient(game.name);
              const initials = game.icon || game.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

              return (
                <motion.div
                  key={game.slug}
                  variants={staggerItem}
                  whileHover={{
                    y: -6,
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 400, damping: 22 },
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href={`/games/${game.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-surface-light transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 block overflow-hidden h-full"
                  >
                    {/* Game Cover Area (Full Width, No Padding) */}
                    <div className="h-36 w-full overflow-hidden relative bg-surface-lighter">
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
          </motion.div>
        )}
      </div>
    </section>
  );
}