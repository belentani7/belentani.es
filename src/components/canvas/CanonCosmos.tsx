'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Galaxy({ calm, chapter }: { calm: boolean; chapter: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const positions = new Float32Array(7200 * 3);
    const colors = new Float32Array(7200 * 3);
    let seed = 1979;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 7200; i++) {
      const radius = 0.8 + random() * 10;
      const angle = (i % 3) * Math.PI * 2 / 3 + radius * 0.65;
      const spread = random() * 0.8;
      positions.set([Math.cos(angle) * radius + (random() - 0.5) * spread * radius, (random() - 0.5) * (0.2 + radius * 0.09), Math.sin(angle) * radius + (random() - 0.5) * spread * radius], i * 3);
      const color = new THREE.Color(i % 7 === 0 ? '#edb95b' : i % 3 === 0 ? '#74d5d8' : '#ed637e');
      colors.set([color.r, color.g, color.b], i * 3);
    }
    return { positions, colors };
  }, []);
  useFrame((_, delta) => {
    if (group.current && !calm) group.current.rotation.y += Math.min(delta, 0.05) * 0.045;
  });
  return <group ref={group} rotation={[0.22, chapter * 0.2, 0.2]}>
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={7200} array={points.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={7200} array={points.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
    <mesh rotation={[0.3, chapter * 0.8, Math.PI / 4]}>
      <octahedronGeometry args={[1.1, 0]} />
      <meshStandardMaterial color="#b8e5e4" metalness={0.8} roughness={0.15} wireframe />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.8, 0.013, 8, 100]} />
      <meshBasicMaterial color="#edb95b" />
    </mesh>
  </group>;
}

export default function CanonCosmos({ calm, chapter }: { calm: boolean; chapter: number }) {
  return <Canvas camera={{ position: [0, 8, 13], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, preserveDrawingBuffer: true }} frameloop={calm ? 'demand' : 'always'}>
    <ambientLight intensity={1.3} />
    <pointLight position={[3, 4, 5]} intensity={20} color="#edb95b" />
    <Galaxy calm={calm} chapter={chapter} />
    <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.3} maxPolarAngle={1.4} />
  </Canvas>;
}
