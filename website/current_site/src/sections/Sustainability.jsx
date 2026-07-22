import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowRight, ClipboardCheck, FileCheck2, FlaskConical, Leaf, PackageCheck, ShieldCheck, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';
import proofImage from '../assets/new_images/control_temperatura.jpeg';
import flowerImage from '../assets/new_images/flor.jpeg';
import selectionImage from '../assets/new_images/revision.jpeg';
import buyerImage from '../assets/new_images/vainas secas.jpeg';

const proofItems = [
  {
    icon: FlaskConical,
    title: 'Independent Analysis',
    text: 'Selected harvests can be supported with third-party analysis and buyer-ready documentation.',
    image: proofImage
  },
  {
    icon: FileCheck2,
    title: 'Lot Documentation',
    text: 'Current lot sheets support technical review before sample kit or volume conversations.',
    image: selectionImage
  },
  {
    icon: PackageCheck,
    title: 'Export-Oriented Handling',
    text: 'Sorting, storage, and packaging are organized for professional buyer qualification.',
    image: buyerImage
  },
  {
    icon: ShieldCheck,
    title: 'Evidence Discipline',
    text: 'Buyer materials focus on documented facts, current lots, and available proof materials.',
    image: flowerImage
  }
];

const buyerCapabilities = [
  { label: 'Sample kit path', detail: 'Requests are matched to segment, application, and lot context.' },
  { label: 'Technical packet', detail: 'Lot sheet, selected analysis, and documentation paths.' },
  { label: 'Lot review path', detail: 'Buyer questions are aligned with available documentation.' },
  { label: 'Buyer fit notes', detail: 'Segment, usage, application, and market route guide the next step.' }
];

