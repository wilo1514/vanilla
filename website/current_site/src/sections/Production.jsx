import React, { useState } from 'react';
import { Box, Button, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ChefHat,
  Factory,
  FlaskConical,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sprout,
  Store,
  Thermometer,
  UsersRound
} from 'lucide-react';
import { motion } from 'framer-motion';

import flowerImage from '../assets/new_images/flor de vainilla.jpeg';
import greenhouseImage from '../assets/new_images/invernadero.jpeg';
import compostImage from '../assets/new_images/composta_cultivo.jpeg';
import harvestImage from '../assets/new_images/cosecha.jpeg';
import cleaningImage from '../assets/new_images/limpieza de vainas.jpeg';
import dryingImage from '../assets/new_images/control_temperatura.jpeg';
import dryRoomImage from '../assets/new_images/cuartos de secado .jpeg';
import selectionImage from '../assets/new_images/clasificacion.jpeg';
import packagingImage from '../assets/new_images/empaquetado.jpeg';
import beansImage from '../assets/new_images/vainas secas.jpeg';

const buyerSegments = [
  { title: 'Extract Houses', icon: FlaskConical, text: 'Beans for extraction review, formulation trials, and technical comparison.' },
  { title: 'Flavor Houses', icon: Factory, text: 'Origin-specific material for flavor development teams and sourcing teams.' },
  { title: 'Specialty Distributors', icon: Boxes, text: 'Buyer-ready origin story, documentation, and sample kit routing.' },
  { title: 'Premium Food Manufacturers', icon: PackageCheck, text: 'Lot context and technical materials for product and sourcing review.' },
  { title: 'Chefs & Artisans', icon: ChefHat, text: 'Single-origin beans for professional kitchens and specialty production.' },
  { title: 'Chocolatiers', icon: BadgeCheck, text: 'Tahitensis aroma profile for chocolate, pastry, and limited-run products.' },
  { title: 'Private Label / Gourmet Retail', icon: Store, text: 'Origin-led vanilla with documentation for premium retail programs.' }
];

const cultivationSteps = [
  {
    title: 'Greenhouse Cultivation',
    eyebrow: 'Cultivation',
    text: 'Vines are managed in protected growing areas in Naranjal / Guayas, where plant care begins long before a buyer sees a sample.',
    image: greenhouseImage,
    icon: Sprout
  },
  {
    title: 'Flowering and Pollination Window',
    eyebrow: 'Flower',
    text: 'The vanilla flower marks the start of a careful crop cycle. Harvest follows after more than seven months from pollination.',
    image: flowerImage,
    icon: Leaf
  },
  {
    title: 'Estate Composting',
    eyebrow: 'Soil care',
    text: 'Compost is prepared on the estate as part of soil and crop care, connecting field preparation with the crop cycle.',
    image: compostImage,
    icon: Sprout
  },
  {
    title: 'Local Harvest Team',
    eyebrow: 'Harvest',
    text: 'A local estate team, including women in harvest and handling roles, supports the work from vine to post-harvest review.',
    image: harvestImage,
    icon: UsersRound
  }
];

const curingSteps = [
  { title: 'Washing and Sorting', text: 'Fresh pods move through washing and sorting before curing begins.', image: cleaningImage },
  { title: 'Thermal Kill Step', text: 'A defined thermal step starts the transformation from green pod to aromatic bean.', image: dryingImage },
  { title: 'Fermentation and Drying', text: 'Fermentation, sun drying, shade drying, and controlled drying rooms support aroma development and lot discipline.', image: dryRoomImage },
  { title: 'Selection and Packing', text: 'Final selection, storage, lot identification, and packing prepare beans for professional buyer review.', image: packagingImage }
];

const documents = [
  'Current lot sheet',
  'Selected harvest analysis',
  'Certification documentation when applicable',
  'Sample kit details',
  'Buyer segment qualification notes'
];

