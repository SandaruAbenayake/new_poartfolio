// components/TechSlider.jsx
import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";

const techLogos = [
  { src: "/logos/html.png", alt: "HTML" },
  { src: "/logos/css.png", alt: "CSS" },
  { src: "/logos/javascript.png", alt: "JavaScript" },
  { src: "/logos/react.png", alt: "React" },
  { src: "/logos/flutter.png", alt: "Flutter" },
  { src: "/logos/nodejs.png", alt: "Node.js" },
  { src: "/logos/java.png", alt: "Java" },
  { src: "/logos/php.png", alt: "PHP" },
  { src: "/logos/express.png", alt: "Express" },
  { src: "/logos/mysql.png", alt: "MySQL" },
  { src: "/logos/firebase.png", alt: "Firebase" },
  { src: "/logos/mongodb.png", alt: "MongoDB" },
  { src: "/logos/git.png", alt: "Git" },
  { src: "/logos/python.png", alt: "Python" },
  { src: "/logos/machine.png", alt: "Machine Learning" }
];

const TechSlider = () => {
  const settings = {
    infinite: true,
    speed: 1900,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <Box sx={{ mt: 4, width: { xs: "100%", sm: "95%", md: "90%", lg: "85%" }, mx: "auto" }}>
      <Slider {...settings}>
        {techLogos.map((logo, index) => (
          <Box
            key={index}
            sx={{
              px: 1,
              textAlign: "center"
            }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              height="100"
              style={{ objectFit: "contain", marginBottom: 18, margin: "auto" }}
            />
            <Typography variant="body2">{logo.alt}</Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default TechSlider;
