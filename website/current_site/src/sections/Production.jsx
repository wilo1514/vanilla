import React from 'react';
import { Box, Container, Typography } from '@mui/material'; // Quitamos Grid para evitar conflictos
import { motion } from 'framer-motion';

// Importación de tus imágenes
import stepImg0 from '../assets/step1.jpeg'; 
import stepImg1 from '../assets/step2.jpeg';
import stepImg2 from '../assets/step3.jpeg';
import stepImg3 from '../assets/step4.jpeg';
import stepImg4 from '../assets/step5.jpeg';

const steps = [
  { 
    title: "01. The Bloom & Pollination", 
    desc: "In our Guayaquil plantations, each Vanilla Tahitensis orchid is hand-pollinated during its single day of flowering. This manual precision ensures the birth of a superior bean.", 
    detail: "Origin: Guayaquil, Ecuador",
    img: stepImg0 
  },
  { 
    title: "02. Growth & Development", 
    desc: "The pods develop for 8 to 9 months under the lush tropical sun, absorbing nutrients and developing the precursors of their future aromatic complexity.", 
    detail: "Method: Sustainable Cultivation",
    img: stepImg1
  },
  { 
    title: "03. Harvest & Selection", 
    desc: "In the heart of our Guayaquil estates, we harvest each pod at its peak maturity. Only the most robust and perfect beans are selected, following rigorous internal standards.", 
    detail: "Origin: Guayaquil, Ecuador",
    img: stepImg2
  },
  { 
    title: "04. Master Curing Process", 
    desc: "In our specialized facilities, pods undergo a slow and meticulous curing. With constant temperature control and expert care, we transform green pods into dark, oily beans with an intense, world-class aroma.", 
    detail: "Process: Controlled Aromatic Refinement",
    img: stepImg3
  },
  { 
    title: "05. International Export Grade", 
    desc: "Final vacuum packaging locks in the high vanillin content and complex essential oils. We ensure every shipment meets the highest international quality standards for global export.", 
    detail: "Quality: Vacuum-Sealed Excellence",
    img: stepImg4
  }
];

export default function Production() {
  return (
    <Box sx={{ py: 12, overflow: 'hidden', bgcolor: 'background.default' }} id="process">
      <Container>
        {/* Encabezado */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Our Vertical Journey
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 10, maxWidth: 700, mx: 'auto', fontSize: '1.1rem' }}>
            A dedicated commitment to quality, from our tropical estates to your doorstep.
          </Typography>
        </Box>
        
        {steps.map((step, index) => (
          // CONTENEDOR FLEX (Reemplaza al Grid Container)
          <Box 
            key={index} 
            sx={{ 
              display: 'flex',
              // MÓVIL: Columna (uno bajo otro) | PC: Fila (lado a lado)
              flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
              alignItems: 'center',
              gap: { xs: 4, md: 8 }, // Espacio entre elementos
              mb: 12
            }}
          >
            {/* BLOQUE DE TEXTO (50% de ancho en PC) */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
                  {step.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, fontSize: '1.15rem', lineHeight: 1.8, color: 'text.secondary' }}>
                  {step.desc}
                </Typography>
                <Typography variant="caption" sx={{ letterSpacing: 2, textTransform: 'uppercase', color: '#858585', fontWeight: 700, borderBottom: '2px solid #858585', pb: 0.5 }}>
                  {step.detail}
                </Typography>
              </Box>
            </Box>

            {/* BLOQUE DE IMAGEN (50% de ancho en PC) */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                sx={{ 
                  height: { xs: 300, md: 450 }, 
                  borderRadius: 3, 
                  overflow: 'hidden', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  position: 'relative' // Necesario para la marca de agua
                }}
              >
                {/* 1. FOTO PRINCIPAL */}
                <img 
                  src={step.img} 
                  alt={step.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                /> 

                {/* 2. DEGRADADO SOFISTICADO */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)',
                    zIndex: 1
                  }}
                />

                {/* 3. MARCA DE AGUA (ICONO) */}
                <Box
                  component="img"
                  src="/icono.png" 
                  alt="Watermark"
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 15, md: 25 }, 
                    right: { xs: 15, md: 25 },
                    width: { xs: 70, md: 100 }, 
                    opacity: 0.7, 
                    zIndex: 2,
                    filter: 'brightness(0) invert(1)' // Logo blanco
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
}