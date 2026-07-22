import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowRight, BadgeCheck, ClipboardList, FileCheck2, MapPin, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import originImage from '../assets/new_images/cultivo2.jpeg';
import beansImage from '../assets/new_images/vainas_artistica.jpeg';
import curingImage from '../assets/new_images/etapa de secado.jpeg';
import dryingImage from '../assets/new_images/secado2.jpeg';

const evidenceCards = [
  {
    icon: MapPin,
    title: 'Origin Window',
    eyebrow: 'Naranjal / Guayas',
    text: 'Single-origin Ecuadorian Vanilla Tahitensis beans presented for professional buyer review.'
  },
  {
    icon: ShieldCheck,
    title: 'Certification Window',
    eyebrow: 'Organic programs',
    text: 'Documentation references Kiwa BCS Oko-Garantie GmbH, NOP organic addendum, and EU organic certification paths where applicable.'
  },
  {
    icon: ClipboardList,
    title: 'Lot Discipline Window',
    eyebrow: 'Curing sequence',
    text: 'Harvest maturity, washing, sorting, thermal kill step, fermentation, sun drying, shade drying, selection, storage, and lot identification.'
  },
  {
    icon: FileCheck2,
    title: 'Proof Window',
    eyebrow: 'Selected harvest analysis',
    text: 'Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 ± 847 mg/kg vanillin.'
  }
];

const requestPaths = [
  { label: 'Sample Kit', detail: 'For sensory and application review.' },
  { label: 'Current Lot Sheet', detail: 'For lot-specific buyer context.' },
  { label: 'Technical Documentation', detail: 'For sourcing, QA, and formulation teams.' },
  { label: 'Buyer Call', detail: 'For volume, segment, and route alignment.' },
  { label: 'Distribution Review', detail: 'For specialty channel conversations.' }
];

const imageTiles = [
  { src: originImage, label: 'Origin', title: 'Ecuadorian single-origin review' },
  { src: beansImage, label: 'Beans', title: 'Tahitensis material for buyers' },
  { src: curingImage, label: 'Curing', title: 'Estate curing sequence' },
  { src: dryingImage, label: 'Drying', title: 'Drying and selection discipline' }
];

export default function EvidenceWindows() {
  const scrollToInquiry = () => {
    document.getElementById('buyer-inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDocs = () => {
    document.getElementById('technical-documentation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box id="evidence-windows" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#201A14', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #211B15 0%, #100D0A 100%)' }} />
      <Container sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.92fr 1.08fr' }, gap: { xs: 4, md: 5 }, alignItems: 'stretch' }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            sx={{ minHeight: { xs: 520, md: 680 }, borderRadius: 3, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 34px 100px rgba(0,0,0,0.34)' }}
          >
            <Box component="img" src={originImage} alt="Ecuadorian vanilla origin" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(16,13,10,0.06) 0%, rgba(16,13,10,0.44) 42%, rgba(16,13,10,0.96) 100%)' }} />
            <Box sx={{ position: 'relative', zIndex: 1, height: '100%', p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box component="img" src="/icono.png" alt="The Vanilla Republic icon" sx={{ width: 54, height: 54, objectFit: 'contain', filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.45))' }} />
                <Box sx={{ px: 1.6, py: 0.8, border: '1px solid rgba(255,255,255,0.26)', bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', borderRadius: 99 }}>
                  <Typography sx={{ color: '#fff', fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Vanilla. Perfected.
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ maxWidth: 560 }}>
                <Typography sx={{ color: '#D8B65E', fontWeight: 900, letterSpacing: 1.8, textTransform: 'uppercase', fontSize: '0.78rem', mb: 1.4 }}>
                  Buyer Evidence Windows
                </Typography>
                <Typography component="h2" sx={{ color: '#fff', fontWeight: 900, fontSize: { xs: '2.25rem', md: '3.35rem' }, lineHeight: 1.02, mb: 2 }}>
                  More than aroma: origin, proof, documentation, and review paths.
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, fontSize: '1.03rem' }}>
                  The page separates the buyer experience into focused windows so sourcing, QA,
                  formulation, and commercial teams can find the right next step quickly.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.2 }}>
            {evidenceCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Box
                  key={card.title}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  sx={{ minHeight: 292, borderRadius: 2, p: 2.7, bgcolor: 'rgba(255,255,255,0.08)', background: 'linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.045))', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(22px) saturate(145%)', WebkitBackdropFilter: 'blur(22px) saturate(145%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <Box sx={{ width: 48, height: 48, display: 'grid', placeItems: 'center', bgcolor: '#D8B65E', color: '#19140F', borderRadius: 1.4 }}>
                    <Icon size={23} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.76rem', mb: 0.8 }}>
                      {card.eyebrow}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, mb: 1.1, lineHeight: 1.12 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.62 }}>
                      {card.text}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1.8, mt: 2.2 }}>
          {imageTiles.map((tile, index) => (
            <Box key={tile.label} component={motion.div} whileHover={{ y: -6 }} sx={{ minHeight: { xs: 240, md: index === 1 ? 360 : 300 }, mt: { md: index % 2 === 0 ? 0 : 5 }, borderRadius: 2, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.14)' }}>
              <Box component="img" src={tile.src} alt={tile.title} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(16,13,10,0.08), rgba(16,13,10,0.82))' }} />
              <Box sx={{ position: 'relative', zIndex: 1, height: '100%', p: 2.4, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.72rem', mb: 0.6 }}>
                  {tile.label}
                </Typography>
                <Typography sx={{ color: '#fff', fontWeight: 900, lineHeight: 1.14 }}>
                  {tile.title}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: { xs: 5, md: 7 }, borderRadius: 3, border: '1px solid rgba(255,255,255,0.16)', bgcolor: 'rgba(255,255,255,0.09)', background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.055))', backdropFilter: 'blur(24px) saturate(145%)', WebkitBackdropFilter: 'blur(24px) saturate(145%)', p: { xs: 2.6, md: 3.4 }, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.76fr 1.24fr' }, gap: { xs: 3, md: 4 }, alignItems: 'center' }}>
          <Box>
            <Stack direction="row" spacing={1.3} alignItems="center" sx={{ mb: 1.5 }}>
              <Sparkles size={19} color="#D8B65E" />
              <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.78rem' }}>
                Choose the review path
              </Typography>
            </Stack>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: { xs: '1.7rem', md: '2.25rem' }, lineHeight: 1.08 }}>
              Every path starts with lot context and documentation fit.
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' }, gap: 1.2 }}>
            {requestPaths.map((path) => (
              <Box key={path.label} sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.8 }}>
                  <BadgeCheck size={15} color="#D8B65E" />
                  <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '0.9rem' }}>{path.label}</Typography>
                </Stack>
                <Typography sx={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.8rem', lineHeight: 1.45 }}>{path.detail}</Typography>
              </Box>
            ))}
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.3} sx={{ gridColumn: '1 / -1' }}>
            <Button variant="contained" endIcon={<ArrowRight size={18} />} onClick={scrollToInquiry} sx={{ bgcolor: '#D8B65E', color: '#111', fontWeight: 900, px: 3, py: 1.2, '&:hover': { bgcolor: '#E6C978' } }}>
              Open Buyer Inquiry
            </Button>
            <Button variant="outlined" startIcon={<PackageCheck size={17} />} onClick={scrollToDocs} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.32)', fontWeight: 900, px: 3, py: 1.2, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}>
              View Documentation Window
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
