import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppStore } from "../app/store";
import { getGoogleRedirectUri, loginWithGoogleCode } from "../services/authApi";
import CompleteProfile from "./CompleteProfile";
export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuthSession = useAppStore((state) => state.setAuthSession);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) {
      return;
    }
    ranRef.current = true;

    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      toast.error("Google sign-in was cancelled or failed.");
      navigate("/login", { replace: true });
      return;
    }

    if (!code) {
      toast.error("Missing Google authorization code.");
      navigate("/login", { replace: true });
      return;
    }

    let pendingRoleData = null;
    try {
      const stored = localStorage.getItem("google_pending_role");
      if (stored) {
        pendingRoleData = JSON.parse(stored);
      }
    } catch {
      pendingRoleData = null;
    } finally {
      localStorage.removeItem("google_pending_role");
    }

    const payload = {
      code,
      redirectUri: getGoogleRedirectUri(),
      role: pendingRoleData?.role || "CUSTOMER",
      phone: pendingRoleData?.phone || null,
      tradeCategory: pendingRoleData?.tradeCategory || null,
      experienceYears: pendingRoleData?.experienceYears || 0,
      serviceArea: pendingRoleData?.serviceArea || null,
    
    };

    loginWithGoogleCode(payload)
      .then((data) => {
        console.log("Google login response:", data);
        if (data && data.requireMoreinfo) {
          toast.info("Just one more step! Please complete your profile.");
          localStorage.setItem("pending_google_email", data.email);
          navigate("/complete-profile", { replace: true });
          console.log("Navigating to complete-profile with email:", data.email);
          return;
        }
        console.log("Google login successful, setting auth session:", data);
        setAuthSession({ token: data.token, role: data.role });
        toast.success(data.message || "Google login successful!");
        const role = String(data.role || "").toUpperCase();
        if (role.includes("ADMIN")) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch((error)=>{
        console.error("Google login failed:", error);
        toast.error(error.message || "Google sign-in failed.");
        navigate("/login", { replace: true });
      })
  }, [navigate, searchParams, setAuthSession]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#020b0b",
      gap: 12,
    }}>
     
      <div style={{
        width: 36, height: 36,
        border: "3px solid #1a3333",
        borderTop: "3px solid #e8c547",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <p style={{ color: "#8aa8a8", fontSize: 14 }}>
        Completing Google sign-in...
      </p>
    </div>
  );
}
