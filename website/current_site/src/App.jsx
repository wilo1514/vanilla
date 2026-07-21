import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Production from './sections/Production';
import Sustainability from './sections/Sustainability';
import EvidenceWindows from './sections/EvidenceWindows';
import Contact from './sections/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Hero />
      <Sustainability />
      <EvidenceWindows />
      <Production />
      <Contact />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
