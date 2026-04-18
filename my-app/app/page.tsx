"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  ArrowRight, LockKeyhole, LineChart, Eye, UploadCloud, Target, Zap, 
  ChevronRight, CheckCircle2, Activity, ShieldAlert, Clock, BadgeCheck, 
  Briefcase, Users, GraduationCap, ShieldCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";

export default function PremiumProtocolLanding() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection-emerald overflow-x-hidden transition-colors duration-300">
      
      <Navbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-[20vh] pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-accent/5 to-transparent">
        {/* Subtle background motion line */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex justify-center items-center">
           <svg className="w-[1200px] h-[600px] opacity-40" viewBox="0 0 1200 600" fill="none">
             <motion.path 
               d="M0,400 Q300,100 600,300 T1200,100" 
               stroke="var(--accent)" strokeWidth="1" 
               initial={{ pathLength: 0 }} 
               animate={{ pathLength: 1 }} 
               transition={{ duration: 2.5, ease: "easeInOut" }}
             />
             <motion.path 
               d="M0,430 Q300,130 600,330 T1200,130" 
               stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4"
               initial={{ opacity: 0 }} 
               animate={{ opacity: 0.3 }} 
               transition={{ delay: 1, duration: 2 }}
             />
           </svg>
        </div>

        <div className="relative z-10 w-full flex flex-col items-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full">
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold leading-[0.95] tracking-tighter text-black mb-8">
              Convenience is <br className="hidden md:block"/>
              <span className="text-green-600 italic pr-2">stealing</span> your trajectory.
            </h1>
            
            <p className="text-2xl font-light text-secondary leading-relaxed mb-16 max-w-2xl mx-auto">
              A behavioral financial protocol that reveals the hidden cost of everyday decisions and forces accountability.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/login" className="px-8 py-4 bg-foreground text-background rounded-full text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                Analyze Expense <ArrowRight size={16} />
              </Link>
              <Link href="#" className="px-8 py-4 border border-border text-foreground rounded-full text-sm font-bold tracking-widest uppercase hover:bg-foreground/[0.03] transition-colors flex items-center gap-2">
                View Protocol
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION (Reference Match) */}
      <section className="py-32 px-6 bg-surface border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.03)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-8">
             <ScrollReveal className="md:w-[55%]">
             <div className="inline-flex items-center px-4 py-1.5 bg-red-500/5 text-red-500 text-xs uppercase font-bold tracking-widest rounded-full mb-8">
               <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-3 animate-pulse" />
               Behavioral Crisis Audit
             </div>
              <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-bold leading-[0.95] tracking-tighter text-black">
                The Cost of <br/><span className="text-red-600 italic">Ignorance.</span>
              </h2>
           </ScrollReveal>
           <ScrollReveal className="md:w-[45%] md:max-w-md md:text-left mt-4 md:mt-0">
             <p className="text-2xl font-light text-secondary leading-relaxed">
               Fragmented attention and legacy behavioral patterns continue to degrade personal financial infrastructure. <span className="text-red-500 font-medium italic">It stops here.</span>
             </p>
           </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <ProblemCard 
            badge="PRIORITY NODE" 
            imgSrc="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop"
            title="The Convenience Tax"
            desc="Deep structural failure in daily spending. Multiple small, spontaneous transactions completely eroding monthly surplus."
            location="LATENT HABIT • DAILY"
          />
          <ProblemCard 
            badge="AUDIT PENDING" 
            imgSrc="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=800&auto=format&fit=crop"
            title="Subscription Leak"
            desc="Secondary entertainment capacity exceeded. Invisible recurring charges draining capital without active utility."
            location="AUTOMATED • MONTHLY"
          />
          <ProblemCard 
            badge="CRITICAL ALERT" 
            imgSrc="https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=800&auto=format&fit=crop"
            title="Impulse Buy Rupture"
            desc="Emotional regulation failure causing localized capital flooding and sudden trajectory loss across the quarter."
          />
        </div>
        </div>
      </section>

      {/* 4. SOLUTION SECTION */}
      <section className="py-32 px-6 bg-black text-white relative overflow-hidden dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-20 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">We make the invisible visible.</h2>
          <p className="text-xl text-white/50 font-light">
            An intelligent system designed to strip away the illusion of low-cost habits, revealing their true future cost and creating algorithmic accountability.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10 animate-fade-up" style={{ animationDelay: '0.6s' }}>
           <FeatureCard 
             icon={<LineChart className="w-5 h-5 text-accent" />}
             title="Real-time Cost Projection"
             desc="Instantly translate a ₹15 lunch into a mathematically projected 5-year opportunity cost."
             dark={true}
           />
           <FeatureCard 
             icon={<Eye className="w-5 h-5 text-accent" />}
             title="Behavioral Accountability"
             desc="Force yourself to see the reality of your actions before they become permanent patterns."
             dark={true}
           />
           <FeatureCard 
             icon={<LockKeyhole className="w-5 h-5 text-accent" />}
             title="Structured Commitment"
             desc="Put capital at risk to ensure your intention turns into active, verified discipline."
             dark={true}
           />
        </div>
      </section>

      {/* 5. PRODUCT SECTION */}
      <section className="py-32 px-6 bg-background border-y border-border">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-black">See the cost before it compounds.</h2>
          </ScrollReveal>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
             <div className="lg:w-1/2">
                <p className="text-lg font-light text-secondary leading-relaxed mb-6">
                  Our analysis engine doesn't just categorize your spending—it projects it. By standardizing your daily habits against median market returns, we show you the exact amount of capital you are deleting from your future. 
                </p>
                <p className="text-lg font-light text-secondary leading-relaxed">
                  When a ₹20 habit becomes a ₹20,000 loss, the decision to stop becomes effortless.
                </p>
             </div>
             
             <div className="lg:w-1/2 w-full">
                {/* Product Card / Output Mock */}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8 }}
                   className="bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl shadow-black/[0.04]"
                >
                   <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                     <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">System Output</span>
                     <span className="text-xs text-muted font-mono">ID: X7-ALFA</span>
                   </div>

                   <div className="space-y-6">
                      <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-gray-400">Target Habit:</span>
                          <span className="text-xl font-bold text-black">Food Delivery</span>
                      </div>
                      <div className="flex justify-between items-end">
                         <span className="text-sm font-medium text-secondary">Estimated Frequency:</span>
                         <span className="text-xl font-bold text-foreground">4x / week</span>
                      </div>
                      
                      <div className="h-px w-full bg-border my-4" />

                      <div className="flex justify-between items-end">
                         <span className="text-sm font-medium text-secondary">Projected Impact</span>
                      </div>
                      <div>
                          <div className="text-5xl font-bold tracking-tighter text-red-600 flex items-center">
                             <CountUp number={23400} prefix="₹" suffix="+" duration={1.5} />
                          </div>
                      </div>
                   </div>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (Discipline Pipeline) */}
      <section className="py-32 px-6 bg-background border-y border-border relative overflow-hidden">
        {/* Subtle light blue radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.03)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-24">
             <div className="inline-flex items-center px-4 py-1.5 bg-accent/10 text-accent text-xs uppercase font-bold tracking-widest rounded-full mb-8">
               <span className="w-2 h-2 bg-accent rounded-full inline-block mr-3" />
               Execution Engine
             </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-4">The Discipline Pipeline</h2>
             <p className="text-xl text-secondary font-light">Watch how a single receipt transforms your trajectory.</p>
          </div>

          <div className="relative pl-8 md:pl-0">
             {/* Vertical Line */}
             <div className="absolute left-0 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-border" />
             
             <div className="space-y-24">
               <StoryNode 
                 side="left"
                 step="01" 
                 title="Upload Expense" 
                 component={<div className="p-4 bg-surface border border-border border-dashed rounded-xl shadow-sm text-center text-sm font-mono text-muted">Drop receipt image or screenshot here</div>} 
               />
               <StoryNode 
                 side="right"
                 step="02" 
                 title="AI Calculates" 
                 component={
                   <div className="h-16 w-full flex items-center gap-1">
                     <motion.div className="h-full bg-accent/20 rounded-sm w-1/4" animate={{ height: ["40%", "100%", "60%"] }} transition={{ duration: 1.5, repeat: Infinity }} />
                     <motion.div className="h-full bg-accent/20 rounded-sm w-1/4" animate={{ height: ["80%", "30%", "90%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
                     <motion.div className="h-full bg-accent/20 rounded-sm w-1/4" animate={{ height: ["30%", "70%", "40%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
                     <motion.div className="h-full bg-accent/20 rounded-sm w-1/4" animate={{ height: ["90%", "20%", "80%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
                   </div>
                 } 
               />
               <StoryNode 
                 side="left"
                 step="03" 
                 title="Future Loss Shown" 
                 component={<div className="text-4xl font-bold text-red-500 tracking-tighter">-₹42,050<div className="text-xs font-mono text-muted mt-1 uppercase">5-Year Impact</div></div>} 
               />
               <StoryNode 
                 side="right"
                 step="04" 
                 title="Stake Decision" 
                 component={<button className="w-full py-3 bg-accent text-background rounded-lg font-bold shadow-md shadow-accent/10 hover:scale-105 transition-transform duration-300">Lock 0.05 ETH</button>} 
               />
               <StoryNode 
                 side="left"
                 step="05" 
                 title="Verification Phase" 
                 component={
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-3 text-secondary"><Clock className="w-5 h-5"/> 30 Days Remaining</div>
                     <motion.div className="h-2 bg-accent rounded-full" initial={{ width: "0%" }} whileInView={{ width: "65%" }} transition={{ duration: 1.5, delay: 0.5 }} />
                   </div>
                 } 
               />
               <StoryNode 
                 side="right"
                 step="06" 
                 title="Reward Issued" 
                 component={
                    <motion.div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <BadgeCheck className="w-10 h-10 text-white" />
                    </motion.div>
                 } 
               />
             </div>
          </div>
        </div>
      </section>

      {/* 7. APPROACH SECTION */}
      <section className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">Designed for real behavior change.</h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
             <div className="bg-background border border-border p-8 rounded-xl group hover:border-accent/30 transition-all">
                <h4 className="text-xl font-bold mb-3 text-black">Clarity First</h4>
               <p className="text-secondary font-light text-sm leading-relaxed">
                 Behavior only changes when the true magnitude of a habit is understood. Users see the real financial impact of every small slip.
               </p>
             </div>
             <div className="bg-background border border-border p-8 rounded-xl group hover:border-accent/30 transition-all">
               <h4 className="text-xl font-bold mb-3 text-black">Skin in the Game</h4>
               <p className="text-secondary font-light text-sm leading-relaxed">
                 Willpower depletes. Financial deposits do not. True commitment is backed by actionable, locked capital.
               </p>
             </div>
             <div className="bg-background border border-border p-8 rounded-xl group hover:border-accent/30 transition-all">
               <h4 className="text-xl font-bold mb-3 text-black">Accountability Layer</h4>
               <p className="text-secondary font-light text-sm leading-relaxed">
                 Strict verification protocols ensure you cannot lie to yourself. Integrity is enforced through mathematics.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* 8. IMPACT SECTION */}
      <section className="py-32 px-6 max-w-5xl mx-auto text-center border-b border-border">
         <ScrollReveal>
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black">Small habits. Massive outcomes.</h2>
           <p className="text-xl text-secondary font-light mb-16 max-w-2xl mx-auto">
             Statistical probability dictates that eliminating micro-waste yields macroscopic wealth retention.
           </p>
         </ScrollReveal>

         <div className="grid sm:grid-cols-3 gap-8">
            <StatCard 
              value={18000} 
              prefix="$" 
              suffix="+" 
              label="$10/day over 5 years" 
            />
            <StatCard 
              value={30} 
              suffix="%" 
              label="Reduction in overall waste" 
            />
            <StatCard 
              icon={<ShieldCheck className="w-8 h-8 text-accent" />}
              label="Consistent habits improve retention" 
              noNum
            />
         </div>
      </section>

      {/* 9. VALUE SECTION */}
      <section className="py-32 px-6 bg-accent/5 border-y border-accent/10 relative">
         <div className="max-w-6xl mx-auto">
           <ScrollReveal className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-1.5 bg-accent/10 text-accent text-xs uppercase font-bold tracking-widest rounded-full mb-6">
                Protocol Utilization
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">Built for modern financial behavior.</h2>
           </ScrollReveal>

           <div className="grid md:grid-cols-3 gap-6">
            <TargetCard 
              icon={<GraduationCap className="w-6 h-6 text-foreground" />}
              title="Students"
              desc="Build an impenetrable foundation of discipline before bad habits cement themselves."
            />
            <TargetCard 
              icon={<Briefcase className="w-6 h-6 text-foreground" />}
              title="Freelancers"
              desc="Protect variable income from unpredictable, emotional spending leaks."
            />
            <TargetCard 
              icon={<Users className="w-6 h-6 text-foreground" />}
              title="Early Professionals"
              desc="Redirect lifestyle creep directly into long-term compounding stability."
            />
         </div>
         </div>
      </section>

      {/* 10. STATEMENT SECTION */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
         <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: "easeOut" }}
         >
           <h2 className="text-5xl md:text-[5rem] lg:text-[7rem] font-bold tracking-tight leading-[1] mb-6 text-black">
             Wealth isn't earned.<br/>It's retained.
           </h2>
           <p className="text-lg text-muted font-light tracking-wide uppercase font-mono text-[11px]">
             The protocol enforces retention.
           </p>
         </motion.div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <section className="py-32 px-6 bg-surface text-center border-y border-border">
        <ScrollReveal className="max-w-2xl mx-auto">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black">Start seeing the real cost.</h2>
           <p className="text-xl text-secondary font-light mb-10">Clarity changes behavior.</p>
           <Link href="/login" className="inline-flex items-center gap-2 px-10 py-5 bg-foreground text-background rounded-full text-sm font-bold tracking-widest uppercase hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/10">
             Analyze Expense <ArrowRight size={16} />
           </Link>
        </ScrollReveal>
      </section>

      {/* 12. FOOTER */}
      <footer className="pt-20 pb-12 px-6 lg:px-12 bg-surface">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
            
            <div className="max-w-sm">
              <div className="flex items-center gap-2 font-medium tracking-tight mb-4">
                <div className="w-4 h-4 bg-accent rounded-sm" />
                <span className="font-bold text-black">ExpenseAutopsy</span>
              </div>
              <p className="text-sm font-light text-secondary leading-relaxed">
                Behavioral finance, simplified.
              </p>
            </div>
            
            <div className="flex gap-16">
              <div className="flex flex-col gap-4 text-sm text-secondary">
                <Link href="#" className="hover:text-foreground transition-colors">Product</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Protocol</Link>
              </div>
              <div className="flex flex-col gap-4 text-sm text-secondary">
                <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
              </div>
            </div>

         </div>

         <div className="max-w-7xl mx-auto pt-8 border-t border-border text-xs font-medium text-muted">
            <p>© 2026 ExpenseAutopsy</p>
         </div>
      </footer>
    </div>
  );
}


/* ── SUBCOMPONENTS ── */

function ScrollReveal({ children, className }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, dark }: any) {
  return (
    <div className={cn("p-8 rounded-xl border transition-all premium-card", dark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-surface border-border hover:border-accent/40")}>
       <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-6 border", dark ? "bg-black/50 border-white/10" : "bg-background border-border")}>
         {icon}
       </div>
       <h3 className="text-lg font-bold mb-2 tracking-tight text-black">{title}</h3>
       <p className={cn("text-sm font-light leading-relaxed", dark ? "text-white/50" : "text-secondary")}>{desc}</p>
    </div>
  );
}

function TargetCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 border border-border rounded-xl bg-surface transition-all premium-card group">
       <div className="mb-4 transition-transform group-hover:scale-110">
         {icon}
       </div>
       <h3 className="text-lg font-bold mb-2 text-black tracking-tight">{title}</h3>
       <p className="text-sm text-secondary font-light leading-relaxed">{desc}</p>
    </div>
  );
}

function StoryNode({ side, step, title, component }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div ref={ref} className={cn("relative flex flex-col md:flex-row items-center gap-8 md:gap-16", side === "right" && "md:flex-row-reverse")}>
       
       <div className="absolute left-[-16px] md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface border-4 border-background shadow-sm flex items-center justify-center z-10 text-[10px] font-mono font-bold text-foreground">
         {step}
       </div>

       <motion.div 
         initial={{ opacity: 0, x: side === "left" ? 30 : -30 }}
         animate={isInView ? { opacity: 1, x: 0 } : {}}
         transition={{ duration: 0.8, ease: "easeOut" }}
         className={cn("w-full md:w-1/2 pl-10 md:pl-0", side === "left" ? "md:text-right" : "md:text-left")}
       >
         <h4 className="text-2xl font-bold mb-6 md:mb-0 text-black">{title}</h4>
       </motion.div>

       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={isInView ? { opacity: 1, scale: 1 } : {}}
         transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
         className="w-full md:w-1/2 pl-10 md:pl-0"
       >
         <div className="w-full max-w-[280px] p-6 bg-surface border border-border rounded-2xl shadow-xl shadow-black/[0.03] mx-auto md:mx-0">
           {component}
         </div>
       </motion.div>

    </div>
  );
}


function StatCard({ value, prefix, suffix, label, icon, noNum }: any) {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, margin: "-10%" });
 
   return (
     <div ref={ref} className="p-8 border border-border rounded-xl bg-surface flex flex-col items-center justify-center text-center shadow-sm premium-card transition-all group">
        <div className="h-16 flex items-center justify-center mb-2">
           {noNum && icon ? icon : (
             <div className="text-5xl font-bold tracking-tighter text-black flex items-center">
               {prefix && <span className="text-3xl opacity-50 pb-1 pr-1">{prefix}</span>}
               {isInView ? <CountUp number={value} /> : "0"}
               {suffix && <span className="text-3xl pb-1 pl-1">{suffix}</span>}
             </div>
           )}
        </div>
        <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">{label}</span>
     </div>
   );
 }

function CountUp({ number, prefix = "", suffix = "", duration = 1.2 }: any) {
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startNum = displayNumber;
    const endNum = number;

    function update(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayNumber(Math.floor(startNum + (endNum - startNum) * easeProgress));

      if (progress < 1) animationFrame = requestAnimationFrame(update);
    }
    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [number, duration]);

  return <span>{prefix}{displayNumber.toLocaleString()}{suffix}</span>;
}

function ProblemCard({ badge, imgSrc, title, desc, location }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-surface text-left rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 border border-border premium-card"
      style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)" }}
    >
      <div className="relative h-60 w-full overflow-hidden bg-background">
        {imgSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={title} className="w-full h-full object-cover grayscale-[0.5] opacity-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700" />
        )}
        <div className="absolute top-5 left-5 px-4 py-1.5 bg-background/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-[#ef4444] shadow-sm">
          {badge}
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest mb-4">
          <Activity className="w-3.5 h-3.5 text-accent" /> {location}
        </div>
        <h3 className="text-3xl font-bold tracking-tight text-black mb-4">{title}</h3>
        <p className="text-sm font-medium text-secondary leading-relaxed mb-8 flex-1">
          {desc}
        </p>
        <div className="pt-5 border-t border-border flex justify-between items-center text-[10px] font-bold text-muted uppercase tracking-widest">
          <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-accent" /> TELEMETRY NODE: ACT-4</span>
          <div className="w-8 h-8 border border-border rounded-full flex items-center justify-center">
             <ShieldAlert className="w-4 h-4 text-muted" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}


