'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/** Galaxia canónica: rojo sangre + oro viejo. Sin cian / verde. */
function Galaxy({ calm, chapter }: { calm: boolean; chapter: number }) {
  const group = useRef<THREE.Group>(null);
  const COUNT = 14000;
  const points = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    let seed = 1979;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const red = new THREE.Color('#ff073a');
    const blood = new THREE.Color('#8a0303');
    const gold = new THREE.Color('#d4af37');
    const ink = new THREE.Color('#f2e8ef');
    for (let i = 0; i < COUNT; i++) {
      const arm = i % 4;
      const radius = 0.4 + random() * 12;
      const angle = (arm * Math.PI * 2) / 4 + radius * 0.55 + (random() - 0.5) * 0.35;
      const spread = (random() - 0.5) * (0.15 + radius * 0.08);
      positions.set(
        [
          Math.cos(angle) * radius + spread,
          (random() - 0.5) * (0.15 + radius * 0.07),
          Math.sin(angle) * radius + spread * 0.8,
        ],
        i * 3
      );
      const pick = random();
      const color = pick > 0.92 ? gold : pick > 0.55 ? red : pick > 0.12 ? blood : ink;
      colors.set([color.r, color.g, color.b], i * 3);
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (group.current && !calm) group.current.rotation.y += Math.min(delta, 0.05) * 0.038;
  });

  return (
    <group ref={group} rotation={[0.35, chapter * 0.15, 0.12]} scale={1.15}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={points.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={COUNT} array={points.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#ff073a" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.012, 8, 128]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function CanonCosmos({ calm, chapter }: { calm: boolean; chapter: number }) {
  return (
    <Canvas
      camera={{ position: [0, 6.5, 11], fov: 52 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      frameloop={calm ? 'demand' : 'always'}
      style={{ background: 'transparent' }}
    >
      <color attach="background" args={['#030008']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 3, 4]} intensity={35} color="#ff073a" distance={40} />
      <pointLight position={[-5, 1, -2]} intensity={12} color="#d4af37" distance={30} />
      <Galaxy calm={calm} chapter={chapter} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={!calm} autoRotateSpeed={0.35} minPolarAngle={0.4} maxPolarAngle={1.35} />
    </Canvas>
  );
}
