'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function KeyScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 2, 10], fov: 40 }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; }}
    >
      <color attach="background" args={['#030008']} />
      <Environment preset="city" />
      <Key />
      <Chain />
      <DustParticles reduced={reduced} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={20} />
    </Canvas>
  );
}

function Key() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.5, 0);
  shape.lineTo(0.5, 3);
  shape.quadraticCurveTo(0.5, 3.5, 0, 3.5);
  shape.lineTo(0, 3);
  shape.lineTo(-0.5, 3);
  shape.quadraticCurveTo(-0.5, 3.5, 0, 3.5);
  shape.lineTo(-0.5, 0);
  shape.closePath();

  const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.05, bevelThickness: 0.05 };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xd4af37,
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });

  return <mesh rotation={[-Math.PI / 2, 0, 0]}><bufferGeometry attach="geometry" {...geometry} /><meshPhysicalMaterial attach="material" {...material} /></mesh>;
}

function Chain() {
  const group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.04, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x8a6d1f, metalness: 0.8, roughness: 0.3 })
    );
    torus.position.set(0, -3 - i * 0.4, 0);
    torus.rotation.x = Math.PI / 2;
    group.add(torus);
  }
  return <group>{group.children.map((c, i) => <primitive key={i} object={c} />)}</group>;
}

function DustParticles({ reduced }: { reduced: boolean }) {
  const positions = [];
  for (let i = 0; i < 200; i++) {
    positions.push((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10 - 5, (Math.random() - 0.5) * 20);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.05, transparent: true, opacity: 0.4 });
  return <points geometry={geometry} material={material} />;
}