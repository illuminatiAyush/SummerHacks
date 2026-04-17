"use client";

import { Activity } from "lucide-react";
import Link from "next/link";
import LoginCard from "@/components/auth/LoginCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans selection:bg-[#22C55E]/20">
      
      {/* ── LEFT SIDE (BRANDING) ── */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-center py-12 px-6 lg:px-16 bg-gradient-to-br from-white to-green-50 dark:from-[#000000] dark:to-[#05150a] relative overflow-hidden">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#22C55E]/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#22C55E]/5 blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-lg text-center lg:text-left flex flex-col items-center lg:items-start">
          <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#22C55E] shadow-lg shadow-[#22C55E]/20">
              <Activity className="w-6 h-6 text-[#000000]" />
            </div>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white mb-4 leading-tight">
            ExpenseAutopsy
          </h1>
          
          <p className="text-lg md:text-xl font-medium text-gray-600 dark:text-[#A1A1AA] mb-12 max-w-md">
            Behavioral Finance OS for Gen Z. Stop the bleed, secure the bag.
          </p>

          <div className="mt-auto hidden lg:block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-[#A1A1AA]/50 pt-16">
            v1.0 • Built for Summer Hacks
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE (LOGIN PANEL) ── */}
      <div className="lg:w-1/2 w-full flex justify-center items-center py-12 px-6 bg-gray-50 dark:bg-[#000000]">
        <LoginCard />
        
        {/* Mobile footer */}
        <div className="lg:hidden absolute bottom-6 text-center w-full left-0 px-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#A1A1AA]/50">
            v1.0 • Built for Summer Hacks
          </div>
        </div>
      </div>
    </div>
  );
}
