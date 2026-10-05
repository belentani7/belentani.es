'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function BibliaScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 50 }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; }}
    >
      <color attach="background" args={['#030008']} />
      <FrequencyViz reduced={reduced} />
      <NoteLattice reduced={reduced} />
      <OrbitControls enablePan={false} minDistance={10} maxDistance={60} />
    </Canvas>
  );
}

function FrequencyViz({ reduced }: { reduced: boolean }) {
  const bars = [];
  for (let i = 0; i < 64; i++) {
    bars.push({ x: (i - 32) * 0.5, h: Math.random() * 5 });
  }
  return (
    <group>
      {bars.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, 0]} scale={[0.3, b.h, 0.3]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial attach="material" color="#ff073a" emissive="#ff073a" emissiveIntensity={0.5} metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function NoteLattice({ reduced }: { reduced: boolean }) {
  const notes = ['F#', 'G', 'A', 'A#', 'C', 'C#', 'D#', 'F#'];
  return (
    <group position={[0, -8, 0]}>
      {notes.map((n, i) => (
        <mesh key={i} position={[(i - 3.5) * 1.5, 0, 0]}>
          <torusGeometry args={[0.5, 0.1, 8, 16]} />
          <meshStandardMaterial attach="material" color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}