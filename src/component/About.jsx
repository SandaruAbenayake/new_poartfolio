import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";

const About = () => {
  const { isDark } = useTheme();

  return (
    <motion.div
      id="about"
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "64px 32px",
        textAlign: "center",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.5 }}
    >
    {/* Background photo */}
    {/* <Box
      component="img"
      src="/images/sandaru.jpeg"
      alt="Sandaru"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "50%", md: "20%" },
        opacity: 0.3,
        userSelect: "none",
        pointerEvents: "none",
        borderRadius: "50%",
        zIndex: 0,
        objectFit: "cover",
      }}
    /> */}

    {/* Foreground glass content */}
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
        maxWidth: 1000,
        zIndex: 1,
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: "bold",
          letterSpacing: 3,
          background: 'linear-gradient(45deg, #ff6b6b, #ee7752)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        About Me
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
          lineHeight: 1.8,
          color: isDark ? '#b0b0b0' : '#666',
        }}
      >
        I'm a passionate Full Stack Developer who thrives on building intuitive,
        accessible, and user-centric applications. I believe that great software
        is not just functional—it’s also elegant, inclusive, and delightful to
        use. With experience across both frontend and backend technologies, I
        specialize in crafting seamless digital experiences that bridge the gap
        between design and functionality. Whether it's developing responsive user
        interfaces or designing scalable backend systems, I enjoy every step of
        the development process.
      </Typography>
    </motion.div>
    </motion.div>
  );
};

export default About;
