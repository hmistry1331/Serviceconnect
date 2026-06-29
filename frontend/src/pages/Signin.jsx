import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff,X} from "lucide-react";
import { toast } from "react-toastify";
import { useAppStore } from "../app/store";
import { buildGoogleOAuthUrl, login } from "../lib/authApi";
import { SC_THEME } from "../lib/theme";

const AUTH_THEME = SC_THEME;
const CATEGORIES = [
  "Plumbing", "Electrical", "HVAC",
  "Carpentry", "Painting", "Cleaning", "Roofing"
];
const CITIES = [
  "Ahmedabad", "Gandhinagar", "Surat",
  "Baroda", "Bharuch", "Valsad"
];
function GoogleRoleModal({ onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [workerData, setWorkerData] = useState({
    tradeCategory: "",
    experienceYears: "",
    serviceArea: "",
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === "CUSTOMER") {
      onConfirm({ role: "CUSTOMER" });
    } else {
      setStep(2);
    }
  };

  const handleWorkerContinue = () => {
    if (!workerData.tradeCategory) {
      toast.error("Please select a trade category!");
      return;
    }
    if (!workerData.experienceYears ||
      Number(workerData.experienceYears) < 0) {
      toast.error("Please enter valid experience years!");
      return;
    }
    if (!workerData.serviceArea) {
      toast.error("Please select your service area!");
      return;
    }

    onConfirm({
      role: "WORKER",
      tradeCategory: workerData.tradeCategory,
      experienceYears: Number(workerData.experienceYears),
      serviceArea: workerData.serviceArea,
    });
  };

  return (

    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(2,11,11,0.85)",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#0d1a1a",
        border: "0.5px solid #1a3333",
        borderRadius: 16, padding: 28,
        width: "100%", maxWidth: 420,
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none",
            cursor: "pointer", color: "#8aa8a8",
            display: "flex", alignItems: "center",
          }}
        >
          <X size={18} />
        </button>
        {step === 1 && (
          <>
            <h2 style={{
              color: "#ffffff", fontSize: 18,
              fontWeight: 800, marginBottom: 6,
              letterSpacing: "-0.02em",
            }}>
              Join as...
            </h2>
            <p style={{
              color: "#8aa8a8", fontSize: 13,
              marginBottom: 20,
            }}>
              How do you want to use ServiceConnect?
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              {/* Customer Card */}
              <button
                onClick={() => handleRoleSelect("CUSTOMER")}
                style={{
                  flex: 1, padding: "20px 12px",
                  background: "#081212",
                  border: "1px solid #1a3333",
                  borderRadius: 12, cursor: "pointer",
                  transition: "border-color 0.15s",
                  textAlign: "center",
                }}
                onMouseEnter={(e) =>
                  e.currentTarget.style.borderColor = "#e8c547"
                }
                onMouseLeave={(e) =>
                  e.currentTarget.style.borderColor = "#1a3333"
                }
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
                <p style={{
                  color: "#ffffff", fontSize: 14,
                  fontWeight: 700, margin: "0 0 4px",
                }}>
                  Customer
                </p>
                <p style={{
                  color: "#8aa8a8", fontSize: 11,
                  margin: 0, lineHeight: 1.4,
                }}>
                  I need home services
                </p>
              </button>

              <button
                onClick={() => handleRoleSelect("WORKER")}
                style={{
                  flex: 1, padding: "20px 12px",
                  background: "#081212",
                  border: "1px solid #1a3333",
                  borderRadius: 12, cursor: "pointer",
                  transition: "border-color 0.15s",
                  textAlign: "center",
                }}
                onMouseEnter={(e) =>
                  e.currentTarget.style.borderColor = "#e8c547"
                }
                onMouseLeave={(e) =>
                  e.currentTarget.style.borderColor = "#1a3333"
                }
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔧</div>
                <p style={{
                  color: "#ffffff", fontSize: 14,
                  fontWeight: 700, margin: "0 0 4px",
                }}>
                  Worker
                </p>
                <p style={{
                  color: "#8aa8a8", fontSize: 11,
                  margin: 0, lineHeight: 1.4,
                }}>
                  I provide services
                </p>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <button
              onClick={() => setStep(1)}
              style={{
                background: "none", border: "none",
                color: "#8aa8a8", fontSize: 12,
                cursor: "pointer", padding: 0,
                marginBottom: 16,
              }}
            >
              ← Back
            </button>

            <h2 style={{
              color: "#ffffff", fontSize: 18,
              fontWeight: 800, marginBottom: 6,
            }}>
              Worker Details
            </h2>
            <p style={{
              color: "#8aa8a8", fontSize: 13,
              marginBottom: 20,
            }}>
              Tell us about your skills!
            </p>


            <div style={{ marginBottom: 12 }}>
              <label style={{
                color: "#8aa8a8", fontSize: 11,
                fontWeight: 700, display: "block",
                marginBottom: 6, textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                Trade Category *
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={workerData.tradeCategory}
                  onChange={(e) => setWorkerData(
                    prev => ({ ...prev, tradeCategory: e.target.value })
                  )}
                  style={{
                    width: "100%", height: 44,
                    background: "#081212",
                    border: "0.5px solid #1a3333",
                    borderRadius: 10,
                    padding: "0 36px 0 14px",
                    color: workerData.tradeCategory
                      ? "#ffffff" : "#8aa8a8",
                    fontSize: 13, cursor: "pointer",
                    appearance: "none", outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div style={{
                  position: "absolute", right: 12,
                  top: "50%", transform: "translateY(-50%)",
                  pointerEvents: "none", color: "#8aa8a8",
                }}>▾</div>
              </div>
            </div>


            <div style={{ marginBottom: 12 }}>
              <label style={{
                color: "#8aa8a8", fontSize: 11,
                fontWeight: 700, display: "block",
                marginBottom: 6, textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                Experience (Years) *
              </label>
              <input
                type="number"
                min="0"
                max="50"
                placeholder="e.g. 3"
                value={workerData.experienceYears}
                onChange={(e) => setWorkerData(
                  prev => ({ ...prev, experienceYears: e.target.value })
                )}
                style={{
                  width: "100%", height: 44,
                  background: "#081212",
                  border: "0.5px solid #1a3333",
                  borderRadius: 10,
                  padding: "0 14px",
                  color: "#ffffff", fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                color: "#8aa8a8", fontSize: 11,
                fontWeight: 700, display: "block",
                marginBottom: 6, textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                Service Area *
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={workerData.serviceArea}
                  onChange={(e) => setWorkerData(
                    prev => ({ ...prev, serviceArea: e.target.value })
                  )}
                  style={{
                    width: "100%", height: 44,
                    background: "#081212",
                    border: "0.5px solid #1a3333",
                    borderRadius: 10,
                    padding: "0 36px 0 14px",
                    color: workerData.serviceArea
                      ? "#ffffff" : "#8aa8a8",
                    fontSize: 13, cursor: "pointer",
                    appearance: "none", outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select your city</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div style={{
                  position: "absolute", right: 12,
                  top: "50%", transform: "translateY(-50%)",
                  pointerEvents: "none", color: "#8aa8a8",
                }}>▾</div>
              </div>
            </div>


            <button
              onClick={handleWorkerContinue}
              style={{
                width: "100%", height: 46,
                background: "#e8c547",
                border: "none", borderRadius: 10,
                color: "#020b0b", fontSize: 14,
                fontWeight: 800, cursor: "pointer",
              }}
            >
              Continue with Google →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
export default function ServiceConnectSignin() {
  const navigate = useNavigate();
  const setAuthSession = useAppStore((state) => state.setAuthSession);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("idle");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setStatusType("error");
      setStatusMessage("Please enter your email and password.");
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusType("idle");
      setStatusMessage("");

      const data = await login({
        email: formData.email,
        password: formData.password,
      });

      setAuthSession({ token: data.token, role: data.role });

      setStatusType("success");
      const successMessage = data.message || "Login successful!";
      setStatusMessage(successMessage);
      toast.success(successMessage);

      // Role-based redirect — normalise both casing styles from backend
      const role = (data.role || "").toUpperCase();
      if (role.includes("WORKER")) {
        navigate("/");
      } else if (role.includes("ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      const rawMessage = error.message || "Something went wrong. Please try again.";
      const normalizedMessage =
        /invalid password|wrong password|password/i.test(rawMessage)
          ? "Password is incorrect."
          : rawMessage;

      setStatusType("error");
      setStatusMessage(normalizedMessage);
      toast.error(normalizedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleUrl = buildGoogleOAuthUrl();
    if (!googleUrl) {
      toast.error("Google OAuth is not configured in frontend environment.");
      return;
    }
    window.location.href = googleUrl;
  };
    
  return (

    <>
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundImage: "linear-gradient(rgba(7, 20, 20, 0.8), rgba(7, 20, 20, 0.8)), url('/images/img1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Floating Card */}
      <div
        className="relative flex w-full overflow-hidden rounded-2xl"
        style={{
          maxWidth: "780px",
          backgroundColor: AUTH_THEME.surface,
          border: `1px solid ${AUTH_THEME.border}`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="hidden lg:flex flex-col justify-between p-8 shrink-0"
          style={{ width: "280px", backgroundColor: AUTH_THEME.surfaceAlt }}
        >
          {/* Logo */}
          <div>
            <span
              style={{
                color: "#e8c547",
                fontWeight: 800,
                fontSize: "17px",
                letterSpacing: "-0.02em",
              }}
            >
              ServiceConnect
            </span>
          </div>

          <div
            className="relative flex-1 my-6 rounded-xl overflow-hidden flex items-end"
            style={{
              minHeight: "260px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <img
              src="/images/img2.jpg"
              alt="Service professional"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(7, 20, 20, 0.85), rgba(7, 20, 20, 0.25))" }}
            />
            <div className="relative w-full p-5">
              <div className="flex items-center gap-3">
                <img
                  src="/images/img3.jpg"
                  alt="Profile"
                  className="rounded-full shrink-0 object-cover"
                  style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.2)" }}
                />
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>
                    ServiceConnect
                  </p>
                  <p style={{ fontSize: "11px", color: AUTH_THEME.muted }}>
                    Trusted local services
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom tagline */}
          <p style={{ fontSize: "11px", color: AUTH_THEME.muted, lineHeight: 1.6 }}>
            Connecting homeowners with verified professionals since 2025.
          </p>
        </div>

        {/* ── RIGHT PANEL (Form) ── */}
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Welcome To{" "}
              <span style={{ color: "#e8c547" }}>ServiceConnect</span>
            </h1>
            <p style={{ fontSize: "12px", color: "#5a8080", marginTop: "5px" }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* Email */}
            <div
              className="flex items-center"
              style={{
                background: "#0d1a1a",
                border: `1px solid ${AUTH_THEME.border}`,
                borderRadius: "10px",
                height: "50px",
                padding: "0 16px",
              }}
            >
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange("email")}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "13px",
                  width: "100%",
                }}
              />
            </div>

            {/* Password */}
            <div
              className="flex items-center"
              style={{
                background: "#0d1a1a",
                border: `1px solid ${AUTH_THEME.border}`,
                borderRadius: "10px",
                height: "50px",
                padding: "0 16px",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange("password")}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "13px",
                  width: "100%",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: AUTH_THEME.muted,
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "12px",
                  color: "#e8c547",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Status message */}
            {statusMessage && (
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background:
                    statusType === "success"
                      ? AUTH_THEME.successBg
                      : "rgba(220,60,60,0.12)",
                  color: statusType === "success" ? AUTH_THEME.successText : "#f87171",
                  border: `1px solid ${statusType === "success"
                    ? AUTH_THEME.successBorder
                    : "rgba(248,113,113,0.25)"
                    }`,
                }}
              >
                {statusMessage}
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div style={{ flex: 1, height: "1px", background: AUTH_THEME.border }} />
              <span
                style={{
                  fontSize: "11px",
                  color: AUTH_THEME.muted,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Or
              </span>
              <div style={{ flex: 1, height: "1px", background: AUTH_THEME.border }} />
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                height: "50px",
                width: "100%",
                background: "#0d1a1a",
                border: `1px solid ${AUTH_THEME.border}`,
                borderRadius: "10px",
                color: "#b0c8c8",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = AUTH_THEME.accent)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = AUTH_THEME.border)
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Login With Google
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                height: "52px",
                width: "100%",
                background: isSubmitting ? "#b09830" : "#e8c547",
                border: "none",
                borderRadius: "10px",
                color: "#0d1a1a",
                fontSize: "14px",
                fontWeight: 800,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "background 0.15s",
                letterSpacing: "0.01em",
                marginTop: "2px",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.background = "#d4b33e";
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.currentTarget.style.background = "#e8c547";
              }}
            >
              {isSubmitting ? "Signing In..." : "Login"}
            </button>

            {/* Footer link */}
            <p
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: AUTH_THEME.muted,
                marginTop: "6px",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{ color: "#e8c547", fontWeight: 700, textDecoration: "none" }}
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}