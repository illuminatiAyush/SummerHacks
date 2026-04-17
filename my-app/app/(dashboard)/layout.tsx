"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/lib/context/ThemeContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-[#F6F8F7] dark:bg-[#000000] text-foreground transition-colors duration-300 overflow-hidden font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
