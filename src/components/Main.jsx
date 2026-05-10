import Lenis from "@studio-freight/lenis";
import React, { useEffect, useRef, useState } from "react";
import { createPortfolioScene } from "../three/scene";
import HomePageTrigger from "./HomePageTrigger";
import { useSpringMouse } from "./SpringMouseProvider";

function Main({ projects, profile }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const lenisRef = useRef(null);
  const frameRef = useRef(0);
  const isVisibleRef = useRef(true);
  const [hasScrolledHero, setHasScrolledHero] = useState(false);
  const [hasLeftHero, setHasLeftHero] = useState(false);
  const [isProjectNavVisible, setIsProjectNavVisible] = useState(false);
  const { subscribe } = useSpringMouse();

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
        scene.updateScroll(progress);
        setHasScrolledHero(progress > 0.012);
        setHasLeftHero(progress > 0.08);
        setIsProjectNavVisible(progress > 0.46 && progress < 0.78);
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
      <HomePageTrigger />
    </>
  );
}

export default Main;
