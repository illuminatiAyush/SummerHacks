"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Wallet, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    const routeMap: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/analysis": "Autopsy",
      "/insights": "Insights",
      "/money-mirror": "Money Mirror",
      "/protocol": "Protocol",
      "/stake": "Stake",

      "/streaks": "Streaks",
      "/network": "Network",
      "/settings": "Settings",
    };
    return routeMap[pathname] || "Dashboard";
  };
  const [wallet, setWallet] = useState<string>("0x...");
  const [dataSource, setDataSource] = useState<string>("Manual");

  useEffect(() => {
    if (typeof window !== "undefined") {
      import('@/lib/supabase').then(({ getProfile }) => {
        const uId = localStorage.getItem("ea_user_id");
        if (uId) {
          getProfile(uId).then(p => {
             if (p?.wallet_address) setWallet(p.wallet_address.substring(0,6) + "..." + p.wallet_address.substring(p.wallet_address.length - 4));
          }).catch(console.error);
        }
      });
      const d = localStorage.getItem("ea_data_source");
      if (d === "bank") setDataSource("Setu AA");
    }
  }, []);

  return (
    <header className="h-20 shrink-0 border-b border-[#1F1F1F] flex items-center justify-between px-6 lg:px-8 bg-[#000000] sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-white font-sans">{getPageTitle()}</h1>
        {dataSource === "Setu AA" && (
           <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest">Bank Connected</span>
           </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#1F1F1F] rounded-lg">
          <Wallet className="w-3.5 h-3.5 text-[#22C55E]" />
          <span className="text-sm font-medium font-mono text-[#A1A1AA]">{wallet}</span>
        </div>

        <button className="w-10 h-10 rounded-lg bg-[#111111] border border-[#1F1F1F] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <button className="w-10 h-10 rounded-lg bg-[#111111] border border-[#1F1F1F] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors">
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
