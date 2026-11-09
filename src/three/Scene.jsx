import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { plateau, rawStage, scrollState } from '../lib/scroll';
import { isSmall } from '../lib/math';
import { GroundGrid, Lights, Sky, Stars } from './Environment';
import { RainField } from './RainField';
import { ServerRacks } from './ServerRacks';
import { DataBeams } from './DataBeams';
import { Pipeline } from './Pipeline';
import { Shield } from './Shield';
import { CostBars } from './CostBars';
import { CameraRig } from './CameraRig';

/** Advances the shared scroll stage once per frame. Mounted first so every other useFrame sees fresh values. */
function ScrollDriver({ onFirstFrame }) {
  const first = useRef(true);
  useFrame((_, delta) => {
    const raw = window.__stage ?? rawStage(); // window.__stage: preview/debug override
    scrollState.raw = raw;
    scrollState.cur += (plateau(raw) - scrollState.cur) * (1 - Math.exp(-Math.min(delta, 0.05) * 4));
    if (first.current) { first.current = false; onFirstFrame?.(); }
  });
  return null;
}

/**
 * Compiles every shader and uploads every texture before the first frame, so stages that
 * appear later in the scroll (pipeline, shield, bars…) don't stutter on first appearance.
 * Must be mounted after all scene content: its layout effect then runs last.
 */
function WarmUp() {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const hidden = [];
    scene.traverse((o) => {
      if (!o.visible) { hidden.push(o); o.visible = true; } // compile() skips invisible objects
    });
    gl.compile(scene, camera);
    scene.traverse((o) => {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => m?.map && gl.initTexture(m.map));
    });
    hidden.forEach((o) => { o.visible = false; });
  }, [gl, scene, camera]);
  return null;
}

export default function Scene({ onReady }) {
  const small = isSmall();
  return (
    <>
      <ScrollDriver onFirstFrame={onReady} />
      <color attach="background" args={['#04070d']} />
      <fogExp2 attach="fog" args={['#050a12', 0.016]} />
      <Lights />
      <Sky />
      <Stars />
      <RainField count={small ? 2600 : 5200} />
      <RainField count={small ? 600 : 1300} variant="finale" />
      <GroundGrid />
      <ServerRacks />
      <DataBeams />
      <Pipeline />
      <Shield />
      <CostBars />
      <CameraRig />
      <WarmUp />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.18} luminanceSmoothing={0.25} radius={0.7} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
