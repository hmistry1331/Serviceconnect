import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import {
    Wrench,
    Zap,
    Wind,
    Hammer,
    Paintbrush,
    SprayCan,
    Home,
    Search,
    Shield,
    Clock,
    Star,
} from "lucide-react";

/* ─── Brand name split for staggered animation ─── */
const BRAND = "ServiceConnect".split("");
const BRAND_BREAK = 7; // "Service" = 7 chars, rest = "Connect"

/* ─── Category mock data (simulates GET /api/categories/active) ─── */
const MOCK_CATEGORIES = [
    { id: 1, name: "Plumbing", icon: Wrench, description: "Leaks, pipes & fixtures" },
    { id: 2, name: "Electrical", icon: Zap, description: "Wiring, panels & lighting" },
    { id: 3, name: "HVAC", icon: Wind, description: "AC, heating & ventilation" },
    { id: 4, name: "Carpentry", icon: Hammer, description: "Cabinets, doors & wood" },
    { id: 5, name: "Painting", icon: Paintbrush, description: "Interior & exterior walls" },
    { id: 6, name: "Cleaning", icon: SprayCan, description: "Deep clean & post-construction" },
    { id: 7, name: "Roofing", icon: Home, description: "Tiles, leaks & roof repair" },
];

/* ─── Trust badge data ─── */
const TRUST = [
    { icon: Shield, label: "Verified Pros", sub: "Every worker is ID & quality checked" },
    { icon: Clock, label: "Fast Matching", sub: "Matched to a pro in under 5 minutes" },
    { icon: Star, label: "Rated & Reviewed", sub: "Real reviews from real homeowners" },
];

const CATEGORY_STICKY_CONTENT = MOCK_CATEGORIES.map((cat) => {
    const Icon = cat.icon;
    return {
        title: cat.name,
        description: cat.description,
        tag: "Verified category",
        tagIcon: Shield,
        content: (
            <div
                style={{
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "linear-gradient(180deg, #0d1f1f 0%, #0a1818 100%)",
                    padding: "20px",
                    minHeight: 270,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: "rgba(232,197,71,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                    }}
                >
                    <Icon size={22} color="#e8c547" strokeWidth={1.8} />
                </div>
                <div>
                    <h4
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "30px",
                            color: "#ffffff",
                            marginBottom: "8px",
                            lineHeight: 1.1,
                        }}
                    >
                        {cat.name}
                    </h4>
                    <p style={{ color: "#6f9494", fontSize: "14px", lineHeight: 1.6 }}>
                        {cat.description}
                    </p>
                </div>
                <div
                    style={{
                        marginTop: "20px",
                        fontSize: "12px",
                        color: "#e8c547",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                    }}
                >
                    ServiceConnect Trusted Network
                </div>
            </div>
        ),
    };
});

