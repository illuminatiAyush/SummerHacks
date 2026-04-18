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
        <h1 className="text-4xl font-bold text-black tracking-tight mb-2">Protocol Deployment</h1>
        <p className="text-gray-500 font-medium">Configure and anchor your behavioral contract.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
            <h2 className="text-xl font-bold text-black mb-6 tracking-tight">Active Strategy</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Target Reduction</label>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-black font-bold font-sans text-xl">40%</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Protocol Duration</label>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-black font-bold font-sans text-xl">30 Days</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Constraint Description</label>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-600 text-sm font-medium leading-relaxed">
                  Restrict all "Food Delivery" and "Spontaneous Dining" transactions to zero except for Saturday evening buffer. 
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
             <h2 className="text-xl font-bold text-black mb-6 tracking-tight">System Compliance</h2>
             <div className="space-y-4">
                <ComplianceItem icon={<Clock className="w-4 h-4 text-green-600" />} label="Telemetry Check: Every 24h" />
                <ComplianceItem icon={<Target className="w-4 h-4 text-green-600" />} label="Failure Threshold: 2 Transactions" />
                <ComplianceItem icon={<Lock className="w-4 h-4 text-green-600" />} label="Escrow Multiplier: 1.5x" />
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-green-600/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-600" />
            <div className="text-center mb-6">
               <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-lg font-bold text-black uppercase tracking-tight">Secure Stake</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Status: Ready to Lock</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-6">
               <div className="text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Escrow Amount</span>
                  <span className="text-4xl font-bold text-black font-sans">0.05 <span className="text-lg text-gray-400">ETH</span></span>
               </div>
            </div>

            <button 
              onClick={() => setLocked(true)}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 ${locked ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
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

          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
             <div className="flex items-center gap-2 text-red-600 mb-4 font-bold text-[10px] uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" /> Risk Assessment
             </div>
             <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-wider">
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
    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl group transition-colors hover:border-green-600/30">
       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:border-green-600/20">
          {icon}
       </div>
       <span className="text-[10px] font-bold text-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
