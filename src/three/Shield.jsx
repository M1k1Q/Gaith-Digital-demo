import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SHIELD } from './layout';
import { shieldFS, shieldVS, wireFS, wireVS } from './shaders';
import { scrollState } from '../lib/scroll';
import { ease } from '../lib/math';

/** Security dome that builds up from the ground and closes over the whole architecture. */
export function Shield() {
  const shell = useRef();
  const wire = useRef();
  const ring = useRef();
  const { uniforms, shellMat, wireGeo, wireMat, ringMat, baseR } = useMemo(() => {
    const uniforms = { uReveal: { value: 0 }, uTime: { value: 0 }, uOpacity: { value: 1 } };
    const common = { uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };
    return {
      uniforms,
      shellMat: new THREE.ShaderMaterial({ ...common, side: THREE.DoubleSide, vertexShader: shieldVS, fragmentShader: shieldFS }),
      wireGeo: new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(SHIELD.radius * 1.002, 3)),
      wireMat: new THREE.ShaderMaterial({ ...common, vertexShader: wireVS, fragmentShader: wireFS }),
      ringMat: new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x5ee6ff).multiplyScalar(1.6), transparent: true, opacity: 0,
        side: THREE.DoubleSide, toneMapped: false, depthWrite: false,
      }),
      // radius where the dome meets the ground plane (y = -2)
      baseR: Math.sqrt(SHIELD.radius ** 2 - (SHIELD.center[1] + 2) ** 2),
    };
  }, []);

  useFrame((state) => {
    const s = scrollState.cur;
    uniforms.uReveal.value = ease(s, 3.2, 3.95);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uOpacity.value = 1 - 0.55 * ease(s, 4.5, 5.1);
    const visible = uniforms.uReveal.value > 0.001;
    shell.current.visible = wire.current.visible = visible;
    ringMat.opacity = ease(s, 3.2, 3.5) * uniforms.uOpacity.value * 0.8;
    ring.current.visible = ringMat.opacity > 0.001;
  });

  const [cx, , cz] = SHIELD.center;
  return (
    <>
      <mesh ref={shell} position={SHIELD.center} material={shellMat} visible={false}>
        <sphereGeometry args={[SHIELD.radius, 64, 48]} />
      </mesh>
      <lineSegments ref={wire} position={SHIELD.center} geometry={wireGeo} material={wireMat} visible={false} />
      <mesh ref={ring} rotation-x={-Math.PI / 2} position={[cx, -1.99, cz]} material={ringMat} visible={false}>
        <ringGeometry args={[baseR - 0.08, baseR + 0.08, 128]} />
      </mesh>
    </>
  );
}
