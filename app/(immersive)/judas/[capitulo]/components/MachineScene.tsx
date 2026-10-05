'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function MachineScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 3, 12], fov: 45 }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1; }}
    >
      <color attach="background" args={['#030008']} />
      <Environment preset="warehouse" />
      <Machine reduced={reduced} />
      <OrganicGrowth reduced={reduced} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={30} />
    </Canvas>
  );
}

function Machine({ reduced }: { reduced: boolean }) {
  const gears = [];
  const gearData = [
    { r: 2, teeth: 20, pos: [0, 0, 0] as [number, number, number], speed: 0.3 },
    { r: 1.2, teeth: 12, pos: [2.8, 0, 0] as [number, number, number], speed: -0.5 },
    { r: 0.8, teeth: 8, pos: [-2.5, 1.5, 0] as [number, number, number], speed: 0.7 },
    { r: 1.5, teeth: 16, pos: [1.5, -2.5, 0] as [number, number, number], speed: -0.4 },
  ];

  return (
    <group>
      {gearData.map((g, i) => (
        <Gear key={i} radius={g.r} teeth={g.teeth} position={g.pos} speed={g.speed} reduced={reduced} />
      ))}
    </group>
  );
}

function Gear({ radius, teeth, position, speed, reduced }: { radius: number; teeth: number; position: [number, number, number]; speed: number; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (!reduced && ref.current) ref.current.rotation.z += speed * dt; });
  const geometry = new THREE.CylinderGeometry(radius, radius, 0.3, teeth * 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2a1a18,
    metalness: 0.7,
    roughness: 0.4,
    flatShading: true,
  });
  return <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}><bufferGeometry attach="geometry" {...geometry} /><meshStandardMaterial attach="material" {...material} /></mesh>;
}

function OrganicGrowth({ reduced }: { reduced: boolean }) {
  const spheres = [];
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const r = 3 + Math.random() * 2;
    spheres.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, z: (Math.random() - 0.5) * 2, size: 0.3 + Math.random() * 0.5 });
  }
  return (
    <group>
      {spheres.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <sphereGeometry args={[s.size, 16, 16]} />
          <meshStandardMaterial attach="material" color="#8a0303" emissive="#ff073a" emissiveIntensity={0.3} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}