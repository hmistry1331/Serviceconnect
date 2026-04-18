import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LayoutGrid, Users, ShieldCheck, Briefcase,
  TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle,
  UserX, UserCheck, Trash2, ChevronRight, Loader2,
  X, AlertTriangle, Wrench, Zap, Wind, Hammer,
  Paintbrush, SprayCan, Home as HomeIcon, RefreshCw,
} from "lucide-react";

/* ─── axios instance ─── */
const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const api = axios.create({ baseURL });
api.interceptors.request.use((c) => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

/* ─── helpers ─── */
const fmt = (v) => (v ?? 0).toLocaleString("en-IN");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const CAT_ICON = { PLUMBING: Wrench, ELECTRICAL: Zap, HVAC: Wind, CARPENTRY: Hammer, PAINTING: Paintbrush, CLEANING: SprayCan, ROOFING: HomeIcon };

const STATUS_STYLE = {
  PENDING:   { bg: "rgba(232,197,71,0.1)",  border: "rgba(232,197,71,0.3)",  color: "#e8c547" },
  COMPLETED: { bg: "rgba(29,158,117,0.1)",  border: "rgba(29,158,117,0.3)", color: "#1D9E75" },
  CANCELLED: { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)",color: "#f87171" },
  IN_PROGRESS:{ bg: "rgba(99,153,34,0.1)", border: "rgba(99,153,34,0.3)",  color: "#97C459" },
  VERIFIED:  { bg: "rgba(29,158,117,0.1)",  border: "rgba(29,158,117,0.3)", color: "#1D9E75" },
  REJECTED:  { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)",color: "#f87171" },
};

const TABS = [
  { id: "stats",   label: "Dashboard",     icon: LayoutGrid  },
  { id: "users",   label: "Users",         icon: Users       },
  { id: "workers", label: "Verifications", icon: ShieldCheck },
  { id: "jobs",    label: "All Jobs",      icon: Briefcase   },
];

/* ════════════════════════════════════════════════════════
   TOAST SYSTEM
════════════════════════════════════════════════════════ */
function Toast({ toasts, remove }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, background: t.type==="success" ? "#0a1818" : "#150a0a", border:`1px solid ${t.type==="success" ? "rgba(29,158,117,0.4)" : "rgba(248,113,113,0.4)"}`, borderRadius:12, padding:"12px 16px", boxShadow:"0 8px 32px rgba(0,0,0,0.5)", minWidth:260, maxWidth:360, pointerEvents:"all", animation:"toastIn 0.3s cubic-bezier(0.22,1,0.36,1) both" }}>
          {t.type === "success" ? <CheckCircle2 size={16} color="#1D9E75" style={{flexShrink:0}} /> : <AlertCircle size={16} color="#f87171" style={{flexShrink:0}} />}
          <p style={{ fontSize:13, color: t.type==="success" ? "#a0d8c0" : "#fca5a5", flex:1, lineHeight:1.4 }}>{t.msg}</p>
          <button onClick={() => remove(t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#3a6060", padding:0, display:"flex" }}><X size={14}/></button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

/* ════════════════════════════════════════════════════════
   MODAL
════════════════════════════════════════════════════════ */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)" }} />
      <div style={{ position:"relative", background:"#0a1818", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, padding:"28px 28px 24px", width:"100%", maxWidth:440, boxShadow:"0 32px 80px rgba(0,0,0,0.7)", animation:"toastIn 0.3s cubic-bezier(0.22,1,0.36,1) both" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ fontSize:17, fontWeight:700, color:"#fff", letterSpacing:"-0.01em" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#5a8080" }}><X size={14}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SHARED SUBCOMPONENTS
════════════════════════════════════════════════════════ */
function Spinner() {
  return <div style={{ display:"flex", justifyContent:"center", padding:"60px 0" }}><Loader2 size={28} color="#e8c547" style={{ animation:"spin 0.8s linear infinite" }} /></div>;
}

function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || { bg:"rgba(255,255,255,0.05)", border:"rgba(255,255,255,0.1)", color:"#6a9090" };
  return (
    <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.06em", padding:"3px 9px", borderRadius:7, background:s.bg, border:`1px solid ${s.border}`, color:s.color }}>
      {status}
    </span>
  );
}

function SectionHeader({ title, sub, onRefresh, loading }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:24 }}>
      <div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(20px,3vw,28px)", fontWeight:700, color:"#fff", letterSpacing:"-0.02em" }}>{title}</h2>
        {sub && <p style={{ fontSize:13, color:"#5a8080", marginTop:3 }}>{sub}</p>}
      </div>
      {onRefresh && (
        <button onClick={onRefresh} disabled={loading} style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:9, padding:"7px 14px", color:"#6a9090", fontSize:12, fontWeight:600, cursor:"pointer", transition:"border-color 0.15s, color 0.15s" }}
          onMouseEnter={(e)=>{ e.currentTarget.style.borderColor="rgba(232,197,71,0.3)"; e.currentTarget.style.color="#e8c547"; }}
          onMouseLeave={(e)=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.color="#6a9090"; }}
        >
          <RefreshCw size={13} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
          Refresh
        </button>
      )}
    </div>
  );
}

