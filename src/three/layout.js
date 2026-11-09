// World layout shared between 3D components.

export const RACK = { W: 1.5, H: 3.2, D: 1.1 };

/** Seven server racks on a gentle arc, facing the camera. */
export const RACKS = Array.from({ length: 7 }, (_, i) => {
  const th = -0.54 + i * 0.18;
  return { position: [9 * Math.sin(th), -2, -9 + 9 * Math.cos(th)], rot: th };
});

/** Spheres whose union forms the particle cloud: [x, y, z, radius]. */
export const CLOUD_BLOBS = [
  [0, 8.6, -3, 2.6], [-2.6, 8.2, -3, 2.0], [2.7, 8.3, -3, 2.1], [-4.7, 7.8, -3, 1.4],
  [4.8, 7.9, -3, 1.4], [0, 9.9, -3.4, 1.9], [1.5, 7.7, -1.7, 1.6], [-1.6, 7.7, -1.9, 1.6],
];

export const SHIELD = { center: [0, 1.5, -1], radius: 12.5 };

export const PIPELINE_STAGES = ['PLAN', 'CODE', 'BUILD', 'TEST', 'RELEASE', 'DEPLOY', 'OPERATE', 'MONITOR'];

export const BAR_HEIGHTS = [3.0, 2.95, 2.72, 2.5, 2.25, 2.02, 1.86, 1.74];

/** Camera [position, target] per stage: hero, data, cloud, CI/CD, shield, FinOps, finale. */
export const CAMERA_KEYS = [
  [[0, 3, 24], [0, 5, 0]],
  [[0, 7.5, 15], [0, -2, -1]],
  [[10, 5, 14], [0, 3, -1.5]],
  [[-8, 11, 12], [0, 2.8, 0]],
  [[2, 10, 30], [0, 3, -1]],
  [[5.5, 2.6, 17], [0, 0.4, 4.5]],
  [[0, 12, 32], [0, 2.5, -1]],
];

/** Horizontal scene shift per stage so the 3D focus sits opposite the text card. */
export const SIDE_SHIFT = [0.16, -0.16, 0.16, -0.16, 0.16, -0.16, 0];
