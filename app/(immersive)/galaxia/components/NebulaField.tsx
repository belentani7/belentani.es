'use client';
import { useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function NebulaField() {
  const positions = useMemo(() => {
    const n = 4200;
    const a = new Float32Array(n * 3);
    let s = 0x9e3779b9;
    const rand = () => {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      return ((s >>> 0) / 4294967296);
    };
    for (let i = 0; i < n; i++) {
      const arm = (i % 5) / 5;
      const r = 10 + Math.pow(rand(), 0.72) * 150;
      const theta = arm * Math.PI * 2 + r * 0.045 + (rand() - 0.5) * 0.55;
      const width = (rand() - 0.5) * (8 + r * 0.08);
      a[i * 3] = Math.cos(theta) * r + Math.cos(theta + Math.PI / 2) * width;
      a[i * 3 + 1] = (rand() - 0.5) * 55;
      a[i * 3 + 2] = Math.sin(theta) * r + Math.sin(theta + Math.PI / 2) * width;
    }
    return a;
  }, []);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ff174f" size={0.32} sizeAttenuation depthWrite={false} opacity={0.2} blending={THREE.AdditiveBlending} />
    </Points>
  );
}
