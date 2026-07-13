import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material'; 
import { theme } from './theme/theme';
import Navbar from './components/Navbar';
import Hero from './sections/Hero'; // <--- ESTA ES LA IMPORTACIÓN CLAVE
import Production from './sections/Production';
import Sustainability from './sections/Sustainability';
import Contact from './sections/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Hero /> 
        <Production />
        <Sustainability />
        <Contact />
      <Footer />
    </ThemeProvider>
  );
}

export default App;