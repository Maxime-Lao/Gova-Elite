import React from 'react';
import { Navigate } from 'react-router-dom';
import useGetConnectedUser from "../components/hooks/useGetConnectedUser.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { connectedUser, loading } = useGetConnectedUser();

  if (loading) {
    return <div>Chargement...</div>;
  }

  const userRoles = connectedUser && connectedUser.roles ? connectedUser.roles : [];
  const hasPermission = userRoles.some(role => allowedRoles.includes(role));

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
