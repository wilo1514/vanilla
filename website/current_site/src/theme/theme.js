import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#A88742', contrastText: '#101010' },
    secondary: { main: '#15110D' },
    background: { default: '#F8F4EC', paper: '#ffffff' },
    text: { primary: '#201C18', secondary: '#5D544B' },
  },
  typography: {
    fontFamily: "'Inter', 'Montserrat', sans-serif",
    h1: { fontWeight: 850, letterSpacing: '0' , fontSize: '4rem',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },},
    h2: { fontWeight: 800, color: '#1a1a1a', letterSpacing: '0' },
    h5: { fontWeight: 500, lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          letterSpacing: 0,
          borderRadius: 6
        }
      }
    }
  }
});
