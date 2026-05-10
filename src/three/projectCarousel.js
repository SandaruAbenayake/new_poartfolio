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

// ── Info panel: title + description rendered below the media ──
function createInfoPanelTexture(project) {
  const cw = 700;
  const ch = 260;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = cw * pixelRatio;
  canvas.height = ch * pixelRatio;

  const ctx = canvas.getContext("2d");
  ctx.scale(pixelRatio, pixelRatio);

  ctx.fillStyle = "rgba(3, 7, 18, 0.92)";
  ctx.fillRect(0, 0, cw, ch);
  ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, cw - 2, ch - 2);

  // Title
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "700 30px 'Inter', 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 4;
  ctx.fillText(project.title, 22, 22);

  // Description — word-wrapped
  ctx.font = "400 20px 'Inter', 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.shadowBlur = 0;

  const words = (project.description || "").split(" ");
  const maxW = cw - 44;
  let line = "";
  let y = 72;
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
  const techs = project.tags || (project.tech || "").split(",").map((t) => t.trim());
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

  // Project link hint bottom-right
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
    new THREERef.PlaneGeometry(8.4, 1.38),
    material
  );

  // Keep the heading close to the active project card.
  mesh.position.set(0, 2.9, 0);

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
  const disposables = [];
  const spacing = 5.05;
  const maxIndex = Math.max(projects.length - 1, 0);
  let currentIndex = 0;
  let targetIndex = 0;
  let isEnabled = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStarted = false;
  let dragMoved = false;

  // "Projects" heading above the horizontal carousel
  const heading = createHeadingMesh(THREERef);
  group.add(heading);
  disposables.push(heading.material.map, heading.material, heading.geometry);

  const cards = [];

  projects.forEach((project, index) => {
    // Media card
    const mediaTex = createMediaTexture(project);
    const mediaMat = new THREERef.MeshBasicMaterial({
      map: mediaTex,
      transparent: true,
      side: THREERef.DoubleSide,
    });
    const geo = new THREERef.PlaneGeometry(4.15, 2.6);
    const card = new THREERef.Mesh(geo, mediaMat);
    const cardGroup = new THREERef.Group();

    card.position.set(0, 0.56, 0);
    card.userData = { project, index };

    // Info panel sits below the media, keeping the video/photo unobstructed.
    const panelTex = createInfoPanelTexture(project);
    const panelMat = new THREERef.MeshBasicMaterial({
      map: panelTex,
      transparent: true,
      depthWrite: false,
      side: THREERef.DoubleSide,
    });
    const panelGeo = new THREERef.PlaneGeometry(4.15, 1.34);
    const panel = new THREERef.Mesh(panelGeo, panelMat);
    panel.position.set(0, -1.43, 0.01);
    panel.userData = { isInfoPanel: true, project, index };

    cardGroup.add(card, panel);
    cardGroup.position.x = index * spacing;
    cardGroup.userData = { project, index };

    group.add(cardGroup);
    cards.push(cardGroup);

    disposables.push(mediaTex, mediaMat, geo, panelTex, panelMat, panelGeo);
  });

  function setTarget(index) {
    targetIndex = THREERef.MathUtils.clamp(index, 0, maxIndex);
  }

  function moveBy(delta) {
    setTarget(targetIndex + delta);
  }

  function animate(time = 0) {
    currentIndex += (targetIndex - currentIndex) * 0.12;
    const cardCount = Math.max(cards.length, 1);
    const sectionOpacity = group.parent?.userData?.sectionOpacity ?? 1;

    cards.forEach((cardGroup, index) => {
      const offset = index - currentIndex;
      const distance = Math.abs(offset);
      cardGroup.position.x = offset * spacing;
      cardGroup.position.y =
        Math.sin(time * 0.001 + index * ((Math.PI * 2) / cardCount)) * 0.06;
      cardGroup.position.z = -distance * 0.34;
      cardGroup.rotation.y = -offset * 0.08;
      cardGroup.scale.setScalar(THREERef.MathUtils.clamp(1 - distance * 0.12, 0.7, 1));

      cardGroup.traverse((child) => {
        if (!child.material) return;
        child.material.opacity =
          THREERef.MathUtils.clamp(1 - distance * 0.32, 0.18, 1) * sectionOpacity;
        child.material.transparent = true;
      });
    });
  }

  // ── Raycaster for click → open project link ────────────────────────
  const raycaster = new THREERef.Raycaster();
  const _mouse = new THREERef.Vector2();
  let _canvas = null;

  function shouldIgnoreDomTarget(target) {
    return target?.closest?.(".project-carousel-control");
  }

  function setMouseFromEvent(event) {
    if (!_canvas) return false;
    const rect = _canvas.getBoundingClientRect();
    _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    return true;
  }

  function onCardClick(event) {
    if (!isEnabled || shouldIgnoreDomTarget(event.target) || dragMoved) return;
    if (!setMouseFromEvent(event)) return;
    raycaster.setFromCamera(_mouse, camera);

    const hits = raycaster.intersectObjects(cards, true);
    if (hits.length > 0) {
      const { project } = hits[0].object.userData;
      const link = project?.url || project?.github;
      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
      }
    }
  }

  function onMouseMove(event) {
    if (!_canvas || !isEnabled || shouldIgnoreDomTarget(event.target)) {
      if (_canvas) _canvas.style.cursor = "default";
      return;
    }
    if (!setMouseFromEvent(event)) return;
    raycaster.setFromCamera(_mouse, camera);
    const hits = raycaster.intersectObjects(cards, true);
    _canvas.style.cursor = hits.length > 0 ? "pointer" : "default";
  }

  function onPointerDown(event) {
    if (!isEnabled || shouldIgnoreDomTarget(event.target)) return;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragStarted = true;
    dragMoved = false;
  }

  function onPointerMove(event) {
    if (!dragStarted) return;
    const dx = event.clientX - dragStartX;
    const dy = event.clientY - dragStartY;
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    moveBy(dx < 0 ? 1 : -1);
    dragMoved = true;
    dragStarted = false;
  }

  function onPointerUp() {
    dragStarted = false;
    window.setTimeout(() => {
      dragMoved = false;
    }, 0);
  }

  // Call this once you have a reference to the renderer canvas
  function attachClickListener(canvas) {
    if (_canvas === canvas) return;
    if (_canvas) {
      window.removeEventListener("click", onCardClick);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }
    _canvas = canvas;
    window.addEventListener("click", onCardClick);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  group.userData.dispose = () => {
    if (_canvas) {
      window.removeEventListener("click", onCardClick);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }
    disposables.forEach((item) => item.dispose?.());
  };

  // Expose so scene.js can wire it up
  group.userData.attachClickListener = attachClickListener;
  group.userData.animate = animate;
  group.userData.next = () => moveBy(1);
  group.userData.prev = () => moveBy(-1);
  group.userData.setEnabled = (enabled) => {
    isEnabled = enabled;
    if (!enabled) {
      dragStarted = false;
      if (_canvas) _canvas.style.cursor = "default";
    }
  };
  group.userData.getState = () => ({ currentIndex: targetIndex, maxIndex });

  return group;
}
