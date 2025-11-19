import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * ProtectedRouteProps
 * - children: route content that requires authentication
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute
 * Small wrapper used in route definitions to redirect unauthenticated users
 * back to the landing page. Preserves `location` in state so callers can redirect
 * after login if desired.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};