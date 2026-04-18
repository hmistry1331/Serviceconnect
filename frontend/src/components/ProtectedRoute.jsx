import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../app/store";

function normalizeRole(role) {
  return String(role || "").trim().toUpperCase();
}

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const tokenFromStore = useAppStore((state) => state.auth.token);
  const roleFromStore = useAppStore((state) => state.auth.role);
  const token = tokenFromStore || localStorage.getItem("token");
  const role = normalizeRole(roleFromStore || localStorage.getItem("role"));

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some((allowedRole) =>
      role.includes(normalizeRole(allowedRole))
    );

    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
