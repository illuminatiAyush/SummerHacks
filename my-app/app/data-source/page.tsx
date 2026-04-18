"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Landmark, ArrowRight, Shield, Zap, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { BANKS } from "@/lib/banks";

export default function DataSourcePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"upload" | "bank" | null>(null);
  const [selectedBank, setSelectedBank] = useState<typeof BANKS[0] | null>(null);

  const handleContinue = () => {
    if (selected === "upload") {
      localStorage.setItem("ea_data_source", "upload");
      router.push("/analysis");
    } else if (selected === "bank") {
      localStorage.setItem("ea_data_source", "bank");
      // For now, redirect to analysis with a mock AA flow
      router.push("/analysis");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-3xl mx-auto px-6 pt-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-2 inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase font-bold tracking-widest rounded-full">
            <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 animate-pulse" />
            Data Acquisition
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-black">
            Choose your data source.
          </h1>
          <p className="text-lg text-gray-500 font-medium mb-12">
            We need your transaction data to perform a financial autopsy. Choose the method that works best.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Option B: Connect Bank — PRIMARY */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setSelected("bank")}
            className={`relative p-8 rounded-2xl border-2 text-left transition-all group overflow-hidden ${
              selected === "bank"
                ? "border-green-600 bg-green-50 shadow-xl"
                : "border-gray-200 bg-white hover:border-green-400 shadow-sm"
            }`}
          >
            {/* Recommended badge */}
            <div className="absolute top-4 right-4 px-2.5 py-1 bg-accent text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
              Recommended
            </div>

            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border transition-colors ${
              selected === "bank" ? "bg-accent/10 border-accent/30" : "bg-background border-border"
            }`}>
              <Landmark className={`w-7 h-7 ${selected === "bank" ? "text-accent" : "text-foreground"}`} />
            </div>

            <h3 className="text-xl font-bold mb-2 text-black tracking-tight">Connect Bank</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
              Zero-touch data fetch via Account Aggregator (Setu AA). Your bank data is pulled automatically — no manual work.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest">
                <Zap className="w-3 h-3" /> Automatic • Real-time
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
                <Shield className="w-3 h-3" /> RBI-compliant consent flow
              </div>
            </div>

            {selected === "bank" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 border-t pt-4">
                 <div className="space-y-3">
                    {BANKS.map((bank) => (
                      <div
                        key={bank.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedBank(bank); }}
                        className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all ${
                          selectedBank?.id === bank.id ? "border-green-500 bg-green-50 shadow-sm" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={bank.logo}
                          alt={bank.name}
                          width={32}
                          height={32}
                          className="rounded-md object-contain bg-white p-1 shadow-sm"
                        />
                        <span className="font-medium text-black">{bank.name}</span>
                        {selectedBank?.id === bank.id && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
                      </div>
                    ))}
                  </div>

                  {selectedBank && (
                    <div className="flex items-center gap-2 mt-4">
                      <Image
                        src={selectedBank.logo}
                        alt={selectedBank.name}
                        width={24}
                        height={24}
                      />
                      <span className="text-sm text-gray-700">
                        Connected to {selectedBank.name}
                      </span>
                    </div>
                  )}
              </motion.div>
            )}
          </motion.button>

          {/* Option A: Upload Statement */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setSelected("upload")}
            className={`relative p-8 rounded-2xl border-2 text-left transition-all group ${
              selected === "upload"
                ? "border-green-600 bg-green-50 shadow-xl"
                : "border-gray-200 bg-white hover:border-green-400 shadow-sm"
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border transition-colors ${
              selected === "upload" ? "bg-accent/10 border-accent/30" : "bg-background border-border"
            }`}>
              <Upload className={`w-7 h-7 ${selected === "upload" ? "text-accent" : "text-foreground"}`} />
            </div>

            <h3 className="text-xl font-bold mb-2 text-black tracking-tight">Upload Statement</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
              Upload a bank statement (PDF/CSV/image) or paste your transaction text manually. Works with any bank.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
                <Upload className="w-3 h-3" /> PDF • CSV • Image • Text
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
                <Shield className="w-3 h-3" /> Data stays on your device
              </div>
            </div>

            {selected === "upload" && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-4 right-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </motion.div>
            )}
          </motion.button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected || (selected === "bank" && !selectedBank)}
          className="w-full py-4 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Continue to Analysis <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
