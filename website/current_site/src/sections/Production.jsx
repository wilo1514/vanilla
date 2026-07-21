import React, { useState } from 'react';
import { Box, Button, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import { ArrowRight, BadgeCheck, Boxes, ChefHat, Factory, FileText, FlaskConical, PackageCheck, ShieldCheck, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import stepImg1 from '../assets/step1.jpeg';
import stepImg2 from '../assets/step2.jpeg';
import stepImg3 from '../assets/step3.jpeg';
import stepImg4 from '../assets/step4.jpeg';

const buyerSegments = [
  { title: 'Extract Houses', icon: FlaskConical, text: 'Beans for extraction review, formulation trials, and technical comparison.' },
  { title: 'Flavor Houses', icon: Factory, text: 'Origin-specific material for flavor development teams and sourcing teams.' },
  { title: 'Specialty Distributors', icon: Boxes, text: 'Buyer-ready origin story, documentation, and sample kit routing.' },
  { title: 'Premium Food Manufacturers', icon: PackageCheck, text: 'Lot context and technical materials for product and sourcing review.' },
  { title: 'Chefs & Artisans', icon: ChefHat, text: 'Single-origin beans for professional kitchens and specialty production.' },
  { title: 'Chocolatiers', icon: BadgeCheck, text: 'Tahitensis aroma profile for chocolate, pastry, and limited-run products.' },
  { title: 'Private Label / Gourmet Retail', icon: Store, text: 'Origin-led vanilla with documentation for premium retail programs.' }
];

const disciplineSteps = [
  {
    title: 'Harvest Maturity',
    text: 'Pods are harvested after more than seven months from pollination and moved into a controlled curing sequence.',
    image: stepImg1
  },
  {
    title: 'Thermal Kill and Fermentation',
    text: 'Defined curing steps support aroma development and lot discipline without unsupported performance claims.',
    image: stepImg2
  },
  {
    title: 'Drying and Selection',
    text: 'Sun drying, shade drying, selection, and storage are handled with buyer documentation in mind.',
    image: stepImg3
  },
  {
    title: 'Lot Identification',
    text: 'Buyer conversations can reference lot sheets, sample kit details, and available technical documentation.',
    image: stepImg4
  }
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
    stat: '8,273 ± 847 mg/kg'
  },
  {
    label: 'Origin',
    title: 'Origin review',
    text: 'For sourcing teams that need a clear Ecuadorian origin story before a sample decision.',
    points: ['Naranjal / Guayas', 'Single-origin positioning', 'Tahitensis variety'],
    icon: Boxes,
    stat: 'Ecuador'
  },
  {
    label: 'Documents',
    title: 'Technical review',
    text: 'For QA, sourcing, and product teams that need current lot materials before evaluation.',
    points: ['Lot documentation', 'Certification when applicable', 'Sample kit details'],
    icon: FileText,
    stat: 'Lot-ready'
  },
  {
    label: 'Sample Kit',
    title: 'Sample path',
    text: 'For buyers ready to evaluate aroma, application fit, and available documentation together.',
    points: ['Application context', 'Usage estimate', 'Buyer segment'],
    icon: BadgeCheck,
    stat: 'Buyer-ready'
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

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
              gap: 2.2,
              mb: 2.2
            }}
          >
            <Box
              sx={{
                minHeight: { xs: 260, md: 360 },
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                bgcolor: '#211B15',
                border: '1px solid rgba(32,28,24,0.1)',
                boxShadow: '0 26px 70px rgba(47,36,22,0.08)'
              }}
            >
              <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 20%, rgba(216,182,94,0.28), transparent 30%), linear-gradient(135deg, #211B15 0%, #372A1C 54%, #14110E 100%)' }} />
              <Box sx={{ position: 'absolute', right: { xs: -42, md: -22 }, bottom: { xs: -40, md: -30 }, width: { xs: 180, md: 260 }, height: { xs: 180, md: 260 }, borderRadius: '50%', border: '1px solid rgba(216,182,94,0.2)' }} />
              <Box sx={{ position: 'absolute', right: { xs: 20, md: 46 }, top: { xs: 28, md: 46 }, width: { xs: 96, md: 122 }, height: { xs: 96, md: 122 }, display: 'grid', placeItems: 'center', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(18px)' }}>
                <Box component="img" src="/icono.png" alt="The Vanilla Republic icon" sx={{ width: { xs: 62, md: 82 }, height: { xs: 62, md: 82 }, objectFit: 'contain', filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.35))' }} />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 3, md: 4 }, maxWidth: 460, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ width: 52, height: 52, display: 'grid', placeItems: 'center', borderRadius: 1.5, bgcolor: '#D8B65E', color: '#211B15' }}>
                  <ShieldCheck size={25} />
                </Box>
                <Box>
                  <Typography sx={{ color: '#D8B65E', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.78rem', mb: 1 }}>
                    Naranjal / Guayas, Ecuador
                  </Typography>
                  <Typography sx={{ color: '#fff', fontSize: { xs: '1.75rem', md: '2.35rem' }, fontWeight: 900, lineHeight: 1.08 }}>
                    Estate-grown Tahitensis beans with documentation-led review.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gap: 2.2
              }}
            >
              {[
                { value: 'NOP / EU', label: 'Organic documentation under applicable programs' },
                { value: 'Lot review', label: 'Sample and documentation requests follow current lot context' }
              ].map((item) => (
                <Box
                  key={item.value}
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    bgcolor: '#F8F4EC',
                    border: '1px solid rgba(32,28,24,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography sx={{ color: '#8A6B32', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.78rem' }}>
                    Buyer signal
                  </Typography>
                  <Box>
                    <Typography sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, fontWeight: 900, lineHeight: 1.05 }}>
                      {item.value}
                    </Typography>
                    <Typography sx={{ mt: 1, color: 'text.secondary', lineHeight: 1.6 }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
              gap: 2.2
            }}
          >
            {buyerSegments.map((segment, index) => {
              const Icon = segment.icon;
              return (
                <Box
                  key={segment.title}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  sx={{
                    border: '1px solid rgba(32,28,24,0.11)',
                    borderRadius: 2,
                    p: 2.8,
                    minHeight: 235,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    bgcolor: index === 0 ? '#211B15' : '#FBF8F2',
                    color: index === 0 ? '#fff' : 'text.primary',
                    boxShadow: index === 0 ? '0 26px 70px rgba(33,27,21,0.18)' : '0 18px 45px rgba(47,36,22,0.055)'
                  }}
                >
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
          <Box sx={{ maxWidth: 840, mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#8A6B32', fontWeight: 900, letterSpacing: 2 }}>
              Estate Curing and Lot Discipline
            </Typography>
            <Typography variant="h2" sx={{ mt: 1.5, mb: 2, fontSize: { xs: '2.15rem', md: '3.35rem' }, lineHeight: 1.08 }}>
              From estate handling to buyer-ready documentation.
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              The process includes washing, sorting, thermal kill step, fermentation, sun drying, shade drying,
              selection, storage, and lot identification.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.8 }}>
            {disciplineSteps.map((step, index) => (
              <Box
                key={step.title}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '190px 1fr' },
                  bgcolor: '#fff',
                  border: '1px solid rgba(32,28,24,0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 18px 50px rgba(47,36,22,0.055)'
                }}
              >
                <Box
                  component="img"
                  src={step.image}
                  alt={step.title}
                  sx={{ width: '100%', height: { xs: 210, sm: '100%' }, minHeight: 190, objectFit: 'cover' }}
                />
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ color: '#8A6B32', fontWeight: 900, mb: 1, fontSize: '0.8rem' }}>
                    STEP {index + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {step.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Box
        id="buyer-workspace"
        sx={{
          py: { xs: 9, md: 12 },
          bgcolor: '#14110E',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 18% 14%, rgba(216,182,94,0.2), transparent 26%), radial-gradient(circle at 82% 32%, rgba(255,255,255,0.1), transparent 22%), linear-gradient(180deg, #17120D 0%, #100D0A 100%)'
          }}
        />
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

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              border: '1px solid rgba(255,255,255,0.18)',
              bgcolor: 'rgba(255,255,255,0.08)',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.055))',
              backdropFilter: 'blur(28px) saturate(145%)',
              WebkitBackdropFilter: 'blur(28px) saturate(145%)',
              borderRadius: 3,
              p: { xs: 2, md: 3 },
              boxShadow: '0 30px 90px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)'
            }}
          >
            <Tabs
              value={workspaceTab}
              onChange={(_event, nextValue) => setWorkspaceTab(nextValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                mb: 2.6,
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                  minHeight: 44,
                  mr: 1,
                  px: 2.4,
                  borderRadius: 2,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  bgcolor: 'rgba(255,255,255,0.07)'
                },
                '& .Mui-selected': {
                  color: '#17120D',
                  bgcolor: 'rgba(216,182,94,0.92)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.42)'
                }
              }}
            >
              {workspaceTabs.map((tab) => (
                <Tab key={tab.label} label={tab.label} />
              ))}
            </Tabs>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 0.78fr) minmax(0, 1fr)' }, gap: { xs: 2.5, md: 3 }, alignItems: 'stretch' }}>
              <Box
                sx={{
                  minHeight: { xs: 260, md: 390 },
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'linear-gradient(145deg, rgba(216,182,94,0.24), rgba(255,255,255,0.06) 38%, rgba(255,255,255,0.02))',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)'
                }}
              >
                <Box sx={{ position: 'absolute', inset: 18, border: '1px solid rgba(255,255,255,0.11)', borderRadius: 2 }} />
                <Box sx={{ position: 'absolute', right: -70, top: -40, width: 190, height: 190, borderRadius: '50%', bgcolor: 'rgba(216,182,94,0.16)' }} />
                <Box sx={{ position: 'absolute', left: -54, bottom: -64, width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.14)' }} />
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

      <Box id="technical-documentation" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#14110E', color: '#fff' }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#D8B65E', fontWeight: 900, letterSpacing: 2 }}>
                Technical Documentation
              </Typography>
              <Typography variant="h2" sx={{ color: '#fff', mt: 1.5, mb: 3, fontSize: { xs: '2.15rem', md: '3.2rem' }, lineHeight: 1.08 }}>
                Request proof materials before the sample kit.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.76)', lineHeight: 1.8 }}>
                Buyer materials can include the current lot sheet, available certification documentation,
                selected harvest analysis, and sample kit details.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowRight size={18} />}
                onClick={scrollToInquiry}
                sx={{ mt: 4, bgcolor: '#D8B65E', color: '#111', fontWeight: 900, px: 3.2, py: 1.25, '&:hover': { bgcolor: '#E6C978' } }}
              >
                Request Documentation
              </Button>
            </Box>
            <Box sx={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2, p: { xs: 2.8, md: 3.5 }, bgcolor: 'rgba(255,255,255,0.045)' }}>
              {documents.map((item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="center" sx={{ py: 1.45, borderBottom: '1px solid rgba(255,255,255,0.1)', '&:last-of-type': { borderBottom: 0 } }}>
                  <BadgeCheck size={19} color="#D8B65E" />
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
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
              onClick={scrollToInquiry}
              sx={{ bgcolor: '#12100D', color: '#fff', fontWeight: 900, px: 3.4, py: 1.35, '&:hover': { bgcolor: '#2C2C2C' } }}
            >
              Request Sample Kit
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
