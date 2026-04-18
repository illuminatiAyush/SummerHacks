"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Wallet, Target, User, Mail, DollarSign } from "lucide-react";
import { createProfile } from "@/lib/supabase";

const GOALS = [
  { value: "Bike", label: "Buy a Bike", emoji: "🏍️" },
  { value: "Laptop", label: "Gaming Laptop", emoji: "💻" },
  { value: "Trip", label: "Goa Trip", emoji: "✈️" },
  { value: "Phone", label: "New Phone", emoji: "📱" },
  { value: "Emergency Fund", label: "Emergency Fund", emoji: "🛡️" },
  { value: "Investment", label: "Start Investing", emoji: "📈" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    wallet_address: "",
    monthly_income: "",
    financial_goal: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.monthly_income || !form.financial_goal) return;
    setLoading(true);
    try {
      const profile = await createProfile({
        name: form.name,
        email: form.email,
        wallet_address: form.wallet_address,
        monthly_income: parseFloat(form.monthly_income),
        financial_goal: form.financial_goal,
      });
      localStorage.setItem("ea_user_id", profile.id);
      localStorage.setItem("ea_user_name", profile.name);
      localStorage.setItem("ea_stipend", form.monthly_income);
      localStorage.setItem("ea_goal", form.financial_goal);
      router.push("/data-source");
    } catch (err) {
      console.error("Onboarding failed:", err);
      alert("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-32">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? "bg-accent" : "bg-border"}`} />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-2 inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase font-bold tracking-widest rounded-full">
            <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 animate-pulse" />
            Onboarding Protocol
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-black">
            {step === 1 && "Who are you?"}
            {step === 2 && "Your financial baseline."}
            {step === 3 && "Choose your target."}
          </h1>
          <p className="text-lg text-gray-500 font-medium mb-12">
            {step === 1 && "We need to know who we're building accountability for."}
            {step === 2 && "Set your monthly income and connect your wallet."}
            {step === 3 && "What are you saving towards? This drives your emotional coaching."}
          </p>
        </motion.div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors font-bold"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors font-medium"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => form.name ? setStep(2) : null}
              disabled={!form.name}
              className="w-full py-4 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Financial Baseline */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Monthly Income / Stipend (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={form.monthly_income}
                    onChange={(e) => setForm({ ...form, monthly_income: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors font-bold font-mono"
                    placeholder="15000"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Wallet Address (Optional)</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={form.wallet_address}
                    onChange={(e) => setForm({ ...form, wallet_address: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors font-medium font-mono text-sm"
                    placeholder="0x..."
                  />
                </div>
                <p className="text-[10px] text-muted mt-2">Sepolia Testnet — required for commitment staking</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 border border-border rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-surface transition-all text-secondary">
                Back
              </button>
              <button
                onClick={() => form.monthly_income ? setStep(3) : null}
                disabled={!form.monthly_income}
                className="flex-1 py-4 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Goal Selection */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setForm({ ...form, financial_goal: goal.value })}
                  className={`p-5 rounded-xl border transition-all text-left group ${
                    form.financial_goal === goal.value
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-green-400 shadow-sm"
                  }`}
                >
                  <div className="text-2xl mb-2">{goal.emoji}</div>
                  <div className="text-sm font-bold text-foreground">{goal.label}</div>
                  {form.financial_goal === goal.value && (
                    <div className="mt-2 flex items-center gap-1">
                      <Target className="w-3 h-3 text-accent" />
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-4 border border-border rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-surface transition-all text-secondary">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.financial_goal || loading}
                className="flex-1 py-4 bg-accent text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-accent/20"
              >
                {loading ? "Setting up..." : "Begin Autopsy"} <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
