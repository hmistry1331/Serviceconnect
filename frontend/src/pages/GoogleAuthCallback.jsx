import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppStore } from "../app/store";
import { loginWithGoogleCode } from "../lib/authApi";

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

    loginWithGoogleCode({
      code,
      redirectUri: window.location.origin + "/auth/google/callback",
    })
      .then((data) => {
        setAuthSession({ token: data.token, role: data.role });
        toast.success(data.message || "Google login successful!");

        const role = String(data.role || "").toUpperCase();
        if (role.includes("WORKER")) {
          navigate("/", { replace: true });
        } else if (role.includes("ADMIN")) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        toast.error(error.message || "Google sign-in failed.");
        navigate("/login", { replace: true });
      });
  }, [navigate, searchParams, setAuthSession]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020b0b",
        color: "#fff",
      }}
    >
      Completing Google sign-in...
    </div>
  );
}
