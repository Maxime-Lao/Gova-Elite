import './App.css'
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
import Customers from "./pages/Customers.jsx";
import IdentifyEmail from "./components/login/IdentifyEmail.jsx";
import ResetPassword from "./components/login/ResetPassword.jsx";
import Account from "./components/account/Account.jsx";

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/login/identify" element={<IdentifyEmail />} />
            <Route path="/resetpswd/:token" element={<ResetPassword />} />
            <Route path="/account" element={<Account />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;