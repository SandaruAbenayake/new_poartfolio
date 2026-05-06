const sectionDepth = 30;

// ── Opacity helper ────────────────────────────────────────────────────
function setGroupOpacity(group, opacity) {
  const apply = (material) => {
    if (!material.transparent) material.transparent = true;
    if (material.userData.baseOpacity === undefined) {
      material.userData.baseOpacity =
        material.opacity !== undefined ? material.opacity : 1;
    }
    material.opacity = material.userData.baseOpacity * opacity;
    material.needsUpdate = true;
  };

  group.traverse((child) => {
    if (!child.material) return;
    if (Array.isArray(child.material)) {
      child.material.forEach(apply);
    } else {
      apply(child.material);
    }
  });
}

// ── Main ──────────────────────────────────────────────────────────────
// progress: 0.0 = hero  →  1.0 = contact
// sections: [heroGroup(0), aboutGroup(1), workGroup(2), contactGroup(3)]
export function applyScrollAnimation(state, progress) {
  // Ease in-out cubic
  const eased =
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  // Camera travels sectionDepth units per section (3 gaps for 4 sections)
  state.cameraRig.position.z = -eased * sectionDepth * 3;

  // Fixed world positions — never move
  state.heroGroup.position.z    =  0;
  state.aboutGroup.position.z   = -sectionDepth * 1;
  state.workGroup.position.z    = -sectionDepth * 2;
  state.contactGroup.position.z = -sectionDepth * 3;

  // ── Per-section fade + scale ─────────────────────────────────────────
  // scrollIndex goes 0 → 3 across the full scroll
  const scrollIndex = progress * 3; // (totalSections - 1)

  state.sections.forEach((section, index) => {
    const dist     = Math.abs(scrollIndex - index);        // 0 = current section
    const visible  = Math.max(0, 1 - dist / 0.85);        // tight fade window
    const opacity  = Math.pow(visible, 1.6);
    const scale    = 0.88 + visible * 0.12;

    section.group.scale.setScalar(scale);
    setGroupOpacity(section.group, opacity);
  });

  // NOTE: projectCarousel.rotation.y is driven by render() for continuous spin.
  // We intentionally do NOT touch it here to avoid fighting the render loop.
}