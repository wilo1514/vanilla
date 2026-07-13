import React, { useState } from 'react';
import { Box, Container, Typography, TextField, MenuItem, Button, Grid, Paper, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';

export default function Contact() {
  // --- ESTADOS (Igual que antes) ---
  const [formData, setFormData] = useState({
    role: 'customer',
    name: '',
    email: '',
    company: '',
    country: '',
    volume: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ...status, submitting: true });

    try {
      const response = await fetch('/send_mail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.sent) {
        setStatus({ submitting: false, success: true, error: false });
        setFormData({ 
          role: 'customer', name: '', email: '', company: '', country: '', volume: '', message: '' 
        });
      } else {
        setStatus({ submitting: false, success: false, error: true });
      }
    } catch (error) {
      console.error(error);
      setStatus({ submitting: false, success: false, error: true });
    }
  };

  // --- ESTILOS PARA INPUTS OSCUROS (NUEVO) ---
  const darkInputStyle = {
    '& .MuiOutlinedInput-root': {
      color: '#fff', // Color del texto al escribir
      bgcolor: 'rgba(255, 255, 255, 0.03)', // Fondo sutil para el input
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, // Borde normal
      '&:hover fieldset': { borderColor: '#D4AF37' }, // Borde al pasar el mouse (Dorado)
      '&.Mui-focused fieldset': { borderColor: '#D4AF37', borderWidth: '2px' }, // Borde al hacer clic (Dorado)
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.6)' }, // Color del label normal
    '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }, // Color del label activo
    '& .MuiSelect-icon': { color: '#fff' }, // Color de la flechita del select
  };

  // Estilos para el menú desplegable oscuro
  const darkMenuProps = {
    PaperProps: {
      sx: {
        bgcolor: '#262626',
        color: '#fff',
        '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(212, 175, 55, 0.1)' },
        '& .Mui-selected': { bgcolor: 'rgba(212, 175, 55, 0.2) !important' }
      }
    }
  };


  return (
    // 1. CAMBIO: Fondo exterior negro (#000)
    <Box sx={{ py: 12, bgcolor: '#000' }} id="contact">
      <Container maxWidth="md">
        <Paper 
          elevation={0} // Quitamos sombra para un look más plano
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: 4,
            overflow: 'hidden',
            // 2. CAMBIO: Fondo de la tarjeta oscuro (#1a1a1a) y texto blanco
            bgcolor: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Encabezados */}
          <Typography variant="overline" align="center" display="block" sx={{ color: '#D4AF37', fontWeight: 700, letterSpacing: 2, mb: 1 }}>
            GLOBAL INQUIRIES
          </Typography>
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 2, color: '#fff' }}>
            Let's Start a Conversation
          </Typography>
          {/* CAMBIO: Color del texto descriptivo a un gris claro */}
          <Typography align="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto', color: 'rgba(255,255,255,0.7)' }}>
            Connect with The Vanilla Republic. Please select your profile to help us serve you better.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              
              {/* SELECTOR DE ROL */}
              <Grid item xs={12}>
                <TextField 
                  select 
                  fullWidth 
                  label="I am a..." 
                  name="role"
                  value={formData.role} 
                  onChange={handleChange}
                  variant="outlined"
                  // APLICAMOS ESTILOS OSCUROS
                  sx={darkInputStyle}
                  SelectProps={{ MenuProps: darkMenuProps }}
                >
                  <MenuItem value="customer">Private Customer / General Inquiry</MenuItem>
                  <MenuItem value="distributor">Wholesale Distributor / Chef / Business</MenuItem>
                </TextField>
              </Grid>
              
              {/* CAMPOS COMUNES (Aplicamos sx={darkInputStyle} a todos) */}
              <Grid item xs={12} md={6}>
                <TextField fullWidth required label="Full Name" name="name" value={formData.name} onChange={handleChange} variant="outlined" sx={darkInputStyle} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth required type="email" label="Email Address" name="email" value={formData.email} onChange={handleChange} variant="outlined" sx={darkInputStyle} />
              </Grid>
              
              {/* CAMPOS CONDICIONALES */}
              {formData.role === 'distributor' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Company Name" name="company" value={formData.company} onChange={handleChange} sx={darkInputStyle} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Country of Destination" name="country" value={formData.country} onChange={handleChange} sx={darkInputStyle} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Estimated Annual Volume (kg)" placeholder="e.g. 50kg..." name="volume" value={formData.volume} onChange={handleChange} sx={darkInputStyle} />
                  </Grid>
                </>
              )}

              {/* MENSAJE */}
              <Grid item xs={12}>
                <TextField fullWidth required multiline rows={4} label="How can we help you?" name="message" value={formData.message} onChange={handleChange} sx={darkInputStyle} />
              </Grid>

              {/* BOTÓN DE ENVÍO (Dorado) */}
              <Grid item xs={12}>
                <Button 
                  type="submit"
                  variant="contained" 
                  size="large" 
                  fullWidth 
                  disabled={status.submitting}
                  sx={{ 
                    py: 2, 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    // CAMBIO: Botón dorado
                    bgcolor: '#D4AF37', 
                    color: '#000',
                    '&:hover': { bgcolor: '#b5952f' }
                  }}
                >
                  {status.submitting ? 'Sending...' : 'Send Inquiry'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      {/* Notificaciones */}
      <Snackbar open={status.success} autoHideDuration={6000} onClose={() => setStatus({ ...status, success: false })}>
        <Alert severity="success" sx={{ width: '100%', bgcolor: '#4caf50', color: '#fff' }}>Message sent successfully!</Alert>
      </Snackbar>
      <Snackbar open={status.error} autoHideDuration={6000} onClose={() => setStatus({ ...status, error: false })}>
        <Alert severity="error" sx={{ width: '100%', bgcolor: '#d32f2f', color: '#fff' }}>Error sending message. Please try again.</Alert>
      </Snackbar>
    </Box>
  );
}