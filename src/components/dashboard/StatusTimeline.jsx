"use client";

import React from "react";
import { CheckCircle2, Clock, XCircle, ShieldAlert } from "lucide-react";

export default function StatusTimeline({ orderStatus, paymentStatus }) {
  // Determine active steps based on order and payment status
  const steps = [
    {
      id: "placed",
      title: "Order Placed",
      description: "Your order has been recorded.",
      status: "success", // Order creation is always successful
    },
    {
      id: "payment",
      title: "Payment Processing",
      description:
        paymentStatus === "paid"
          ? "Payment received successfully."
          : paymentStatus === "failed"
          ? "Payment failed."
          : "Awaiting payment verification.",
      status:
        paymentStatus === "paid"
          ? "success"
          : paymentStatus === "failed"
          ? "failed"
          : "active",
    },
    {
      id: "fulfillment",
      title: orderStatus === "cancelled" ? "Order Cancelled" : "Fulfillment Completed",
      description:
        orderStatus === "completed"
          ? "In-game coins delivered successfully!"
          : orderStatus === "cancelled"
          ? "Order has been cancelled."
          : orderStatus === "processing"
          ? "Coins are being sent to your ID."
          : "Awaiting payment verification to deliver coins.",
      status:
        orderStatus === "completed"
          ? "success"
          : orderStatus === "cancelled"
          ? "failed"
          : paymentStatus === "paid"
          ? "active"
          : "pending",
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-4 px-2">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        // Visual helper mapping
        let Icon = Clock;
        let colorClasses = "text-text-muted border-border bg-surface-light";
        let textClasses = "text-text-muted";
        let lineClasses = "bg-border";

        if (step.status === "success") {
          Icon = CheckCircle2;
          colorClasses = "text-success border-success/40 bg-success/15";
          textClasses = "text-white";
          lineClasses = "bg-success/40";
        } else if (step.status === "failed") {
          Icon = XCircle;
          colorClasses = "text-error border-error/40 bg-error/15";
          textClasses = "text-error";
          lineClasses = "bg-error/40";
        } else if (step.status === "active") {
          Icon = Clock;
          colorClasses = "text-primary border-primary bg-primary/10 animate-pulse";
          textClasses = "text-primary font-bold";
        }

        return (
          <div key={step.id} className="relative flex gap-4">
            {/* Visual Line connector */}
            {!isLast && (
              <div
                className={`absolute left-[18px] top-10 w-0.5 h-12 z-0 ${lineClasses}`}
              />
            )}

            {/* Icon circle */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border z-10 transition-colors duration-300 ${colorClasses}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h5 className={`text-sm font-bold tracking-wide ${textClasses}`}>{step.title}</h5>
              <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
