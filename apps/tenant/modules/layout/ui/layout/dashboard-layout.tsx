"use client";

import { useState } from "react";

import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex w-full bg-background relative overflow-hidden">
      {/* Decorative Background Elements — fixed so they don't affect scroll */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-primary/5 blur-[110px]" />
      </div>

      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* main is now the scroll container — this makes sticky header work */}
      <main className="flex-1 min-w-0 flex flex-col relative z-10 h-screen overflow-y-auto overflow-x-hidden">
        <div className="flex-1 flex flex-col animate-fade-in animate-duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
