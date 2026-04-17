# ExpenseAutopsy Design System

## 1. Aesthetic & Brand Identity
**Theme:** Premium, Editorial-Grade, High-Trust SaaS.
**Vibe:** "Algorithmic Accountability". Visually stripped-back to feel non-generative, serious, and deeply analytical.
**Core Visual Motifs:** 
- Heavy application of negative space (spacious `py-32` padding).
- High visual tension between traditional serif typography and technical monospaced accents.
- Subtle, systemic feedback loops (animated node indicators, progress bars, layout borders).

## 2. Color Palette
The app uses targeted custom Hex values alongside carefully dialed utility tailwind colors. We avoid pure, generic colors to maintain the "premium" feel.

### Background Colors
- **Bone/Off-White (Base):** `#F7F7F5` 
- **Pure Black (Inverted Sections/Hero CTA):** `#0B0B0B`
- **Pure White (Cards/Surfaces):** `#FFFFFF` (often bordered with `black/5`)
- **Light Red Wash (Problem Sections):** `#FFF9FA`
- **Light Green Wash (Value Sections):** `#F5FAF7`
- **Light Blue Wash (Execution/Flow):** `#FAFCFF`

### Text Colors
- **Heavy Headings:** `#1a202c`, `#0F172A`
- **Primary Body:** `text-black/60` (`rgba(0,0,0,0.6)`), `#4a5568`, `#334155`
- **Muted/Technical Body:** `text-black/40`, `text-white/50`

### Accent Colors
- **Activity/Success Green:** `#0E9F6E` (Used for trust signals, primary actions, and "solution" emphasis)
- **Danger/Debt Red:** `#ef4444`, `red-500`, `red-600` (Used for "Problem" alerts, debt representation)
- **Execution Blue:** `blue-500`, `text-blue-600`
- **Reward Amber:** `from-amber-400 to-amber-600` (Gradient for achievement/verification badges)

## 3. Typography
A clear trichotomy of font families controls the reading hierarchy and sets the brand voice.

1. **Serif (`font-serif`):** 
   - Used for all major headings (`h1`, `h2`, `h3`, massive numbers).
   - *Example Use:* `text-6xl md:text-[7rem] font-serif leading-[0.95] tracking-tighter`
   - *Psychology:* Creates an editorial, institutional trust factor, giving the app gravitas.

2. **Sans-Serif (`font-sans`):**
   - Used for standard body copy, paragraphs, and UI links.
   - *Example Use:* `font-light text-black/60 leading-relaxed`
   - *Psychology:* Clean, modern readability that doesn't distract from the analytical tone.

3. **Monospace (`font-mono`):**
   - Used for system outputs, labels, IDs, tags, financial projections.
   - *Example Use:* `text-[10px] font-mono tracking-widest uppercase`
   - *Psychology:* Reinforces the "algorithm/protocol" aesthetic, reminding the user it is a robust computation system.

## 4. Components & Shapes
The UI language relies on precision engineering rather than playful, generative bubbles.

- **Buttons:** Fully rounded capsules (`rounded-full`), typically high contrast (`bg-[#0B0B0B] text-white`) with wide tracking lowercase utility caps (`uppercase tracking-widest`). Characterized by smooth hover translations (`hover:-translate-y-0.5`).
- **Cards:** Semi-rounded bounds (`rounded-xl` to `rounded-3xl`), stark white or bone surfaces with extremely subtle borders (`border-black/5`) and micro-shadows (`shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]`).
- **Badges/Tags:** Pill-shaped (`rounded-full`), highly tracked uppercase text, often paired with a pulsing "node" indicator (e.g., `<span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />`).

## 5. Motion & Interaction
Animations run on **Framer Motion** and mimic data processing rather than "bouncy web" aesthetics.

- **Scroll Reveals:** Gradual fade-ins and subtle y-axis translations (`y: 30` to `y: 0` over `0.8s`, `easeOut`).
- **Data Plotting:** Slowly drawn background SVG traces (`motion.path` with `pathLength`) simulating market charts.
- **Simulated Processing:** Staggered height animations that mirror data computation loops (e.g., the "AI Calculates" vertical bars bouncing dynamically).
- **Cinematic Counting:** Number counting mechanisms used for financial impact figures to reinforce the weight and gravity of compound loss.

## 6. Iconography
- Handled exclusively via **Lucide React**.
- Icons are minimal, geometric, and scale down beautifully.
- Usually paired with strict border radii or glass backgrounds (`w-10 h-10 rounded-lg flex items-center justify-center bg-[#F7F7F5] border-black/5`).
- Used purposefully to anchor layout structure, rather than strictly to decorate (e.g., `Activity`, `ArrowRight`, `LockKeyhole`, `Clock`).
