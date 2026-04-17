"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, BarChart3, Clock, Wallet, ShieldCheck, LockKeyhole, FileLineChart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PremiumFintechLanding() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [isDark]);

  if (!mounted) return null;

  return (
    <div className={cn(
      "min-h-screen font-sans transition-colors duration-700 ease-in-out selection:bg-[#00C853]/20 selection:text-current overflow-x-hidden",
      isDark ? "bg-[#050505] text-[#FAFAFA]" : "bg-[#FFFFFF] text-[#111111]"
    )}>
      
      {/* 1. NAVBAR */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-xl border-b transition-colors duration-500",
        isDark ? "bg-[#050505]/70 border-white/5" : "bg-white/80 border-black/5"
      )}>
        <div className="flex items-center gap-2 font-medium tracking-tight">
          <div className="w-4 h-4 bg-[#00C853] rounded-sm" />
          <span className="font-serif italic text-lg pr-1 font-bold">ExpenseAutopsy</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-60">
          <Link href="#problem" className="hover:opacity-100 transition-opacity">Philosophy</Link>
          <Link href="#product" className="hover:opacity-100 transition-opacity">Protocol</Link>
          <Link href="#impact" className="hover:opacity-100 transition-opacity">Impact</Link>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="opacity-50 hover:opacity-100 transition-opacity uppercase tracking-widest text-[10px] sm:text-xs font-bold"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <Link href="/demo" className={cn(
            "hidden sm:block px-5 py-2.5 rounded-md transition-all text-xs uppercase tracking-widest font-bold",
            isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
          )}>
            Launch App
          </Link>
        </div>
      </nav>

      {/* 2. HERO: INSIGHT */}
      <section className="relative pt-[25vh] pb-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-5xl w-full">
          <div className="mb-10 flex flex-wrap justify-center gap-x-4 gap-y-2">
             <RevealText 
               text="Convenience is" 
               className="text-5xl sm:text-6xl md:text-8xl font-serif tracking-tight leading-none"
             />
             <RevealText 
               text="stealing" 
               className="text-5xl sm:text-6xl md:text-8xl font-serif italic tracking-tight leading-none text-[#00C853]"
               delayOffset={0.3}
             />
             <br className="w-full hidden md:block" />
             <RevealText 
               text="your trajectory." 
               className="text-5xl sm:text-6xl md:text-8xl font-serif tracking-tight leading-none"
               delayOffset={0.6}
             />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={cn(
              "text-lg sm:text-xl font-light tracking-wide max-w-2xl mx-auto mb-16",
              isDark ? "text-white/60" : "text-black/60"
            )}>
              A strict computational protocol. We map the unseen cost of your daily
              decisions and hold your capital accountable until you fix them.
            </p>

            <HeroInteraction isDark={isDark} />

            <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/demo" className={cn(
                "group relative px-10 py-5 text-sm uppercase tracking-widest font-bold transition-all shadow-sm rounded-sm overflow-hidden",
                isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
              )}>
                <span className="relative z-10 flex items-center gap-3">
                  Initiate Audit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. AUDIENCE STRIP */}
      <motion.section 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
         className={cn("py-8 border-y flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 px-6", isDark ? "border-white/5 bg-white/[0.02]" : "border-black/5 bg-black/[0.02]")}
      >
         <span className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-40">Built for people who want control:</span>
         <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium opacity-70">
            <span>Founders</span>
            <span>Freelancers</span>
            <span>Working Professionals</span>
            <span>Students</span>
            <span>Disciplined Families</span>
         </div>
      </motion.section>

      {/* 4. PROBLEM: REALITY */}
       <section id="problem" className="py-32 md:py-48 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest mb-6 opacity-40">01. Behavior Model</p>
            <ScrollRevealText block className="text-3xl md:text-5xl font-serif leading-[1.2] tracking-tight mb-8">
              Most spending is not a decision. It is an automated escape.
            </ScrollRevealText>
            <p className={cn("text-lg md:text-xl font-light leading-relaxed", isDark ? "text-white/60" : "text-black/60")}>
              You aren't buying a coffee; you're buying a ten-minute distraction. The danger isn't the single price tag—it's the compounding frequency. What feels like a rounding error today mathematically destroys your future capital.
            </p>
          </div>
          
          <div className="relative">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, margin: "-10%" }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className={cn("p-8 md:p-12 border rounded-sm", isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-black/[0.02]")}
            >
               <div className="mb-12">
                 <h4 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-2">Cognitive Blindspot</h4>
                 <div className="h-0.5 w-12 bg-red-500 mb-6" />
                 <p className="font-serif text-2xl mb-2">91% of trivial purchases</p>
                 <p className="opacity-60 text-sm">are forgotten within 48 hours of transaction.</p>
               </div>
               <div>
                 <h4 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-2">Financial Truth</h4>
                 <div className="h-0.5 w-12 bg-[#00C853] mb-6" />
                 <p className="font-serif text-2xl mb-2">$10/day compounded</p>
                 <p className="opacity-60 text-sm">yields massive market returns over 10 years at 8%.</p>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT AS SOLUTION */}
      <section id="product" className={cn("py-32 md:py-48 px-6 md:px-12 border-t", isDark ? "bg-[#030303] border-white/5" : "bg-[#F9F9F9] border-black/5")}>
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center max-w-2xl mb-20">
               <p className="text-[10px] font-mono uppercase tracking-widest mb-6 opacity-40">02. Engineering Accountability</p>
               <h2 className="text-3xl md:text-5xl font-serif tracking-tight mb-6">Structure creates discipline.</h2>
               <p className={cn("text-lg font-light", isDark ? "text-white/60" : "text-black/60")}>
                 Upload raw financial data. We structure the reality of it in plain sight, quantifying how much your present actions are borrowing from your future self.
               </p>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-8 items-start mb-20">
               <div className="w-full lg:w-3/5">
                 <UIPreviewCard isDark={isDark} />
               </div>
               
               <div className="w-full lg:w-2/5 flex flex-col gap-8">
                  <SolutionStep 
                    isDark={isDark} 
                    icon={<BarChart3 />} 
                    title="Track the Leak" 
                    desc="Drop a receipt. Our models parse cost, category, and exact nature instantly." 
                  />
                  <SolutionStep 
                    isDark={isDark} 
                    icon={<Clock />} 
                    title="Project the Damage" 
                    desc="We map the 5-year opportunity cost using standard 8% market indices." 
                  />
                  <SolutionStep 
                    isDark={isDark} 
                    icon={<Wallet />} 
                    title="Commit to Escrow" 
                    desc="Lock testnet ETH on-chain to penalize future lapses in discipline." 
                  />
               </div>
            </div>
        </div>
      </section>

      {/* 6. CIVIC / REAL-WORLD PROTOCOL */}
      <section className="py-32 md:py-40 px-6 max-w-7xl mx-auto border-t" style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
        <div className="text-center mb-24">
           <p className="text-[10px] font-mono uppercase tracking-widest mb-6 opacity-40">03. Institutional Framing</p>
           <h2 className="text-3xl md:text-5xl font-serif tracking-tight mb-6">The Behavioral Protocol</h2>
           <p className={cn("max-w-2xl mx-auto font-light", isDark ? "text-white/50" : "text-black/50")}>
             Designed not as a game, but as a rigid civic framework for personal excellence. Actions have calculated consequences. Discipline has algorithmic rewards.
           </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           <ProtocolCard 
             isDark={isDark} 
             title="Behavior Audit" 
             desc="Rigorous classification and breakdown of unnecessary expenditure via intelligent LLM clustering."
             icon={<FileLineChart />}
           />
           <ProtocolCard 
             isDark={isDark} 
             title="Commitment Lock" 
             desc="Cryptographically secure funds lockdown serving as a financial penalty for failing personal goals."
             icon={<LockKeyhole />}
           />
           <ProtocolCard 
             isDark={isDark} 
             title="Trajectory Mapping" 
             desc="Longitudinal projection of current lifestyle costs against compounding investment benchmarks."
             icon={<ShieldCheck />}
           />
        </div>
      </section>

      {/* 7. APPROACH / HOW IT WORKS */}
      <section className={cn("py-32 md:py-48 px-6 border-y relative", isDark ? "bg-[#080808] border-white/5" : "bg-[#F3F3F3] border-black/5")}>
         <div className="max-w-7xl mx-auto">
            <p className="text-[10px] font-mono uppercase tracking-widest mb-16 text-center opacity-40">04. Operational Model</p>
            
            <div className="relative">
               {/* Timeline Connector */}
               <div className={cn("absolute top-6 left-0 right-0 h-[1px] hidden md:block", isDark ? "bg-white/10" : "bg-black/10")} />
               
               <div className="grid md:grid-cols-4 gap-12 relative z-10">
                 <TimelineStep isDark={isDark} num="01" title="Ingest Data" desc="Supply raw financial logs." />
                 <TimelineStep isDark={isDark} num="02" title="Analyze Impact" desc="Review 5-year calculations." />
                 <TimelineStep isDark={isDark} num="03" title="Stipulate Goal" desc="Define target metrics." />
                 <TimelineStep isDark={isDark} num="04" title="Execute Lock" desc="Commit capital on-chain." />
               </div>
            </div>
         </div>
      </section>

      {/* 8. IMPACT / OUTCOME (Data-driven) */}
      <section id="impact" className="py-32 md:py-48 px-6 max-w-7xl mx-auto text-center border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-6 opacity-40">05. The Outcome</p>
        <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-8">
          Wealth is not earned.<br/>It is retained.
        </h2>
        <p className={cn("text-lg font-light max-w-2xl mx-auto mb-20", isDark ? "text-white/60" : "text-black/60")}>
          Every minor optimization to your daily leak translates into massive long-term security. We simply make the invisible math visible.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <MetricCard isDark={isDark} label="Avg 5-Year Capital Retained" prefix="$" value={18200} color="#00C853" />
          <MetricCard isDark={isDark} label="Unbroken Protocol Streaks" suffix="Days" value={42} color={isDark ? "#FAFAFA" : "#111111"} />
          <MetricCard isDark={isDark} label="Reduction in Spontaneous Buying" suffix="%" value={84} color="#00C853" />
        </div>
      </section>

      {/* 9. SOCIAL PROOF */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
         <p className="text-[10px] font-mono uppercase tracking-widest mb-16 text-center opacity-40">06. Systems Validation</p>
         
         <div className="mb-16">
            <h3 className="text-2xl md:text-4xl font-serif italic text-center leading-relaxed">
              "The only platform that successfully weaponized loss aversion against my own bad habits. It doesn't ask you to save; it proves you are losing."
            </h3>
            <p className="text-center mt-6 uppercase tracking-widest text-xs font-bold opacity-50">— YC S26 Founder</p>
         </div>

         <div className="grid md:grid-cols-2 gap-8">
            <div className={cn("p-8 border flex flex-col gap-4", isDark ? "border-white/5" : "border-black/5")}>
               <p className={cn("font-light", isDark ? "text-white/70" : "text-black/70")}>"I uploaded one receipt. The 5-year projection showed me $4,000 in lost compounding. Stopped that habit the same day."</p>
               <p className="text-xs uppercase tracking-widest opacity-40">Freelance Designer</p>
            </div>
            <div className={cn("p-8 border flex flex-col gap-4", isDark ? "border-white/5" : "border-black/5")}>
               <p className={cn("font-light", isDark ? "text-white/70" : "text-black/70")}>"The smart contract lock completely reframes saving. I'm legally bound by code to avoid eating out, or I forfeit my deposit. Genius."</p>
               <p className="text-xs uppercase tracking-widest opacity-40">Software Engineer</p>
            </div>
         </div>
      </section>

      {/* 10. FINAL CTA */}
       <section className={cn(
        "py-48 px-6 border-t relative overflow-hidden",
        isDark ? "border-white/10" : "border-black/10"
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,200,83,0.03)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif mb-10 tracking-tight">The protocol is ready. Are you?</h2>
          <p className={cn("mb-12 font-light text-lg", isDark ? "text-white/50" : "text-black/50")}>Stop treating your capital carelessly. Install the software. Reclaim the trajectory.</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/demo" className={cn(
              "px-10 py-5 text-sm uppercase tracking-widest font-bold transition-all shadow-md hover:scale-105",
              isDark ? "bg-[#00C853] text-black hover:bg-[#00E676]" : "bg-[#00C853] text-white hover:bg-[#00E676]"
            )}>
              Deploy Protocol
            </Link>
            <Link href="#problem" className={cn(
              "px-10 py-5 text-sm uppercase tracking-widest font-bold transition-all border",
              isDark ? "border-white/20 hover:border-white/40" : "border-black/20 hover:border-black/40"
            )}>
              Read Manifesto
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className={cn(
        "pt-20 pb-12 px-6 lg:px-12 border-t text-sm relative",
        isDark ? "border-white/10 bg-[#020202]" : "border-black/10 bg-[#F9F9F9]"
      )}>
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 font-medium tracking-tight mb-4">
                <div className="w-4 h-4 bg-[#00C853] rounded-sm" />
                <span className="font-serif italic font-bold">ExpenseAutopsy</span>
              </div>
              <p className={cn("max-w-xs leading-relaxed font-light mt-4", isDark ? "text-white/50" : "text-black/50")}>
                A computational behavior protocol designed to map, penalize, and rectify inefficient financial expenditure.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="font-bold mb-2 uppercase tracking-widest text-[10px] opacity-40">System</span>
              <span className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer">Protocol API</span>
              <span className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer">Web3 Nodes</span>
              <span className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer">Audit Logs</span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-bold mb-2 uppercase tracking-widest text-[10px] opacity-40">Organization</span>
              <span className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer">Manifesto</span>
              <span className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer">Research Methods</span>
              <span className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer">Privacy & Security</span>
            </div>
         </div>

         <div className={cn("max-w-7xl mx-auto pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest opacity-40", isDark ? "border-white/10" : "border-black/10")}>
           <div>2026 © FUTURESELF FINANCE INC. ALL RIGHTS RESERVED.</div>
           <div className="flex gap-6">
             <span className="hover:text-[#00C853] transition-colors cursor-pointer">Twitter</span>
             <span className="hover:text-[#00C853] transition-colors cursor-pointer">GitHub</span>
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
        <span key={i} className="inline-block overflow-hidden relative mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: delayOffset + i * 0.04
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function ScrollRevealText({ children, className, block }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  
  if (typeof children === "string" && !block) {
     const words = children.split(" ");
     return (
       <span ref={ref} className={className}>
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
               <motion.span
                 className="inline-block"
                 initial={{ y: "110%" }}
                 animate={isInView ? { y: 0 } : { y: "110%" }}
                 transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 }}
               >
                 {word}
               </motion.span>
            </span>
          ))}
       </span>
     );
  }

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

