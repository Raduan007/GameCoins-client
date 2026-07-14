import Link from "next/link";

const footerLinks = {
  games: {
    title: "Games",
    links: [
      { label: "Free Fire", href: "#" },
      { label: "PUBG Mobile", href: "#" },
      { label: "Mobile Legends", href: "#" },
      { label: "Valorant", href: "#" },
      { label: "Genshin Impact", href: "#" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Refund Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Partners", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center">
                <img src="/assets/gamecoins.png" alt="GameCoins" className="h-8 w-8 object-contain" />
              </div>
              <span className="text-xl font-bold text-text">
                Game<span className="text-primary">Coins</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted">
              GameCoins is the leading game top-up platform, providing instant
              delivery of game credits at the best prices. Trusted by over
              100,000 gamers worldwide.
            </p>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-dim">
                Accepted Payments
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Visa", "Mastercard", "PayPal", "Google Pay", "Apple Pay"].map((method) => (
                  <span
                    key={method}
                    className="rounded-lg border border-border bg-surface-light px-3 py-1.5 text-xs font-medium text-text-muted"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-8 sm:flex-row">
          <p className="text-sm text-text-dim">
            &copy; {new Date().getFullYear()} GameCoins. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social Links */}
            {["Twitter", "Discord", "Instagram", "Facebook"].map((social) => (
              <Link
                key={social}
                href="#"
                className="text-sm text-text-muted transition-colors hover:text-text"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}