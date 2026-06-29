import { Link, useNavigate } from "react-router-dom";
import {
  Wrench, Zap, Droplet, Home as HomeIcon, ShieldCheck,
  ArrowRight, Search, Sparkles,
} from "lucide-react";

/* ─── Floating service icons positioned around the network map ─── */
const FLOAT_ICONS = [
  { Icon: Zap,         top: "8%",  left: "46%", color: "#e8c547", delay: "0s"    },
  { Icon: Wrench,      top: "28%", left: "4%",  color: "#e8c547", delay: "0.6s"  },
  { Icon: Droplet,     top: "26%", left: "88%", color: "#7ec8e3", delay: "1.1s"  },
  { Icon: HomeIcon,    top: "60%", left: "92%", color: "#e8c547", delay: "0.3s"  },
  { Icon: ShieldCheck, top: "82%", left: "82%", color: "#e8c547", delay: "0.9s"  },
  { Icon: Droplet,     top: "84%", left: "10%", color: "#7ec8e3", delay: "1.4s"  },
];

/* ─── Network node positions (percent-based, relative to map box) ─── */
const NODES = [
  { x: 18, y: 48 }, { x: 38, y: 28 }, { x: 50, y: 60 },
  { x: 68, y: 32 }, { x: 82, y: 50 }, { x: 30, y: 78 }, { x: 72, y: 80 },
];
const CENTER = { x: 50, y: 60 };

