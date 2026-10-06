'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { VoyagePlace } from '@/lib/voyage-places';

/** Mapa orbital: cada lugar = nodo. Nave viaja entre ellos. */
export function VoyageMap({
  places,
  currentId,
  onSelect,
}: {
  places: VoyagePlace[];
  currentId: string;
  onSelect: (id: string) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <Canvas camera={{ position: [0, 18, 28], fov: 48 }} dpr={[1, 1.6]}>
      <color attach="background" args={['#030008']} />
      <Stars radius={220} depth={90} count={5500} factor={3.2} saturation={0} fade speed={reduced ? 0 : 0.15} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 8, 10]} intensity={40} color="#ff073a" distance={60} />
      <pointLight position={[-10, 2, -8]} intensity={14} color="#d4af37" distance={40} />
      <GalaxyDust />
      <OrbitRing />
      {places.map((p, i) => (
        <PlaceNode
          key={p.id}
          place={p}
          index={i}
          total={places.length}
          active={p.id === currentId}
          onSelect={onSelect}
        />
      ))}
      <ShipMarker places={places} currentId={currentId} reduced={reduced} />
    </Canvas>
  );
}

function GalaxyDust() {
  const geo = useMemo(() => {
    const n = 8000;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    let seed = 42;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const red = new THREE.Color('#ff073a');
    const blood = new THREE.Color('#8a0303');
    const gold = new THREE.Color('#d4af37');
    for (let i = 0; i < n; i++) {
      const arm = i % 5;
      const r = 2 + rnd() * 22;
      const a = (arm / 5) * Math.PI * 2 + r * 0.4;
      pos[i * 3] = Math.cos(a) * r + (rnd() - 0.5) * r * 0.12;
      pos[i * 3 + 1] = (rnd() - 0.5) * (0.4 + r * 0.04);
      pos[i * 3 + 2] = Math.sin(a) * r + (rnd() - 0.5) * r * 0.12;
      const c = rnd() > 0.9 ? gold : rnd() > 0.45 ? red : blood;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.02;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0]}>
      <torusGeometry args={[14, 0.02, 8, 128]} />
      <meshBasicMaterial color="#ff073a" transparent opacity={0.35} />
    </mesh>
  );
}

function placePos(index: number, total: number) {
  const a = (index / total) * Math.PI * 2 - Math.PI / 2;
  const r = 14;
  return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * 1.2, Math.sin(a) * r);
}

function PlaceNode({
  place,
  index,
  total,
  active,
  onSelect,
}: {
  place: VoyagePlace;
  index: number;
  total: number;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const pos = placePos(index, total);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (mesh.current && active) mesh.current.rotation.y += d * 1.2;
  });
  return (
    <group position={pos}>
      <mesh
        ref={mesh}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(place.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
        scale={active ? 1.6 : 1}
      >
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={place.accent}
          emissive={place.accent}
          emissiveIntensity={active ? 1.4 : 0.35}
          metalness={0.6}
          roughness={0.25}
          wireframe={!active}
        />
      </mesh>
    </group>
  );
}

function ShipMarker({
  places,
  currentId,
  reduced,
}: {
  places: VoyagePlace[];
  currentId: string;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const idx = Math.max(0, places.findIndex((p) => p.id === currentId));
  const target = placePos(idx, places.length).clone().multiplyScalar(0.82);

  useFrame((_, d) => {
    if (!ref.current) return;
    if (reduced) {
      ref.current.position.copy(target);
      return;
    }
    ref.current.position.lerp(target, 1 - Math.exp(-d * 3.2));
    ref.current.lookAt(0, 0, 0);
  });

  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.35, 1.4, 3]} />
        <meshBasicMaterial color="#ff073a" wireframe />
      </mesh>
      <pointLight intensity={8} distance={6} color="#ff073a" />
    </group>
  );
}
