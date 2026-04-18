"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  AlertCircle,
  Brain,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import MoneyMirrorChart from "@/components/dashboard/MoneyMirrorChart";
import TransactionPreviewModal from "@/components/dashboard/TransactionPreviewModal";
import BankSelectionModal from "@/components/dashboard/BankSelectionModal";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import CountUp from "react-countup";

type DashboardPhase = "empty" | "preview" | "analyzing" | "real" | "error";

interface Transaction {
  merchant: string;
  amount: number;
  date: string;
}

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 90000; // 90s max

export default function Dashboard() {
  const [phase, setPhase] = useState<DashboardPhase>("empty");
  const [mounted, setMounted] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const { 
    savingsScore, monthlyWaste, fiveYearLoss, potentialValue, 
    insight, goodHabits, highestSpendCategory, mirrorPrediction,
    spendingBreakdown, beforeAfterProjection,
    setMetrics 
  } = useDashboardStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const hydrateFromResult = useCallback((data: any) => {
    console.log("[Dashboard] Raw hydration data:", JSON.stringify(data, null, 2));
    const agentAnalysis = data.agent_analysis || data;
    const metricsToSet = {
      savingsScore: agentAnalysis.savings_score || data.savings_score || 0,
      monthlyWaste: agentAnalysis.monthly_waste || data.monthly_waste || 0,
      fiveYearLoss: agentAnalysis.compounded_five_year_cost || data.raw_5_year_loss || 0,
      potentialValue: agentAnalysis.future_invested_value || data.future_invested_value || 0,
      insight: agentAnalysis.future_self_message || agentAnalysis.emotional_message || data.emotional_message || "",
      highestSpendCategory: agentAnalysis.highest_spend_category || data.highest_spend_category || "",
      goodHabits: data.good_habits || [],
      triggerGenome: data.trigger_genome || "",
      mirrorPrediction: data.money_mirror_prediction || "",
      trendDetection: data.trend_detection || "",
      spendingBreakdown: agentAnalysis.spending_breakdown || data.spending_breakdown || {},
      beforeAfterProjection: data.before_after_projection || null,
    };
    console.log("[Dashboard] Metrics being set:", metricsToSet);
    setMetrics(metricsToSet);
  }, [setMetrics]);

  const startPolling = useCallback((payloadId: string) => {
    startTimeRef.current = Date.now();

    pollRef.current = setInterval(async () => {
      try {
        // Timeout protection
        if (Date.now() - startTimeRef.current > POLL_TIMEOUT_MS) {
          console.error("[Dashboard] Polling timed out after 90s");
          if (pollRef.current) clearInterval(pollRef.current);
          setAnalysisError("Analysis timed out. Please try again.");
          setPhase("error");
          return;
        }

        const res = await fetch(`/api/analysis/status/${payloadId}`);
        if (!res.ok) {
          console.warn(`[Dashboard] Poll returned ${res.status}`);
          return; // Keep polling, might recover
        }

        const data = await res.json();
        console.log("[Dashboard] Poll status:", data.status);

        if (data.status === "completed") {
          if (pollRef.current) clearInterval(pollRef.current);
          
          // Persist for future page loads
          localStorage.setItem("ea_analysis", JSON.stringify(data));
          
          // Hydrate the store
          hydrateFromResult(data);
          setPhase("real");
          console.log("[Dashboard] Analysis completed and hydrated.");
        } else if (data.status === "error") {
          if (pollRef.current) clearInterval(pollRef.current);
          setAnalysisError(data.error || "Pipeline failed");
          setPhase("error");
          console.error("[Dashboard] Pipeline error:", data.error);
        }
        // else: still running, keep polling
      } catch (err) {
        console.error("[Dashboard] Polling error:", err);
        // Don't stop polling on network hiccups
      }
    }, POLL_INTERVAL_MS);
  }, [hydrateFromResult]);

  const handleConnectBank = () => {
    setShowBankModal(true);
  };

  const handleBankSelected = () => {
    setShowBankModal(false);
    setTimeout(() => {
      setPhase("preview");
      setShowModal(true);
    }, 300);
  };

  const handleRunAutopsy = async (transactions: Transaction[]) => {
    setShowModal(false);
    setPhase("analyzing");
    setAnalysisError("");

    // Clear stale cached data so we force a fresh backend call
    localStorage.removeItem("ea_analysis");
    setMetrics({
      savingsScore: 0, monthlyWaste: 0, fiveYearLoss: 0, potentialValue: 0,
      insight: "", goodHabits: [], triggerGenome: "", mirrorPrediction: "",
      trendDetection: "", highestSpendCategory: "", spendingBreakdown: {},
      beforeAfterProjection: null,
    });

    // Build the raw_input string from transactions
    const rawInput = transactions
      .map((tx) => `${tx.merchant} - Rs.${tx.amount} - ${tx.date}`)
      .join("\n");

    // Retrieve goal and stipend from localStorage (set on the analysis/onboarding page)
    const storedGoal = localStorage.getItem("ea_goal") || "Buy a Laptop";
    const storedStipend = parseFloat(localStorage.getItem("ea_stipend") || "15000");

    try {
      console.log("[Dashboard] Submitting analysis...");
      const submitRes = await fetch("/api/analysis/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_input: rawInput,
          stipend: storedStipend,
          goal: storedGoal,
        }),
      });

      if (!submitRes.ok) {
        const errText = await submitRes.text();
        throw new Error(`Submit failed (${submitRes.status}): ${errText}`);
      }

      const { payload_id } = await submitRes.json();
      console.log("[Dashboard] Pipeline started, payload_id:", payload_id);

      // Start polling
      startPolling(payload_id);
    } catch (err: any) {
      console.error("[Dashboard] Submit error:", err);
      setAnalysisError(err.message || "Failed to start analysis");
      setPhase("error");
    }
  };

  const handleRetry = () => {
    setAnalysisError("");
    setPhase("empty");
  };

  if (!mounted) return null;

  // Display data — zeros when empty, real values when loaded
  const displayData = {
    savingsScore: phase === "real" ? savingsScore : 0,
    monthlyWaste: phase === "real" ? monthlyWaste : 0,
    fiveYearLoss: phase === "real" ? fiveYearLoss : 0,
    potentialValue: phase === "real" ? potentialValue : 0,
  };

  const isActive = phase === "real";

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 font-sans">
      
      {/* Bank Selection Modal */}
      <BankSelectionModal 
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onSelectHDFC={handleBankSelected}
      />

      {/* Transaction Preview Modal */}
      <TransactionPreviewModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); if (phase === "preview") setPhase("empty"); }}
        onConfirm={handleRunAutopsy}
      />

      {/* HEADER SECTION */}
      <AnimatePresence mode="wait">
        {phase === "empty" && (
          <motion.div 
            key="header-empty"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col md:flex-row items-center justify-between bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-black mb-1 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                System Offline
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Connect your bank via RBI Account Aggregator to begin analysis.
              </p>
            </div>
            <button 
              onClick={handleConnectBank}
              className="mt-4 md:mt-0 flex items-center justify-center gap-2 py-3 px-8 rounded-xl text-sm font-bold tracking-tight text-white bg-black hover:bg-gray-800 transition-all shadow-sm"
            >
              <Landmark className="w-5 h-5" />
              Connect Bank
            </button>
          </motion.div>
        )}

        {phase === "analyzing" && (
          <motion.div 
            key="header-analyzing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-4 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8 relative overflow-hidden"
          >
            <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-black flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" /> Analyzing spending pipeline...
              </h1>
              <p className="text-xs font-bold text-green-600 uppercase tracking-tight mt-1">
                Executing 5-agent LangGraph protocol on source transactions.
              </p>
            </div>
          </motion.div>
        )}

        {phase === "real" && (
          <motion.div 
            key="header-real"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between bg-white p-8 rounded-2xl border border-green-100 shadow-sm mb-8"
          >
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h1 className="text-lg font-bold tracking-tight text-black">Live Analysis Results</h1>
                <p className="text-xs font-bold text-green-600 uppercase tracking-tight mt-1">Snapshot of current financial behavior.</p>
              </div>
            </div>
            <button 
              onClick={handleConnectBank}
              className="flex items-center gap-2 py-2 px-4 text-xs font-bold text-gray-500 hover:text-black border border-gray-200 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Re-analyze
            </button>
          </motion.div>
        )}

        {phase === "error" && (
          <motion.div 
            key="header-error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between bg-white p-6 rounded-2xl border border-red-200 shadow-sm mb-8"
          >
            <div className="flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h1 className="text-lg font-bold tracking-tight text-black">Analysis Failed</h1>
                <p className="text-xs font-medium text-red-500">{analysisError}</p>
              </div>
            </div>
            <button 
              onClick={handleRetry}
              className="py-2 px-4 text-xs font-bold uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      {/* SECTION 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Savings Score" 
          value={displayData.savingsScore} 
          subValue={!isActive ? (phase === "analyzing" ? "Computing..." : "Waiting for sync") : "AI Verified"} 
          icon={<Activity className={`w-5 h-5 text-gray-500`} />} 
          prefix=""
          suffix="/100"
          highlight="neutral"
        />
        <MetricCard 
          title="Monthly Waste" 
          value={displayData.monthlyWaste} 
          subValue={!isActive ? (phase === "analyzing" ? "Locating leaks..." : "Waiting for sync") : `${highestSpendCategory || "Identified"}`} 
          icon={<TrendingDown className={`w-5 h-5 ${!isActive ? "text-gray-500" : "text-red-500"}`} />} 
          prefix="₹"
          highlight={!isActive ? "neutral" : "danger"}
        />
        <MetricCard 
          title="5-Year Loss" 
          value={displayData.fiveYearLoss} 
          subValue={!isActive ? (phase === "analyzing" ? "Projecting..." : "Waiting for sync") : "Compound Calculated"} 
          icon={<TrendingDown className={`w-5 h-5 ${!isActive ? "text-gray-500" : "text-red-500"}`} />} 
          prefix="₹"
          highlight={!isActive ? "neutral" : "danger"}
        />
        <MetricCard 
          title="Potential Value" 
          value={displayData.potentialValue} 
          subValue={!isActive ? (phase === "analyzing" ? "Modeling..." : "Waiting for sync") : "If Invested @ 8% PA"} 
          icon={<TrendingUp className={`w-5 h-5 ${!isActive ? "text-gray-500" : "text-green-500"}`} />} 
          prefix="₹"
          highlight={!isActive ? "neutral" : "success"}
        />
      </div>

      {/* SECTION 2: Graph + Insights Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col relative transition-all duration-200`}>
          
          <div className="mb-6 relative z-10 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-black mb-1">Trajectory Graph</h2>
              <p className="text-xs font-medium text-gray-500">
                {!isActive ? "No data detected" : "Projected balance over time"}
              </p>
            </div>
          </div>

          <div className="h-[250px] w-full flex items-center justify-center relative">
            {isActive ? (
               <div className="w-full h-full opacity-100 transition-opacity duration-1000">
                  <MoneyMirrorChart 
                    wasteBefore={beforeAfterProjection?.waste_before} 
                    wasteAfter={beforeAfterProjection?.waste_after} 
                  />
               </div>
            ) : phase === "analyzing" ? (
               <div className="flex flex-col items-center gap-3">
                 <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Projecting trajectory...</p>
               </div>
            ) : (
               // Flat Line For Empty State
               <div className="w-full h-1 bg-gray-200 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-400" />
               </div>
            )}
          </div>
        </div>

        {/* Right Column (Insights & CTA) */}
        <div className="space-y-6 flex flex-col">
          
          {/* EMOTIONAL INSIGHT CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex-1 flex flex-col justify-center relative overflow-hidden transition-all duration-200">
            <AnimatePresence mode="wait">
              {isActive ? (
                <motion.div
                  key="insight-loaded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <Zap className="w-4 h-4 text-amber-500" /> AI Coaching
                  </div>
                  <p className="text-xl font-bold text-black leading-tight tracking-tight">
                    {insight || mirrorPrediction || "Waiting for pipeline..."}
                  </p>
                  {goodHabits.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2">
                        ✓ Positive Signals
                      </div>
                      {goodHabits.map((habit, i) => (
                        <p key={i} className="text-xs text-gray-500">• {habit}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : phase === "analyzing" ? (
                <motion.div key="insight-analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-4">
                  <Brain className="w-8 h-8 text-purple-500 mb-3 animate-pulse" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                    AI agents crafting insight...
                  </p>
                </motion.div>
              ) : (
                <motion.div key="insight-empty" className="opacity-30">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                    <Zap className="w-4 h-4" /> Insight
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACTION CTA CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
             <AnimatePresence mode="wait">
               {isActive ? (
                 <motion.div key="action-loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-black mb-1">Commitment Protocol</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Introduce financial accountability to enforce discipline.</p>
                    </div>
                    <Link href="/commit" className="w-full py-4 bg-black text-white hover:bg-gray-800 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-sm">
                      <Lock className="w-4 h-4" /> Lock ETH to Break Habit
                    </Link>
                 </motion.div>
               ) : (
                 <motion.div key="action-empty" className="opacity-50 pointer-events-none">
                    <div className="mb-6">
                       <h3 className="text-sm font-bold text-black mb-1">Commitment Protocol</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Introduce financial accountability to enforce discipline.</p>
                    </div>
                    <div className="w-full h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-400" />
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
    highlight === "danger" ? "text-red-600" : 
    highlight === "success" ? "text-green-600" : 
    "text-black";

  return (
    <div className={`bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-8 transition-all duration-200 relative overflow-hidden group`}>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-tight mb-1">{title}</p>
          <div className={`text-3xl font-bold tracking-tight ${valueColor}`}>
            {prefix && <span className="text-xl mr-0.5 opacity-50 font-medium">{prefix}</span>}
            <CountUp
              end={value}
              duration={1.5}
              separator=","
              useEasing={true}
            />
            {suffix && <span className="text-xl ml-0.5 opacity-50 font-medium">{suffix}</span>}
          </div>
        </div>
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {subValue}
          </div>
          <div className="opacity-40 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
