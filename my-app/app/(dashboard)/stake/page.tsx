"use client";

import { Wallet, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function StakePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-sans">Stake</h1>
        <p className="text-secondary mt-1">Manage protocol escrow and locked capital.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
         <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border mb-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-accent" />
               </div>
               <div>
                  <div className="text-sm font-bold text-foreground uppercase tracking-wider">Connected Wallet</div>
                  <div className="text-xs font-mono text-secondary">0x87A...3F9A</div>
               </div>
            </div>
            <button className="px-4 py-2 bg-border text-foreground text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-surface transition-colors">
              Disconnect
            </button>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-5 border border-border rounded-lg bg-background">
               <div className="text-xs uppercase text-secondary font-bold mb-2 tracking-wider">Locked Capital</div>
               <div className="text-3xl font-bold text-foreground font-mono">0.05 ETH</div>
            </div>
            <div className="p-5 border border-border rounded-lg bg-background">
               <div className="text-xs uppercase text-secondary font-bold mb-2 tracking-wider">Status</div>
               <div className="text-xl font-bold text-accent flex items-center gap-2 h-9">
                 <CheckCircle2 className="w-5 h-5" /> Active Protocol
               </div>
            </div>
         </div>

         <div className="pt-6 border-t border-border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Escrow Logistics</h3>
            <ul className="space-y-4 text-sm text-secondary font-medium leading-relaxed">
               <li className="flex items-start gap-3">
                 <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                 If telemetry data proves habit failure, mapped stake is sent to burn address immediately.
               </li>
               <li className="flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                 Upon successful 30-day clearing, stake is returned to your 0x87A...3F9A wallet minus standard gas fees.
               </li>
            </ul>
         </div>
      </div>
    </div>
  );
}
