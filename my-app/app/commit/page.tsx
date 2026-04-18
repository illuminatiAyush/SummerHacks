"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Lock, Key, CheckCircle2, AlertTriangle, TrendingDown, Target } from "lucide-react";
import { createChallenge, createProfile } from "@/lib/supabase";
import { ethers } from "ethers";
import { useAppStore } from "@/lib/store/useAppStore";
import { Sparkles, Trophy } from "lucide-react";

export default function CommitPage() {
  const router = useRouter();
  const [step, setStep] = useState<"setup" | "escrow" | "processing" | "success">("setup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [walletState, setWalletState] = useState<"idle" | "available" | "not_installed" | "connected">("idle");
  const { isDemoMode, setDemoMode, walletAddress, setWalletAddress } = useAppStore();

  const [form, setForm] = useState({
    duration: 30,
    stakeAmount: 0.01,
    targetReduction: 30,
    goal: "Buy a Laptop in 1 Year",
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

      // Wallet detection
      if (typeof (window as any).ethereum !== 'undefined') {
        setWalletState("available");
      } else {
        setWalletState("not_installed");
      }
    }
  }, []);

  const handleConnectWallet = async () => {
    if (walletState === "not_installed") return;
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      setWalletState("connected");
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  const handleContinueDemo = () => {
    setDemoMode(true);
    setError("");
    // Skip to escrow directly if user wants
  };

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
      let mockTxHash = `0x${Math.random().toString(16).slice(2, 42)}`;

      if (isDemoMode) {
        // Simulated Stake
        await new Promise(r => setTimeout(r, 2000));
        mockTxHash = `demo_tx_${Math.random().toString(36).substring(7)}`;
      } else if (typeof (window as any).ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider((window as Record<string, any>).ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          
          const network = await provider.getNetwork();
          if (network.chainId.toString() !== "11155111") {
             throw new Error("Please switch to the Sepolia Testnet in MetaMask to continue.");
          }

          const escrowAddress = process.env.NEXT_PUBLIC_ESCROW_WALLET || "0x1C7ed9A4bd9c70A46564f695526f4796536fc2BC";
          const tx = await signer.sendTransaction({
            to: escrowAddress,
            value: ethers.parseEther(form.stakeAmount.toString())
          });
          
          mockTxHash = tx.hash;
          await tx.wait(1); // Wait for 1 confirmation
        } catch (web3Err: any) {
           console.error("Web3 Error:", web3Err);
           throw new Error(web3Err.info?.error?.message || web3Err.message || "Failed to process MetaMask transaction");
        }
      } else {
         throw new Error("MetaMask is not installed. Please try Demo Mode.");
      }

      const challengeData = {
        user_id: userId,
        category: analysis.highest_spend_category || "Unknown",
        duration_days: form.duration,
        stake_amount: form.stakeAmount,
        target_reduction: form.targetReduction,
        tx_hash: mockTxHash,
      };
      
      localStorage.setItem("ea_financial_goal", form.goal);

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
            financial_goal: form.goal
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
      <div className="min-h-screen bg-[#f6f7f9] text-black font-sans flex items-center justify-center">
        <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading analysis data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-black font-sans">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-32">
        <AnimatePresence mode="wait">
          {/* STEP 1: SETUP */}
          {step === "setup" && (
            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex justify-between items-start mb-2">
                <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase font-bold tracking-widest rounded-full">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 animate-pulse" />
                  Commitment Protocol
                </div>
                {isDemoMode && (
                  <div className="inline-flex items-center px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold tracking-widest rounded-full border border-amber-500/20">
                    <Sparkles className="w-3 h-3 mr-1" /> Demo Mode Active
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-1">Lock in your commitment.</h1>
              <p className="text-lg text-gray-500 font-medium mb-10">
                To change your behavior, you need skin in the game. Stake ETH against your highest spending category.
              </p>

              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-8">
                {/* Financial Goal */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Financial Goal</label>
                  <select
                    value={form.goal}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-black font-bold focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Buy a Laptop in 1 Year">Buy a Laptop in 1 Year</option>
                    <option value="Save for a Car">Save for a Car</option>
                    <option value="Clear Credit Card Debt">Clear Credit Card Debt</option>
                    <option value="Emergency Fund (3 Months)">Emergency Fund (3 Months)</option>
                    <option value="Save for Masters Degree">Save for Masters Degree</option>
                  </select>
                </div>

                {/* Target Category */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Target Category</label>
                  <div className="px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-black font-bold flex items-center justify-between">
                    <span className="text-lg">{analysis.highest_spend_category}</span>
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Challenge Duration</label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-black font-bold focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
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
                      className="w-full pl-4 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-lg text-green-600 font-mono text-xl font-bold focus:outline-none focus:border-black transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">ETH</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-tight font-bold">Testnet Sepolia ETH</p>
                </div>

                {/* Target Reduction */}
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Target Reduction Percentage</label>
                  <select
                    value={form.targetReduction}
                    onChange={(e) => setForm({ ...form, targetReduction: parseInt(e.target.value) })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-black font-bold focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
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
                  className="w-1/3 py-4 border border-gray-200 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-50 transition-all text-gray-500"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateChallenge}
                  className="w-2/3 py-4 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all flex items-center justify-center gap-2"
                >
                  {isDemoMode ? "Simulate Protocol" : "Create Protocol"} <ArrowRight size={16} />
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-1">Sign the contract.</h1>
              <p className="text-lg text-gray-500 font-medium mb-10">
                You are about to lock your funds in a smart contract. You can only withdraw them if you hit your goal.
              </p>

              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-black" />
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Financial Goal</span>
                    <span className="text-xl font-bold text-black">{form.goal}</span>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Staking Amount</span>
                    <span className="text-3xl font-bold text-black">{form.stakeAmount} ETH</span>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Network</span>
                    <span className="text-sm font-bold text-black bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Sepolia Testnet</span>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Duration</span>
                    <span className="text-sm font-bold text-black space-x-1">
                      <span className="text-xl">{form.duration}</span> 
                      <span className="text-gray-400">Days</span>
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

              <div className="flex flex-col gap-4">
                {(!isDemoMode && walletState !== "connected") ? (
                  <div className="flex flex-col gap-3">
                    {walletState === "not_installed" ? (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-2">
                        <p className="text-xs text-amber-500 font-bold text-center">
                          MetaMask is not detected. Switch to Demo Mode to continue the flow.
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={handleConnectWallet}
                        className="w-full py-4 bg-accent text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                      >
                        Connect MetaMask <ArrowRight size={16} />
                      </button>
                    )}
                    <button
                      onClick={handleContinueDemo}
                      className="w-full py-4 border border-gray-200 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-50 transition-all text-gray-500"
                    >
                      Continue in Demo Mode (Mock)
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => { setStep("setup"); }}
                      disabled={loading}
                      className="w-1/3 py-4 border border-gray-200 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-50 transition-all text-gray-500 disabled:opacity-30"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmEscrow}
                      disabled={loading}
                      className="w-2/3 py-4 bg-accent text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-accent/20"
                    >
                      {loading ? "Processing..." : isDemoMode ? "Simulate Staking" : "Sign & Lock Funds"} 
                      {isDemoMode ? <Sparkles className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                    </button>
                  </div>
                )}
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
              <h2 className="text-3xl font-bold text-black mb-3">Broadcasting to network</h2>
              <p className="text-secondary font-light">Confirming your transaction on Sepolia...</p>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="w-24 h-24 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black">
                {isDemoMode ? "Goal simulation active." : "You are locked in."}
              </h1>
              <p className="text-lg text-secondary font-light mb-12 max-w-lg mx-auto">
                {isDemoMode 
                  ? "You are running in demo mode. Funds are simulated as locked." 
                  : "Your funds are secured in the smart contract. Time to prove you can change."}
              </p>

              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-left max-w-sm mx-auto mb-10 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-400 uppercase tracking-widest">Stake</span>
                  <span className="font-bold text-green-600">{form.stakeAmount} ETH</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-400 uppercase tracking-widest">Duration</span>
                  <span className="font-bold text-black">{form.duration} Days</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-400 uppercase tracking-widest">Target</span>
                  <span className="font-bold text-black">-{form.targetReduction}% {analysis.highest_spend_category}</span>
                </div>
                {isDemoMode && (
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reward Reserved</div>
                      <div className="text-xs font-bold text-black italic">"Early Adopter" NFT Badge</div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => router.push("/network")}
                className="py-4 px-12 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all shadow-xl"
              >
                Go to Community Network
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