function HeroInteraction({ isDark }: { isDark: boolean }) {
  const [expense, setExpense] = useState(15);
  const loss = Math.floor(expense * 30 * 12 * 5 * 1.08);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
         "flex flex-col items-center justify-center p-8 border rounded-sm w-full max-w-lg mx-auto relative",
         isDark ? "border-white/10 bg-white/5" : "border-black/5 bg-black/[0.02]"
      )}
    >
       <div className="flex items-end justify-center mb-6 w-full relative">
         <span className="text-3xl opacity-30 pb-1 pr-1 font-serif">$</span>
         <input 
           type="number" 
           value={expense}
           onChange={(e) => setExpense(Number(e.target.value) || 0)}
           className={cn(
             "bg-transparent text-5xl md:text-7xl font-serif text-center outline-none w-32 border-b-2 focus:border-[#00C853] transition-colors pb-1",
             isDark ? "border-white/20 text-white" : "border-black/20 text-black"
           )}
         />
         <span className="absolute -right-8 bottom-4 text-xs font-mono uppercase tracking-widest opacity-40">/DAY</span>
       </div>

       <div className="flex items-center gap-4 text-sm font-mono tracking-widest uppercase">
          <span className="opacity-40">5YR COMPOUNDING LOSS:</span>
          <div className="flex items-center text-[#00C853] font-bold">
            <span className="opacity-50 mr-1">$</span>
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

  return <span className="text-lg">{displayNumber.toLocaleString()}</span>;
}

