import * as THREE from "three";

// 🎥 / 🖼 Create texture (image OR video)
function createMediaTexture(project) {
  if (project.video) {
    const video = document.createElement("video");
    video.src = project.video;
    video.loop = true;
    video.muted = true;
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const loader = new THREE.TextureLoader();
  const texture = loader.load(project.image || "/images/default.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ── Info overlay: title + description rendered onto a canvas texture ──
function createInfoOverlayTexture(project) {
  const cw = 700;
  const ch = 440;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = cw * pixelRatio;
  canvas.height = ch * pixelRatio;

  const ctx = canvas.getContext("2d");
  ctx.scale(pixelRatio, pixelRatio);

  // Semi-transparent dark gradient backdrop (bottom half of card)
  const grad = ctx.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, "rgba(3, 7, 18, 0)");
  grad.addColorStop(0.38, "rgba(3, 7, 18, 0.72)");
  grad.addColorStop(1, "rgba(3, 7, 18, 0.97)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);

  // Title
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "700 30px 'Inter', 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 6;
  ctx.fillText(project.title, 22, ch * 0.52);

  // Description — word-wrapped
  ctx.font = "400 20px 'Inter', 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.shadowBlur = 4;

  const words = (project.description || "").split(" ");
  const maxW = cw - 44;
  let line = "";
  let y = ch * 0.52 + 42;
  const lineH = 28;

  words.forEach((word, i) => {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, 22, y);
      line = word;
      y += lineH;
    } else {
      line = test;
    }
    if (i === words.length - 1) ctx.fillText(line, 22, y);
  });

  // Tech chips row
  y += lineH + 10;
  ctx.font = "600 16px 'Inter', 'Segoe UI', Arial, sans-serif";
  const techs = (project.tech || "").split(",").map((t) => t.trim());
  let x = 22;
  const chipH = 24;
  const padX = 10;
  techs.forEach((tech) => {
    const w = ctx.measureText(tech).width + padX * 2;
    if (x + w > cw - 22) return;
    ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, chipH, 6);
    ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.shadowBlur = 0;
    ctx.fillText(tech, x + padX, y + 4);
    x += w + 8;
  });

  // GitHub arrow hint bottom-right
  ctx.font = "500 17px 'Inter', 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.textAlign = "right";
  ctx.fillText("↗ GitHub", cw - 22, ch - 26);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// ── "Projects" heading rendered as a canvas mesh, sits above the orbit ──
function createHeadingMesh(THREERef) {
  const cw = 1200;
  const ch = 200;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = cw * pixelRatio;
  canvas.height = ch * pixelRatio;

  const ctx = canvas.getContext("2d");
  ctx.scale(pixelRatio, pixelRatio);
  ctx.clearRect(0, 0, cw, ch);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 110px 'Inter', 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Projects", cw / 2, ch / 2);

  const texture = new THREERef.CanvasTexture(canvas);
  texture.colorSpace = THREERef.SRGBColorSpace;

  const material = new THREERef.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREERef.Mesh(
    new THREERef.PlaneGeometry(10, 1.65),
    material
  );

  // Centred above the orbit ring
  mesh.position.set(0, 5.2, 0);

  mesh.userData.dispose = () => {
    texture.dispose();
    material.dispose();
    mesh.geometry.dispose();
  };

  return mesh;
}

// ── Main export ──────────────────────────────────────────────────────
export function createProjectCarousel(THREERef, projects, camera) {
  const group = new THREERef.Group();
  const radius = 8;
  const disposables = [];

  // "Projects" heading above the ring
  const heading = createHeadingMesh(THREERef);
  group.add(heading);
  disposables.push(heading.material.map, heading.material, heading.geometry);

  const cards = [];

  projects.forEach((project, index) => {
    const angle = (index / projects.length) * Math.PI * 2;

    // Media card
    const mediaTex = createMediaTexture(project);
    const mediaMat = new THREERef.MeshBasicMaterial({
      map: mediaTex,
      transparent: true,
      side: THREERef.DoubleSide,
    });
    const geo = new THREERef.PlaneGeometry(3.5, 2.2);
    const card = new THREERef.Mesh(geo, mediaMat);

    card.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    card.userData = { angle, project, index };

    // Info overlay (child of card so it orbits with it)
    const overlayTex = createInfoOverlayTexture(project);
    const overlayMat = new THREERef.MeshBasicMaterial({
      map: overlayTex,
      transparent: true,
      depthWrite: false,
      side: THREERef.DoubleSide,
    });
    const overlayGeo = new THREERef.PlaneGeometry(3.5, 2.2);
    const overlay = new THREERef.Mesh(overlayGeo, overlayMat);
    overlay.position.z = 0.005; // tiny offset to avoid z-fighting
    overlay.userData = { isOverlay: true, project };
    card.add(overlay);

    group.add(card);
    cards.push(card);

    disposables.push(mediaTex, mediaMat, geo, overlayTex, overlayMat, overlayGeo);
  });

  // ── Raycaster for click → open GitHub ─────────────────────────────
  const raycaster = new THREERef.Raycaster();
  const _mouse = new THREERef.Vector2();
  let _canvas = null;

  function onCardClick(event) {
    const rect = _canvas.getBoundingClientRect();
    _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(_mouse, camera);

    const hits = raycaster.intersectObjects(cards, false);
    if (hits.length > 0) {
      const { project } = hits[0].object.userData;
      if (project?.github) {
        window.open(project.github, "_blank", "noopener,noreferrer");
      }
    }
  }

  function onMouseMove(event) {
    const rect = _canvas.getBoundingClientRect();
    _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(_mouse, camera);
    const hits = raycaster.intersectObjects(cards, false);
    _canvas.style.cursor = hits.length > 0 ? "pointer" : "default";
  }

  // Call this once you have a reference to the renderer canvas
  function attachClickListener(canvas) {
    if (_canvas === canvas) return;
    if (_canvas) {
      _canvas.removeEventListener("click", onCardClick);
      _canvas.removeEventListener("mousemove", onMouseMove);
    }
    _canvas = canvas;
    _canvas.addEventListener("click", onCardClick);
    _canvas.addEventListener("mousemove", onMouseMove);
  }

  group.userData.dispose = () => {
    if (_canvas) {
      _canvas.removeEventListener("click", onCardClick);
      _canvas.removeEventListener("mousemove", onMouseMove);
    }
    disposables.forEach((item) => item.dispose?.());
  };

  // Expose so scene.js can wire it up
  group.userData.attachClickListener = attachClickListener;

  return group;
}