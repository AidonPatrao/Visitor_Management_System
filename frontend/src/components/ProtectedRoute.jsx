import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute({ user, allowedRoles }) {
  // 1. If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Support both flat object or user wrapped in response ({ user: { role: ... } })
  const actualUser = user.user || user;
  const userRole = actualUser.role ? String(actualUser.role).toUpperCase() : '';

  // Normalize allowedRoles to upper-case
  const normalizedAllowedRoles = allowedRoles ? allowedRoles.map(r => r.toUpperCase()) : [];

  // 2. If user role isn't authorized for this route, redirect to default dashboard
  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
    const defaultRedirect = userRole === 'ADMIN' ? '/admin' : '/operator';
    return <Navigate to={defaultRedirect} replace />;
  }

  // 3. Render nested component routes
  return <Outlet />
}