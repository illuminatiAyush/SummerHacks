"use client";

import { useState } from "react";
import SubmissionView from "@/components/SubmissionView";
import GodModeDashboard from "@/components/GodModeDashboard";
import { Layers } from "lucide-react";
import { Toaster } from "sonner"; // For nice toast notifications

type TabMode = "user" | "god";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabMode>("user");
  const [activePayload, setActivePayload] = useState<string | null>(null);

  const handleSuccess = (id: string) => {
    setActivePayload(id);
    // Optionally switch tabs automatically after submission
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <Toaster theme="dark" position="bottom-right" richColors />

      {/* Header Tabs */}
      <header className="border-b border-indigo-500/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-lg">
               <Layers className="text-white" size={24} />
             </div>
             <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
               Evergreen <span className="font-light">Mantra</span>
             </h1>
          </div>
          
          <nav className="flex gap-2 p-1.5 rounded-2xl bg-[#0f1225] border border-indigo-500/10 shadow-inner">
            <button 
              onClick={() => setActiveTab("user")}
              className={`tab-pill ${activeTab === "user" ? "active" : ""}`}
            >
              1. Submission
            </button>
            <button 
               onClick={() => setActiveTab("god")}
               className={`tab-pill ${activeTab === "god" ? "active" : ""}`}
            >
              2. God Mode Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex items-start justify-center p-6">
        {activeTab === "user" && (
          <SubmissionView onSuccess={handleSuccess} />
        )}
        {activeTab === "god" && (
          <GodModeDashboard activePayloadId={activePayload} />
        )}
      </div>
    </main>
  );
}
