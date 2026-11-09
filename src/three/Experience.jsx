import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Scene from './Scene';

/**
 * Entry point of the lazy-loaded 3D chunk. Everything that imports three.js / R3F
 * must live behind this file so the page text can render before the 3D downloads.
 */
export default function Experience({ onReady }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.1, far: 400, position: [0, 3, 24] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Scene onReady={onReady} />
    </Canvas>
  );
}
