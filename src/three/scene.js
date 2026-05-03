import * as THREE from "three";
import { applyMouseAnimation } from "./mouseAnimation";
import { createProjectCarousel } from "./projectCarousel";
import { applyScrollAnimation } from "./scrollAnimation";

const techStack = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Flutter",
  "Node.js",
  "Java",
  "PHP",
  "Express",
  "MySQL",
  "Firebase",
  "MongoDB",
  "Git",
  "Python",
  "Machine Learning",
];

function createTextPlane(lines, width = 12, height = 6) {
  const canvas = document.createElement("canvas");
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = 1400 * pixelRatio;
  canvas.height = 760 * pixelRatio;

  const context = canvas.getContext("2d");
  context.scale(pixelRatio, pixelRatio);
  context.clearRect(0, 0, 1400, 760);
  context.textAlign = "center";
  context.textBaseline = "middle";

  lines.forEach((line) => {
    context.font = line.font;
    context.fillStyle = line.color;
    context.fillText(line.text, 700, line.y);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.userData.dispose = () => {
    texture.dispose();
    material.dispose();
    mesh.geometry.dispose();
  };

  return mesh;
}

function createTechLabelTexture(label) {
  const canvas = document.createElement("canvas");
  const width = 512;
  const height = 180;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;

  const context = canvas.getContext("2d");
  context.scale(pixelRatio, pixelRatio);
  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(14, 165, 233, 0.88)");
  gradient.addColorStop(1, "rgba(245, 158, 11, 0.82)");

  context.fillStyle = "rgba(3, 7, 18, 0.72)";
  context.strokeStyle = gradient;
  context.lineWidth = 2;
  roundRect(context, 28, 38, width - 56, 88, 44);
  context.fill();
  context.stroke();

  context.shadowColor = "rgba(56, 189, 248, 0.7)";
  context.shadowBlur = 20;
  context.fillStyle = "#f8fafc";
  context.font = label.length > 12 ? "700 38px Inter, Arial, sans-serif" : "800 46px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, width / 2, 82);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function createTechOrbit() {
  const group = new THREE.Group(); // ← keep this line
  const disposables = [];

  techStack.forEach((label, index) => {
    const texture = createTechLabelTexture(label);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const width = label.length > 12 ? 2.25 : 1.65;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.58), material);
    const angle = (index / techStack.length) * Math.PI * 2;

    mesh.position.set(Math.cos(angle) * 8.2, Math.sin(angle * 2) * 0.38, Math.sin(angle) * 3.8);
    mesh.userData = {
      angle,
      radiusX: 8.2,
      radiusZ: 3.8,
      phase: index * 0.73,
    };
    group.add(mesh);
    disposables.push(texture, material, mesh.geometry);
  });

  group.rotation.x = -0.3;
  group.position.y = -0.15;
  group.userData.dispose = () => {
    disposables.forEach((item) => item.dispose?.());
  };

  return group;
}

function createHeroParticles(count = 1100) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const stride = i * 3;
    positions[stride] = (Math.random() - 0.5) * 26;
    positions[stride + 1] = (Math.random() - 0.5) * 15;
    positions[stride + 2] = (Math.random() - 0.5) * 16;

    color.setHSL(Math.random() > 0.78 ? 0.56 : 0.61, 0.8, 0.74);
    colors[stride] = color.r;
    colors[stride + 1] = color.g;
    colors[stride + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.035,
    transparent: true,
    opacity: 0.62,
    vertexColors: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  points.userData.dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return points;
}

function createParticleField(count = 900) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const stride = i * 3;
    positions[stride] = (Math.random() - 0.5) * 42;
    positions[stride + 1] = (Math.random() - 0.5) * 22;
    positions[stride + 2] = (Math.random() - 0.5) * 110;

    color.setHSL((i / count) * 0.65 + 0.08, 0.78, 0.62);
    colors[stride] = color.r;
    colors[stride + 1] = color.g;
    colors[stride + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.055,
    transparent: true,
    opacity: 0.7,
    vertexColors: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  points.userData.dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return points;
}

async function createRenderer(canvas) {
  try {
    const webgpu = await import("three/webgpu");
    const WebGPURenderer = webgpu.WebGPURenderer;

    if (WebGPURenderer && navigator.gpu) {
      const renderer = new WebGPURenderer({ canvas, antialias: true, alpha: true });
      await renderer.init?.();
      return renderer;
    }
  } catch (error) {
    console.info("WebGPU renderer unavailable; falling back to WebGL.", error);
  }

  return new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
}

