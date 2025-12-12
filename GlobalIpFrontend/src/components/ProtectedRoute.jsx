import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component to secure routes based on authentication and role
 * @param {ReactNode} children - Component to render if authorized
 * @param {Array<string>} allowedRoles - Array of roles allowed to access this route (e.g., ['ADMIN', 'USER', 'ANALYST'])
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Check if user is authenticated
  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User doesn't have permission, redirect to their appropriate dashboard
    switch (userRole) {
      case 'ADMIN':
        return <Navigate to="/admindashboard" replace />;
      case 'ANALYST':
        return <Navigate to="/analystdashboard" replace />;
      case 'USER':
        return <Navigate to="/userdashboard" replace />;
      default:
        // Unknown role, log out and redirect to login
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and has the correct role
  return children;
};

export default ProtectedRoute;
