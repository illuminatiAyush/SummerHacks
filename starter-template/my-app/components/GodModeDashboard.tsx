"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserCircle, ArrowRight, ShieldAlert, Cpu, Link as LinkIcon, CheckCircle } from "lucide-react";

interface Props {
  activePayloadId: string | null;
}

export default function GodModeDashboard({ activePayloadId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loadingApprove, setLoadingApprove] = useState(false);

  useEffect(() => {
    if (!activePayloadId) return;
    
    // Poll for the active payload state
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/expense-analysis/status/${activePayloadId}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activePayloadId]);

  const handleApprove = async () => {
    if (!activePayloadId) return;
    setLoadingApprove(true);
    try {
      const res = await fetch(`http://localhost:8000/api/expense-analysis/approve/${activePayloadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: "approved" }),
      });
      if (res.ok) {
        toast.success("Payload Approved & Resumed");
      }
    } catch (e) {
      toast.error("Failed to approve");
    } finally {
      setLoadingApprove(false);
    }
  };

  if (!activePayloadId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Cpu className="text-gray-600 mb-4 animate-spin-slow" size={48} />
        <h3 className="text-xl font-semibold text-gray-400">No Active Pipeline</h3>
        <p className="text-sm text-gray-500 mt-2">Submit a payload to open the God Mode Console.</p>
      </div>
    );
  }

  if (!data) return <div className="text-center mt-20 animate-pulse text-indigo-400">Syncing with LangGraph...</div>;

  const panel = data?.agent_analysis?.panel || [];
  const status = data?.status;
  const isAwaitingHitl = status === "awaiting_hitl";
  const confidence = (data?.agent_analysis?.confidence_score ?? 0) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full p-4 h-[80vh]">
      {/* LEFT: Live Chatroom Trace */}
      <div className="col-span-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] pulse-live" />
            Live Agent Trace
            <span className="text-xs ml-2 px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Confidence {confidence.toFixed(1)}%
            </span>
          </h2>
        </div>

        <div className="glass-card flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          {panel.length === 0 && (
            <div className="text-center text-gray-500 my-auto">Awaiting LLM response...</div>
          )}
          {panel.map((expert: any, idx: number) => {
             const isWarning = expert.stance !== "approve";
             return (
               <div key={idx} className="chat-bubble flex gap-4 max-w-[85%] self-start">
                  <div className="mt-1">
                    <UserCircle className={isWarning ? "text-amber-400" : "text-emerald-400"} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">{expert.expert_name}</span>
                      <span className={`text-[0.7rem] uppercase px-1.5 py-0.5 rounded font-bold ${
                        isWarning ? "bg-amber-500/20 text-amber-300 border py-0.5 border-amber-500/30" 
                                  : "bg-emerald-500/20 text-emerald-300 border py-0.5 border-emerald-500/30"
                      }`}>
                        {expert.stance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{expert.reasoning}</p>
                  </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* RIGHT: HITL & Blockchain Anchor */}
      <div className="col-span-4 flex flex-col gap-6 h-full">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldAlert className="text-amber-400" />
          God Mode Controls
        </h2>

        <div className="glass-card p-6 flex flex-col gap-4">
           {isAwaitingHitl ? (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                 <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                   ⚠️ Interrupt Triggered
                 </h4>
                 <p className="text-sm text-gray-400">
                    The agent panel flagged risks or returned low confidence. A human override is required to proceed to the blockchain anchor node.
                 </p>
               </div>
               
               <button 
                 onClick={handleApprove}
                 disabled={loadingApprove}
                 className="w-full btn-glow-emerald py-4 flex justify-center items-center gap-2"
               >
                 {loadingApprove ? "Approving..." : "Approve & Anchor Hash"}
                 <ArrowRight size={20} />
               </button>
             </div>
           ) : status === "completed" ? (
             <div className="text-center py-8">
               <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
               <h3 className="text-lg font-bold text-white mb-2">Transaction Anchored</h3>
               <p className="text-sm text-gray-400">The state payload has been securely hashed to the EVM.</p>
             </div>
           ) : (
             <div className="text-center py-10 text-gray-500 italic">
               System is operating nominally. Awaiting state changes.
             </div>
           )}
        </div>

        {/* Blockchain TX Link (Dynamic) */}
        {data?.blockchain_tx && (
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center mt-auto shadow-[0_0_40px_rgba(34,211,238,0.1)]">
             <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-full mb-4">
               <LinkIcon size={24} />
             </div>
             <p className="text-sm text-gray-300 font-medium mb-4">Cryptographic proof generated.</p>
             <a 
               href={`${data?.explorer_url}${data?.blockchain_tx}`} 
               target="_blank" 
               rel="noreferrer"
               className="link-glow w-full justify-center"
             >
               Verify Explorer <ArrowRight size={16} />
             </a>
             <p className="text-[0.65rem] font-mono text-gray-500 mt-4 break-all px-4">
               {data?.blockchain_tx}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
