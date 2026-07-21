import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench, Zap, Wind, Hammer, Paintbrush, SprayCan,
  Home as HomeIcon, ArrowRight, Code2, Database,
  Cpu, Globe, Shield, Star, Clock, Users,
} from "lucide-react";

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const STATS = [
  { value: "7",    label: "Service categories",     icon: Wrench   },
  { value: "AI",   label: "Powered classification", icon: Cpu      },
  { value: "< 5m", label: "Average match time",     icon: Clock    },
  { value: "2",    label: "User roles supported",   icon: Users    },
];

const TECH_STACK = [
  { layer: "Frontend",       items: ["React (Vite)", "Tailwind CSS", "Zustand", "TanStack Query"] },
  { layer: "Backend",        items: ["Spring Boot", "Spring Security", "JWT Auth", "JPA / Hibernate"] },
  { layer: "AI Layer",       items: ["LangChain", "OpenAI / Gemini", "NLP Classification"] },
  { layer: "Database",       items: ["PostgreSQL", "Spring Data JPA"] },
  { layer: "Auth",           items: ["Google OAuth 2.0", "JWT Tokens", "RBAC"] },
];

const VALUES = [
  {
    icon: Shield,
    title: "Trust first",
    body: "Every worker on the platform goes through an admin verification before their profile goes live. Customers see only checked, rated professionals.",
  },
  {
    icon: Cpu,
    title: "AI that assists, not decides",
    body: "The LLM classifies your problem description, but you always see the result and can override it. Technology helps — humans stay in control.",
  },
  {
    icon: Star,
    title: "Transparent reputation",
    body: "Every completed job can be rated. Reviews are public on worker profiles and cannot be edited or removed by workers — only by admins in genuine dispute cases.",
  },
  {
    icon: Globe,
    title: "Local first",
    body: "Jobs are geo-matched to workers within a configurable radius. No national directories, no out-of-area leads — only professionals who can actually show up.",
  },
];

const TIMELINE = [
  { date: "Jan 2025", label: "Idea & PRD",      body: "Problem identified: homeowners struggle to find the right trade professional. PRD written with 5 development phases." },
  { date: "Feb 2025", label: "Phase 1 — Core",  body: "Spring Boot backend built with JWT auth, user/worker entities, and all 7 CRUD APIs. Role-based access control implemented." },
  { date: "Mar 2025", label: "Phase 2 — AI",    body: "LangChain + LLM integration for 7-category NLP classification. Confidence scoring and manual override added." },
  { date: "Apr 2025", label: "Phase 3 — React", body: "Full React frontend built — Home, Auth, Dashboard, Worker Feed, CreateJobRequest, Admin panel, and all connected to backend APIs." },
  { date: "May 2025", label: "Phase 4 — Polish",body: "Google OAuth, geo-matching, before/after photos, reviews, notifications, and a complete design system rollout." },
];

