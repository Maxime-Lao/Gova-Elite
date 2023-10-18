import './App.css'
import Home from './pages/Home';
import { ThemeProvider } from '@mui/material';
import myTheme from './theme';

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <Home />
    </ThemeProvider>
  )
}

export default App
