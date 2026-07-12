import Link from "next/link";

const games = [
  {
    name: "Free Fire",
    category: "Battle Royale",
    color: "from-orange-500 to-red-500",
    icon: "FF",
  },
  {
    name: "PUBG Mobile",
    category: "Battle Royale",
    color: "from-yellow-500 to-orange-500",
    icon: "PM",
  },
  {
    name: "Mobile Legends",
    category: "MOBA",
    color: "from-blue-500 to-cyan-500",
    icon: "ML",
  },
  {
    name: "Valorant",
    category: "Tactical Shooter",
    color: "from-red-500 to-pink-500",
    icon: "VA",
  },
  {
    name: "Genshin Impact",
    category: "Action RPG",
    color: "from-teal-500 to-green-500",
    icon: "GI",
  },
  {
    name: "Call of Duty Mobile",
    category: "First-Person Shooter",
    color: "from-gray-600 to-gray-900",
    icon: "CM",
  },
];

export default function PopularGames() {
  return (
    <section id="popular-games" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Popular Games
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Choose from a wide selection of supported games and top up your
            account in minutes.
          </p>
        </div>

        {/* Games Grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {games.map((game) => (
            <Link
              key={game.name}
              href="#"
              className="group flex flex-col items-center rounded-xl border border-border bg-surface-light p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Game Icon */}
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${game.color} shadow-lg transition-transform group-hover:scale-110`}
              >
                <span className="text-lg font-bold text-white">{game.icon}</span>
              </div>

              {/* Game Name */}
              <h3 className="mt-4 text-sm font-semibold text-text">{game.name}</h3>

              {/* Category */}
              <p className="mt-1 text-xs text-text-muted">{game.category}</p>

              {/* Top Up Link */}
              <span className="mt-3 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Top Up Now
              </span>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-light"
          >
            View All Games
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}