import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_BASE_URL
         || import.meta.env.VITE_API_URL
         || "http://localhost:8080";

// ─── Helpers ─────────────────────────────────
function timeAgo(d) {
  if (!d) return "—";
  const diff  = Date.now() - new Date(d).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return "Just now";
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

// ─── Status config ────────────────────────────
const STATUS_CFG = {
  PENDING:        { color: "#a78bfa", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.3)"  },
  ACCEPTED:       { color: "#e8c547", bg: "rgba(232,197,71,0.12)",  border: "rgba(232,197,71,0.3)"  },
  QUOTE_RECEIVED: { color: "#60a5fa", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)"  },
  IN_PROGRESS:    { color: "#34d399", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)"  },
  COMPLETED:      { color: "#34d399", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)"  },
  CANCELLED:      { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)" },
};

// ─── Section Title ────────────────────────────
function SectionLabel({ text }) {
  return (
    <p style={{
      color: "#8aa8a8", fontSize: 11,
      fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase",
      margin: "0 0 12px",
    }}>
      {text}
    </p>
  );
}

// ─── Info Tile ────────────────────────────────
function InfoTile({ label, value, valueColor = "#ffffff" }) {
  return (
    <div style={{
      background: "#081212",
      border: "0.5px solid #1a3333",
      borderRadius: 10,
      padding: "10px 12px",
    }}>
      <p style={{ color: "#8aa8a8", fontSize: 11, margin: "0 0 3px" }}>
        {label}
      </p>
      <p style={{ color: valueColor, fontSize: 13,
                  fontWeight: 600, margin: 0 }}>
        {value || "—"}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────
export default function WorkerJobDetail() {
  const { jobId }  = useParams();
  const navigate   = useNavigate();
  const token      = localStorage.getItem("token");

  const [job,         setJob]         = useState(null);
  const [loading,     setLoading]     = useState(true);
  // Quote form state
  const [quotePrice,  setQuotePrice]  = useState("");
  const [quoteMsg,    setQuoteMsg]    = useState("");
  const [quoteLoading,setQuoteLoading]= useState(false);
  // Status update state
  const [statusLoading, setStatusLoading] = useState(false);
  // Image upload state
  const [imgUploading,  setImgUploading]  = useState(false);

  // ── Fetch job detail ────────────────────────
  const loadJob = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API}/api/worker/dashboard/jobs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to load job");

      const all   = await res.json();
      const found = all.find((j) => j.id === parseInt(jobId));

      if (!found) {
        toast.error("Job not found!");
        navigate("/dashboard");
        return;
      }
      setJob(found);
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [token, jobId, navigate]);

  useEffect(() => {
    if (!token || !jobId) return;
    loadJob();
  }, [loadJob, token, jobId]);

  // ── Submit Quote ────────────────────────────
  const handleSubmitQuote= useCallback(async (e) => {
    e.preventDefault();
    const price = Number(quotePrice);

    if (!price || price <= 0) {
      toast.error("Please enter a valid price!");
      return;
    }
    if (!quoteMsg.trim()) {
      toast.error("Please write a message for the customer!");
      return;
    }

    try {
      setQuoteLoading(true);
      const res = await fetch(
        `${API}/api/quotes/submit/${jobId}`,
        {
          method: "POST",
          headers: {
            Authorization:  `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quotedPrice: price,
            message:     quoteMsg.trim(),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit quote");
      }

      toast.success("Quote sent to customer!");
      setQuotePrice("");
      setQuoteMsg("");
      await loadJob(); // refresh
    } catch (err) {
      toast.error(err.message);
    } finally {
      setQuoteLoading(false);
    }
  }, [quotePrice, quoteMsg, jobId, token, loadJob]);

  // ── Update Status ───────────────────────────
  const handleUpdateStatus = useCallback(async (newStatus) => {
    try {
      setStatusLoading(true);
      const res = await fetch(
        `${API}/api/jobs/status/${jobId}?status=${newStatus}`,
        {
          method:  "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update status");
      }

      toast.success(`Job marked as ${newStatus
        .replace("_", " ")}!`);
      await loadJob(); // refresh
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStatusLoading(false);
    }
  }, [token, jobId, loadJob]);

  // ── Upload After Image ──────────────────────
  const handleAfterImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB!");
      return;
    }

    try {
      setImgUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(
        `${API}/api/images/job/after/${jobId}`,
        {
          method:  "POST",
          headers: { Authorization: `Bearer ${token}` },
          body:    fd,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }

      toast.success("After photo uploaded!");
      await loadJob();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setImgUploading(false);
      e.target.value = "";
    }
  }, [token, jobId, loadJob]);

  // ── Loading ─────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        justifyContent: "center",
        background: "#020b0b",
        color: "#8aa8a8", fontSize: 14,
      }}>
        Loading job details...
      </div>
    );
  }

  if (!job) return null;

  const status    = (job.status || "").toUpperCase();
  const statusCfg = STATUS_CFG[status] || STATUS_CFG.PENDING;

  // ─── Render ──────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020b0b",
      padding: "24px 16px",
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none", border: "none",
            color: "#8aa8a8", fontSize: 13,
            cursor: "pointer", padding: 0,
            marginBottom: 20,
          }}
        >
          ← Back
        </button>

        {/* Page title */}
        <h1 style={{
          color: "#ffffff", fontSize: 20,
          fontWeight: 800, marginBottom: 20,
          letterSpacing: "-0.02em",
        }}>
          Job <span style={{ color: "#e8c547" }}>Details</span>
        </h1>

        {/* ── Job info card ── */}
        <div style={{
          background: "#0d1a1a",
          border: "0.5px solid #1a3333",
          borderRadius: 14, padding: 20,
          marginBottom: 20,
        }}>

          {/* Category + Status row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap", gap: 8,
            marginBottom: 14,
          }}>
            <span style={{
              background: "#1a3333",
              border: "0.5px solid #e8c547",
              color: "#e8c547", fontSize: 11,
              fontWeight: 700, padding: "3px 12px",
              borderRadius: 20,
            }}>
              {job.category}
            </span>
            <span style={{
              background: statusCfg.bg,
              border: `0.5px solid ${statusCfg.border}`,
              color: statusCfg.color,
              fontSize: 11, fontWeight: 700,
              padding: "4px 12px", borderRadius: 20,
            }}>
              {status.replace("_", " ")}
            </span>
          </div>

          {/* Description */}
          <p style={{
            color: "#ffffff", fontSize: 15,
            fontWeight: 500, lineHeight: 1.5,
            marginBottom: 16,
          }}>
            "{job.problemDescription}"
          </p>

          {/* Info grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 10,
          }}>
            <InfoTile label="Customer"
              value={job.customerName} />
            <InfoTile label="Location"
              value={job.customerLocation} />
            <InfoTile label="Budget"
              value={`₹${job.budgetAmount}`}
              valueColor="#e8c547" />
            <InfoTile label="Posted"
              value={timeAgo(job.createdAt)} />
          </div>
        </div>

        {/* ════════════════════════════════════
            SECTION A — Submit Quote
            Only shown when status = ACCEPTED
        ════════════════════════════════════ */}
        {status === "ACCEPTED" && (
          <div style={{
            background: "#0d1a1a",
            border: "1px solid rgba(232,197,71,0.25)",
            borderRadius: 14, padding: 20,
            marginBottom: 20,
          }}>
            <SectionLabel text="Submit Your Quote" />

            <form onSubmit={handleSubmitQuote}>

              {/* Price input */}
              <div style={{ marginBottom: 12 }}>
                <label style={{
                  color: "#8aa8a8", fontSize: 12,
                  fontWeight: 600, display: "block",
                  marginBottom: 6,
                }}>
                  Your Price (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 800"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#081212",
                    border: "0.5px solid #1a3333",
                    borderRadius: 10, height: 44,
                    padding: "0 14px",
                    color: "#ffffff", fontSize: 14,
                    fontWeight: 600,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              {/* Message textarea */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  color: "#8aa8a8", fontSize: 12,
                  fontWeight: 600, display: "block",
                  marginBottom: 6,
                }}>
                  Message to Customer
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what work you will do, estimated time, what is included..."
                  value={quoteMsg}
                  onChange={(e) => setQuoteMsg(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#081212",
                    border: "0.5px solid #1a3333",
                    borderRadius: 10,
                    padding: "12px 14px",
                    color: "#ffffff", fontSize: 13,
                    lineHeight: 1.5, resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none", minHeight: 90,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={quoteLoading}
                style={{
                  width: "100%", height: 44,
                  background: quoteLoading
                    ? "#b09830" : "#e8c547",
                  border: "none", borderRadius: 10,
                  color: "#020b0b", fontSize: 14,
                  fontWeight: 800,
                  cursor: quoteLoading
                    ? "not-allowed" : "pointer",
                }}
              >
                {quoteLoading
                  ? "Sending Quote..." : "📤 Send Quote to Customer"}
              </button>
            </form>
          </div>
        )}

        {/* ════════════════════════════════════
            SECTION B — Quote Sent (waiting)
            Shown when status = QUOTE_RECEIVED
        ════════════════════════════════════ */}
        {status === "QUOTE_RECEIVED" && (
          <div style={{
            background: "#0d1a1a",
            border: "0.5px solid rgba(59,130,246,0.3)",
            borderRadius: 14, padding: 20,
            marginBottom: 20,
            textAlign: "center",
          }}>
            <p style={{
              color: "#60a5fa", fontSize: 14,
              margin: 0,
            }}>
              ⏳ Quote sent! Waiting for customer to accept...
            </p>
          </div>
        )}

        {/* ════════════════════════════════════
            SECTION C — Update Status
            Shown when status = IN_PROGRESS
        ════════════════════════════════════ */}
        {status === "IN_PROGRESS" && (
          <div style={{
            background: "#0d1a1a",
            border: "0.5px solid rgba(16,185,129,0.3)",
            borderRadius: 14, padding: 20,
            marginBottom: 20,
          }}>
            <SectionLabel text="Update Job Status" />

            <p style={{
              color: "#b0c8c8", fontSize: 13,
              marginBottom: 16,
            }}>
              Job is in progress! Mark it as completed
              when the work is done.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() =>
                  handleUpdateStatus("COMPLETED")}
                disabled={statusLoading}
                style={{
                  flex: 1, height: 44,
                  background: statusLoading
                    ? "#0a3a2a" : "#e8c547",
                  border: "none", borderRadius: 10,
                  color: statusLoading
                    ? "#34d399" : "#020b0b",
                  fontSize: 13, fontWeight: 800,
                  cursor: statusLoading
                    ? "not-allowed" : "pointer",
                }}
              >
                {statusLoading
                  ? "Updating..." : "✅ Mark as Completed"}
              </button>

              <button
                onClick={() =>
                  handleUpdateStatus("CANCELLED")}
                disabled={statusLoading}
                style={{
                  height: 44, padding: "0 16px",
                  background: "transparent",
                  border: "1px solid rgba(248,113,113,0.35)",
                  borderRadius: 10, color: "#f87171",
                  fontSize: 13, fontWeight: 700,
                  cursor: statusLoading
                    ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            SECTION D — Job Completed!
            Upload after photo + summary
        ════════════════════════════════════ */}
        {status === "COMPLETED" && (
          <div style={{
            background: "#0d1a1a",
            border: "0.5px solid rgba(16,185,129,0.3)",
            borderRadius: 14, padding: 20,
            marginBottom: 20,
          }}>
            <SectionLabel text="Job Completed 🎉" />

            <div style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 10, marginBottom: 20,
            }}>
              <InfoTile label="Completed on"
                value={fmtDate(job.updatedAt)} />
              <InfoTile label="Customer"
                value={job.customerName} />
              <InfoTile label="Final Budget"
                value={`₹${job.budgetAmount}`}
                valueColor="#e8c547" />
            </div>

            {/* After photo upload */}
            <div style={{
              background: "#081212",
              border: "0.5px solid #1a3333",
              borderRadius: 10, padding: 16,
            }}>
              <p style={{
                color: "#8aa8a8", fontSize: 12,
                fontWeight: 700, margin: "0 0 10px",
              }}>
                After Photo
              </p>

              {job.afterImageUrl ? (
                <img
                  src={job.afterImageUrl}
                  alt="After work"
                  style={{
                    width: "100%", maxHeight: 220,
                    objectFit: "cover", borderRadius: 8,
                    border: "0.5px solid #1a3333",
                  }}
                />
              ) : (
                <label style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 100, borderRadius: 8,
                  border: "1px dashed #1a3333",
                  background: "rgba(232,197,71,0.04)",
                  cursor: imgUploading
                    ? "not-allowed" : "pointer",
                  gap: 6,
                }}>
                  <span style={{
                    color: "#e8c547", fontSize: 12,
                    fontWeight: 700,
                  }}>
                    {imgUploading
                      ? "⏳ Uploading..."
                      : "📷 Upload After Photo"}
                  </span>
                  <span style={{
                    color: "#8aa8a8", fontSize: 11,
                  }}>
                    Max 5MB · JPG, PNG, WebP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={imgUploading}
                    onChange={handleAfterImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            SECTION E — Cancelled
        ════════════════════════════════════ */}
        {status === "CANCELLED" && (
          <div style={{
            background: "#0d1a1a",
            border: "0.5px solid rgba(248,113,113,0.3)",
            borderRadius: 14, padding: 20,
            textAlign: "center",
          }}>
            <p style={{
              color: "#f87171", fontSize: 14, margin: 0,
            }}>
              ❌ This job has been cancelled.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}