/* ══════════════════════════════════════
   HOOKS
══════════════════════════════════════ */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeSection({ children, delay = 0 }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════ */
function SectionHeader({ eyebrow, title, sub, center = true }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 48 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#e8c547", marginBottom: 10 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: sub ? 14 : 0 }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: 15, color: "#5a8080", lineHeight: 1.7, maxWidth: 520, margin: center ? "0 auto" : "0" }}>{sub}</p>}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function About() {
  const [heroRef, heroVisible] = useInView(0.1);

  return (
    <div style={{ minHeight: "100vh", background: "#020b0b", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.5)} }
        .value-card { transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
        .value-card:hover { border-color: rgba(232,197,71,0.3) !important; transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
        .tech-chip { transition: border-color 0.15s, background 0.15s, color 0.15s; }
        .tech-chip:hover { border-color: rgba(232,197,71,0.35) !important; background: rgba(232,197,71,0.06) !important; color: #e8c547 !important; }
        .cta-btn { transition: background 0.15s, transform 0.1s; }
        .cta-btn:hover { background: #d4b33e !important; }
        .cta-btn:active { transform: scale(0.98); }
      `}</style>

      {/* ══ HERO ══ */}
      <section ref={heroRef} style={{ padding: "96px 24px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse,rgba(232,197,71,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(232,197,71,0.07)", border: "1px solid rgba(232,197,71,0.18)", borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8c547", animation: "pulseDot 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#e8c547", letterSpacing: "0.1em", textTransform: "uppercase" }}>About ServiceConnect</span>
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(38px,6vw,70px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.05, marginBottom: 20 }}>
            Built to solve a real<br />
            <span style={{ background: "linear-gradient(135deg,#f3d878,#e8c547,#b8893a)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              home services problem
            </span>
          </h1>

          <p style={{ fontSize: 17, color: "#6a9090", lineHeight: 1.8, maxWidth: 580, margin: "0 auto 40px" }}>
            Homeowners waste hours searching for the right trade. Workers waste time on irrelevant leads.
            ServiceConnect uses AI to fix both sides of that equation — instantly.
          </p>

          {/* Stat cards row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, maxWidth: 680, margin: "0 auto" }}>
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} style={{ background: "#0a1818", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(232,197,71,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <Icon size={16} color="#e8c547" strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#e8c547", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: 11, color: "#4a7070", marginTop: 4, lineHeight: 1.4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROBLEM STATEMENT ══ */}
      <section style={{ background: "#060f0f", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <FadeSection>
            <SectionHeader eyebrow="The problem" title="Why does finding a plumber feel like a full-time job?" center={false} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                "Existing platforms force you to self-diagnose which trade you need",
                "Searching online returns national directories with no local relevance",
                "Phone calls, no-shows, and opaque pricing waste your entire morning",
                "Workers receive irrelevant leads outside their trade or location",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, color: "#f87171", fontWeight: 700 }}>✕</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#6a9090", lineHeight: 1.65 }}>{point}</p>
                </div>
              ))}
            </div>
          </FadeSection>

          <FadeSection delay={0.15}>
            <SectionHeader eyebrow="The solution" title="One description. The right professional. Under 5 minutes." center={false} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                "Describe your problem in plain language — no trade knowledge needed",
                "AI classifies it into the correct category with a confidence score",
                "Only geo-matched, verified workers in your area see the job",
                "Workers quote on their terms — you accept the one you trust",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, color: "#1D9E75", fontWeight: 700 }}>✓</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#6a9090", lineHeight: 1.65 }}>{point}</p>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ══ VALUES ══ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeSection>
            <SectionHeader eyebrow="Our principles" title="What we stand for" sub="These four values shape every product and engineering decision we make." />
          </FadeSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {VALUES.map(({ icon: Icon, title, body }, i) => (
              <FadeSection key={title} delay={i * 0.08}>
                <div className="value-card" style={{ background: "#0a1818", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "26px 22px", height: "100%" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon size={20} color="#e8c547" strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.01em" }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "#5a8080", lineHeight: 1.7 }}>{body}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section style={{ background: "#060f0f", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeSection>
            <SectionHeader eyebrow="Build history" title="How this project was built" sub="Five structured development phases from idea to deployed product." />
          </FadeSection>
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 1, background: "rgba(232,197,71,0.15)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {TIMELINE.map(({ date, label, body }, i) => (
                <FadeSection key={label} delay={i * 0.1}>
                  <div style={{ display: "flex", gap: 28, paddingLeft: 0 }}>
                    {/* Dot */}
                    <div style={{ width: 33, flexShrink: 0, display: "flex", justifyContent: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#e8c547", border: "2px solid #020b0b", boxShadow: "0 0 0 3px rgba(232,197,71,0.2)", marginTop: 6, flexShrink: 0 }} />
                    </div>
                    <div style={{ paddingBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#e8c547", background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.2)", borderRadius: 20, padding: "3px 10px" }}>{date}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#e0e8e8" }}>{label}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#5a8080", lineHeight: 1.7 }}>{body}</p>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TECH STACK ══ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeSection>
            <SectionHeader eyebrow="Technology" title="What it's built with" sub="A modern, production-grade stack chosen for developer experience, scalability, and portfolio depth." />
          </FadeSection>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {TECH_STACK.map(({ layer, items }, i) => (
              <FadeSection key={layer} delay={i * 0.07}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 24, background: "#0a1818", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 22px" }}>
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e8c547" }}>{layer}</p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {items.map((item) => (
                      <span key={item} className="tech-chip" style={{ fontSize: 12, fontWeight: 600, color: "#8aacac", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "5px 12px", cursor: "default" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BUILDER CARD ══ */}
      <section style={{ background: "#060f0f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FadeSection>
            <SectionHeader eyebrow="The team" title="Who built this" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>

              {/* Harsh */}
              <div style={{ background: "#0a1818", border: "1px solid rgba(232,197,71,0.15)", borderRadius: 18, padding: "24px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#e8c547,#b8893a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#0d1a1a", flexShrink: 0 }}>
                  H
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Harsh Mistry</p>
                  <a href="mailto:harshmistry131@gmail.com" style={{ fontSize: 12, color: "#4a7070", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e8c547")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#4a7070")}
                  >
                    harshmistry131@gmail.com
                  </a>
                </div>
              </div>

              {/* Ayush */}
              <div style={{ background: "#0a1818", border: "1px solid rgba(232,197,71,0.15)", borderRadius: 18, padding: "24px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#60a5fa,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  A
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Ayush Shah</p>
                  <a href="mailto:ayushshah2109a@gmail.com" style={{ fontSize: 12, color: "#4a7070", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e8c547")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#4a7070")}
                  >
                    ayushshah2109a@gmail.com
                  </a>
                </div>
              </div>

            </div>
          </FadeSection>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <FadeSection>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
              Ready to try it?
            </h2>
            <p style={{ fontSize: 15, color: "#5a8080", lineHeight: 1.7, marginBottom: 28 }}>
              Post your first job and let the AI do the matching — no phone calls, no guessing.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button className="cta-btn" style={{ height: 50, padding: "0 26px", background: "#e8c547", border: "none", borderRadius: 12, color: "#0d1a1a", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  Get started <ArrowRight size={15} strokeWidth={2.5} />
                </button>
              </Link>
              <Link to="/contact" style={{ textDecoration: "none" }}>
                <button style={{ height: 50, padding: "0 26px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#b0c8c8", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "border-color 0.15s, color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(232,197,71,0.4)"; e.currentTarget.style.color = "#e8c547"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#b0c8c8"; }}
                >
                  Get in touch
                </button>
              </Link>
            </div>
          </FadeSection>
        </div>
      </section>

    </div>
  );
}
