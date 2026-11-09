import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RACK, RACKS } from './layout';
import { getGlowTexture } from './textures';
import { scrollState } from '../lib/scroll';
import { ease } from '../lib/math';

const PER_BEAM = 5;

/** Data streams between the cloud and each rack; packets alternate direction (sync up / down). */
export function DataBeams() {
  const { beams, lines, packets } = useMemo(() => {
    const beams = RACKS.map((r, i) => ({
      top: new THREE.Vector3(r.position[0] * 0.72, 7.1, -2.8),
      bot: new THREE.Vector3(r.position[0], -2 + RACK.H + 0.05, r.position[2]),
      dir: i % 2 ? 1 : -1,
    }));
    const linePos = beams.flatMap((b) => [b.top.x, b.top.y, b.top.z, b.bot.x, b.bot.y, b.bot.z]);
    const lines = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3)),
      new THREE.LineBasicMaterial({ color: 0x5ee6ff, transparent: true, opacity: 0, depthWrite: false })
    );
    const packets = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(beams.length * PER_BEAM * 3), 3)),
      new THREE.PointsMaterial({
        map: getGlowTexture(), size: 0.42, color: 0x9ff3ff, transparent: true, opacity: 0,
        depthWrite: false, blending: THREE.AdditiveBlending,
      })
    );
    packets.frustumCulled = false;
    return { beams, lines, packets };
  }, []);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const w = ease(scrollState.cur, 1.75, 2.15);
    lines.material.opacity = w * 0.22;
    packets.material.opacity = w;
    lines.visible = packets.visible = w > 0.001; // skip the draw calls entirely outside this stage
    if (!lines.visible) return;
    const t = state.clock.elapsedTime;
    const arr = packets.geometry.attributes.position.array;
    beams.forEach((b, i) => {
      for (let k = 0; k < PER_BEAM; k++) {
        let f = (t * 0.35 + k / PER_BEAM + i * 0.13) % 1;
        if (b.dir > 0) f = 1 - f;
        tmp.lerpVectors(b.top, b.bot, f);
        arr.set([tmp.x, tmp.y, tmp.z], (i * PER_BEAM + k) * 3);
      }
    });
    packets.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <primitive object={lines} />
      <primitive object={packets} />
    </>
  );
}
