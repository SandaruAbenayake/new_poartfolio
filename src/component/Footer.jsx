import React from 'react';
import { Box, Typography, IconButton, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  const { isDark } = useTheme();

  const socialLinks = [
    {
      icon: GitHubIcon,
      url: 'https://github.com/SandaruAbenayake',
      label: 'GitHub',
      color: '#000',
    },
    {
      icon: LinkedInIcon,
      url: 'https://www.linkedin.com/in/sandaru-abenayake-768628252/',
      label: 'LinkedIn',
      color: '#0077B5',
    },
    {
      icon: WhatsAppIcon,
      url: 'https://wa.me/94713005158',
      label: 'WhatsApp',
      color: '#25D366',
    },
    {
      icon: EmailIcon,
      url: 'mailto:maggonageabenayake@gmail.com',
      label: 'Email',
      color: '#FF5722',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        px: 2,
        background: isDark
          ? 'linear-gradient(135deg, rgba(10, 14, 39, 0.9), rgba(20, 30, 60, 0.9))'
          : 'linear-gradient(135deg, rgba(248, 249, 255, 0.9), rgba(240, 245, 255, 0.9))',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
        >
          {/* Glass Container */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                background: isDark
                  ? 'rgba(30, 40, 70, 0.5)'
                  : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)'}`,
                borderRadius: '24px',
                padding: { xs: '32px 24px', sm: '40px', md: '48px' },
                boxShadow: isDark
                  ? '0 15px 45px rgba(0, 0, 0, 0.3)'
                  : '0 15px 45px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ff6b6b, #ee7752)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.8rem' },
                }}
              >
                Fork Me, Let's Build
              </Typography>

              {/* Social Icons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: { xs: 2, sm: 3, md: 4 },
                  flexWrap: 'wrap',
                  mb: 4,
                }}
              >
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.label}
                      variants={itemVariants}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        component="a"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          width: { xs: 50, sm: 56, md: 64 },
                          height: { xs: 50, sm: 56, md: 64 },
                          background: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
                          borderRadius: '16px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: link.color,
                            color: '#fff',
                            boxShadow: `0 8px 20px ${link.color}40`,
                            transform: 'translateY(-4px)',
                          },
                        }}
                        title={link.label}
                      >
                        <Icon
                          sx={{
                            fontSize: { xs: '24px', sm: '28px', md: '32px' },
                            color: isDark ? '#fff' : '#000',
                          }}
                        />
                      </IconButton>
                    </motion.div>
                  );
                })}
              </Box>

              {/* Divider */}
              <Box
                sx={{
                  height: '1px',
                  background: isDark
                    ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)',
                  my: 4,
                }}
              />

              {/* Contact Info */}
              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? '#b0b0b0' : '#666',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      mb: 1,
                    }}
                  >
                    📧 Email
                  </Typography>
                  <Typography
                    component="a"
                    href="mailto:maggonageabenayake@gmail.com"
                    sx={{
                      color: isDark ? '#e0e0e0' : '#333',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#ff6b6b',
                      },
                    }}
                  >
                    maggonageabenayake@gmail.com
                  </Typography>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? '#b0b0b0' : '#666',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      mb: 1,
                    }}
                  >
                    💬 WhatsApp
                  </Typography>
                  <Typography
                    component="a"
                    href="https://wa.me/94713005158"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: isDark ? '#e0e0e0' : '#333',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#25D366',
                      },
                    }}
                  >
                    +94 71 300 5158
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </motion.div>

          {/* Copyright */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                mt: 4,
                color: isDark ? '#888' : '#999',
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
              }}
            >
              © 2024 Sandaru Abenayake. All rights reserved. | Built with React & Material-UI
            </Typography>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