export async function createPortfolioScene({ canvas, projects, profile }) {
  const renderer = await createRenderer(canvas);
  renderer.setClearColor(0x030712, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030712, 0.025);

  const cameraRig = new THREE.Object3D();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 160);
  camera.position.set(0, 0, 15);
  cameraRig.add(camera);
  scene.add(cameraRig);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(5, 7, 8);
  scene.add(ambientLight, directionalLight);

  const particles = createParticleField();
  scene.add(particles);

  const heroGroup = new THREE.Group();
  const workGroup = new THREE.Group();
  const aboutGroup = new THREE.Group();
  const contactGroup = new THREE.Group();
  scene.add(heroGroup, workGroup, aboutGroup, contactGroup);

  const heroParticles = createHeroParticles();
  const techOrbit = createTechOrbit();
  heroGroup.add(heroParticles, techOrbit); // grid removed

  const projectCarousel = createProjectCarousel(THREE, projects);
  projectCarousel.position.z = -3;
  workGroup.add(
    createTextPlane(
      [{ text: "Selected Work", y: 390, font: "800 92px Inter, Arial, sans-serif", color: "#ffffff" }],
      12,
      5.5
    )
  );
  workGroup.add(projectCarousel);

  const aboutShape = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.1, 2),
    new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      roughness: 0.34,
      metalness: 0.42,
      transparent: true,
      opacity: 0.68,
      wireframe: true,
    })
  );
  aboutShape.position.set(-4.8, 0, -1);
  aboutGroup.add(aboutShape);
  aboutGroup.add(
    createTextPlane(
      [
        { text: "About", y: 250, font: "900 92px Inter, Arial, sans-serif", color: "#ffffff" },
        { text: "Creative frontend, full-stack systems, and applied ML.", y: 390, font: "600 36px Inter, Arial, sans-serif", color: "#d1d5db" },
        { text: "Interfaces with depth. Code with a job to do.", y: 456, font: "500 30px Inter, Arial, sans-serif", color: "#94a3b8" },
      ],
      13,
      6
    )
  );

  contactGroup.add(
    createTextPlane(
      [
        { text: "Let's Build", y: 290, font: "900 108px Inter, Arial, sans-serif", color: "#ffffff" },
        { text: profile.contact.github.replace("https://", ""), y: 430, font: "600 38px Inter, Arial, sans-serif", color: "#f59e0b" },
        { text: profile.contact.email, y: 500, font: "500 34px Inter, Arial, sans-serif", color: "#d1d5db" },
      ],
      13,
      6
    )
  );

  const state = {
    renderer,
    scene,
    camera,
    cameraRig,
    heroGroup,
    workGroup,
    aboutGroup,
    contactGroup,
    projectCarousel,
    aboutShape,
    heroParticles,
    techOrbit,
    sections: [
      { group: heroGroup },
      { group: aboutGroup },
      { group: workGroup },
      { group: contactGroup },
    ],
    mouse: { x: 0, y: 0 },
    scroll: 0,
  };

  applyScrollAnimation(state, 0);

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  };
  window.addEventListener("resize", resize);

  return {
    updateScroll(progress) {
      state.scroll = progress;
      applyScrollAnimation(state, progress);
    },
    updateMouse(mouse) {
      state.mouse = mouse;
    },
    render(time = 0) {
      particles.rotation.y = time * 0.000025;
      heroParticles.rotation.y = time * 0.000035;
      heroParticles.position.x += (state.mouse.x * 0.3 - heroParticles.position.x) * 0.03;
      heroParticles.position.y += (state.mouse.y * 0.18 - heroParticles.position.y) * 0.03;
      techOrbit.rotation.y += 0.0022;
      techOrbit.rotation.x += (-0.3 + state.mouse.y * 0.035 - techOrbit.rotation.x) * 0.04;
      techOrbit.rotation.z += (state.mouse.x * 0.045 - techOrbit.rotation.z) * 0.04;
      techOrbit.children.forEach((child) => {
        if (!child.userData?.radiusX) return;

        const angle = child.userData.angle + time * 0.00022;
        child.position.x = Math.cos(angle) * child.userData.radiusX;
        child.position.z = Math.sin(angle) * child.userData.radiusZ;
        child.position.y = Math.sin(time * 0.001 + child.userData.phase) * 0.36;
        child.lookAt(camera.position.x, camera.position.y, camera.position.z);
      });
      projectCarousel.children.forEach((card, index) => {
        card.position.y += (Math.sin(time * 0.001 + index) * 0.45 - card.position.y) * 0.015;
      });
      aboutShape.rotation.x += 0.0025;
      aboutShape.rotation.y += 0.0035;
      applyMouseAnimation(state, state.mouse);
      renderer.render(scene, camera);
    },
    dispose() {
      window.removeEventListener("resize", resize);
      scene.traverse((object) => object.userData?.dispose?.());
      aboutShape.geometry.dispose();
      aboutShape.material.dispose();
      renderer.dispose?.();
    },
  };
}