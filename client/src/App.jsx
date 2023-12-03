import './App.css'
import Home from './pages/Home';
import CarDetails from './pages/Car/CarDetails';
import Bookings from './pages/Car/Bookings';
import { ThemeProvider } from '@mui/material';
import myTheme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CreateCompanie from "./pages/CreateCompanie.jsx";

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/createCompanie" element={<CreateCompanie />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;