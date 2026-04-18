"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, Bell, User, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analysis", href: "/analysis" },
  { label: "Protocol", href: "/protocol" },

  { label: "Network", href: "/network" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "sticky top-0 w-full h-16 z-[100] transition-all duration-300 glass-nav px-6",
      isScrolled ? "py-2" : "py-4"
    )}>
      <div className="w-full h-full flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 flex items-center justify-center rounded-sm bg-accent transition-transform group-hover:scale-110">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tighter text-foreground text-xl hidden sm:block">
              Expense<span className="text-accent italic">Autopsy</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav Links (Centered) */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 h-full">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-all nav-link-underline h-full flex items-center justify-center",
                  isActive ? "text-accent active" : "text-secondary hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 border-r border-border pr-4 mr-2">
             <button className="p-2 text-secondary hover:text-accent transition-all hover:scale-105">
               <Bell size={19} />
             </button>
          </div>

          <ThemeToggle />
          
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-secondary hover:text-foreground hover:border-accent/40 transition-all overflow-hidden bg-surface group">
            <User size={18} className="transition-transform group-hover:scale-110" />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-background border-b border-border p-6 space-y-4 lg:hidden shadow-2xl"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block text-lg font-semibold py-2",
                  pathname === link.href ? "text-accent" : "text-secondary hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