function UIPreviewCard({ isDark }: { isDark: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-full aspect-video rounded-sm border overflow-hidden relative flex flex-col",
        isDark ? "bg-[#111] border-white/10 shadow-2xl shadow-black" : "bg-white border-black/10 shadow-2xl shadow-black/5"
      )}
    >
      <div className={cn("h-10 border-b flex items-center px-4", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5")}>
         <div className="flex gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full opacity-20 bg-current"/>
           <div className="w-2.5 h-2.5 rounded-full opacity-20 bg-current"/>
           <div className="w-2.5 h-2.5 rounded-full opacity-20 bg-current"/>
         </div>
      </div>
      <div className="flex-1 p-8 flex flex-col items-center justify-center relative shadow-inner">
         <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(0,200,83)_50%,transparent_75%)] bg-[length:10px_10px]" />
         <div className="relative z-10 text-center p-8 border rounded-sm backdrop-blur-md" style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)" }}>
           <div className="text-[#00C853] text-[10px] font-mono tracking-widest uppercase mb-3 font-bold border border-[#00C853]/30 px-3 py-1 inline-block bg-[#00C853]/10">Analysis Complete</div>
           <div className="text-3xl font-serif mb-4 line-through opacity-40">Morning Coffee Run</div>
           <div className="text-4xl font-serif text-[#00C853] font-bold">+$12,400 Retained</div>
         </div>
      </div>
    </motion.div>
  );
}

