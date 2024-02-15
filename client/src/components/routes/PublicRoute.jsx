import React from 'react';
import { Navigate } from 'react-router-dom';
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";
import Navbar from "../navbar/Navbar.jsx";
import Loading from "../../assets/img/loading.jpg";

const PublicRoute = ({ children }) => {
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

  if (user.connectedUser && user.connectedUser.id) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
