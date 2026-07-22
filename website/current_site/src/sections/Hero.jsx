import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowRight, ClipboardCheck, FileText, FlaskConical, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import flowerImage from '../assets/new_images/flor de vainilla.jpeg';
import greenhouseImage from '../assets/new_images/invernadero2.jpeg';
import harvestImage from '../assets/new_images/cosecha.jpeg';
import compostImage from '../assets/new_images/composta_cultivo.jpeg';
import beanImage from '../assets/new_images/vainas_artistica.jpeg';

const images = [flowerImage, greenhouseImage, harvestImage, compostImage, beanImage];

const trustItems = [
  'Single-Origin Ecuador',
  'Estate-Grown',
  'Estate-Cured',
  'Lot-Documented',
  'Organic Programs',
  'Selected Harvest Analysis'
];

const proofCards = [
  { icon: FlaskConical, label: 'Selected Harvest Result', value: '8,273 ± 847 mg/kg', caption: 'vanillin reported for August 2025 / Harvest 2 sample' },
  { icon: Sprout, label: 'Estate Process', value: 'Cultivation to curing', caption: 'flowering, harvest, drying, selection, and lot records' },
  { icon: FileText, label: 'Buyer Materials', value: 'Lot sheets', caption: 'documentation before sample or volume discussions' },
  { icon: ClipboardCheck, label: 'Review Path', value: 'Lot-by-lot', caption: 'sample requests are matched to current lot context' }
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % images.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  const scrollToInquiry = () => {
    document.getElementById('buyer-inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDocs = () => {
    document.getElementById('technical-documentation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      component="header"
      id="hero"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        bgcolor: '#0B0907',
        overflow: 'hidden',
        pt: { xs: 10, md: 12 },
        pb: { xs: 18, md: 14 }
      }}
    >
      {images.map((image, index) => (
        <Box
          key={image}
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundPosition: { xs: 'center', md: index === 0 ? 'center' : 'center right' },
            backgroundSize: 'cover',
            opacity: index === currentImage ? 0.58 : 0,
            transform: index === currentImage ? 'scale(1.025)' : 'scale(1)',
            transition: 'opacity 1400ms ease-in-out, transform 5200ms ease-out'
          }}
        />
      ))}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: 'linear-gradient(180deg, rgba(11,9,7,0.74), rgba(11,9,7,0.98))',
            md: 'linear-gradient(90deg, rgba(11,9,7,0.97) 0%, rgba(11,9,7,0.78) 43%, rgba(11,9,7,0.22) 100%)'
          }
        }}
      />

      <Container sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.05fr) minmax(360px, 0.66fr)' },
            gap: { xs: 5, lg: 7 },
            alignItems: 'end'
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{ maxWidth: 900 }}
          >
            <Box component="img" src="/logo.png" alt="The Vanilla Republic" sx={{ width: { xs: 210, md: 330 }, mb: { xs: 4, md: 5 }, filter: 'brightness(0) invert(1)' }} />

            <Typography variant="overline" sx={{ color: '#D8B65E', letterSpacing: 2, fontWeight: 900, display: 'block', mb: 2 }}>
              Vanilla. Perfected.
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: '#fff',
                fontSize: { xs: '2.55rem', sm: '3.2rem', md: '5rem' },
                fontWeight: 900,
                letterSpacing: 0,
                lineHeight: { xs: 1.05, md: 0.98 },
                maxWidth: 940
              }}
            >
              Single-Origin Ecuadorian Vanilla Tahitensis Beans for Buyers Who Measure Flavor With Proof.
            </Typography>

            <Typography sx={{ color: 'rgba(255,255,255,0.82)', mt: 3, maxWidth: 780, fontSize: { xs: '1rem', md: '1.16rem' }, lineHeight: 1.75 }}>
              Estate-grown and estate-cured beans from Naranjal / Guayas, handled through a documented
              cultivation, harvest, curing, drying, selection, and packing sequence for professional buyers.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4.5, maxWidth: { xs: 380, sm: 'none' } }}>
              <Button variant="contained" size="large" endIcon={<ArrowRight size={18} />} onClick={scrollToInquiry} sx={{ bgcolor: '#D8B65E', color: '#111', fontWeight: 900, px: 3.5, py: 1.35, '&:hover': { bgcolor: '#E6C978' } }}>
                Request Sample Kit
              </Button>
              <Button variant="outlined" size="large" onClick={scrollToDocs} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.48)', fontWeight: 900, px: 3.5, py: 1.35, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                Technical Documentation
              </Button>
            </Stack>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            sx={{
              border: '1px solid rgba(255,255,255,0.18)',
              bgcolor: 'rgba(255,255,255,0.11)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(18,15,12,0.58))',
              backdropFilter: 'blur(26px) saturate(155%)',
              WebkitBackdropFilter: 'blur(26px) saturate(155%)',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 28px 90px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.22)'
            }}
          >
            <Box sx={{ p: { xs: 2.5, md: 3 }, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <Typography sx={{ color: '#D8B65E', fontWeight: 900, fontSize: '0.82rem', textTransform: 'uppercase' }}>
                Selected Harvest Analysis
              </Typography>
              <Typography sx={{ color: '#fff', mt: 1.4, lineHeight: 1.65, fontWeight: 700 }}>
                Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 ± 847 mg/kg vanillin.
              </Typography>
            </Box>
            {proofCards.map((item) => {
              const Icon = item.icon;
              return (
                <Box key={item.label} sx={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: 1.8, p: { xs: 2.4, md: 2.7 }, borderBottom: '1px solid rgba(255,255,255,0.1)', '&:last-of-type': { borderBottom: 0 } }}>
                  <Box sx={{ color: '#D8B65E', pt: 0.4 }}>
                    <Icon size={24} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ color: '#fff', mt: 0.3, fontWeight: 900, fontSize: '1.08rem' }}>
                      {item.value}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.68)', mt: 0.5, lineHeight: 1.55 }}>
                      {item.caption}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>

      <Box
        id="trust-bar"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          bgcolor: 'rgba(244,238,226,0.78)',
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
          borderTop: '1px solid rgba(255,255,255,0.5)',
          py: { xs: 1.4, md: 1.8 }
        }}
      >
        <Container>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="center">
            {trustItems.map((item) => (
              <Typography key={item} variant="caption" sx={{ color: '#2B241C', fontWeight: 900, textTransform: 'uppercase', px: 1.25, py: 0.7, border: '1px solid rgba(43,36,28,0.12)', bgcolor: 'rgba(255,255,255,0.68)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }}>
                {item}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
