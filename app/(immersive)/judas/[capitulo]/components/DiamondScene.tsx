'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Diamante IOR 2.417 — rojo/cristal sobre vacío */
export function DiamondScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 1.2, 8], fov: 38 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.35;
      }}
    >
      <color attach="background" args={['#030008']} />
      <Environment preset="night" />
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 6, 5]} intensity={60} color="#ff073a" distance={40} />
      <pointLight position={[-5, -2, 3]} intensity={25} color="#d4af37" distance={30} />
      <Diamond reduced={reduced} />
      <OrbitControls enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.8} minDistance={4} maxDistance={16} />
    </Canvas>
  );
}

function Diamond({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current && !reduced) ref.current.rotation.y += d * 0.35;
  });
  return (
    <mesh ref={ref} scale={1.4}>
      <octahedronGeometry args={[1.6, 0]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={0.92}
        ior={2.417}
        thickness={2.2}
        roughness={0.02}
        metalness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={1.8}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}
