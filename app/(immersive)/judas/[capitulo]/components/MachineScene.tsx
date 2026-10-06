'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function MachineScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 3, 12], fov: 45 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <color attach="background" args={['#030008']} />
      <Environment preset="warehouse" />
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 6, 5]} intensity={50} color="#ff073a" distance={40} />
      <pointLight position={[-5, 2, -3]} intensity={20} color="#d4af37" distance={30} />
      <Machine reduced={reduced} />
      <OrganicGrowth reduced={reduced} />
      <OrbitControls enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.3} minDistance={5} maxDistance={30} />
    </Canvas>
  );
}

function Machine({ reduced }: { reduced: boolean }) {
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

function Gear({
  radius,
  teeth,
  position,
  speed,
  reduced,
}: {
  radius: number;
  teeth: number;
  position: [number, number, number];
  speed: number;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.CylinderGeometry(radius, radius, 0.3, teeth * 2), [radius, teeth]);
  useFrame((_, dt) => {
    if (!reduced && ref.current) ref.current.rotation.z += speed * dt;
  });
  return (
    <mesh ref={ref} geometry={geometry} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#2a1a18" metalness={0.7} roughness={0.4} flatShading />
    </mesh>
  );
}

function OrganicGrowth({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const spheres = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 3 + ((i * 17) % 10) * 0.2;
        return {
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
          z: ((i % 5) - 2) * 0.35,
          size: 0.3 + (i % 7) * 0.07,
        };
      }),
    []
  );
  useFrame((_, d) => {
    if (ref.current && !reduced) ref.current.rotation.z += d * 0.08;
  });
  return (
    <group ref={ref}>
      {spheres.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <sphereGeometry args={[s.size, 16, 16]} />
          <meshStandardMaterial color="#8a0303" emissive="#ff073a" emissiveIntensity={0.35} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}
