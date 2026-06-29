import { useState, useEffect, useRef,useCallback } from "react";
import { useParams, useNavigate, } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppStore } from "../app/store";

// ─── API base URL ───────────────────────────────────────────
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

// ─── Upload job image (before / after) ──────────────────────
async function apiUploadJobImage(jobRequestId, kind, file, token) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API}/api/images/job/${kind}/${jobRequestId}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to upload ${kind} image.`);
  return data?.imageUrl || "";
}

// ─── Status color helper ─────────────────────────────────────
function getStatusStyle(status) {
  const map = {
    PENDING:        { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)",   color: "#a78bfa" },
    ACCEPTED:       { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)",   color: "#34d399" },
    QUOTE_RECEIVED: { bg: "rgba(232,197,71,0.12)", border: "rgba(232,197,71,0.3)",   color: "#e8c547" },
    IN_PROGRESS:    { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)",   color: "#60a5fa" },
    COMPLETED:      { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)",   color: "#34d399" },
    CANCELLED:      { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)", color: "#f87171" },
  };
  return map[status] || map.PENDING;
}

// ─── Time ago helper ─────────────────────────────────────────
function timeAgo(dateString) {
  const diff  = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days} day${days  > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (mins  > 0) return `${mins} min${mins  > 1 ? "s" : ""} ago`;
  return "Just now";
}

export default function JobRequestDetail() {
  const { jobId } = useParams();
  const navigate  = useNavigate();
  const token     = useAppStore((s) => s.auth.token);

  const [job,      setJob]      = useState(null);
  const [quotes,   setQuotes]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [actionId, setActionId] = useState(null);

  // ─── Image upload state ───────────────────────────────────
  const [beforeUrl,       setBeforeUrl]       = useState("");
  const [afterUrl,        setAfterUrl]        = useState("");
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter,  setUploadingAfter]  = useState(false);
  const beforeInputRef = useRef(null);
  const afterInputRef  = useRef(null);

  // ─── Fetch job + quotes ───────────────────────────────────
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const userRole = localStorage.getItem("role")?.toUpperCase() || "";
      const isWorker = userRole.includes("WORKER") || userRole.includes("PROFESSIONAL");
      const endpoint = isWorker
        ? `${API}/api/worker/dashboard/jobs`
        : `${API}/api/customer/dashboard/jobs`;

      const jobRes = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      if (!jobRes.ok) throw new Error("Failed to load job details");

      const allJobs = await jobRes.json();
      const found   = allJobs.find((j) => j.id === parseInt(jobId));

      if (!found) {
        toast.error("Job not found!");
        navigate("/dashboard");
        return;
      }

      setJob(found);
      setBeforeUrl(found.beforeImageUrl || found.before_image_url || "");
      setAfterUrl(found.afterImageUrl   || found.after_image_url  || "");

      if (!isWorker && found.status === "QUOTE_RECEIVED") {
        const quoteRes = await fetch(
          `${API}/api/quotes/job/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (quoteRes.ok) {
          const quoteData = await quoteRes.json();
          setQuotes(Array.isArray(quoteData) ? quoteData : []);
        }
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  },[token, jobId, navigate]);
  useEffect(() => {
    if (!token || !jobId) return;
    fetchData();
  }, [token, jobId, fetchData]);

  // ─── Upload Before ────────────────────────────────────────
  const handleUploadBefore = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error("Image must be under 5 MB.");    return; }
    try {
      setUploadingBefore(true);
      const url = await apiUploadJobImage(jobId, "before", file, token);
      setBeforeUrl(url);
      toast.success("Before image uploaded!");
    } catch (err) {
      toast.error(err.message || "Failed to upload before image.");
    } finally {
      setUploadingBefore(false);
      if (beforeInputRef.current) beforeInputRef.current.value = "";
    }
  }, [token, jobId]);

  // ─── Upload After ─────────────────────────────────────────
  const handleUploadAfter = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error("Image must be under 5 MB.");    return; }
    try {
      setUploadingAfter(true);
      const url = await apiUploadJobImage(jobId, "after", file, token);
      setAfterUrl(url);
      toast.success("After image uploaded!");
    } catch (err) {
      toast.error(err.message || "Failed to upload after image.");
    } finally {
      setUploadingAfter(false);
      if (afterInputRef.current) afterInputRef.current.value = "";
    }
  }, [token, jobId]);

  // ─── Accept Quote ─────────────────────────────────────────
  const handleAcceptQuote = useCallback(async (quoteId) => {
    try {
      setActionId(quoteId);
      const res = await fetch(`${API}/api/quotes/accept/${quoteId}`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Failed to accept quote"); }
      toast.success("Quote accepted! Job is now In Progress!");
      await fetchData();
    } catch (err) { toast.error(err.message); }
    finally { setActionId(null); }
  }, [token, jobId, fetchData]);

  // ─── Decline Quote ────────────────────────────────────────
  const handleDeclineQuote = useCallback(async (quoteId) => {
    try {
      setActionId(quoteId);
      const res = await fetch(`${API}/api/quotes/decline/${quoteId}`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Failed to decline quote"); }
      toast.success("Quote declined! Job is back to Pending.");
      await fetchData();
    } catch (err) { toast.error(err.message); }
    finally { setActionId(null); }
  }, [token, jobId, fetchData]);

  // ─── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#020b0b", color: "#8aa8a8", fontSize: "14px" }}>
        Loading job details...
      </div>
    );
  }

  if (!job) return null;

  const statusStyle     = getStatusStyle(job.status);
  const userRole        = (localStorage.getItem("role") || "").toUpperCase();
  const isWorker        = userRole.includes("WORKER") || userRole.includes("PROFESSIONAL");
  const canUploadBefore = !isWorker && job.status === "PENDING";
  const canUploadAfter  =  isWorker && job.status === "COMPLETED";
  const showPhotosCard  = canUploadBefore || canUploadAfter || !!beforeUrl || !!afterUrl;

  // ─── Render ───────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#020b0b" }}>

      {/* Responsive styles */}
      <style>{`
        .jrd-outer { padding: 28px 32px; }
        .jrd-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        @media (max-width: 900px) {
          .jrd-outer { padding: 20px 16px; }
          .jrd-grid  { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="jrd-outer">

        {/* ── Top bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "rgba(255,255,255,0.05)", border: "0.5px solid #1a3333",
              color: "#8aa8a8", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", padding: "8px 16px", borderRadius: "8px",
              flexShrink: 0, transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            ← Back to Dashboard
          </button>

          <div>
            <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 800,
              letterSpacing: "-0.02em", margin: 0 }}>
              Job <span style={{ color: "#e8c547" }}>#{jobId}</span>
            </h1>
            <p style={{ color: "#5a8080", fontSize: "12px", margin: "2px 0 0" }}>
              {timeAgo(job.createdAt)} · {job.category}
            </p>
          </div>

          <span style={{
            marginLeft: "auto",
            background: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            color: statusStyle.color,
            fontSize: "12px", fontWeight: 700,
            padding: "6px 16px", borderRadius: "20px",
            letterSpacing: "0.06em", flexShrink: 0,
          }}>
            {job.status?.replace(/_/g, " ")}
          </span>
        </div>

        {/* ── Two-column grid ── */}
        <div className="jrd-grid">

          {/* ════ LEFT COLUMN ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Job Info Card */}
            <div style={{
              background: "#0d1a1a", border: "0.5px solid #1a3333",
              borderRadius: "16px", padding: "24px",
            }}>
              <span style={{
                background: "#1a3333", border: "0.5px solid #e8c547",
                color: "#e8c547", fontSize: "11px", fontWeight: 700,
                padding: "3px 12px", borderRadius: "20px",
                letterSpacing: "0.04em", display: "inline-block", marginBottom: "16px",
              }}>
                {job.category}
              </span>

              <p style={{
                color: "#ffffff", fontSize: "16px", fontWeight: 500,
                lineHeight: 1.6, marginBottom: "20px",
                borderLeft: "3px solid #e8c547", paddingLeft: "14px",
              }}>
                {job.problemDescription}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "LOCATION", value: job.customerLocation || "—",          color: "#ffffff" },
                  { label: "BUDGET",   value: `₹${job.budgetAmount}`,               color: "#e8c547" },
                  { label: "POSTED",   value: timeAgo(job.createdAt),               color: "#ffffff" },
                  { label: "WORKER",   value: job.workerName || "Not assigned yet", color: job.workerName ? "#34d399" : "#5a8080" },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "#081212", border: "0.5px solid #1a3333",
                    borderRadius: "10px", padding: "12px 14px",
                  }}>
                    <p style={{ color: "#5a8080", fontSize: "10px", fontWeight: 700,
                      letterSpacing: "0.07em", margin: "0 0 4px" }}>
                      {item.label}
                    </p>
                    <p style={{ color: item.color, fontSize: "13px", fontWeight: 700, margin: 0 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Photos Card */}
            {showPhotosCard && (
              <div style={{
                background: "#0d1a1a", border: "0.5px solid #1a3333",
                borderRadius: "16px", padding: "24px",
              }}>
                <p style={{ color: "#5a8080", fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.08em", marginBottom: "16px" }}>
                  JOB PHOTOS
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

                  {/* Before */}
                  <div>
                    <p style={{ color: "#8aa8a8", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                      Before
                    </p>
                    {beforeUrl ? (
                      <img src={beforeUrl} alt="Before work" style={{
                        width: "100%", height: "160px", objectFit: "cover",
                        borderRadius: "10px", border: "0.5px solid #1a3333", display: "block",
                      }} />
                    ) : (
                      <div style={{
                        width: "100%", height: "160px", borderRadius: "10px",
                        border: "1px dashed rgba(232,197,71,0.25)",
                        background: "rgba(232,197,71,0.03)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: "6px",
                      }}>
                        <span style={{ fontSize: "24px" }}>📷</span>
                        <span style={{ fontSize: "11px", color: "#5a8080" }}>Not uploaded</span>
                      </div>
                    )}
                    {canUploadBefore && (
                      <>
                        <input ref={beforeInputRef} type="file" accept="image/*"
                          style={{ display: "none" }} disabled={uploadingBefore}
                          onChange={(e) => handleUploadBefore(e.target.files?.[0])} />
                        <button
                          onClick={() => beforeInputRef.current?.click()}
                          disabled={uploadingBefore}
                          style={{
                            marginTop: "10px", width: "100%", height: "38px",
                            background: uploadingBefore ? "rgba(232,197,71,0.06)" : "rgba(232,197,71,0.12)",
                            border: "1px solid rgba(232,197,71,0.3)", borderRadius: "8px",
                            color: "#e8c547", fontSize: "12px", fontWeight: 700,
                            cursor: uploadingBefore ? "not-allowed" : "pointer",
                          }}>
                          {uploadingBefore ? "Uploading..." : beforeUrl ? "Replace" : "Upload Before Photo"}
                        </button>
                      </>
                    )}
                    {!canUploadBefore && !beforeUrl && (
                      <p style={{ fontSize: "10px", color: "rgba(111,148,148,0.5)", marginTop: "8px", textAlign: "center" }}>
                        {isWorker ? "Customer uploads this" : "Available for pending jobs"}
                      </p>
                    )}
                  </div>

                  {/* After */}
                  <div>
                    <p style={{ color: "#8aa8a8", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                      After
                    </p>
                    {afterUrl ? (
                      <img src={afterUrl} alt="After work" style={{
                        width: "100%", height: "160px", objectFit: "cover",
                        borderRadius: "10px", border: "0.5px solid #1a3333", display: "block",
                      }} />
                    ) : (
                      <div style={{
                        width: "100%", height: "160px", borderRadius: "10px",
                        border: "1px dashed rgba(111,148,148,0.25)",
                        background: "rgba(111,148,148,0.03)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: "6px",
                      }}>
                        <span style={{ fontSize: "24px" }}>🖼️</span>
                        <span style={{ fontSize: "11px", color: "#5a8080" }}>Not uploaded</span>
                      </div>
                    )}
                    {canUploadAfter && (
                      <>
                        <input ref={afterInputRef} type="file" accept="image/*"
                          style={{ display: "none" }} disabled={uploadingAfter}
                          onChange={(e) => handleUploadAfter(e.target.files?.[0])} />
                        <button
                          onClick={() => afterInputRef.current?.click()}
                          disabled={uploadingAfter}
                          style={{
                            marginTop: "10px", width: "100%", height: "38px",
                            background: uploadingAfter ? "rgba(111,148,148,0.06)" : "rgba(111,148,148,0.10)",
                            border: "1px solid rgba(111,148,148,0.3)", borderRadius: "8px",
                            color: "#b0c8c8", fontSize: "12px", fontWeight: 700,
                            cursor: uploadingAfter ? "not-allowed" : "pointer",
                          }}>
                          {uploadingAfter ? "Uploading..." : afterUrl ? "Replace" : "Upload After Photo"}
                        </button>
                      </>
                    )}
                    {!canUploadAfter && !afterUrl && (
                      <p style={{ fontSize: "10px", color: "rgba(111,148,148,0.5)", marginTop: "8px", textAlign: "center" }}>
                        {isWorker ? "Available after completion" : "Worker uploads this"}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>
          {/* ════ END LEFT COLUMN ════ */}

          {/* ════ RIGHT COLUMN ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Quotes */}
            {job.status === "QUOTE_RECEIVED" && (
              <div>
                <p style={{ color: "#5a8080", fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.08em", marginBottom: "14px" }}>
                  QUOTES RECEIVED ({quotes.length})
                </p>
                {quotes.length === 0 ? (
                  <div style={{
                    background: "#0d1a1a", border: "0.5px solid #1a3333",
                    borderRadius: "16px", padding: "32px", textAlign: "center",
                    color: "#8aa8a8", fontSize: "13px",
                  }}>
                    No quotes yet. Workers are reviewing your request!
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {quotes.map((quote) => (
                      <div key={quote.id} style={{
                        background: "#0d1a1a",
                        border: "1px solid rgba(232,197,71,0.2)",
                        borderRadius: "16px", padding: "20px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                          <div style={{
                            width: "46px", height: "46px", borderRadius: "50%",
                            background: "#1a3333", border: "1px solid #e8c547",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "18px", fontWeight: 700, color: "#e8c547", flexShrink: 0,
                          }}>
                            {quote.workerName?.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, margin: 0 }}>
                              {quote.workerName}
                            </p>
                            <p style={{ color: "#8aa8a8", fontSize: "11px", margin: "2px 0 0" }}>
                              {quote.workerTradeCategory}
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ color: "#e8c547", fontSize: "22px", fontWeight: 800, margin: 0 }}>
                              ₹{quote.quotedPrice}
                            </p>
                            <p style={{ color: "#5a8080", fontSize: "10px", margin: "2px 0 0" }}>
                              {timeAgo(quote.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div style={{
                          background: "#081212", border: "0.5px solid #1a3333",
                          borderRadius: "10px", padding: "14px", marginBottom: "16px",
                        }}>
                          <p style={{ color: "#b0c8c8", fontSize: "13px", margin: 0, lineHeight: 1.7 }}>
                            "{quote.message}"
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => handleAcceptQuote(quote.id)}
                            disabled={actionId === quote.id}
                            style={{
                              flex: 1, height: "44px",
                              background: actionId === quote.id ? "#b09830" : "#e8c547",
                              border: "none", borderRadius: "10px",
                              color: "#020b0b", fontSize: "13px", fontWeight: 800,
                              cursor: actionId === quote.id ? "not-allowed" : "pointer",
                            }}>
                            {actionId === quote.id ? "Processing..." : "✓ Accept Quote"}
                          </button>
                          <button
                            onClick={() => handleDeclineQuote(quote.id)}
                            disabled={actionId === quote.id}
                            style={{
                              flex: 1, height: "44px", background: "transparent",
                              border: "1px solid rgba(248,113,113,0.35)", borderRadius: "10px",
                              color: "#f87171", fontSize: "13px", fontWeight: 700,
                              cursor: actionId === quote.id ? "not-allowed" : "pointer",
                            }}>
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Status cards */}
            {job.status === "PENDING" && (
              <div style={{ background: "#0d1a1a", border: "0.5px solid #1a3333",
                borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "44px", marginBottom: "14px" }}>⏳</div>
                <p style={{ color: "#ffffff", fontSize: "15px", fontWeight: 700, margin: "0 0 8px" }}>
                  Waiting for workers
                </p>
                <p style={{ color: "#8aa8a8", fontSize: "13px", margin: 0 }}>
                  Your request is live. Workers nearby will respond soon.
                </p>
              </div>
            )}

            {job.status === "ACCEPTED" && (
              <div style={{ background: "#0d1a1a", border: "0.5px solid rgba(16,185,129,0.3)",
                borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "44px", marginBottom: "14px" }}>✅</div>
                <p style={{ color: "#34d399", fontSize: "15px", fontWeight: 700, margin: "0 0 8px" }}>
                  Worker Accepted
                </p>
                <p style={{ color: "#8aa8a8", fontSize: "13px", margin: 0 }}>
                  Waiting for the worker to send their quote.
                </p>
              </div>
            )}

            {job.status === "IN_PROGRESS" && (
              <div style={{ background: "#0d1a1a", border: "0.5px solid rgba(59,130,246,0.3)",
                borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "44px", marginBottom: "14px" }}>🔧</div>
                <p style={{ color: "#60a5fa", fontSize: "15px", fontWeight: 700, margin: "0 0 8px" }}>
                  In Progress
                </p>
                <p style={{ color: "#8aa8a8", fontSize: "13px", margin: 0 }}>
                  The worker is on the way. Sit tight!
                </p>
              </div>
            )}

            {job.status === "COMPLETED" && (
              <div style={{ background: "#0d1a1a", border: "0.5px solid rgba(16,185,129,0.3)",
                borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "44px", marginBottom: "14px" }}>🎉</div>
                <p style={{ color: "#34d399", fontSize: "15px", fontWeight: 700, margin: "0 0 8px" }}>
                  Job Completed!
                </p>
                <p style={{ color: "#8aa8a8", fontSize: "13px", margin: "0 0 20px" }}>
                  How was the service? Leave a review for the worker.
                </p>
                <button
                  onClick={() => navigate(`/review/${jobId}`)}
                  style={{
                    height: "44px", padding: "0 28px",
                    background: "#e8c547", border: "none", borderRadius: "10px",
                    color: "#020b0b", fontSize: "13px", fontWeight: 800, cursor: "pointer",
                  }}>
                  ⭐ Leave a Review
                </button>
              </div>
            )}

            {job.status === "CANCELLED" && (
              <div style={{ background: "#0d1a1a", border: "0.5px solid rgba(248,113,113,0.3)",
                borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "44px", marginBottom: "14px" }}>❌</div>
                <p style={{ color: "#f87171", fontSize: "15px", fontWeight: 700, margin: "0 0 8px" }}>
                  Job Cancelled
                </p>
                <p style={{ color: "#8aa8a8", fontSize: "13px", margin: 0 }}>
                  This job request has been cancelled.
                </p>
              </div>
            )}

          </div>
          {/* ════ END RIGHT COLUMN ════ */}

        </div>
      </div>
    </div>
  );
}