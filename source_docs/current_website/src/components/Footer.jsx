import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack, IconButton } from '@mui/material';
import { Mail, MapPin, Phone, Instagram, Linkedin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#f8f8f8', 
        pt: 10, 
        pb: 4, 
        borderTop: '1px solid rgba(133, 133, 133, 0.2)',
        color: 'text.primary'
      }}
    >
      <Container>
        <Grid container spacing={6}>
          {/* Columna 1: Branding y Propósito */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Typography variant="h6" sx={{ color: '#858585', fontWeight: 800, mb: 2, letterSpacing: 1 }}>
                THE VANILLA REPUBLIC
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.7, color: 'text.secondary' }}>
                A carbon-neutral initiative dedicated to the cultivation and export of premium Ecuadorian vanilla beans. Bridging the gap between sustainable agriculture and global gourmet excellence.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" sx={{ color: '#858585' }}><Instagram size={20} /></IconButton>
                <IconButton size="small" sx={{ color: '#858585' }}><Linkedin size={20} /></IconButton>
                <IconButton size="small" sx={{ color: '#858585' }}><Globe size={20} /></IconButton>
              </Stack>
            </motion.div>
          </Grid>

          {/* Columna 2: Ubicaciones Estratégicas */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>Strategic Locations</Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" sx={{ color: '#858585', fontWeight: 700, textTransform: 'uppercase' }}>
                  Headquarters
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <MapPin size={16} style={{ marginRight: 8, color: '#858585' }} /> 
                  Cuenca, Azuay - Ecuador
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#858585', fontWeight: 700, textTransform: 'uppercase' }}>
                  Plantations
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <MapPin size={16} style={{ marginRight: 8, color: '#858585' }} /> 
                  Guayaquil, Guayas - Ecuador
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Columna 3: Contacto Directo */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>Direct Inquiries</Typography>
            <Stack spacing={2}>
              <Link 
                href="mailto:info@thevanillarepublic.com" 
                underline="none" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: 'text.primary',
                  '&:hover': { color: '#858585' }
                }}
              >
                <Mail size={18} style={{ marginRight: 10, color: '#858585' }} /> 
                info@thevanillarepublic.com
              </Link>
              <Box sx={{ mt: 2, p: 2, border: '1px dashed #858585', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic' }}>
                  Member of the Sustainable Spices Initiative.
                  <br />Verified Carbon Neutral Process.
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Barra Inferior de Copyright */}
        <Box 
          sx={{ 
            mt: 10, 
            pt: 4, 
            borderTop: '1px solid rgba(0,0,0,0.05)', 
            textAlign: 'center' 
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {currentYear} THE VANILLA REPUBLIC. All rights reserved. 
            Designed for the International Gourmet & Wholesale Market.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}