export default function LandingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [revealed, setRevealed] = useState(false);   // brand reveal trigger
    const [lettersDone, setLettersDone] = useState(false);   // after reveal → steady state

    /* ── Trigger reveal on mount ── */
    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 200);
        // After all letters have animated, mark as done
        const total = BRAND.length * 55 + 600; // last letter delay + duration
        const t2 = setTimeout(() => setLettersDone(true), total);
        return () => { clearTimeout(t); clearTimeout(t2); };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // TODO: wire to AI request page
        console.log("Search:", searchQuery);
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: "#020b0b", color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* ════════════════════════════════
          GOOGLE FONT IMPORT
      ════════════════════════════════ */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Cormorant+Garamond:wght@600;700&display=swap');

        /* Letter reveal keyframe */
        @keyframes letterUp {
          0%   { opacity: 0; transform: translateY(32px) skewY(4deg); filter: blur(6px); }
          60%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) skewY(0deg); filter: blur(0); }
        }

        /* Subtle shimmer on the brand after reveal */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        /* Smooth search focus */
        .hero-input:focus { outline: none; box-shadow: 0 0 0 2px rgba(232,197,71,0.4); }

        /* Scroll fade-in for sections */
        .fade-section {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

            {lettersDone && <Navbar />}

            {/* ════════════════════════════════
          HERO SECTION
      ════════════════════════════════ */}
            <section
                style={{
                    position: "relative",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: "0 1.5rem",
                }}
            >
                <img
                    src="/images/hero.jpg"
                    alt="Home service professional at work"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.52,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(135deg, rgba(6,20,20,0.55) 0%, rgba(10,31,31,0.45) 40%, rgba(6,20,20,0.65) 100%)",
                    }}
                />
                {/* Subtle grid texture */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(232,197,71,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,197,71,0.03) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                {/* Dark gradient overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(2,11,11,0.1) 0%, rgba(2,11,11,0.75) 100%)",
                    }}
                />

                {/* Hero content */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 10,
                        textAlign: "center",
                        maxWidth: "800px",
                        width: "100%",
                    }}
                >
                    {/* ── Animated Brand Name ── */}
                    <div
                        aria-label="ServiceConnect"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            gap: 0,
                            marginBottom: "32px",
                            lineHeight: 1,
                        }}
                    >
                        {BRAND.map((char, i) => {
                            const isConnect = i >= BRAND_BREAK;
                            const delay = revealed ? i * 55 : 0;

                            return (
                                <span
                                    key={i}
                                    style={{
                                        display: "inline-block",
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(52px, 9vw, 96px)",
                                        letterSpacing: "-0.03em",
                                        color: isConnect ? "#e8c547" : "#ffffff",
                                        opacity: revealed ? 1 : 0,
                                        animation: revealed
                                            ? `letterUp 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`
                                            : "none",
                                        // Keep space as a real space
                                        width: char === " " ? "0.28em" : undefined,
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            );
                        })}
                    </div>

                    {/* Tagline */}
                    <h1
                        style={{
                            fontSize: "clamp(16px, 2.5vw, 22px)",
                            fontWeight: 500,
                            color: "#8aacac",
                            marginBottom: "40px",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            opacity: lettersDone ? 1 : 0,
                            transform: lettersDone ? "translateY(0)" : "translateY(12px)",
                            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
                        }}
                    >
                        Find the best local professionals
                    </h1>

                    {/* Search bar */}
                    <form
                        onSubmit={handleSearch}
                        style={{
                            display: "flex",
                            gap: "10px",
                            maxWidth: "580px",
                            margin: "0 auto",
                            opacity: lettersDone ? 1 : 0,
                            transform: lettersDone ? "translateY(0)" : "translateY(16px)",
                            transition: "opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s",
                        }}
                    >
                        <div style={{ position: "relative", flex: 1 }}>
                            <Search
                                size={16}
                                style={{
                                    position: "absolute",
                                    left: "16px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#4a7070",
                                    pointerEvents: "none",
                                }}
                            />
                            <input
                                className="hero-input"
                                type="text"
                                placeholder="Describe your problem — e.g. 'my tap is leaking'"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: "100%",
                                    height: "52px",
                                    paddingLeft: "44px",
                                    paddingRight: "16px",
                                    background: "rgba(13,26,26,0.85)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    color: "#ffffff",
                                    fontSize: "14px",
                                    transition: "border-color 0.15s",
                                }}
                                onFocus={(e) =>
                                    (e.currentTarget.style.borderColor = "rgba(232,197,71,0.5)")
                                }
                                onBlur={(e) =>
                                    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                                }
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                height: "52px",
                                padding: "0 24px",
                                background: "#e8c547",
                                border: "none",
                                borderRadius: "12px",
                                color: "#0d1a1a",
                                fontSize: "14px",
                                fontWeight: 800,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b33e")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#e8c547")}
                        >
                            <Search size={15} />
                            Search
                        </button>
                    </form>

                    {/* Hint text */}
                    <p
                        style={{
                            fontSize: "12px",
                            color: "#3a6060",
                            marginTop: "16px",
                            opacity: lettersDone ? 1 : 0,
                            transition: "opacity 0.6s ease 0.4s",
                        }}
                    >
                        Powered by AI — just describe the issue and we'll find the right pro
                    </p>
                </div>

                {/* Scroll indicator */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "32px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        opacity: lettersDone ? 0.4 : 0,
                        transition: "opacity 0.6s ease 0.6s",
                    }}
                >
                    <div
                        style={{
                            width: "1px",
                            height: "40px",
                            background: "linear-gradient(to bottom, transparent, #e8c547)",
                        }}
                    />
                </div>
            </section>

            {/* ════════════════════════════════
          TRUST BADGES
      ════════════════════════════════ */}
            <section
                style={{
                    background: "#060f0f",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    padding: "40px 2rem",
                }}
            >
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <InfiniteMovingCards
                        items={TRUST.map(({ icon, label, sub }) => ({
                            icon,
                            title: label,
                            description: sub,
                        }))}
                        direction="left"
                        speed="normal"
                        pauseOnHover={true}
                    />
                </div>
            </section>

            {/* ════════════════════════════════
          CATEGORIES GRID
      ════════════════════════════════ */}
            <section style={{ padding: "80px 2rem", background: "#020b0b" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    {/* Section header */}
                    <div style={{ marginBottom: "48px", textAlign: "center" }}>
                        <p
                            style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: "#e8c547",
                                marginBottom: "10px",
                            }}
                        >
                            What we cover
                        </p>
                        <h2
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: "clamp(28px, 4vw, 42px)",
                                fontWeight: 700,
                                color: "#ffffff",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Service Categories
                        </h2>
                        <p style={{ fontSize: "14px", color: "#5a8080", marginTop: "10px" }}>
                            7 verified trade categories — AI routes your request to the right expert
                        </p>
                    </div>

                    <StickyScroll content={CATEGORY_STICKY_CONTENT} />
                </div>
            </section>

            {/* ════════════════════════════════
          CTA BANNER
      ════════════════════════════════ */}
            <section
                style={{
                    padding: "72px 2rem",
                    background: "#060f0f",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                    <h2
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "clamp(26px, 3.5vw, 38px)",
                            fontWeight: 700,
                            color: "#ffffff",
                            marginBottom: "14px",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Got a problem at home?
                    </h2>
                    <p style={{ fontSize: "14px", color: "#5a8080", marginBottom: "28px", lineHeight: 1.7 }}>
                        Describe it in plain language. Our AI instantly routes your request to the right vetted professional near you.
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link to="/signup">
                            <button
                                style={{
                                    background: "#e8c547",
                                    border: "none",
                                    borderRadius: "10px",
                                    padding: "12px 28px",
                                    color: "#0d1a1a",
                                    fontSize: "14px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b33e")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#e8c547")}
                            >
                                Get started — it's free
                            </button>
                        </Link>
                        <Link to="/login">
                            <button
                                style={{
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderRadius: "10px",
                                    padding: "12px 28px",
                                    color: "#8aacac",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "border-color 0.15s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.borderColor = "rgba(232,197,71,0.35)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
                                }
                            >
                                Already have an account
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
            <footer
                style={{
                    background: "#020b0b",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    padding: "32px 2rem",
                }}
            >
                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "20px",
                    }}
                >
                    {/* Brand */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                            style={{
                                width: 22,
                                height: 22,
                                borderRadius: "6px",
                                background: "#e8c547",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Wrench size={12} color="#0d1a1a" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "-0.02em" }}>
                            Service<span style={{ color: "#e8c547" }}>Connect</span>
                        </span>
                    </div>

                    {/* Links */}
                    <nav style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                        {["About", "Terms", "Privacy", "Contact"].map((label) => (
                            <a
                                key={label}
                                href="#"
                                style={{
                                    fontSize: "13px",
                                    color: "#4a7070",
                                    textDecoration: "none",
                                    fontWeight: 500,
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8c547")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a7070")}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    {/* Copyright */}
                    <p style={{ fontSize: "12px", color: "#2a4040" }}>
                        © {new Date().getFullYear()} ServiceConnect. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}