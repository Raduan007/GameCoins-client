const testimonials = [
  {
    name: "Alex Chen",
    role: "Free Fire Player",
    avatar: "AC",
    rating: 5,
    content:
      "GameCoins is my go-to for Free Fire diamonds. The delivery is instant and the prices are unbeatable. Highly recommended for all gamers!",
  },
  {
    name: "Sarah Johnson",
    role: "Mobile Legends Player",
    avatar: "SJ",
    rating: 5,
    content:
      "I've been using GameCoins for months now. The premium pack gives me the best value for my money, and customer support is always helpful.",
  },
  {
    name: "Mike Rodriguez",
    role: "PUBG Mobile Player",
    avatar: "MR",
    rating: 5,
    content:
      "What I love about GameCoins is the reliability. Every transaction goes through smoothly, and I get my UC within seconds. Absolutely fantastic service.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Join thousands of satisfied gamers who trust GameCoins for their
            top-up needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-border bg-surface-light/50 p-6 transition-all hover:border-primary/20"
            >
              {/* Rating */}
              <StarRating rating={testimonial.rating} />

              {/* Content */}
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">{testimonial.name}</div>
                  <div className="text-xs text-text-muted">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}