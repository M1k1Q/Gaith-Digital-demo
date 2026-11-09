import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { skyFS, skyVS } from './shaders';
import { scrollState } from '../lib/scroll';
import { ease, rand } from '../lib/math';

/** Gradient night sky dome. */
export function Sky() {
  return (
    <mesh>
      <sphereGeometry args={[160, 32, 16]} />
      <shaderMaterial side={THREE.BackSide} depthWrite={false} fog={false} vertexShader={skyVS} fragmentShader={skyFS} />
    </mesh>
  );
}

export function Stars({ count = 700 }) {
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(rand(0.08, 1));
      p.set([130 * Math.sin(ph) * Math.cos(th), 130 * Math.cos(ph), 130 * Math.sin(ph) * Math.sin(th)], i * 3);
    }
    return p;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={1.3} sizeAttenuation={false} color="#9fbfdf" transparent opacity={0.55} fog={false} />
    </points>
  );
}

/** Floor grid that fades in once the rain has settled into the data lake. */
export function GroundGrid() {
  const ref = useRef();
  useLayoutEffect(() => {
    const m = ref.current.material;
    m.transparent = true;
    m.opacity = 0;
    m.depthWrite = false;
  }, []);
  useFrame(() => {
    const o = ease(scrollState.cur, 0.6, 1.0) * 0.28;
    ref.current.material.opacity = o;
    ref.current.visible = o > 0.001;
  });
  return <gridHelper ref={ref} args={[70, 70, '#1b6f8a', '#123a52']} position-y={-2.03} />;
}

export function Lights() {
  return (
    <>
      <ambientLight color="#6f8fb0" intensity={0.7} />
      <directionalLight color="#9fdcff" intensity={1.6} position={[6, 12, 9]} />
      <pointLight color="#2de2c4" intensity={60} distance={30} decay={2} position={[0, 4, 5]} />
    </>
  );
}
