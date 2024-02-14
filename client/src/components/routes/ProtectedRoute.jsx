import React from 'react';
import { Navigate } from 'react-router-dom';
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { connectedUser, loading } = useGetConnectedUser();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!connectedUser || connectedUser.length === 0) {
    return <Navigate to="/login" replace />;
  }

  if (connectedUser.roles.includes('ROLE_PRO') && connectedUser.companie) {
    return <Navigate to="/" replace />;
  }

  const userRoles = connectedUser.roles ? connectedUser.roles : [];
  const hasPermission = userRoles.some(role => allowedRoles.includes(role));

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
