const stats = [
  {
    value: "100K+",
    label: "Active Users",
    description: "Gamers trust GameCoins for their top-up needs",
  },
  {
    value: "50+",
    label: "Games Supported",
    description: "From battle royale to MOBA and RPGs",
  },
  {
    value: "1M+",
    label: "Transactions Completed",
    description: "Successfully processed with 100% satisfaction",
  },
  {
    value: "99.9%",
    label: "Uptime Guarantee",
    description: "Reliable service you can count on 24/7",
  },
];

export default function Statistics() {
  return (
    <section id="statistics" className="relative overflow-hidden py-20 sm:py-28">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            GameCoins by the Numbers
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Our platform has grown to serve thousands of gamers worldwide with
            unmatched reliability.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface-light/50 p-8 text-center backdrop-blur-sm"
            >
              <div className="text-4xl font-extrabold text-text sm:text-5xl">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </div>
              <div className="mt-3 text-lg font-semibold text-text">{stat.label}</div>
              <div className="mt-2 text-sm text-text-muted">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}