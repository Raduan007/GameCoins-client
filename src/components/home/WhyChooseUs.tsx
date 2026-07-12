const reasons = [
  {
    title: "Instant Delivery",
    description:
      "Get your game credits delivered within seconds of payment confirmation. No delays, no waiting.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description:
      "Your transactions are protected with enterprise-grade encryption and multiple payment gateways.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Best Prices",
    description:
      "We offer the most competitive prices on game top-ups with regular deals and exclusive discounts.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "24/7 Customer Support",
    description:
      "Our dedicated support team is available around the clock to help you with any questions or issues.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Why Choose GameCoins
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            We provide the best game top-up experience with features designed
            for gamers, by gamers.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="group rounded-2xl border border-border bg-surface-light/50 p-6 transition-all hover:border-primary/20 hover:bg-surface-light"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary transition-colors group-hover:from-primary/30 group-hover:to-secondary/30">
                {reason.icon}
              </div>

              {/* Content */}
              <h3 className="mt-5 text-lg font-semibold text-text">{reason.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}