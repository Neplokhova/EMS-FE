import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#009688',   // Teal
      dark: '#00796B',
      light: '#4DB6AC',
    },

    secondary: {
      main: '#607D8B',   // Blue Gray
      dark: '#455A64',
      light: '#B0BEC5',
    },

    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#111827',
      secondary: '#4B5563',
    },
  },

  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),

    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },

    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        },
      },
    },
  },
});
