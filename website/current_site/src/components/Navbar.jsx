import React, { useState } from 'react';
import { AppBar, Box, Button, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navItems = [
  { label: 'Proof', id: 'proof' },
  { label: 'Evidence', id: 'evidence-windows' },
  { label: 'Buyers', id: 'buyer-segments' },
  { label: 'Documentation', id: 'technical-documentation' },
  { label: 'Inquiry', id: 'buyer-inquiry' }
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(8,7,6,0.58)',
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          borderBottom: '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 18px 48px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.1)',
          zIndex: 1201
        }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important', height: { xs: 64, md: 78 } }}>
            <Box
              component="img"
              src="/logo.png"
              alt="The Vanilla Republic"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{ height: { xs: 30, md: 40 }, cursor: 'pointer', filter: 'brightness(0) invert(1)' }}
            />

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.6, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  sx={{ color: 'rgba(255,255,255,0.86)', fontWeight: 850, px: 1.6, '&:hover': { color: '#D8B65E', bgcolor: 'rgba(255,255,255,0.06)' } }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="contained"
                onClick={() => scrollToSection('buyer-inquiry')}
                sx={{ ml: 1, bgcolor: '#D8B65E', color: '#111', fontWeight: 900, '&:hover': { bgcolor: '#E6C978' } }}
              >
                Sample Kit
              </Button>
            </Box>

            <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' }, color: '#fff' }} aria-label="Open navigation">
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 290, bgcolor: '#FCFAF6' } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileOpen(false)} aria-label="Close navigation">
              <CloseIcon sx={{ color: '#1a1a1a' }} />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton onClick={() => scrollToSection(item.id)} sx={{ py: 2 }}>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 900, color: '#1a1a1a' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
