import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_KEYS, SIDE_SHIFT } from './layout';
import { scrollState } from '../lib/scroll';
import { clamp, ease, lerp, smooth } from '../lib/math';

const LAST = CAMERA_KEYS.length - 1;

/** Flies the camera along a spline through the stage keyframes, with mouse parallax. */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const paths = useMemo(() => ({
    pos: new THREE.CatmullRomCurve3(CAMERA_KEYS.map(([p]) => new THREE.Vector3(...p))),
    tgt: new THREE.CatmullRomCurve3(CAMERA_KEYS.map(([, t]) => new THREE.Vector3(...t))),
    p: new THREE.Vector3(),
    t: new THREE.Vector3(),
  }), []);

  useEffect(() => {
    // Listen on window: the HTML overlay sits above the canvas.
    const onMove = (e) => {
      mouse.current.tx = e.clientX / window.innerWidth - 0.5;
      mouse.current.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state) => {
    const s = scrollState.cur, time = state.clock.elapsedTime;
    const { p, t } = paths;
    const k = clamp(s / LAST);
    paths.pos.getPoint(k, p);
    paths.tgt.getPoint(k, t);

    // gentle orbit in the finale, faint sway in the hero
    const orbit = ease(s, 5.4, 6.0) * Math.sin(time * 0.12) * 0.45 + (1 - ease(s, 0, 0.6)) * Math.sin(time * 0.25) * 0.04;
    if (orbit) {
      const dx = p.x - t.x, dz = p.z - t.z, c = Math.cos(orbit), sn = Math.sin(orbit);
      p.x = t.x + dx * c - dz * sn;
      p.z = t.z + dx * sn + dz * c;
    }

    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.04;
    m.y += (m.ty - m.y) * 0.04;
    camera.position.set(p.x + m.x * 1.2, p.y - m.y * 0.7, p.z);
    camera.lookAt(t);

    const W = size.width, H = size.height;
    const fov = W / H < 0.8 ? 62 : 45;
    if (camera.fov !== fov) camera.fov = fov;
    if (W < 860) {
      camera.setViewOffset(W, H, 0, H * 0.14, W, H); // phones: lift the scene above the bottom card
    } else {
      const i = Math.min(Math.floor(s), LAST - 1);
      const side = lerp(SIDE_SHIFT[i], SIDE_SHIFT[i + 1], smooth(clamp(s - i)));
      camera.setViewOffset(W, H, -side * W, 0, W, H);
    }
  });

  return null;
}
