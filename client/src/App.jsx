import './App.css'
import Home from './pages/Home';
import SearchResult from './pages/SearchResult';
import { ThemeProvider } from '@mui/material';
import myTheme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<SearchResult />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;