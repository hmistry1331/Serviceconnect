import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrench, Zap, Wind, Hammer, Paintbrush, SprayCan,
  Home as HomeIcon, ArrowRight, Search, CheckCircle2,
  ChevronRight, Clock, Shield, Star,
} from "lucide-react";

/* ═══════════════════════════════════════════
   CATEGORY DATA
   Each category has: problems (example job types),
   includes (what the pro brings), and a gradient pair.
═══════════════════════════════════════════ */
const CATEGORIES = [
  {
    value:       "Plumbing",
    label:       "Plumbing",
    icon:        Wrench,
    tagline:     "Leaks, pipes & water issues",
    description: "From a dripping tap to a burst pipe flooding your kitchen — a verified plumber diagnoses and fixes it the same day. We cover all residential water supply and drainage work.",
    problems: [
      "Dripping or broken tap",
      "Burst or leaking pipe",
      "Blocked drain or sink",
      "No hot water",
      "Toilet running constantly",
      "Water pressure too low",
    ],
    includes: ["Same-day availability", "Parts sourced by worker", "Before/after photo proof"],
    gradStart: "#1a3a2a",
    gradEnd:   "#0a1a12",
    accent:    "#4ade80",
    accentDim: "rgba(74,222,128,0.12)",
    accentBdr: "rgba(74,222,128,0.25)",
  },
  {
    value:       "Electrical",
    label:       "Electrical",
    icon:        Zap,
    tagline:     "Wiring, circuits & power",
    description: "Flickering lights, dead sockets, or a tripped breaker that won't reset — our certified electricians handle everything from basic fault-finding to new circuit installation.",
    problems: [
      "Lights flickering or dead",
      "Socket not working",
      "Tripped circuit breaker",
      "No power in one room",
      "Ceiling fan installation",
      "New socket or switch fitting",
    ],
    includes: ["Certified professionals only", "Safety inspection included", "Compliant with local code"],
    gradStart: "#1a2a3a",
    gradEnd:   "#0a1220",
    accent:    "#60a5fa",
    accentDim: "rgba(96,165,250,0.12)",
    accentBdr: "rgba(96,165,250,0.25)",
  },
  {
    value:       "HVAC",
    label:       "HVAC",
    icon:        Wind,
    tagline:     "AC, heating & ventilation",
    description: "When your AC stops cooling in peak summer or your heater makes strange noises, response time matters. Our HVAC technicians carry the most common replacement parts on every visit.",
    problems: [
      "AC not cooling",
      "AC making loud noise",
      "Heater not working",
      "Thermostat fault",
      "Gas or refrigerant leak",
      "Duct or vent blockage",
    ],
    includes: ["Parts carried on-site", "Refrigerant handling certified", "Emergency slots available"],
    gradStart: "#1a2a3a",
    gradEnd:   "#0a1820",
    accent:    "#7ec8e3",
    accentDim: "rgba(126,200,227,0.12)",
    accentBdr: "rgba(126,200,227,0.25)",
  },
  {
    value:       "Carpentry",
    label:       "Carpentry",
    icon:        Hammer,
    tagline:     "Furniture, doors & woodwork",
    description: "Sagging cabinet doors, a wardrobe that won't close, shelves that need mounting — our carpenters bring the tools and the expertise to fix, build, or install anything wooden in your home.",
    problems: [
      "Cabinet door broken or sagging",
      "Wardrobe not closing",
      "Shelf installation",
      "Door hinge replacement",
      "Wooden flooring repair",
      "Custom furniture assembly",
    ],
    includes: ["Brings all tools", "Custom measurements on-site", "Dust-free working practice"],
    gradStart: "#2a1a0a",
    gradEnd:   "#180e05",
    accent:    "#fb923c",
    accentDim: "rgba(251,146,60,0.12)",
    accentBdr: "rgba(251,146,60,0.25)",
  },
  {
    value:       "Painting",
    label:       "Painting",
    icon:        Paintbrush,
    tagline:     "Interior & exterior walls",
    description: "Whether you want a full room repaint, a feature wall, or just crack-filling before a new coat — our painters prep the surface properly so the finish lasts.",
    problems: [
      "Room needs repainting",
      "Wall cracks before painting",
      "Ceiling water stains",
      "Exterior wall paint peeling",
      "Feature wall accent colour",
      "Furniture touch-up",
    ],
    includes: ["Surface prep included", "Premium paint brands", "Dust sheets and masking provided"],
    gradStart: "#2a1a2a",
    gradEnd:   "#180e18",
    accent:    "#e879f9",
    accentDim: "rgba(232,121,249,0.12)",
    accentBdr: "rgba(232,121,249,0.25)",
  },
  {
    value:       "Cleaning",
    label:       "Cleaning",
    icon:        SprayCan,
    tagline:     "Deep clean & post-construction",
    description: "From a full deep-clean before a property handover to post-renovation dust removal — our cleaning professionals bring commercial-grade equipment and products so you don't have to.",
    problems: [
      "Full house deep clean",
      "Post-construction cleanup",
      "Kitchen deep clean",
      "Bathroom sanitisation",
      "Carpet or upholstery clean",
      "Move-in / move-out clean",
    ],
    includes: ["Commercial equipment", "Eco-friendly products available", "Before/after photoed"],
    gradStart: "#1a2a1a",
    gradEnd:   "#0e180e",
    accent:    "#a3e635",
    accentDim: "rgba(163,230,53,0.12)",
    accentBdr: "rgba(163,230,53,0.25)",
  },
  {
    value:       "Roofing",
    label:       "Roofing",
    icon:        HomeIcon,
    tagline:     "Tiles, leaks & ceiling repairs",
    description: "A water stain on the ceiling means a leak above it. Our roofers inspect, trace the source, and repair — whether it's a cracked tile, a failed sealant, or storm damage.",
    problems: [
      "Ceiling wet patch or stain",
      "Roof tile cracked or missing",
      "Roof leak after rain",
      "Flat roof pooling water",
      "Gutter blocked or broken",
      "Roof inspection before sale",
    ],
    includes: ["Full roof inspection", "Same-day tarp emergency cover", "Documented with photos"],
    gradStart: "#1a1a2a",
    gradEnd:   "#0e0e18",
    accent:    "#a78bfa",
    accentDim: "rgba(167,139,250,0.12)",
    accentBdr: "rgba(167,139,250,0.25)",
  },
];

