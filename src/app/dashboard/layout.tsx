"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardNavbar from "@/components/layout/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-text">
        {/* Sidebar */}
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Navbar */}
          <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Child Page Content */}
          <main className="flex-1 overflow-y-auto bg-[#0a0a0f] relative p-6 sm:p-8 lg:p-10">
            {/* Glowing background shapes for premium aesthetics */}
            <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="mx-auto max-w-7xl relative z-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
