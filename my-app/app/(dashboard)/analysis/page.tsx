"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, X, Target, ArrowRight, Loader2,
  TrendingDown, PieChart, Brain, Sparkles, BarChart3, AlertTriangle
} from "lucide-react";

type Status = "idle" | "uploading" | "running" | "completed" | "error";

interface AnalysisResult {
  highest_spend_category: string;
  monthly_waste: number;
  raw_5_year_loss: number;
  future_invested_value: number;
  savings_score: number;
  emotional_message: string;
  spending_breakdown: Record<string, number>;
}

const GOALS = [
  { value: "Bike", label: "🏍️ Bike" },
  { value: "Laptop", label: "💻 Laptop" },
  { value: "Trip", label: "✈️ Trip" },
  { value: "Phone", label: "📱 Phone" },
  { value: "Emergency Fund", label: "🛡️ Emergency" },
  { value: "Investment", label: "📈 Invest" },
];

export default function AnalysisPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [goal, setGoal] = useState("");
  const [stipend, setStipend] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [payloadId, setPayloadId] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const dataSource = typeof window !== "undefined" ? localStorage.getItem("ea_data_source") || "upload" : "upload";

  // Pre-fill from onboarding
  useEffect(() => {
    if (typeof window !== "undefined") {
      setGoal(localStorage.getItem("ea_goal") || "");
      setStipend(localStorage.getItem("ea_stipend") || "");
    }
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  // Auto-submit immediately when a file is chosen or dropped
  useEffect(() => {
    if (file && (status === "idle" || status === "error")) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleSubmit = async () => {
    setStatus("uploading");
    setError("");

    try {
      let input = rawText;
      let filename = "input.txt";
      
      if (!input && file) {
        filename = file.name;
        input = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      
      if (!input && !file) {
        try {
          const mockRes = await fetch("/sample.json");
          if (mockRes.ok) {
            const mockData = await mockRes.json();
            input = "Bank Statement Mock Data:\n" + JSON.stringify(mockData, null, 2);
          } else {
            input = "No data provided";
          }
        } catch (e) {
          input = "No data provided";
        }
      }

      const res = await fetch("/api/analysis/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_input: input,
          filename: filename,
          stipend: stipend ? parseFloat(stipend) : 15000,
          goal: goal || "Financial Freedom",
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      const data = await res.json();
      setPayloadId(data.payload_id);
      setStatus("running");
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  // Poll for results
  useEffect(() => {
    if (status !== "running" || !payloadId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/analysis/status/${payloadId}`);
        const data = await res.json();

        if (data.status === "completed" && data.agent_analysis) {
          const analysis = data.agent_analysis;
          // Map the backend response to our result format
          setResult({
            highest_spend_category: analysis.highest_spend_category || "None",
            monthly_waste: analysis.monthly_waste ?? 0,
            raw_5_year_loss: analysis.raw_5_year_loss ?? 0,
            future_invested_value: analysis.future_invested_value ?? 0,
            savings_score: analysis.savings_score ?? 0,
            emotional_message: analysis.emotional_message || "Your daily habits are silently eroding your financial future.",
            spending_breakdown: analysis.spending_breakdown || {},
          });
          setStatus("completed");
          clearInterval(interval);

          // Save to localStorage for downstream pages
          localStorage.setItem("ea_analysis", JSON.stringify(analysis));
          localStorage.setItem("ea_payload_id", payloadId);
        } else if (data.status === "error") {
          setError("Analysis failed");
          setStatus("error");
          clearInterval(interval);
        }
      } catch {
        // keep polling
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status, payloadId]);

  const handleCommit = () => {
    router.push("/commit");
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-32">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-2 inline-flex items-center px-3 py-1 bg-black/5 text-black text-[10px] uppercase font-bold tracking-widest rounded-full">
            <span className="w-1.5 h-1.5 bg-black rounded-full mr-2 animate-pulse" />
            {dataSource === "bank" ? "Bank Connected" : "Manual Upload"} • AI Autopsy Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-1">Financial Autopsy</h1>
          <p className="text-lg font-medium text-gray-500 mb-10">Upload your spending data. Our AI dissects every rupee.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── INPUT PHASE ── */}
          {(status === "idle" || status === "error") && (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Left: Upload */}
                <div className="lg:col-span-3 space-y-6">
                  {/* File Upload Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-green-400 transition-colors cursor-pointer group shadow-sm"
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    <input id="file-input" type="file" className="hidden" accept=".pdf,.csv,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="w-6 h-6 text-accent" />
                        <span className="font-bold text-foreground">{file.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="p-1 hover:bg-background rounded">
                          <X className="w-4 h-4 text-muted" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-muted mx-auto mb-4 group-hover:text-accent transition-colors" />
                        <p className="text-sm font-bold text-foreground mb-1">Drop your statement here</p>
                        <p className="text-[10px] text-muted uppercase tracking-widest font-bold">PDF • CSV • Image — or click to browse</p>
                      </>
                    )}
                  </div>

                  {/* Or paste text */}
                  <div>
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Or paste transaction text</label>
                    <textarea
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      rows={5}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors text-sm font-mono resize-none shadow-sm"
                      placeholder={"Zomato - ₹350\nAmazon - ₹1200\nNetflix - ₹649\nSwiggy - ₹280\n..."}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-bold">
                      <AlertTriangle className="w-4 h-4" /> {error}
                    </div>
                  )}
                </div>

                {/* Right: Goal + Stipend */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">
                      <Target className="w-3 h-3 text-accent" /> Analysis Parameters
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-secondary mb-2 block">Monthly Stipend (₹)</label>
                        <input
                          type="number"
                          value={stipend}
                          onChange={(e) => setStipend(e.target.value)}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-black font-mono focus:outline-none focus:border-black transition-colors"
                          placeholder="15000"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-secondary mb-2 block">Financial Goal</label>
                        <div className="grid grid-cols-2 gap-2">
                          {GOALS.map((g) => (
                            <button
                              key={g.value}
                              onClick={() => setGoal(g.value)}
                              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                                goal === g.value
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-border bg-background text-secondary hover:border-accent/30"
                              }`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={(!file && !rawText) || !stipend || !goal}
                    className="w-full py-4 bg-accent text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-accent/20"
                  >
                    <Sparkles className="w-4 h-4" /> Run Autopsy
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── LOADING PHASE ── */}
          {(status === "uploading" || status === "running") && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24">
              <div className="relative w-24 h-24 mb-8">
                <motion.div
                  className="absolute inset-0 border-2 border-accent/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-2 border-2 border-accent rounded-full border-t-transparent"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Performing autopsy...</h2>
              <p className="text-sm font-medium text-secondary">AI is dissecting your spending patterns</p>

              <div className="mt-10 grid grid-cols-3 gap-6 text-center max-w-lg w-full">
                {[
                  { icon: PieChart, label: "Categorizing" },
                  { icon: TrendingDown, label: "Projecting Loss" },
                  { icon: Brain, label: "AI Coaching" },
                ].map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.3 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{step.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RESULTS PHASE ── */}
          {status === "completed" && result && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Bento Grid Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Savings Score */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="relative w-28 h-28 mb-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="6" />
                      <motion.circle
                        cx="50" cy="50" r="45" fill="none" stroke="var(--accent)" strokeWidth="6"
                        strokeDasharray={`${(result.savings_score / 100) * 283} 283`}
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{ strokeDasharray: `${(result.savings_score / 100) * 283} 283` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold font-mono text-foreground">{result.savings_score}</span>
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Savings Score</h3>
                  <p className="text-[10px] text-muted">Higher = more wasteful habits detected</p>
                </div>

                {/* Money Mirror */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <BarChart3 className="w-3 h-3 text-accent" /> Money Mirror
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Monthly Waste</span>
                      <div className="text-3xl font-bold font-mono text-red-500 tracking-tighter">₹{result.monthly_waste.toLocaleString()}</div>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">5-Year Loss</span>
                      <div className="text-3xl font-bold font-mono text-red-500 tracking-tighter">₹{result.raw_5_year_loss.toLocaleString()}</div>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest">If Invested</span>
                      <div className="text-3xl font-bold font-mono text-accent tracking-tighter">₹{result.future_invested_value.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Spending Breakdown */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <PieChart className="w-3 h-3 text-accent" /> Breakdown
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(result.spending_breakdown).map(([cat, amount], i) => {
                      const total = Object.values(result.spending_breakdown).reduce((a, b) => a + b, 0);
                      const pct = Math.round((amount / total) * 100);
                      const colors = ["bg-red-500", "bg-amber-500", "bg-blue-500", "bg-purple-500", "bg-pink-500"];
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-foreground">{cat}</span>
                            <span className="text-secondary font-mono">₹{amount.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-background rounded-full overflow-hidden border border-border">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, delay: i * 0.15 }}
                              className={`h-full ${colors[i % colors.length]}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Emotional Coach */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-green-100 rounded-2xl p-8 mb-8 shadow-sm"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest mb-4">
                  <Brain className="w-3 h-3" /> AI Behavioral Coach
                </div>
                <p className="text-xl font-bold tracking-tight text-black leading-relaxed">
                  &ldquo;{result.emotional_message}&rdquo;
                </p>
                <p className="text-[10px] text-muted mt-4 uppercase tracking-widest font-bold">
                  Highest leak: {result.highest_spend_category} • Source: {dataSource === "bank" ? "Bank Connected" : "Manual Upload"}
                </p>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => { setStatus("idle"); setResult(null); setPayloadId(null); }}
                  className="flex-1 py-4 border border-border rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-surface transition-all text-secondary"
                >
                  New Analysis
                </button>
                <button
                  onClick={handleCommit}
                  className="flex-1 py-4 bg-accent text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-accent/20"
                >
                  Commit to Change <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
