import Link from "next/link";

const packages = [
  {
    name: "Starter Pack",
    price: "$4.99",
    coins: "100 Coins",
    popular: false,
    features: [
      "100 Game Coins",
      "Standard Delivery",
      "Email Support",
      "7-Day Validity",
    ],
  },
  {
    name: "Premium Pack",
    price: "$19.99",
    coins: "500 Coins",
    popular: true,
    features: [
      "500 Game Coins",
      "Instant Delivery",
      "Priority Support",
      "30-Day Validity",
      "Exclusive Bonus",
    ],
  },
  {
    name: "Ultimate Pack",
    price: "$49.99",
    coins: "1500 Coins",
    popular: false,
    features: [
      "1500 Game Coins",
      "Instant Delivery",
      "24/7 VIP Support",
      "90-Day Validity",
      "Exclusive Bonus",
      "Free Gifts",
    ],
  },
];

export default function FeaturedPackages() {
  return (
    <section id="featured-packages" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Featured Top-Up Packages
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Choose the perfect package for your gaming needs. All prices are
            competitive and guaranteed.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                pkg.popular
                  ? "border-primary/50 bg-surface-light shadow-xl shadow-primary/10"
                  : "border-border bg-surface-light/50 hover:border-border/80"
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Header */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text">{pkg.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-text">{pkg.price}</span>
                  <p className="mt-1 text-sm text-text-muted">{pkg.coins}</p>
                </div>
              </div>

              {/* Features */}
              <ul className="mt-8 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-text-muted">
                    <svg className="h-5 w-5 flex-shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="#popular-games"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                  pkg.popular
                    ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark"
                    : "border border-border bg-surface text-text hover:bg-surface-light"
                }`}
              >
                Get {pkg.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}