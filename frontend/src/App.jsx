import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup"; // <-- Import your new page!
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import WorkerFeed from "./pages/WorkerFeed";
import CreateJobRequest from "./pages/Createjobrequest";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";
import PlaceholderPage from "./pages/PlaceholderPage";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";

export default function App() {
  return (
    <Routes>
      {/* Route 1: Home Page (http://localhost:5173/) */}
      <Route path="/" element={<Home />} />

      {/* Route 2: Your amazing new Signup Page! (http://localhost:5173/signup) */}
      <Route path="/signup" element={<Signup />} />

      {/* Route 3: Signin Page (http://localhost:5173/login) */}
      <Route path="/login" element={<Signin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

      {/* Route 4: Worker feed (http://localhost:5173/feed) */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute allowedRoles={["WORKER", "PROFESSIONAL"]}>
            <WorkerFeed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-job-request"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
            <CreateJobRequest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/schedule"
        element={
          <ProtectedRoute allowedRoles={["WORKER", "PROFESSIONAL"]}>
            <PlaceholderPage title="Schedule" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={["WORKER", "PROFESSIONAL"]}>
            <PlaceholderPage title="Earnings" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["WORKER", "PROFESSIONAL"]}>
            <PlaceholderPage title="Profile" />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}