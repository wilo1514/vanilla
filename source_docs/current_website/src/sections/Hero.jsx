import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, Stack, Divider } from '@mui/material'; // Añadimos Stack y Divider
import { motion } from 'framer-motion';

// Importaciones desde tus assets
import hero1 from '../assets/hero1.jpeg'; 
import hero2 from '../assets/hero2.jpeg';
import hero3 from '../assets/hero3.jpeg';
import hero4 from '../assets/hero4.jpeg';

// Datos Clave para la Barra Inferior
const credentials = [
  "100% Organic Certified",
  "Sole Source Provider",
  "8.34% Vanillin Content (Top 1%)"
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [hero1, hero2, hero3, hero4];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <Box sx={{ 
      height: '100vh', 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center',
      bgcolor: '#000', 
      overflow: 'hidden'
    }}>
      {/* CAPA DE IMÁGENES */}
      {images.map((img, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: index === currentImage ? 0.6 : 0, 
            transition: 'opacity 1500ms ease-in-out',
            zIndex: 0
          }}
        />
      ))}

      {/* OVERLAY ADAPTATIVO */}
      <Box sx={{ 
        position: 'absolute', 
        inset: 0, 
        background: {
          xs: 'rgba(0,0,0,0.4)', 
          md: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
        },
        zIndex: 1 
      }} />

      {/* CONTENIDO PRINCIPAL */}
      <Container sx={{ 
        zIndex: 2, 
        position: 'relative',
        textAlign: { xs: 'center', md: 'left' },
        mb: { xs: 10, md: 0 } // Damos espacio abajo para que la barra no choque en móvil
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Box 
            component="img" 
            src="/logo.png" 
            alt="Vanilla Republic" 
            sx={{ 
              width: { xs: '220px', md: '450px' }, 
              mb: 0.5, 
              filter: 'brightness(0) invert(1)',
              display: 'inline-block',
              mx: { xs: 'auto', md: 0 }
            }} 
          />
          
          <Typography variant="overline" sx={{ 
            color: 'white', 
            fontWeight: 400, 
            letterSpacing: { xs: 3, md: 6 },
            fontSize: { xs: '0.65rem', md: '0.9rem' },
            textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
            display: 'block',
            mb: 4
          }}>
            PREMIUM ECUADORIAN VANILLA
          </Typography>

          <Typography variant="h5" sx={{ 
            color: 'white', 
            mb: 6, 
            maxWidth: { xs: '100%', md: 600 }, 
            fontWeight: 300,
            textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '0.95rem', md: '1.2rem' },
            lineHeight: 1.6,
            mx: { xs: 'auto', md: 0 }
          }}>
            Carbon-neutral vanilla from the tropical heart of Guayaquil to the Andean air of Cuenca.
          </Typography>

          <Button 
            variant="contained" 
            size="large"
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            sx={{ 
              px: { xs: 4, md: 6 }, 
              py: 1.5, 
              fontSize: '1rem',
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 0,
              '&:hover': {
                bgcolor: '#858585',
                border: '1px solid #858585'
              }
            }}
          >
            Inquire Now
          </Button>
        </motion.div>
      </Container>

      {/* --- NUEVA BARRA DE CREDENCIALES AL PIE --- */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 3,
          // Efecto Vidrio (Glassmorphism)
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          py: { xs: 2, md: 3 }
        }}
      >
        <Container>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} // Columna en móvil, Fila en PC
            spacing={{ xs: 1, md: 4 }}
            alignItems="center"
            justifyContent="center"
            divider={
              // Línea divisora solo visible en escritorio
              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', display: { xs: 'none', md: 'block' } }} />
            }
          >
            {credentials.map((text, index) => (
              <Typography 
                key={index}
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  textTransform: 'uppercase', 
                  letterSpacing: 2,
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', md: '0.85rem' },
                  textAlign: 'center'
                }}
              >
                {text}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

    </Box>
  );
}