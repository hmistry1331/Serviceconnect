import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin,Loader2, ArrowRight, MessageSquare, CheckCircle2 } from "lucide-react";

/* ══════════════════════════════════════
   HOOK
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

/* ══════════════════════════════════════
   FIELD COMPONENT
══════════════════════════════════════ */
function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: error ? "#f87171" : "#6a9090" }}>
        {label} <span style={{ color: "#e8c547" }}>*</span>
      </label>
      {children}
      {error && <p style={{ fontSize: 11, color: "#f87171", marginTop: 2 }}>{error}</p>}
    </div>
  );
}

const INPUT_STYLE = {
  width: "100%",
  background: "#060f0f",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 11,
  color: "#fff",
  fontSize: 14,
  padding: "0 16px",
  height: 50,
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.18s, box-shadow 0.18s",
};

const TEXTAREA_STYLE = {
  ...INPUT_STYLE,
  height: "auto",
  padding: "14px 16px",
  resize: "vertical",
  minHeight: 120,
};

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function Contact() {
  const [heroRef, heroVisible] = useInView(0.1);
  const [formRef, formVisible] = useInView(0.08);
  const [infoRef, infoVisible] = useInView(0.08);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                        e.name    = "Name is required.";
    if (!form.email.trim())                       e.email   = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email   = "Enter a valid email.";
    if (!form.subject.trim())                     e.subject = "Subject is required.";
    if (form.message.trim().length < 10)          e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsSending(true);
    setApiError("");

    try {
      const formData = new FormData();
      formData.append("name",       form.name);
      formData.append("email",      form.email);
      formData.append("subject",    form.subject);
      formData.append("message",    form.message);
      formData.append("access_key", import.meta.env.VITE_WEB_API || "");

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to send message. Please try again.");

      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "rgba(232,197,71,0.45)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(232,197,71,0.07)";
  };
  const blurStyle  = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.08)";
    e.target.style.boxShadow   = "none";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020b0b", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.5)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
        input::placeholder, textarea::placeholder { color: #2a4040; }
        .info-link { transition: color 0.15s, border-color 0.15s; }
        .info-link:hover { color: #e8c547 !important; }
        .submit-btn { transition: background 0.15s, transform 0.1s; }
        .submit-btn:hover:not(:disabled) { background: #d4b33e !important; }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .social-btn { transition: border-color 0.15s, color 0.15s, background 0.15s; }
        .social-btn:hover { border-color: rgba(232,197,71,0.4) !important; color: #e8c547 !important; background: rgba(232,197,71,0.06) !important; }
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ══ HERO ══ */}
      <section ref={heroRef} style={{ padding: "90px 24px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 350, background: "radial-gradient(ellipse,rgba(232,197,71,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 620, margin: "0 auto", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          {/* Logo */}
          <div style={{ marginBottom: 28 }}>
            <img
              src="/images/img4.jpeg"
              alt="ServiceConnect"
              style={{ width: 160, height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }}
            />
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(232,197,71,0.07)", border: "1px solid rgba(232,197,71,0.18)", borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
            <MessageSquare size={12} color="#e8c547" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#e8c547", letterSpacing: "0.1em", textTransform: "uppercase" }}>Get in touch</span>
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 16 }}>
            We'd love to hear<br />
            <span style={{ background: "linear-gradient(135deg,#f3d878,#e8c547,#b8893a)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              from you
            </span>
          </h1>

          <p style={{ fontSize: 16, color: "#6a9090", lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
            Have a question about how the platform works, a bug to report, or just want to say hello? Drop us a message and we'll get back to you.
          </p>
        </div>
      </section>

      {/* ══ MAIN GRID ══ */}
      <section style={{ padding: "0 24px 96px" }}>
        <div className="contact-grid" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "start" }}>

          {/* ── FORM CARD ── */}
          <div ref={formRef} style={{ background: "#0a1818", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "32px 30px", opacity: formVisible ? 1 : 0, transform: formVisible ? "none" : "translateY(24px)", transition: "opacity 0.65s ease, transform 0.65s ease" }}>

            {/* Window chrome */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "rgba(232,197,71,0.5)" : "rgba(255,255,255,0.1)" }} />)}
              <p style={{ fontSize: 11, fontWeight: 700, color: "#2a4040", marginLeft: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>New message</p>
            </div>

            {/* Success state */}
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px", animation: "scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(29,158,117,0.12)", border: "2px solid rgba(29,158,117,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle2 size={28} color="#1D9E75" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Message sent!</h3>
                <p style={{ fontSize: 14, color: "#5a8080", lineHeight: 1.65, marginBottom: 24 }}>
                  Thanks for reaching out. We'll get back to you at <strong style={{ color: "#b0c8c8" }}>{form.email || "your email"}</strong> as soon as possible.
                </p>
                <button onClick={() => setSent(false)} style={{ background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.25)", borderRadius: 10, padding: "9px 20px", color: "#e8c547", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                {/* Name + Email side by side */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Full name" error={errors.name}>
                    <input name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange}
                      style={{ ...INPUT_STYLE, borderColor: errors.name ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)" }}
                      onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
                      style={{ ...INPUT_STYLE, borderColor: errors.email ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)" }}
                      onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                </div>

                <Field label="Subject" error={errors.subject}>
                  <input name="subject" type="text" placeholder="What is this regarding?" value={form.subject} onChange={handleChange}
                    style={{ ...INPUT_STYLE, borderColor: errors.subject ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)" }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                </Field>

                <Field label="Message" error={errors.message}>
                  <textarea name="message" rows={5} placeholder="Your message — the more detail the better..." value={form.message} onChange={handleChange}
                    style={{ ...TEXTAREA_STYLE, borderColor: errors.message ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)" }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                  <span style={{ fontSize: 11, color: form.message.length >= 10 ? "#1D9E75" : "#3a6060", alignSelf: "flex-end", marginTop: -4 }}>
                    {form.message.length} {form.message.length < 10 && "/ 10 min"}
                  </span>
                </Field>

                {apiError && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ fontSize: 13, color: "#fca5a5" }}>{apiError}</p>
                  </div>
                )}

                <button type="submit" disabled={isSending} className="submit-btn"
                  style={{ height: 52, background: "#e8c547", border: "none", borderRadius: 12, color: "#0d1a1a", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}
                >
                  {isSending
                    ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Sending…</>
                    : <>Send message <ArrowRight size={15} strokeWidth={2.5} /></>
                  }
                </button>

              </form>
            )}
          </div>

          {/* ── INFO CARD ── */}
          <div ref={infoRef} style={{ display: "flex", flexDirection: "column", gap: 16, opacity: infoVisible ? 1 : 0, transform: infoVisible ? "none" : "translateY(24px)", transition: "opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s" }}>

            {/* Email */}
            <div style={{ background: "#0a1818", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={17} color="#e8c547" />
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a7070" }}>Email</p>
              </div>
              <a href="mailto:harshmistry131@gmail.com" className="info-link"
                style={{ fontSize: 14, color: "#b0c8c8", textDecoration: "none", fontWeight: 500 }}>
                harshmistry131@gmail.com
              </a>
              <p style={{ fontSize: 12, color: "#3a6060", marginTop: 4 }}>Usually responds within 24 hours</p>
            </div>

            {/* Location */}
            <div style={{ background: "#0a1818", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={17} color="#e8c547" />
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a7070" }}>Location</p>
              </div>
              <p style={{ fontSize: 14, color: "#b0c8c8", fontWeight: 500, lineHeight: 1.6 }}>DAIICT Campus</p>
              <p style={{ fontSize: 13, color: "#5a8080", lineHeight: 1.6 }}>Near Reliance Cross Rd<br />Gandhinagar, Gujarat 382007</p>
            </div>

           

            {/* Quick links */}
            <div style={{ background: "#0a1818", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 22px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a7070", marginBottom: 14 }}>Quick links</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "How it works",  to: "/how-it-works" },
                  { label: "All services",  to: "/services"     },
                  { label: "About us",      to: "/about"        },
                ].map(({ label, to }) => (
                  <Link key={label} to={to} className="info-link"
                    style={{ fontSize: 13, color: "#5a8080", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                    <ArrowRight size={12} /> {label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
