'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef, type ComponentRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { VoyagePlace } from '@/lib/voyage-places';
import {
  atmosphereFragment, celestialVertex, cloudFragment, planetFragment, starFragment, starVertex,
} from './CelestialMaterials';

/** Atlas propio: CanonCosmos + Visual Engine + la nave del mapa orbital. */
export function placePosition(index: number, total: number): THREE.Vector3 {
  if (index === 0) return new THREE.Vector3();
  const angle = index * 2.399963229728653;
  const ring = index / Math.max(1, total - 1);
  const radius = 6.4 + Math.sqrt(ring) * 23.5 + (index % 3) * 0.45;
  const height = Math.sin(index * 2.3) * (1.4 + ring * 2.2);
  return new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
}

export function VoyageMap({
  places, currentId, onSelect, interactive = false, focusId = null, resetToken = 0,
}: {
  places: VoyagePlace[];
  currentId: string;
  onSelect: (id: string) => void;
  interactive?: boolean;
  focusId?: string | null;
  resetToken?: number;
}) {
  const reduced = useReducedMotion();
  useEffect(() => () => { document.body.style.cursor = ''; }, []);
  return (
    <Canvas
      camera={{ position: [0, 31, 48], fov: 48, near: 0.08, far: 520 }}
      dpr={[1, interactive ? 1.55 : 1.3]}
      frameloop={reduced ? 'demand' : 'always'}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.18;
      }}
      style={{ touchAction: interactive ? 'none' : 'auto' }}
    >
      <color attach="background" args={['#030208']} />
      <fog attach="fog" args={['#030208', 90, 280]} />
      <Stars radius={240} depth={120} count={reduced ? 1200 : 4200} factor={3.4} saturation={0.25} fade speed={reduced ? 0 : 0.12} />
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 5, 1]} color="#ff174d" intensity={72} distance={42} />
      <pointLight position={[-11, 6, -10]} color="#d4af37" intensity={20} distance={48} />
      <pointLight position={[18, -5, 16]} color="#4de8e0" intensity={10} distance={58} />
      <GalaxyDust count={interactive && !reduced ? 22000 : 9000} reduced={reduced} />
      <GalaxyRoutes places={places} currentId={currentId} />
      {places.map((place, index) => (
        <PlanetNode key={place.id} place={place} index={index} total={places.length}
          active={place.id === currentId} reduced={reduced} showLabel={interactive} onSelect={onSelect} />
      ))}
      <VoyageShip places={places} currentId={currentId} reduced={reduced} />
      {interactive && <CameraFlight places={places} focusId={focusId} resetToken={resetToken} reduced={reduced} />}
    </Canvas>
  );
}

function GalaxyDust({ count, reduced }: { count: number; reduced: boolean }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = ['#ff294f', '#9e183c', '#d7a562', '#faecdf', '#562052', '#4de8e0'].map((c) => new THREE.Color(c));
    let seed = 17091988;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < count; i++) {
      const arm = i % 6;
      const radius = Math.pow(random(), 0.7) * 39 + 0.25;
      const angle = arm * Math.PI * 2 / 6 + radius * 0.34 + (random() - 0.5) * 0.46;
      const spread = (random() - 0.5) * (0.4 + radius * 0.18);
      positions[i * 3] = Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * spread;
      positions[i * 3 + 1] = (random() - 0.5) * (0.3 + radius * 0.15);
      positions[i * 3 + 2] = Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * spread;
      const pick = random();
      const color = palette[pick > 0.985 ? 5 : pick > 0.96 ? 3 : pick > 0.82 ? 2 : pick > 0.32 ? 0 : pick > 0.08 ? 1 : 4];
      colors.set([color.r, color.g, color.b], i * 3);
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    result.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return result;
  }, [count]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: starVertex, fragmentShader: starFragment,
    uniforms: { uSize: { value: 78 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), []);
  const points = useRef<THREE.Points>(null);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useFrame((_, delta) => { if (points.current && !reduced) points.current.rotation.y += Math.min(delta, 0.05) * 0.013; });
  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

