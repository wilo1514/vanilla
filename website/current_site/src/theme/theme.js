import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#858585', contrastText: '#fff' },
    secondary: { main: '#1a1a1a' },
    background: { default: '#FDFCFB', paper: '#ffffff' },
    text: { primary: '#2C2C2C', secondary: '#5F5F5F' },
  },
  typography: {
    fontFamily: "'Inter', 'Montserrat', sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.02em' , fontSize: '4rem',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },},
    h2: { fontWeight: 700, color: '#1a1a1a' },
    h5: { fontWeight: 500, lineHeight: 1.6 },
  },

});