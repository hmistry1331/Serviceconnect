import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup"; 
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import WorkerFeed from "./pages/WorkerFeed";
import CreateJobRequest from "./pages/Createjobrequest";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";
import PlaceholderPage from "./pages/PlaceholderPage";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import Dashboard from "./pages/Dashboard";
import JobRequestDetail from "./pages/JobRequestDetail";
import WorkerJobDetail from "./pages/WorkerJobDetail";
import NotFound from "./pages/Notfound";
import SubmitReview from "./pages/SubmitReview";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

        <Route
        path="/feed"
        element={
          <ProtectedRoute allowedRoles={["WORKER", "PROFESSIONAL"]}>
            <WorkerFeed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job/:jobId"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
            <JobRequestDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:jobId"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
            <SubmitReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/job/:jobId"
        element={
          <ProtectedRoute allowedRoles={["WORKER", "PROFESSIONAL"]}>
            <WorkerJobDetail />
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
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER", "USER", "WORKER", "PROFESSIONAL"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/customer"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/worker"
        element={
          <ProtectedRoute allowedRoles={["WORKER", "PROFESSIONAL"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-job"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
            <CreateJobRequest />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}