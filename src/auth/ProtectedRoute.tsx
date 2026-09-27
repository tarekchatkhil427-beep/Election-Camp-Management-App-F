import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, MockRole } from '@/auth/MockAuthProvider';

interface ProtectedRouteProps {
  allowedRoles?: MockRole[];
  children?: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
