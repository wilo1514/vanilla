import React from 'react';
import { Box, Container, IconButton, Link, Stack, Typography } from '@mui/material';
import { Globe, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: '#201A14', color: '#fff', pt: 9, pb: 4, borderTop: '1px solid rgba(44,44,44,0.12)' }}>
      <Container>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 1fr' }, gap: 5 }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
              THE VANILLA REPUBLIC
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.8, maxWidth: 460 }}>
              Single-origin Ecuadorian Vanilla Tahitensis beans for professional buyers who evaluate flavor with proof.
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: 900, color: '#D8B65E' }}>
              Vanilla. Perfected.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton size="small" sx={{ color: '#D8B65E' }} aria-label="Instagram"><Instagram size={20} /></IconButton>
              <IconButton size="small" sx={{ color: '#D8B65E' }} aria-label="LinkedIn"><Linkedin size={20} /></IconButton>
              <IconButton size="small" sx={{ color: '#D8B65E' }} aria-label="Website"><Globe size={20} /></IconButton>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              Ecuador Origin
            </Typography>
            <Stack spacing={2}>
              <Typography sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.68)' }}>
                <MapPin size={17} style={{ marginRight: 8, color: '#D8B65E' }} />
                Naranjal / Guayas, Ecuador
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.7 }}>
                Estate-grown, estate-cured, and lot-documented for professional review.
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              Buyer Inquiries
            </Typography>
            <Link href="mailto:info@thevanillarepublic.com" underline="none" sx={{ display: 'flex', alignItems: 'center', color: '#fff', fontWeight: 800 }}>
              <Mail size={18} style={{ marginRight: 10, color: '#D8B65E' }} />
              info@thevanillarepublic.com
            </Link>
            <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.68)', lineHeight: 1.7 }}>
              Request sample kit details, current lot sheets, or technical documentation.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 7, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.56)' }}>
            © {currentYear} THE VANILLA REPUBLIC. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