function SolutionStep({ isDark, icon, title, desc }: any) {
  return (
    <div className={cn("flex gap-4 p-6 border rounded-sm transition-colors", isDark ? "border-white/5 hover:border-white/20 bg-white/[0.01]" : "border-black/5 hover:border-black/20 bg-black/[0.01]")}>
       <div className="w-10 h-10 rounded text-[#00C853] bg-[#00C853]/10 flex items-center justify-center shrink-0">
          {icon}
       </div>
       <div>
         <h4 className="font-bold mb-1 font-serif tracking-tight">{title}</h4>
         <p className={cn("text-xs leading-relaxed opacity-70")}>{desc}</p>
       </div>
    </div>
  );
}

function ProtocolCard({ isDark, title, desc, icon }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn("p-8 border rounded-sm flex flex-col", isDark ? "border-white/10 hover:border-white/30 transition-colors" : "border-black/10 hover:border-black/30 transition-colors")}
    >
      <div className={cn("w-12 h-12 border rounded flex items-center justify-center mb-8", isDark ? "border-white/20 text-white" : "border-black/20 text-black")}>
        {icon}
      </div>
      <h3 className="text-xl font-serif tracking-tight mb-3">{title}</h3>
      <p className={cn("text-sm font-light leading-relaxed", isDark ? "text-white/60" : "text-black/60")}>{desc}</p>
    </motion.div>
  );
}

