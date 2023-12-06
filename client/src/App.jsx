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

function App() {
  return (
    <ThemeProvider theme={myTheme}>
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
          </Routes>
        </Router>
    </ThemeProvider>
    </ThemeProvider>
  );
}

export default App;