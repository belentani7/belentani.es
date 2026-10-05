'use client';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';
import { useMemo } from 'react';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

extend({ Line2, LineGeometry, LineMaterial });

interface RouteProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
}

export function Route({ from, to, active }: RouteProps) {
  const geometry = useMemo(() => {
    const g = new LineGeometry();
    const start = new THREE.Vector3((from.x - 50) * 2, (50 - from.y) * 2, 0);
    const end = new THREE.Vector3((to.x - 50) * 2, (50 - to.y) * 2, 0);
    const mid = new THREE.Vector3((start.x + end.x) / 2, (start.y + end.y) / 2 + 15, 0);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(20);
    g.setPositions(points.flatMap(p => [p.x, p.y, p.z]));
    return g;
  }, [from, to]);

  const material = useMemo(() => new LineMaterial({
    color: active ? 0xd4af37 : 0xff073a,
    linewidth: active ? 0.004 : 0.002,
    opacity: active ? 0.8 : 0.35,
    transparent: true,
    dashed: !active,
    dashSize: 0.5,
    gapSize: 0.7,
  }), [active]);

  return <primitive object={new Line2(geometry, material)} />;
}