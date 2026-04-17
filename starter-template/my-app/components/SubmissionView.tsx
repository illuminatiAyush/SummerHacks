"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { toast } from "sonner";
import { useAnalysisStore } from "@/stores/useAnalysisStore";

interface Props {
  onSuccess: (data: any) => void;
}

export default function SubmissionView({ onSuccess }: Props) {
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusId, setStatusId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  const { selectedGoal, stipend } = useAnalysisStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setLoading(true);
    setStatusMsg("Initializing Multi-Agent Analysis...");

    try {
      const res = await fetch("http://localhost:8000/api/expense-analysis/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          raw_input: inputVal,
          goal: selectedGoal || "Financial Freedom",
          stipend: stipend || 50000
        }),
      });

      if (!res.ok) throw new Error("Submission Failed");

      const data = await res.json();
      setStatusId(data.payload_id);
    } catch (err: any) {
      toast.error(err.message || "Failed to connect to backend");
      setLoading(false);
    }
  };

  // Poll for status
  useEffect(() => {
    if (!statusId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/expense-analysis/status/${statusId}`);
        const data = await res.json();

        if (data.status === "completed") {
          clearInterval(interval);
          setStatusMsg("Anchored to Blockchain 🔒");
          toast.success("Transaction Confirmed");
          setLoading(false);
          onSuccess(data);
        } else if (data.status === "awaiting_hitl") {
          setStatusMsg("Standing by for Human-in-the-Loop review...");
        } else if (data.status === "error") {
          clearInterval(interval);
          setStatusMsg("Pipeline Error");
          toast.error("An error occurred during analysis");
          setLoading(false);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [statusId, onSuccess]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-20 p-8 glass-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Trust · Verify · Act</h2>
          <p className="text-sm text-gray-400">Submit payload for multi-agent cryptographic anchoring.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <textarea
          className="input-dark w-full p-4 min-h-[160px] text-lg resize-none"
          placeholder="Enter the critical payload or smart contract bytecode that requires multi-agent verification..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {loading && (
              <>
                <Loader2 className="animate-spin text-indigo-400" size={20} />
                <span className="text-sm font-medium text-indigo-300 animate-pulse">{statusMsg}</span>
              </>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="btn-glow-emerald flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Initiate Protocol"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}
