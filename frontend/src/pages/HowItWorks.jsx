import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare, ScanLine, Users, CheckCircle2,
  Star, Wrench, Zap, Wind, Hammer, Paintbrush,
  SprayCan, Home as HomeIcon, ShieldCheck,
  ArrowRight, Clock, IndianRupee, MapPin,
} from "lucide-react";

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const CUSTOMER_STEPS = [
  {
    icon: MessageSquare,
    tag: "Step 01",
    title: "Describe your problem",
    body: "Skip the dropdown menus. Just type what's wrong in plain language — 'my bathroom pipe burst' or 'AC stopped cooling last night'. No trade knowledge needed.",
    detail: "Our AI reads your exact words, not keywords.",
    visual: "chat",
  },
  {
    icon: ScanLine,
    tag: "Step 02",
    title: "AI finds the right trade",
    body: "LangChain sends your description to an LLM which classifies it into one of 7 verified trade categories. You see the result and a confidence score — and you can override it if it's wrong.",
    detail: "Classification takes under 5 seconds.",
    visual: "classify",
  },
  {
    icon: Users,
    tag: "Step 03",
    title: "Professionals are alerted",
    body: "Only workers whose trade and service area match your job see the request. No spam, no irrelevant leads — every professional in the feed is qualified for your specific problem.",
    detail: "Live push via WebSocket — not email delays.",
    visual: "notify",
  },
  {
    icon: IndianRupee,
    tag: "Step 04",
    title: "Review quotes & accept",
    body: "Workers who are interested submit a price quote directly to you. Compare quotes, read worker profiles and ratings, then accept the one you trust.",
    detail: "You negotiate — we never lock in a price.",
    visual: "quote",
  },
  {
    icon: CheckCircle2,
    tag: "Step 05",
    title: "Job done, review the pro",
    body: "Once the worker marks the job complete, you confirm it from your dashboard. Then leave a star rating and review — which helps every future customer make a better choice.",
    detail: "Your review is public on the worker's profile.",
    visual: "done",
  },
];

const WORKER_STEPS = [
  {
    icon: ShieldCheck,
    tag: "Step 01",
    title: "Sign up & get verified",
    body: "Register with your trade category and service area. Our admin team reviews your profile before you go live — so every customer knows you're a real, checked professional.",
    detail: "Usually verified within 24 hours.",
  },
  {
    icon: MapPin,
    tag: "Step 02",
    title: "See only relevant jobs",
    body: "Your feed shows only jobs in your trade and within your service area radius. No scrolling through hundreds of irrelevant listings — every card is a potential match.",
    detail: "Geo-filtered to your declared service zone.",
  },
  {
    icon: IndianRupee,
    tag: "Step 03",
    title: "Accept & quote on your terms",
    body: "Tap Accept on any job you want. Then submit your price quote — you decide what the job is worth. The customer can accept, decline, or message you to negotiate.",
    detail: "You set the price. Always.",
  },
  {
    icon: Clock,
    tag: "Step 04",
    title: "Complete & get paid",
    body: "Do the job, upload before/after photos from your app, then mark it complete. Payment follows the agreed method — in-app or cash.",
    detail: "Photos protect you if a dispute ever arises.",
  },
  {
    icon: Star,
    tag: "Step 05",
    title: "Build your reputation",
    body: "Every completed job adds to your rating and review history — visible on your public profile. Top-rated workers appear higher in the feed and win more leads automatically.",
    detail: "Your reviews are your marketing.",
  },
];

const CATEGORIES = [
  { icon: Wrench,     name: "Plumbing",   count: "Leaks, pipes & fixtures"        },
  { icon: Zap,        name: "Electrical",  count: "Wiring, panels & lighting"      },
  { icon: Wind,       name: "HVAC",        count: "AC, heating & ventilation"      },
  { icon: Hammer,     name: "Carpentry",   count: "Cabinets, doors & wood"         },
  { icon: Paintbrush, name: "Painting",    count: "Interior & exterior walls"      },
  { icon: SprayCan,   name: "Cleaning",    count: "Deep clean & post-construction" },
  { icon: HomeIcon,   name: "Roofing",     count: "Tiles, leaks & roof repair"     },
];

