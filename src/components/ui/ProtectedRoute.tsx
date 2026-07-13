"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@heroui/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-text gap-4">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <span className="text-primary text-sm font-semibold">Verifying session...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
