"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Lock, Key, CheckCircle2, AlertTriangle, TrendingDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { createChallenge, createProfile } from "@/lib/supabase";

export default function CommitPage() {
  const router = useRouter();
  const [step, setStep] = useState<"setup" | "escrow" | "processing" | "success">("setup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");

  const [form, setForm] = useState({
    duration: 30,
    stakeAmount: 0.01,
    targetReduction: 30,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      let uId = localStorage.getItem("ea_user_id");
      // Clean up previous broken mock IDs
      if (!uId || uId.startsWith("mock-user-")) {
        uId = crypto.randomUUID ? crypto.randomUUID() : '5fc1f019-1234-4dc6-8109-74de5160bb7a';
        localStorage.setItem("ea_user_id", uId);
      }
      const aData = localStorage.getItem("ea_analysis");
      if (uId) setUserId(uId);
      if (aData) setAnalysis(JSON.parse(aData));
    }
  }, []);

  const handleCreateChallenge = async () => {
    if (!userId || !analysis) {
      setError("Missing user or analysis data. Please restart the flow.");
      return;
    }
    setStep("escrow");
  };

  const handleConfirmEscrow = async () => {
    setLoading(true);
    setError("");
    setStep("processing");

    try {
      // Simulate Web3 Transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const mockTxHash = `0x${Math.random().toString(16).slice(2, 42)}`;

      const challengeData = {
        user_id: userId,
        category: analysis.highest_spend_category || "Unknown",
        duration_days: form.duration,
        stake_amount: form.stakeAmount,
        target_reduction: form.targetReduction,
        tx_hash: mockTxHash,
      };

      try {
        await createChallenge(challengeData);
      } catch (err: any) {
        // Did they skip onboarding entirely causing a Foreign Key error?
        if (err.message && (err.message.includes("foreign") || err.code === "23503")) {
          console.warn("Ghost profile generated to satisfy constraints.");
          await createProfile({
            id: userId,
            name: "MVP Tester",
            email: "ghost@autopsy.finance",
            wallet_address: "0xMockWallet",
            monthly_income: 100000,
            financial_goal: "Hackathon Demo"
          });
          await createChallenge(challengeData);
        } else {
          throw err;
        }
      }

      setStep("success");
    } catch (err: any) {
      setError(err.message || "Failed to create commitment");
      setStep("escrow");
    } finally {
      setLoading(false);
    }
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
        <div className="text-secondary">Loading analysis data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-32">
        <AnimatePresence mode="wait">
          {/* STEP 1: SETUP */}
          {step === "setup" && (
            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-2 inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase font-bold tracking-widest rounded-full">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 animate-pulse" />
                Commitment Protocol
              </div>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-3">Lock in your commitment.</h1>
              <p className="text-lg text-secondary font-light mb-10">
                To change your behavior, you need skin in the game. Stake ETH against your highest spending category.
              </p>

              <div className="bg-surface border border-border rounded-xl p-8 space-y-8">
                {/* Target Category */}
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Target Category</label>
                  <div className="px-4 py-4 bg-background border border-border rounded-lg text-foreground font-medium flex items-center justify-between">
                    <span className="text-lg">{analysis.highest_spend_category}</span>
                    <TrendingDown className="w-5 h-5 text-accent" />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Challenge Duration</label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-4 bg-background border border-border rounded-lg text-foreground font-medium focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
                  >
                    <option value={7}>7 Days (Sprint)</option>
                    <option value={14}>14 Days (Standard)</option>
                    <option value={30}>30 Days (Habit Builder)</option>
                  </select>
                </div>

                {/* Stake Amount */}
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Stake Amount (ETH)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={form.stakeAmount}
                      onChange={(e) => setForm({ ...form, stakeAmount: parseFloat(e.target.value) })}
                      className="w-full pl-4 pr-16 py-4 bg-background border border-border rounded-lg text-accent font-mono text-xl font-bold focus:outline-none focus:border-accent transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-bold">ETH</span>
                  </div>
                  <p className="text-[10px] text-muted mt-2 uppercase tracking-widest font-bold">Testnet Sepolia ETH</p>
                </div>

                {/* Target Reduction */}
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Target Reduction Percentage</label>
                  <select
                    value={form.targetReduction}
                    onChange={(e) => setForm({ ...form, targetReduction: parseInt(e.target.value) })}
                    className="w-full px-4 py-4 bg-background border border-border rounded-lg text-foreground font-medium focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
                  >
                    <option value={15}>15% - Realistic</option>
                    <option value={30}>30% - Recommended</option>
                    <option value={50}>50% - Aggressive</option>
                    <option value={75}>75% - Extreme</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-6 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-bold">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => router.push("/analysis")}
                  className="w-1/3 py-4 border border-border rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-surface transition-all text-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateChallenge}
                  className="w-2/3 py-4 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all flex items-center justify-center gap-2"
                >
                  Create Protocol <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ESCROW CONFIRMATION */}
          {step === "escrow" && (
            <motion.div key="escrow" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-2 inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase font-bold tracking-widest rounded-full">
                <Lock className="w-3 h-3 mr-1" /> Web3 Escrow Layer
              </div>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-3">Sign the contract.</h1>
              <p className="text-lg text-secondary font-light mb-10">
                You are about to lock your funds in a smart contract. You can only withdraw them if you hit your goal.
              </p>

              <div className="bg-surface border border-accent/30 rounded-xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-purple-500" />
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-border">
                    <span className="text-sm font-bold text-secondary uppercase tracking-widest">Staking Amount</span>
                    <span className="text-3xl font-mono font-bold text-foreground">{form.stakeAmount} ETH</span>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-border">
                    <span className="text-sm font-bold text-secondary uppercase tracking-widest">Network</span>
                    <span className="text-sm font-bold text-foreground bg-background px-3 py-1 rounded-full border border-border">Sepolia Testnet</span>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-border">
                    <span className="text-sm font-bold text-secondary uppercase tracking-widest">Duration</span>
                    <span className="text-sm font-bold text-foreground space-x-1">
                      <span className="text-xl">{form.duration}</span> 
                      <span className="text-secondary">Days</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-secondary uppercase tracking-widest">Target Reduction</span>
                    <span className="text-xl font-bold text-accent">{form.targetReduction}%</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-bold">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </div>
              )}

              <p className="text-sm text-secondary font-light leading-relaxed mb-8 text-center px-4">
                By signing, you agree to lock {form.stakeAmount} ETH in the ExpenseAutopsy escrow contract. You must reduce <strong>{analysis.highest_spend_category}</strong> spending by <strong>{form.targetReduction}%</strong> within <strong>{form.duration} days</strong> to unlock it.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("setup")}
                  disabled={loading}
                  className="w-1/3 py-4 border border-border rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-surface transition-all text-secondary disabled:opacity-30"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEscrow}
                  disabled={loading}
                  className="w-2/3 py-4 bg-accent text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-accent/20"
                >
                  {loading ? "Signing Transaction..." : "Sign & Lock Funds"} <Key className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PROCESSING */}
          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative w-24 h-24 mb-8">
                <motion.div
                  className="absolute inset-0 border-2 border-accent/20 border-r-accent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Broadcasting to network</h2>
              <p className="text-secondary font-light">Confirming your transaction on Sepolia...</p>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="w-24 h-24 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">You are locked in.</h1>
              <p className="text-lg text-secondary font-light mb-12 max-w-lg mx-auto">
                Your funds are secured in the smart contract. Time to prove you can change.
              </p>

              <div className="bg-surface border border-border rounded-xl p-6 text-left max-w-sm mx-auto mb-10 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-secondary uppercase tracking-widest">Stake</span>
                  <span className="font-mono text-accent font-bold">{form.stakeAmount} ETH</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-secondary uppercase tracking-widest">Duration</span>
                  <span className="font-mono text-foreground">{form.duration} Days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-secondary uppercase tracking-widest">Target</span>
                  <span className="font-mono text-foreground">-{form.targetReduction}% {analysis.highest_spend_category}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/dashboard")}
                className="py-4 px-12 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all shadow-xl"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
