import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────
// One card face: image strip on top, title + description + tech chips below.
// Same texture used on front AND back so both sides look identical.
// ─────────────────────────────────────────────────────────────────────
function createCardTexture(project) {
  const cw = 840;
  const ch = 520;
  const pr = Math.min(window.devicePixelRatio || 1, 2);

  const canvas  = document.createElement("canvas");
  canvas.width  = cw * pr;
  canvas.height = ch * pr;
  const ctx     = canvas.getContext("2d");
  ctx.scale(pr, pr);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const pad   = 18;
  const imgY  = 8;
  const imgH  = 230;
  const infoY = imgY + imgH + 16;

  // ── Helpers ─────────────────────────────────────────────────────────
  function paintBackground() {
    const bg = ctx.createLinearGradient(0, 0, 0, ch);
    bg.addColorStop(0, "#0f172a");
    bg.addColorStop(1, "#1e293b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cw, ch);

    const bar = ctx.createLinearGradient(0, 0, cw, 0);
    bar.addColorStop(0, "#38bdf8");
    bar.addColorStop(1, "#818cf8");
    ctx.fillStyle = bar;
    ctx.fillRect(0, 0, cw, 5);
  }

  function paintImagePlaceholder() {
    ctx.fillStyle = "#1e3a5f";
    ctx.beginPath();
    ctx.roundRect(pad, imgY, cw - pad * 2, imgH, 10);
    ctx.fill();
  }

  function paintText() {
    // Title
    ctx.textAlign    = "left";
    ctx.textBaseline = "top";
    ctx.font         = "700 30px Inter, Arial, sans-serif";
    ctx.fillStyle    = "#f1f5f9";
    ctx.shadowColor  = "rgba(0,0,0,0.9)";
    ctx.shadowBlur   = 5;
    ctx.fillText(project.title || "Untitled", pad, infoY);
    ctx.shadowBlur   = 0;

    // Description word-wrap
    ctx.font      = "400 19px Inter, Arial, sans-serif";
    ctx.fillStyle = "#94a3b8";
    const words   = (project.description || "").split(" ");
    const maxW    = cw - pad * 2;
    let   line    = "";
    let   y       = infoY + 44;
    const lineH   = 27;
    words.forEach((word, i) => {
      const test = line + (line ? " " : "") + word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, pad, y);
        line = word;
        y   += lineH;
      } else {
        line = test;
      }
      if (i === words.length - 1) ctx.fillText(line, pad, y);
    });

    // Tech chips
    y += lineH + 14;
    ctx.font = "600 15px Inter, Arial, sans-serif";
    const techs = (project.tech || "").split(",").map(t => t.trim());
    let x = pad;
    const chipH = 26, chipPad = 11;
    techs.forEach(tech => {
      const w = ctx.measureText(tech).width + chipPad * 2;
      if (x + w > cw - pad) return;
      ctx.fillStyle = "rgba(56,189,248,0.14)";
      ctx.beginPath();
      ctx.roundRect(x, y, w, chipH, 5);
      ctx.fill();
      ctx.strokeStyle = "rgba(56,189,248,0.45)";
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, w, chipH, 5);
      ctx.stroke();
      ctx.fillStyle    = "#38bdf8";
      ctx.textBaseline = "middle";
      ctx.fillText(tech, x + chipPad, y + chipH / 2);
      x += w + 8;
    });

    // GitHub hint
    ctx.font         = "500 15px Inter, Arial, sans-serif";
    ctx.fillStyle    = "rgba(255,255,255,0.38)";
    ctx.textAlign    = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("↗ Click to open GitHub", cw - pad, ch - 10);

    tex.needsUpdate = true;
  }

  // ── Compose ─────────────────────────────────────────────────────────
  paintBackground();
  paintImagePlaceholder();

  if (project.video) {
    // Video placeholder icon
    ctx.fillStyle    = "#0ea5e9";
    ctx.font         = "500 56px Arial";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("▶", cw / 2, imgY + imgH / 2 - 10);
    ctx.font      = "500 18px Inter, Arial, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Video Project", cw / 2, imgY + imgH / 2 + 36);
    paintText();
  } else if (project.image) {
    // Draw text immediately (shows while image loads)
    paintText();

    // Then load image and redraw on top
    const img       = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      paintBackground();

      const scaleX = (cw - pad * 2) / img.width;
      const scaleY = imgH / img.height;
      const scale  = Math.max(scaleX, scaleY);
      const sw     = img.width  * scale;
      const sh     = img.height * scale;
      const sx     = pad  + ((cw - pad * 2) - sw) / 2;
      const sy     = imgY + (imgH - sh) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pad, imgY, cw - pad * 2, imgH, 10);
      ctx.clip();
      ctx.drawImage(img, sx, sy, sw, sh);
      ctx.restore();

      paintText();
    };
    img.onerror = () => {
      ctx.fillStyle    = "#38bdf8";
      ctx.font         = "600 26px Inter, Arial, sans-serif";
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(project.title || "", cw / 2, imgY + imgH / 2);
      paintText();
    };
    img.src = project.image;
  } else {
    paintText();
  }

  return tex;
}

