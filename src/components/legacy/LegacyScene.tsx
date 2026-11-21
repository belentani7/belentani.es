'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { WORLDS, type World } from './worlds';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAudio;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
               mix(hash(i + vec2(0., 1.)), hash(i + 1.), f.x), f.y);
  }
  void main() {
    vec2 p = (vUv - 0.5) * vec2(2.4, 1.5);
    float radius = length(p);
    float n = noise(p * 3.2 + vec2(uTime * 0.08, -uTime * 0.04));
    n += 0.5 * noise(p * 7.1 - vec2(uTime * 0.1, 0.0));
    float aperture = exp(-radius * radius * 2.9);
    float halo = exp(-abs(radius - 0.38) * 12.0) * (0.35 + 0.55 * n);
    float vein = pow(max(0.0, sin(atan(p.y, p.x) * 9.0 + radius * 26.0 - uTime * 0.2)), 18.0);
    vec3 voidColor = vec3(0.008, 0.003, 0.016);
    vec3 red = vec3(0.42, 0.012, 0.065) * (halo + vein * aperture * 0.28);
    vec3 gold = vec3(0.33, 0.19, 0.065) * max(0.0, n - 0.72) * aperture;
    vec3 color = voidColor + red * (1.0 + uAudio * 0.85) + gold;
    color += vec3(0.08, 0.02, 0.04) * aperture * max(0.0, n - 0.55);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function VoidField({ energy, reduced }: { energy: MutableRefObject<number>; reduced: boolean }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAudio: { value: 0 } },
    vertexShader,
    fragmentShader,
    depthWrite: false,
  }), []);
  useEffect(() => () => material.dispose(), [material]);
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = reduced ? 0 : clock.elapsedTime;
    material.uniforms.uAudio.value = energy.current;
  });
  return (
    <mesh position={[0, 0, -9]} scale={[38, 25, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Cathedral({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.y += Math.min(delta, 0.05) * 0.018;
  });
  return (
    <group ref={ref} position={[0, -3.65, -2.6]}>
      {Array.from({ length: 11 }, (_, index) => {
        const x = (index - 5) * 1.55;
        const height = index === 5 ? 3.9 : 1.35 + (5 - Math.abs(index - 5)) * 0.27;
        return (
          <group key={index} position={[x, 0, Math.abs(index - 5) * -0.3]}>
            <mesh position={[0, height * 0.5, 0]}>
              <cylinderGeometry args={[0.12, 0.24, height, 5]} />
              <meshStandardMaterial color="#08060c" metalness={0.72} roughness={0.42} />
            </mesh>
            <mesh position={[0, height + 0.45, 0]}>
              <coneGeometry args={[0.28, 0.9, 5]} />
              <meshStandardMaterial color="#170b12" metalness={0.75} roughness={0.3} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[19, 0.3, 1.5]} />
        <meshStandardMaterial color="#13070e" metalness={0.55} roughness={0.45} />
      </mesh>
    </group>
  );
}

function Planet({ world, active, reduced, onSelect }: {
  world: World;
  active: boolean;
  reduced: boolean;
  onSelect: (id: World['id']) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += Math.min(delta, 0.05) * (active ? 0.22 : 0.08);
    ref.current.position.y = world.coordinates[1] + Math.sin(state.clock.elapsedTime * 0.5 + world.coordinates[0]) * 0.07;
  });
  return (
    <group ref={ref} position={[...world.coordinates]}>
      <mesh onClick={(event) => { event.stopPropagation(); onSelect(world.id); }}
        onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = ''; }} scale={active ? 1.1 : 0.84}>
        <icosahedronGeometry args={[0.82, 4]} />
        <meshPhysicalMaterial color="#170d18" metalness={0.48} roughness={0.4}
          emissive={world.accent} emissiveIntensity={active ? 0.44 : 0.17}
          clearcoat={0.8} clearcoatRoughness={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2.75, 0.2, 0]}>
        <torusGeometry args={[1.22, active ? 0.018 : 0.01, 6, 100]} />
        <meshBasicMaterial color={world.accent} transparent opacity={active ? 0.8 : 0.36} />
      </mesh>
      {active && <pointLight color={world.accent} intensity={6} distance={8} />}
    </group>
  );
}

export default function LegacyScene({ selected, energy, reduced, onSelect }: {
  selected: World['id'];
  energy: MutableRefObject<number>;
  reduced: boolean;
  onSelect: (id: World['id']) => void;
}) {
  useEffect(() => () => { document.body.style.cursor = ''; }, []);
  return (
    <Canvas camera={{ position: [0, 0.2, 12.8], fov: 49 }} dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}>
      <color attach="background" args={['#030008']} />
      <VoidField energy={energy} reduced={reduced} />
      <Stars radius={90} depth={40} count={1600} factor={2.4} saturation={0} fade speed={reduced ? 0 : 0.12} />
      <ambientLight intensity={0.5} />
      <pointLight position={[-5, 4, 4]} color="#ff174d" intensity={25} distance={25} />
      <pointLight position={[5, -2, 5]} color="#d4af37" intensity={12} distance={22} />
      <Cathedral reduced={reduced} />
      {WORLDS.map((world) => (
        <Planet key={world.id} world={world} active={selected === world.id}
          reduced={reduced} onSelect={onSelect} />
      ))}
    </Canvas>
  );
}
