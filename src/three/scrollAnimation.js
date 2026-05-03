const sectionDepth = 30;

function setGroupOpacity(group, opacity) {
  const applyMaterialOpacity = (material) => {
    if (material.userData.baseOpacity === undefined) {
      material.userData.baseOpacity = material.opacity;
    }

    material.opacity = material.userData.baseOpacity * opacity;
  };

  group.traverse((child) => {
    if (!child.material) return;

    if (Array.isArray(child.material)) {
      child.material.forEach(applyMaterialOpacity);
      return;
    }

    applyMaterialOpacity(child.material);
  });
}

export function applyScrollAnimation(state, progress) {
  const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  const travel = eased * sectionDepth * 3;

  state.cameraRig.position.z = -travel;
  state.heroGroup.position.z = 0;
  state.aboutGroup.position.z = -sectionDepth;
  state.workGroup.position.z = -sectionDepth * 2;
  state.contactGroup.position.z = -sectionDepth * 3;

  state.sections.forEach((section, index) => {
    const sectionProgress = Math.max(0, 1 - Math.abs(progress * 3 - index) * 1.18);
    const opacity = Math.pow(sectionProgress, 1.8);

    section.group.scale.setScalar(0.86 + sectionProgress * 0.14);
    setGroupOpacity(section.group, opacity);
  });

  state.projectCarousel.rotation.y = progress * Math.PI * 2 + Math.sin(progress * Math.PI) * 0.3;
}