const FAQS = [
  {
    q: "Is ServiceConnect free to use as a customer?",
    a: "Signing up and posting a job is completely free. You only pay the agreed price directly to the worker — we charge no booking fees on top.",
  },
  {
    q: "How does the AI categorisation actually work?",
    a: "Your problem description is sent to a LangChain pipeline that uses a large language model to classify it into one of our 7 service categories. The result includes a confidence score, and you can always override the AI choice before confirming.",
  },
  {
    q: "What if I don't get any quotes?",
    a: "If no worker accepts your request within a reasonable time, we recommend broadening your service area or adjusting your budget. You can also edit and repost the job at any time.",
  },
  {
    q: "How are workers verified?",
    a: "Every worker who registers goes through an admin review before their profile goes live. Workers who receive poor ratings or dispute flags are reviewed again automatically.",
  },
  {
    q: "Can I cancel a job after accepting a quote?",
    a: "Yes — you can cancel before work starts. Once a worker has begun and uploaded a before-photo, cancellation triggers a review by our team to ensure fair treatment for both sides.",
  },
];

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ═══════════════════════════════════════════
   STEP VISUAL MOCKUPS
═══════════════════════════════════════════ */
function ChatMockup() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3a6060", marginBottom:4 }}>You type…</p>
      <div style={{ background:"rgba(232,197,71,0.08)", border:"1px solid rgba(232,197,71,0.18)", borderRadius:"14px 14px 4px 14px", padding:"12px 16px" }}>
        <p style={{ fontSize:13, color:"#e8e0c8", lineHeight:1.65 }}>"My bathroom pipe burst under the sink — water is leaking everywhere"</p>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", gap:3 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#e8c547", opacity:0.6, animation:`dotBounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
          ))}
        </div>
        <span style={{ fontSize:12, color:"#4a7070" }}>AI is analysing…</span>
      </div>
    </div>
  );
}

function ClassifyMockup() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3a6060" }}>AI result</p>
      <div style={{ background:"rgba(29,158,117,0.1)", border:"1px solid rgba(29,158,117,0.3)", borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:"rgba(29,158,117,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Wrench size={18} color="#1D9E75" />
        </div>
        <div>
          <p style={{ fontSize:17, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>Plumbing</p>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
            <div style={{ width:48, height:3, borderRadius:2, background:"rgba(29,158,117,0.25)", overflow:"hidden" }}>
              <div style={{ width:"95%", height:"100%", background:"#1D9E75", borderRadius:2 }} />
            </div>
            <span style={{ fontSize:11, color:"#1D9E75", fontWeight:600 }}>95% confidence</span>
          </div>
        </div>
      </div>
      {[{ name:"HVAC", pct:3 },{ name:"Carpentry", pct:2 }].map(c => (
        <div key={c.name} style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, color:"#3a6060", width:64 }}>{c.name}</span>
          <div style={{ flex:1, height:3, borderRadius:2, background:"rgba(255,255,255,0.05)" }}>
            <div style={{ width:`${c.pct*10}%`, height:"100%", background:"rgba(255,255,255,0.15)", borderRadius:2 }} />
          </div>
          <span style={{ fontSize:10, color:"#2a4040" }}>{c.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function NotifyMockup() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3a6060" }}>Worker feed — live</p>
      {[
        { name:"Rajan M.", dist:"1.2 km", rating:"4.9", isNew:true  },
        { name:"Suresh P.", dist:"2.8 km", rating:"4.7", isNew:false },
        { name:"Amit K.",  dist:"3.1 km", rating:"4.8", isNew:false },
      ].map((w,i) => (
        <div key={w.name} style={{ background: w.isNew ? "rgba(232,197,71,0.06)" : "rgba(255,255,255,0.02)", border:`1px solid ${w.isNew ? "rgba(232,197,71,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", opacity: 1 - i*0.15 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(232,197,71,0.1)", border:"1px solid rgba(232,197,71,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#e8c547" }}>{w.name[0]}</div>
            <div>
              <p style={{ fontSize:12, fontWeight:600, color:"#fff" }}>{w.name}</p>
              <p style={{ fontSize:10, color:"#4a7070" }}>{w.dist} · ★ {w.rating}</p>
            </div>
          </div>
          {w.isNew && <span style={{ fontSize:10, fontWeight:700, color:"#e8c547", background:"rgba(232,197,71,0.12)", border:"1px solid rgba(232,197,71,0.2)", borderRadius:6, padding:"2px 7px" }}>NEW</span>}
        </div>
      ))}
    </div>
  );
}

