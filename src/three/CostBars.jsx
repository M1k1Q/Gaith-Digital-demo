import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BAR_HEIGHTS } from './layout';
import { makeLabel } from './textures';
import { scrollState } from '../lib/scroll';
import { ease } from '../lib/math';

const AMBER = new THREE.Color(0xffb35c);
const TEAL = new THREE.Color(0x2de2c4);
const barX = (i) => -3.5 + i;

/** FinOps bar chart: monthly cost stepping down from amber to teal, with a trend line. */
export function CostBars() {
  const groups = useRef([]);
  const a = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.62, 1, 0.62);
    geo.translate(0, 0.5, 0);
    const edges = new THREE.EdgesGeometry(geo);
    const bars = BAR_HEIGHTS.map((h, i) => {
      const col = AMBER.clone().lerp(TEAL, i / (BAR_HEIGHTS.length - 1));
      return {
        h,
        mat: new THREE.MeshStandardMaterial({ color: col.clone().multiplyScalar(0.25), emissive: col, emissiveIntensity: 0.38, metalness: 0.3, roughness: 0.4 }),
        edgeMat: new THREE.LineBasicMaterial({ color: col.clone().multiplyScalar(1.6), toneMapped: false }),
      };
    });
    const trendPts = BAR_HEIGHTS.map((h, i) => new THREE.Vector3(barX(i), -2 + h + 0.35, 5));
    const trend = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(trendPts),
      new THREE.LineBasicMaterial({ color: new THREE.Color(0xffffff).multiplyScalar(1.5), transparent: true, opacity: 0, toneMapped: false })
    );
    const label = makeLabel('OpEx ↓', '#ffd9a8', 'rgba(255,179,92,.6)');
    label.position.set(barX(BAR_HEIGHTS.length - 1), -2 + BAR_HEIGHTS.at(-1) + 1.15, 5);
    return { geo, edges, bars, trend, trendCount: trendPts.length, label };
  }, []);

  useLayoutEffect(() => {
    groups.current.forEach((g) => { g.scale.y = 0.001; g.visible = false; });
  }, []);

  useFrame(() => {
    const s = scrollState.cur;
    groups.current.forEach((g, i) => {
      const e = ease(s, 4.2 + i * 0.05, 4.65 + i * 0.05);
      g.visible = e > 0.002;
      g.scale.y = Math.max(0.001, e * a.bars[i].h);
    });
    const tr = ease(s, 4.6, 4.95);
    a.trend.material.opacity = tr;
    a.trend.geometry.setDrawRange(0, Math.ceil(tr * a.trendCount));
    a.label.material.opacity = tr * (1 - 0.6 * ease(s, 5.4, 6));
    a.trend.visible = a.label.visible = tr > 0.001;
  });

  return (
    <>
      {a.bars.map((b, i) => (
        <group key={i} ref={(el) => (groups.current[i] = el)} position={[barX(i), -2, 5]}>
          <mesh geometry={a.geo} material={b.mat} />
          <lineSegments geometry={a.edges} material={b.edgeMat} />
        </group>
      ))}
      <primitive object={a.trend} />
      <primitive object={a.label} />
    </>
  );
}
