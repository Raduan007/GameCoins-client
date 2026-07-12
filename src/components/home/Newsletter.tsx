"use client";

export default function Newsletter() {
  return (
    <section id="newsletter" className="relative overflow-hidden py-20 sm:py-28">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface-light/50 p-8 text-center backdrop-blur-xl sm:p-12">
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
            <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Subscribe to our newsletter and be the first to know about new games,
            exclusive deals, and special promotions.
          </p>

          {/* Form */}
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-xs text-text-dim">
            No spam ever. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}