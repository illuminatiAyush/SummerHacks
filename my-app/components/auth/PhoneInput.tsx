"use client";

import { Phone } from "lucide-react";

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function PhoneInput({ value, onChange, disabled }: PhoneInputProps) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1AA] mb-2">
        Mobile Number
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Phone className="h-5 w-5 text-[#A1A1AA] group-focus-within:text-[#22C55E] transition-colors" />
        </div>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="+91 98765 43210"
          className="appearance-none block w-full pl-12 pr-4 py-4 bg-[#000000] border border-[#1F1F1F] rounded-xl text-white font-bold placeholder-[#A1A1AA]/30 focus:outline-none focus:border-[#22C55E] sm:text-sm transition-colors disabled:opacity-50"
        />
      </div>
    </div>
  );
}
