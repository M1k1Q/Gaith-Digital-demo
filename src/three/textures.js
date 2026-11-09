import * as THREE from 'three';

let glow;
/** Soft round sprite used for data packets. */
export function getGlowTexture() {
  if (glow) return glow;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.25, 'rgba(255,255,255,.75)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  glow = new THREE.CanvasTexture(c);
  glow.colorSpace = THREE.SRGBColorSpace;
  return glow;
}

/** Pill-shaped text label as a camera-facing sprite (starts fully transparent). */
export function makeLabel(text, color = '#c9f4ff', border = 'rgba(94,230,255,.55)') {
  const fs = 46, padX = 26, h = 84;
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  g.font = `600 ${fs}px Sora, sans-serif`;
  c.width = Math.ceil(g.measureText(text).width) + padX * 2;
  c.height = h;
  g.font = `600 ${fs}px Sora, sans-serif`; // canvas resize resets context state
  g.fillStyle = 'rgba(5,12,22,.78)';
  g.strokeStyle = border;
  g.lineWidth = 3;
  g.beginPath();
  g.roundRect(2, 2, c.width - 4, h - 4, 20);
  g.fill();
  g.stroke();
  g.fillStyle = color;
  g.textBaseline = 'middle';
  g.fillText(text, padX, h / 2 + 3);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, fog: false })
  );
  const sh = 0.46;
  sprite.scale.set((sh * c.width) / h, sh, 1);
  return sprite;
}

/** Front panel of a server rack: eight units with vents. */
export function makeRackTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#0a1220';
  g.fillRect(0, 0, 256, 512);
  for (let u = 0; u < 8; u++) {
    const y = 16 + u * 60;
    g.fillStyle = '#0f1b2e';
    g.fillRect(12, y, 232, 52);
    g.strokeStyle = '#21405f';
    g.lineWidth = 2;
    g.strokeRect(12, y, 232, 52);
    g.strokeStyle = '#18304a';
    g.lineWidth = 3;
    for (let k = 0; k < 9; k++) {
      g.beginPath();
      g.moveTo(26 + k * 12, y + 10);
      g.lineTo(26 + k * 12, y + 42);
      g.stroke();
    }
    g.fillStyle = '#16304d';
    g.fillRect(140, y + 18, 34, 16);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
