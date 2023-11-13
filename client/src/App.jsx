import './App.css'
import Home from './pages/Home';
import CarDetails from './pages/Car/CarDetails';
import SearchResult from './pages/SearchResult';
import { ThemeProvider } from '@mui/material';
import myTheme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from "./pages/Register.jsx";

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<SearchResult />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;