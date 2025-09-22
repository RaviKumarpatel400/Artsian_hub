import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While checking authentication, you can show a loader
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in → show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
