import React, { useState } from "react";
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Close, Menu } from "@mui/icons-material";

const navItems = [
  { label: "Home", target: "home" },
  { label: "About", target: "about" },
  { label: "Projects", target: "projects" },
  { label: "Contact", target: "contact" },
];

const Navbar = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleNavigate = (target) => {
    onNavigate?.(target);
    setOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 16,
        left: "50%",
        right: "auto",
        zIndex: 3000,
        width: "min(94vw, 1040px)",
        borderRadius: "999px",
        background: "rgba(3, 7, 18, 0.68)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: 0,
        boxShadow: "0 18px 50px rgba(0, 0, 0, 0.24)",
        color: "#fff",
        transform: "translateX(-50%)",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          onClick={() => handleNavigate("home")}
          sx={{
            flexGrow: 1,
            background: "linear-gradient(45deg, #ff6b6b, #ee7752)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Build Bold
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              aria-label="Open main navigation"
              onClick={() => setOpen(true)}
              sx={{ color: "#fff" }}
            >
              <Menu />
            </IconButton>
            <Drawer
              anchor="right"
              open={open}
              onClose={() => setOpen(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  background: "rgba(15, 23, 42, 0.95)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: 0,
                  color: "#fff",
                },
              }}
            >
              <IconButton
                aria-label="Close main navigation"
                onClick={() => setOpen(false)}
              >
                <Close sx={{ color: "#fff" }} />
              </IconButton>
              <List aria-label="Main navigation">
                {navItems.map((item) => (
                  <ListItem
                    button
                    key={item.target}
                    onClick={() => handleNavigate(item.target)}
                    sx={{ cursor: "pointer", minWidth: 220 }}
                  >
                    <ListItemText
                      primary={item.label}
                      sx={{ color: "#fff" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          <nav aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.target}
                onClick={() => handleNavigate(item.target)}
                style={{
                  margin: "0 16px",
                  cursor: "pointer",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: 0,
                  background: "transparent",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  event.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = "transparent";
                  event.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
