import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RACK, RACKS } from './layout';
import { makeRackTexture } from './textures';
import { scrollState } from '../lib/scroll';
import { ease } from '../lib/math';

const LEDS_PER_RACK = 24; // 8 units × 3 status lights
const LED_COLORS = [
  new THREE.Color(0x2de2c4).multiplyScalar(2.2),
  new THREE.Color(0x5ee6ff).multiplyScalar(2.2),
  new THREE.Color(0xffb35c).multiplyScalar(2),
  new THREE.Color(0x0a2a2a), // off
];
const randomLed = (amberChance = 0) =>
  LED_COLORS[Math.random() < amberChance ? 2 : Math.random() < 0.3 ? 3 : Math.random() < 0.5 ? 0 : 1];

/** Racks that rise out of the data lake, with blinking status LEDs. */
export function ServerRacks() {
  const groups = useRef([]);
  const leds = useRef([]);
  const timer = useRef(0);

  const assets = useMemo(() => {
    const body = new THREE.BoxGeometry(RACK.W, RACK.H, RACK.D);
    body.translate(0, RACK.H / 2, 0); // pivot at the base so racks grow upward
    const side = new THREE.MeshStandardMaterial({ color: 0x0c1626, metalness: 0.7, roughness: 0.35 });
    const front = new THREE.MeshStandardMaterial({
      map: makeRackTexture(), metalness: 0.4, roughness: 0.5, emissive: 0x0a2236, emissiveIntensity: 0.6,
    });
    return {
      body,
      edges: new THREE.EdgesGeometry(body),
      materials: [side, side, side, side, front, side], // +z face is the front panel
      edgeMat: new THREE.LineBasicMaterial({ color: 0x5ee6ff, transparent: true, opacity: 0 }),
      ledGeo: new THREE.BoxGeometry(0.06, 0.06, 0.02),
      ledMat: new THREE.MeshBasicMaterial({ toneMapped: false }),
    };
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    leds.current.forEach((mesh) => {
      for (let u = 0; u < 8; u++) {
        for (let k = 0; k < 3; k++) {
          const ty = 16 + u * 60 + 26; // unit centre in rack texture pixels
          m.makeTranslation(((196 + k * 16) / 256 - 0.5) * RACK.W, RACK.H * (1 - ty / 512), RACK.D / 2 + 0.012);
          mesh.setMatrixAt(u * 3 + k, m);
          mesh.setColorAt(u * 3 + k, randomLed());
        }
      }
    });
    groups.current.forEach((g) => { g.scale.y = 0.001; g.visible = false; });
  }, []);

  useFrame((_, delta) => {
    const s = scrollState.cur;
    groups.current.forEach((g, i) => {
      const e = ease(s, 1.1 + i * 0.07, 1.6 + i * 0.07);
      g.visible = e > 0.002;
      g.scale.y = Math.max(0.001, e);
    });
    assets.edgeMat.opacity = ease(s, 1.3, 2.0) * 0.55;

    timer.current += delta;
    if (timer.current > 0.12) {
      timer.current = 0;
      leds.current.forEach((mesh) => {
        for (let k = 0; k < 3; k++) mesh.setColorAt((Math.random() * LEDS_PER_RACK) | 0, randomLed(0.08));
        mesh.instanceColor.needsUpdate = true;
      });
    }
  });

  return RACKS.map((r, i) => (
    <group key={i} ref={(el) => (groups.current[i] = el)} position={r.position} rotation-y={r.rot}>
      <mesh geometry={assets.body} material={assets.materials} />
      <lineSegments geometry={assets.edges} material={assets.edgeMat} />
      <instancedMesh ref={(el) => (leds.current[i] = el)} args={[assets.ledGeo, assets.ledMat, LEDS_PER_RACK]} />
    </group>
  ));
}
