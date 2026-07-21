import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { ArrowRight, ClipboardCheck, FileText, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import contactImage from '../assets/step5.jpeg';

const initialFormData = {
  first_name: '',
  last_name: '',
  company: '',
  title: '',
  email: '',
  phone: '',
  website: '',
  country: '',
  state: '',
  buyer_segment: '',
  estimated_monthly_usage: '',
  application: '',
  interested_in: '',
  message: '',
  consent_to_contact: false
};

const buyerSegments = [
  'Extract House',
  'Flavor House',
  'Specialty Distributor',
  'Premium Food Manufacturer',
  'Chef / Artisan',
  'Chocolatier',
  'Private Label / Gourmet Retail',
  'Other Professional Buyer'
];

const interests = [
  'Sample Kit',
  'Technical Documentation',
  'Current Lot Sheet',
  'Buyer Call',
  'Distribution'
];

export default function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const requiredFields = ['first_name', 'last_name', 'company', 'email', 'buyer_segment'];

    requiredFields.forEach((field) => {
      if (!String(formData[field] || '').trim()) {
        nextErrors[field] = 'Required';
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!formData.consent_to_contact) {
      nextErrors.consent_to_contact = 'Consent is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Please complete the required fields before submitting.'
      });
      return;
    }

    setStatus({ submitting: true, success: false, error: false, message: '' });

    const payload = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      company: formData.company.trim(),
      title: formData.title.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      website: formData.website.trim(),
      country: formData.country.trim(),
      state: formData.state.trim(),
      buyer_segment: formData.buyer_segment,
      estimated_monthly_usage: formData.estimated_monthly_usage.trim(),
      application: formData.application.trim(),
      interested_in: formData.interested_in,
      message: formData.message.trim(),
      consent_to_contact: formData.consent_to_contact,
      source: 'local_landing',
      submitted_at: new Date().toISOString()
    };
    const endpoint = import.meta.env.VITE_SAMPLE_REQUEST_ENDPOINT;
    const debugForms = import.meta.env.VITE_DEBUG_FORMS === 'true' || import.meta.env.DEV;

    try {
      if (!endpoint) {
        if (debugForms) {
          console.info('Sample request payload', payload);
        }
        setFormData(initialFormData);
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: 'Your inquiry was captured for preview. Please confirm the buyer inquiry form is connected before publishing.'
        });
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        if (response.status === 400) {
          setStatus({
            submitting: false,
            success: false,
            error: true,
            message: errorPayload?.message || 'Please correct the required fields and try again.'
          });
          return;
        }
        throw new Error(errorPayload?.message || `Webhook returned ${response.status}`);
      }

      const result = await response.json();

      setFormData(initialFormData);
      setErrors({});
      setStatus({
        submitting: false,
        success: true,
        error: false,
        message: result?.message || 'Your request was received.'
      });
    } catch (error) {
      console.error(error);
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'We could not receive your inquiry right now. Please try again or contact The Vanilla Republic directly.'
      });
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      color: '#241F19',
      bgcolor: '#fff',
      borderRadius: 1,
      '& fieldset': { borderColor: 'rgba(32,28,24,0.16)' },
      '&:hover fieldset': { borderColor: '#A88742' },
      '&.Mui-focused fieldset': { borderColor: '#A88742' }
    },
    '& .MuiInputLabel-root': { color: '#6C6258' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8A6B32' },
    '& .MuiSelect-icon': { color: '#241F19' },
    '& .MuiFormHelperText-root': { mx: 0 }
  };

  const menuProps = {
    PaperProps: {
      sx: {
        bgcolor: '#211D18',
        color: '#fff',
        '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(231,200,101,0.12)' }
      }
    }
  };

  return (
    <Box id="buyer-inquiry" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#F8F4EC', color: '#201C18' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '0.78fr 1.22fr' },
            gap: { xs: 4, md: 5 },
            alignItems: 'start'
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            sx={{
              minHeight: { xs: 560, lg: 720 },
              color: '#fff',
              overflow: 'hidden',
              position: { xs: 'relative', lg: 'sticky' },
              top: { lg: 110 },
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: 2,
              boxShadow: '0 30px 80px rgba(47,36,22,0.2), inset 0 1px 0 rgba(255,255,255,0.18)'
            }}
          >
            <Box
              component="img"
              src={contactImage}
              alt="Vanilla beans prepared for buyer review"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'saturate(0.96) contrast(1.04)'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(20,17,14,0.2) 0%, rgba(20,17,14,0.58) 42%, rgba(20,17,14,0.94) 100%)'
              }}
            />
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                minHeight: 'inherit',
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 4
              }}
            >
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box
                  component="img"
                  src="/icono.png"
                  alt="The Vanilla Republic icon"
                  sx={{ width: 46, height: 46, objectFit: 'contain', filter: 'drop-shadow(0 12px 26px rgba(0,0,0,0.45))' }}
                />
                <Box>
                  <Typography sx={{ color: '#D8B65E', fontWeight: 900, letterSpacing: 1.7, textTransform: 'uppercase', fontSize: '0.74rem' }}>
                    Buyer Inquiry
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontWeight: 750, fontSize: '0.86rem' }}>
                    Naranjal / Guayas, Ecuador
                  </Typography>
                </Box>
              </Stack>

              <Box>
                <Typography variant="h2" sx={{ color: '#fff', mb: 2, fontSize: { xs: '2.05rem', md: '2.65rem' }, lineHeight: 1.06, maxWidth: 430 }}>
                  Buyer review, routed with proof.
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, maxWidth: 470 }}>
                  Share your segment, application, and documentation needs. Sample kits, current lot sheets,
                  and technical requests are matched to the appropriate lot review path.
                </Typography>
              </Box>

              <Box
                sx={{
                  border: '1px solid rgba(255,255,255,0.22)',
                  bgcolor: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(20px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                  borderRadius: 2,
                  p: 1.4,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)'
                }}
              >
                {[
                  { icon: ClipboardCheck, title: 'Lot-specific intake', detail: 'Buyer details guide the sample path' },
                  { icon: FileText, title: 'Documentation first', detail: 'Lot sheets and selected analysis' },
                  { icon: ShieldCheck, title: 'Qualified buyer path', detail: 'Requests are routed by application' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Stack
                      key={item.title}
                      direction="row"
                      spacing={1.4}
                      alignItems="center"
                      sx={{
                        py: 1.2,
                        px: 1,
                        borderBottom: '1px solid rgba(255,255,255,0.13)',
                        '&:last-of-type': { borderBottom: 0 }
                      }}
                    >
                      <Box sx={{ width: 38, height: 38, display: 'grid', placeItems: 'center', bgcolor: 'rgba(216,182,94,0.92)', color: '#201C18', borderRadius: 1 }}>
                        <Icon size={18} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 900, lineHeight: 1.15 }}>{item.title}</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.66)', fontSize: '0.86rem', mt: 0.25 }}>{item.detail}</Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Box>
            </Box>
          </Box>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2.3,
              border: '1px solid rgba(32,28,24,0.1)',
              borderRadius: 2,
              p: { xs: 2.4, md: 3.5 },
              bgcolor: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(18px) saturate(135%)',
              WebkitBackdropFilter: 'blur(18px) saturate(135%)',
              boxShadow: '0 22px 60px rgba(47,36,22,0.08), inset 0 1px 0 rgba(255,255,255,0.72)'
            }}
          >
            <TextField required label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} error={Boolean(errors.first_name)} helperText={errors.first_name} sx={inputStyle} />
            <TextField required label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} error={Boolean(errors.last_name)} helperText={errors.last_name} sx={inputStyle} />
            <TextField required label="Company" name="company" value={formData.company} onChange={handleChange} error={Boolean(errors.company)} helperText={errors.company} sx={inputStyle} />
            <TextField label="Title" name="title" value={formData.title} onChange={handleChange} sx={inputStyle} />
            <TextField required type="email" label="Email" name="email" value={formData.email} onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email} sx={inputStyle} />
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} sx={inputStyle} />
            <TextField label="Website" name="website" value={formData.website} onChange={handleChange} sx={inputStyle} />
            <TextField required label="Country" name="country" value={formData.country} onChange={handleChange} sx={inputStyle} />
            <TextField label="State / Province" name="state" value={formData.state} onChange={handleChange} sx={inputStyle} />
            <TextField
              required
              select
              label="Buyer Segment"
              name="buyer_segment"
              value={formData.buyer_segment}
              onChange={handleChange}
              error={Boolean(errors.buyer_segment)}
              helperText={errors.buyer_segment}
              sx={inputStyle}
              SelectProps={{ MenuProps: menuProps }}
            >
              {buyerSegments.map((segment) => (
                <MenuItem key={segment} value={segment}>{segment}</MenuItem>
              ))}
            </TextField>
            <TextField label="Estimated Monthly Usage" name="estimated_monthly_usage" value={formData.estimated_monthly_usage} onChange={handleChange} sx={inputStyle} />
            <TextField label="Application" name="application" value={formData.application} onChange={handleChange} sx={inputStyle} />
            <TextField
              required
              select
              label="Interested In"
              name="interested_in"
              value={formData.interested_in}
              onChange={handleChange}
              sx={inputStyle}
              SelectProps={{ MenuProps: menuProps }}
            >
              {interests.map((interest) => (
                <MenuItem key={interest} value={interest}>{interest}</MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: { xs: 'none', md: 'block' } }} />
            <TextField
              required
              multiline
              minRows={5}
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              sx={{ ...inputStyle, gridColumn: '1 / -1' }}
            />
            <FormControlLabel
              sx={{ gridColumn: '1 / -1', alignItems: 'flex-start', color: '#4E453D' }}
              control={<Checkbox name="consent_to_contact" checked={formData.consent_to_contact} onChange={handleChange} sx={{ color: errors.consent_to_contact ? '#f44336' : '#A88742', '&.Mui-checked': { color: '#A88742' } }} />}
              label="I agree to be contacted by The Vanilla Republic about this buyer inquiry."
            />
            {errors.consent_to_contact && (
              <Typography sx={{ gridColumn: '1 / -1', mt: -2, color: '#c62828', fontSize: '0.8rem' }}>
                {errors.consent_to_contact}
              </Typography>
            )}
            <Button
              type="submit"
              size="large"
              variant="contained"
              endIcon={<ArrowRight size={18} />}
              disabled={status.submitting}
              sx={{
                gridColumn: '1 / -1',
                py: 1.55,
                bgcolor: '#211B15',
                color: '#fff',
                fontWeight: 900,
                '&:hover': { bgcolor: '#3A3026' }
              }}
            >
              {status.submitting ? 'Submitting...' : 'Submit Buyer Inquiry'}
            </Button>
          </Box>
        </Box>
      </Container>

      <Snackbar open={status.success} autoHideDuration={7000} onClose={() => setStatus((current) => ({ ...current, success: false }))}>
        <Alert severity="success" sx={{ width: '100%' }}>{status.message}</Alert>
      </Snackbar>
      <Snackbar open={status.error} autoHideDuration={7000} onClose={() => setStatus((current) => ({ ...current, error: false }))}>
        <Alert severity="error" sx={{ width: '100%' }}>{status.message}</Alert>
      </Snackbar>
    </Box>
  );
}