export default function Sustainability() {
  const scrollToInquiry = () => {
    document.getElementById('buyer-inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Box
        id="proof"
        sx={{
          py: { xs: 9, md: 13 },
          bgcolor: '#F7F1E7',
          background: 'linear-gradient(180deg, #FBF7EF 0%, #EFE5D6 100%)',
          overflow: 'hidden'
        }}
      >
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.92fr 1.08fr' }, gap: { xs: 4, md: 5 }, alignItems: 'stretch' }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                minHeight: { xs: 620, md: 720 },
                boxShadow: '0 30px 90px rgba(47,36,22,0.16)',
                border: '1px solid rgba(255,255,255,0.72)'
              }}
            >
              <Box component="img" src={proofImage} alt="Temperature-aware vanilla curing" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,14,0.04) 0%, rgba(20,17,14,0.36) 42%, rgba(20,17,14,0.94) 100%)' }} />
              <Box sx={{ position: 'relative', zIndex: 1, minHeight: 'inherit', p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box component="img" src="/icono.png" alt="The Vanilla Republic icon" sx={{ width: 46, height: 46, objectFit: 'contain', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.42))' }} />
                  <Box>
                    <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: 1.5 }}>
                      Proof Behind the Aroma
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.76)', fontWeight: 800, fontSize: '0.88rem' }}>
                      Selected harvest analysis and lot materials
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ maxWidth: 680 }}>
                  <Typography component="h2" sx={{ color: '#fff', fontWeight: 900, fontSize: { xs: '2.35rem', md: '3.9rem' }, lineHeight: 1.02, mb: 2 }}>
                    Documentation-led vanilla for professional evaluation.
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.04rem', lineHeight: 1.78 }}>
                    Ecuadorian Vanilla Tahitensis beans positioned with origin discipline, curing discipline,
                    selected analysis, and buyer-facing lot documentation.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: { xs: 2.3, md: 2.8 },
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.13)',
                    backdropFilter: 'blur(22px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(22px) saturate(150%)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)'
                  }}
                >
                  <Stack direction="row" spacing={1.4} alignItems="center" sx={{ mb: 1.2 }}>
                    <Box sx={{ width: 40, height: 40, display: 'grid', placeItems: 'center', bgcolor: '#D8B65E', color: '#17120D', borderRadius: 1.2 }}>
                      <Thermometer size={20} />
                    </Box>
                    <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.78rem' }}>
                      Selected harvest analysis
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: '#fff', lineHeight: 1.65, fontWeight: 850, fontSize: { xs: '1rem', md: '1.08rem' } }}>
                    Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 ± 847 mg/kg vanillin.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.2 }}>
              {proofItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Box
                    key={item.title}
                    component={motion.div}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    sx={{
                      minHeight: { xs: 300, md: 340 },
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid rgba(32,28,24,0.1)',
                      boxShadow: '0 20px 55px rgba(47,36,22,0.08)'
                    }}
                  >
                    <Box component="img" src={item.image} alt={item.title} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.76) 44%, rgba(255,255,255,0.96) 100%)' }} />
                    <Box sx={{ position: 'relative', zIndex: 1, p: 2.8, minHeight: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box sx={{ width: 46, height: 46, display: 'grid', placeItems: 'center', color: '#8A6B32', bgcolor: '#F8F4EC', borderRadius: 1, boxShadow: '0 10px 26px rgba(47,36,22,0.08)' }}>
                        <Icon size={24} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, lineHeight: 1.18 }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ color: '#6C6258', lineHeight: 1.72 }}>
                          {item.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Container>
      </Box>

      <Box id="professional-buyers" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#14110E', color: '#fff' }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.82fr 1.18fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#D8B65E', fontWeight: 900, letterSpacing: 2 }}>
                Built for Professional Buyers
              </Typography>
              <Typography variant="h2" sx={{ color: '#fff', mt: 1.5, mb: 3, fontSize: { xs: '2.1rem', md: '3.2rem' }, lineHeight: 1.08 }}>
                A clean path from inquiry to proof review.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.76)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                Buyers can request sample kit details, technical documentation, or current lot sheets.
                The inquiry path supports buyer qualification, documentation requests, and sample kit review
                with a clear route to the right proof materials.
              </Typography>
              <Button variant="contained" endIcon={<ArrowRight size={18} />} onClick={scrollToInquiry} sx={{ mt: 4, bgcolor: '#D8B65E', color: '#111', fontWeight: 900, px: 3.2, py: 1.25, '&:hover': { bgcolor: '#E6C978' } }}>
                Start Buyer Inquiry
              </Button>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.78fr 1fr' }, gap: 2.2, alignItems: 'stretch' }}>
              <Box sx={{ minHeight: { xs: 330, lg: 'auto' }, borderRadius: 2, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.14)' }}>
                <Box component="img" src={buyerImage} alt="Buyer-ready vanilla beans" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,14,0.08), rgba(20,17,14,0.82))' }} />
                <Box sx={{ position: 'relative', zIndex: 1, height: '100%', p: 2.6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box component="img" src="/icono.png" alt="The Vanilla Republic icon" sx={{ width: 46, height: 46, objectFit: 'contain', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.42))' }} />
                  <Box>
                    <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.76rem', mb: 0.8 }}>
                      Buyer room
                    </Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.55rem', lineHeight: 1.08 }}>
                      Sample, proof, and lot review in one path.
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ border: '1px solid rgba(255,255,255,0.14)', borderRadius: 2, overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.045)' }}>
                {buyerCapabilities.map((item, index) => (
                  <Box key={item.label} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '170px 1fr' }, gap: 2, p: { xs: 2.6, md: 3.2 }, borderBottom: index === buyerCapabilities.length - 1 ? 0 : '1px solid rgba(255,255,255,0.12)' }}>
                    <Stack direction="row" spacing={1.3} alignItems="center">
                      <ClipboardCheck size={18} color="#D8B65E" />
                      <Typography sx={{ fontWeight: 900 }}>{item.label}</Typography>
                    </Stack>
                    <Typography sx={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.65 }}>
                      {item.detail}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
