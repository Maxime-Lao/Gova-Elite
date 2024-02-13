import './App.css'
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CarDetails from './pages/Car/CarDetails';
import Bookings from './pages/Car/Bookings';
import SearchResult from './pages/SearchResult';
import { ThemeProvider } from '@mui/material';
import myTheme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Brands from './pages/Brands.jsx';
import Categories from './pages/Categories.jsx';
import Gears from './pages/Gears.jsx';
import Energies from './pages/Energies.jsx';
import Companies from './pages/Companies.jsx';
import IdentifyEmail from "./components/login/IdentifyEmail.jsx";
import ResetPassword from "./components/login/ResetPassword.jsx";
import Account from "./components/account/Account.jsx";
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import UpdatePaymentSuccess from './pages/UpdatePaymentSucces.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Rents from './pages/Rents.jsx';
import Comments from './pages/Comments.jsx';
import Cars from './pages/Cars.jsx';
import Models from './pages/Models.jsx';
import CarDetailsPro from "./components/pro/CarDetailsPro.jsx";
import { useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';


function App() {
  const [ libraries ] = useState(['places']);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  return (
      <ThemeProvider theme={myTheme}>
        <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResult isMapLoaded={isLoaded} />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/bookings" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <Bookings />
                </ProtectedRoute>
              } />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Users />
                </ProtectedRoute>
              } />
              <Route path="/admin/cars" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Cars />
                </ProtectedRoute>
              } />
              <Route path="/admin/brands" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Brands />
                </ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="/admin/gears" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Gears />
                </ProtectedRoute>
              } />
              <Route path="/admin/models" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Models />
                </ProtectedRoute>
              } />
              <Route path="/admin/energies" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Energies />
                </ProtectedRoute>
              } />
              <Route path="/admin/companies" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Companies />
                </ProtectedRoute>
              } />
              <Route path="/admin/rents" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Rents />
                </ProtectedRoute>
              } />
              <Route path="/admin/comments" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Comments />
                </ProtectedRoute>
              } />
              <Route path="/login/identify" element={<IdentifyEmail />} />
              <Route path="/resetpswd/:token" element={<ResetPassword />} />
              <Route path="/account" element={
                <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_PRO']}>
                  <Account />
                </ProtectedRoute>
              } />
              <Route path="/payment-success" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <PaymentSuccess />
                </ProtectedRoute>
              } />
              <Route path="/update-payment-success" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <UpdatePaymentSuccess />
                </ProtectedRoute>
              } />
              <Route path="/not-found" element={<NotFoundPage />} />
              <Route path="/car-details/:carId" element={
                <ProtectedRoute allowedRoles={['ROLE_PRO']}>
                  <CarDetailsPro />
                </ProtectedRoute>
              } />
          </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;