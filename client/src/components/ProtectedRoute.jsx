import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  if (!user) {
    // Redirect to login and remember where the user wanted to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Supports both nested routes (Outlet) and wrapping a single element (children)
  return children ? children : <Outlet />;
}