import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API =import.meta.env.VITE_API_URL
         || "http://localhost:8080";

// ─── Star Rating Component ────────────────────
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent!",
  };

  return (
    <div>
      {/* Stars Row */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 8,
      }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hovered || value);
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                fontSize: 36,
                transition: "transform 0.1s",
                transform: isActive
                  ? "scale(1.15)" : "scale(1)",
                filter: isActive
                  ? "none"
                  : "grayscale(100%) opacity(0.3)",
              }}
            >
              ⭐
            </button>
          );
        })}
      </div>

      {/* Star Label */}
      {(hovered || value) > 0 && (
        <p style={{
          color: "#e8c547",
          fontSize: 13,
          fontWeight: 700,
          margin: 0,
        }}>
          {labels[hovered || value]}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────
export default function SubmitReview() {
  const { jobId } = useParams();
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");

  const [job,       setJob]       = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [rating,    setRating]    = useState(0);
  const [comment,   setComment]   = useState("");
  const [submitting,setSubmitting]= useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Load job details ─────────────────────────
  const loadJob = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API}/api/customer/dashboard/jobs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to load job");

      const all   = await res.json();
      const found = all.find(
        (j) => j.id === parseInt(jobId)
      );

      if (!found) {
        toast.error("Job not found!");
        navigate("/dashboard");
        return;
      }

      // Only COMPLETED jobs can be reviewed!
      if (found.status !== "COMPLETED") {
        toast.error(
          "You can only review completed jobs!"
        );
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

  // ── Submit Review ────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating!");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(
        `${API}/api/reviews/submit/${jobId}`,
        {
          method:  "POST",
          headers: {
            Authorization:  `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            comment: comment.trim() || null,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          err.message || "Failed to submit review"
        );
      }

      // Show success state!
      setSubmitted(true);
      toast.success("Review submitted! Thank you! 🎉");

    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading ──────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020b0b",
        color: "#8aa8a8",
        fontSize: 14,
      }}>
        Loading...
      </div>
    );
  }

  if (!job) return null;

  // ── Success State ────────────────────────────
  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020b0b",
        padding: "24px 16px",
      }}>
        <div style={{
          maxWidth: 440,
          width: "100%",
          background: "#0d1a1a",
          border: "0.5px solid rgba(16,185,129,0.3)",
          borderRadius: 16,
          padding: 32,
          textAlign: "center",
        }}>
          {/* Big star emoji */}
          <div style={{ fontSize: 56, marginBottom: 16 }}>
            ⭐
          </div>

          <h2 style={{
            color: "#ffffff",
            fontSize: 20,
            fontWeight: 800,
            marginBottom: 8,
          }}>
            Review Submitted!
          </h2>

          <p style={{
            color: "#8aa8a8",
            fontSize: 13,
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            Thank you for rating{" "}
            <span style={{ color: "#e8c547", fontWeight: 700 }}>
              {job.workerName}
            </span>
            ! Your feedback helps other customers
            find great workers.
          </p>

          {/* Rating stars display */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            marginBottom: 24,
            fontSize: 28,
          }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s}
                style={{ opacity: s <= rating ? 1 : 0.2 }}>
                ⭐
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                height: 44,
                background: "#e8c547",
                border: "none",
                borderRadius: 10,
                color: "#020b0b",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => navigate(`/job/${jobId}`)}
              style={{
                height: 44,
                background: "transparent",
                border: "0.5px solid #1a3333",
                borderRadius: 10,
                color: "#8aa8a8",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View Job Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Render ──────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020b0b",
      padding: "24px 16px",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none",
            border: "none",
            color: "#8aa8a8",
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
            marginBottom: 20,
          }}
        >
          ← Back
        </button>

        {/* Page title */}
        <h1 style={{
          color: "#ffffff",
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 4,
          letterSpacing: "-0.02em",
        }}>
          Rate Your{" "}
          <span style={{ color: "#e8c547" }}>
            Experience
          </span>
        </h1>
        <p style={{
          color: "#8aa8a8",
          fontSize: 13,
          marginBottom: 24,
        }}>
          How was the service provided by{" "}
          <span style={{ color: "#ffffff", fontWeight: 600 }}>
            {job.workerName}
          </span>
          ?
        </p>

        {/* ── Job Summary Card ── */}
        <div style={{
          background: "#0d1a1a",
          border: "0.5px solid #1a3333",
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}>
            <span style={{
              background: "#1a3333",
              border: "0.5px solid #e8c547",
              color: "#e8c547",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 20,
            }}>
              {job.category}
            </span>
            <span style={{
              background: "rgba(16,185,129,0.12)",
              border: "0.5px solid rgba(16,185,129,0.3)",
              color: "#34d399",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 20,
            }}>
              COMPLETED ✓
            </span>
          </div>

          <p style={{
            color: "#b0c8c8",
            fontSize: 13,
            margin: "0 0 10px",
            lineHeight: 1.5,
          }}>
            "{job.problemDescription}"
          </p>

          <div style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}>
            <span style={{
              color: "#8aa8a8", fontSize: 12,
            }}>
              📍 {job.customerLocation}
            </span>
            <span style={{
              color: "#e8c547",
              fontSize: 12,
              fontWeight: 700,
            }}>
              ₹{job.budgetAmount}
            </span>
          </div>
        </div>

        {/* ── Review Form ── */}
        <div style={{
          background: "#0d1a1a",
          border: "0.5px solid #1a3333",
          borderRadius: 14,
          padding: 20,
        }}>
          <form onSubmit={handleSubmit}>

            {/* Worker Avatar + Name */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
              padding: "14px 16px",
              background: "#081212",
              border: "0.5px solid #1a3333",
              borderRadius: 12,
            }}>
              <div style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "#1a3333",
                border: "1px solid #e8c547",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                color: "#e8c547",
                flexShrink: 0,
              }}>
                {job.workerName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: 700,
                  margin: 0,
                }}>
                  {job.workerName}
                </p>
                <p style={{
                  color: "#8aa8a8",
                  fontSize: 12,
                  margin: 0,
                }}>
                  {job.category} Professional
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                color: "#8aa8a8",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}>
                Your Rating *
              </label>
              <StarRating
                value={rating}
                onChange={setRating}
              />
            </div>

            {/* Comment Textarea */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                color: "#8aa8a8",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}>
                Your Review{" "}
                <span style={{
                  color: "#5a8080",
                  fontWeight: 400,
                  fontSize: 11,
                  textTransform: "none",
                }}>
                  (optional)
                </span>
              </label>
              <textarea
                rows={4}
                placeholder="Tell others about your experience. Was the worker professional? Did they finish on time? Would you recommend them?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                style={{
                  width: "100%",
                  background: "#081212",
                  border: "0.5px solid #1a3333",
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: "#ffffff",
                  fontSize: 13,
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  minHeight: 110,
                  fontFamily: "inherit",
                }}
              />
              {/* Character count */}
              <p style={{
                color: "#5a8080",
                fontSize: 11,
                textAlign: "right",
                margin: "4px 0 0",
              }}>
                {comment.length}/500
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || rating === 0}
              style={{
                width: "100%",
                height: 48,
                background: (submitting || rating === 0)
                  ? "#1a3333" : "#e8c547",
                border: "none",
                borderRadius: 10,
                color: (submitting || rating === 0)
                  ? "#5a8080" : "#020b0b",
                fontSize: 14,
                fontWeight: 800,
                cursor: (submitting || rating === 0)
                  ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {submitting
                ? "Submitting Review..."
                : rating === 0
                ? "Select a Star Rating First"
                : `Submit ${rating}★ Review`}
            </button>

            {/* Skip link */}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{
                display: "block",
                width: "100%",
                marginTop: 10,
                background: "none",
                border: "none",
                color: "#5a8080",
                fontSize: 12,
                cursor: "pointer",
                textAlign: "center",
                padding: "8px 0",
              }}
            >
              Skip for now
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}