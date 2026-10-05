'use client';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGalaxyMap } from '@/hooks/useGalaxyMap';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

export function Ship({ current, reduced }: { current: string; reduced: boolean }) {
  const { allSystems } = useGalaxyMap();
  const meshRef = useRef<THREE.Mesh>(null);
  const pathRef = useRef<THREE.CurvePath<THREE.Vector3>>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    const system = allSystems.find((s) => s.id === current);
    if (!system) return;

    const start = meshRef.current.position.clone();
    const end = new THREE.Vector3(
      (system.position.x - 50) * 2,
      (50 - system.position.y) * 2,
      0
    );

    const curve = new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3((start.x + end.x) / 2, (start.y + end.y) / 2 + 30, 20),
      end
    );

    if (reduced) {
      meshRef.current.position.copy(end);
      return;
    }

    gsap.to(meshRef.current.position, {
      duration: 0.7,
      ease: 'cubic-bezier(.22,1,.36,1)',
      motionPath: {
        path: curve.getPoints(50).map(p => ({ x: p.x, y: p.y, z: p.z })),
        curviness: 1.5,
      },
    });
  }, [current, reduced, allSystems]);

  return (
    <mesh ref={meshRef} position={[-100, -100, 0]} scale={1.5}>
      <coneGeometry args={[1, 3, 3]} />
      <meshBasicMaterial color="#d4af37" wireframe />
    </mesh>
  );
}