'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ARCHETYPES, type ArchetypeId } from '@/lib/archetypes';

/** Crown, girdle and pavilion are separate flat facets so the light breaks at each edge. */
function diamondGeometry() {
  const segments = 12;
  const vertices: number[] = [];
  const add = (a: number[], b: number[], c: number[]) => vertices.push(...a, ...b, ...c);
  const ring = (i: number, radius: number, y: number) => {
    const angle = (i / segments) * Math.PI * 2;
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
  };
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    add(ring(i, .42, .56), ring(i, 1, .08), ring(next, 1, .08));
    add(ring(i, .42, .56), ring(next, 1, .08), ring(next, .42, .56));
    add(ring(i, .42, .56), ring(next, .42, .56), [0, .67, 0]);
    add(ring(i, 1, .08), ring(i, 1, -.08), ring(next, 1, .08));
    add(ring(next, 1, .08), ring(i, 1, -.08), ring(next, 1, -.08));
    add(ring(i, 1, -.08), [0, -.9, 0], ring(next, 1, -.08));
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function Gem({ index, id, color, active, reduced, onSelect }: {
  index: number; id: ArchetypeId; color: string; active: boolean; reduced: boolean;
  onSelect: (id: ArchetypeId) => void;
}) {
  const geometry = useMemo(diamondGeometry, []);
  const group = useRef<THREE.Group>(null);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color), metalness: 0, roughness: .035,
    transmission: .89, thickness: 1.6, ior: 2.2,
    attenuationColor: new THREE.Color(color), attenuationDistance: 2.5,
    clearcoat: 1, clearcoatRoughness: .025,
  }), [color]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useFrame(({ clock }, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += Math.min(delta, .05) * (active ? .48 : .18);
    group.current.rotation.z = Math.sin(clock.elapsedTime * .5 + index) * .055;
    group.current.position.y = Math.sin(clock.elapsedTime * .8 + index * 1.3) * .12;
  });
  return <group position={[(index - 2) * 2.18, 0, index === 2 ? .75 : -.15]} ref={group}>
    <mesh
      geometry={geometry} material={material} scale={active ? 1.06 : .76}
      onClick={(event) => { event.stopPropagation(); onSelect(id); }}
      onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = ''; }}
    />
    <mesh scale={active ? .42 : .3}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} transparent opacity={active ? .22 : .1} depthWrite={false} />
    </mesh>
    <pointLight position={[0, -.5, 1]} color={color} intensity={active ? 3.5 : 1.3} distance={3} />
  </group>;
}

export default function ArchetypeDiamonds({ activeId, reduced, onSelect }: {
  activeId: ArchetypeId; reduced: boolean; onSelect: (id: ArchetypeId) => void;
}) {
  useEffect(() => () => { document.body.style.cursor = ''; }, []);
  return <Canvas aria-label="Cinco diamantes, cinco firmas" camera={{ position: [0, 0, 12.5], fov: 43 }}
    dpr={[1, 1.5]} frameloop={reduced ? 'demand' : 'always'} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <color attach="background" args={['#09040d']} />
    <Stars radius={75} depth={35} count={900} factor={2} saturation={0} fade speed={reduced ? 0 : .1} />
    <ambientLight intensity={1.3} />
    <spotLight position={[-5, 5, 6]} angle={.7} penumbra={.8} color="#ffffff" intensity={80} distance={30} />
    <pointLight position={[5, -3, 4]} color="#ff073a" intensity={55} distance={22} />
    <pointLight position={[0, 4, -2]} color="#4de8e0" intensity={32} distance={18} />
    {ARCHETYPES.map((item, index) => <Gem key={item.id} index={index} id={item.id} color={item.color}
      active={activeId === item.id} reduced={reduced} onSelect={onSelect} />)}
  </Canvas>;
}
