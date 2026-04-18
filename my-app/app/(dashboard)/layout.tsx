"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { ThemeProvider } from "@/lib/context/ThemeContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 pt-6 relative custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
