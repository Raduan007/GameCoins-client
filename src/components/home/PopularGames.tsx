"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, Layers, Server } from "lucide-react";
import { dashboardService } from "@/services/dashboard";

export default function PopularGames() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback demo games if API is empty or down
  const demoGames = [
    {
      name: "Free Fire",
      category: "Battle Royale",
      slug: "free-fire",
      logo: "",
      platform: "Mobile",
      color: "from-orange-500 to-red-500",
      icon: "FF",
    },
    {
      name: "PUBG Mobile",
      category: "Battle Royale",
      slug: "pubg-mobile",
      logo: "",
      platform: "Mobile",
      color: "from-yellow-500 to-orange-500",
      icon: "PM",
    },
    {
      name: "Mobile Legends",
      category: "MOBA",
      slug: "mobile-legends",
      logo: "",
      platform: "Mobile",
      color: "from-blue-500 to-cyan-500",
      icon: "ML",
    },
    {
      name: "Valorant",
      category: "Tactical Shooter",
      slug: "valorant",
      logo: "",
      platform: "PC",
      color: "from-red-500 to-pink-500",
      icon: "VA",
    },
    {
      name: "Genshin Impact",
      category: "Action RPG",
      slug: "genshin-impact",
      logo: "",
      platform: "PC, Mobile",
      color: "from-teal-500 to-green-500",
      icon: "GI",
    },
    {
      name: "Call of Duty Mobile",
      category: "First-Person Shooter",
      slug: "call-of-duty-mobile",
      logo: "",
      platform: "Mobile",
      color: "from-gray-600 to-gray-900",
      icon: "CM",
    },
  ];

  useEffect(() => {
    async function loadGames() {
      try {
        const data: any = await dashboardService.getGames();
        // The API returns either an array directly or inside an envelope.
        // Let's handle both based on server response structure.
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.games)) {
          list = data.games;
        }

        if (list.length > 0) {
          setGames(list);
        } else {
          setGames(demoGames);
        }
      } catch (err) {
        console.warn("PopularGames: API connection error, using fallback catalog list:", err);
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
      "from-gray-600 to-gray-900"
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return gradients[sum % gradients.length];
  };

  return (
    <section id="popular-games" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Popular Games
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Choose from a wide selection of supported games and top up your account in minutes.
          </p>
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 rounded-xl border border-border bg-surface-light/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {games.map((game) => {
              const color = game.color || getRandomGradient(game.name);
              const initials = game.icon || game.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

              return (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-border bg-surface-light p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  {/* Game Icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden relative shadow-lg transition-transform group-hover:scale-105">
                    {game.logo ? (
                      <img src={game.logo} alt={game.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg`}>
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Game Name */}
                  <h3 className="mt-4 text-sm font-semibold text-text text-center truncate w-full">{game.name}</h3>

                  {/* Category */}
                  <p className="mt-1 text-xs text-text-muted text-center truncate w-full">{game.category || game.platform || "Action"}</p>

                  {/* Top Up Link */}
                  <span className="mt-3 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
                    Top Up Now
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}