function PlanetNode({
  place, index, total, active, reduced, showLabel, onSelect,
}: {
  place: VoyagePlace; index: number; total: number; active: boolean; reduced: boolean;
  showLabel: boolean; onSelect: (id: string) => void;
}) {
  const position = useMemo(() => placePosition(index, total), [index, total]);
  const radius = index === 0 ? 1.52 : 0.66 + (index % 5) * 0.11;
  const body = useRef<THREE.Group>(null);
  const surface = useRef<THREE.ShaderMaterial>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const beacon = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(place.accent), [place.accent]);
  const dark = useMemo(() => color.clone().multiplyScalar(index === 0 ? 0.11 : 0.21), [color, index]);
  const surfaceUniforms = useMemo(() => ({
    uColor: { value: color }, uShadow: { value: dark }, uSeed: { value: index * 1.67 },
    uKind: { value: index === 0 ? 2 : index % 4 === 0 ? 1 : index % 3 === 0 ? 2 : 0 },
    uTime: { value: 0 },
  }), [color, dark, index]);
  const airUniforms = useMemo(() => ({ uColor: { value: color } }), [color]);
  const cloudUniforms = useMemo(() => ({ uSeed: { value: index * 1.67 }, uTime: { value: 0 } }), [index]);
  useFrame((state, delta) => {
    if (body.current && !reduced) body.current.rotation.y += Math.min(delta, 0.05) * (active ? 0.18 : 0.06);
    if (surface.current) surface.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (clouds.current && !reduced) clouds.current.rotation.y += Math.min(delta, 0.05) * 0.011;
    if (beacon.current && !reduced) {
      beacon.current.rotation.y -= Math.min(delta, 0.05) * (active ? 0.72 : 0.24);
      beacon.current.position.y = radius * 1.72 + Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.08;
    }
  });
  return (
    <group position={position}>
      <group ref={body} rotation={[0.15 + index * 0.08, index * 0.7, 0.12]}>
        <mesh onClick={(event) => { event.stopPropagation(); onSelect(place.id); }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = ''; }}>
          <sphereGeometry args={[radius, 64, 48]} />
          <shaderMaterial ref={surface} uniforms={surfaceUniforms} vertexShader={celestialVertex} fragmentShader={planetFragment} />
        </mesh>
        <mesh scale={1.105}>
          <sphereGeometry args={[radius, 48, 32]} />
          <shaderMaterial uniforms={airUniforms} vertexShader={celestialVertex} fragmentShader={atmosphereFragment}
            transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.FrontSide} />
        </mesh>
        {index % 3 !== 1 && index !== 0 && (
          <mesh ref={clouds} scale={1.018}>
            <sphereGeometry args={[radius, 40, 24]} />
            <shaderMaterial uniforms={cloudUniforms} vertexShader={celestialVertex} fragmentShader={cloudFragment}
              transparent depthWrite={false} />
          </mesh>
        )}
        {(index === 0 || index % 4 === 1) && (
          <group rotation={[0.28, 0, 0.38]}>
            {[1.4, 1.62, 1.83].map((size, i) => (
              <mesh key={size} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius * size, radius * (size + 0.055), 128]} />
                <meshBasicMaterial color={i === 1 ? '#d4af37' : place.accent}
                  side={THREE.DoubleSide} transparent opacity={i === 1 ? 0.48 : 0.24} depthWrite={false} />
              </mesh>
            ))}
          </group>
        )}
        {index !== 0 && index % 3 === 0 && (
          <mesh position={[radius * 1.8, radius * 0.4, -radius * 0.5]}>
            <icosahedronGeometry args={[radius * 0.12, 2]} />
            <meshStandardMaterial color="#b6a4a4" roughness={0.9} />
          </mesh>
        )}
      </group>
      <mesh ref={beacon} position={[0, radius * 1.72, 0]} scale={active ? 0.28 : 0.18}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial color={place.accent} transmission={0.72} thickness={1.2}
          ior={2.1} roughness={0.04} metalness={0.02} transparent opacity={active ? 0.88 : 0.58} />
      </mesh>
      <pointLight position={[0, radius * 1.7, 0.8]} color={place.accent} intensity={active ? 3.4 : 1.1} distance={5} />
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -radius * 1.55, 0]}>
          <ringGeometry args={[radius * 1.7, radius * 1.74, 96]} />
          <meshBasicMaterial color={place.accent} side={THREE.DoubleSide} transparent opacity={0.6} depthWrite={false} />
        </mesh>
      )}
      {showLabel && (
        <Html position={[0, radius * 2.25, 0]} center style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          <span style={{ font: '700 10px/1.2 system-ui', letterSpacing: '.18em', color: '#fff4ee',
            textShadow: '0 2px 10px #000, 0 0 12px #000', opacity: active ? 1 : .78 }}>{place.title}</span>
        </Html>
      )}
    </group>
  );
}

function GalaxyRoutes({ places, currentId }: { places: VoyagePlace[]; currentId: string }) {
  const positions = useMemo(() => places.map((_, i) => placePosition(i, places.length)), [places]);
  return (
    <group>
      {places.slice(1).map((place, i) => (
        <Line key={place.id} points={[positions[0], positions[i + 1]]}
          color={currentId === place.id ? '#d4af37' : '#74263c'}
          lineWidth={currentId === place.id ? 1.7 : 0.64}
          transparent opacity={currentId === place.id ? 0.58 : 0.22} depthWrite={false} />
      ))}
      {places.slice(3).filter((_, i) => i % 3 === 0).map((place) => {
        const index = places.findIndex((item) => item.id === place.id);
        const previous = Math.max(1, index - 2);
        return (
          <Line key={`cross-${place.id}`} points={[positions[previous], positions[index]]}
            color={currentId === place.id ? '#4de8e0' : '#3a263d'} lineWidth={0.52}
            transparent opacity={currentId === place.id ? 0.45 : 0.14} depthWrite={false} />
        );
      })}
    </group>
  );
}

