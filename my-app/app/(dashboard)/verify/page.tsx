"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, Loader2, ShieldCheck, Flame, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{
    message: string;
    streak_updated: number;
    new_savings_score: number;
  } | null>(null);

  const simulateMonth2Upload = async () => {
    setStatus("uploading");
    setErrorMsg("");
    
    // Fake upload delay
    setTimeout(async () => {
      setStatus("analyzing");
      
      try {
        const dummy_user_id = '00000000-0000-0000-0000-000000000000';
        const raw_text = "MONTH_2_DUMMY_STATEMENT...";
        
        const res = await axios.post("http://127.0.0.1:8001/api/verify/submit", {
          user_id: dummy_user_id,
          month_2_raw_text: raw_text
        });

        if (res.data.success) {
          setResult({
            message: res.data.message,
            streak_updated: res.data.streak_updated,
            new_savings_score: res.data.new_savings_score
          });
          setStatus("success");
        } else {
          console.warn('[Verification Node] Failed to locate active challenge to unlock');
          setErrorMsg(res.data.message || "Failed verifying challenge.");
          setStatus("error");
        }
      } catch (err: any) {
        if (err.response) {
          setErrorMsg(err.response.data.detail || "Server verification error");
        } else if (err.request) {
          setErrorMsg("Backend unreachable at :8001");
        } else {
          setErrorMsg(err.message);
        }
        setStatus("error");
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 font-sans mt-12 px-4">
      <AnimatePresence mode="wait">
        
        {(status === "idle" || status === "error") && (
          <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="mb-2 inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase font-bold tracking-widest rounded-full">
              <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 animate-pulse" />
              Month 2 Telemetry
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Verification Node</h1>
            <p className="text-lg text-secondary font-medium mb-10 max-w-xl">
              Time to prove you changed. Upload your Month 2 statement to verify your spending reduction and unlock your Escrow.
            </p>

            <div 
              onClick={simulateMonth2Upload}
              className="bg-surface border-2 border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="w-16 h-16 bg-background border border-border flex items-center justify-center rounded-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-secondary group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Click to Simulate Month 2 Upload</h3>
              <p className="text-sm font-medium text-secondary text-center max-w-sm">
                (For demo purposes, this explicitly uploads a statement proving a &gt;30% reduction)
              </p>
            </div>

            {errorMsg && (
              <div className="mt-8 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-bold">
                <AlertTriangle className="w-5 h-5 shrink-0" /> {errorMsg}
              </div>
            )}
          </motion.div>
        )}

        {(status === "uploading" || status === "analyzing") && (
          <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative w-24 h-24 mb-8">
              <motion.div
                className="absolute inset-0 border-4 border-accent/20 border-r-accent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {status === "uploading" ? <FileText className="w-8 h-8 text-accent animate-pulse" /> : <Loader2 className="w-8 h-8 text-accent animate-spin" />}
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              {status === "uploading" ? "Encrypting Statement..." : "Performing Behavioral Validation..."}
            </h2>
            <p className="text-secondary font-medium">
              {status === "uploading" ? "Securing payload before transmission" : "Running multi-agent analysis on new spending patterns"}
            </p>
          </motion.div>
        )}

        {status === "success" && result && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-24 h-24 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-20"></div>
                <ShieldCheck className="w-12 h-12 text-accent relative z-10" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 text-foreground">Escrow Unlocked.</h1>
            <p className="text-lg text-secondary font-medium mb-12 max-w-lg mx-auto">
              {result.message}
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center max-w-2xl mx-auto mb-16">
              
              <div className="bg-surface border border-border rounded-xl p-6 text-left w-full md:w-1/2 flex items-center gap-4 premium-card">
                  <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">New Streak Built</div>
                      <div className="font-mono text-2xl text-foreground font-bold">{result.streak_updated} Days</div>
                  </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6 text-left w-full md:w-1/2 flex items-center gap-4 premium-card">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Savings Score</div>
                      <div className="font-mono text-2xl text-accent font-bold">{result.new_savings_score}/100</div>
                  </div>
              </div>

            </div>

            <button
              onClick={() => router.push("/network")}
              className="py-4 px-12 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Verify Position in Network <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
