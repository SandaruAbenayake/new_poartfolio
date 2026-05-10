import * as THREE from "three";
import { applyMouseAnimation } from "./mouseAnimation";
import { createProjectCarousel } from "./projectCarousel";
import { applyScrollAnimation } from "./scrollAnimation";

// Each entry: slug = simple-icons CDN slug, color = brand hex
const techStack = [
  { label: "HTML",             slug: "html5",       color: "#e34f26" },
  { label: "CSS",              slug: "css",         color: "#1572b6" },
  { label: "JavaScript",       slug: "javascript",  color: "#f7df1e" },
  { label: "React",            slug: "react",       color: "#61dafb" },
  { label: "Flutter",          slug: "flutter",     color: "#02569b" },
  { label: "Node.js",          slug: "nodedotjs",   color: "#5fa04e" },
  { label: "Java",             slug: "openjdk",     color: "#437291" },
  { label: "PHP",              slug: "php",         color: "#777bb4" },
  { label: "Express",          slug: "express",     color: "#ffffff" },
  { label: "MySQL",            slug: "mysql",       color: "#4479a1" },
  { label: "Firebase",         slug: "firebase",    color: "#dd2c00" },
  { label: "MongoDB",          slug: "mongodb",     color: "#47a248" },
  { label: "Git",              slug: "git",         color: "#f05032" },
  { label: "Python",           slug: "python",      color: "#3776ab" },
  { label: "Machine Learning", slug: "tensorflow",  color: "#ff6f00" },
];

const svgCache = {};

async function loadSimpleIcon(slug, color) {
  const key = `${slug}-${color}`;
  if (svgCache[key]) return svgCache[key];
  try {
    const res     = await fetch(`https://cdn.simpleicons.org/${slug}/${color.replace("#", "")}`);
    const svgText = await res.text();
    const blob    = new Blob([svgText], { type: "image/svg+xml" });
    const url     = URL.createObjectURL(blob);
    svgCache[key] = url;
    return url;
  } catch {
    return null;
  }
}

async function createTechIconTexture(slug, brandColor) {
  const size       = 256;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const canvas     = document.createElement("canvas");
  canvas.width     = size * pixelRatio;
  canvas.height    = size * pixelRatio;
  const ctx        = canvas.getContext("2d");
  ctx.scale(pixelRatio, pixelRatio);
  ctx.clearRect(0, 0, size, size);

  const iconUrl = await loadSimpleIcon(slug, brandColor);
  if (iconUrl) {
    await new Promise((resolve) => {
      const img    = new Image();
      img.onload   = () => {
        const padding = size * 0.15;
        ctx.shadowColor = brandColor;
        ctx.shadowBlur  = 28;
        ctx.drawImage(img, padding, padding, size - padding * 2, size - padding * 2);
        ctx.shadowBlur  = 0;
        resolve();
      };
      img.onerror = resolve;
      img.src     = iconUrl;
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

async function createTechOrbit() {
  const group       = new THREE.Group();
  const disposables = [];

  await Promise.all(
    techStack.map(async ({ slug, color }, index) => {
      const texture  = await createTechIconTexture(slug, color);
      const material = new THREE.MeshBasicMaterial({
        map: texture, transparent: true, opacity: 0.92,
        depthWrite: false, side: THREE.DoubleSide,
      });
      const mesh  = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.72), material);
      const angle = (index / techStack.length) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * 8.2,
        Math.sin(angle * 2) * 0.38,
        Math.sin(angle) * 3.8
      );
      mesh.userData = { angle, radiusX: 8.2, radiusZ: 3.8, phase: index * 0.73 };
      group.add(mesh);
      disposables.push(texture, material, mesh.geometry);
    })
  );

  group.rotation.x  = -0.3;
  group.position.y  = -0.15;
  group.userData.dispose = () => disposables.forEach(item => item.dispose?.());
  return group;
}

function createTextPlane(lines, width = 12, height = 6) {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const canvas     = document.createElement("canvas");
  canvas.width     = 1400 * pixelRatio;
  canvas.height    = 760  * pixelRatio;
  const context    = canvas.getContext("2d");
  context.scale(pixelRatio, pixelRatio);
  context.clearRect(0, 0, 1400, 760);
  context.textAlign    = "center";
  context.textBaseline = "middle";

  lines.forEach((line) => {
    context.font      = line.font;
    context.fillStyle = line.color;
    context.fillText(line.text, 700, line.y);
  });

  const texture  = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: 1, depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.userData.dispose = () => {
    texture.dispose(); material.dispose(); mesh.geometry.dispose();
  };
  return mesh;
}

function createAboutTextPlane(width = 10, height = 7) {
  const cw = 1024, ch = 720;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const canvas  = document.createElement("canvas");
  canvas.width  = cw * pixelRatio;
  canvas.height = ch * pixelRatio;
  const ctx     = canvas.getContext("2d");
  ctx.scale(pixelRatio, pixelRatio);
  ctx.clearRect(0, 0, cw, ch);

  ctx.textAlign    = "left";
  ctx.textBaseline = "top";
  ctx.font         = "900 80px Inter, Arial, sans-serif";
  ctx.fillStyle    = "#ffffff";
  ctx.fillText("About Me", 40, 30);

  ctx.beginPath();
  ctx.moveTo(40, 122);
  ctx.lineTo(200, 122);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth   = 4;
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur  = 14;
  ctx.stroke();
  ctx.shadowBlur  = 0;

  const bodyText =
    "I'm a passionate Full Stack Developer who thrives on building intuitive, " +
    "accessible, and user-centric applications. I believe that great software is " +
    "not just functional-it's also elegant, inclusive, and delightful to use. " +
    "With experience across both frontend and backend technologies, I specialize " +
    "in crafting seamless digital experiences that bridge the gap between design " +
    "and functionality. Whether it's developing responsive user interfaces or " +
    "designing scalable backend systems, I enjoy every step of the process.";

  const fontSize      = 26;
  const lineHeight    = 44;
  const maxLineWidth  = cw - 80;
  let   y             = 158;

  ctx.font      = `400 ${fontSize}px Inter, Arial, sans-serif`;
  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const words = bodyText.split(" ");
  let   line  = "";
  words.forEach((word, i) => {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxLineWidth && line) {
      ctx.fillText(line, 40, y);
      line  = word;
      y    += lineHeight;
    } else {
      line = test;
    }
    if (i === words.length - 1) ctx.fillText(line, 40, y);
  });

  const texture  = new THREE.CanvasTexture(canvas);
  texture.colorSpace  = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const material = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: 1,
    depthWrite: false, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.userData.dispose = () => {
    texture.dispose(); material.dispose(); mesh.geometry.dispose();
  };
  return mesh;
}

