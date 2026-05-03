import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";

const SpringMouseContext = createContext(null);

export function SpringMouseProvider({ children }) {
  const subscribersRef = useRef(new Set());
  const targetRef = useRef({ x: 0, y: 0 });
  const springRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  const subscribe = useCallback((listener) => {
    subscribersRef.current.add(listener);
    return () => subscribersRef.current.delete(listener);
  }, []);

  useEffect(() => {
    const onPointerMove = (event) => {
      targetRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();

    const tick = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      const spring = springRef.current;
      const target = targetRef.current;
      const stiffness = 120;
      const damping = 14;

      spring.vx += (target.x - spring.x) * stiffness * delta;
      spring.vy += (target.y - spring.y) * stiffness * delta;
      spring.vx *= Math.exp(-damping * delta);
      spring.vy *= Math.exp(-damping * delta);
      spring.x += spring.vx * delta;
      spring.y += spring.vy * delta;

      subscribersRef.current.forEach((listener) => listener({ x: spring.x, y: spring.y }));
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const value = useMemo(() => ({ subscribe }), [subscribe]);

  return <SpringMouseContext.Provider value={value}>{children}</SpringMouseContext.Provider>;
}

export function useSpringMouse() {
  const context = useContext(SpringMouseContext);

  if (!context) {
    throw new Error("useSpringMouse must be used inside SpringMouseProvider");
  }

  return context;
}
