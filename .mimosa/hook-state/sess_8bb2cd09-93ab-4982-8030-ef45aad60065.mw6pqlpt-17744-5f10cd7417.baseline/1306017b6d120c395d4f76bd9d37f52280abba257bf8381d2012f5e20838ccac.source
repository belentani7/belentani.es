'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Llave de oro viejo + cadena — geometría válida (sin spread roto de BufferGeometry). */
export function KeyScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 1.5, 9], fov: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <color attach="background" args={['#030008']} />
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 5, 4]} intensity={40} color="#d4af37" distance={35} />
      <pointLight position={[-4, -1, 2]} intensity={18} color="#ff073a" distance={28} />
      <KeyBody reduced={reduced} />
      <Chain />
      <LockHalfOpen />
      <DustParticles reduced={reduced} />
      <OrbitControls enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.45} minDistance={4} maxDistance={18} />
    </Canvas>
  );
}

function goldMat() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xd4af37,
    metalness: 0.92,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.4,
  });
}

function KeyBody({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const { bow, shaft, bit } = useMemo(() => {
    const bowGeo = new THREE.TorusGeometry(0.85, 0.22, 24, 48);
    const shaftGeo = new THREE.CylinderGeometry(0.16, 0.16, 2.8, 24);
    const bitShape = new THREE.Shape();
    bitShape.moveTo(0, 0);
    bitShape.lineTo(0.55, 0);
    bitShape.lineTo(0.55, 0.35);
    bitShape.lineTo(0.28, 0.35);
    bitShape.lineTo(0.28, 0.55);
    bitShape.lineTo(0.55, 0.55);
    bitShape.lineTo(0.55, 0.9);
    bitShape.lineTo(0, 0.9);
    bitShape.closePath();
    const bitGeo = new THREE.ExtrudeGeometry(bitShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });
    bitGeo.center();
    return { bow: bowGeo, shaft: shaftGeo, bit: bitGeo };
  }, []);

  useFrame((_, d) => {
    if (ref.current && !reduced) ref.current.rotation.y += d * 0.25;
  });

  const mat = useMemo(() => goldMat(), []);

  return (
    <group ref={ref} position={[0, 0.4, 0]} rotation={[0.15, 0.4, 0.1]}>
      <mesh geometry={bow} material={mat} position={[0, 1.55, 0]} />
      <mesh geometry={shaft} material={mat} position={[0, 0.05, 0]} />
      <mesh geometry={bit} material={mat} position={[0.35, -1.25, 0]} rotation={[0, 0, -Math.PI / 2]} />
    </group>
  );
}

function Chain() {
  const links = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ color: 0x8a6d1f, metalness: 0.85, roughness: 0.28 });
    return Array.from({ length: 14 }, (_, i) => {
      const geo = new THREE.TorusGeometry(0.18, 0.045, 10, 20);
      return { geo, mat, y: -2.1 - i * 0.38, rot: i % 2 === 0 ? Math.PI / 2 : 0 };
    });
  }, []);

  return (
    <group>
      {links.map((l, i) => (
        <mesh key={i} geometry={l.geo} material={l.mat} position={[0, l.y, 0]} rotation={[l.rot, 0, 0]} />
      ))}
    </group>
  );
}

function LockHalfOpen() {
  const { body, shackle } = useMemo(() => {
    const bodyGeo = new THREE.BoxGeometry(0.9, 0.7, 0.35);
    const shackleGeo = new THREE.TorusGeometry(0.32, 0.07, 12, 28, Math.PI);
    return { body: bodyGeo, shackle: shackleGeo };
  }, []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x6a5218,
        metalness: 0.9,
        roughness: 0.35,
      }),
    []
  );
  return (
    <group position={[1.8, -3.6, 0.3]} rotation={[0.2, -0.5, 0.15]}>
      <mesh geometry={body} material={mat} />
      <mesh geometry={shackle} material={mat} position={[0.12, 0.45, 0]} rotation={[0, 0, 0.55]} />
    </group>
  );
}

function DustParticles({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 220;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, d) => {
    if (ref.current && !reduced) ref.current.rotation.y += d * 0.04;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#d4af37" size={0.045} transparent opacity={0.45} depthWrite={false} sizeAttenuation />
    </points>
  );
}
