"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Receipt, TrendingDown, Calendar, Package } from "lucide-react";

interface Transaction {
  merchant: string;
  amount: number;
  date: string;
}

interface TransactionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transactions: Transaction[]) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Swiggy": "🍔",
  "Zomato": "🍕",
  "Amazon": "📦",
  "Flipkart": "🛒",
  "Uber": "🚗",
  "Rapido": "🛵",
  "Netflix": "🎬",
  "Spotify": "🎵",
  "Starbucks": "☕",
  "Myntra": "👗",
  "Blinkit": "⚡",
  "Zepto": "🥦",
};

export default function TransactionPreviewModal({
  isOpen,
  onClose,
  onConfirm,
}: TransactionPreviewModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    fetch("/sample.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load transactions");
        return res.json();
      })
      .then((data: Transaction[]) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[TransactionPreview] Failed to load sample.json:", err);
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSpend = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const uniqueMerchants = new Set(transactions.map((tx) => tx.merchant)).size;
  const dateRange =
    transactions.length > 0
      ? `${transactions[0].date.slice(5)} — ${transactions[transactions.length - 1].date.slice(5)}`
      : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-[#1F1F1F] flex items-start justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-widest">
                      RBI Account Aggregator
                    </span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Transactions Retrieved
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-[#A1A1AA] mt-1">
                    {transactions.length} transactions from your linked bank account
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 border-b border-gray-100 dark:border-[#1F1F1F] shrink-0">
                <div className="p-4 text-center border-r border-gray-100 dark:border-[#1F1F1F]">
                  <div className="text-xs text-gray-500 dark:text-[#A1A1AA] font-bold uppercase tracking-widest mb-1">
                    Total
                  </div>
                  <div className="text-lg font-bold font-mono text-red-500">
                    ₹{totalSpend.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 text-center border-r border-gray-100 dark:border-[#1F1F1F]">
                  <div className="text-xs text-gray-500 dark:text-[#A1A1AA] font-bold uppercase tracking-widest mb-1">
                    Merchants
                  </div>
                  <div className="text-lg font-bold font-mono text-gray-900 dark:text-white">
                    {uniqueMerchants}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-xs text-gray-500 dark:text-[#A1A1AA] font-bold uppercase tracking-widest mb-1">
                    Period
                  </div>
                  <div className="text-lg font-bold font-mono text-gray-900 dark:text-white">
                    {dateRange}
                  </div>
                </div>
              </div>

              {/* Transaction List */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-[#1A1A1A]">
                    {transactions.map((tx, i) => (
                      <motion.div
                        key={`${tx.merchant}-${tx.date}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {CATEGORY_ICONS[tx.merchant] || "💳"}
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {tx.merchant}
                            </div>
                            <div className="text-[10px] font-mono text-gray-400 dark:text-[#555]">
                              {tx.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold font-mono text-red-500">
                          −₹{tx.amount.toLocaleString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="p-6 border-t border-gray-100 dark:border-[#1F1F1F] shrink-0">
                <button
                  onClick={() => onConfirm(transactions)}
                  disabled={loading || transactions.length === 0}
                  className="w-full py-4 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <TrendingDown className="w-4 h-4" />
                  Run Full Autopsy
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-gray-400 dark:text-[#555] mt-3 font-medium">
                  AI will analyze your spending patterns and generate personalized insights
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