const TRUST_BADGES = [
  { icon: Shield,       text: "Verified professionals" },
  { icon: Clock,        text: "Response in under 5 min" },
  { icon: Star,         text: "Rated & reviewed" },
  { icon: CheckCircle2, text: "AI-powered matching"     },
];

/* ═══════════════════════════════════════════
   INTERSECTION OBSERVER HOOK
═══════════════════════════════════════════ */
function useInView(threshold = 0.1) {
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
   CATEGORY CARD
═══════════════════════════════════════════ */
function CategoryCard({ cat, index }) {
  const [ref, visible] = useInView(0.08);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const Icon = cat.icon;

  const handlePostJob = () => {
    // Navigate to create-job with category pre-selected via state
    // CreateJobRequest.jsx can read location.state.category
    navigate("/create-job", { state: { category: cat.value } });
  };

  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(160deg, ${cat.gradStart} 0%, ${cat.gradEnd} 100%)`
          : "#0a1818",
        border: `1px solid ${hovered ? cat.accentBdr : "rgba(255,255,255,0.07)"}`,
        borderRadius: 20,
        padding: "28px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        cursor: "default",
        boxShadow: hovered ? `0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px ${cat.accentBdr}` : "none",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-4px)" : "none",
        opacity: visible ? 1 : 0,
        animation: visible ? `fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 0.07}s both` : "none",
      }}
    >
      {/* Icon + label */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
        <div style={{ width:48, height:48, borderRadius:13, background: hovered ? cat.accentDim : "rgba(232,197,71,0.07)", border:`1px solid ${hovered ? cat.accentBdr : "rgba(232,197,71,0.12)"}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s", flexShrink:0 }}>
          <Icon size={22} color={hovered ? cat.accent : "#e8c547"} strokeWidth={1.8} style={{ transition:"color 0.3s" }} />
        </div>
        <span style={{ fontSize:11, fontWeight:700, color: hovered ? cat.accent : "#3a6060", background: hovered ? cat.accentDim : "rgba(255,255,255,0.04)", border:`1px solid ${hovered ? cat.accentBdr : "rgba(255,255,255,0.07)"}`, borderRadius:20, padding:"3px 10px", transition:"all 0.3s", whiteSpace:"nowrap" }}>
          {cat.tagline}
        </span>
      </div>

      {/* Name + description */}
      <h2 style={{ fontSize:22, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:8 }}>{cat.label}</h2>
      <p style={{ fontSize:13, color:"#6a9090", lineHeight:1.7, marginBottom:22 }}>{cat.description}</p>

      {/* Example problems */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3a6060", marginBottom:10 }}>
          We handle
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 12px" }}>
          {cat.problems.map((p) => (
            <div key={p} style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background: hovered ? cat.accent : "#e8c547", flexShrink:0, transition:"background 0.3s" }} />
              <span style={{ fontSize:12, color:"#8aacac" }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Includes chips */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:24 }}>
        {cat.includes.map((inc) => (
          <span key={inc} style={{ fontSize:11, color: hovered ? cat.accent : "#4a7070", background: hovered ? cat.accentDim : "rgba(255,255,255,0.04)", border:`1px solid ${hovered ? cat.accentBdr : "rgba(255,255,255,0.07)"}`, borderRadius:20, padding:"4px 10px", fontWeight:500, transition:"all 0.3s" }}>
            ✓ {inc}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop:"auto", display:"flex", gap:10 }}>
        <button onClick={handlePostJob}
          style={{ flex:1, height:44, background: hovered ? cat.accent : "#e8c547", border:"none", borderRadius:11, color:"#0d1a1a", fontSize:13, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"background 0.3s, transform 0.1s" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          Post a job <ArrowRight size={14} strokeWidth={2.5} />
        </button>
        <Link to="/how-it-works" style={{ textDecoration:"none" }}>
          <button style={{ height:44, padding:"0 14px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, color:"#6a9090", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"border-color 0.15s, color 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"; e.currentTarget.style.color="#b0c8c8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";  e.currentTarget.style.color="#6a9090"; }}
          >
            Learn more <ChevronRight size={13} />
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function Services() {
  const [search, setSearch] = useState("");
  const [heroRef, heroVisible] = useInView(0.1);

  const filtered = CATEGORIES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline.toLowerCase().includes(search.toLowerCase()) ||
      c.problems.some((p) => p.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight:"100vh", background:"#020b0b", color:"#fff", fontFamily:"'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }
        .search-input:focus { outline:none; border-color:rgba(232,197,71,0.45) !important; box-shadow:0 0 0 3px rgba(232,197,71,0.08); }
        .cta-primary { transition:background 0.15s, transform 0.1s; }
        .cta-primary:hover { background:#d4b33e !important; }
        .cta-primary:active { transform:scale(0.98); }
      `}</style>

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} style={{ padding:"96px 24px 64px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        {/* Radial ambient */}
        <div style={{ position:"absolute", top:"0%", left:"50%", transform:"translateX(-50%)", width:700, height:400, background:"radial-gradient(ellipse,rgba(232,197,71,0.05) 0%,transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:720, margin:"0 auto", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(24px)", transition:"opacity 0.7s ease, transform 0.7s ease" }}>
          {/* Eyebrow */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(232,197,71,0.07)", border:"1px solid rgba(232,197,71,0.18)", borderRadius:20, padding:"6px 16px", marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#e8c547", animation:"pulseDot 2s ease-in-out infinite" }} />
            <span style={{ fontSize:12, fontWeight:700, color:"#e8c547", letterSpacing:"0.1em", textTransform:"uppercase" }}>7 trade categories</span>
          </div>

          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(38px,6vw,68px)", fontWeight:700, color:"#fff", letterSpacing:"-0.025em", lineHeight:1.05, marginBottom:16 }}>
            Every home service,<br />
            <span style={{ background:"linear-gradient(135deg,#f3d878,#e8c547,#b8893a)", WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>
              one platform
            </span>
          </h1>

          <p style={{ fontSize:17, color:"#6a9090", lineHeight:1.75, maxWidth:500, margin:"0 auto 36px" }}>
            Describe your problem and our AI connects you with a verified local professional in under 5 minutes — no phone calls, no guessing.
          </p>

          {/* Trust badges row */}
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:10, marginBottom:40 }}>
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"7px 14px" }}>
                <Icon size={13} color="#e8c547" />
                <span style={{ fontSize:12, color:"#8aacac", fontWeight:500 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ position:"relative", maxWidth:520, margin:"0 auto" }}>
            <Search size={16} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:"#4a7070", pointerEvents:"none" }} />
            <input
              className="search-input"
              type="text"
              placeholder="Search — e.g. 'AC not cooling', 'burst pipe', 'painting'…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width:"100%", height:52, paddingLeft:44, paddingRight:16, background:"rgba(10,24,24,0.9)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, color:"#fff", fontSize:14, transition:"border-color 0.2s, box-shadow 0.2s" }}
            />
          </div>

          {search && (
            <p style={{ fontSize:13, color:"#4a7070", marginTop:12 }}>
              {filtered.length > 0
                ? `${filtered.length} categor${filtered.length === 1 ? "y" : "ies"} match "${search}"`
                : `No categories match "${search}" — try a different term`}
            </p>
          )}
        </div>
      </section>

      {/* ══════════ CATEGORY GRID ══════════ */}
      <section id="services" style={{ padding:"0 24px 96px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"64px 24px" }}>
              <p style={{ fontSize:32, marginBottom:12 }}>🔍</p>
              <p style={{ fontSize:16, color:"#4a7070" }}>No services match that search.</p>
              <button onClick={() => setSearch("")} style={{ marginTop:16, background:"none", border:"1px solid rgba(232,197,71,0.3)", borderRadius:10, padding:"8px 20px", color:"#e8c547", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                Clear search
              </button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:18 }}>
              {filtered.map((cat, i) => (
                <CategoryCard key={cat.value} cat={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ BOTTOM CTA ══════════ */}
      <section style={{ background:"#060f0f", borderTop:"1px solid rgba(255,255,255,0.05)", padding:"72px 24px" }}>
        <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:14 }}>
            Don't see your exact issue?
          </h2>
          <p style={{ fontSize:15, color:"#5a8080", lineHeight:1.7, marginBottom:32 }}>
            Just describe your problem in plain language — our AI will figure out the right trade for you automatically. You don't need to know what category it falls under.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link to="/create-job" style={{ textDecoration:"none" }}>
              <button className="cta-primary" style={{ height:52, padding:"0 28px", background:"#e8c547", border:"none", borderRadius:13, color:"#0d1a1a", fontSize:15, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                Describe your problem <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </Link>
            <Link to="/how-it-works" style={{ textDecoration:"none" }}>
              <button style={{ height:52, padding:"0 28px", background:"transparent", border:"1px solid rgba(255,255,255,0.15)", borderRadius:13, color:"#b0c8c8", fontSize:15, fontWeight:600, cursor:"pointer", transition:"border-color 0.15s, color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(232,197,71,0.4)"; e.currentTarget.style.color="#e8c547"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.color="#b0c8c8"; }}
              >
                How it works
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
