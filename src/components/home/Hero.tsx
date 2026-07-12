import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-secondary/5 to-background" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-light/50 px-4 py-1.5 text-sm text-text-muted">
            <span className="flex h-2 w-2 rounded-full bg-success" />
            Trusted by 100,000+ gamers worldwide
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
            Top Up Your Favorite{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Games Instantly
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-relaxed text-text-muted sm:text-xl">
            Get game credits, diamonds, and premium currency delivered to your
            account in seconds. Fast, secure, and at the best prices — every
            time.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#popular-games"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark sm:w-auto"
            >
              Browse Games
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#featured-packages"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-light/50 px-8 py-3.5 text-base font-semibold text-text transition-all hover:bg-surface-light sm:w-auto"
            >
              View Packages
            </Link>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-text sm:text-3xl">50+</div>
              <div className="mt-1 text-sm text-text-muted">Games Supported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text sm:text-3xl">1M+</div>
              <div className="mt-1 text-sm text-text-muted">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text sm:text-3xl">99.9%</div>
              <div className="mt-1 text-sm text-text-muted">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}