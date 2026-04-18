import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home as HomeIcon,
  LayoutGrid,
  MapPin,
  Paintbrush,
  Search,
  SprayCan,
  User,
  Wallet,
  Wrench,
  Zap,
  Wind,
  Hammer,
  X,
} from "lucide-react";
import { useAppStore } from "../../app/store";

const NAV = [
  { label: "Feed", icon: LayoutGrid, to: "/feed" },
  { label: "Schedule", icon: Calendar, to: "/schedule" },
  { label: "Earnings", icon: Wallet, to: "/worker" },
  { label: "Profile", icon: User, to: "/profile" },
];

const CATEGORY_ICON = {
  Plumbing: Wrench,
  Electrical: Zap,
  HVAC: Wind,
  Carpentry: Hammer,
  Painting: Paintbrush,
  Cleaning: SprayCan,
  Roofing: HomeIcon,
};

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

function formatMoney(amount) {
  const num = Number(amount || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDateTime(value) {
  if (!value) {
    return "N/A";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WorkerFeedPage() {
  const jobs = useAppStore((state) => state.workerFeed.jobs);
  const loading = useAppStore((state) => state.workerFeed.loading);
  const error = useAppStore((state) => state.workerFeed.error);
  const statusMessage = useAppStore((state) => state.workerFeed.statusMessage);
  const search = useAppStore((state) => state.workerFeed.search);
  const setWorkerFeedJobs = useAppStore((state) => state.setWorkerFeedJobs);
  const setWorkerFeedLoading = useAppStore((state) => state.setWorkerFeedLoading);
  const setWorkerFeedError = useAppStore((state) => state.setWorkerFeedError);
  const setWorkerFeedStatusMessage = useAppStore((state) => state.setWorkerFeedStatusMessage);
  const setWorkerFeedSearch = useAppStore((state) => state.setWorkerFeedSearch);
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [loadingActionIds, setLoadingActionIds] = useState(new Set());
  const [quoteDrafts, setQuoteDrafts] = useState({});
  const location = useLocation();

  const token = localStorage.getItem("token");

  const fetchWorkerFeed = useCallback(async () => {
    if (!token) {
      setWorkerFeedError("Please sign in as a worker to view your feed.");
      setWorkerFeedLoading(false);
      return;
    }

    try {
      setWorkerFeedLoading(true);
      setWorkerFeedError("");

      const response = await fetch(`${apiBaseUrl}/api/jobs/worker/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to load worker feed.");
      }

      const data = await response.json();
      setWorkerFeedJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setWorkerFeedError(err.message || "Failed to load worker feed.");
    } finally {
      setWorkerFeedLoading(false);
    }
  }, [setWorkerFeedError, setWorkerFeedJobs, setWorkerFeedLoading, token]);

  useEffect(() => {
    fetchWorkerFeed();
  }, [fetchWorkerFeed]);

  const withActionLoading = async (jobId, fn) => {
    setLoadingActionIds((prev) => new Set(prev).add(jobId));
    try {
      await fn();
    } finally {
      setLoadingActionIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  };

  const handleAccept = async (jobId) => {
    await withActionLoading(jobId, async () => {
      const response = await fetch(`${apiBaseUrl}/api/jobs/accept/${jobId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Could not accept this job.");
      }

      const updatedJob = await response.json();
      setWorkerFeedJobs((prev) => prev.map((job) => (job.id === jobId ? updatedJob : job)));
      setWorkerFeedStatusMessage(`Accepted job #${jobId}.`);
    }).catch((err) => {
      setWorkerFeedStatusMessage(err.message || "Could not accept this job.");
    });
  };

  const handleHide = (jobId) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(jobId);
      return next;
    });
  };

  const handleQuoteInput = (jobId, field, value) => {
    setQuoteDrafts((prev) => ({
      ...prev,
      [jobId]: {
        quotedPrice: prev[jobId]?.quotedPrice ?? "",
        message: prev[jobId]?.message ?? "",
        [field]: value,
      },
    }));
  };

  const handleSubmitQuote = async (jobId) => {
    const draft = quoteDrafts[jobId] || { quotedPrice: "", message: "" };
    const quotedPrice = Number(draft.quotedPrice);

    if (!Number.isFinite(quotedPrice) || quotedPrice <= 0) {
      setWorkerFeedStatusMessage("Enter a valid quote amount greater than 0.");
      return;
    }

    await withActionLoading(jobId, async () => {
      const response = await fetch(`${apiBaseUrl}/api/quotes/submit/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quotedPrice,
          message: draft.message || "",
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Could not submit quote.");
      }

      setWorkerFeedJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: "QUOTE_RECEIVED",
                updatedAt: new Date().toISOString(),
              }
            : job
        )
      );

      setQuoteDrafts((prev) => ({
        ...prev,
        [jobId]: { quotedPrice: "", message: "" },
      }));
      setWorkerFeedStatusMessage(`Quote submitted for job #${jobId}.`);
    }).catch((err) => {
      setWorkerFeedStatusMessage(err.message || "Could not submit quote.");
    });
  };

  const filteredJobs = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return jobs.filter((job) => {
      if (hiddenIds.has(job.id)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [
        String(job.id ?? ""),
        job.customerName,
        job.category,
        job.description,
        job.location,
        job.status,
      ]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(needle));
    });
  }, [jobs, hiddenIds, search]);

  const pendingCount = filteredJobs.filter((j) => j.status === "PENDING").length;
  const acceptedCount = filteredJobs.filter((j) => j.status === "ACCEPTED").length;
  const quoteReceivedCount = filteredJobs.filter((j) => j.status === "QUOTE_RECEIVED").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020b0b",
        color: "#ffffff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          color: #648484;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid transparent;
          transition: all .15s ease;
        }
        .nav-item:hover { color: #a5c5c5; background: rgba(255,255,255,0.03); }
        .nav-item.active { color: #e8c547; border-color: rgba(232,197,71,0.18); background: rgba(232,197,71,0.08); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 18px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
          <aside
            style={{
              background: "#071111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 14,
              height: "fit-content",
              position: "sticky",
              top: 20,
            }}
            className="hidden md:block"
          >
            <Link to="/" style={{ display: "inline-flex", color: "#fff", textDecoration: "none", marginBottom: 18, fontWeight: 800 }}>
              Service<span style={{ color: "#e8c547" }}>Connect</span>
            </Link>

            <nav style={{ display: "grid", gap: 6 }}>
              {NAV.map((item) => {
                const NavIcon = item.icon;

                return (
                  <Link key={item.label} to={item.to} className={`nav-item${location.pathname === item.to ? " active" : ""}`}>
                    <NavIcon size={15} />
                    {item.label}
                    {location.pathname === item.to && <ChevronRight size={13} style={{ marginLeft: "auto" }} />}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main>
            <header
              style={{
                background: "#071111",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "16px 18px",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <p style={{ color: "#e8c547", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                    Worker Feed
                  </p>
                  <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Live Job Requests</h1>
                </div>

                <button
                  onClick={fetchWorkerFeed}
                  style={{
                    background: "#e8c547",
                    color: "#0d1a1a",
                    border: 0,
                    borderRadius: 10,
                    height: 38,
                    padding: "0 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Refresh
                </button>
              </div>

              <div style={{ marginTop: 12, position: "relative", maxWidth: 420 }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#648484" }} />
                <input
                  value={search}
                  onChange={(e) => setWorkerFeedSearch(e.target.value)}
                  placeholder="Search by customer, status, category, location"
                  style={{
                    width: "100%",
                    background: "#0a1818",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 10,
                    height: 38,
                    color: "#fff",
                    padding: "0 12px 0 34px",
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
                {[
                  { label: "Total", value: filteredJobs.length, color: "#fff" },
                  { label: "Pending", value: pendingCount, color: "#e8c547" },
                  { label: "Accepted", value: acceptedCount, color: "#34d399" },
                  { label: "Quote Received", value: quoteReceivedCount, color: "#93c5fd" },
                ].map((stat) => (
                  <div key={stat.label} style={{ background: "#0a1818", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 13px" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#5b7a7a", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</p>
                    <p style={{ margin: "5px 0 0", fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {statusMessage ? (
                <p style={{ marginTop: 12, marginBottom: 0, color: "#9ed5c0", fontSize: 13 }}>{statusMessage}</p>
              ) : null}
              {error ? <p style={{ marginTop: 12, marginBottom: 0, color: "#fca5a5", fontSize: 13 }}>{error}</p> : null}
            </header>

            {loading ? (
              <div style={{ padding: "36px 0", textAlign: "center", color: "#6a8a8a" }}>Loading worker feed...</div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ padding: "36px 0", textAlign: "center", color: "#6a8a8a" }}>No jobs matched your current search.</div>
            ) : (
              <section style={{ display: "grid", gap: 12 }}>
                {filteredJobs.map((job) => {
                  const Icon = CATEGORY_ICON[job.category] || Wrench;
                  const isPending = job.status === "PENDING";
                  const isAccepted = job.status === "ACCEPTED";
                  const isActionLoading = loadingActionIds.has(job.id);
                  const quoteDraft = quoteDrafts[job.id] || { quotedPrice: "", message: "" };

                  return (
                    <article
                      key={job.id}
                      style={{
                        background: "#071111",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        padding: "16px 16px 14px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center", background: "rgba(232,197,71,0.11)", border: "1px solid rgba(232,197,71,0.2)" }}>
                            <Icon size={16} color="#e8c547" />
                          </div>
                          <div>
                            <p style={{ margin: 0, color: "#e8c547", fontWeight: 700, fontSize: 13 }}>{job.category || "General"}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6f9191" }}>Job #{job.id}</p>
                          </div>
                        </div>

                        <div style={{ display: "inline-flex", borderRadius: 999, fontSize: 11, fontWeight: 700, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#d0e3e3" }}>
                          {job.status || "UNKNOWN"}
                        </div>
                      </div>

                      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8 }}>
                        <p style={{ margin: 0, fontSize: 13 }}><strong>Customer:</strong> {job.customerName || "N/A"}</p>
                        <p style={{ margin: 0, fontSize: 13 }}><strong>Budget:</strong> {formatMoney(job.budgetAmount)}</p>
                        <p style={{ margin: 0, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {job.location || "N/A"}</p>
                        <p style={{ margin: 0, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} /> {formatDateTime(job.createdAt)}</p>
                      </div>

                      <p style={{ margin: "12px 0 0", color: "#bdd0d0", fontSize: 13, lineHeight: 1.55 }}>
                        {job.description || "No description provided."}
                      </p>

                      <div style={{ marginTop: 12, color: "#6f9191", fontSize: 12 }}>
                        Updated: {formatDateTime(job.updatedAt)}
                      </div>

                      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => handleHide(job.id)}
                          style={{
                            border: "1px solid rgba(248,113,113,0.3)",
                            background: "transparent",
                            color: "#fda4af",
                            borderRadius: 10,
                            height: 36,
                            padding: "0 12px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <X size={14} /> Hide
                        </button>

                        {isPending ? (
                          <button
                            onClick={() => handleAccept(job.id)}
                            disabled={isActionLoading}
                            style={{
                              border: "none",
                              background: "#e8c547",
                              color: "#0d1a1a",
                              borderRadius: 10,
                              height: 36,
                              padding: "0 14px",
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: isActionLoading ? "not-allowed" : "pointer",
                              opacity: isActionLoading ? 0.7 : 1,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <CheckCircle2 size={14} /> {isActionLoading ? "Accepting..." : "Accept Job"}
                          </button>
                        ) : null}
                      </div>

                      {isAccepted ? (
                        <div
                          style={{
                            marginTop: 12,
                            background: "#0a1818",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 12,
                            padding: 12,
                          }}
                        >
                          <p style={{ margin: "0 0 8px", fontSize: 12, color: "#8fc3c3", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Submit Quote (Backend fields)
                          </p>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <input
                              type="number"
                              min="1"
                              placeholder="quotedPrice"
                              value={quoteDraft.quotedPrice}
                              onChange={(e) => handleQuoteInput(job.id, "quotedPrice", e.target.value)}
                              style={{
                                background: "#071111",
                                color: "#fff",
                                border: "1px solid rgba(255,255,255,0.12)",
                                borderRadius: 8,
                                height: 34,
                                padding: "0 10px",
                                fontSize: 12,
                              }}
                            />
                            <input
                              type="text"
                              placeholder="message"
                              value={quoteDraft.message}
                              onChange={(e) => handleQuoteInput(job.id, "message", e.target.value)}
                              style={{
                                background: "#071111",
                                color: "#fff",
                                border: "1px solid rgba(255,255,255,0.12)",
                                borderRadius: 8,
                                height: 34,
                                padding: "0 10px",
                                fontSize: 12,
                              }}
                            />
                          </div>

                          <button
                            onClick={() => handleSubmitQuote(job.id)}
                            disabled={isActionLoading}
                            style={{
                              marginTop: 8,
                              border: "none",
                              background: "#34d399",
                              color: "#063326",
                              borderRadius: 8,
                              height: 34,
                              padding: "0 12px",
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: isActionLoading ? "not-allowed" : "pointer",
                              opacity: isActionLoading ? 0.7 : 1,
                            }}
                          >
                            {isActionLoading ? "Submitting..." : "Submit Quote"}
                          </button>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
