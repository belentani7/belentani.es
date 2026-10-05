'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function GenesisScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 45 }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; }}
    >
      <color attach="background" args={['#030008']} />
      <Stars radius={200} depth={100} count={2000} factor={4} saturation={0.5} fade />
      <Environment preset="city" />
      <Planet reduced={reduced} />
      <AccretionDisk reduced={reduced} />
      <OrbitControls enablePan={false} minDistance={10} maxDistance={100} />
    </Canvas>
  );
}

function Planet({ reduced }: { reduced: boolean }) {
  const noise = new SimplexNoise();
  const geometry = new THREE.IcosahedronGeometry(12, 64);
  const position = geometry.attributes.position;
  const displacement = new Float32Array(position.count);

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const n = noise.noise3d(x * 0.1, y * 0.1, z * 0.1);
    displacement[i] = n * 2;
  }

  const material = new THREE.MeshStandardMaterial({
    color: 0x1a0a12,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true,
  });

  return (
    <mesh>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshStandardMaterial attach="material" {...material} />
    </mesh>
  );
}

function AccretionDisk({ reduced }: { reduced: boolean }) {
  const points = [];
  for (let i = 0; i < 500; i++) {
    const angle = (i / 500) * Math.PI * 2;
    const radius = 15 + Math.random() * 8;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.5) * 2, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.PointsMaterial({ color: 0xff073a, size: 0.3, transparent: true, opacity: 0.6, sizeAttenuation: true });

  return <points geometry={geometry} material={material} />;
}