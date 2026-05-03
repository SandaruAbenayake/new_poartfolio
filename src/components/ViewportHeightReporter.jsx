import { useEffect } from "react";

function ViewportHeightReporter() {
  useEffect(() => {
    const report = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };

    report();
    window.addEventListener("resize", report);
    window.addEventListener("orientationchange", report);

    return () => {
      window.removeEventListener("resize", report);
      window.removeEventListener("orientationchange", report);
    };
  }, []);

  return null;
}

export default ViewportHeightReporter;
