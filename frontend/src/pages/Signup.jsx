import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { buildGoogleOAuthUrl, signup } from "../lib/authApi";
import { GUJARAT_CITIES, getCityByValue, getNearestSupportedCity } from "../lib/gujaratCities";

const MAX_CITY_DEVIATION_KM = 80;

function getPasswordChecks(password) {
  return {
    minLength: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export default function ServiceConnectSignup() {
  const [activeRole, setActiveRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("idle");
  const [workerCoords, setWorkerCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState({ loading: false, type: "idle", message: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    tradeCategory: "",
    experienceYears: "",
    serviceArea: "",
  });

  const isWorker = activeRole === "professional";
  const passwordChecks = getPasswordChecks(formData.password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === "serviceArea") {
      setWorkerCoords(null);
      setGeoStatus({ loading: false, type: "idle", message: "" });
    }
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setStatusMessage("");
    setStatusType("idle");
  };

  const handleUseCurrentWorkerLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus({ loading: false, type: "error", message: "Geolocation is not supported in this browser." });
      return;
    }

    setGeoStatus({ loading: true, type: "info", message: "Fetching your location..." });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);
        const nearest = getNearestSupportedCity(latitude, longitude);

        if (!nearest) {
          setWorkerCoords(null);
          setGeoStatus({ loading: false, type: "error", message: "Unable to map your GPS location right now." });
          return;
        }

        setFormData((prev) => ({ ...prev, serviceArea: nearest.city.value }));
        setWorkerCoords({ latitude, longitude });

        if (nearest.distanceKm > MAX_CITY_DEVIATION_KM) {
          setGeoStatus({
            loading: false,
            type: "info",
            message: `GPS captured. You are ${nearest.distanceKm.toFixed(1)} km from ${nearest.city.label}. We'll still use your exact coordinates.`,
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
        setGeoStatus({ loading: false, type: "error", message: error.message || "Unable to fetch location." });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      const message = "Please fill in name, email, phone, and password.";
      setStatusType("error");
      setStatusMessage(message);
      toast.error(message);
      return;
    }

    if (!isPasswordValid) {
      const message = "Password does not meet all requirements.";
      setStatusType("error");
      setStatusMessage(message);
      toast.error(message);
      return;
    }

    if (isWorker && (!formData.tradeCategory || !formData.experienceYears || !formData.serviceArea)) {
      const message = "Please complete all worker profile fields.";
      setStatusType("error");
      setStatusMessage(message);
      toast.error(message);
      return;
    }

    const selectedServiceCity = isWorker ? getCityByValue(formData.serviceArea) : null;

    if (isWorker && !selectedServiceCity) {
      const message = "Please select a valid Gujarat city for service area.";
      setStatusType("error");
      setStatusMessage(message);
      toast.error(message);
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: isWorker ? "ROLE_WORKER" : "ROLE_CUSTOMER",
      ...(isWorker
        ? {
            tradeCategory: formData.tradeCategory,
            experienceYears: Number(formData.experienceYears),
            serviceArea: formData.serviceArea,
            workerLatitude: workerCoords?.latitude ?? selectedServiceCity.latitude,
            workerLongitude: workerCoords?.longitude ?? selectedServiceCity.longitude,
          }
        : {
            tradeCategory: "",
            experienceYears: 0,
            serviceArea: "",
            workerLatitude: null,
            workerLongitude: null,
          }),
    };

    try {
      setIsSubmitting(true);
      setStatusType("idle");
      setStatusMessage("");

      const data = await signup(payload);

      const successMessage = data.message || "Account created! You can now log in.";
      setStatusType("success");
      setStatusMessage(successMessage);
      toast.success(successMessage);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        tradeCategory: "",
        experienceYears: "",
        serviceArea: "",
      });
      setWorkerCoords(null);
      setGeoStatus({ loading: false, type: "idle", message: "" });
      setActiveRole("client");
    } catch (error) {
      const rawMessage = error.message || "Something went wrong while creating account.";
      const normalizedMessage =
        /already registered|already exists|email/i.test(rawMessage)
          ? "Email is already registered. Please log in."
          : rawMessage;

      setStatusType("error");
      setStatusMessage(normalizedMessage);
      toast.error(normalizedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
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
          maxWidth: "860px",
          height: "min(92vh, 760px)",
          backgroundColor: "#111f1f",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="hidden lg:flex flex-col justify-between p-8 shrink-0"
          style={{ width: "320px", backgroundColor: "#0d1a1a" }}
        >
          {/* Logo */}
          <div>
            <span style={{ color: "#e8c547", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.02em" }}>
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
            Join thousands of homeowners and professionals on the platform built for trust.
          </p>
        </div>

        {/* ── RIGHT PANEL (Form) ── */}
        <div
          className="flex-1 flex min-h-0 flex-col p-8 sm:p-10"
        >
          {/* Header row */}
          <div className="flex items-start justify-between mb-7">
            <div>
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
              <p style={{ fontSize: "12px", color: "#5a8080", marginTop: "4px" }}>
                Create your free account below
              </p>
            </div>

            {/* Role toggle — pill style like the EN button in reference */}
            <div
              className="flex shrink-0 ml-4"
              style={{
                background: "#0d1a1a",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "3px",
              }}
            >
              <button
                type="button"
                onClick={() => handleRoleChange("client")}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: activeRole === "client" ? "#e8c547" : "transparent",
                  color: activeRole === "client" ? "#0d1a1a" : "#5a8080",
                }}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("professional")}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: activeRole === "professional" ? "#e8c547" : "transparent",
                  color: activeRole === "professional" ? "#0d1a1a" : "#5a8080",
                }}
              >
                Professional
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 pb-2">

            {/* Full Name */}
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
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange("name")}
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

            {/* Phone */}
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
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange("phone")}
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
            <div style={{ marginBottom: 2 }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#7ca0b0",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Password
              </p>
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

            {formData.password.length > 0 && (
              <div
                style={{
                  marginTop: "10px",
                  borderRadius: "12px",
                  background: "rgba(13,26,26,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 22px rgba(0,0,0,0.22)",
                  padding: "14px 14px 10px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    color: "#8db2b2",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  Requirements:
                </p>

                <PasswordRequirement met={passwordChecks.minLength} label="At least 6 characters" />
                <PasswordRequirement met={passwordChecks.uppercase} label="One uppercase letter" />
                <PasswordRequirement met={passwordChecks.lowercase} label="One lowercase letter" />
                <PasswordRequirement met={passwordChecks.number} label="One number" />
                <PasswordRequirement met={passwordChecks.special} label="One special character" />
              </div>
            )}
            </div>

            {/* Worker-only fields */}
            {isWorker && (
              <>
                <div
                  className="flex items-center"
                  style={{
                    background: "#0d1a1a",
                    border: "1px solid rgba(232,197,71,0.2)",
                    borderRadius: "10px",
                    height: "50px",
                    padding: "0 16px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Trade Category  (e.g. Electrician)"
                    value={formData.tradeCategory}
                    onChange={handleChange("tradeCategory")}
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

                <div className="flex gap-3">
                  <div
                    className="flex items-center flex-1"
                    style={{
                      background: "#0d1a1a",
                      border: "1px solid rgba(232,197,71,0.2)",
                      borderRadius: "10px",
                      height: "50px",
                      padding: "0 16px",
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      placeholder="Years of experience"
                      value={formData.experienceYears}
                      onChange={handleChange("experienceYears")}
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

                  <div
                    className="flex items-center flex-1"
                    style={{
                      background: "#0d1a1a",
                      border: "1px solid rgba(232,197,71,0.2)",
                      borderRadius: "10px",
                      height: "50px",
                      padding: "0 16px",
                    }}
                  >
                    <select
                      value={formData.serviceArea}
                      onChange={handleChange("serviceArea")}
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#ffffff",
                        fontSize: "13px",
                        width: "100%",
                      }}
                    >
                      <option value="" style={{ color: "#0d1a1a" }}>
                        Select service city
                      </option>
                      {GUJARAT_CITIES.map((city) => (
                        <option key={city.value} value={city.value} style={{ color: "#0d1a1a" }}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    type="button"
                    onClick={handleUseCurrentWorkerLocation}
                    disabled={geoStatus.loading}
                    style={{
                      background: "#0d1a1a",
                      border: "1px solid rgba(232,197,71,0.25)",
                      borderRadius: "10px",
                      color: "#e8c547",
                      fontSize: "12px",
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
                        margin: 0,
                        fontSize: "11px",
                        color: geoStatus.type === "error" ? "#f87171" : geoStatus.type === "success" ? "#4ade80" : "#6b9090",
                      }}
                    >
                      {geoStatus.message}
                    </p>
                  )}
                </div>
              </>
            )}

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
                  border: `1px solid ${statusType === "success" ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
                }}
              >
                {statusMessage}
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: "11px", color: "#3a6060", fontWeight: 600, letterSpacing: "0.08em" }}>
                Or
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
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
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(232,197,71,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
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
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = "#d4b33e"; }}
              onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.background = "#e8c547"; }}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            {/* Footer link */}
            <p style={{ textAlign: "center", fontSize: "12px", color: "#4a7070", marginTop: "6px" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ color: "#e8c547", fontWeight: 700, textDecoration: "none" }}
              >
                Sign In
              </Link>
            </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "8px",
      }}
    >
      {met ? (
        <Check size={14} color="#4ade80" strokeWidth={2.4} />
      ) : (
        <X size={14} color="#ff5a66" strokeWidth={2.4} />
      )}
      <span
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: met ? "#4ade80" : "#97a6b6",
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
    </div>
  );
}