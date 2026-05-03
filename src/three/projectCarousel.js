import * as THREE from "three";

function createTextTexture(lines, options = {}) {
  const canvas = document.createElement("canvas");
  const width = 1024;
  const height = 640;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d");
  context.scale(pixelRatio, pixelRatio);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, options.startColor || "#0d9488");
  gradient.addColorStop(0.55, options.midColor || "#f43f5e");
  gradient.addColorStop(1, options.endColor || "#f59e0b");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(5, 10, 20, 0.72)";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(255, 255, 255, 0.22)";
  context.lineWidth = 3;
  context.strokeRect(24, 24, width - 48, height - 48);

  context.fillStyle = "#ffffff";
  context.textBaseline = "top";
  lines.forEach((line) => {
    context.font = line.font;
    context.fillStyle = line.color || "#ffffff";
    wrapText(context, line.text, line.x, line.y, line.maxWidth, line.lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let offsetY = 0;

  words.forEach((word, index) => {
    const testLine = `${line}${word} `;
    const metrics = context.measureText(testLine);

    if (metrics.width > maxWidth && index > 0) {
      context.fillText(line, x, y + offsetY);
      line = `${word} `;
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  });

  context.fillText(line, x, y + offsetY);
}

function createProjectTexture(project, index) {
  return createTextTexture(
    [
      {
        text: project.subtitle.toUpperCase(),
        x: 72,
        y: 74,
        maxWidth: 820,
        lineHeight: 34,
        font: "600 30px Inter, Arial, sans-serif",
        color: "rgba(255, 255, 255, 0.68)",
      },
      {
        text: project.title,
        x: 72,
        y: 134,
        maxWidth: 820,
        lineHeight: 68,
        font: "800 62px Inter, Arial, sans-serif",
      },
      {
        text: project.description,
        x: 72,
        y: 328,
        maxWidth: 810,
        lineHeight: 42,
        font: "500 34px Inter, Arial, sans-serif",
        color: "rgba(255, 255, 255, 0.82)",
      },
      {
        text: project.tags.join("  /  "),
        x: 72,
        y: 526,
        maxWidth: 820,
        lineHeight: 30,
        font: "600 26px Inter, Arial, sans-serif",
        color: "rgba(255, 255, 255, 0.62)",
      },
    ],
    {
      startColor: index % 3 === 0 ? "#0d9488" : "#2563eb",
      midColor: index % 3 === 1 ? "#e11d48" : "#7c3aed",
      endColor: index % 3 === 2 ? "#f59e0b" : "#22c55e",
    }
  );
}

export function createProjectCarousel(THREERef, projects) {
  const group = new THREERef.Group();
  const radius = 9;
  const geometry = new THREERef.PlaneGeometry(6.4, 4);
  const disposables = [geometry];

  projects.forEach((project, index) => {
    const texture = createProjectTexture(project, index);
    const material = new THREERef.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
      side: THREERef.DoubleSide,
    });
    const card = new THREERef.Mesh(geometry, material);
    const angle = (index / projects.length) * Math.PI * 2;

    card.position.set(Math.sin(angle) * radius, Math.cos(index * 1.7) * 0.7, Math.cos(angle) * radius);
    card.rotation.y = angle;
    card.userData.url = project.url;
    group.add(card);

    disposables.push(texture, material);
  });

  group.userData.dispose = () => {
    disposables.forEach((item) => item.dispose?.());
  };

  return group;
}
