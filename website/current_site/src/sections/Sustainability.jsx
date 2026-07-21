import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowRight, ClipboardCheck, FileCheck2, FlaskConical, Leaf, PackageCheck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import proofImage from '../assets/hero4.jpeg';
import buyerImage from '../assets/step5.jpeg';

const proofItems = [
  {
    icon: FlaskConical,
    title: 'Independent Analysis',
    text: 'Selected harvests can be supported with third-party analysis and buyer-ready documentation.'
  },
  {
    icon: FileCheck2,
    title: 'Lot Documentation',
    text: 'Current lot sheets support technical review before sample kit or volume conversations.'
  },
  {
    icon: PackageCheck,
    title: 'Export-Oriented Handling',
    text: 'Sorting, storage, and packaging are organized for professional buyer qualification.'
  },
  {
    icon: ShieldCheck,
    title: 'Evidence Discipline',
    text: 'Buyer materials present documented facts without unsupported performance guarantees.'
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
          bgcolor: '#F8F4EC',
          background: 'linear-gradient(180deg, #FBF7EF 0%, #ECE3D5 100%)'
        }}
      >
        <Container>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '0.95fr 1.05fr' },
              gap: { xs: 5, md: 7 },
              alignItems: 'start'
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              sx={{ position: { lg: 'sticky' }, top: { lg: 110 } }}
            >
              <Typography variant="overline" sx={{ color: '#8A6B32', fontWeight: 900, letterSpacing: 2 }}>
                Proof Behind the Aroma
              </Typography>
              <Typography variant="h2" sx={{ mt: 1.5, mb: 2, fontSize: { xs: '2.15rem', md: '3.45rem' }, lineHeight: 1.05 }}>
                Documentation-led vanilla for professional evaluation.
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '1.08rem', lineHeight: 1.8 }}>
                The Vanilla Republic positions Ecuadorian Vanilla Tahitensis beans with origin discipline,
                curing discipline, and buyer-facing documentation.
              </Typography>
              <Box
                sx={{
                  mt: 4,
                  p: { xs: 2.5, md: 3 },
                  bgcolor: 'rgba(33,27,21,0.9)',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(33,27,21,0.92))',
                  backdropFilter: 'blur(18px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(140%)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  boxShadow: '0 24px 70px rgba(47,36,22,0.16), inset 0 1px 0 rgba(255,255,255,0.14)'
                }}
              >
                <Stack direction="row" spacing={1.4} alignItems="center" sx={{ mb: 1.4 }}>
                  <Box component="img" src="/icono.png" alt="The Vanilla Republic icon" sx={{ width: 30, height: 30, objectFit: 'contain' }} />
                  <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.78rem' }}>
                    Selected harvest analysis
                  </Typography>
                </Stack>
                <Typography sx={{ lineHeight: 1.65, fontWeight: 700 }}>
                  Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 ± 847 mg/kg vanillin.
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 2.4,
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: 260,
                  border: '1px solid rgba(32,28,24,0.1)',
                  boxShadow: '0 20px 60px rgba(47,36,22,0.12)'
                }}
              >
                <Box component="img" src={proofImage} alt="Vanilla Tahitensis beans" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,14,0.05), rgba(20,17,14,0.78))' }} />
                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ position: 'absolute', left: 20, bottom: 20, right: 20 }}>
                  <Box sx={{ width: 40, height: 40, display: 'grid', placeItems: 'center', bgcolor: '#D8B65E', color: '#1D1711', borderRadius: 1 }}>
                    <Leaf size={20} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 900, lineHeight: 1.2 }}>
                      Estate-grown and estate-cured
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.86rem' }}>
                      Framed for buyer documentation, not unsupported claims.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2.4
              }}
            >
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
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.58)',
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.82), rgba(255,255,255,0.42))',
                      backdropFilter: 'blur(18px) saturate(135%)',
                      WebkitBackdropFilter: 'blur(18px) saturate(135%)',
                      border: '1px solid rgba(255,255,255,0.72)',
                      borderRadius: 2,
                      p: 3,
                      minHeight: 245,
                      boxShadow: '0 20px 55px rgba(47,36,22,0.08), inset 0 1px 0 rgba(255,255,255,0.78)'
                    }}
                  >
                    <Box sx={{ width: 46, height: 46, display: 'grid', placeItems: 'center', color: '#8A6B32', bgcolor: '#F8F4EC', borderRadius: 1, mb: 2.4 }}>
                      <Icon size={24} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.72 }}>
                      {item.text}
                    </Typography>
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
                with a clear path from buyer inquiry to the right proof materials.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowRight size={18} />}
                onClick={scrollToInquiry}
                sx={{ mt: 4, bgcolor: '#D8B65E', color: '#111', fontWeight: 900, px: 3.2, py: 1.25, '&:hover': { bgcolor: '#E6C978' } }}
              >
                Start Buyer Inquiry
              </Button>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.78fr 1fr' }, gap: 2.2, alignItems: 'stretch' }}>
              <Box sx={{ minHeight: { xs: 300, lg: 'auto' }, borderRadius: 2, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.14)' }}>
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
                <Box
                  key={item.label}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '170px 1fr' },
                    gap: 2,
                    p: { xs: 2.6, md: 3.2 },
                    borderBottom: index === buyerCapabilities.length - 1 ? 0 : '1px solid rgba(255,255,255,0.12)'
                  }}
                >
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
