// my-website/src/components/ProtectedRoute.tsx
import React, { useEffect, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHistory, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, token } = useAuth();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // If there's no user and no token, redirect to login, passing the current path for redirection after login
    if (!user && !token) {
      history.push(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [user, token, history, location]);

  // Render children only if user or token exists
  return (user || token) ? <>{children}</> : null;
};

export default ProtectedRoute;
