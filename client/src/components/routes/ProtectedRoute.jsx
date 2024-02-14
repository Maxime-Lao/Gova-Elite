import React from 'react';
import { Navigate } from 'react-router-dom';
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";
import Navbar from "./navbar/Navbar.jsx";
import Loading from "../assets/img/loading.jpg";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useGetConnectedUser();

  if (user.connectedUser === undefined) {
    return (
        <>
          <Navbar/>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <img className='animate-spin w-20' src={Loading} alt="Loading"/>
            </div>
          </div>
        </>
    );
  }

  if (user.connectedUser === null) {
    return <Navigate to="/login" replace />;
  }


  if (connectedUser.roles.includes('ROLE_PRO') && connectedUser.companie) {
    return <Navigate to="/" replace />;
  }

  const userRoles = user.connectedUser && user.connectedUser.roles ? user.connectedUser.roles : [];

  const hasPermission = userRoles.some(role => allowedRoles.includes(role));

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
