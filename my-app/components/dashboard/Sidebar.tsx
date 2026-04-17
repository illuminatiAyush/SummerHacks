"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Settings 
} from "lucide-react";

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
      { label: "Trajectory", href: "/trajectory", icon: TrendingUp },
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

  return (
    <aside className="w-[220px] hover:w-[240px] bg-background border-r border-border flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out z-40 group select-none">
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
                        ? "text-foreground bg-surface font-bold shadow-sm" 
                        : "text-secondary font-semibold hover:text-foreground hover:bg-surface hover:scale-[1.02]"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-accent rounded-r-sm shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    )}
                    <item.icon className={cn("shrink-0", isActive ? "text-accent" : "text-secondary group-hover/item:text-foreground")} size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="whitespace-nowrap transition-opacity duration-200">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border shrink-0">
        <div className="p-3 bg-surface rounded-xl border border-border flex flex-col gap-2 overflow-hidden">
          <span className="text-[10px] text-secondary font-sans font-semibold uppercase tracking-wider whitespace-nowrap">System Mode</span>
          <div className="flex items-center gap-2 text-sm text-accent font-bold font-sans">
            <div className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" />
            <span className="whitespace-nowrap">Live Audit</span>
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
