'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer } from '@react-three/drei';
import { Component, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Llave de oro viejo + cadena — geometría válida (sin spread roto de BufferGeometry). */
export function KeyScene() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [view, setView] = useState(0);
  const calm = reduced || paused;
  return (
    <div className="relative h-full w-full bg-[#030008]">
      <SceneBoundary>
      <Canvas
        key={view}
        aria-label="Llave de oro viejo con diamante, cadena y candado entre polvo estelar. Arrastra para girar."
        fallback={<KeyFallback />}
        camera={{ position: [0, 0.8, 11], fov: 42 }}
        frameloop={calm ? 'demand' : 'always'}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <color attach="background" args={['#030008']} />
        <Environment resolution={64}>
          <Lightformer position={[3, 4, 4]} intensity={5} scale={[3, 5, 1]} />
          <Lightformer position={[-4, 1, 2]} intensity={3} color="#d4af37" scale={[2, 4, 1]} />
        </Environment>
        <ambientLight intensity={0.2} />
        <pointLight position={[3, 5, 4]} intensity={40} color="#d4af37" distance={35} />
        <pointLight position={[-4, -1, 2]} intensity={18} color="#ff073a" distance={28} />
        <KeyBody />
        <Chain />
        <LockHalfOpen />
        <DustParticles reduced={calm} />
        <OrbitControls enablePan={false} autoRotate={!calm} autoRotateSpeed={0.45} minDistance={6} maxDistance={18} />
      </Canvas>
      </SceneBoundary>
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-center gap-3">
        <button className="min-h-11 rounded-full border border-[#d4af3766] bg-black/80 px-5 text-sm text-[#e5cc89]" aria-pressed={calm} disabled={reduced} onClick={() => setPaused(value => !value)}>
          {reduced ? 'Movimiento reducido' : paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
        </button>
        <button className="min-h-11 rounded-full border border-[#d4af3766] bg-black/80 px-5 text-sm text-[#e5cc89]" onClick={() => setView(value => value + 1)}>Restablecer vista</button>
      </div>
    </div>
  );
}

function KeyFallback() {
  return <div className="grid h-full place-items-center pb-16" role="img" aria-label="Llave de oro con diamante; representación estática">
    <svg viewBox="0 0 240 300" className="h-full max-h-80 w-60" aria-hidden="true">
      <circle cx="120" cy="70" r="42" fill="none" stroke="#d4af37" strokeWidth="12" />
      <path d="M120 113v133h40v-22h-22v-24h22" fill="none" stroke="#d4af37" strokeWidth="12" />
      <path d="M120 38l26 26-26 37-26-37z" fill="#ece5ff" stroke="#b1a1d2" strokeWidth="2" />
      <path d="M94 64h52M120 38l-8 26 8 37 8-37z" fill="none" stroke="#8d75b0" />
    </svg>
  </div>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <KeyFallback /> : this.props.children; }
}

function DiamondSetting() {
  const diamondMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xfaf7ff,
    transmission: 0.9,
    ior: 2.417,
    thickness: 0.32,
    roughness: 0.015,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 2.2,
    transparent: true,
    opacity: 0.96,
  }), []);
  const settingMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xd4af37,
    metalness: 0.94,
    roughness: 0.16,
    clearcoat: 1,
  }), []);
  return (
    <group position={[0, 1.55, 0.06]}>
      <mesh material={settingMat} scale={[0.56, 0.56, 0.25]}>
        <torusGeometry args={[0.72, 0.08, 12, 32]} />
      </mesh>
      <mesh material={diamondMat} scale={0.5}>
        <octahedronGeometry args={[0.78, 0]} />
      </mesh>
      <pointLight color="#ff073a" intensity={3} distance={3} />
    </group>
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

function KeyBody() {
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

  const mat = useMemo(() => goldMat(), []);

  return (
    <group position={[0, 0.4, 0]} rotation={[0.15, 0.4, 0.1]}>
      <DiamondSetting />
      <mesh geometry={bow} material={mat} position={[0, 1.55, 0]} />
      <mesh geometry={shaft} material={mat} position={[0, 0.05, 0]} />
      <mesh geometry={bit} material={mat} position={[0.35, -1.25, 0]} rotation={[0, 0, -Math.PI / 2]} />
    </group>
  );
}

function Chain() {
  const links = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ color: 0x8a6d1f, metalness: 0.85, roughness: 0.28 });
    return Array.from({ length: 9 }, (_, i) => {
      const geo = new THREE.TorusGeometry(0.18, 0.045, 10, 20);
      return { geo, mat, x: -0.85 + i * 0.3, y: 1.9 - Math.sin(i / 8 * Math.PI / 2) * 3.6, rot: i % 2 === 0 ? Math.PI / 2 : 0 };
    });
  }, []);

  return (
    <group>
      {links.map((l, i) => (
        <mesh key={i} geometry={l.geo} material={l.mat} position={[l.x, l.y, -0.25]} rotation={[0, l.rot, 0.4]} />
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
    <group position={[1.8, -2.25, -0.25]} rotation={[0.2, -0.5, 0.15]}>
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