const workspaceTabs = [
  {
    label: 'Proof',
    title: 'Proof package',
    text: 'For buyers that need lot context and selected analysis before sampling.',
    points: ['Selected harvest wording', 'Current lot sheet', 'Selected harvest analysis'],
    icon: ShieldCheck,
    stat: '8,273 ± 847 mg/kg',
    image: dryingImage
  },
  {
    label: 'Origin',
    title: 'Origin review',
    text: 'For sourcing teams that need a clear Ecuadorian origin story before a sample decision.',
    points: ['Naranjal / Guayas', 'Single-origin positioning', 'Tahitensis variety'],
    icon: Sprout,
    stat: 'Ecuador',
    image: greenhouseImage
  },
  {
    label: 'Process',
    title: 'Curing review',
    text: 'For teams evaluating how cultivation, harvest, curing, drying, and selection connect to lot discipline.',
    points: ['Harvest maturity', 'Thermal step', 'Drying sequence'],
    icon: Thermometer,
    stat: 'Lot discipline',
    image: selectionImage
  },
  {
    label: 'Sample Kit',
    title: 'Sample path',
    text: 'For buyers ready to evaluate aroma, application fit, and available documentation together.',
    points: ['Application context', 'Usage estimate', 'Buyer segment'],
    icon: BadgeCheck,
    stat: 'Buyer-ready',
    image: beansImage
  }
];

