import React, { useRef } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

const Contact = () => {
  const form = useRef();
  const { isDark } = useTheme();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_ewblzd9',
      'template_gs1d1sb',
      form.current,
      '30OrMJt0H0yIn4U4b'
    )
    .then((result) => {
        alert('Message sent successfully!');
        form.current.reset();
    }, (error) => {
        alert('Failed to send message. Error: ' + error.text);
    });
  };

  return (
    <motion.div
      id="contact"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.5 }}
      style={{
        padding: '64px 32px',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 4,
          background: 'linear-gradient(45deg, #ff6b6b, #ee7752)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 'bold',
        }}
      >
        git commit -m "let's talk"
      </Typography>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: isDark ? 'rgba(30, 40, 70, 0.8)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)'}`,
          borderRadius: '24px',
          padding: '40px',
          boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Box component="form" ref={form} onSubmit={sendEmail}>
          <TextField
            label="Name"
            name="user_name"
            fullWidth
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#fff' : '#000',
                '& fieldset': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b6b',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              },
              '& .MuiInputLabel-root': {
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              },
            }}
          />

          <TextField
            label="Email"
            name="user_email"
            type="email"
            fullWidth
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#fff' : '#000',
                '& fieldset': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b6b',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              },
              '& .MuiInputLabel-root': {
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              },
            }}
          />

          <TextField
            label="Message"
            name="message"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#fff' : '#000',
                '& fieldset': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b6b',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              },
              '& .MuiInputLabel-root': {
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              background: 'linear-gradient(45deg, #ff6b6b, #ee7752)',
              color: '#fff',
              fontWeight: 'bold',
              padding: '12px 40px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(255, 107, 107, 0.4)',
              },
            }}
          >
            Send
          </Button>
        </Box>
      </motion.div>
    </motion.div>
  );
};

export default Contact;
