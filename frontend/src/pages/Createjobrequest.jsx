import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrench, Zap, Wind, Hammer, Paintbrush, SprayCan,
  Home as HomeIcon, MapPin, IndianRupee, FileText,
  ChevronRight, CheckCircle2, AlertCircle, Loader2,
  ArrowLeft, Sparkles,
} from "lucide-react";
import { createJobRequest } from "@/lib/api";
import { GUJARAT_CITIES, getCityByValue, getNearestSupportedCity } from "@/lib/gujaratCities";
import { SC_THEME } from "@/lib/theme";

const MAX_CITY_DEVIATION_KM = 80;

const CREATE_JOB_THEME = {
  ...SC_THEME,
  panel: SC_THEME.surfaceAlt,
  mutedSoft: "#5a8080",
  mutedDeep: "#3a6060",
  mutedLink: "#4a7070",
  neutral: "#b0c8c8",
  placeholder: "#2a4040",
  accentHover: "#d4b33e",
  danger: "#f87171",
  dangerSoft: "#fca5a5",
  buttonText: "#0d1a1a",
};

/* ─── 7 service categories (matches backend ServiceCategory enum) ─── */
const CATEGORIES = [
  { value: "PLUMBING", label: "Plumbing", icon: Wrench, desc: "Leaks, pipes & fixtures" },
  { value: "ELECTRICAL", label: "Electrical", icon: Zap, desc: "Wiring, panels & lighting" },
  { value: "HVAC", label: "HVAC", icon: Wind, desc: "AC, heating & ventilation" },
  { value: "CARPENTRY", label: "Carpentry", icon: Hammer, desc: "Cabinets, doors & wood" },
  { value: "PAINTING", label: "Painting", icon: Paintbrush, desc: "Interior & exterior walls" },
  { value: "CLEANING", label: "Cleaning", icon: SprayCan, desc: "Deep clean & post-construction" },
  { value: "ROOFING", label: "Roofing", icon: HomeIcon, desc: "Tiles, leaks & roof repair" },
];

/* ─── Validation helpers ─── */
const validate = (fields) => {
  const errors = {};
  if (!fields.description || fields.description.trim().length < 10)
    errors.description = "Description must be at least 10 characters.";
  if (!fields.location)
    errors.location = "Please select your city.";
  if (!fields.budgetAmount || Number(fields.budgetAmount) <= 0)
    errors.budgetAmount = "Budget must be greater than ₹0.";
  return errors;
};

