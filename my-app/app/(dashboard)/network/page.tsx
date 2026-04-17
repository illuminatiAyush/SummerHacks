"use client";

import { Filter, ArrowUpRight, Flame, Shield, Activity } from "lucide-react";

export default function NetworkPage() {
  const users = [
    { rank: 1, address: "0x4...A1", score: 98, saved: "₹12.4k", streak: 45 },
    { rank: 2, address: "0x9...B2", score: 94, saved: "₹9.1k", streak: 32 },
    { rank: 3, address: "0x1...C8", score: 91, saved: "₹8.5k", streak: 28 },
    { rank: 4, address: "0x7...E4", score: 88, saved: "₹6.2k", streak: 21 },
    { rank: 5, address: "0xF...D9", score: 85, saved: "₹5.8k", streak: 19 },
    { rank: 6, address: "0x2...F1", score: 82, saved: "₹4.1k", streak: 14 },
    { rank: 7, address: "0x8...A3", score: 79, saved: "₹3.5k", streak: 9 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Network Ranking</h1>
          <p className="text-secondary font-medium">Global behavioral discipline telemetry.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-surface border border-border text-secondary font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 hover:text-foreground hover:border-accent/30 transition-all">
            <Filter className="w-4 h-4" /> Global Filter
          </button>
          <button className="px-5 py-2.5 bg-accent border border-transparent text-background font-bold text-xs uppercase tracking-widest rounded-lg transition-all">
            30 Day Cycle
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="p-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Rank</th>
                <th className="p-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Validated Entity</th>
                <th className="p-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">S-Score</th>
                <th className="p-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Retained</th>
                <th className="p-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-right">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.rank} className="hover:bg-background transition-colors group cursor-pointer">
                  <td className="p-6">
                    <span className={`text-sm font-bold font-mono ${user.rank <= 3 ? 'text-accent' : 'text-secondary'}`}>
                      #{user.rank.toString().padStart(2, '0')}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
                        <Shield className={`w-4 h-4 ${user.rank <= 3 ? 'text-accent' : 'text-secondary/50'}`} />
                      </div>
                      <span className="font-mono text-xs font-bold text-foreground tracking-widest">{user.address}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-accent w-6 font-mono">{user.score}</span>
                      <div className="w-32 h-1 bg-background rounded-full overflow-hidden border border-border">
                        <div className="h-full bg-accent" style={{ width: `${user.score}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-sm text-foreground font-mono font-bold">{user.saved}</span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-background border border-border rounded-md">
                        <span className="text-xs text-orange-500 font-mono font-bold leading-none">{user.streak}</span>
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-foreground transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-4 p-8 bg-surface border border-border rounded-2xl">
         <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
            <Activity className="w-8 h-8 text-accent" />
         </div>
         <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">Network Integrity</h4>
            <p className="text-xs font-medium text-secondary leading-relaxed max-w-2xl">
              All entities shown have cleared biometric and transaction telemetry verification for the current 30-day cycle. Data is strictly immutable once finalized on-protocol.
            </p>
         </div>
      </div>
    </div>
  );
}