function QuoteMockup() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3a6060" }}>Quote received</p>
      <div style={{ background:"rgba(29,158,117,0.08)", border:"1px solid rgba(29,158,117,0.25)", borderRadius:14, padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
          <div>
            <p style={{ fontSize:12, color:"#8aacac" }}>Rajan M. · Plumber</p>
            <p style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:"-0.03em", marginTop:2 }}>₹ 850</p>
          </div>
          <span style={{ fontSize:10, fontWeight:700, color:"#1D9E75", background:"rgba(29,158,117,0.12)", border:"1px solid rgba(29,158,117,0.2)", borderRadius:6, padding:"2px 8px" }}>Verified</span>
        </div>
        <p style={{ fontSize:11, color:"#5a8080", lineHeight:1.6, marginBottom:12 }}>"Will replace the burst section and check all fittings."</p>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ flex:1, height:32, background:"#e8c547", border:"none", borderRadius:8, color:"#0d1a1a", fontSize:11, fontWeight:800, cursor:"pointer" }}>Accept</button>
          <button style={{ flex:1, height:32, background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#5a8080", fontSize:11, fontWeight:600, cursor:"pointer" }}>Decline</button>
        </div>
      </div>
    </div>
  );
}

function DoneMockup() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"center", padding:"12px 0" }}>
      <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(29,158,117,0.12)", border:"2px solid rgba(29,158,117,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <CheckCircle2 size={26} color="#1D9E75" />
      </div>
      <p style={{ fontSize:14, fontWeight:700, color:"#fff" }}>Job completed!</p>
      <div style={{ display:"flex", gap:3 }}>
        {[1,2,3,4,5].map(s => (
          <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#e8c547" stroke="#e8c547" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
      <p style={{ fontSize:12, color:"#5a8080", textAlign:"center", lineHeight:1.6, maxWidth:200 }}>"Professional and fast. Pipe fixed in under an hour!"</p>
    </div>
  );
}

const VISUAL_MAP = { chat: ChatMockup, classify: ClassifyMockup, notify: NotifyMockup, quote: QuoteMockup, done: DoneMockup };

/* ═══════════════════════════════════════════
   FAQ ITEM
═══════════════════════════════════════════ */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"20px 0" }}>
      <button onClick={() => setOpen(p => !p)}
        style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:16 }}>
        <span style={{ fontSize:15, fontWeight:600, color:"#e0e8e8", lineHeight:1.4 }}>{q}</span>
        <div style={{ width:24, height:24, borderRadius:"50%", background: open ? "rgba(232,197,71,0.15)" : "rgba(255,255,255,0.05)", border:`1px solid ${open ? "rgba(232,197,71,0.3)" : "rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
          <span style={{ color: open ? "#e8c547" : "#6a9090", fontSize:16, lineHeight:1, transform: open ? "rotate(45deg)" : "none", display:"block", transition:"transform 0.2s" }}>+</span>
        </div>
      </button>
      {open && (
        <p style={{ fontSize:14, color:"#6a9090", lineHeight:1.75, marginTop:12, paddingRight:40 }}>{a}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP CARD
═══════════════════════════════════════════ */
function StepCard({ step, index, flip }) {
  const [ref, visible] = useInView(0.12);
  const Visual = VISUAL_MAP[step.visual];
  const Icon = step.icon;

  return (
    <div ref={ref} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center",
      opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(32px)", transition:`opacity 0.65s ease ${index*0.08}s, transform 0.65s ease ${index*0.08}s` }}>

      {/* Text side */}
      <div style={{ order: flip ? 2 : 1 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(232,197,71,0.07)", border:"1px solid rgba(232,197,71,0.18)", borderRadius:20, padding:"5px 14px", marginBottom:20 }}>
          <Icon size={13} color="#e8c547" />
          <span style={{ fontSize:11, fontWeight:700, color:"#e8c547", letterSpacing:"0.08em" }}>{step.tag}</span>
        </div>
        <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(24px,3vw,34px)", fontWeight:700, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.15, marginBottom:14 }}>
          {step.title}
        </h3>
        <p style={{ fontSize:15, color:"#6a9090", lineHeight:1.75, marginBottom:16, maxWidth:440 }}>{step.body}</p>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#e8c547", flexShrink:0 }} />
          <p style={{ fontSize:13, color:"#4a7070", fontWeight:500 }}>{step.detail}</p>
        </div>
      </div>

      {/* Visual side */}
      {Visual ? (
        <div style={{ order: flip ? 1 : 2, background:"#0a1818", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"24px 22px", boxShadow:"0 24px 60px rgba(0,0,0,0.4)" }}>
          {/* Window chrome */}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:18 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background: i===0 ? "rgba(232,197,71,0.4)" : "rgba(255,255,255,0.1)" }} />)}
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)", marginLeft:6 }} />
          </div>
          <Visual />
        </div>
      ) : (
        /* Worker steps without a visual — simple numbered accent */
        <div style={{ order: flip ? 1 : 2, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:120, height:120, borderRadius:"50%", background:"rgba(232,197,71,0.05)", border:"1px solid rgba(232,197,71,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon size={40} color="rgba(232,197,71,0.6)" strokeWidth={1.5} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("customer");
  const [heroRef, heroVisible] = useInView(0.1);

  return (
    <div style={{ minHeight:"100vh", background:"#020b0b", color:"#fff", fontFamily:"'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes dotBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lineGrow { from{width:0} to{width:100%} }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { color: #e8c547 !important; }
        .cat-chip { transition: border-color 0.18s, background 0.18s, transform 0.18s; }
        .cat-chip:hover { border-color: rgba(232,197,71,0.35) !important; background: rgba(232,197,71,0.06) !important; transform: translateY(-2px); }
        .cta-btn { transition: background 0.15s, transform 0.1s; }
        .cta-btn:hover { background: #d4b33e !important; }
        .cta-btn:active { transform: scale(0.98); }
        .outline-btn { transition: border-color 0.15s, color 0.15s; }
        .outline-btn:hover { border-color: rgba(232,197,71,0.45) !important; color: #e8c547 !important; }
        @media (max-width: 768px) {
          .step-grid { grid-template-columns: 1fr !important; }
          .step-grid > div { order: unset !important; }
        }
      `}</style>

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} style={{ padding:"100px 24px 72px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        {/* Ambient bg */}
        <div style={{ position:"absolute", top:"-10%", left:"50%", transform:"translateX(-50%)", width:600, height:400, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(232,197,71,0.06) 0%,transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:760, margin:"0 auto", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(24px)", transition:"opacity 0.7s ease, transform 0.7s ease" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(232,197,71,0.07)", border:"1px solid rgba(232,197,71,0.18)", borderRadius:20, padding:"6px 16px", marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#e8c547", animation:"dotBounce 1.5s ease-in-out infinite" }} />
            <span style={{ fontSize:12, fontWeight:700, color:"#e8c547", letterSpacing:"0.1em", textTransform:"uppercase" }}>How It Works</span>
          </div>

          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(36px,6vw,68px)", fontWeight:700, color:"#fff", letterSpacing:"-0.025em", lineHeight:1.05, marginBottom:20 }}>
            From a problem described<br />
            <span style={{ background:"linear-gradient(135deg,#f3d878,#e8c547,#b8893a)", WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>
              to a job completed
            </span>
          </h1>

          <p style={{ fontSize:17, color:"#6a9090", lineHeight:1.75, maxWidth:520, margin:"0 auto 40px" }}>
            ServiceConnect uses AI to match homeowners with the right local professional — without dropdowns, phone calls, or guesswork.
          </p>

          {/* Role tabs */}
          <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:4, gap:4, marginBottom:0 }}>
            {[{ key:"customer", label:"I'm a customer" },{ key:"worker", label:"I'm a worker" }].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className="tab-btn"
                style={{ padding:"9px 22px", borderRadius:11, border:"none", cursor:"pointer", fontSize:14, fontWeight:700, transition:"all 0.2s",
                  background: activeTab===t.key ? "#e8c547" : "transparent",
                  color: activeTab===t.key ? "#0d1a1a" : "#6a9090",
                  boxShadow: activeTab===t.key ? "0 3px 12px rgba(232,197,71,0.3)" : "none",
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ STEPS ══════════ */}
      <section style={{ padding:"0 24px 96px" }}>
        <div style={{ maxWidth:1080, margin:"0 auto", display:"flex", flexDirection:"column", gap:80 }}>
          {(activeTab === "customer" ? CUSTOMER_STEPS : WORKER_STEPS).map((step, i) => (
            <StepCard key={step.tag + activeTab} step={step} index={i} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ══════════ CATEGORIES STRIP ══════════ */}
      <section style={{ background:"#060f0f", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"56px 24px" }}>
        <div style={{ maxWidth:1080, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#e8c547", marginBottom:8 }}>7 trade categories</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(24px,3.5vw,36px)", fontWeight:700, color:"#fff", letterSpacing:"-0.02em" }}>
              Every home service, covered
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:12 }}>
            {CATEGORIES.map(({ icon: Icon, name, count }) => (
              <div key={name} className="cat-chip" style={{ display:"flex", alignItems:"center", gap:12, background:"#0a1818", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 16px", cursor:"default" }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"rgba(232,197,71,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon size={17} color="#e8c547" strokeWidth={1.8} />
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:"#e0e8e8", marginBottom:2 }}>{name}</p>
                  <p style={{ fontSize:11, color:"#3a6060" }}>{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#e8c547", marginBottom:8 }}>FAQ</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(24px,3.5vw,38px)", fontWeight:700, color:"#fff", letterSpacing:"-0.02em" }}>
              Common questions
            </h2>
          </div>
          {FAQS.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ padding:"72px 24px 96px", textAlign:"center", background:"#060f0f", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(28px,4vw,42px)", fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:14 }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize:15, color:"#5a8080", lineHeight:1.7, marginBottom:32 }}>
            Post your first job in under 2 minutes — no phone calls, no waiting. Just describe the problem and let the AI handle the rest.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link to="/signup" style={{ textDecoration:"none" }}>
              <button className="cta-btn" style={{ height:52, padding:"0 28px", background:"#e8c547", border:"none", borderRadius:13, color:"#0d1a1a", fontSize:15, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                Post a job now <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration:"none" }}>
              <button className="outline-btn" style={{ height:52, padding:"0 28px", background:"transparent", border:"1px solid rgba(255,255,255,0.15)", borderRadius:13, color:"#b0c8c8", fontSize:15, fontWeight:600, cursor:"pointer" }}>
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
