import Lenis from "@studio-freight/lenis";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../component/Navbar";
import { createPortfolioScene } from "../three/scene";
import { getEasedScrollProgress } from "../three/scrollAnimation";
import HomePageTrigger from "./HomePageTrigger";
import { useSpringMouse } from "./SpringMouseProvider";

function getScrollProgressForSection(sectionProgress) {
  if (sectionProgress <= 0) return 0;
  if (sectionProgress >= 1) return 1;
  if (sectionProgress < 0.5) {
    return Math.cbrt(sectionProgress / 4);
  }
  return 1 - Math.cbrt((1 - sectionProgress) / 4);
}

function Main({ projects, profile }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const lenisRef = useRef(null);
  const frameRef = useRef(0);
  const isVisibleRef = useRef(true);
  const [hasScrolledHero, setHasScrolledHero] = useState(false);
  const [hasLeftHero, setHasLeftHero] = useState(false);
  const [isProjectNavVisible, setIsProjectNavVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const { subscribe } = useSpringMouse();
  const sectionTargets = {
    home: getScrollProgressForSection(0),
    about: getScrollProgressForSection(1 / 3),
    projects: getScrollProgressForSection(2 / 3),
    contact: getScrollProgressForSection(1),
  };

  const handleNavigate = (section) => {
    const progress = sectionTargets[section] ?? 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    lenisRef.current?.scrollTo(Math.max(0, maxScroll * progress));
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      return undefined;
    }

    let disposed = false;
    let unsubscribeMouse = () => {};

    const setup = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const scene = await createPortfolioScene({ canvas, projects, profile });
      if (disposed) {
        scene.dispose();
        return;
      }

      sceneRef.current = scene;
      unsubscribeMouse = subscribe((mouse) => scene.updateMouse(mouse));

      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ({ progress }) => {
        const eased = getEasedScrollProgress(progress);
        scene.updateScroll(progress);
        setHasScrolledHero(progress > 0.012);
        setHasLeftHero(progress > 0.08);
        setIsProjectNavVisible(eased > 0.52 && eased < 0.82);
        setIsContactVisible(eased > 0.86);
      });

      const onVisibilityChange = () => {
        isVisibleRef.current = document.visibilityState === "visible";
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      const raf = (time) => {
        if (isVisibleRef.current) {
          lenis.raf(time);
          scene.render(time);
        }

        frameRef.current = requestAnimationFrame(raf);
      };

      frameRef.current = requestAnimationFrame(raf);

      sceneRef.current.cleanupVisibility = () => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    };

    setup();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameRef.current);
      unsubscribeMouse();
      lenisRef.current?.destroy();
      sceneRef.current?.cleanupVisibility?.();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [profile, projects, subscribe]);

  return (
    <>
      <canvas ref={canvasRef} className="three-canvas" aria-hidden="true" />
      <Navbar onNavigate={handleNavigate} />
      <div
        className={`project-carousel-controls ${isProjectNavVisible ? "is-visible" : ""}`}
        aria-hidden={!isProjectNavVisible}
      >
        <button
          type="button"
          className="project-carousel-control"
          aria-label="Previous project"
          tabIndex={isProjectNavVisible ? 0 : -1}
          onClick={() => sceneRef.current?.prevProject?.()}
        >
          &lsaquo;
        </button>
        <button
          type="button"
          className="project-carousel-control"
          aria-label="Next project"
          tabIndex={isProjectNavVisible ? 0 : -1}
          onClick={() => sceneRef.current?.nextProject?.()}
        >
          &rsaquo;
        </button>
      </div>
      <section className={`hero-html ${hasLeftHero ? "is-hidden" : ""}`} aria-label="Hero introduction">
        <h1 className="hero-title" aria-label={profile.name}>
          {profile.name.split("").map((character, index) => (
            <span
              className="hero-title-char"
              key={`${character}-${index}`}
              style={{ "--char-index": index }}
              aria-hidden="true"
            >
              {character === " " ? "\u00a0" : character}
            </span>
          ))}
        </h1>
        <p className="hero-subtitle">{profile.tagline}</p>
      </section>
      <div className={`hero-scroll-hint ${hasScrolledHero ? "is-hidden" : ""}`} aria-hidden="true">
        <span />
      </div>
      <section
        className={`contact-panel ${isContactVisible ? "is-visible" : ""}`}
        aria-label="Contact links"
      >
        <a
          className="contact-link contact-link-email"
          href={`mailto:${profile.contact.email}`}
          tabIndex={isContactVisible ? 0 : -1}
        >
          <EmailIcon />
          <span>Email</span>
        </a>
        <a
          className="contact-link contact-link-whatsapp"
          href={profile.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isContactVisible ? 0 : -1}
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
        <a
          className="contact-link contact-link-github"
          href={profile.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isContactVisible ? 0 : -1}
        >
          <GitHubIcon />
          <span>GitHub</span>
        </a>
        <a
          className="contact-link contact-link-linkedin"
          href={profile.contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isContactVisible ? 0 : -1}
        >
          <LinkedInIcon />
          <span>LinkedIn</span>
        </a>
      </section>
      <HomePageTrigger />
    </>
  );
}

export default Main;
