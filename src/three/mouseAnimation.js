export function applyMouseAnimation(state, mouse) {
  state.cameraRig.rotation.y += (mouse.x * 0.11 - state.cameraRig.rotation.y) * 0.08;
  state.cameraRig.rotation.x += (-mouse.y * 0.075 - state.cameraRig.rotation.x) * 0.08;
  state.projectCarousel.position.x += (mouse.x * 0.75 - state.projectCarousel.position.x) * 0.06;
  state.aboutShape.rotation.x += mouse.y * 0.0025;
  state.aboutShape.rotation.y += mouse.x * 0.0025;
}