function TimelineStep({ isDark, num, title, desc }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div 
       ref={ref}
       initial={{ opacity: 0, scale: 0.95 }}
       animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
       transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
       className="flex flex-col relative"
    >
       <div className={cn("w-12 h-12 rounded-sm border flex items-center justify-center mb-6 relative z-10", isDark ? "bg-[#080808] border-white/20 text-[#00C853]" : "bg-[#F3F3F3] border-black/20 text-[#00C853]")}>
         <span className="font-mono text-sm font-bold">{num}</span>
       </div>
       <h4 className="text-lg font-serif font-bold mb-2 tracking-tight">{title}</h4>
       <p className={cn("text-xs font-light", isDark ? "text-white/60" : "text-black/60")}>{desc}</p>
    </motion.div>
  );
}

function MetricCard({ isDark, label, prefix, suffix, value, color }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn("p-10 border rounded-sm flex flex-col items-center justify-center shadow-sm", isDark ? "border-white/10 bg-white/[0.01]" : "border-black/10 bg-black/[0.01]")}
    >
       <div className="flex justify-center items-end text-5xl font-serif tracking-tight mb-4" style={{ color }}>
         {prefix && <span className="opacity-60 text-3xl pb-1 pr-1">{prefix}</span>}
         {isInView ? <CountUp number={value} /> : "0"}
         {suffix && <span className="text-xl pb-1 pl-1">{suffix}</span>}
       </div>
       <span className="text-xs uppercase tracking-widest font-bold opacity-50">{label}</span>
    </motion.div>
  );
}
