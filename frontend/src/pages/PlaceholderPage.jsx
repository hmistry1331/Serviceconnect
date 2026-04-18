import { Link } from "react-router-dom";

export default function PlaceholderPage({ title = "Coming Soon" }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020b0b",
        color: "#ffffff",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "560px" }}>
        <h1 style={{ fontSize: "34px", marginBottom: "12px" }}>{title}</h1>
        <p style={{ color: "#8aa8a8", lineHeight: 1.6, marginBottom: "20px" }}>
          This section is now routed correctly and ready for feature implementation.
        </p>
        <Link to="/" style={{ color: "#e8c547", textDecoration: "none", fontWeight: 700 }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
