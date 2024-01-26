
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
      textTransform: 'none',
      fontWeight: '500',
    },
  },
});

export default theme;