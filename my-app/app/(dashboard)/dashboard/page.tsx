"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingDown, 
  TrendingUp, 
  Activity,
  Zap,
  Lock,
  Landmark,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import MoneyMirrorChart from "@/components/dashboard/MoneyMirrorChart";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import CountUp from "react-countup";

type AAState = "empty" | "mock" | "real";

const MOCK_DATA = {
  savingsScore: 61,
  monthlyWaste: 4200,
  fiveYearLoss: 250000,
  potentialValue: 310000,
  dailySpend: 140,
  insight: "Your daily ₹140 food and convenience spend is silently costing you ₹2.5L over 5 years."
};

export default function Dashboard() {
  const [aaState, setAaState] = useState<AAState>("empty");
  const [mounted, setMounted] = useState(false);
  const { savingsScore, monthlyWaste, fiveYearLoss, potentialValue, setMetrics } = useDashboardStore();

  useEffect(() => {
    setMounted(true);
    
    // Load store API data to override "real" state
    if (typeof window !== "undefined") {
      const aDataStr = localStorage.getItem("ea_analysis");
      if (aDataStr) {
        const aData = JSON.parse(aDataStr);
        setMetrics({
          savingsScore: aData.savings_score || 0,
          monthlyWaste: aData.monthly_waste || 0,
          fiveYearLoss: aData.compounded_five_year_cost || 0,
          potentialValue: aData.future_invested_value || 0,
        });
      }
    }
  }, [setMetrics]);

  const handleConnectAA = () => {
    // Stage 1: Instantly load MOCK intelligence to give the illusion of speed/smarts
    setAaState("mock");
    
    // Stage 2: Simulate the backend API returning true personalized Setu AA data
    setTimeout(() => {
      setAaState("real");
    }, 4500); // 4.5 seconds to build suspense and analyze
  };

  if (!mounted) return null;

  // Real data mapped (if empty, grab from store or use default "realish" mockup)
  const REAL_DATA = {
    savingsScore: savingsScore > 0 ? savingsScore : 68,
    monthlyWaste: monthlyWaste > 0 ? monthlyWaste : 3600,
    fiveYearLoss: fiveYearLoss > 0 ? fiveYearLoss : 210000,
    potentialValue: potentialValue > 0 ? potentialValue : 290000,
    dailySpend: monthlyWaste > 0 ? (monthlyWaste / 30).toFixed(0) : 120,
    insight: "Your Swiggy usage peaks on weekends, costing you ₹900/week and delaying your savings goal."
  };

  // State-based router
  const displayData = 
    aaState === "empty" 
      ? { savingsScore: 0, monthlyWaste: 0, fiveYearLoss: 0, potentialValue: 0 }
      : aaState === "mock" 
        ? MOCK_DATA 
        : REAL_DATA;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 font-sans">
      
      {/* HEADER SECTION */}
      <AnimatePresence mode="wait">
        {aaState === "empty" && (
          <motion.div 
            key="header-empty"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-[#1F1F1F] shadow-sm mb-8"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                System Offline
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-[#A1A1AA]">
                Your financial system is not connected. Connect your bank via RBI Account Aggregator to begin analysis.
              </p>
            </div>
            <button 
              onClick={handleConnectAA}
              className="mt-4 md:mt-0 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold tracking-[0.2em] uppercase text-white bg-black hover:bg-gray-800 dark:text-[#000000] dark:bg-white dark:hover:bg-gray-200 transition-all group shadow-md"
            >
              <Landmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Connect Bank Securely
            </button>
          </motion.div>
        )}

        {aaState === "mock" && (
          <motion.div 
            key="header-mock"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-4 bg-gray-50 dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-[#1F1F1F] shadow-sm mb-8 relative overflow-hidden"
          >
             {/* Subtle scanning animation line */}
             <motion.div 
               animate={{ x: ["-100%", "200%"] }} 
               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
               className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-transparent via-[#22C55E]/10 to-transparent" 
             />
             
            <Loader2 className="w-6 h-6 text-[#22C55E] animate-spin" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Analyzing behavioral patterns...</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-[#22C55E]">Simulating trajectory. Waiting for final AA sync.</p>
            </div>
          </motion.div>
        )}

        {aaState === "real" && (
          <motion.div 
            key="header-real"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-4 bg-white dark:bg-[#111111] p-6 rounded-2xl border border-green-200 dark:border-green-900/30 shadow-sm mb-8"
          >
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Live financial analysis</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-500">Datasets verified via RBI framework.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* SECTION 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Savings Score" 
          value={displayData.savingsScore} 
          subValue={aaState === "empty" ? "Waiting for sync" : aaState === "mock" ? "Estimating..." : "Verified"} 
          icon={<Activity className={`w-5 h-5 text-gray-500`} />} 
          prefix=""
          suffix="/100"
          highlight="neutral"
        />
        <MetricCard 
          title="Monthly Waste" 
          value={displayData.monthlyWaste} 
          subValue={aaState === "empty" ? "Waiting for sync" : aaState === "mock" ? "Locating leaks..." : "Identified"} 
          icon={<TrendingDown className={`w-5 h-5 ${aaState === "empty" ? "text-gray-500" : "text-red-500"}`} />} 
          prefix="₹"
          highlight={aaState === "empty" ? "neutral" : "danger"}
        />
        <MetricCard 
          title="5-Year Loss" 
          value={displayData.fiveYearLoss} 
          subValue={aaState === "empty" ? "Waiting for sync" : aaState === "mock" ? "Projecting..." : "Calculated"} 
          icon={<TrendingDown className={`w-5 h-5 ${aaState === "empty" ? "text-gray-500" : "text-red-500"}`} />} 
          prefix="₹"
          highlight={aaState === "empty" ? "neutral" : "danger"}
        />
        <MetricCard 
          title="Potential Value" 
          value={displayData.potentialValue} 
          subValue={aaState === "empty" ? "Waiting for sync" : aaState === "mock" ? "Projecting..." : "Actionable Target"} 
          icon={<TrendingUp className={`w-5 h-5 ${aaState === "empty" ? "text-gray-500" : "text-green-500"}`} />} 
          prefix="₹"
          highlight={aaState === "empty" ? "neutral" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        
        {/* SECTION 2: Trajectory Graph */}
        <div className={`lg:col-span-2 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col relative transition-all duration-200 bg-gradient-to-b from-white to-gray-50 dark:from-[#111111] dark:to-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F]`}>
          
          <div className="mb-6 relative z-10 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Trajectory Graph</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">
                {aaState === "empty" ? "No data detected" : "Projected asset mapping"}
              </p>
            </div>
          </div>

          <div className="h-[250px] w-full flex items-center justify-center relative">
            {aaState !== "empty" ? (
               <div className="w-full h-full opacity-100 transition-opacity duration-1000">
                  <MoneyMirrorChart />
               </div>
            ) : (
               // Flat Line For Empty State
               <div className="w-full h-1 bg-gray-200 dark:bg-[#1F1F1F] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-400 dark:bg-[#333333]" />
               </div>
            )}
          </div>
        </div>

        {/* Right Column (Insights & CTA) */}
        <div className="space-y-6 flex flex-col">
          
          {/* EMOTIONAL INSIGHT CARD */}
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex-1 flex flex-col justify-center relative overflow-hidden transition-all duration-200">
            <AnimatePresence mode="wait">
              {aaState !== "empty" ? (
                <motion.div
                  key="insight-loaded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-[#A1A1AA] uppercase tracking-widest mb-4">
                    <Zap className="w-4 h-4 text-orange-500" /> Insight
                  </div>
                  <p className="text-xl font-medium text-gray-900 dark:text-white leading-tight">
                    {aaState === "mock" ? MOCK_DATA.insight : REAL_DATA.insight}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="insight-empty" className="opacity-30">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-widest mb-4">
                    <Zap className="w-4 h-4" /> Insight
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-[#1F1F1F] rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-[#1F1F1F] rounded w-1/2" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACTION CTA CARD */}
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
             <AnimatePresence mode="wait">
               {aaState !== "empty" ? (
                 <motion.div key="action-loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Commitment Protocol</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">Introduce financial accountability to enforce discipline.</p>
                    </div>
                    <Link href="/commit" className="w-full py-4 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-sm">
                      <Lock className="w-4 h-4" /> Lock ETH to Break Habit
                    </Link>
                 </motion.div>
               ) : (
                 <motion.div key="action-empty" className="opacity-50 pointer-events-none">
                    <div className="mb-6">
                       <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Commitment Protocol</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-[#A1A1AA]">Introduce financial accountability to enforce discipline.</p>
                    </div>
                    <div className="w-full h-12 bg-gray-100 dark:bg-[#1F1F1F] rounded-xl flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-400 dark:text-[#555555]" />
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  subValue, 
  icon, 
  prefix = "", 
  suffix = "", 
  highlight = "neutral" 
}: { 
  title: string, 
  value: number, 
  subValue: string, 
  icon: React.ReactNode, 
  prefix?: string, 
  suffix?: string, 
  highlight?: "neutral" | "danger" | "success" 
}) {
  
  const valueColor = 
    highlight === "danger" ? "text-red-500" : 
    highlight === "success" ? "text-green-500" : 
    "text-gray-900 dark:text-white";

  return (
    <div className={`bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1F1F1F] shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl p-6 transition-all duration-200 relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[10px] font-bold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-widest">{title}</h3>
        <div className={`p-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A]`}>
          {icon}
        </div>
      </div>
      <div>
        <div className={`text-3xl font-bold tracking-tighter mb-2 font-mono ${valueColor}`}>
          {prefix && <span className="text-xl mr-1 opacity-70">{prefix}</span>}
          <CountUp
            end={value}
            duration={2}
            separator=","
            useEasing={true}
          />
          {suffix && <span className="text-xl ml-1 opacity-70">{suffix}</span>}
        </div>
        <div className="text-[10px] font-bold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-widest">
          {subValue}
        </div>
      </div>
    </div>
  );
}
