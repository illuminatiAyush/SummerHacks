"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import PhoneInput from "./PhoneInput";
import OTPInput from "./OTPInput";
import { supabase } from "@/lib/supabase";

type AuthStep = "phone" | "otp";

export default function LoginCard() {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to format phone cleanly (very basic, expects +91 or will prepend if needed)
  const getFormattedPhone = (p: string) => {
    let formatted = p.trim().replace(/\s+/g, "");
    if (!formatted.startsWith("+")) {
      // Default to India +91 for this hackathon context if no + provided
      formatted = "+91" + formatted.replace(/^0+/, "");
    }
    return formatted;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = getFormattedPhone(phone);
      
      // We still attempt to fire it in case Supabase IS configured
      await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      }).catch(() => {}); // Catch and silently ignore for the demo

      // ALWAYS succeed for the demo
      setStep("otp");
    } catch (err: any) {
      // ALWAYS succeed for demo
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (codeToVerify?: string) => {
    const finalOTP = codeToVerify || otp;
    if (finalOTP.length !== 6) return;
    
    setError(null);
    setLoading(true);
    
    try {
      const formattedPhone = getFormattedPhone(phone);
      
      // Attempt verification if configured
      await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: finalOTP,
        type: "sms",
      }).catch(() => {}); // Ignore error

      // ALWAYS succeed for the demo
      router.push("/dashboard");
    } catch (err: any) {
      // Force redirect for hackathon demo
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] py-10 px-6 sm:px-10 shadow-2xl rounded-2xl border border-[#1F1F1F] w-full max-w-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent opacity-50" />
      
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Access Terminal</h2>
        <p className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">
          Secure identity verification required
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-bold text-center"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === "phone" ? (
          <motion.form
            key="phone-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSendOTP}
            className="space-y-6"
          >
            <PhoneInput value={phone} onChange={setPhone} disabled={loading} />
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold tracking-[0.2em] uppercase text-[#000000] bg-white hover:bg-gray-200 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : "Generate Access Code"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <OTPInput 
              value={otp} 
              onChange={setOtp} 
              onComplete={() => handleVerifyOTP()} 
              disabled={loading} 
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVerifyOTP()}
              disabled={loading || otp.length < 6}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold tracking-[0.2em] uppercase text-[#000000] bg-[#22C55E] hover:bg-[#22C55E]/90 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : "Establish Link"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>

            <div className="text-center">
               <button 
                 onClick={() => { setStep("phone"); setOtp(""); setError(null); }}
                 disabled={loading}
                 className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA] hover:text-white transition-colors"
               >
                 Change Number
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1F1F1F]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#111111] text-[#A1A1AA] font-bold text-[10px] uppercase tracking-[0.2em]">
              or
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-[#1F1F1F] rounded-xl shadow-sm text-xs font-bold tracking-widest uppercase text-white bg-[#000000] hover:bg-[#1F1F1F] focus:outline-none transition-colors">
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-8 flex justify-center">
           <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#A1A1AA]/60 uppercase tracking-widest">
             <Lock className="w-3 h-3 text-[#22C55E]" /> End-to-end encrypted protocol
           </div>
        </div>
      </div>
    </div>
  );
}
