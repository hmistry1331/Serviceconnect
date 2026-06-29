import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrench, Zap, Wind, Hammer, Paintbrush, SprayCan, Home as HomeIcon,
  LayoutGrid, Briefcase, Star, LogOut, MapPin, Clock, IndianRupee,
  CheckCircle2, AlertCircle, XCircle, TrendingUp, RefreshCw,
  ChevronRight, Plus, Loader2, Shield, ToggleLeft, ToggleRight,
  Activity, Award, MessageSquare, ArrowUpRight,
} from "lucide-react";
import { SC_THEME } from "@/lib/theme";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
async function apiFetch(path) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiUploadProfileImage(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE}/api/images/profile`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to upload profile image.");
  return data?.imageUrl || "";
}

async function apiUpdateWorkerLocation(locationData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/api/worker/dashboard/location`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(locationData),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update location.");
  }
  return res.json();
}

/* ─── Helpers — unchanged ─── */
const fmt = (v) => (v ?? 0).toLocaleString("en-IN");
const fmtAmt = (v) => (v != null && Number(v) > 0) ? `₹${Number(v).toLocaleString("en-IN")}` : "—";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const CAT_ICON = {
  PLUMBING: Wrench, ELECTRICAL: Zap, HVAC: Wind,
  CARPENTRY: Hammer, PAINTING: Paintbrush, CLEANING: SprayCan, ROOFING: HomeIcon,
};

const DASH_THEME = SC_THEME;

/* ─── Status colours updated for light bg ─── */
const STATUS_META = {
  PENDING: { bg: "rgba(232,197,71,0.12)", border: "rgba(232,197,71,0.35)", color: "#e8c547", label: "Pending" },
  ACTIVE: { bg: "rgba(111,148,148,0.16)", border: "rgba(111,148,148,0.4)", color: "#b7d0d0", label: "Active" },
  IN_PROGRESS: { bg: "rgba(111,148,148,0.16)", border: "rgba(111,148,148,0.4)", color: "#b7d0d0", label: "In Progress" },
  COMPLETED: { bg: "rgba(111,148,148,0.16)", border: "rgba(111,148,148,0.4)", color: "#b7d0d0", label: "Completed" },
  CANCELLED: { bg: "rgba(220,38,38,0.16)", border: "rgba(220,38,38,0.45)", color: "#fca5a5", label: "Cancelled" },
  VERIFIED: { bg: "rgba(111,148,148,0.16)", border: "rgba(111,148,148,0.4)", color: "#b7d0d0", label: "Verified" },
  UNVERIFIED: { bg: "rgba(232,197,71,0.12)", border: "rgba(232,197,71,0.35)", color: "#e8c547", label: "Unverified" },
};

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "jobs", label: "My Jobs", icon: Briefcase },
  { id: "reviews", label: "Reviews", icon: Star },
];

/* ══════════════════════════════════════════════
   SMALL SHARED COMPONENTS  (new light theme)
══════════════════════════════════════════════ */

function StatusPill({ status }) {
  const m = STATUS_META[(status || "").toUpperCase()] || { bg: DASH_THEME.surfaceAlt, border: DASH_THEME.border, color: DASH_THEME.muted, label: status };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", padding: "3px 10px", borderRadius: 20, background: m.bg, border: `1px solid ${m.border}`, color: m.color, whiteSpace: "nowrap" }}>
      {m.label}
    </span>
  );
}

function StarRating({ rating = 0 }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? DASH_THEME.accent : "none"}
          stroke={s <= Math.round(rating) ? DASH_THEME.accent : "rgba(111,148,148,0.45)"} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: 12, color: DASH_THEME.muted, marginLeft: 4 }}>{Number(rating).toFixed(1)}</span>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0" }}>
      <Loader2 size={26} color={DASH_THEME.accent} style={{ animation: "spin 0.8s linear infinite" }} />
    </div>
  );
}

