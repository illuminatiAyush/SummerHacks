"use client";

import { User, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-sans">Settings</h1>
        <p className="text-secondary mt-1">System configuration.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
         <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center">
               <User className="w-8 h-8 text-secondary" />
            </div>
            <div>
               <div className="text-lg font-bold text-foreground tracking-wide">Protocol Founder</div>
               <div className="text-sm font-mono text-secondary">founder@protocol.com</div>
            </div>
         </div>

         <div className="space-y-6">
            <div>
               <label className="block text-xs uppercase font-bold tracking-wider text-secondary mb-2">Full Name</label>
               <input type="text" defaultValue="Protocol Founder" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground text-sm font-bold focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
               <label className="block text-xs uppercase font-bold tracking-wider text-secondary mb-2">Primary Wallet Address</label>
               <input type="text" defaultValue="0x87A3E92B4F...3F9A" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-secondary font-mono text-sm focus:outline-none transition-colors cursor-not-allowed" disabled />
            </div>
         </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
         <div className="flex items-center gap-2 mb-6 text-secondary text-sm uppercase tracking-wider font-semibold">
            <Shield className="w-4 h-4" /> Data & Security
         </div>
         <div className="space-y-4">
            <button className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-surface transition-colors text-left flex justify-between items-center">
               <span>Export Telemetry Data</span>
               <span className="text-secondary font-mono text-xs">JSON</span>
            </button>
            <button className="w-full px-4 py-3 border border-red-500/20 bg-red-500/5 text-red-500 text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-red-500/10 transition-colors text-left">
              Delete Account & Halt Protocols
            </button>
         </div>
      </div>
    </div>
  );
}
