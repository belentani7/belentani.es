'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function DiamondScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 35 }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.2; }}
    >
      <color attach="background" args={['#030008']} />
      <Environment preset="warehouse" />
      <Diamond reduced={reduced} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={30} />
    </Canvas>
  );
}

function Diamond({ reduced }: { reduced: boolean }) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const indices = [];

  const facets = [
    { crown: 32, pavilion: 24, girdle: 16 },
  ];

  for (let f = 0; f < facets.length; f++) {
    const { crown, pavilion, girdle } = facets[f];
    const total = crown + pavilion + girdle;
    for (let i = 0; i < total; i++) {
      const angle = (i / total) * Math.PI * 2;
      const r = 1 + Math.sin(i * 0.5) * 0.3;
      positions.push(Math.cos(angle) * r, Math.sin(angle) * r, (Math.random() - 0.5) * 0.5);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 1,
    ior: 2.417,
    thickness: 2.0,
    roughness: 0,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0,
    envMapIntensity: 1.5,
    flatShading: true,
  });

  return (
    <mesh rotation={[-0.2, 0.3, 0]}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshPhysicalMaterial attach="material" {...material} />
    </mesh>
  );
}