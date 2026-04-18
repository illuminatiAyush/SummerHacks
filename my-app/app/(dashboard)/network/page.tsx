"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Trophy, 
  TrendingUp, 
  Zap,
  ArrowUpRight,
  MessageSquare,
  Shield,
  Sparkles
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

import { useDashboardStore } from "@/lib/store/useDashboardStore";

export default function NetworkPage() {
  const [userGoal, setUserGoal] = useState("Financial Freedom");
  const [txHash, setTxHash] = useState("");
  const { isDemoMode } = useAppStore();
  const { savingsScore } = useDashboardStore();
  const [users, setUsers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserGoal(localStorage.getItem("ea_financial_goal") || "Financial Freedom");
      const analysis = JSON.parse(localStorage.getItem("ea_analysis") || "{}");
      if (analysis.blockchain_tx) setTxHash(analysis.blockchain_tx);
    }
    
    const fetchNetworkData = async () => {
      try {
        const uRes = await fetch("/api/leaderboard");
        const aRes = await fetch("/api/leaderboard/activity");
        if (uRes.ok) setUsers(await uRes.json());
        if (aRes.ok) setActivities(await aRes.json());
      } catch (err) {
        console.error("Failed to fetch network data", err);
      }
    };
    
    fetchNetworkData();
  }, []);

  const leaderboard = useMemo(() => {
    const current = {
      id: "me",
      name: "You",
      progress_to_goal: savingsScore || 0,
      status: savingsScore > 0 ? "Current Analysis" : "Run your first analysis to enter the leaderboard",
      isCurrentUser: true,
    };
    
    if (savingsScore === 0) {
      return [...users, current];
    }
    
    return [...users, current].sort((a, b) => b.progress_to_goal - a.progress_to_goal);
  }, [users, savingsScore]);

  const getLabel = (progress: number) => {
    if (progress > 80) return "🔥 Top Performer";
    if (progress > 60) return "⚡ Catching Up";
    if (progress > 30) return "🧠 Improving";
    if (progress === 0) return "⚠️ Unverified";
    return "🚨 Needs Discipline";
  };


  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="mb-2 inline-flex items-center px-3 py-1 bg-green-50 text-green-600 text-[10px] uppercase font-bold tracking-widest rounded-full border border-green-100">
            <Users className="w-3 h-3 mr-2" /> Global Discipline Network
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-black">Community Protocol</h1>
          <p className="text-gray-500 mt-2 font-medium">You've joined the <strong>{userGoal}</strong> community. Stay disciplined.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-2 bg-green-50 rounded-lg border border-green-100">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {isDemoMode ? "Simulation Status" : "Your Status"}
              </div>
              <div className="text-sm font-bold text-black">
                {isDemoMode ? "Mock Escrow Active" : "Locked in Escrow"}
              </div>
              {txHash && (
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[9px] font-mono text-green-600 font-bold hover:underline flex items-center gap-1 mt-1"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)} <ArrowUpRight className="w-2 h-2" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Avg Progress</p>
          <p className="text-3xl font-bold mt-2 text-black">56%</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Trophy className="w-4 h-4 text-orange-500" /> Top Streak</p>
          <p className="text-3xl font-bold mt-2 text-black">14 Days</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Active Users</p>
          <p className="text-3xl font-bold mt-2 text-black">128</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Leaderboard Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Trophy className="w-32 h-32" />
            </div>
            
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-600" /> Goal Leaderboard: {userGoal}
            </h3>

            {leaderboard.length > 0 && savingsScore > 0 && leaderboard[0].id !== "me" && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-sm font-bold text-orange-900">Psychology Trigger</div>
                  <div className="text-[10px] text-orange-700 uppercase tracking-widest font-bold mt-1">You are {leaderboard[0].progress_to_goal - savingsScore}% behind the top performer in this cohort.</div>
                </div>
                <TrendingUp className="text-orange-400 w-6 h-6" />
              </div>
            )}

            <div className="space-y-4">
              {leaderboard.map((user, i) => (
                  <motion.div 
                    key={user.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md group shadow-sm ${
                      user.isCurrentUser ? "bg-green-50 border border-green-500 ring-2 ring-green-600/10" : "bg-white border border-gray-100 hover:border-green-200"
                    }`}
                  >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ${
                      user.isCurrentUser ? "bg-green-600 text-white ring-4 ring-green-100" : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${user.isCurrentUser ? "text-green-800" : "text-gray-900"}`}>
                        {user.name} 
                        {user.isCurrentUser && <span className="text-[10px] bg-green-200 text-green-800 px-1.5 py-0.5 rounded ml-2 shadow-sm border border-green-300">YOU (Rank #{i + 1})</span>}
                      </div>
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1 flex items-center gap-2">
                        <span>{user.isCurrentUser && savingsScore === 0 ? user.status : getLabel(user.progress_to_goal)}</span>
                        {!user.isCurrentUser && <span className="opacity-60 normal-case hidden sm:inline">• {user.progress_to_goal < leaderboard[0].progress_to_goal ? `${leaderboard[0].progress_to_goal - user.progress_to_goal}% behind leader` : "Top Leader"}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-1/3 justify-end">
                    <div className="hidden md:block w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div 
                        style={{ width: `${user.progress_to_goal}%` }}
                        className="h-full bg-green-500 rounded transition-all duration-1000 ease-out"
                      />
                    </div>
                    <div className={`text-xs font-bold w-8 text-right ${user.isCurrentUser ? "text-green-600" : "text-black"}`}>
                      {user.progress_to_goal}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Notifications Feed */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" /> Live Activity
            </h3>
            
            <div className="space-y-6">
              {activities.length > 0 ? (
                activities.map((act, i) => (
                  <div key={i} className="flex flex-col gap-1 border-l-2 border-green-600/20 pl-4 py-1 relative">
                    <div className="absolute w-2 h-2 rounded-full bg-green-500 -left-[5px] top-1.5" />
                    <div className="text-xs text-foreground font-medium">
                      <span className="font-bold">{act.user}</span> {act.action}
                    </div>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{act.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-xs font-medium italic">No recent activity — system initializing...</div>
              )}
            </div>
          </div>

          {/* Your Rank Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
            <p className="text-sm font-bold text-gray-500 mb-3">Your Cohort Rank</p>
            <div className="text-5xl font-black text-black">#{leaderboard.findIndex(u => u.id === "me") + 1}</div>
            <p className="text-xs text-gray-400 mt-3 font-semibold uppercase tracking-widest">Out of 128 active users</p>
          </div>

          {/* Weekly Challenge */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow cursor-default">
             <Sparkles className="w-32 h-32 text-green-200 absolute -bottom-8 -right-8 opacity-50 group-hover:scale-110 transition-transform duration-700" />
             <div className="relative z-10">
               <p className="text-sm font-bold text-green-900 flex items-center gap-2">🔥 Weekly Challenge</p>
               <p className="text-sm text-green-800 font-medium leading-relaxed mt-2">
                 Maintain a 7-day no-Swiggy streak.
               </p>
               <div className="mt-5 inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-white bg-green-600 px-3 py-1.5 rounded-full shadow-sm">
                 Reward: Epic NFT Badge
               </div>
             </div>
          </div>

          {/* Social Proof Stats */}
          <div className="bg-foreground text-background rounded-2xl p-8 shadow-xl">
             <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Protocol Stats</span>
             </div>
             <div className="space-y-4">
               <div>
                 <div className="text-3xl font-bold tracking-tighter">₹4.2L+</div>
                 <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Total Community Savings</div>
               </div>
               <div className="h-px bg-background/10" />
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Active Stakers</span>
                 <span className="text-lg font-bold">1,204</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
