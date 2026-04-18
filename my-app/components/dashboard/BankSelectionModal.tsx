"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Landmark, ShieldCheck, ChevronRight } from "lucide-react";
import Image from "next/image";

interface BankSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHDFC: () => void;
}

export default function BankSelectionModal({
  isOpen,
  onClose,
  onSelectHDFC,
}: BankSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-[#222222] flex justify-between items-center bg-gray-50/50 dark:bg-[#151515]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white leading-tight">Secure Connection</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  <span>RBI Account Aggregator</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#222222] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Select your primary bank. We securely fetch your last 30 days of transactions for the autopsy.
            </p>

            <div className="space-y-3">
              <button
                onClick={onSelectHDFC}
                className="w-full relative overflow-hidden group flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 dark:border-[#222222] hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#004C8F] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden">
                    <Image src="/logos/hdfc.png" alt="HDFC" width={48} height={48} className="object-contain w-full h-full p-2 bg-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">HDFC Bank</div>
                    <div className="text-xs text-gray-500 font-medium">Savings Account</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </button>

              <div className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-[#222222] opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-[#333333] rounded-lg" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Other Banks</div>
                    <div className="text-xs text-gray-500 font-medium">Coming Soon</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
               <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Encrypted & Read-Only</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