const TRUST = ["Verified Professionals", "AI Powered Matching", "Fast Service Connection"];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020b0b", color: "#fff", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@600;700&display=swap');

        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulseGlow { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes dashFlow { to { stroke-dashoffset: -40; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes sparkleSpin { from { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.15); } to { transform: rotate(360deg) scale(1); } }
        @keyframes numberGlow { 0%,100% { filter: drop-shadow(0 0 18px rgba(232,197,71,0.25)); } 50% { filter: drop-shadow(0 0 32px rgba(232,197,71,0.45)); } }

        .float-icon { animation: floatY 4s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .btn-primary { transition: background 0.15s, transform 0.1s; }
        .btn-primary:hover { background: #d4b33e !important; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-outline { transition: border-color 0.15s, color 0.15s, background 0.15s; }
        .btn-outline:hover { border-color: rgba(232,197,71,0.5) !important; color: #e8c547 !important; background: rgba(232,197,71,0.05) !important; }
      `}</style>

      {/* ══ TOP NAV ══ */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#e8c547", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Wrench size={14} color="#0d1a1a" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.03em", color: "#fff" }}>
            Service<span style={{ color: "#e8c547" }}>Connect</span>
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 32 }} className="hidden md:flex">
          {["Services", "About", "Contact"].map((label) => (
            <a key={label} href="#" style={{ fontSize: 14, color: "#b0c8c8", textDecoration: "none", fontWeight: 500, transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8c547")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#b0c8c8")}
            >{label}</a>
          ))}
        </nav>
      </header>

      {/* ══ MAIN CONTENT ══ */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", padding: "48px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="not-found-grid">

          {/* ── LEFT: text content ── */}
          <div className="fade-up">
            {/* Error badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#e8c547,#d4a843)", borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#0d1a1a", letterSpacing: "0.08em" }}>ERROR 404</span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "clamp(38px, 5vw, 56px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 4 }}>
              Page Not Found
            </h1>

            {/* Giant 404 */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: "clamp(96px, 14vw, 168px)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #f3d878 0%, #e8c547 45%, #b8893a 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                animation: "numberGlow 3.5s ease-in-out infinite",
                margin: "0 0 20px",
              }}
            >
              404
            </p>

            {/* Description */}
            <p style={{ fontSize: 16, color: "#8aa8a8", lineHeight: 1.7, maxWidth: 460, marginBottom: 36 }}>
              Oops! This service route seems unavailable. Our AI connects you with trusted professionals, but this page could not be found.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <button
                className="btn-primary"
                onClick={() => navigate("/")}
                style={{ height: 52, padding: "0 28px", background: "#e8c547", border: "none", borderRadius: 12, color: "#0d1a1a", fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
              >
                Back to Homepage <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button
                className="btn-outline"
                onClick={() => navigate("/#services")}
                style={{ height: 52, padding: "0 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
              >
                <Search size={16} /> Find a Service
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {TRUST.map((label) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "8px 16px" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(232,197,71,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#e8c547" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, color: "#b0c8c8", fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: network map visual ── */}
          <div className="hidden lg:block fade-up" style={{ position: "relative", height: 460, animationDelay: "0.15s" }}>

            {/* Ambient glow dots scattered */}
            {[
              { top: "10%", left: "8%" }, { top: "20%", left: "75%" }, { top: "50%", left: "2%" },
              { top: "70%", left: "92%" }, { top: "90%", left: "30%" }, { top: "5%", left: "60%" },
            ].map((pos, i) => (
              <div key={i} style={{ position: "absolute", ...pos, width: 4, height: 4, borderRadius: "50%", background: "#e8c547", animation: `pulseGlow ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.4}s`, boxShadow: "0 0 8px rgba(232,197,71,0.6)" }} />
            ))}

            {/* Map card */}
            <div style={{ position: "absolute", inset: "8% 6%", borderRadius: 20, border: "1px solid rgba(232,197,71,0.15)", background: "linear-gradient(160deg, rgba(232,197,71,0.03) 0%, rgba(10,24,24,0.4) 100%)", overflow: "hidden" }}>
              {/* grid lines texture */}
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
                {[15, 35, 55, 75].map((p) => (
                  <line key={`v${p}`} x1={p} y1="0" x2={p - 8} y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
                ))}
                {[20, 45, 70].map((p) => (
                  <line key={`h${p}`} x1="0" y1={p} x2="100" y2={p - 5} stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
                ))}

                {/* connection lines from nodes to center */}
                {NODES.map((n, i) => (
                  <line key={i} x1={n.x} y1={n.y} x2={CENTER.x} y2={CENTER.y}
                    stroke="rgba(232,197,71,0.45)" strokeWidth="0.5"
                    strokeDasharray="2 2" style={{ animation: "dashFlow 2.5s linear infinite" }} />
                ))}

                {/* outer nodes */}
                {NODES.map((n, i) => (
                  <circle key={i} cx={n.x} cy={n.y} r="1.3" fill="#e8c547" style={{ filter: "drop-shadow(0 0 3px rgba(232,197,71,0.8))" }} />
                ))}

                {/* center hub node — larger, pulsing */}
                <circle cx={CENTER.x} cy={CENTER.y} r="3.2" fill="#e8c547" style={{ filter: "drop-shadow(0 0 6px rgba(232,197,71,0.9))" }} />
                <circle cx={CENTER.x} cy={CENTER.y} r="3.2" fill="none" stroke="rgba(232,197,71,0.4)" strokeWidth="0.6">
                  <animate attributeName="r" values="3.2;7;3.2" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0;0.7" dur="2.5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>

            {/* Floating service icon badges */}
            {FLOAT_ICONS.map(({ Icon, top, left, color, delay }, i) => (
              <div key={i} className="float-icon" style={{ position: "absolute", top, left, animationDelay: delay, zIndex: 2 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: "#0a1818", border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 16px ${color}22` }}>
                  <Icon size={20} color={color} strokeWidth={2} />
                </div>
              </div>
            ))}

            {/* Decorative sparkle bottom right */}
            <div style={{ position: "absolute", bottom: "-2%", right: "0%", animation: "sparkleSpin 6s ease-in-out infinite" }}>
              <Sparkles size={32} color="#e8c547" strokeWidth={1.5} style={{ opacity: 0.7 }} />
            </div>
          </div>
        </div>
      </main>

      {/* Responsive grid fallback for small screens */}
      <style>{`
        @media (max-width: 1023px) {
          .not-found-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}