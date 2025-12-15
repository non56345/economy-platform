import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: userRole, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/student" replace />;
  }

  return children;
}
