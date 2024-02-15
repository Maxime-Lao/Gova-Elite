import React from 'react';
import { Navigate } from 'react-router-dom';
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";

const PublicRoute = ({ children }) => {
  const { connectedUser, loading } = useGetConnectedUser();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (connectedUser && connectedUser.id) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
