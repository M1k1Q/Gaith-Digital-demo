import { seg, smooth } from './math';

/**
 * Shared, mutable scroll state read by every 3D component inside useFrame.
 * `raw`  — stage index from the scroll position (0 = hero … 6 = contact), fractional between sections.
 * `cur`  — smoothed, "plateaued" stage the scene actually animates to.
 * Kept outside React state on purpose: it changes every frame and must not trigger re-renders.
 */
export const scrollState = { raw: 0, cur: 0 };

let panels = [];
let centers = [];

export function registerPanels(els) {
  panels = els.filter(Boolean);
  measure();
}

export function measure() {
  centers = panels.map((p) => {
    const r = p.getBoundingClientRect();
    return r.top + window.scrollY + r.height / 2;
  });
}

/** Stage `i` is reached when section `i` is centred in the viewport. */
export function rawStage() {
  if (!centers.length) return 0;
  const c = window.scrollY + window.innerHeight / 2;
  if (c <= centers[0]) return 0;
  for (let i = 0; i < centers.length - 1; i++) {
    if (c < centers[i + 1]) return i + (c - centers[i]) / (centers[i + 1] - centers[i]);
  }
  return centers.length - 1;
}

/** Hold the scene still while a section is being read; animate between sections. */
export const plateau = (s) => {
  const i = Math.floor(s);
  return i + smooth(seg(s - i, 0.18, 0.82));
};