function UserAvatar({ name, imageUrl, size = 44, onPreview }) {
  const initial = (name || "U").trim().charAt(0).toUpperCase() || "U";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${name || "User"} profile`}
        title="View photo"
        onClick={() => onPreview?.(imageUrl)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: `1px solid ${DASH_THEME.border}`,
          cursor: onPreview ? "pointer" : "default",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#e8c547,#6f9494)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 13,
        fontWeight: 700,
        color: "white",
      }}
    >
      {initial}
    </div>
  );
}

function SkeletonCard({ h = 100 }) {
  return (
    <div style={{ height: h, borderRadius: 16, background: DASH_THEME.surfaceAlt, border: `1px solid ${DASH_THEME.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
  );
}

function ErrorBanner({ msg, onRetry }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.4)", borderRadius: 14, padding: "14px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 13, color: "#fecaca" }}>{msg}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} style={{ background: "transparent", border: "1px solid rgba(220,38,38,0.45)", borderRadius: 8, padding: "5px 12px", color: "#fecaca", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          Retry
        </button>
      )}
    </div>
  );
}

/* Pastel gradient stat card */
function StatCard({ icon: Icon, label, value, sub, gradient, iconBg, iconColor, textColor = DASH_THEME.text, subColor = DASH_THEME.muted }) {
  return (
    <div style={{ background: gradient || DASH_THEME.surface, border: `1px solid ${DASH_THEME.border}`, borderRadius: 18, padding: "20px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.28)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.34)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.28)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: subColor, lineHeight: 1.4 }}>{label}</p>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: iconBg || DASH_THEME.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color={iconColor || DASH_THEME.accent} strokeWidth={2} />
        </div>
      </div>
      <p style={{ fontSize: 26, fontWeight: 700, color: textColor, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: sub ? 5 : 0 }}>{value ?? "—"}</p>
      {sub && <p style={{ fontSize: 12, color: subColor, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function SectionTitle({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: DASH_THEME.text, letterSpacing: "-0.02em" }}>{title}</h2>
        {sub && <p style={{ fontSize: 13, color: DASH_THEME.muted, marginTop: 3 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* Light-theme table */
function TableWrap({ children }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 16, background: DASH_THEME.surface, border: `1px solid ${DASH_THEME.border}`, boxShadow: "0 10px 24px rgba(0,0,0,0.3)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>{children}</table>
    </div>
  );
}

const TH = ({ children }) => (
  <th style={{ padding: "12px 18px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: DASH_THEME.muted, background: DASH_THEME.surfaceAlt, borderBottom: `1px solid ${DASH_THEME.border}`, whiteSpace: "nowrap" }}>
    {children}
  </th>
);

const TD = ({ children, style }) => (
  <td style={{ padding: "14px 18px", borderBottom: `1px solid ${DASH_THEME.border}`, color: DASH_THEME.muted, verticalAlign: "middle", ...style }}>
    {children}
  </td>
);

/* ══════════════════════════════════════════════
   JOB TABLE — same logic, new colours
══════════════════════════════════════════════ */
function JobTable({ jobs, role, onViewImage }) {
  const navigate = useNavigate();

  if (!jobs.length)
    return (
      <div style={{ background: DASH_THEME.surface, border: `1px solid ${DASH_THEME.border}`, borderRadius: 16, padding: "48px 24px", textAlign: "center", boxShadow: "0 10px 24px rgba(0,0,0,0.3)" }}>
        <Briefcase size={32} color="#c8d4e0" style={{ margin: "0 auto 12px" }} />
        <p style={{ fontSize: 14, color: DASH_THEME.muted }}>No jobs to display.</p>
      </div>
    );

  return (
    <TableWrap>
      <thead>
        <tr>
          <TH>#</TH><TH>Category</TH><TH>Description</TH>
          {role === "WORKER" && <TH>Customer</TH>}
          {role === "CUSTOMER" && <TH>Worker</TH>}
          <TH>Location</TH><TH>Budget</TH><TH>Status</TH><TH>Created</TH>
        </tr>
      </thead>
      <tbody>
        {jobs.map((j, i) => {
          const Icon = CAT_ICON[(j.category || "").toUpperCase()] || Wrench;
          return (
            <tr key={j.id}
              onClick={() => navigate(
                role === "WORKER"
                  ? `/worker/job/${j.id}`
                  : `/job/${j.id}`
              )}
              style={{ background: i % 2 === 0 ? DASH_THEME.surface : DASH_THEME.surfaceAlt, transition: "background 0.15s", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(232,197,71,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? DASH_THEME.surface : DASH_THEME.surfaceAlt}
            >
              <TD style={{ color: DASH_THEME.muted, fontSize: 11, fontFamily: "monospace" }}>#{j.id}</TD>
              <TD>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: DASH_THEME.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color={DASH_THEME.accent} strokeWidth={1.8} />
                  </div>
                  <span style={{ fontWeight: 600, color: DASH_THEME.text, fontSize: 13 }}>{j.category}</span>
                </div>
              </TD>
              <TD>
                <p style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: DASH_THEME.muted, fontSize: 12 }} title={j.description}>
                  {j.description || "—"}
                </p>
              </TD>
              {role === "WORKER" && <TD style={{ color: DASH_THEME.muted, fontSize: 12 }}>{j.customerName || "—"}</TD>}
              {role === "CUSTOMER" && <TD style={{ fontSize: 12, color: j.workerName ? DASH_THEME.muted : "rgba(111,148,148,0.5)" }}>{j.workerName || "Unassigned"}</TD>}
              <TD>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={11} color={DASH_THEME.muted} />
                  <span style={{ fontSize: 12, color: DASH_THEME.muted }}>{j.city || j.location || "—"}</span>
                </div>
              </TD>
              <TD style={{ color: DASH_THEME.accent, fontWeight: 700, fontSize: 13 }}>{fmtAmt(j.budgetAmount)}</TD>
              <TD><StatusPill status={j.status} /></TD>
              <TD style={{ color: DASH_THEME.muted, fontSize: 12 }}>{fmtDate(j.createdAt)}</TD>
            </tr>
          );
        })}
      </tbody>
    </TableWrap>
  );
}

/* ══════════════════════════════════════════════
   REVIEW CARDS — light theme
══════════════════════════════════════════════ */
function ReviewGrid({ reviews }) {
  if (!reviews.length)
    return (
      <div style={{ background: DASH_THEME.surface, border: `1px solid ${DASH_THEME.border}`, borderRadius: 16, padding: "48px 24px", textAlign: "center", boxShadow: "0 10px 24px rgba(0,0,0,0.3)" }}>
        <Star size={32} color="#c8d4e0" style={{ margin: "0 auto 12px" }} />
        <p style={{ fontSize: 14, color: DASH_THEME.muted }}>No reviews yet.</p>
      </div>
    );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {reviews.map((r) => (
        <div key={r.id}
          style={{ background: DASH_THEME.surface, border: `1px solid ${DASH_THEME.border}`, borderRadius: 18, padding: "20px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.28)", transition: "transform 0.2s, box-shadow 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.34)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.28)"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: DASH_THEME.text }}>{r.workerName || r.customerName || "—"}</p>
              {r.workerTradeCategory && <p style={{ fontSize: 11, color: DASH_THEME.muted, marginTop: 2 }}>{r.workerTradeCategory}</p>}
            </div>
            <StarRating rating={r.rating} />
          </div>
          {r.comment && (
            <p style={{ fontSize: 13, color: DASH_THEME.muted, lineHeight: 1.65, borderTop: `1px solid ${DASH_THEME.border}`, paddingTop: 12, marginTop: 4 }}>
              "{r.comment}"
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${DASH_THEME.border}` }}>
            <span style={{ fontSize: 11, color: DASH_THEME.muted }}>Job #{r.jobRequestId}</span>
            <span style={{ fontSize: 11, color: DASH_THEME.muted }}>{fmtDate(r.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CUSTOMER OVERVIEW — hero gradient card + stat grid
══════════════════════════════════════════════ */
function CustomerOverview({ summary, loading, error, onRetry, profileImageUrl, onPreviewImage, onUploadProfileImage, profileUploading }) {
  const uploadInputRef = useRef(null);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SkeletonCard h={180} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
        {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} h={100} />)}
      </div>
    </div>
  );
  if (error) return <ErrorBanner msg={error} onRetry={onRetry} />;
  if (!summary) return null;
  const s = summary;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Hero card — blue-teal gradient (same style as AnalyticsDashboard "Visits" card) */}
      <div style={{ borderRadius: 24, padding: "28px 32px", background: "linear-gradient(135deg, #0d1f1f 0%, #0a1818 100%)", border: `1px solid ${DASH_THEME.border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.35)", position: "relative", overflow: "hidden", minHeight: 170 }}>
        <div style={{ position: "absolute", right: -24, top: -24, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", right: 32, bottom: -32, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <UserAvatar name={s.customerName} imageUrl={profileImageUrl} size={48} onPreview={onPreviewImage} />
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                  Customer · Welcome back
                </p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: 4 }}>{s.customerName || "Customer"}</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{s.email}</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "8px 14px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6ffbbe", animation: "pulseDot 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 13, color: "white", fontWeight: 600 }}>Active account</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    await onUploadProfileImage?.(file);
                  } finally {
                    e.target.value = "";
                  }
                }}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                disabled={profileUploading}
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: profileUploading ? "rgba(255,255,255,0.08)" : "rgba(232,197,71,0.18)",
                  color: "white",
                  borderRadius: 12,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: profileUploading ? "not-allowed" : "pointer",
                }}
              >
                {profileUploading ? "Uploading photo..." : "Upload profile photo"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ textAlign: "center", background: "rgba(232,197,71,0.12)", borderRadius: 12, padding: "8px 16px" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: DASH_THEME.accent, letterSpacing: "-0.02em", lineHeight: 1 }}>{fmt(s.totalJobsPosted)}</p>
                <p style={{ fontSize: 10, color: "rgba(232,197,71,0.8)", marginTop: 3 }}>Total jobs</p>
              </div>
              <div style={{ textAlign: "center", background: "rgba(232,197,71,0.12)", borderRadius: 12, padding: "8px 16px" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: DASH_THEME.accent, letterSpacing: "-0.02em", lineHeight: 1 }}>{fmtAmt(s.totalAmountSpent)}</p>
                <p style={{ fontSize: 10, color: "rgba(232,197,71,0.8)", marginTop: 3 }}>Spent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 14 }}>
        <StatCard icon={Briefcase} label="Jobs Posted" value={fmt(s.totalJobsPosted)} iconBg="rgba(232,197,71,0.14)" iconColor="#e8c547" />
        <StatCard icon={Activity} label="Active" value={fmt(s.activeJobs)} iconBg="rgba(111,148,148,0.18)" iconColor="#b7d0d0" />
        <StatCard icon={CheckCircle2} label="Completed" value={fmt(s.completedJobs)} iconBg="rgba(111,148,148,0.18)" iconColor="#b7d0d0" />
        <StatCard icon={XCircle} label="Cancelled" value={fmt(s.cancelledJobs)} iconBg="rgba(220,38,38,0.08)" iconColor="#dc2626" />
        <StatCard icon={IndianRupee} label="Total Spent" value={fmtAmt(s.totalAmountSpent)} iconBg="rgba(245,200,66,0.15)" iconColor="#c49a00" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   WORKER OVERVIEW — peach hero + stat grid
══════════════════════════════════════════════ */
function WorkerOverview({ summary, loading, error, onRetry, profileImageUrl, onPreviewImage, onUploadProfileImage, profileUploading, isEditingLocation, editedLocation, setEditedLocation, onUpdateLocation, locationUpdating }) {
  const uploadInputRef = useRef(null);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SkeletonCard h={200} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} h={100} />)}
      </div>
    </div>
  );
  if (error) return <ErrorBanner msg={error} onRetry={onRetry} />;
  if (!summary) return null;
  const s = summary;
  const CatIcon = CAT_ICON[(s.tradeCategory || "").toUpperCase()] || Wrench;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Hero card — peach/amber gradient (Popularity card style) */}
      <div style={{ borderRadius: 24, padding: "28px 32px", background: "linear-gradient(135deg, #0d1f1f 0%, #0a1818 100%)", border: `1px solid ${DASH_THEME.border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.35)", position: "relative", overflow: "hidden", minHeight: 180 }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", right: 30, bottom: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <UserAvatar name={s.workerName} imageUrl={profileImageUrl} size={48} onPreview={onPreviewImage} />
              <div>
                <p style={{ fontSize: 12, color: DASH_THEME.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Worker portal</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: DASH_THEME.text, letterSpacing: "-0.02em", marginBottom: 4 }}>{s.workerName || "Worker"}</p>
                <p style={{ fontSize: 14, color: DASH_THEME.muted }}>{s.email}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(232,197,71,0.12)", borderRadius: 10, padding: "5px 12px" }}>
                <CatIcon size={13} color={DASH_THEME.accent} />
                <span style={{ fontSize: 12, color: DASH_THEME.accent, fontWeight: 600 }}>{s.tradeCategory || "—"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(111,148,148,0.16)", borderRadius: 10, padding: "5px 12px" }}>
                <MapPin size={13} color="#b7d0d0" />
                <span style={{ fontSize: 12, color: "#b7d0d0", fontWeight: 600 }}>{s.serviceArea || "—"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(111,148,148,0.16)", borderRadius: 10, padding: "5px 12px" }}>
                {s.isAvailable ? <ToggleRight size={15} color="#b7d0d0" /> : <ToggleLeft size={15} color={DASH_THEME.accent} />}
                <span style={{ fontSize: 12, color: s.isAvailable ? "#b7d0d0" : DASH_THEME.accent, fontWeight: 600 }}>{s.isAvailable ? "Available" : "Unavailable"}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
            <StatusPill status={s.verificationStatus || "UNVERIFIED"} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    await onUploadProfileImage?.(file);
                  } finally {
                    e.target.value = "";
                  }
                }}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                disabled={profileUploading}
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: profileUploading ? "rgba(255,255,255,0.08)" : "rgba(232,197,71,0.18)",
                  color: "white",
                  borderRadius: 12,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: profileUploading ? "not-allowed" : "pointer",
                }}
              >
                {profileUploading ? "Uploading photo..." : "Upload profile photo"}
              </button>
            </div>
            {s.averageRating != null && (
              <div style={{ background: "rgba(232,197,71,0.12)", borderRadius: 14, padding: "10px 16px", textAlign: "center" }}>
                <p style={{ fontSize: 26, fontWeight: 700, color: DASH_THEME.accent, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {Number(s.averageRating).toFixed(1)}
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 2, margin: "4px 0" }}>
                  {[1, 2, 3, 4, 5].map(s2 => (
                    <svg key={s2} width="11" height="11" viewBox="0 0 24 24"
                      fill={s2 <= Math.round(s.averageRating) ? DASH_THEME.accent : "none"}
                      stroke={s2 <= Math.round(s.averageRating) ? DASH_THEME.accent : "rgba(232,197,71,0.35)"} strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: 10, color: "rgba(232,197,71,0.75)" }}>{fmt(s.totalReviews)} reviews</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 14 }}>
        <StatCard icon={Briefcase} label="Accepted" value={fmt(s.totalJobsAccepted)} iconBg="rgba(232,197,71,0.14)" iconColor="#e8c547" />
        <StatCard icon={Activity} label="Active jobs" value={fmt(s.activeJobs)} iconBg="rgba(111,148,148,0.18)" iconColor="#b7d0d0" />
        <StatCard icon={CheckCircle2} label="Completed" value={fmt(s.completedJobs)} iconBg="rgba(111,148,148,0.18)" iconColor="#b7d0d0" />
        <StatCard icon={IndianRupee} label="Earnings" value={fmtAmt(s.totalEarnings)} iconBg="rgba(232,197,71,0.14)" iconColor="#e8c547" />
        <StatCard icon={Award} label="Avg. rating" value={s.averageRating != null ? Number(s.averageRating).toFixed(1) + " ★" : "—"} iconBg="rgba(232,197,71,0.14)" iconColor="#e8c547" />
        <StatCard icon={MessageSquare} label="Reviews" value={fmt(s.totalReviews)} iconBg="rgba(111,148,148,0.18)" iconColor="#b7d0d0" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   JOBS TAB — logic unchanged, new filter pill style
══════════════════════════════════════════════ */
function JobsTab({ role, onViewImage }) {
  const isWorker = role === "WORKER";
  const [filter, setFilter] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const FILTERS = isWorker
    ? [{ key: "all", label: "All" }, { key: "active", label: "Active" }, { key: "completed", label: "Completed" }]
    : [{ key: "all", label: "All" }, { key: "completed", label: "Completed" }];

  const endpoint = () => {
    const base = isWorker ? "/api/worker/dashboard" : "/api/customer/dashboard";
    if (filter === "all") return `${base}/jobs`;
    if (filter === "active") return `${base}/jobs/active`;
    if (filter === "completed") return `${base}/jobs/completed`;
    return `${base}/jobs`;
  };

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setJobs(await apiFetch(endpoint())); }
    catch { setError("Failed to load jobs. Please try again."); }
    finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, role]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionTitle
        title="My Jobs"
        sub={`${jobs.length} job${jobs.length !== 1 ? "s" : ""} ${filter !== "all" ? `— ${filter}` : ""}`}
        action={
          <div style={{ display: "flex", gap: 4, background: DASH_THEME.surface, border: `1px solid ${DASH_THEME.border}`, borderRadius: 12, padding: 4, boxShadow: "0 1px 6px rgba(0,0,0,0.2)" }}>
            {FILTERS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                style={{
                  padding: "6px 16px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.15s",
                  background: filter === key ? "linear-gradient(135deg,#e8c547,#bf9a2d)" : "transparent",
                  color: filter === key ? "#0a1818" : DASH_THEME.muted,
                  boxShadow: filter === key ? "0 3px 10px rgba(232,197,71,0.3)" : "none",
                }}
              >{label}</button>
            ))}
          </div>
        }
      />
      {loading && <Spinner />}
      {error && <ErrorBanner msg={error} onRetry={load} />}
      {!loading && !error && <JobTable jobs={jobs} role={role} onViewImage={onViewImage} />}
    </div>
  );
}

/* ══════════════════════════════════════════════
   REVIEWS TAB — logic unchanged
══════════════════════════════════════════════ */
function ReviewsTab({ role, onViewImage }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const ep = role === "WORKER" ? "/api/worker/dashboard/reviews" : "/api/customer/dashboard/reviews";
      setReviews(await apiFetch(ep));
    } catch { setError("Failed to load reviews."); }
    finally { setLoading(false); }
  }, [role]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionTitle
        title="Reviews"
        sub={`${reviews.length} review${reviews.length !== 1 ? "s" : ""} received`}
        action={
          <button onClick={load}
            style={{ display: "flex", alignItems: "center", gap: 7, background: DASH_THEME.surface, border: `1px solid ${DASH_THEME.border}`, borderRadius: 10, padding: "7px 14px", color: DASH_THEME.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.2)", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = DASH_THEME.accent; e.currentTarget.style.color = DASH_THEME.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = DASH_THEME.border; e.currentTarget.style.color = DASH_THEME.muted; }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        }
      />
      {loading && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>{[1, 2, 3].map(i => <SkeletonCard key={i} h={160} />)}</div>}
      {error && <ErrorBanner msg={error} onRetry={load} />}
      {!loading && !error && <ReviewGrid reviews={reviews} onViewImage={onViewImage} />}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SIDEBAR — light theme
══════════════════════════════════════════════ */
function Sidebar({ role, activeTab, setActiveTab, name, profileImageUrl, onPreviewImage }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside style={{ width: 230, flexShrink: 0, background: DASH_THEME.surface, borderRight: `1px solid ${DASH_THEME.border}`, padding: "24px 14px", display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 0, height: "100vh", overflowY: "auto", boxShadow: "2px 0 16px rgba(0,0,0,0.24)" }}>

      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 28, padding: "0 8px" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#e8c547,#6f9494)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Wrench size={15} color="white" strokeWidth={2.2} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.03em", color: DASH_THEME.text }}>
          Service<span style={{ color: DASH_THEME.accent }}>Connect</span>
        </span>
      </Link>

      {/* Role label */}
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: DASH_THEME.muted, padding: "0 8px", marginBottom: 6 }}>
        {role === "WORKER" ? "Worker panel" : "Customer panel"}
      </p>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, border: "none", cursor: "pointer", transition: "all 0.18s", textAlign: "left", width: "100%", fontSize: 13, fontWeight: 600,
                background: active ? "rgba(232,197,71,0.14)" : "transparent",
                color: active ? DASH_THEME.accent : DASH_THEME.muted,
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(111,148,148,0.14)"; e.currentTarget.style.color = "#b7d0d0"; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = DASH_THEME.muted; } }}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.8} />
              {label}
              {active && (
                <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: DASH_THEME.accent }} />
              )}
            </button>
          );
        })}

        {/* Quick actions */}
        <div style={{ height: 1, background: DASH_THEME.border, margin: "8px 4px" }} />

        {role === "CUSTOMER" && (
          <Link to="/create-job" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "linear-gradient(135deg,#e8c547,#bf9a2d)", color: "#0a1818", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(232,197,71,0.28)", transition: "opacity 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              <Plus size={15} /> Post a Job
            </div>
          </Link>
        )}

        {role === "WORKER" && (
          <Link to="/feed" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "linear-gradient(135deg,#6f9494,#4f7272)", color: "#ffffff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(111,148,148,0.28)", transition: "opacity 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              <TrendingUp size={15} /> Job Feed
            </div>
          </Link>
        )}
      </nav>

      {/* User chip + logout */}
      <div style={{ borderTop: `1px solid ${DASH_THEME.border}`, paddingTop: 14, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: DASH_THEME.surfaceAlt, borderRadius: 12 }}>
          <UserAvatar name={name} imageUrl={profileImageUrl} size={34} onPreview={onPreviewImage} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: DASH_THEME.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name || "User"}</p>
            <p style={{ fontSize: 11, color: DASH_THEME.muted }}>{role === "WORKER" ? "Worker" : "Customer"}</p>
          </div>
        </div>
        <button onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", borderRadius: 10, background: "transparent", border: "1px solid rgba(225,29,72,0.45)", color: "#fda4af", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(225,29,72,0.12)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════
   ROOT DASHBOARD — logic unchanged
══════════════════════════════════════════════ */
export default function Dashboard() {
  const rawRole = (localStorage.getItem("role") || "").toUpperCase();
  const role = rawRole.includes("WORKER") || rawRole.includes("PROFESSIONAL")
    ? "WORKER"
    : rawRole.includes("CUSTOMER") || rawRole.includes("USER")
      ? "CUSTOMER"
      : null;
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [sumLoading, setSumLoading] = useState(true);
  const [sumError, setSumError] = useState("");
  const [viewerImage, setViewerImage] = useState("");
  const [viewerTitle, setViewerTitle] = useState("Image viewer");
  const [profileUploading, setProfileUploading] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editedLocation, setEditedLocation] = useState({});
  const [locationUpdating, setLocationUpdating] = useState(false);

  const loadSummary = useCallback(async () => {
    setSumLoading(true); setSumError("");
    try {
      const ep = role === "WORKER" ? "/api/worker/dashboard/summary" : "/api/customer/dashboard/summary";
      setSummary(await apiFetch(ep));
    } catch { setSumError("Failed to load your summary. Please refresh."); }
    finally { setSumLoading(false); }
  }, [role]);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  const displayName = role === "WORKER" ? summary?.workerName : summary?.customerName;
  const profileImageUrl = summary?.profileImageUrl || summary?.profile_image_url || "";
  const openViewer = useCallback((url, title = "Image viewer") => {
    setViewerImage(url);
    setViewerTitle(title);
  }, []);

  const uploadProfileImage = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5MB.");

    setProfileUploading(true);
    try {
      const imageUrl = await apiUploadProfileImage(file);
      setSummary((prev) => prev ? { ...prev, profileImageUrl: imageUrl } : prev);
      await loadSummary();
      setViewerImage(imageUrl);
      setViewerTitle("Profile photo");
      return imageUrl;
    } finally {
      setProfileUploading(false);
    }
  }, [loadSummary]);

  const updateLocation = useCallback(async (locationData) => {
    if (!locationData) return;
    setLocationUpdating(true);
    try {
      const updated = await apiUpdateWorkerLocation(locationData);
      setSummary(updated);
      setIsEditingLocation(false);
      setEditedLocation({});
    } finally {
      setLocationUpdating(false);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: DASH_THEME.bg, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.5} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar       { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(232,197,71,0.35); border-radius:4px; }
      `}</style>

      {/* Sidebar — desktop only */}
      <div className="hidden lg:flex">
        <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} name={displayName} profileImageUrl={profileImageUrl} onPreviewImage={(url) => openViewer(url, "Profile photo")} />
      </div>

      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Mobile top bar */}
        <header className="flex lg:hidden" style={{ height: 56, background: DASH_THEME.surface, borderBottom: `1px solid ${DASH_THEME.border}`, alignItems: "center", padding: "0 16px", gap: 12, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,0,0,0.2)" }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#e8c547,#6f9494)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wrench size={14} color="white" strokeWidth={2.2} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em", color: DASH_THEME.text }}>
            Service<span style={{ color: DASH_THEME.accent }}>Connect</span>
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {TABS.map(({ id, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{
                  width: 34, height: 34, borderRadius: 9, border: "none", cursor: "pointer",
                  background: activeTab === id ? "rgba(232,197,71,0.14)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon size={16} color={activeTab === id ? DASH_THEME.accent : DASH_THEME.muted} />
              </button>
            ))}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px 24px 64px", overflowX: "hidden" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both" }} key={activeTab}>

            {/* Page header */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: DASH_THEME.accent, marginBottom: 5 }}>
                {role === "WORKER" ? "Worker portal" : "Customer portal"}
              </p>
              <h1 style={{ fontSize: "clamp(22px,3.5vw,32px)", fontWeight: 700, color: DASH_THEME.text, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {activeTab === "overview" && "Dashboard"}
                {activeTab === "jobs" && "My Jobs"}
                {activeTab === "reviews" && "Reviews"}
              </h1>
            </div>

            {/* Tab content */}
            {activeTab === "overview" && role === "CUSTOMER" && (
              <CustomerOverview summary={summary} loading={sumLoading} error={sumError} onRetry={loadSummary} profileImageUrl={profileImageUrl} onPreviewImage={(url) => openViewer(url, "Profile photo")} onUploadProfileImage={uploadProfileImage} profileUploading={profileUploading} />
            )}
            {activeTab === "overview" && role === "WORKER" && (
              <WorkerOverview summary={summary} loading={sumLoading} error={sumError} onRetry={loadSummary} profileImageUrl={profileImageUrl} onPreviewImage={(url) => openViewer(url, "Profile photo")} onUploadProfileImage={uploadProfileImage} profileUploading={profileUploading} />
            )}
            {activeTab === "jobs" && <JobsTab role={role} onViewImage={openViewer} />}
            {activeTab === "reviews" && <ReviewsTab role={role} />}
          </div>
        </main>
      </div>

      {viewerImage && (
        <div
          onClick={() => setViewerImage("")}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,11,11,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 120,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "min(92vw, 820px)",
              maxHeight: "88vh",
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${DASH_THEME.border}`,
              background: DASH_THEME.surface,
              boxShadow: "0 22px 44px rgba(0,0,0,0.45)",
            }}
          >
            <button
              onClick={() => setViewerImage("")}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: `1px solid ${DASH_THEME.border}`,
                background: "rgba(10,24,24,0.82)",
                color: DASH_THEME.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              <XCircle size={18} />
            </button>
            {viewerTitle && (
              <div style={{ position: "absolute", left: 14, top: 14, zIndex: 2, padding: "7px 10px", borderRadius: 999, background: "rgba(10,24,24,0.78)", color: "white", fontSize: 12, fontWeight: 700, border: `1px solid ${DASH_THEME.border}` }}>
                {viewerTitle}
              </div>
            )}
            <img
              src={viewerImage}
              alt={viewerTitle || "Image"}
              style={{ display: "block", maxWidth: "100%", maxHeight: "88vh", objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}