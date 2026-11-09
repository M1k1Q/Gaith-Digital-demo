import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PIPELINE_STAGES } from './layout';
import { getGlowTexture, makeLabel } from './textures';
import { scrollState } from '../lib/scroll';
import { clamp, ease } from '../lib/math';

const PACKETS = 30;
const CYAN = '#c9f4ff', TEAL = '#bff8ea';

/** The DevOps ∞ loop: draws itself in, lights up each stage, then streams packets around it. */
export function Pipeline() {
  const root = useRef();
  const p = useMemo(() => {
    // Lemniscate of Bernoulli with a slight vertical wave so the two lobes don't intersect.
    const pts = [];
    for (let i = 0; i < 200; i++) {
      const u = (i / 200) * Math.PI * 2, den = 1 + Math.sin(u) ** 2, a = 6.8;
      pts.push(new THREE.Vector3((a * Math.cos(u)) / den, 3.6 + 0.4 * Math.sin(u), (a * Math.sin(u) * Math.cos(u)) / den));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    const tube = new THREE.TubeGeometry(curve, 500, 0.065, 8, true);
    const halo = new THREE.TubeGeometry(curve, 500, 0.24, 8, true);
    const tubeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x5ee6ff).multiplyScalar(1.4), transparent: true, opacity: 0, toneMapped: false });
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x2de2c4, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });

    const nodes = PIPELINE_STAGES.map((name, i) => {
      const t = (i / PIPELINE_STAGES.length + 0.03) % 1;
      const pos = curve.getPointAt(t);
      const build = i < 4; // plan→test in cyan, release→monitor in teal
      const node = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.22),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(build ? 0x5ee6ff : 0x2de2c4).multiplyScalar(1.8), toneMapped: false, transparent: true, opacity: 0 })
      );
      node.position.copy(pos);
      const label = makeLabel(name, build ? CYAN : TEAL, build ? 'rgba(94,230,255,.55)' : 'rgba(45,226,196,.6)');
      label.position.copy(pos).add(new THREE.Vector3(0, 0.75, 0));
      return { node, label, t };
    });

    const packets = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(PACKETS * 3), 3)),
      new THREE.PointsMaterial({ map: getGlowTexture(), size: 0.5, color: 0xe6fdff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    packets.frustumCulled = false;
    return { curve, tube, halo, tubeMat, haloMat, nodes, packets, tmp: new THREE.Vector3() };
  }, []);

  useFrame((state) => {
    const s = scrollState.cur, t = state.clock.elapsedTime;
    const reveal = ease(s, 2.2, 2.95);
    const dim = 1 - 0.55 * ease(s, 3.5, 4.0);
    root.current.visible = reveal > 0.001; // not drawn at all before the CI/CD stage
    if (!root.current.visible) return;

    p.tubeMat.opacity = (reveal > 0 ? 1 : 0) * dim;
    p.haloMat.opacity = reveal * 0.12 * dim;
    const count = Math.floor((p.tube.index.count * reveal) / 3) * 3;
    p.tube.setDrawRange(0, count);
    p.halo.setDrawRange(0, count);

    const labelFade = 1 - 0.8 * ease(s, 3.4, 3.9);
    p.nodes.forEach(({ node, label, t: nt }) => {
      const o = clamp((reveal - nt) * 10);
      node.material.opacity = o * dim;
      node.scale.setScalar(Math.max(0.001, o));
      node.rotation.y = t * 1.2;
      label.material.opacity = o * labelFade;
    });

    const pp = ease(s, 2.8, 3.0) * dim;
    p.packets.material.opacity = pp;
    p.packets.visible = pp > 0.001;
    if (p.packets.visible) {
      const arr = p.packets.geometry.attributes.position.array;
      for (let i = 0; i < PACKETS; i++) {
        p.curve.getPointAt((t * 0.045 + i / PACKETS) % 1, p.tmp);
        arr.set([p.tmp.x, p.tmp.y, p.tmp.z], i * 3);
      }
      p.packets.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={root}>
      <mesh geometry={p.tube} material={p.tubeMat} />
      <mesh geometry={p.halo} material={p.haloMat} />
      {p.nodes.map(({ node, label }, i) => (
        <group key={i}>
          <primitive object={node} />
          <primitive object={label} />
        </group>
      ))}
      <primitive object={p.packets} />
    </group>
  );
}