/** Silueta espacial propia, inspirada en el marcador Ship.tsx y el portal 3D. */
function VoyageShip({ places, currentId, reduced }: { places: VoyagePlace[]; currentId: string; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const engine = useRef<THREE.Mesh>(null);
  const index = Math.max(0, places.findIndex((place) => place.id === currentId));
  const destination = useMemo(() => placePosition(index, places.length).add(new THREE.Vector3(1.3, 0.65, 1.9)),
    [index, places.length]);
  useFrame((state, delta) => {
    if (!group.current) return;
    if (reduced) group.current.position.copy(destination);
    else group.current.position.lerp(destination, 1 - Math.exp(-Math.min(delta, 0.05) * 1.6));
    group.current.lookAt(destination.clone().add(new THREE.Vector3(0.3, 0.1, -2)));
    if (engine.current && !reduced) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 11) * 0.18;
      engine.current.scale.setScalar(pulse);
    }
  });
  return (
    <group ref={group} position={[2, 1, 6]} scale={0.62}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.37, 2.7, 5]} />
        <meshStandardMaterial color="#b6a19f" metalness={0.83} roughness={0.23} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.8, -0.06, -0.22]} rotation={[0, side * -0.13, side * 0.12]}>
            <boxGeometry args={[1.45, 0.065, 0.7]} />
            <meshStandardMaterial color="#361923" metalness={0.78} roughness={0.29} />
          </mesh>
          <mesh position={[side * 1.48, 0.02, -0.15]}>
            <boxGeometry args={[0.08, 0.16, 0.62]} />
            <meshBasicMaterial color="#ff335a" />
          </mesh>
          <mesh position={[side * 0.35, -0.02, -0.85]}>
            <cylinderGeometry args={[0.12, 0.16, 0.44, 12]} />
            <meshStandardMaterial color="#a18d91" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.23, 0.22]} scale={[0.29, 0.18, 0.65]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshPhysicalMaterial color="#e8a5a2" transmission={0.4} metalness={0.36} roughness={0.11} />
      </mesh>
      <mesh ref={engine} position={[0, 0, -1.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.9, 18]} />
        <meshBasicMaterial color="#ff174d" transparent opacity={0.62} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0, -0.9]} color="#ff174d" intensity={3.6} distance={3.4} />
    </group>
  );
}

function CameraFlight({
  places, focusId, resetToken, reduced,
}: {
  places: VoyagePlace[]; focusId: string | null; resetToken: number; reduced: boolean;
}) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, invalidate } = useThree();
  const flight = useRef<{
    from: THREE.Vector3; to: THREE.Vector3; lookFrom: THREE.Vector3; lookTo: THREE.Vector3; elapsed: number;
  } | null>(null);
  useEffect(() => {
    const index = places.findIndex((place) => place.id === focusId);
    const target = index < 0 ? new THREE.Vector3() : placePosition(index, places.length);
    const offset = index < 0 ? new THREE.Vector3(0, 31, 48)
      : new THREE.Vector3(2.3, 2.5, 5.6).normalize().multiplyScalar(index === 0 ? 9.2 : 6.3);
    if (!controls.current) return;
    if (reduced) {
      camera.position.copy(target.clone().add(offset));
      controls.current.target.copy(target);
      controls.current.update();
      invalidate();
      return;
    }
    flight.current = {
      from: camera.position.clone(), to: target.clone().add(offset),
      lookFrom: controls.current.target.clone(), lookTo: target, elapsed: 0,
    };
  }, [focusId, resetToken, places, camera, reduced, invalidate]);
  useFrame((_, delta) => {
    const state = flight.current;
    if (!state || !controls.current) return;
    state.elapsed = Math.min(1.4, state.elapsed + Math.min(delta, 0.05));
    const t = THREE.MathUtils.smoothstep(state.elapsed / 1.4, 0, 1);
    camera.position.lerpVectors(state.from, state.to, t);
    controls.current.target.lerpVectors(state.lookFrom, state.lookTo, t);
    controls.current.update();
    if (state.elapsed >= 1.4) flight.current = null;
  });
  return (
    <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.08}
      enablePan enableZoom enableRotate minDistance={2.7} maxDistance={128}
      minPolarAngle={0.08} maxPolarAngle={Math.PI - 0.08}
      onChange={() => invalidate()} />
  );
}
