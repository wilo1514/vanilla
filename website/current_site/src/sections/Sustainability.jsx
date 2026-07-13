import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
// Iconos
import SpaIcon from '@mui/icons-material/Spa';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

const stats = [
  { 
    id: 1, 
    value: "100%", 
    label: "Organic Certified", 
    desc: "We are 100% Organic. Pure cultivation without chemicals.",
    icon: <SpaIcon sx={{ fontSize: 40, color: '#D4AF37' }} /> // Icono dorado para resaltar
  },
  { 
    id: 2, 
    value: "8.34", 
    label: "Average Vanillin", 
    desc: "Top 1% Global Content. Unmatched aromatic potency.",
    icon: <WorkspacePremiumIcon sx={{ fontSize: 40, color: '#D4AF37' }} />
  },
  { 
    id: 3, 
    value: "Sole Source", 
    label: "End-to-End Control", 
    desc: "We do all processes start to finish. Full vertical integration.",
    icon: <AllInclusiveIcon sx={{ fontSize: 40, color: '#D4AF37' }} />
  }
];

export default function Sustainability() {
  return (
    <Box sx={{ bgcolor: '#1a1a1a', py: 12 }} id="sustainability">
      <Container>
        
        {/* 1. INTRODUCCIÓN */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: 'center', mb: 10 }}
        >
          <Typography variant="overline" sx={{ color: '#D4AF37', letterSpacing: 3, fontWeight: 700 }}>
            OUR COMMITMENT
          </Typography>
          
          {/* TÍTULO CORREGIDO: Forzamos color blanco */}
          <Typography 
            variant="h2" 
            sx={{ 
              mt: 2, 
              mb: 3, 
              fontWeight: 700, 
              color: '#ffffff', // Blanco puro
              fontSize: { xs: '2.5rem', md: '3.5rem' } // Ajuste de tamaño para móvil
            }}
          >
            Sustainability & Quality
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              opacity: 0.9, 
              fontWeight: 300, 
              color: '#e0e0e0', // Gris muy claro para lectura fácil
              lineHeight: 1.5
            }}
          >
            We redefine the standard of vanilla through vertical integration and environmental responsibility.
          </Typography>
        </Box>

        {/* 2. SECCIÓN DE ESTADÍSTICAS */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4, 
            justifyContent: 'center' 
          }}
        >
          {stats.map((stat, index) => (
            <Box 
              key={stat.id}
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              sx={{ 
                flex: 1, 
                bgcolor: 'rgba(255,255,255,0.05)', 
                p: 5, 
                borderRadius: 4, 
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-5px)',
                  transition: 'all 0.3s ease',
                  borderColor: '#D4AF37' // Borde dorado al pasar el mouse
                }
              }}
            >
              <Box sx={{ mb: 3 }}>
                {stat.icon}
              </Box>

              <Typography variant="h2" sx={{ color: '#ffffff', fontWeight: 800, mb: 1, fontSize: { xs: '3rem', md: '3.5rem' } }}>
                {stat.value}
              </Typography>

              <Typography variant="h6" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, mb: 2, fontSize: '0.9rem' }}>
                {stat.label}
              </Typography>

              <Typography variant="body1" sx={{ color: '#cccccc', lineHeight: 1.6 }}>
                {stat.desc}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* 3. PIE DE PÁGINA DE SECCIÓN */}
        <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.5 }}>
          <Typography variant="caption" sx={{ letterSpacing: 3, color: 'white' }}>
            PROUDLY CULTIVATED IN ECUADOR • 100% ORGANIC CERTIFIED
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}