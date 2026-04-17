"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  value: string;
  onChange: (val: string) => void;
  onComplete: () => void;
  disabled?: boolean;
}

export default function OTPInput({ value, onChange, onComplete, disabled }: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Basic implementation of WebOTP API for automatic SMS retrieval
    if ("OTPCredential" in window) {
      const abortController = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: abortController.signal,
        } as any)
        .then((credential: any) => {
          if (credential && credential.code) {
            onChange(credential.code);
            // Small delay to allow react to update the state before simulating complete
            setTimeout(onComplete, 100);
          }
        })
        .catch((err) => {
          console.log("WebOTP lookup error: ", err);
        });

      return () => {
        abortController.abort();
      };
    }
  }, [onChange, onComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
    if (!val) return;

    const newVal = value.split("");
    newVal[index] = val;
    const computedVal = newVal.join("");
    onChange(computedVal);

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (computedVal.length === 6) {
      setTimeout(onComplete, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newVal = value.split("");
      if (!newVal[index] && index > 0) {
        // current empty, focus previous and clear it
        newVal[index - 1] = "";
        inputsRef.current[index - 1]?.focus();
      } else {
        newVal[index] = "";
      }
      onChange(newVal.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pasted.length > 0) {
      onChange(pasted);
      if (pasted.length === 6) {
        setTimeout(onComplete, 50);
      }
    }
  };

  // Ensure val maps visually correctly
  const digitArr = value.split("");

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1AA] mb-4 text-center">
        Enter Security Code
      </label>
      <div 
        className="flex justify-center gap-2 sm:gap-4"
        onPaste={handlePaste}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.input
            key={i}
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            ref={(el) => {
              if (el) inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            value={digitArr[i] || ""}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center bg-[#000000] border border-[#1F1F1F] rounded-xl text-white font-bold text-xl focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] caret-[#22C55E] transition-colors disabled:opacity-50"
          />
        ))}
      </div>
    </div>
  );
}