export default function Production() {
  const [workspaceTab, setWorkspaceTab] = useState(0);
  const activeWorkspace = workspaceTabs[workspaceTab];
  const ActiveIcon = activeWorkspace.icon;

  const scrollToInquiry = () => {
    document.getElementById('buyer-inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Box id="origin-story" sx={{ py: { xs: 9, md: 13 }, bgcolor: '#FBF7EF', overflow: 'hidden' }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.85fr 1.15fr' }, gap: { xs: 5, md: 7 }, alignItems: 'center' }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#8A6B32', fontWeight: 900, letterSpacing: 2 }}>
                Origin Story
              </Typography>
              <Typography variant="h2" sx={{ mt: 1.5, mb: 2.5, fontSize: { xs: '2.2rem', md: '3.55rem' }, lineHeight: 1.04 }}>
                A living estate process behind every buyer review.
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '1.08rem', lineHeight: 1.85 }}>
                The Vanilla Republic begins in Naranjal / Guayas with vines, flowers, local field work,
                estate composting, careful harvest timing, curing, drying, selection, and lot identification.
                The story is agricultural, but the buyer experience is practical: proof materials, sample kits,
                and a clear lot review path.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.4} sx={{ mt: 4 }}>
                <Button variant="contained" endIcon={<ArrowRight size={18} />} onClick={scrollToInquiry} sx={{ bgcolor: '#211B15', color: '#fff', fontWeight: 900, px: 3, py: 1.25, '&:hover': { bgcolor: '#3A3026' } }}>
                  Request Sample Kit
                </Button>
                <Button variant="outlined" onClick={() => document.getElementById('estate-curing')?.scrollIntoView({ behavior: 'smooth' })} sx={{ borderColor: '#8A6B32', color: '#211B15', fontWeight: 900, px: 3, py: 1.25 }}>
                  See the Process
                </Button>
              </Stack>
            </Box>

            <Box sx={{ minHeight: { xs: 520, md: 620 }, position: 'relative' }}>
              {[
                { image: flowerImage, label: 'Flowering', top: 0, left: { xs: 0, md: 20 }, width: { xs: '78%', md: '62%' }, height: 300 },
                { image: harvestImage, label: 'Local harvest', top: { xs: 190, md: 210 }, left: { xs: '22%', md: '38%' }, width: { xs: '78%', md: '55%' }, height: 340 },
                { image: compostImage, label: 'Estate composting', top: { xs: 355, md: 390 }, left: { xs: 0, md: 0 }, width: { xs: '58%', md: '44%' }, height: 220 }
              ].map((item, index) => (
                <Box
                  key={item.label}
                  component={motion.div}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.12 }}
                  sx={{ position: 'absolute', top: item.top, left: item.left, width: item.width, height: item.height, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.72)', boxShadow: '0 30px 80px rgba(47,36,22,0.18)' }}
                >
                  <Box component="img" src={item.image} alt={item.label} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 44%, rgba(20,17,14,0.72))' }} />
                  <Typography sx={{ position: 'absolute', left: 18, bottom: 16, color: '#fff', fontWeight: 900 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Box id="cultivation-cycle" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#14110E', color: '#fff' }}>
        <Container>
          <Box sx={{ maxWidth: 860, mb: 5.5 }}>
            <Typography variant="overline" sx={{ color: '#D8B65E', fontWeight: 900, letterSpacing: 2 }}>
              Cultivation Cycle
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mt: 1.5, mb: 2, fontSize: { xs: '2.15rem', md: '3.25rem' }, lineHeight: 1.08 }}>
              From soil care to harvest maturity.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.8 }}>
              This is the agricultural foundation behind the buyer-facing lot review, with visible practices
              that shape the estate workflow from soil care to harvest handling.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1.8 }}>
            {cultivationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Box key={step.title} component={motion.div} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} whileHover={{ y: -8 }} sx={{ minHeight: { xs: 420, md: 520 }, borderRadius: 3, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 22px 60px rgba(0,0,0,0.2)' }}>
                  <Box component="img" src={step.image} alt={step.title} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,14,0.08), rgba(20,17,14,0.78) 58%, rgba(20,17,14,0.96))' }} />
                  <Box sx={{ position: 'relative', zIndex: 1, height: '100%', p: 2.6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 1.4, bgcolor: '#D8B65E', color: '#17120D' }}>
                        <Icon size={21} />
                      </Box>
                      <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontWeight: 900 }}>
                        0{index + 1}
                      </Typography>
                    </Stack>
                    <Box>
                      <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.76rem', mb: 1 }}>
                        {step.eyebrow}
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, lineHeight: 1.12, mb: 1.4 }}>
                        {step.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.65 }}>
                        {step.text}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Box id="buyer-segments" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#fff' }}>
        <Container>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" sx={{ mb: 5.5 }}>
            <Box sx={{ maxWidth: 760 }}>
              <Typography variant="overline" sx={{ color: '#8A6B32', fontWeight: 900, letterSpacing: 2 }}>
                Buyer Segment Cards
              </Typography>
              <Typography variant="h2" sx={{ mt: 1.5, fontSize: { xs: '2.15rem', md: '3.35rem' }, lineHeight: 1.08 }}>
                One origin, several professional review paths.
              </Typography>
            </Box>
            <Typography sx={{ maxWidth: 440, color: 'text.secondary', lineHeight: 1.8, pt: { md: 4 } }}>
              Choose the route that best matches your use case. Every inquiry can request the current lot sheet,
              technical documentation, or sample kit details.
            </Typography>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.2 }}>
            {buyerSegments.map((segment, index) => {
              const Icon = segment.icon;
              return (
                <Box key={segment.title} component={motion.div} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.04 }} whileHover={{ y: -7 }} sx={{ border: '1px solid rgba(32,28,24,0.11)', borderRadius: 2, p: 2.8, minHeight: 235, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: index === 0 ? '#211B15' : '#FBF8F2', color: index === 0 ? '#fff' : 'text.primary', boxShadow: index === 0 ? '0 26px 70px rgba(33,27,21,0.18)' : '0 18px 45px rgba(47,36,22,0.055)' }}>
                  <Box>
                    <Box sx={{ width: 46, height: 46, display: 'grid', placeItems: 'center', borderRadius: 1, color: index === 0 ? '#211B15' : '#8A6B32', bgcolor: index === 0 ? '#D8B65E' : '#EFE3CC', mb: 3 }}>
                      <Icon size={23} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.22 }}>
                      {segment.title}
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 2.5, color: index === 0 ? 'rgba(255,255,255,0.72)' : 'text.secondary', lineHeight: 1.62 }}>
                    {segment.text}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Box id="estate-curing" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#F8F4EC' }}>
        <Container>
          <Box sx={{ maxWidth: 900, mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#8A6B32', fontWeight: 900, letterSpacing: 2 }}>
              Estate Curing and Lot Discipline
            </Typography>
            <Typography variant="h2" sx={{ mt: 1.5, mb: 2, fontSize: { xs: '2.15rem', md: '3.35rem' }, lineHeight: 1.08 }}>
              The curing sequence turns crop work into buyer-ready lots.
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              The process includes washing, sorting, thermal kill step, fermentation, sun drying, shade drying,
              selection, storage, and lot identification.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.08fr 0.92fr' }, gap: 3, alignItems: 'stretch' }}>
            <Box sx={{ borderRadius: 3, overflow: 'hidden', position: 'relative', minHeight: { xs: 420, md: 650 }, boxShadow: '0 26px 80px rgba(47,36,22,0.13)' }}>
              <Box component="img" src={dryingImage} alt="Temperature control during vanilla curing" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,14,0.04), rgba(20,17,14,0.82))' }} />
              <Box sx={{ position: 'absolute', left: { xs: 20, md: 34 }, right: { xs: 20, md: 34 }, bottom: { xs: 20, md: 34 }, color: '#fff' }}>
                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.4 }}>
                  <Box sx={{ width: 44, height: 44, display: 'grid', placeItems: 'center', bgcolor: '#D8B65E', color: '#17120D', borderRadius: 1.2 }}>
                    <Thermometer size={22} />
                  </Box>
                  <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.78rem' }}>
                    Temperature-aware handling
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, lineHeight: 1.05, maxWidth: 640 }}>
                  Measured steps, clean records, and lots buyers can review.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gap: 2 }}>
              {curingSteps.map((step, index) => (
                <Box key={step.title} component={motion.div} initial={{ opacity: 0, x: 22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.05 }} sx={{ display: 'grid', gridTemplateColumns: { xs: '124px 1fr', sm: '170px 1fr' }, bgcolor: '#fff', border: '1px solid rgba(32,28,24,0.1)', borderRadius: 2, overflow: 'hidden', boxShadow: '0 18px 50px rgba(47,36,22,0.055)' }}>
                  <Box component="img" src={step.image} alt={step.title} sx={{ width: '100%', height: '100%', minHeight: 154, objectFit: 'cover' }} />
                  <Box sx={{ p: { xs: 2.2, md: 2.6 } }}>
                    <Typography sx={{ color: '#8A6B32', fontWeight: 900, mb: 0.7, fontSize: '0.78rem' }}>
                      STEP {index + 1}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.8, lineHeight: 1.15 }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.62 }}>
                      {step.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Box id="buyer-workspace" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#14110E', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 14%, rgba(216,182,94,0.2), transparent 26%), linear-gradient(180deg, #17120D 0%, #100D0A 100%)' }} />
        <Container>
          <Box sx={{ maxWidth: 820, mb: 5, position: 'relative', zIndex: 1 }}>
            <Typography variant="overline" sx={{ color: '#D8B65E', fontWeight: 900, letterSpacing: 2 }}>
              Buyer Review Suite
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mt: 1.5, mb: 2, fontSize: { xs: '2rem', md: '2.9rem' }, lineHeight: 1.08 }}>
              Four focused windows for professional evaluation.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, maxWidth: 720 }}>
              Explore the materials buyers typically need before requesting a sample kit, technical packet,
              current lot sheet, or distribution conversation.
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.18)', bgcolor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(28px) saturate(145%)', WebkitBackdropFilter: 'blur(28px) saturate(145%)', borderRadius: 3, p: { xs: 2, md: 3 }, boxShadow: '0 30px 90px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)' }}>
            <Tabs value={workspaceTab} onChange={(_event, nextValue) => setWorkspaceTab(nextValue)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 48, mb: 2.6, '& .MuiTabs-indicator': { display: 'none' }, '& .MuiTab-root': { minHeight: 44, mr: 1, px: 2.4, borderRadius: 2, fontWeight: 900, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', bgcolor: 'rgba(255,255,255,0.07)' }, '& .Mui-selected': { color: '#17120D', bgcolor: 'rgba(216,182,94,0.92)', boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.42)' } }}>
              {workspaceTabs.map((tab) => (
                <Tab key={tab.label} label={tab.label} />
              ))}
            </Tabs>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 0.78fr) minmax(0, 1fr)' }, gap: { xs: 2.5, md: 3 }, alignItems: 'stretch' }}>
              <Box sx={{ minHeight: { xs: 280, md: 410 }, borderRadius: 2, position: 'relative', overflow: 'hidden', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }}>
                <Box component="img" src={activeWorkspace.image} alt={activeWorkspace.title} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,14,0.08), rgba(20,17,14,0.86))' }} />
                <Box sx={{ position: 'relative', zIndex: 1, height: '100%', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box sx={{ width: 48, height: 48, display: 'grid', placeItems: 'center', borderRadius: 1.5, bgcolor: 'rgba(216,182,94,0.92)', color: '#211B15' }}>
                      <ActiveIcon size={23} />
                    </Box>
                    <Box component="img" src="/icono.png" alt="The Vanilla Republic icon" sx={{ width: 34, height: 34, objectFit: 'contain', filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.35))' }} />
                  </Stack>
                  <Box>
                    <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.78rem', mb: 0.8 }}>
                      {activeWorkspace.label}
                    </Typography>
                    <Typography sx={{ color: '#fff', fontSize: { xs: '1.9rem', md: '2.35rem' }, fontWeight: 900, lineHeight: 1 }}>
                      {activeWorkspace.stat}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', p: { xs: 2.6, md: 3.4 }, border: '1px solid rgba(255,255,255,0.14)' }}>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, mb: 1.4, fontSize: { xs: '1.65rem', md: '2.15rem' } }}>
                  {activeWorkspace.title}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, maxWidth: 760 }}>
                  {activeWorkspace.text}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.4, mt: 3 }}>
                  {activeWorkspace.points.map((point) => (
                    <Stack key={point} direction="row" spacing={1.1} alignItems="center" sx={{ p: 1.6, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <BadgeCheck size={17} color="#D8B65E" />
                      <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.92rem' }}>{point}</Typography>
                    </Stack>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box id="technical-documentation" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#fff' }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#8A6B32', fontWeight: 900, letterSpacing: 2 }}>
                Technical Documentation
              </Typography>
              <Typography variant="h2" sx={{ mt: 1.5, mb: 3, fontSize: { xs: '2.15rem', md: '3.2rem' }, lineHeight: 1.08 }}>
                Request proof materials before the sample kit.
              </Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Buyer materials can include the current lot sheet, available certification documentation,
                selected harvest analysis, and sample kit details.
              </Typography>
              <Button variant="contained" endIcon={<ArrowRight size={18} />} onClick={scrollToInquiry} sx={{ mt: 4, bgcolor: '#211B15', color: '#fff', fontWeight: 900, px: 3.2, py: 1.25, '&:hover': { bgcolor: '#3A3026' } }}>
                Request Documentation
              </Button>
            </Box>
            <Box sx={{ border: '1px solid rgba(32,28,24,0.12)', borderRadius: 2, p: { xs: 2.8, md: 3.5 }, bgcolor: '#F8F4EC' }}>
              {documents.map((item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="center" sx={{ py: 1.45, borderBottom: '1px solid rgba(32,28,24,0.1)', '&:last-of-type': { borderBottom: 0 } }}>
                  <BadgeCheck size={19} color="#8A6B32" />
                  <Typography sx={{ fontWeight: 850 }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Box id="sample-kit" sx={{ py: { xs: 8, md: 10 }, bgcolor: '#D8B65E' }}>
        <Container>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
            <Box sx={{ maxWidth: 780 }}>
              <Typography variant="overline" sx={{ color: '#30230A', fontWeight: 900, letterSpacing: 2 }}>
                Sample Kit CTA
              </Typography>
              <Typography variant="h2" sx={{ mt: 1, color: '#12100D', fontSize: { xs: '2.05rem', md: '3rem' }, lineHeight: 1.1 }}>
                Ready to evaluate an Ecuadorian origin?
              </Typography>
              <Typography sx={{ mt: 2, color: '#30230A', lineHeight: 1.8 }}>
                Tell us your buyer segment, application, and documentation needs so the request can be matched
                to the right lot review path.
              </Typography>
            </Box>
            <Button variant="contained" size="large" endIcon={<ArrowRight size={18} />} onClick={scrollToInquiry} sx={{ bgcolor: '#12100D', color: '#fff', fontWeight: 900, px: 3.4, py: 1.35, '&:hover': { bgcolor: '#2C2C2C' } }}>
              Request Sample Kit
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
