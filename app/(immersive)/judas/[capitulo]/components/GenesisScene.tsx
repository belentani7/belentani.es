'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Planeta procedural vivo + atmósfera fresnel + disco de acreción rojo */
export function GenesisScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 8, 36], fov: 42 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={['#030008']} />
      <Stars radius={200} depth={100} count={3500} factor={3.5} saturation={0} fade speed={reduced ? 0 : 0.2} />
      <ambientLight intensity={0.15} />
      <pointLight position={[20, 30, 10]} intensity={90} color="#ff073a" distance={90} />
      <pointLight position={[-15, -5, -20]} intensity={35} color="#d4af37" distance={70} />
      <directionalLight position={[10, 20, 5]} intensity={0.6} color="#ff6b8a" />
      <Planet reduced={reduced} />
      <Atmosphere />
      <AccretionDisk reduced={reduced} />
      <OrbitControls enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.25} minDistance={18} maxDistance={70} />
    </Canvas>
  );
}

function Planet({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(10, 4);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = 0.35 * Math.sin(v.x * 0.45) * Math.cos(v.y * 0.38) * Math.sin(v.z * 0.41);
      v.setLength(10 + n);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useFrame((_, d) => {
    if (ref.current && !reduced) ref.current.rotation.y += d * 0.08;
  });
  return (
    <mesh ref={ref} geometry={geo}>
      <meshStandardMaterial
        color="#1a050c"
        roughness={0.72}
        metalness={0.22}
        flatShading
        emissive="#3a0210"
        emissiveIntensity={0.28}
      />
    </mesh>
  );
}

function Atmosphere() {
  const uniforms = useMemo(
    () => ({
      c: { value: new THREE.Color('#ff073a') },
      o: { value: 0.85 },
    }),
    []
  );
  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[10, 64, 48]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`varying vec3 n; varying vec3 v; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); n = normalize(normalMatrix*normal); v = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`}
        fragmentShader={`uniform vec3 c; uniform float o; varying vec3 n; varying vec3 v; void main(){ float f = pow(1. - max(dot(n,v),0.), 3.2); gl_FragColor = vec4(c*f*2.4, f*o); }`}
      />
    </mesh>
  );
}

function AccretionDisk({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 2200;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const red = new THREE.Color('#ff073a');
    const gold = new THREE.Color('#d4af37');
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.25;
      const r = 12.5 + Math.random() * 10;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.1;
      pos[i * 3 + 2] = Math.sin(a) * r;
      const c = Math.random() > 0.78 ? gold : red;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, []);
  useFrame((_, d) => {
    if (ref.current && !reduced) ref.current.rotation.y += d * 0.12;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.2} vertexColors transparent opacity={0.78} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}