export default function CreateJobRequest() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    category: "",
    description: "",
    location: "",
    budgetAmount: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError] = useState("");
  const [geoCoords, setGeoCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState({ loading: false, message: "", type: "idle" });

  /* ── field helpers ── */
  const set = (key) => (e) => {
    setFields((p) => ({ ...p, [key]: e.target.value }));
    if (key === "location") {
      setGeoCoords(null);
      setGeoStatus({ loading: false, message: "", type: "idle" });
    }
    // clear error as user types
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const touch = (key) => () =>
    setTouched((p) => ({ ...p, [key]: true }));

  const selectedCat = CATEGORIES.find((c) => c.value === fields.category);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus({
        loading: false,
        type: "error",
        message: "Geolocation is not supported in this browser.",
      });
      return;
    }

    setGeoStatus({ loading: true, message: "Fetching your location...", type: "info" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);
        const nearest = getNearestSupportedCity(latitude, longitude);

        if (!nearest) {
          setGeoCoords(null);
          setGeoStatus({
            loading: false,
            type: "error",
            message: "Unable to map your GPS location right now.",
          });
          return;
        }

        setFields((prev) => ({ ...prev, location: nearest.city.value }));
        setGeoCoords({ latitude, longitude });

        if (nearest.distanceKm > MAX_CITY_DEVIATION_KM) {
          setGeoStatus({
            loading: false,
            type: "info",
            message: `GPS captured. You are ${nearest.distanceKm.toFixed(1)} km from ${nearest.city.label}. We'll still use your exact coordinates for matching.`,
          });
          return;
        }

        setGeoStatus({
          loading: false,
          type: "success",
          message: `Precise GPS set near ${nearest.city.label} (${nearest.distanceKm.toFixed(1)} km from center).`,
        });
      },
      (error) => {
        setGeoStatus({
          loading: false,
          type: "error",
          message: error.message || "Unable to fetch current location.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ description: true, location: true, budgetAmount: true });

    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStatus("loading");
    setApiError("");

    try {
      const selectedCity = getCityByValue(fields.location);
      if (!selectedCity) {
        setErrors((prev) => ({ ...prev, location: "Please select a valid Gujarat city." }));
        setStatus("idle");
        return;
      }

      const preciseCoordinates = geoCoords || {
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
      };

      await createJobRequest({
        category: selectedCat?.label || "",
        description: fields.description.trim(),
        location: selectedCity.value,
        city: selectedCity.value,
        latitude: preciseCoordinates.latitude,
        longitude: preciseCoordinates.longitude,
        budgetAmount: Number(fields.budgetAmount),
        /* backend sets: customerId, status=PENDING, createdAt */
      });
      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 2200);
    } catch (err) {
      setStatus("error");
      setApiError(err.message || "Something went wrong. Please try again.");
    }
  };

  /* ─────────────────────────────────────
     SUCCESS STATE
  ───────────────────────────────────── */
  if (status === "success") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: CREATE_JOB_THEME.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Cormorant+Garamond:wght@600;700&display=swap');
          @keyframes scaleIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }`}
        </style>
        <div style={{ textAlign: "center", animation: "scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: CREATE_JOB_THEME.successBg, border: `2px solid ${CREATE_JOB_THEME.successBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={32} color={CREATE_JOB_THEME.successText} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: CREATE_JOB_THEME.text, letterSpacing: "-0.02em", marginBottom: 10 }}>
            Job posted!
          </h2>
          <p style={{ fontSize: 14, color: CREATE_JOB_THEME.mutedSoft, marginBottom: 6 }}>
            Your request has been submitted. Nearby professionals will be notified.
          </p>
          <p style={{ fontSize: 12, color: CREATE_JOB_THEME.mutedDeep }}>Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────
     MAIN FORM
  ───────────────────────────────────── */
  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: CREATE_JOB_THEME.bg, color: CREATE_JOB_THEME.text, fontFamily: "'DM Sans', sans-serif", padding: "32px 16px 64px" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Cormorant+Garamond:wght@600;700&display=swap');

        .field-input {
          width: 100%; background: ${CREATE_JOB_THEME.panel};
          border: 1px solid ${CREATE_JOB_THEME.border};
          border-radius: 12px; color: ${CREATE_JOB_THEME.text};
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .field-input:focus {
          outline: none;
          border-color: ${CREATE_JOB_THEME.accent};
          box-shadow: 0 0 0 3px rgba(232,197,71,0.08);
        }
        .field-input.error {
          border-color: rgba(248,113,113,0.5);
          box-shadow: 0 0 0 3px rgba(248,113,113,0.07);
        }
        .field-input::placeholder { color: ${CREATE_JOB_THEME.placeholder}; }

        .cat-pill {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border-radius: 12px; cursor: pointer;
          border: 1px solid ${CREATE_JOB_THEME.border};
          background: ${CREATE_JOB_THEME.panel};
          transition: border-color 0.18s, background 0.18s, transform 0.12s;
          user-select: none;
        }
        .cat-pill:hover { border-color: rgba(232,197,71,0.25); background: rgba(232,197,71,0.04); }
        .cat-pill.selected {
          border-color: rgba(232,197,71,0.45);
          background: rgba(232,197,71,0.08);
          box-shadow: 0 0 0 3px rgba(232,197,71,0.07);
        }
        .cat-pill:active { transform: scale(0.98); }

        .submit-btn {
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
        }
        .submit-btn:hover:not(:disabled) { background: ${CREATE_JOB_THEME.accentHover} !important; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* ── Back link ── */}
        <Link
          to="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", color: CREATE_JOB_THEME.mutedLink, fontSize: 13, fontWeight: 600, marginBottom: 32, transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = CREATE_JOB_THEME.accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = CREATE_JOB_THEME.mutedLink)}
        >
          <ArrowLeft size={14} /> Back to home
        </Link>

        {/* ── Page header ── */}
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: CREATE_JOB_THEME.accent, marginBottom: 8 }}>
            New request
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: CREATE_JOB_THEME.text, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 10 }}>
            Post a Job Request
          </h1>
          <p style={{ fontSize: 14, color: CREATE_JOB_THEME.mutedSoft, lineHeight: 1.65 }}>
            Describe your problem and our AI will match you with a verified professional near you.
          </p>
        </div>

        {/* ── Form card ── */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="fade-up"
          style={{ animationDelay: "0.07s", display: "flex", flexDirection: "column", gap: 28 }}
        >

          {/* ══ STEP 1: Category ══ */}
          <section>
            <FieldLabel icon={<Sparkles size={13} />} label="Service category" />
            <p style={{ fontSize: 12, color: CREATE_JOB_THEME.mutedDeep, marginBottom: 14 }}>
              Optional: pick a category if you know it. Otherwise leave it blank and AI will detect the best match from your description.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: 10,
              }}
            >
              {CATEGORIES.map((category) => (
                (() => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      className={`cat-pill${fields.category === category.value ? " selected" : ""}`}
                      onClick={() => { setFields((p) => ({ ...p, category: category.value })); setErrors((p) => ({ ...p, category: undefined })); }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: fields.category === category.value ? "rgba(232,197,71,0.15)" : CREATE_JOB_THEME.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.18s" }}>
                        <Icon
                          size={15}
                          color={fields.category === category.value ? CREATE_JOB_THEME.accent : CREATE_JOB_THEME.mutedLink}
                          strokeWidth={1.8}
                        />
                      </div>
                      <div style={{ textAlign: "left", minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: fields.category === category.value ? CREATE_JOB_THEME.accent : CREATE_JOB_THEME.neutral, marginBottom: 2 }}>{category.label}</p>
                        <p style={{ fontSize: 11, color: CREATE_JOB_THEME.mutedDeep, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{category.desc}</p>
                      </div>
                      {fields.category === category.value && (
                        <CheckCircle2 size={14} color={CREATE_JOB_THEME.accent} style={{ marginLeft: "auto", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })()
              ))}
            </div>

          </section>

          {/* ══ STEP 2: Description ══ */}
          <section>
            <FieldLabel icon={<FileText size={13} />} label="Problem description" required />
            <div style={{ position: "relative" }}>
              <textarea
                className={`field-input${touched.description && errors.description ? " error" : ""}`}
                placeholder="e.g. My bathroom pipe burst under the sink — water is leaking and the cabinet is wet. I need someone to replace the pipe section and check the fittings."
                value={fields.description}
                onChange={set("description")}
                onBlur={touch("description")}
                rows={5}
                style={{ padding: "14px 16px", resize: "vertical", minHeight: 120 }}
              />
              <CharCount current={fields.description.length} min={10} />
            </div>
            {touched.description && errors.description && <ErrorMsg msg={errors.description} />}
            <p style={{ fontSize: 11, color: CREATE_JOB_THEME.mutedDeep, marginTop: 6 }}>
              Be specific — the more detail you give, the better your match will be.
            </p>
          </section>

          {/* ══ STEP 3: Location ══ */}
          <section>
            <FieldLabel icon={<MapPin size={13} />} label="Your location" required />
            <select
              className={`field-input${touched.location && errors.location ? " error" : ""}`}

              value={fields.location}
              onChange={set("location")}
              onBlur={touch("location")}
              style={{
                height: 50,
                padding: "0 16px",
                appearance: "none",      
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238aa8a8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                cursor: "pointer",
              }}
            >
              <option value="">Select Gujarat city</option>
              {GUJARAT_CITIES.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
            {touched.location && errors.location && <ErrorMsg msg={errors.location} />}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoStatus.loading}
              style={{
                marginTop: 10,
                background: CREATE_JOB_THEME.panel,
                border: "1px solid rgba(232,197,71,0.25)",
                borderRadius: 10,
                color: CREATE_JOB_THEME.accent,
                fontSize: 12,
                fontWeight: 700,
                padding: "8px 12px",
                cursor: geoStatus.loading ? "not-allowed" : "pointer",
              }}
            >
              {geoStatus.loading ? "Detecting location..." : "Use my current GPS location"}
            </button>
            {geoStatus.message && (
              <p
                style={{
                  fontSize: 11,
                  marginTop: 8,
                  color: geoStatus.type === "error" ? CREATE_JOB_THEME.danger : geoStatus.type === "success" ? CREATE_JOB_THEME.successText : CREATE_JOB_THEME.mutedSoft,
                }}
              >
                {geoStatus.message}
              </p>
            )}
            <p style={{ fontSize: 11, color: CREATE_JOB_THEME.mutedDeep, marginTop: 6 }}>
              Nearby matching uses a 10 km radius from your exact coordinates.
            </p>
          </section>

          {/* ══ STEP 4: Budget ══ */}
          <section>
            <FieldLabel icon={<IndianRupee size={13} />} label="Your budget" required />
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: CREATE_JOB_THEME.mutedLink, fontSize: 14, fontWeight: 600, pointerEvents: "none" }}>₹</div>
              <input
                type="number"
                min="1"
                className={`field-input${touched.budgetAmount && errors.budgetAmount ? " error" : ""}`}
                placeholder="500"
                value={fields.budgetAmount}
                onChange={set("budgetAmount")}
                onBlur={touch("budgetAmount")}
                style={{ height: 50, padding: "0 16px 0 30px" }}
              />
            </div>
            {touched.budgetAmount && errors.budgetAmount && <ErrorMsg msg={errors.budgetAmount} />}
            <p style={{ fontSize: 11, color: CREATE_JOB_THEME.mutedDeep, marginTop: 6 }}>
              Workers will see this and quote accordingly. You can negotiate before accepting.
            </p>
          </section>

          {/* ══ Job preview summary ══ */}
          {fields.description.length >= 10 && fields.location && Number(fields.budgetAmount) > 0 && (
            <div
              style={{
                background: CREATE_JOB_THEME.panel, border: `1px solid ${CREATE_JOB_THEME.border}`,
                borderRadius: 14, padding: "18px 20px",
                animation: "fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              <p style={{ fontSize: 11, color: CREATE_JOB_THEME.accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                Request preview
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <PreviewRow label="Category" value={selectedCat?.label || "Auto-detect with AI"} />
                <PreviewRow label="City" value={fields.location} />
                <PreviewRow label="GPS mode" value={geoCoords ? "Precise" : "City center"} valueColor={geoCoords ? CREATE_JOB_THEME.successText : CREATE_JOB_THEME.neutral} />
                <PreviewRow label="Budget" value={`₹${Number(fields.budgetAmount).toLocaleString("en-IN")}`} />
                <PreviewRow label="Status" value="PENDING" valueColor={CREATE_JOB_THEME.accent} />
              </div>
            </div>
          )}

          {/* ══ API error ══ */}
          {status === "error" && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 12, padding: "14px 16px" }}>
              <AlertCircle size={16} color={CREATE_JOB_THEME.danger} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: CREATE_JOB_THEME.dangerSoft, lineHeight: 1.5 }}>{apiError}</p>
            </div>
          )}

          {/* ══ Submit ══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
            <button
              type="submit"
              disabled={status === "loading"}
              className="submit-btn"
              style={{
                height: 54, width: "100%",
                background: CREATE_JOB_THEME.accent, border: "none",
                borderRadius: 13, color: CREATE_JOB_THEME.buttonText,
                fontSize: 15, fontWeight: 800,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                letterSpacing: "0.01em",
              }}
            >
              {status === "loading" ? (
                <><Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Submitting…</>
              ) : (
                <>Post Job Request <ChevronRight size={17} strokeWidth={2.5} /></>
              )}
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: CREATE_JOB_THEME.placeholder, lineHeight: 1.6 }}>
              By posting, you agree to our{" "}
              <a href="#" style={{ color: CREATE_JOB_THEME.mutedLink, textDecoration: "none" }}>Terms of Service</a>.
              Your customer ID and timestamp are set automatically.
            </p>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Small helper components ─── */

function FieldLabel({ icon, label, required }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: CREATE_JOB_THEME.neutral, marginBottom: 10 }}>
      <span style={{ color: CREATE_JOB_THEME.accent }}>{icon}</span>
      {label}
      {required && <span style={{ color: "rgba(248,113,113,0.7)", fontSize: 12 }}>*</span>}
    </label>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7 }}>
      <AlertCircle size={12} color={CREATE_JOB_THEME.danger} />
      <p style={{ fontSize: 12, color: CREATE_JOB_THEME.danger, fontWeight: 500 }}>{msg}</p>
    </div>
  );
}

function CharCount({ current, min }) {
  const done = current >= min;
  return (
    <span style={{ position: "absolute", bottom: 10, right: 12, fontSize: 11, color: done ? CREATE_JOB_THEME.successText : CREATE_JOB_THEME.mutedDeep, fontWeight: 600, pointerEvents: "none" }}>
      {current} {!done && `/ ${min} min`}
    </span>
  );
}

function PreviewRow({ label, value, valueColor = CREATE_JOB_THEME.neutral }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
      <span style={{ color: CREATE_JOB_THEME.mutedDeep, fontWeight: 500 }}>{label}</span>
      <span style={{ color: valueColor, fontWeight: 600 }}>{value}</span>
    </div>
  );
}