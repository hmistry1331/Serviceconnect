import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAppStore } from "../app/store";
import { buildGoogleOAuthUrl, login } from "../lib/authApi";

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
          backgroundColor: "#111f1f",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="hidden lg:flex flex-col justify-between p-8 shrink-0"
          style={{ width: "280px", backgroundColor: "#0d1a1a" }}
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
                  <p style={{ fontSize: "11px", color: "#6b9090" }}>
                    Trusted local services
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom tagline */}
          <p style={{ fontSize: "11px", color: "#4a7070", lineHeight: 1.6 }}>
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
                border: "1px solid rgba(255,255,255,0.08)",
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
                border: "1px solid rgba(255,255,255,0.08)",
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
                  color: "#4a7070",
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
                      ? "rgba(20,180,100,0.12)"
                      : "rgba(220,60,60,0.12)",
                  color: statusType === "success" ? "#4ade80" : "#f87171",
                  border: `1px solid ${
                    statusType === "success"
                      ? "rgba(74,222,128,0.25)"
                      : "rgba(248,113,113,0.25)"
                  }`,
                }}
              >
                {statusMessage}
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
              <span
                style={{
                  fontSize: "11px",
                  color: "#3a6060",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Or
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
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
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#b0c8c8",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(232,197,71,0.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
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
                color: "#4a7070",
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
  );
}