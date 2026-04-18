import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getRoleBasedRoute } from '../utils/navigation';

// Component that requires authentication to access
export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // If allowedRoles is specified, check if user has permission
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    console.log(`Access denied: User role '${currentUser.role}' not in allowed roles:`, allowedRoles);
    // Redirect to user's appropriate dashboard based on role
    const redirectRoute = getRoleBasedRoute(currentUser);
    return <Navigate to={redirectRoute} replace />;
  }
  
  return children;
}

// Component that requires NOT being authenticated
export function GuestRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    // Redirect to appropriate dashboard based on role if already authenticated
    const redirectRoute = getRoleBasedRoute(currentUser);
    return <Navigate to={redirectRoute} replace />;
  }
  
  return children;
}