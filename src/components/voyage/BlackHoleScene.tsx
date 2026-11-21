'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Agujero negro + disco de acreción rojo — lugar del viaje */
export function BlackHoleScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas camera={{ position: [0, 4, 18], fov: 42 }} dpr={[1, 1.6]}>
      <color attach="background" args={['#030008']} />
      <Stars radius={180} depth={80} count={4000} factor={3} saturation={0} fade speed={reduced ? 0 : 0.2} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={0} />
      <Hole reduced={reduced} />
      <Disk reduced={reduced} />
    </Canvas>
  );
}

function Hole({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current && !reduced) ref.current.rotation.z += d * 0.15;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.2, 48, 48]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}

function Disk({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 3000;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const red = new THREE.Color('#ff073a');
    const blood = new THREE.Color('#8a0303');
    const gold = new THREE.Color('#d4af37');
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3.2 + Math.random() * 7;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.35;
      pos[i * 3 + 2] = Math.sin(a) * r;
      const c = Math.random() > 0.85 ? gold : Math.random() > 0.4 ? red : blood;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  useFrame((_, d) => {
    if (ref.current && !reduced) ref.current.rotation.y += d * 0.22;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
