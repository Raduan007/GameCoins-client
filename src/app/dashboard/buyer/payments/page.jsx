"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard";
import PaymentCard from "@/components/dashboard/PaymentCard";
import { Card, CardContent, Spinner } from "@heroui/react";
import { CreditCard, ArrowLeft, AlertCircle } from "lucide-react";

export default function BuyerPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const data = await dashboardService.getBuyerPayments();
        setPayments(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching buyer payments:", err);
        // Don't treat "No payments found" or empty responses as fatal layout errors
        if (err.message?.includes("No payments found") || err.message?.includes("not found")) {
          setPayments([]);
          setError(null);
        } else {
          setError(err.message || "Failed to load payments history");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/buyer"
              className="text-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Payments History</h1>
          </div>
          <p className="text-text-muted">
            Track and verify all transaction bills, credits methods, and status histories.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="border border-border/40 bg-surface/40 backdrop-blur-xl rounded-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <div className="flex items-center gap-3 w-1/3">
                    <div className="w-12 h-12 rounded-xl bg-surface-light animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-surface-light rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-surface-light rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                  <div className="w-24 h-6 bg-surface-light rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                  <div className="h-20 bg-surface-light rounded w-full" />
                  <div className="h-20 bg-surface-light rounded w-full md:col-span-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : payments.length === 0 ? (
        /* Empty State */
        <Card className="border border-border/40 bg-surface/40 backdrop-blur-xl shadow-xl rounded-2xl">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-surface-light border border-border rounded-full flex items-center justify-center text-text-dim mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Payment History Found</h3>
            <p className="text-text-muted max-w-sm mb-6">
              You haven't initiated any payment transactions yet. When you top-up packages, billing logs will record here.
            </p>
            <Link
              href="/#popular-games"
              className="inline-flex h-11 items-center justify-center px-6 py-2.5 text-sm font-bold bg-primary text-white hover:bg-primary-dark rounded-xl transition-all shadow-md shadow-primary/20"
            >
              Browse Games & Top-Up
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Payments History List */
        <div className="space-y-6">
          {payments.map((payment) => (
            <PaymentCard key={payment._id} payment={payment} />
          ))}
        </div>
      )}
    </div>
  );
}
