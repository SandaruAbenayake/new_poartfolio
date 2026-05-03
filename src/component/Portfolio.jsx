import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton } from "@mui/material";
import { Chip } from "@mui/material";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";

const projects = [
  {
  title: "ML Palm Harvest Project",
  description: "Machine learning project predicting palm yield using Python.",
  tech: "Python, Pandas, YOLOv11, OpenCV",
  image: "/images/icon.png",
  github: "https://github.com/Final-Year-Research-Oil-Plam",
},
  {
    title: "Phahan EDU Book Shop",
    description:
      "A Java Servlets-based web app for managing a bookstore with user and admin access.",
    tech: "Java, Servlets, MySQL, React, MUI",
    image: "/images/phahan-edu.png",
    github:
      "https://github.com/SandaruAbenayake/pahana_edu",
  },
  {
    title: "MunchMix",
    description:
      "A PHP-based food website with menus, cart, and interactive design using HTML, CSS, JS.",
    tech: "PHP, HTML, CSS, JavaScript",
    image: "/images/munchmix.jpg",
    github: "https://github.com/SandaruAbenayake/MunchMix",
  },
    {
    title: "Flutter Restaurant App",
    description:
      "A mobile restaurant system app built with Flutter for managing food orders.",
    tech: "Flutter, Dart, Firebase",
    image: "/images/flutter-restaurant.png",
    github: "https://github.com/SandaruAbenayake/Flutter-Restaurant_App",
  },
  {
    title: "Face Mask Detector",
    description: "Real-time face mask detection using MobileNetV2 and OpenCV.",
    tech: "Python, OpenCV, MobileNetV2",
    video: "/videos/mask-detector.mp4",
    github: "https://github.com/SandaruAbenayake/face-mask-detector",
  },
  {
    title: "Volume Balance",
    description:
      "Hand gesture-based volume control using OpenCV and MediaPipe.",
    tech: "Python, OpenCV, MediaPipe",
    video: "/videos/volume-balance.mp4",
    github: "https://github.com/SandaruAbenayake/volume-balance",
  },
    {
    title: "Notes App",
    description: "MERN stack notes app with CRUD operations and a clean UI.",
    tech: "MongoDB, Express, React, Node.js",
    image: "/images/note-app.png",
    github: "https://github.com/SandaruAbenayake/Notes-App",
  },
];

const PortfolioCard = ({ project, isDark }) => {
  const ref = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.5 }}
    >
      <Card
        sx={{
          width: 300,
          height: 400,
          background: isDark ? 'rgba(30, 40, 70, 0.8)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)'}`,
          borderRadius: '16px',
          transition: "all 0.3s ease",
          boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: isDark ? '0 12px 40px rgba(0, 0, 0, 0.5)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
            background: isDark ? 'rgba(40, 55, 90, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          },
        }}
      >
        {project.video ? (
          <CardMedia
            component="video"
            src={project.video}
            controls
            muted
            autoPlay
            loop
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderBottom: "1px solid #eee",
            }}
          />
        ) : (
          <CardMedia
            component="img"
            height="180"
            image={project.image}
            alt={project.title}
          />
        )}

        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight="bold">
              {project.title}
            </Typography>
            {project.github && (
              <IconButton
                component="a"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: "	#b2b2b2", //
                  color: "#0000002", //
                  fontWeight: 500,
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {project.description}
          </Typography>

          {/* Render tech stack as Chips */}
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {project.tech.split(",").map((techItem, idx) => (
              <Chip
                key={idx}
                label={techItem.trim()}
                size="small"
                sx={{
                  backgroundColor: isDark ? "rgba(100, 150, 255, 0.3)" : "#e0f7fa",
                  color: isDark ? "#87ceeb" : "#006064",
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Portfolio = () => {
  const { isDark } = useTheme();

  return (
    <Box id="portfolio" sx={{ padding: 8 }}>
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold" sx={{
        background: 'linear-gradient(45deg, #ff6b6b, #ee7752)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        Portfolio
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={10} key={index}>
            <PortfolioCard project={project} isDark={isDark} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Portfolio;
