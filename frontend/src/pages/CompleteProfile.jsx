import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppStore } from "../app/store";
import { completeGoogleProfile } from "../services/authApi";
import { GUJARAT_CITIES } from "../lib/gujaratCities";
import { SERVICE_CATEGORIES } from "../lib/serviceCategories";
export default function CompleteProfile() {
    const navigate = useNavigate();
    const setAuthSession = useAppStore((state) => state.setAuthSession);

    const [email, setEmail] = useState("");
    const [activeRole, setActiveRole] = useState("client");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        phone: "",
        tradeCategory: "",
        experienceYears: "",
        serviceArea: "",
    });

    const isWorker = activeRole === "professional";

    useEffect(() => {
        // Grab the email we saved during the Google callback
        const savedEmail = localStorage.getItem("pending_google_email");
        if (!savedEmail) {
            toast.error("No pending registration found. Please log in again.");
            navigate("/login", { replace: true });
        } else {
            setEmail(savedEmail);
        }
    }, [navigate]);

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleRoleChange = (role) => {
        setActiveRole(role);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.phone.trim()) {
            toast.error("Phone number is required.");
            return;
        }

        if (isWorker) {
            if (!formData.tradeCategory || !formData.experienceYears || !formData.serviceArea) {
                toast.error("Please complete all worker profile fields.");
                return;
            }
        }

        const payload = {
            email: email,
            role: isWorker ? "WORKER" : "CUSTOMER",
            phone: formData.phone,
            tradeCategory: isWorker ? formData.tradeCategory : "",
            experienceYears: isWorker ? Number(formData.experienceYears) : 0,
            serviceArea: isWorker ? formData.serviceArea : "",
        };

        try {
            setIsSubmitting(true);

            const data = await completeGoogleProfile(payload);

            // Clean up the local storage
            localStorage.removeItem("pending_google_email");

            // Log them in!
            setAuthSession({ token: data.token, role: data.role });
            toast.success(data.message || "Profile completed successfully!");

            const roleStr = String(data.role || "").toUpperCase();
            if (roleStr.includes("ADMIN")) {
                navigate("/admin", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }

        } catch (error) {
            toast.error(error.message || "Failed to complete profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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
            <div
                className="relative flex w-full overflow-hidden rounded-2xl"
                style={{
                    maxWidth: "500px",
                    backgroundColor: "#111f1f",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                }}
            >
                <div className="flex-1 flex flex-col p-8 sm:p-10">
                    <div className="mb-7">
                        <h1
                            style={{
                                fontSize: "22px",
                                fontWeight: 800,
                                color: "#ffffff",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.2,
                            }}
                        >
                            Complete Your <span style={{ color: "#e8c547" }}>Profile</span>
                        </h1>
                        <p style={{ fontSize: "12px", color: "#5a8080", marginTop: "4px" }}>
                            You logged in with Google! Just a few more details for {email}.
                        </p>
                    </div>

                    <div
                        className="flex shrink-0 mb-6 w-max"
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
                                padding: "6px 14px",
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
                                padding: "6px 14px",
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

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                                placeholder="Phone Number *"
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
                                    <select
                                        value={formData.tradeCategory}
                                        onChange={handleChange("tradeCategory")}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            outline: "none",
                                            color: formData.tradeCategory ? "#ffffff" : "#6b9090",
                                            fontSize: "13px",
                                            width: "100%",
                                        }}
                                    >
                                        <option value="" style={{ color: "#0d1a1a" }}>
                                            Select Trade Category *
                                        </option>
                                        {SERVICE_CATEGORIES.map((category) => (
                                            <option key={category.value} value={category.label} style={{ color: "#0d1a1a" }}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
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
                                            placeholder="Years of Experience *"
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
                                                color: formData.serviceArea ? "#ffffff" : "#6b9090",
                                                fontSize: "13px",
                                                width: "100%",
                                            }}
                                        >
                                            <option value="" style={{ color: "#0d1a1a" }}>
                                                Select City *
                                            </option>
                                            {GUJARAT_CITIES.map((city) => (
                                                <option key={city.value} value={city.value} style={{ color: "#0d1a1a" }}>
                                                    {city.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

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
                                marginTop: "16px",
                            }}
                        >
                            {isSubmitting ? "Saving..." : "Complete Setup"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}