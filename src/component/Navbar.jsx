import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { Menu, Close, NightsStay, WbSunny } from "@mui/icons-material";
import { Link } from "react-scroll";
import { useTheme } from "../context/ThemeContext.jsx";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");
  
  const navItems = ["about", "portfolio", "contact"];

  return (
    <AppBar
      position="fixed"
      sx={{
        background: isDark
          ? 'rgba(15, 23, 42, 0.8)'
          : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
        boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
        color: isDark ? '#fff' : '#000',
        elevation: 0,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            background: 'linear-gradient(45deg, #ff6b6b, #ee7752)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold',
          }}
        >
          Will be a developer
        </Typography>

        <IconButton
          onClick={toggleTheme}
          sx={{
            mr: 2,
            color: isDark ? '#fff' : '#000',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'rotate(20deg)',
              background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {isDark ? <NightsStay /> : <WbSunny />}
        </IconButton>

        {isMobile ? (
          <>
            <IconButton
              onClick={() => setOpen(true)}
              sx={{ color: isDark ? '#fff' : '#000' }}
            >
              <Menu />
            </IconButton>
            <Drawer
              anchor="right"
              open={open}
              onClose={() => setOpen(false)}
              sx={{
                '& .MuiDrawer-paper': {
                  background: isDark
                    ? 'rgba(15, 23, 42, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  color: isDark ? '#fff' : '#000',
                },
              }}
            >
              <IconButton onClick={() => setOpen(false)}>
                <Close sx={{ color: isDark ? '#fff' : '#000' }} />
              </IconButton>
              <List>
                {navItems.map((item) => (
                  <ListItem button key={item}>
                    <Link
                      to={item}
                      smooth
                      duration={500}
                      onClick={() => setOpen(false)}
                      style={{ cursor: 'pointer', width: '100%' }}
                    >
                      <ListItemText
                        primary={item.charAt(0).toUpperCase() + item.slice(1)}
                        sx={{
                          color: isDark ? '#fff' : '#000',
                        }}
                      />
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          navItems.map((item) => (
            <Link
              key={item}
              to={item}
              smooth
              duration={500}
              style={{
                margin: "0 20px",
                cursor: "pointer",
                color: isDark ? '#fff' : '#000',
                transition: 'all 0.3s ease',
                padding: '8px 12px',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
