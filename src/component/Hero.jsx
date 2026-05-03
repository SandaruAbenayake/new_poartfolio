// components/Hero.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import TechSlider from './TechSlider';
import { motion } from 'framer-motion';

const name = "Sandaru";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const letterVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
};

const Hero = () => (
  <Box
    sx={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      px: 2,
      py: { xs: 8, md: 0 },
    }}
  >
    <Typography
      variant="h2"
      component="h1"
      sx={{
        mt: 20,
        display: 'inline-flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
        fontWeight: 700,
        lineHeight: 1.2,
      }}
    >
      Hi, I'm{' '}
      <motion.strong
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'inline-flex',
          marginLeft: 6,
          color: '#1976d2',
        }}
      >
        {name.split('').map((char, index) => (
          <motion.span
            key={char + "-" + index}
            variants={letterVariants}
            style={{
              display: 'inline-block',
              marginRight: 2,
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.strong>
    </Typography>

    <Typography
      variant="h5"
      color="text.secondary"
      sx={{
        mt: 2,
        mb: { xs: 5, sm: 6 },
        fontSize: { xs: '1.9rem', sm: '2.6rem', md: '4.2rem' },
      }}
    >
      From Pixels to Servers.
    </Typography>

    <Box sx={{ width: '100%' }}>
      <TechSlider />
    </Box>
  </Box>
);

export default Hero;