function createHeroParticles(count = 1100) {
  const geometry  = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const color     = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const s = i * 3;
    positions[s]     = (Math.random() - 0.5) * 26;
    positions[s + 1] = (Math.random() - 0.5) * 15;
    positions[s + 2] = (Math.random() - 0.5) * 16;
    color.setHSL(Math.random() > 0.78 ? 0.56 : 0.61, 0.8, 0.74);
    colors[s] = color.r; colors[s + 1] = color.g; colors[s + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color",    new THREE.BufferAttribute(colors,    3));

  const material = new THREE.PointsMaterial({
    size: 0.035, transparent: true, opacity: 0.62,
    vertexColors: true, depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  points.userData.dispose = () => { geometry.dispose(); material.dispose(); };
  return points;
}

function createParticleField(count = 900) {
  const geometry  = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const color     = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const s = i * 3;
    positions[s]     = (Math.random() - 0.5) * 42;
    positions[s + 1] = (Math.random() - 0.5) * 22;
    positions[s + 2] = (Math.random() - 0.5) * 110;
    color.setHSL((i / count) * 0.65 + 0.08, 0.78, 0.62);
    colors[s] = color.r; colors[s + 1] = color.g; colors[s + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color",    new THREE.BufferAttribute(colors,    3));

  const material = new THREE.PointsMaterial({
    size: 0.055, transparent: true, opacity: 0.7,
    vertexColors: true, depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  points.userData.dispose = () => { geometry.dispose(); material.dispose(); };
  return points;
}

async function createRenderer(canvas) {
  try {
    const webgpu         = await import("three/webgpu");
    const WebGPURenderer = webgpu.WebGPURenderer;
    if (WebGPURenderer && navigator.gpu) {
      const renderer = new WebGPURenderer({ canvas, antialias: true, alpha: true });
      await renderer.init?.();
      return renderer;
    }
  } catch (error) {
    console.info("WebGPU unavailable, falling back to WebGL.", error);
  }
  return new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
}

// ── Main scene ────────────────────────────────────────────────────────
export async function createPortfolioScene({ canvas, projects, profile }) {
  const renderer = await createRenderer(canvas);
  renderer.setClearColor(0x030712, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog   = new THREE.FogExp2(0x030712, 0.025);

  const cameraRig = new THREE.Object3D();
  const camera    = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 160);
  camera.position.set(0, 0, 15);
  cameraRig.add(camera);
  scene.add(cameraRig);

  const ambientLight     = new THREE.AmbientLight(0xffffff, 0.6);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(5, 7, 8);
  scene.add(ambientLight, directionalLight);

  const particles = createParticleField();
  scene.add(particles);

  // ── Section groups ────────────────────────────────────────────────
  const heroGroup    = new THREE.Group();
  const aboutGroup   = new THREE.Group();
  const workGroup    = new THREE.Group();
  const contactGroup = new THREE.Group();
  scene.add(heroGroup, aboutGroup, workGroup, contactGroup);

  // ── Hero ─────────────────────────────────────────────────────────
  const heroParticles = createHeroParticles();
  const techOrbit     = await createTechOrbit();
  heroGroup.add(heroParticles, techOrbit);

  // ── Work / Projects ───────────────────────────────────────────────
  // carousel at z=0 inside workGroup — NO extra z offset needed
  // workGroup itself is positioned by scrollAnimation at z = -sectionDepth*2
  const projectCarousel = createProjectCarousel(THREE, projects, camera);
  workGroup.add(projectCarousel);

  // Attach click/hover listeners once we have the renderer canvas
  projectCarousel.userData.attachClickListener?.(renderer.domElement);

  // ── About ─────────────────────────────────────────────────────────
  const aboutShape = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 2),
    new THREE.MeshStandardMaterial({
      color: 0x14b8a6, roughness: 0.34, metalness: 0.42,
      transparent: true, opacity: 0.68, wireframe: true,
    })
  );
  aboutShape.position.set(-5.5, 0, 0);
  aboutGroup.add(aboutShape);

  const aboutText = createAboutTextPlane(10, 7);
  aboutText.position.set(2.2, 0, 0);
  aboutGroup.add(aboutText);

  // ── Contact ───────────────────────────────────────────────────────
  contactGroup.add(
    createTextPlane(
      [
        { text: "Let's Build",                                    y: 290, font: "900 108px Inter, Arial, sans-serif", color: "#ffffff"  },
        { text: profile.contact.github.replace("https://", ""),   y: 430, font: "600 38px Inter, Arial, sans-serif",  color: "#f59e0b"  },
        { text: profile.contact.email,                            y: 500, font: "500 34px Inter, Arial, sans-serif",  color: "#d1d5db"  },
      ],
      13,
      6
    )
  );

  // ── State ─────────────────────────────────────────────────────────
  const state = {
    renderer,
    scene,
    camera,
    cameraRig,
    heroGroup,
    aboutGroup,
    workGroup,
    contactGroup,
    projectCarousel,
    aboutShape,
    heroParticles,
    techOrbit,
    // ORDER MUST MATCH scrollAnimation section indices:
    // 0=hero  1=about  2=work  3=contact
    sections: [
      { group: heroGroup    },
      { group: aboutGroup   },
      { group: workGroup    },
      { group: contactGroup },
    ],
    mouse:  { x: 0, y: 0 },
    scroll: 0,
  };

  applyScrollAnimation(state, 0);

  // ── Resize ────────────────────────────────────────────────────────
  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  };
  window.addEventListener("resize", resize);

  // ── Public API ────────────────────────────────────────────────────
  return {
    updateScroll(progress) {
      state.scroll = progress;
      applyScrollAnimation(state, progress);
      projectCarousel.userData.setEnabled?.(progress > 0.46 && progress < 0.78);
    },

    updateMouse(mouse) {
      state.mouse = mouse;
    },

    nextProject() {
      projectCarousel.userData.next?.();
    },

    prevProject() {
      projectCarousel.userData.prev?.();
    },

    render(time = 0) {
      const t = time * 0.001; // ms → seconds

      // Global particle drift
      particles.rotation.y      = time * 0.000025;
      heroParticles.rotation.y  = time * 0.000035;

      // Hero particles follow mouse
      heroParticles.position.x += (state.mouse.x * 0.3  - heroParticles.position.x) * 0.03;
      heroParticles.position.y += (state.mouse.y * 0.18 - heroParticles.position.y) * 0.03;

      // Tech orbit ring — spin + mouse tilt
      techOrbit.rotation.y += 0.0022;
      techOrbit.rotation.x += (-0.3 + state.mouse.y * 0.035 - techOrbit.rotation.x) * 0.04;
      techOrbit.rotation.z += (state.mouse.x * 0.045 - techOrbit.rotation.z) * 0.04;

      // Tech icons: orbit position + billboard toward camera
      techOrbit.children.forEach((child) => {
        if (!child.userData?.radiusX) return;
        const angle      = child.userData.angle + time * 0.00022;
        child.position.x = Math.cos(angle) * child.userData.radiusX;
        child.position.z = Math.sin(angle) * child.userData.radiusZ;
        child.position.y = Math.sin(t + child.userData.phase) * 0.36;
        child.lookAt(camera.position.x, camera.position.y, camera.position.z);
      });

      // ── Project carousel ────────────────────────────────────────
      // Moves only when the selected project changes by button or drag.
      projectCarousel.userData.animate?.(time);

      // About shape spin
      aboutShape.rotation.x += 0.0025;
      aboutShape.rotation.y += 0.0035;

      // Mouse camera tilt
      applyMouseAnimation(state, state.mouse);

      renderer.render(scene, camera);
    },

    dispose() {
      window.removeEventListener("resize", resize);
      scene.traverse((obj) => obj.userData?.dispose?.());
      aboutShape.geometry.dispose();
      aboutShape.material.dispose();
      renderer.dispose?.();
    },
  };
}
