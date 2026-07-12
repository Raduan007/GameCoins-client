"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "How do I top up my game account?",
    answer:
      "Simply select your game, choose a package, enter your player ID, and complete the payment. Your game credits will be delivered instantly to your account.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We accept a wide range of payment methods including credit/debit cards, PayPal, Google Pay, Apple Pay, and various local payment options depending on your region.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Most top-ups are delivered within seconds of payment confirmation. In rare cases, it may take up to 5 minutes depending on the game server and payment verification.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption to protect your data and transactions. We never store your payment details and comply with all security standards.",
  },
  {
    question: "Can I get a refund if something goes wrong?",
    answer:
      "Yes, we offer a 100% satisfaction guarantee. If your top-up doesn't arrive within 30 minutes, contact our support team and we'll resolve it immediately or issue a full refund.",
  },
  {
    question: "Do you offer discounts for bulk purchases?",
    answer:
      "Yes! Our Ultimate Pack offers the best value per coin. We also run regular promotions and seasonal discounts. Follow us on social media to stay updated on the latest deals.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Got questions? We have answers. If you need further assistance, feel
            free to contact our support team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mt-12 space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-surface-light/50 transition-all hover:border-border/80"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-sm font-semibold text-text sm:text-base">
                  {item.question}
                </span>
                <svg
                  className={`h-5 w-5 flex-shrink-0 text-text-muted transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="border-t border-border px-6 pb-5 pt-3">
                  <p className="text-sm leading-relaxed text-text-muted">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}