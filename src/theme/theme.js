import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ff6b6b',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    background: {
      default: '#f8f9ff',
      paper: 'rgba(255, 255, 255, 0.7)',
    },
    divider: '#e0e0e0',
    glass: {
      light: 'rgba(255, 255, 255, 0.85)',
      lighter: 'rgba(255, 255, 255, 0.6)',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#ff6b6b',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    background: {
      default: '#0a0e27',
      paper: 'rgba(15, 23, 42, 0.8)',
    },
    divider: '#333333',
    glass: {
      light: 'rgba(30, 40, 70, 0.8)',
      lighter: 'rgba(20, 30, 55, 0.6)',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default lightTheme;