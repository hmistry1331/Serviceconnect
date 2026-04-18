import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wrench, ChevronRight, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { useAppStore } from "../app/store";

const NAV_LINKS = [
  { label: "Home",         to: "/"          },
  { label: "Services",     to: "/#services" },
  { label: "How it works", to: "/#how"      },
  { label: "Worker Feed",  to: "/feed"      },
  { label: "Create Request", to: "/create-job-request" },
];

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [userRole, setUserRole] = useState("");
  const isLoggedInFromStore = useAppStore((state) => state.auth.isLoggedIn);
  const clearAuthSession = useAppStore((state) => state.clearAuthSession);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = isLoggedInFromStore || Boolean(localStorage.getItem("token"));

  const canSeeWorkerFeed =
    userRole.includes("WORKER") || userRole.includes("PROFESSIONAL");
  const canSeeCreateRequest =
    userRole.includes("CUSTOMER") || userRole.includes("USER");

  const navLinks = NAV_LINKS.filter((link) => {
    if (link.to === "/feed") {
      return canSeeWorkerFeed;
    }
    if (link.to === "/create-job-request") {
      return canSeeCreateRequest;
    }
    return true;
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const syncRole = () => {
      const role = localStorage.getItem("role") || "";
      setUserRole(role.toUpperCase());
    };

    syncRole();
    window.addEventListener("storage", syncRole);
    return () => window.removeEventListener("storage", syncRole);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLinkHover = (e) => {
    const el = e.currentTarget;
    setIndicatorStyle({ width: el.offsetWidth + "px", left: el.offsetLeft + "px", opacity: 1 });
  };
  const handleNavLeave = () => setIndicatorStyle((s) => ({ ...s, opacity: 0 }));

  const handleLogout = () => {
    clearAuthSession();
    setUserRole("");
    setMobileOpen(false);
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <>
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-link-item {
          position: relative;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #7a9c9c;
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.18s;
          white-space: nowrap;
          z-index: 1;
        }
        .nav-link-item:hover,
        .nav-link-item.active { color: #ffffff; }
        .nav-indicator {
          position: absolute;
          top: 0; bottom: 0;
          background: rgba(255,255,255,0.07);
          border-radius: 8px;
          pointer-events: none;
          transition: left 0.22s cubic-bezier(0.4,0,0.2,1),
                      width 0.22s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.18s;
        }
        .hamburger-line {
          display: block;
          width: 20px; height: 1.5px;
          background: #fff;
          border-radius: 2px;
          transition: transform 0.25s, opacity 0.2s, width 0.2s;
          transform-origin: center;
        }
      `}</style>

      {/*
       * KEY FIX: The <header> is always position:fixed full-width.
       * We animate its PADDING (not left/transform) to create the
       * pill-float effect. Padding shrinks → bar expands to full width.
       * This transitions perfectly because padding is a simple number.
       */}
      <header
        style={{
          position:   "fixed",
          top:        0,
          left:       0,
          right:      0,
          zIndex:     100,
          padding:    scrolled ? "0" : "14px 24px",
          transition: "padding 0.45s cubic-bezier(0.4,0,0.2,1)",
          animation:  "navSlideDown 0.5s cubic-bezier(0.22,1,0.36,1) both",
          pointerEvents: "none",
        }}
      >
        {/* Inner bar — morphs between pill and full-width bar */}
        <div
          style={{
            maxWidth:       scrolled ? "none" : "900px",
            margin:         "0 auto",
            height:         scrolled ? "58px" : "52px",
            borderRadius:   scrolled ? "0" : "16px",
            background:     scrolled
              ? "rgba(2,11,11,0.96)"
              : "rgba(10,24,24,0.84)",
            backdropFilter: "blur(20px)",
            borderBottom:   "1px solid rgba(255,255,255,0.06)",
            border:         scrolled
              ? "none"
              : "1px solid rgba(255,255,255,0.1)",
            boxShadow:      scrolled
              ? "0 1px 0 rgba(255,255,255,0.04)"
              : "0 8px 40px rgba(0,0,0,0.5)",
            padding:        "0 20px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "16px",
            pointerEvents:  "all",
            transition: [
              "max-width 1s cubic-bezier(0.4,0,0.2,1)",
              "height 1s cubic-bezier(0.4,0,0.2,1)",
              "border-radius 1s cubic-bezier(0.4,0,0.2,1)",
              "background 1s ease",
              "box-shadow 1s ease",
              "border 1s ease",
            ].join(", "),
          }}
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            style={{
              display: "flex", alignItems: "center",
              gap: "9px", textDecoration: "none", flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: "7px",
                background: "#e8c547", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Wrench size={14} color="#0d1a1a" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontWeight: 800, fontSize: "15px",
                letterSpacing: "-0.03em", color: "#fff", lineHeight: 1,
              }}
            >
              Service<span style={{ color: "#e8c547" }}>Connect</span>
            </span>
          </Link>

          {/* ── Centre nav links (desktop only) ── */}
          <div
            className="hidden lg:flex"
            style={{ position: "relative", alignItems: "center", gap: "2px" }}
            onMouseLeave={handleNavLeave}
          >
            <div className="nav-indicator" style={indicatorStyle} />
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`nav-link-item${location.pathname === to ? " active" : ""}`}
                onMouseEnter={handleLinkHover}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Auth buttons + hamburger ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

            <div className="hidden lg:flex" style={{ alignItems: "center", gap: "8px" }}>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "transparent",
                    border: "1px solid rgba(248,113,113,0.25)",
                    borderRadius: "9px", padding: "7px 16px",
                    color: "#fca5a5", fontSize: "13px", fontWeight: 700,
                    cursor: "pointer",
                    transition: "border-color 0.15s, color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(248,113,113,0.45)";
                    e.currentTarget.style.background = "rgba(248,113,113,0.08)";
                    e.currentTarget.style.color = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(248,113,113,0.25)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#fca5a5";
                  }}
                >
                  <LogOut size={14} /> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "9px", padding: "7px 16px",
                        color: "#a0bfbf", fontSize: "13px", fontWeight: 600,
                        cursor: "pointer",
                        transition: "border-color 0.15s, color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(232,197,71,0.4)";
                        e.currentTarget.style.color = "#e8c547";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                        e.currentTarget.style.color = "#a0bfbf";
                      }}
                    >
                      Log in
                    </button>
                  </Link>

                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        background: "#e8c547", border: "none",
                        borderRadius: "9px", padding: "7px 16px",
                        color: "#0d1a1a", fontSize: "13px", fontWeight: 800,
                        cursor: "pointer", transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b33e")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#e8c547")}
                    >
                      Sign up <ChevronRight size={14} strokeWidth={2.5} />
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((p) => !p)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "9px", width: "38px", height: "38px",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "5px", cursor: "pointer", padding: 0,
              }}
            >
              <span className="hamburger-line" style={{ transform: mobileOpen ? "rotate(45deg) translate(4.5px,4.5px)" : "none" }} />
              <span className="hamburger-line" style={{ width: mobileOpen ? "0" : "20px", opacity: mobileOpen ? 0 : 1 }} />
              <span className="hamburger-line" style={{ transform: mobileOpen ? "rotate(-45deg) translate(4.5px,-4.5px)" : "none" }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer backdrop ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 98,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(300px, 82vw)", zIndex: 99,
          background: "#0a1818",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column",
          padding: "80px 24px 32px", gap: "8px",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "-24px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {navLinks.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px", borderRadius: "12px",
              background: location.pathname === to ? "rgba(232,197,71,0.08)" : "transparent",
              border: `1px solid ${location.pathname === to ? "rgba(232,197,71,0.2)" : "rgba(255,255,255,0.05)"}`,
              color: location.pathname === to ? "#e8c547" : "#8aacac",
              textDecoration: "none", fontSize: "15px", fontWeight: 600,
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {label}
            <ChevronRight size={15} opacity={0.5} />
          </Link>
        ))}

        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              width: "100%", height: "48px", background: "transparent",
              border: "1px solid rgba(248,113,113,0.25)", borderRadius: "12px",
              color: "#fca5a5", fontSize: "14px", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        ) : (
          <>
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
              <button style={{
                width: "100%", height: "48px", background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px",
                color: "#8aacac", fontSize: "14px", fontWeight: 600, cursor: "pointer",
              }}>
                Log in
              </button>
            </Link>

            <Link to="/signup" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
              <button style={{
                width: "100%", height: "48px", background: "#e8c547",
                border: "none", borderRadius: "12px", color: "#0d1a1a",
                fontSize: "14px", fontWeight: 800, cursor: "pointer",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
              }}>
                Sign up <ChevronRight size={15} strokeWidth={2.5} />
              </button>
            </Link>
          </>
        )}

        <p style={{ marginTop: "auto", fontSize: "11px", color: "#2a4040", textAlign: "center" }}>
          © {new Date().getFullYear()} ServiceConnect
        </p>
      </div>
    </>
  );
}