function TableWrap({ children }) {
  return (
    <div style={{ overflowX:"auto", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:700 }}>
        {children}
      </table>
    </div>
  );
}

function TH({ children, style }) {
  return <th style={{ padding:"12px 16px", textAlign:"left", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#3a6060", background:"#060f0f", borderBottom:"1px solid rgba(255,255,255,0.06)", whiteSpace:"nowrap", ...style }}>{children}</th>;
}

function TD({ children, style }) {
  return <td style={{ padding:"13px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", color:"#b0c8c8", verticalAlign:"middle", ...style }}>{children}</td>;
}

function ActionBtn({ onClick, color, bg, border, children, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 11px", borderRadius:7, fontSize:11, fontWeight:700, cursor: disabled ? "not-allowed" : "pointer", background: bg || "transparent", border:`1px solid ${border || "rgba(255,255,255,0.12)"}`, color: color || "#8aacac", transition:"all 0.15s", opacity: disabled ? 0.5 : 1 }}
      onMouseEnter={(e)=>{ if(!disabled){ e.currentTarget.style.opacity="0.8"; }}}
      onMouseLeave={(e)=>{ if(!disabled){ e.currentTarget.style.opacity="1"; }}}
    >{children}</button>
  );
}

/* ════════════════════════════════════════════════════════
   SECTION 1 — STATS
════════════════════════════════════════════════════════ */
function StatsSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data: d } = await api.get("/api/admin/stats");
      setData(d);
    } catch {
      setError("Failed to load stats.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const CARDS = data ? [
    { label:"Total Users",            value: fmt(data.totalUsers),                icon: Users,       color:"#8aacac" },
    { label:"Total Workers",          value: fmt(data.totalWorkers),              icon: ShieldCheck, color:"#e8c547" },
    { label:"Total Customers",        value: fmt(data.totalCustomers),            icon: Users,       color:"#8aacac" },
    { label:"Total Job Requests",     value: fmt(data.totalJobRequests),          icon: Briefcase,   color:"#97C459" },
    { label:"Pending Jobs",           value: fmt(data.pendingJobs),               icon: Clock,       color:"#e8c547" },
    { label:"Completed Jobs",         value: fmt(data.completedJobs),             icon: CheckCircle2,color:"#1D9E75" },
    { label:"Cancelled Jobs",         value: fmt(data.cancelledJobs),             icon: XCircle,     color:"#f87171" },
    { label:"Pending Verifications",  value: fmt(data.pendingWorkerVerifications),icon: AlertTriangle,color:"#e8c547" },
    { label:"Verified Workers",       value: fmt(data.verifiedWorkers),           icon: ShieldCheck, color:"#1D9E75" },
    { label:"Suspended Users",        value: fmt(data.suspendedUsers),            icon: UserX,       color:"#f87171" },
  ] : [];

  return (
    <div>
      <SectionHeader title="Platform Overview" sub="Live snapshot of all platform activity" onRefresh={load} loading={loading} />
      {loading && <Spinner />}
      {error  && <p style={{ color:"#f87171", fontSize:13 }}>{error}</p>}
      {!loading && !error && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:14 }}>
          {CARDS.map((card) => {
            const CardIcon = card.icon;
            return (
            <div key={card.label} style={{ background:"#0a1818", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"20px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3a6060" }}>{card.label}</p>
                <div style={{ width:32, height:32, borderRadius:9, background:`${card.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <CardIcon size={15} color={card.color} strokeWidth={2} />
                </div>
              </div>
              <p style={{ fontSize:28, fontWeight:800, color:"#fff", letterSpacing:"-0.03em", lineHeight:1 }}>{card.value}</p>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SECTION 2 — USER MANAGEMENT
════════════════════════════════════════════════════════ */
function UsersSection({ toast }) {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [acting,  setActing]  = useState(null); // userId being acted on
  const [deleteModal, setDeleteModal] = useState(null); // user to delete

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/api/admin/users");
      setUsers(data);
    } catch { setError("Failed to load users."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const suspend = async (id) => {
    setActing(id);
    try {
      await api.put(`/api/admin/users/suspend/${id}`);
      setUsers((p) => p.map((u) => u.id === id ? { ...u, suspended: true } : u));
      toast("User suspended successfully.");
    } catch { toast("Failed to suspend user.", "error"); }
    finally { setActing(null); }
  };

  const unsuspend = async (id) => {
    setActing(id);
    try {
      await api.put(`/api/admin/users/unsuspend/${id}`);
      setUsers((p) => p.map((u) => u.id === id ? { ...u, suspended: false } : u));
      toast("User unsuspended successfully.");
    } catch { toast("Failed to unsuspend user.", "error"); }
    finally { setActing(null); }
  };

  const deleteUser = async () => {
    const id = deleteModal.id;
    setActing(id);
    setDeleteModal(null);
    try {
      await api.delete(`/api/admin/users/delete/${id}`);
      setUsers((p) => p.filter((u) => u.id !== id));
      toast("User deleted.");
    } catch { toast("Failed to delete user.", "error"); }
    finally { setActing(null); }
  };

  return (
    <div>
      <SectionHeader title="User Management" sub={`${users.length} registered users`} onRefresh={load} loading={loading} />

      {loading && <Spinner />}
      {error   && <p style={{ color:"#f87171", fontSize:13 }}>{error}</p>}

      {!loading && !error && (
        <TableWrap>
          <thead>
            <tr>
              <TH>ID</TH><TH>Name</TH><TH>Email</TH><TH>Phone</TH>
              <TH>Role</TH><TH>Status</TH><TH>Created</TH><TH>Actions</TH>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ background: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <TD style={{ color:"#3a6060", fontFamily:"var(--font-mono)", fontSize:11 }}>#{u.id}</TD>
                <TD><span style={{ fontWeight:600, color:"#e0e8e8" }}>{u.name}</span></TD>
                <TD style={{ color:"#6a9090" }}>{u.email}</TD>
                <TD style={{ color:"#5a8080" }}>{u.phone || "—"}</TD>
                <TD>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:7, background:"rgba(232,197,71,0.08)", border:"1px solid rgba(232,197,71,0.18)", color:"#e8c547" }}>
                    {(u.role || "").replace("ROLE_", "")}
                  </span>
                </TD>
                <TD>
                  {u.suspended
                    ? <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:7, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", color:"#f87171" }}>Suspended</span>
                    : <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:7, background:"rgba(29,158,117,0.1)", border:"1px solid rgba(29,158,117,0.3)", color:"#1D9E75" }}>Active</span>
                  }
                </TD>
                <TD style={{ color:"#4a7070", fontSize:12 }}>{fmtDate(u.createdAt)}</TD>
                <TD>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {u.suspended ? (
                      <ActionBtn onClick={() => unsuspend(u.id)} disabled={acting===u.id} color="#1D9E75" border="rgba(29,158,117,0.3)">
                        {acting===u.id ? <Loader2 size={11} style={{animation:"spin 0.8s linear infinite"}}/> : <UserCheck size={11}/>} Unsuspend
                      </ActionBtn>
                    ) : (
                      <ActionBtn onClick={() => suspend(u.id)} disabled={acting===u.id} color="#e8c547" border="rgba(232,197,71,0.3)">
                        {acting===u.id ? <Loader2 size={11} style={{animation:"spin 0.8s linear infinite"}}/> : <UserX size={11}/>} Suspend
                      </ActionBtn>
                    )}
                    <ActionBtn onClick={() => setDeleteModal(u)} disabled={acting===u.id} color="#f87171" border="rgba(248,113,113,0.3)">
                      <Trash2 size={11}/> Delete
                    </ActionBtn>
                  </div>
                </TD>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      {/* Delete confirm modal */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete user">
        <div style={{ display:"flex", alignItems:"flex-start", gap:12, background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
          <AlertTriangle size={18} color="#f87171" style={{ flexShrink:0, marginTop:1 }} />
          <div>
            <p style={{ fontSize:14, color:"#fca5a5", fontWeight:600, marginBottom:4 }}>This action is permanent</p>
            <p style={{ fontSize:13, color:"#5a8080", lineHeight:1.55 }}>
              You are about to delete <strong style={{ color:"#b0c8c8" }}>{deleteModal?.name}</strong> ({deleteModal?.email}). This cannot be undone.
            </p>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setDeleteModal(null)} style={{ flex:1, height:42, background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#6a9090", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={deleteUser} style={{ flex:1, height:42, background:"#f87171", border:"none", borderRadius:10, color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer" }}>Delete permanently</button>
        </div>
      </Modal>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SECTION 3 — WORKER VERIFICATIONS
════════════════════════════════════════════════════════ */
function WorkersSection({ toast }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [acting,  setActing]  = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // worker to reject
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/api/admin/workers/pending");
      setWorkers(data);
    } catch { setError("Failed to load pending verifications."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const verify = async (id) => {
    setActing(id);
    try {
      await api.put(`/api/admin/workers/verify/${id}`);
      setWorkers((p) => p.map((w) => w.workerId === id ? { ...w, verificationStatus: "VERIFIED" } : w));
      toast("Worker approved and verified.");
    } catch { toast("Failed to verify worker.", "error"); }
    finally { setActing(null); }
  };

  const reject = async () => {
    if (!reason.trim()) return;
    const id = rejectModal.workerId;
    setActing(id);
    setRejectModal(null);
    try {
      await api.put(`/api/admin/workers/reject/${id}`, { reason: reason.trim() });
      setWorkers((p) => p.map((w) => w.workerId === id ? { ...w, verificationStatus: "REJECTED" } : w));
      toast("Worker rejected.");
      setReason("");
    } catch { toast("Failed to reject worker.", "error"); }
    finally { setActing(null); }
  };

  const pending = workers.filter((w) => w.verificationStatus === "PENDING");

  return (
    <div>
      <SectionHeader
        title="Pending Verifications"
        sub={`${pending.length} worker${pending.length !== 1 ? "s" : ""} awaiting review`}
        onRefresh={load}
        loading={loading}
      />

      {loading && <Spinner />}
      {error   && <p style={{ color:"#f87171", fontSize:13 }}>{error}</p>}

      {!loading && !error && (
        <>
          {pending.length === 0 && (
            <div style={{ textAlign:"center", padding:"60px 24px" }}>
              <CheckCircle2 size={36} color="#1D9E75" style={{ margin:"0 auto 12px" }} />
              <p style={{ fontSize:15, fontWeight:600, color:"#4a7070" }}>All clear — no pending verifications</p>
            </div>
          )}

          {pending.length > 0 && (
            <TableWrap>
              <thead>
                <tr>
                  <TH>Worker ID</TH><TH>User ID</TH><TH>Name</TH><TH>Email</TH>
                  <TH>Trade</TH><TH>Service Area</TH><TH>Exp.</TH><TH>Status</TH><TH>Actions</TH>
                </tr>
              </thead>
              <tbody>
                {workers.map((w, i) => {
                  const Icon = CAT_ICON[(w.tradeCategory || "").toUpperCase()] || Wrench;
                  return (
                    <tr key={w.workerId} style={{ background: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                      <TD style={{ color:"#3a6060", fontFamily:"var(--font-mono)", fontSize:11 }}>#{w.workerId}</TD>
                      <TD style={{ color:"#3a6060", fontFamily:"var(--font-mono)", fontSize:11 }}>#{w.userId}</TD>
                      <TD><span style={{ fontWeight:600, color:"#e0e8e8" }}>{w.name}</span></TD>
                      <TD style={{ color:"#6a9090" }}>{w.email}</TD>
                      <TD>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <div style={{ width:26, height:26, borderRadius:7, background:"rgba(232,197,71,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <Icon size={13} color="#e8c547" strokeWidth={1.8} />
                          </div>
                          <span style={{ fontSize:12, color:"#b0c8c8", fontWeight:600 }}>{w.tradeCategory}</span>
                        </div>
                      </TD>
                      <TD style={{ color:"#5a8080" }}>{w.serviceArea || "—"}</TD>
                      <TD style={{ color:"#5a8080" }}>{w.experienceYears != null ? `${w.experienceYears} yr` : "—"}</TD>
                      <TD><StatusPill status={w.verificationStatus} /></TD>
                      <TD>
                        {w.verificationStatus === "PENDING" && (
                          <div style={{ display:"flex", gap:6 }}>
                            <ActionBtn onClick={() => verify(w.workerId)} disabled={acting===w.workerId} color="#1D9E75" border="rgba(29,158,117,0.3)">
                              {acting===w.workerId ? <Loader2 size={11} style={{animation:"spin 0.8s linear infinite"}}/> : <ShieldCheck size={11}/>} Approve
                            </ActionBtn>
                            <ActionBtn onClick={() => { setRejectModal(w); setReason(""); }} disabled={acting===w.workerId} color="#f87171" border="rgba(248,113,113,0.3)">
                              <XCircle size={11}/> Reject
                            </ActionBtn>
                          </div>
                        )}
                        {w.verificationStatus !== "PENDING" && <span style={{ fontSize:11, color:"#3a6060" }}>—</span>}
                      </TD>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          )}
        </>
      )}

      {/* Reject reason modal */}
      <Modal open={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject worker application">
        <p style={{ fontSize:13, color:"#5a8080", lineHeight:1.6, marginBottom:16 }}>
          Rejecting <strong style={{ color:"#b0c8c8" }}>{rejectModal?.name}</strong>. Please provide a reason — this will be stored on the backend.
        </p>
        <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#6a9090", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Reason *</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Documents were incomplete or unverifiable."
          rows={4}
          style={{ width:"100%", background:"#060f0f", border:"1px solid rgba(255,255,255,0.09)", borderRadius:10, color:"#fff", fontSize:13, padding:"12px 14px", resize:"vertical", fontFamily:"'DM Sans', sans-serif", boxSizing:"border-box", marginBottom:16 }}
        />
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setRejectModal(null)} style={{ flex:1, height:42, background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#6a9090", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={reject} disabled={!reason.trim()} style={{ flex:1, height:42, background:"#f87171", border:"none", borderRadius:10, color:"#fff", fontSize:13, fontWeight:800, cursor: reason.trim() ? "pointer" : "not-allowed", opacity: reason.trim() ? 1 : 0.5, transition:"opacity 0.15s" }}>
            Confirm rejection
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SECTION 4 — ALL JOBS
════════════════════════════════════════════════════════ */
function JobsSection() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/api/admin/jobs");
      setJobs(data);
    } catch { setError("Failed to load jobs."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionHeader title="All Job Requests" sub={`${jobs.length} total requests on the platform`} onRefresh={load} loading={loading} />

      {loading && <Spinner />}
      {error   && <p style={{ color:"#f87171", fontSize:13 }}>{error}</p>}

      {!loading && !error && (
        <TableWrap>
          <thead>
            <tr>
              <TH>ID</TH><TH>Customer</TH><TH>Category</TH>
              <TH style={{ maxWidth:220 }}>Description</TH>
              <TH>Location</TH><TH>Budget</TH><TH>Status</TH>
              <TH>Worker</TH><TH>Created</TH>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j, i) => {
              const Icon = CAT_ICON[(j.category || "").toUpperCase()] || Wrench;
              return (
                <tr key={j.id} style={{ background: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                  <TD style={{ color:"#3a6060", fontFamily:"var(--font-mono)", fontSize:11 }}>#{j.id}</TD>
                  <TD><span style={{ fontWeight:600, color:"#e0e8e8" }}>{j.customerName || "—"}</span></TD>
                  <TD>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:26, height:26, borderRadius:7, background:"rgba(232,197,71,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon size={13} color="#e8c547" strokeWidth={1.8} />
                      </div>
                      <span style={{ fontSize:12, color:"#b0c8c8", fontWeight:600 }}>{j.category}</span>
                    </div>
                  </TD>
                  <TD style={{ maxWidth:220 }}>
                    <p style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200, color:"#6a9090", fontSize:12 }} title={j.description}>
                      {j.description || "—"}
                    </p>
                  </TD>
                  <TD style={{ color:"#5a8080", fontSize:12 }}>{j.location || j.city || "—"}</TD>
                  <TD style={{ color:"#e8c547", fontWeight:700 }}>
                    {j.budgetAmount ? `₹${Number(j.budgetAmount).toLocaleString("en-IN")}` : "—"}
                  </TD>
                  <TD><StatusPill status={j.status} /></TD>
                  <TD style={{ color:"#5a8080" }}>{j.workerName || <span style={{ color:"#2a4040" }}>Unassigned</span>}</TD>
                  <TD style={{ color:"#4a7070", fontSize:12 }}>{fmtDate(j.createdAt)}</TD>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ROOT ADMIN COMPONENT
════════════════════════════════════════════════════════ */
export default function Admin() {
  const [activeTab, setActiveTab] = useState("stats");
  const { toasts, add: toast, remove } = useToast();

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#020b0b", color:"#fff", fontFamily:"'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Cormorant+Garamond:wght@600;700&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:4px; }
        textarea, input { outline:none; }
        textarea:focus, input:focus { border-color:rgba(232,197,71,0.45)!important; box-shadow:0 0 0 3px rgba(232,197,71,0.07)!important; }
      `}</style>

      {/* ── Top header bar ── */}
      <header style={{ position:"sticky", top:0, zIndex:50, height:60, background:"rgba(2,11,11,0.94)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", padding:"0 24px", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:"#e8c547", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Wrench size={14} color="#0d1a1a" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight:800, fontSize:15, letterSpacing:"-0.03em" }}>
            Service<span style={{ color:"#e8c547" }}>Connect</span>
          </span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#e8c547", background:"rgba(232,197,71,0.08)", border:"1px solid rgba(232,197,71,0.2)", borderRadius:7, padding:"4px 10px" }}>
            Admin Panel
          </span>
        </div>
      </header>

      <div style={{ display:"flex", minHeight:"calc(100vh - 60px)" }}>

        {/* ── Sidebar navigation ── */}
        <aside style={{ width:220, flexShrink:0, background:"#060f0f", borderRight:"1px solid rgba(255,255,255,0.06)", padding:"24px 14px", display:"flex", flexDirection:"column", gap:4, position:"sticky", top:60, height:"calc(100vh - 60px)", overflowY:"auto" }}>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#2a4040", padding:"0 6px", marginBottom:8 }}>Navigation</p>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:11, background: active ? "rgba(232,197,71,0.09)" : "transparent", border:`1px solid ${active ? "rgba(232,197,71,0.2)" : "transparent"}`, color: active ? "#e8c547" : "#4a7070", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.18s", textAlign:"left", width:"100%" }}
                onMouseEnter={(e)=>{ if(!active){ e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="#8aacac"; }}}
                onMouseLeave={(e)=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#4a7070"; }}}
              >
                <TabIcon size={15} strokeWidth={2} />
                {tab.label}
                {active && <ChevronRight size={13} style={{ marginLeft:"auto", opacity:0.5 }} />}
              </button>
            );
          })}
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex:1, padding:"32px 28px", overflowX:"hidden" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", animation:"fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both" }} key={activeTab}>
            {activeTab === "stats"   && <StatsSection />}
            {activeTab === "users"   && <UsersSection toast={toast} />}
            {activeTab === "workers" && <WorkersSection toast={toast} />}
            {activeTab === "jobs"    && <JobsSection />}
          </div>
        </main>
      </div>

      <Toast toasts={toasts} remove={remove} />
    </div>
  );
}