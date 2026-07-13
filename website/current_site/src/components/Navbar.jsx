import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Container, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkText, setIsDarkText] = useState(false); // Estado: True = Texto Oscuro, False = Texto Blanco

  useEffect(() => {
    const handleScroll = () => {
      const processSection = document.getElementById('process');
      
      if (processSection) {
        const scrollY = window.scrollY;
        const navbarHeight = 80; // Altura aproximada del Navbar para compensar
        
        // Calculamos dónde empieza y dónde termina la sección blanca (Process)
        const processTop = processSection.offsetTop - navbarHeight; 
        const processBottom = processTop + processSection.offsetHeight;

        // LÓGICA INFALIBLE:
        // Si el scroll está ENTRE el inicio y el final de Process -> TEXTO OSCURO
        // Si no (estás en Hero, Sustainability o Contact) -> TEXTO BLANCO
        if (scrollY >= processTop && scrollY < processBottom) {
          setIsDarkText(true);
        } else {
          setIsDarkText(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Process', id: 'process' },
    { label: 'Sustainability', id: 'sustainability' },
    { label: 'Contact', id: 'contact' }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  // --- COLORES DINÁMICOS ---
  // Si isDarkText es true (estamos en Process) -> #1a1a1a (Oscuro)
  // Si isDarkText es false (Hero, Sust, Contact) -> #ffffff (Blanco)
  const textColor = isDarkText ? '#1a1a1a' : '#ffffff';
  
  // Logo: Si texto oscuro -> Filtro none (se ve dorado/negro). Si texto blanco -> Invertir a blanco.
  const logoFilter = isDarkText ? 'none' : 'brightness(0) invert(1)';
  
  // Borde sutil inferior
  const borderColor = isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          bgcolor: 'transparent', // Siempre transparente para ver el fondo
          backdropFilter: 'blur(10px)', // Efecto vidrio
          borderBottom: `1px solid ${borderColor}`,
          transition: 'all 0.3s ease',
          zIndex: 1201 
        }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important', height: { xs: 60, md: 80 } }}>
            
            {/* LOGO */}
            <Box 
              component="img" 
              src="/logo.png" 
              alt="Vanilla Republic" 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              sx={{ 
                height: { xs: 30, md: 40 }, 
                cursor: 'pointer',
                filter: logoFilter, // Cambia dinámicamente
                transition: 'filter 0.3s ease'
              }} 
            />
            
            {/* MENÚ DE ESCRITORIO */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              {navItems.map((item) => (
                <Button 
                  key={item.id} 
                  onClick={() => scrollToSection(item.id)} 
                  sx={{ 
                    color: textColor, // Cambia dinámicamente
                    fontWeight: 700,
                    letterSpacing: 1,
                    transition: 'color 0.3s ease',
                    '&:hover': { opacity: 0.7 }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* HAMBURGUESA MÓVIL */}
            <IconButton 
              onClick={() => setMobileOpen(true)} 
              sx={{ display: { md: 'none' }, color: textColor }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* DRAWER (MENÚ LATERAL) */}
      <Drawer 
        anchor="right" 
        open={mobileOpen} 
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon sx={{ color: '#1a1a1a' }} />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton onClick={() => scrollToSection(item.id)} sx={{ textAlign: 'center', py: 2 }}>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontWeight: 700, color: '#1a1a1a' }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}