"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Activity, 
  Lightbulb, 
  LineChart, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  CalendarDays, 
  Users, 
  Settings,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

const NAV_SECTIONS = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Autopsy", href: "/analysis", icon: Activity },
      { label: "Insights", href: "/insights", icon: Lightbulb },
      { label: "Money Mirror", href: "/money-mirror", icon: LineChart },
    ],
  },
  {
    title: "DISCIPLINE",
    items: [
      { label: "Protocol", href: "/protocol", icon: ShieldCheck },
      { label: "Stake", href: "/stake", icon: Target },
    ],
  },
  {
    title: "PROGRESS",
    items: [
      { label: "Streaks", href: "/streaks", icon: CalendarDays },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { label: "Network", href: "/network", icon: Users },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDemoMode, setDemoMode } = useAppStore();

  const handleReset = () => {
    if (confirm("This will clear all your local analysis data and profile. Continue?")) {
      localStorage.clear();
      window.location.href = "/onboarding";
    }
  };

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out z-40 group select-none">
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 custom-scrollbar-hidden">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-semibold text-secondary uppercase tracking-wide font-sans">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group/item relative overflow-hidden",
                      isActive 
                        ? "text-green-600 bg-green-50 font-bold shadow-sm" 
                        : "text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-green-600 rounded-r-md" />
                    )}
                    <item.icon className={cn("shrink-0", isActive ? "text-green-600" : "text-gray-400 group-hover/item:text-gray-900")} size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="whitespace-nowrap transition-opacity duration-200">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              {section.title === "SYSTEM" && (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 font-medium hover:bg-red-50 transition-all duration-200 group/reset mt-2 border border-transparent hover:border-red-100"
                >
                  <RotateCcw className="shrink-0 text-red-400 group-hover/reset:text-red-600" size={18} />
                  <span>Reset App</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 shrink-0">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-2 overflow-hidden relative group/status">
          <span className="text-[10px] text-gray-500 font-sans font-bold uppercase tracking-wider whitespace-nowrap">System Mode</span>
          <div className="flex items-center gap-2 text-sm font-bold font-sans">
            {isDemoMode ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="text-amber-600 uppercase tracking-tight">DEMO ACTIVE</span>
                <button 
                  onClick={() => setDemoMode(false)}
                  className="absolute right-2 top-2 opacity-0 group-hover/status:opacity-100 transition-opacity text-[8px] bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 font-black"
                >
                  EXIT
                </button>
              </>
            ) : (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                <span className="text-gray-900 font-bold whitespace-nowrap">LIVE AUDIT</span>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
}
