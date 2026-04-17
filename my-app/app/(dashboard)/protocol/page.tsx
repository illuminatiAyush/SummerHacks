"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Target, 
  AlertTriangle, 
  ChevronRight,
  Clock,
  Zap,
  Lock
} from "lucide-react";

export default function ProtocolPage() {
  const [locked, setLocked] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 font-sans">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Protocol Deployment</h1>
        <p className="text-secondary font-medium">Configure and anchor your behavioral contract.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">Active Strategy</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary">Target Reduction</label>
                  <div className="bg-background border border-border rounded-xl p-4 text-foreground font-bold font-mono text-xl">40%</div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary">Protocol Duration</label>
                  <div className="bg-background border border-border rounded-xl p-4 text-foreground font-bold font-mono text-xl">30 Days</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary">Constraint Description</label>
                <div className="bg-background border border-border rounded-xl p-4 text-secondary text-sm font-medium leading-relaxed">
                  Restrict all "Food Delivery" and "Spontaneous Dining" transactions to zero except for Saturday evening buffer. 
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
             <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">System Compliance</h2>
             <div className="space-y-4">
                <ComplianceItem icon={<Clock className="w-4 h-4 text-accent" />} label="Telemetry Check: Every 24h" />
                <ComplianceItem icon={<Target className="w-4 h-4 text-accent" />} label="Failure Threshold: 2 Transactions" />
                <ComplianceItem icon={<Lock className="w-4 h-4 text-accent" />} label="Escrow Multiplier: 1.5x" />
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-accent/20 rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
               <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/20">
                  <ShieldCheck className="w-8 h-8 text-accent" />
               </div>
               <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">Secure Stake</h3>
               <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Status: Ready to Lock</p>
            </div>

            <div className="bg-background border border-border rounded-xl p-6 mb-6">
               <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary block mb-2">Escrow Amount</span>
                  <span className="text-4xl font-bold text-foreground font-mono">0.05 <span className="text-lg text-secondary">ETH</span></span>
               </div>
            </div>

            <button 
              onClick={() => setLocked(true)}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 ${locked ? 'bg-border text-secondary cursor-not-allowed' : 'bg-accent text-background hover:bg-accent/90'}`}
              disabled={locked}
            >
              {locked ? (
                <>
                  <Lock className="w-4 h-4" /> Stake Anchored
                </>
              ) : (
                <>
                  Lock Protocol <Zap className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
             <div className="flex items-center gap-2 text-red-500 mb-4 font-bold text-xs uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" /> Risk Assessment
             </div>
             <p className="text-xs font-bold text-secondary leading-relaxed uppercase tracking-wider">
                If the protocol is bridged and telemetry confirms failure, the stake will be burnt. There is no mechanism for appeal.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComplianceItem({ icon, label }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl">
       <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border">
          {icon}
       </div>
       <span className="text-sm font-bold text-foreground uppercase tracking-wider">{label}</span>
    </div>
  );
}
