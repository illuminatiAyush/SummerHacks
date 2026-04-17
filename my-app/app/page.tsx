"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Flame, Target, ShieldAlert, Zap, LockKeyhole, Activity, TrendingDown, Layers, Crosshair, ChevronRight, FileSearch, Eye, ShieldCheck, CheckCircle2, BadgeCheck, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- CORE COLOR VARIABLES USED (in-line Tailwind) ---
// Base Background: #F7F7F5 (Soft off-white)
// Main Text: #0B0B0B (Near black)
// Primary Accent: #0E9F6E (Deep green)
// Secondary Accent: #F97316 (Muted orange - used sparingly)

export default function PremiumProtocolLanding() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0B0B0B] font-sans selection:bg-[#0E9F6E]/20 selection:text-current overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-xl bg-[#F7F7F5]/80 border-b border-black/5 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center rounded-sm bg-[#0E9F6E] shadow-[0_2px_10px_rgba(14,159,110,0.3)]">
            <Activity className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg font-serif">ExpenseAutopsy</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black/60">
          <Link href="#protocol" className="hover:text-black transition-colors">Protocol</Link>
          <Link href="#how-it-works" className="hover:text-black transition-colors">How it works</Link>
          <Link href="#security" className="hover:text-black transition-colors">Security</Link>
          <Link href="/demo" className="hover:text-black transition-colors">Demo</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/demo" className="group relative px-5 py-2.5 bg-[#0B0B0B] text-white font-medium rounded-full text-xs tracking-widest uppercase hover:bg-black/80 hover:shadow-lg hover:shadow-black/10 transition-all flex items-center gap-2">
            Analyze Expense <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* 2. HERO */}
      <section className="relative pt-[22vh] pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Subtle background motion line */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex justify-center items-center">
           <svg className="w-[800px] h-[400px]" viewBox="0 0 1000 400" fill="none">
             <motion.path 
               d="M0,200 Q250,50 500,200 T1000,200" 
               stroke="#0E9F6E" strokeWidth="1" 
               initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
             />
             <motion.path 
               d="M0,220 Q250,350 500,220 T1000,220" 
               stroke="#0B0B0B" strokeWidth="0.5" strokeDasharray="4 4"
               initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1, duration: 2 }}
             />
           </svg>
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-medium tracking-tight leading-[1.05] mb-6">
              Convenience is <br className="hidden md:block"/>
              <span className="text-[#0E9F6E] italic pr-2">stealing</span> your trajectory.
            </h1>
            
            <p className="text-lg md:text-xl text-black/60 font-light leading-relaxed mb-14 max-w-2xl mx-auto">
              A behavioral financial protocol that maps the hidden cost of your daily decisions and forces absolute accountability.
            </p>

            <HeroCalculator />

            <div className="mt-14 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/demo" className="px-8 py-4 bg-[#0E9F6E] text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#0c8a5f] hover:shadow-[0_8px_30px_rgba(14,159,110,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
                Analyze Expense <ArrowRight size={16} />
              </Link>
              <Link href="#problem" className="px-8 py-4 bg-white border border-black/10 text-black rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black/[0.02] transition-colors flex items-center gap-2">
                View Protocol Overview
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. TRUST STRIP */}
      <motion.section 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
        className="py-10 border-y border-black/5 bg-white/[0.4] backdrop-blur-sm px-6"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest font-bold text-center md:text-left">
            Built for students, freelancers, and early professionals
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
             {["Behavioral Finance", "AI Powered", "On-chain Verified", "Testnet Safe"].map(badge => (
                <div key={badge} className="px-3 py-1 bg-black/[0.03] border border-black/[0.06] rounded-full text-xs font-medium text-black/60 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-[#0E9F6E]" /> {badge}
                </div>
             ))}
          </div>
        </div>
      </motion.section>

      {/* 4. PROBLEM SECTION */}
      <section id="problem" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif leading-[1.1] tracking-tight mb-8">
              Most spending isn't a decision. It's a pattern.
            </h2>
            <div className="space-y-6 text-xl font-light text-black/60 leading-relaxed">
              <p>
                We optimize for the immediate dopamine hit, entirely blind to the mathematical reality of compounding. The brain is not wired to understand non-linear loss.
              </p>
              <p>
                That daily coffee or impulsive trial subscription feels like a rounding error. But statistically, it is the exact chunk of capital that would have secured your future autonomy. You're robbing your 2030 self to entertain your today self.
              </p>
            </div>
          </div>
          
          <div className="relative p-8 md:p-12 bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/[0.02]">
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-8 border-b pb-4">Behavioral Decay Chart</p>
            <div className="w-full aspect-[4/3] relative flex items-end">
               {/* Abstract visual graph representing exponential loss */}
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 {/* Savings curve */}
                  <motion.path 
                    d="M 0 90 Q 50 85 100 20" 
                    fill="none" stroke="#0E9F6E" strokeWidth="2"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }}
                  />
                  {/* Loss curve */}
                  <motion.path 
                    d="M 0 90 Q 60 95 100 95" 
                    fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }}
                  />
               </svg>
               <div className="absolute bottom-4 right-4 text-xs font-mono text-red-500 font-bold bg-red-50 px-2 py-1 rounded">-$29,160 Leak</div>
               <div className="absolute top-4 right-4 text-xs font-mono text-[#0E9F6E] font-bold bg-green-50 px-2 py-1 rounded">+$35,000 Potential</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-black/5">
        <div className="grid md:grid-cols-2 gap-6">
           <FeatureCard 
             icon={<Eye className="w-5 h-5" />}
             title="AI Future Mirror"
             desc="See the real cost of habits before they compound out of control."
           />
           <FeatureCard 
             icon={<LockKeyhole className="w-5 h-5" />}
             title="Commitment Escrow"
             desc="Lock your intention with a real cryptographic stake."
           />
           <FeatureCard 
             icon={<FileSearch className="w-5 h-5" />}
             title="Human Verification"
             desc="Decisions aren't blind — they're actively reviewed by the network."
           />
           <FeatureCard 
             icon={<ShieldCheck className="w-5 h-5" />}
             title="On-chain Proof"
             desc="Your progress and self-discipline is verifiable, not just claimed."
           />
        </div>
      </section>

      {/* 6. SCROLL STORY SECTION (Vertical Scrolling Narrative) */}
      <section id="how-it-works" className="py-32 px-6 bg-white border-y border-black/5 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">The Discipline Pipeline</h2>
             <p className="text-lg text-black/50 font-light">Watch how a single receipt transforms your trajectory.</p>
          </div>

          <div className="relative pl-8 md:pl-0">
             {/* Vertical Line */}
             <div className="absolute left-0 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-black/5" />
             
             <div className="space-y-24">
               <StoryNode 
                 side="left"
                 step="01" 
                 title="Upload Expense" 
                 component={<div className="p-4 bg-gray-50 border border-black/5 rounded-xl shadow-sm text-center text-sm font-mono text-black/50 border-dashed">Drop receipt image or screenshot here</div>} 
               />
               <StoryNode 
                 side="right"
                 step="02" 
                 title="AI Calculates" 
                 component={
                   <div className="h-16 w-full flex items-center gap-1">
                     <motion.div className="h-full bg-black/10 rounded-sm w-1/4" animate={{ height: ["40%", "100%", "60%"] }} transition={{ duration: 1.5, repeat: Infinity }} />
                     <motion.div className="h-full bg-black/10 rounded-sm w-1/4" animate={{ height: ["80%", "30%", "90%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
                     <motion.div className="h-full bg-black/10 rounded-sm w-1/4" animate={{ height: ["30%", "70%", "40%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
                     <motion.div className="h-full bg-black/10 rounded-sm w-1/4" animate={{ height: ["90%", "20%", "80%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
                   </div>
                 } 
               />
               <StoryNode 
                 side="left"
                 step="03" 
                 title="Future Loss Shown" 
                 component={<div className="text-4xl font-serif text-red-500 font-bold tracking-tighter">-$42,050</div>} 
               />
               <StoryNode 
                 side="right"
                 step="04" 
                 title="Stake Decision" 
                 component={<button className="w-full py-3 bg-[#0E9F6E] text-white rounded-lg font-bold shadow-md shadow-green-900/10">Lock 0.05 ETH</button>} 
               />
               <StoryNode 
                 side="left"
                 step="05" 
                 title="Verification Phase" 
                 component={<div className="flex items-center gap-3 text-black/60"><Clock className="w-5 h-5"/> 30 Days Remaining</div>} 
               />
               <StoryNode 
                 side="right"
                 step="06" 
                 title="Reward Issued" 
                 component={<div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20"><BadgeCheck className="w-10 h-10 text-white" /></div>} 
               />
             </div>
          </div>
        </div>
      </section>

      {/* 7. SYSTEM / PROTOCOL SECTION */}
      <section id="protocol" className="py-32 px-6 max-w-6xl mx-auto text-center">
         <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-20">This isn't an app. It's a protocol.</h2>
         
         <div className="grid md:grid-cols-3 gap-8 relative items-start">
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-px bg-black/10" />
            
            <div className="flex flex-col items-center bg-[#F7F7F5] z-10 p-6">
               <div className="w-14 h-14 bg-white border border-black/10 rounded-2xl shadow-sm flex items-center justify-center mb-6">
                 <Eye className="w-6 h-6 text-[#0E9F6E]" />
               </div>
               <h3 className="text-xl font-bold font-serif mb-2">Confront</h3>
               <p className="text-black/60 text-sm">Upload raw data and face the true cost of your habits without flinching.</p>
            </div>
            
            <div className="flex flex-col items-center bg-[#F7F7F5] z-10 p-6">
               <div className="w-14 h-14 bg-white border border-black/10 rounded-2xl shadow-sm flex items-center justify-center mb-6">
                 <TimelineIcon />
               </div>
               <h3 className="text-xl font-bold font-serif mb-2">Project</h3>
               <p className="text-black/60 text-sm">See the compounding damage calculated directly against secure market baselines.</p>
            </div>

            <div className="flex flex-col items-center bg-[#F7F7F5] z-10 p-6">
               <div className="w-14 h-14 bg-white border border-black/10 rounded-2xl shadow-sm flex items-center justify-center mb-6">
                 <LockKeyhole className="w-6 h-6 text-[#0E9F6E]" />
               </div>
               <h3 className="text-xl font-bold font-serif mb-2">Stake</h3>
               <p className="text-black/60 text-sm">Force behavioral change through cryptographically enforced penalties.</p>
            </div>
         </div>
      </section>

      {/* 8. BUSINESS / VALUE SECTION */}
      <section className="py-24 px-6 bg-white border-y border-black/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-16 text-center">Why this works.</h2>
          
          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
             <div>
               <h4 className="text-lg font-bold mb-3">Psychological Commitment</h4>
               <p className="text-black/60 font-light text-sm leading-relaxed">Loss aversion is twice as powerful as the desire to gain. By putting capital at risk, you bypass willpower and install algorithmic discipline.</p>
             </div>
             <div>
               <h4 className="text-lg font-bold mb-3">Financial Awareness</h4>
               <p className="text-black/60 font-light text-sm leading-relaxed">Most leakage occurs because the future feels distant. We bridge the cognitive gap by generating exact 5-year opportunity costs on demand.</p>
             </div>
             <div>
               <h4 className="text-lg font-bold mb-3">Verifiable Accountability</h4>
               <p className="text-black/60 font-light text-sm leading-relaxed">Human review combined with strictly executed smart contracts ensures you cannot negotiate with yourself when you fail.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 9. VISUAL BREAK SECTION */}
      <section className="py-40 px-6 max-w-4xl mx-auto text-center">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: "easeOut" }}
         >
           <h2 className="text-5xl md:text-7xl font-serif font-medium tracking-tight leading-tight mb-8">
             Wealth isn't earned.<br/>It's retained.
           </h2>
           <p className="text-xl text-black/50 font-light max-w-2xl mx-auto">
             Stop playing defense with your future autonomy. Lock the vault.
           </p>
         </motion.div>
      </section>

      {/* 10. FINAL CTA SECTION */}
      <section id="security" className="py-40 px-6 bg-white text-center relative overflow-hidden border-t border-black/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,159,110,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
           <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-12">The protocol is ready. Are you?</h2>
           <Link href="/demo" className="inline-flex items-center gap-2 px-10 py-5 bg-[#0B0B0B] text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#0E9F6E] transition-colors shadow-lg">
             Analyze Expense <ArrowRight size={16} />
           </Link>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="pt-20 pb-12 px-6 lg:px-12 bg-[#F7F7F5] border-t border-black/5">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-20">
            
            <div className="max-w-sm">
              <div className="flex items-center gap-2 font-medium tracking-tight mb-4">
                <div className="w-4 h-4 bg-[#0E9F6E] rounded-sm" />
                <span className="font-serif italic font-bold">ExpenseAutopsy</span>
              </div>
              <p className="text-sm font-light text-black/60 leading-relaxed">
                Behavioral finance meets accountability. Map compounding loss and execute smart contract discipline.
              </p>
            </div>
            
            <div className="flex gap-16">
              <div className="flex flex-col gap-4 text-sm text-black/60">
                <span className="font-bold text-black uppercase tracking-widest text-[10px] mb-1">Company</span>
                <Link href="#" className="hover:text-[#0E9F6E] transition-colors">Product</Link>
                <Link href="#" className="hover:text-[#0E9F6E] transition-colors">Protocol</Link>
                <Link href="#" className="hover:text-[#0E9F6E] transition-colors">Security</Link>
              </div>
              <div className="flex flex-col gap-4 text-sm text-black/60">
                <span className="font-bold text-black uppercase tracking-widest text-[10px] mb-1">Resources</span>
                <Link href="#" className="hover:text-[#0E9F6E] transition-colors">Documentation</Link>
                <Link href="#" className="hover:text-[#0E9F6E] transition-colors">Contact</Link>
                <Link href="#" className="hover:text-[#0E9F6E] transition-colors">Terms of Service</Link>
              </div>
            </div>

         </div>

         <div className="max-w-7xl mx-auto pt-8 border-t border-black/10 text-xs font-medium text-black/40 flex justify-between items-center">
            <p>© 2026 ExpenseAutopsy. All rights reserved.</p>
            <div className="flex gap-4">
               <span className="hover:text-black cursor-pointer transition-colors">𝕏</span>
               <span className="hover:text-black cursor-pointer transition-colors">GitHub</span>
            </div>
         </div>
      </footer>
    </div>
  );
}


/* ── SUBCOMPONENTS ── */

function RevealText({ text, delayOffset = 0, className }: any) {
  const words = text.split(" ");
  return (
    <span className={cn("inline-block", className)}>
      {words.map((word: string, i: number) => (
        <span key={i} className="inline-block overflow-hidden relative mr-[0.25em] pb-1">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: delayOffset + i * 0.05
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function ScrollRevealText({ children, className }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroCalculator() {
  const [expense, setExpense] = useState(15);
  const loss = Math.floor(expense * 30 * 12 * 5 * 1.08);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center p-8 bg-white border border-black/10 rounded-2xl w-full max-w-lg mx-auto relative shadow-2xl shadow-black/[0.03]"
    >
       <div className="flex items-end justify-center mb-6 w-full relative">
         <span className="text-3xl opacity-30 pb-1 pr-1 font-serif">$</span>
         <input 
           type="number" 
           value={expense}
           onChange={(e) => setExpense(Math.abs(Number(e.target.value)) || 0)}
           className="bg-transparent text-5xl md:text-7xl font-serif text-center outline-none w-32 border-b-2 border-black/10 focus:border-[#0E9F6E] text-black transition-colors pb-1"
         />
         <span className="absolute -right-8 bottom-4 text-xs font-mono uppercase tracking-widest opacity-40">/DAY</span>
       </div>

       <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono tracking-widest uppercase opacity-40">5-Year Projected Loss</span>
          <div className="flex items-center text-[#ef4444] font-bold">
            <span className="opacity-50 mr-1 text-2xl">$</span>
            <CountUp number={loss} />
          </div>
       </div>
    </motion.div>
  );
}

function CountUp({ number }: { number: number }) {
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 1200;
    const startNum = displayNumber;
    const endNum = number;

    function update(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayNumber(Math.floor(startNum + (endNum - startNum) * easeProgress));

      if (progress < 1) animationFrame = requestAnimationFrame(update);
    }
    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [number]);

  return <span className="text-3xl md:text-4xl">{displayNumber.toLocaleString()}</span>;
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white border border-black/5 rounded-2xl hover:border-black/10 hover:-translate-y-1 transition-all group shadow-sm">
       <div className="w-10 h-10 rounded-xl bg-[#0E9F6E]/10 text-[#0E9F6E] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
         {icon}
       </div>
       <h3 className="text-lg font-bold font-serif mb-2 tracking-tight">{title}</h3>
       <p className="text-sm text-black/60 font-light leading-relaxed">{desc}</p>
    </div>
  );
}

function StoryNode({ side, step, title, component }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div ref={ref} className={cn("relative flex flex-col md:flex-row items-center gap-8 md:gap-16", side === "right" && "md:flex-row-reverse")}>
       
       <div className="absolute left-[-16px] md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-[#F7F7F5] shadow-sm flex items-center justify-center z-10 text-[10px] font-mono font-bold">
         {step}
       </div>

       <motion.div 
         initial={{ opacity: 0, x: side === "left" ? 30 : -30 }}
         animate={isInView ? { opacity: 1, x: 0 } : {}}
         transition={{ duration: 0.8, ease: "easeOut" }}
         className={cn("w-full md:w-1/2 pl-10 md:pl-0", side === "left" ? "md:text-right" : "md:text-left")}
       >
         <h4 className="text-2xl font-serif mb-6 md:mb-0">{title}</h4>
       </motion.div>

       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={isInView ? { opacity: 1, scale: 1 } : {}}
         transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
         className="w-full md:w-1/2 pl-10 md:pl-0"
       >
         <div className="w-full max-w-[280px] p-6 bg-white border border-black/5 rounded-2xl shadow-xl shadow-black/[0.03] mx-auto md:mx-0">
           {component}
         </div>
       </motion.div>

    </div>
  );
}

function TimelineIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0E9F6E]">
      <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
    </svg>
  );
}
