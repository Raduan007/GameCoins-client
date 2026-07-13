"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@heroui/react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user?.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (user?.role === "seller") {
        router.replace("/dashboard/seller");
      } else {
        router.replace("/dashboard/buyer");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <span className="text-primary text-sm font-semibold">Redirecting to your dashboard...</span>
      </div>
    </div>
  );
}
