'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const concepts = [
  { id: 'pedro', label: 'Pedro', pos: [0, 0, 0] as [number, number, number], color: 0xff073a, size: 1.2 },
  { id: 'judas', label: 'Judas', pos: [3, 2, 0] as [number, number, number], color: 0xd4af37, size: 1 },
  { id: 'deuda', label: 'Deuda', pos: [-3, 1, -2] as [number, number, number], color: 0x8a0303, size: 0.9 },
  { id: 'traicion', label: 'Traición', pos: [2, -2, 1] as [number, number, number], color: 0xff073a, size: 0.9 },
  { id: 'redencion', label: 'Redención', pos: [-2, -2, -1] as [number, number, number], color: 0x4de8e0, size: 0.9 },
  { id: 'español', label: 'Español\n(herida)', pos: [0, 3, 2] as [number, number, number], color: 0x4de8e0, size: 0.8 },
  { id: 'rey', label: 'Rey', pos: [4, 0, -1] as [number, number, number], color: 0xd4af37, size: 0.7 },
  { id: 'guerrero', label: 'Guerrero', pos: [-4, 0, 1] as [number, number, number], color: 0xff073a, size: 0.7 },
  { id: 'mago', label: 'Mago', pos: [0, -3, 2] as [number, number, number], color: 0x8a0303, size: 0.7 },
  { id: 'amante', label: 'Amante', pos: [1, -3, -2] as [number, number, number], color: 0x4de8e0, size: 0.7 },
];

const connections = [
  ['pedro', 'judas'], ['pedro', 'deuda'], ['pedro', 'traicion'],
  ['pedro', 'redencion'], ['pedro', 'español'],
  ['judas', 'rey'], ['deuda', 'guerrero'], ['traicion', 'mago'],
  ['redencion', 'amante'], ['español', 'rey'], ['español', 'guerrero'],
];

export function CognitionScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 50 }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; }}
    >
      <color attach="background" args={['#030008']} />
      <Connections reduced={reduced} />
      <ConceptNodes reduced={reduced} />
      <ThoughtParticles reduced={reduced} />
      <OrbitControls enablePan={false} minDistance={8} maxDistance={50} />
    </Canvas>
  );
}

function Connections({ reduced }: { reduced: boolean }) {
  const positions: number[] = [];
  const conceptMap = Object.fromEntries(concepts.map(c => [c.id, c.pos]));
  connections.forEach(([a, b]) => {
    const pa = conceptMap[a];
    const pb = conceptMap[b];
    if (pa && pb) {
      positions.push(pa[0], pa[1], pa[2], pb[0], pb[1], pb[2]);
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({ color: 0xff073a, transparent: true, opacity: 0.3 });
  return <primitive object={new THREE.Line(geometry, material)} />;
}

function ConceptNodes({ reduced }: { reduced: boolean }) {
  return (
    <group>
      {concepts.map(c => (
        <ConceptNode key={c.id} {...c} reduced={reduced} />
      ))}
    </group>
  );
}

function ConceptNode({ id, label, pos, color, size, reduced }: { id: string; label: string; pos: [number, number, number]; color: number; size: number; reduced: boolean }) {
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[size, 24, 24]} />
        <meshPhysicalMaterial attach="material" color={color} transmission={0.3} thickness={1} roughness={0.2} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[0, size + 0.5, 0]} scale={0.8}>
        <planeGeometry args={[size * 4, size * 1.5]} />
        <meshBasicMaterial attach="material" color="#030008" transparent opacity={0.8} side={2} />
      </mesh>
    </group>
  );
}

function ThoughtParticles({ reduced }: { reduced: boolean }) {
  const count = 200;
  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    const c = concepts[Math.floor(Math.random() * concepts.length)];
    const target = concepts[Math.floor(Math.random() * concepts.length)];
    positions.push(c.pos[0], c.pos[1], c.pos[2], target.pos[0], target.pos[1], target.pos[2], Math.random());
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x4de8e0, size: 0.05, transparent: true, opacity: 0.6, sizeAttenuation: true });
  return <points geometry={geometry} material={material} />;
}