import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { particleFS, particleVS } from './shaders';
import { CLOUD_BLOBS } from './layout';
import { scrollState } from '../lib/scroll';
import { ease, rand, reduceMotion } from '../lib/math';

const blobWeights = CLOUD_BLOBS.map((b) => b[3] * b[3]);
const blobTotal = blobWeights.reduce((a, b) => a + b, 0);

function sampleCloud() {
  let r = Math.random() * blobTotal;
  let k = 0;
  while (r > blobWeights[k]) { r -= blobWeights[k]; k++; }
  const [cx, cy, cz, rad] = CLOUD_BLOBS[k];
  const v = new THREE.Vector3().randomDirection().multiplyScalar(rad * (0.72 + 0.28 * Math.random()));
  return [cx + v.x, Math.max(cy + v.y, 6.9 + Math.random() * 0.3), cz + v.z * 0.8];
}

function buildGeometry(n, withData) {
  const pos = new Float32Array(n * 3);
  const grid = new Float32Array(n * 3);
  const cloud = new Float32Array(n * 3);
  const speed = new Float32Array(n);
  const rnd = new Float32Array(n);
  const kind = new Float32Array(n);
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    pos.set([rand(-16, 16), rand(-10, 20), rand(-16, 14)], i * 3);
    if (withData) {
      const gx = i % side, gz = Math.floor(i / side);
      grid.set([(gx / (side - 1) - 0.5) * 26, -2, (gz / (side - 1) - 0.5) * 26 - 1], i * 3);
      cloud.set(sampleCloud(), i * 3);
    }
    speed[i] = rand(9, 15);
    rnd[i] = Math.random();
    kind[i] = Math.random() < 0.55 ? 1 : 0; // 55% rise into the cloud, the rest stay as the data floor
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aGrid', new THREE.BufferAttribute(grid, 3));
  g.setAttribute('aCloud', new THREE.BufferAttribute(cloud, 3));
  g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
  g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
  g.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
  return g;
}

/**
 * GPU particle field.
 * variant="main":   hero rain → settles into the data lake → part of it rises into the cloud.
 * variant="finale": light rain that returns for the closing section.
 */
export function RainField({ count, variant = 'main' }) {
  const main = variant === 'main';
  const geometry = useMemo(() => buildGeometry(count, main), [count, main]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVS,
        fragmentShader: particleFS,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uRainTime: { value: 0 }, uTime: { value: 0 }, uT1: { value: 0 }, uT2: { value: 0 },
          uSize: { value: 170 }, uPR: { value: 1 }, uOpacity: { value: main ? 1 : 0 },
        },
      }),
    [main]
  );
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  const rainTime = useRef(0);
  const points = useRef();
  useFrame((state, delta) => {
    const s = scrollState.cur;
    const t = state.clock.elapsedTime;
    const u = material.uniforms;
    const speed = reduceMotion ? 0.3 : 1;
    u.uTime.value = t;
    u.uPR.value = state.gl.getPixelRatio();
    if (main) {
      const t1 = ease(s, 0.3, 1.0);
      rainTime.current += Math.min(delta, 0.05) * (1 - t1) * speed; // rain slows as it settles
      u.uRainTime.value = rainTime.current;
      u.uT1.value = t1;
      u.uT2.value = ease(s, 1.3, 2.0);
      u.uOpacity.value = 1 - 0.35 * ease(s, 3.3, 4.0);
    } else {
      u.uRainTime.value = t * 0.7 * speed;
      u.uOpacity.value = ease(s, 5.3, 6.0) * 0.55;
      points.current.visible = u.uOpacity.value > 0.001; // finale rain only drawn near the end
    }
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
