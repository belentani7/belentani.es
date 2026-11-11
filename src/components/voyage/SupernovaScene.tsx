'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Supernova: estrella que colapsa y explota en un destello de luz.
 *  Parte del canon Judas: la muerte de una estrella es el nacimiento de la voz.
 *  Efecto visual inspirado en el banner SVG de supernova (9s loop, opacidad + escala).
 */
export function SupernovaScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas camera={{ position: [0, 0, 18], fov: 42 }} dpr={[1, 1.6]}>
      <color attach="background" args={['#000003']} />
      <Stars radius={200} depth={100} count={reduced ? 1500 : 4000} factor={3} saturation={0.15} fade speed={reduced ? 0 : 0.15} />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={0} />
      <Nucleus reduced={reduced} />
      <AccretionDisk reduced={reduced} />
      <Shockwave reduced={reduced} />
    </Canvas>
  );
}

function Nucleus({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current && !reduced) {
      ref.current.rotation.z += d * 0.12;
      ref.current.rotation.y += d * 0.08;
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.6, 32]} />
      <meshBasicMaterial color="#ff073a" />
    </mesh>
  );
}

function AccretionDisk({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 4000;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const red = new THREE.Color('#ff073a');
    const gold = new THREE.Color('#d4af37');
    const white = new THREE.Color('#ffffff');
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.4 + Math.random() * 9;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = Math.sin(a) * r;
      const c = Math.random() > 0.7 ? white : Math.random() > 0.4 ? gold : red;
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
    if (ref.current && !reduced) ref.current.rotation.y += d * 0.25;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Shockwave({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0);
  useFrame((_, d) => {
    if (ref.current && !reduced) {
      scaleRef.current = (scaleRef.current + d * 0.6) % 4;
      ref.current.scale.setScalar(scaleRef.current);
      const m = ref.current.material as THREE.MeshBasicMaterial;
      m.opacity = Math.max(0, 1 - scaleRef.current / 4);
    }
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[2.2, 10, 64]} />
      <meshBasicMaterial color="#ff073a" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
