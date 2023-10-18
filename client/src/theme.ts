
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#6202ff',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    button: {
      fontFamily: 'Montserrat',
    },
    body2: {
      fontFamily: 'Montserrat',
    },
    fontFamily: 'Montserrat',
  },
});

export default theme;