// ─────────────────────────────────────────────────────────────────────
// Gradient "Projects" heading plane above the ring
// ─────────────────────────────────────────────────────────────────────
function createHeadingMesh(THREERef) {
  const cw = 1200, ch = 200;
  const pr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas  = document.createElement("canvas");
  canvas.width  = cw * pr;
  canvas.height = ch * pr;
  const ctx     = canvas.getContext("2d");
  ctx.scale(pr, pr);
  ctx.clearRect(0, 0, cw, ch);
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.font         = "800 110px Inter, Arial, sans-serif";
  const grad = ctx.createLinearGradient(0, 0, cw, 0);
  grad.addColorStop(0, "#38bdf8");
  grad.addColorStop(1, "#818cf8");
  ctx.fillStyle = grad;
  ctx.fillText("Projects", cw / 2, ch / 2);

  const texture  = new THREERef.CanvasTexture(canvas);
  texture.colorSpace = THREERef.SRGBColorSpace;
  const material = new THREERef.MeshBasicMaterial({
    map: texture, transparent: true, depthWrite: false,
  });
  const mesh = new THREERef.Mesh(new THREERef.PlaneGeometry(10, 1.65), material);
  mesh.position.set(0, 5.4, 0);
  mesh.userData.dispose = () => {
    texture.dispose(); material.dispose(); mesh.geometry.dispose();
  };
  return mesh;
}

// ─────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────
export function createProjectCarousel(THREERef, projects, camera) {
  const group       = new THREERef.Group();
  const radius      = 8;
  const disposables = [];

  const heading = createHeadingMesh(THREERef);
  group.add(heading);
  disposables.push(heading.material.map, heading.material, heading.geometry);

  // Landscape slab — W > H, very thin
  const W = 4.6;
  const H = 2.88;
  const D = 0.10;

  const cards = [];

  projects.forEach((project, index) => {
    const angle = (index / projects.length) * Math.PI * 2;

    // Front (+Z) and back (-Z) both use the same full-detail texture
    const texFront = createCardTexture(project);
    const texBack  = createCardTexture(project);
    disposables.push(texFront, texBack);

    const edgeMat  = new THREERef.MeshBasicMaterial({ color: 0x1e293b });
    const matFront = new THREERef.MeshBasicMaterial({
      map: texFront, transparent: true, side: THREERef.FrontSide,
    });
    const matBack  = new THREERef.MeshBasicMaterial({
      map: texBack,  transparent: true, side: THREERef.FrontSide,
    });
    disposables.push(edgeMat, matFront, matBack);

    const geo = new THREERef.BoxGeometry(W, H, D);
    disposables.push(geo);

    // BoxGeometry face order: +X, -X, +Y, -Y, +Z(front), -Z(back)
    const box = new THREERef.Mesh(geo, [
      edgeMat, edgeMat, edgeMat, edgeMat, matFront, matBack,
    ]);

    box.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );

    // lookAt(0,0,0) → -Z faces centre
    // +Math.PI      → +Z (front) now faces OUTWARD, -Z (back) faces inward
    // Both textures identical, so either side looks the same to the viewer
    box.lookAt(0, 0, 0);
    box.rotation.y += Math.PI;

    box.userData = { angle, project, index };
    group.add(box);
    cards.push(box);
  });

  // ── Raycaster ────────────────────────────────────────────────────────
  const raycaster = new THREERef.Raycaster();
  const _mouse    = new THREERef.Vector2();
  let   _canvas   = null;

  function getHits(event) {
    const rect = _canvas.getBoundingClientRect();
    _mouse.x   =  ((event.clientX - rect.left) / rect.width)  * 2 - 1;
    _mouse.y   = -((event.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(_mouse, camera);
    return raycaster.intersectObjects(cards, false);
  }

  function onCardClick(event) {
    const hits = getHits(event);
    if (hits.length > 0) {
      const { project } = hits[0].object.userData;
      if (project?.github) window.open(project.github, "_blank", "noopener,noreferrer");
    }
  }

  function onMouseMove(event) {
    if (!_canvas) return;
    _canvas.style.cursor = getHits(event).length > 0 ? "pointer" : "default";
  }

  function attachClickListener(canvas) {
    if (_canvas === canvas) return;
    if (_canvas) {
      _canvas.removeEventListener("click",     onCardClick);
      _canvas.removeEventListener("mousemove", onMouseMove);
    }
    _canvas = canvas;
    _canvas.addEventListener("click",     onCardClick);
    _canvas.addEventListener("mousemove", onMouseMove);
  }

  group.userData.dispose = () => {
    if (_canvas) {
      _canvas.removeEventListener("click",     onCardClick);
      _canvas.removeEventListener("mousemove", onMouseMove);
    }
    disposables.forEach(item => item?.dispose?.());
    heading.userData.dispose?.();
  };

  group.userData.attachClickListener = attachClickListener;

  return group;
}