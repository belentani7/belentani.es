// Monumentos del lore: un set simbólico por estación, todo procedural (sin modelos externos).
// Canon: espejo en el desierto (oro viejo), sexto piso, vela y polilla, el beso / 30 monedas,
// agua·sal·llave + cadena y candado entreabierto, plumas blancas/negras + cruz y su sombra invertida.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { frame, stationT, state } from "./journey.js";
import { audio } from "./audio.js";

const GOLD = { color: "#c9a24a", metalness: 1, roughness: 0.28 };
const OLD_GOLD = { color: "#8a6a2c", metalness: 1, roughness: 0.42 };
const rand = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(1234567);

// posición de cada monumento: junto a la ruta, por delante de la estación
export const monumentPose = s => {
  const { p, side, up, tan } = frame(stationT(s) + 0.034);
  const pos = p.clone().addScaledVector(side, s % 2 ? 62 : -62).addScaledVector(up, 6);
  const look = pos.clone().addScaledVector(side, s % 2 ? -1 : 1).addScaledVector(tan, -0.6);
  return { pos, look };
};

function Facing({ s, children }) {
  const ref = useRef();
  const { pos, look } = useMemo(() => monumentPose(s), [s]);
  useMemo(() => { if (ref.current) ref.current.lookAt(look); }, [look]);
  return <group ref={el => { ref.current = el; el && el.lookAt(look); }} position={pos}>{children}</group>;
}

/* 1 · GÉNESIS — espejo ovalado de oro viejo sobre arena, reflejando el cielo */
function Mirror() {
  const glass = useRef(), sand = useRef(), mirror = useRef();
  const sandGeo = useMemo(() => {
    const g = new THREE.CircleGeometry(48, 160, 0, Math.PI * 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y);
      p.setZ(i, Math.sin(x * 0.18) * Math.cos(y * 0.11) * 1.6 * (1 - r / 48) + Math.sin(x * 0.7 + y * 0.3) * 0.25);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useFrame((_, dt) => {
    if (state.reduce) return;
    mirror.current.material.envMapIntensity = 1.6 + audio.mid * 3;
    glass.current.rotation.y = Math.sin(performance.now() * 0.0002) * 0.12;
  });
  return (
    <group>
      <mesh ref={sand} geometry={sandGeo} rotation-x={-Math.PI / 2} position-y={-14}>
        <meshStandardMaterial color="#5a3b22" roughness={1} />
      </mesh>
      <group ref={glass} position-y={2} scale={[1, 1.45, 1]}>
        <mesh ref={mirror}>
          <circleGeometry args={[9, 96]} />
          <meshStandardMaterial color="#d8d8e0" metalness={1} roughness={0.02} envMapIntensity={1.6} />
        </mesh>
        <mesh>
          <torusGeometry args={[9.6, 0.9, 24, 160]} />
          <meshStandardMaterial {...OLD_GOLD} />
        </mesh>
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 10.6, Math.sin(a) * 10.6, 0]} rotation-z={a}>
              <coneGeometry args={[0.45, 1.6, 6]} />
              <meshStandardMaterial {...GOLD} />
            </mesh>
          );
        })}
      </group>
      <mesh position={[0, -14 + 0.5, 0]}>
        <cylinderGeometry args={[0.6, 1.4, 4, 12]} />
        <meshStandardMaterial {...OLD_GOLD} />
      </mesh>
    </group>
  );
}

/* 2 · LA INVITACIÓN — ascensor de luz: seis pisos que suben sin mapa */
function Elevator() {
  const floors = useRef([]), beam = useRef();
  useFrame(() => {
    const t = state.reduce ? 0 : performance.now() * 0.00025;
    floors.current.forEach((m, i) => {
      if (!m) return;
      const y = (((i / 6 + t) % 1) * 60) - 30;
      m.position.y = y;
      const f = 1 - Math.abs(y) / 30;
      m.material.opacity = f * 0.9;
      m.scale.setScalar(1 + audio.beat * 0.15 * f);
    });
    beam.current.material.opacity = 0.18 + audio.bass * 0.35;
  });
  return (
    <group>
      <mesh ref={beam}>
        <cylinderGeometry args={[5, 5, 64, 48, 1, true]} />
        <meshBasicMaterial color="#ff2a5f" transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} ref={el => (floors.current[i] = el)} rotation-x={Math.PI / 2}>
          <torusGeometry args={[8, 0.22, 12, 120]} />
          <meshBasicMaterial color={i === 5 ? "#ffd38a" : "#ff073a"} transparent toneMapped={false} />
        </mesh>
      ))}
      <mesh position-y={33}>
        <boxGeometry args={[4, 0.4, 4]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  );
}

/* 3 · EL EXCESO — vela con llama de shader y polillas en órbita */
const flameVert = `varying vec2 vUv; uniform float uT; void main(){ vUv = uv; vec3 p = position;
  p.x += sin(uT*6. + p.y*2.)*0.12*uv.y; gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.); }`;
const flameFrag = `varying vec2 vUv; uniform float uT, uA; void main(){
  vec2 c = vUv - vec2(.5,.3); c.x *= 2.2 + vUv.y*2.;
  float d = length(c) - .28*(1.-vUv.y);
  float f = smoothstep(.08, -.12, d) * smoothstep(1., .55, vUv.y);
  vec3 col = mix(vec3(1.,.35,.05), vec3(1.,.95,.75), smoothstep(.0,.6,f));
  gl_FragColor = vec4(col*(2.2+uA*2.), f); }`;
function Candle() {
  const moths = useRef(), flame = useRef();
  const N = 90;
  const seeds = useMemo(() => Array.from({ length: N }, () => [rand() * 6.28, 5 + rand() * 12, rand() * 10 - 2, 0.3 + rand() * 0.7]), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const uni = useMemo(() => ({ uT: { value: 0 }, uA: { value: 0 } }), []);
  useFrame(({ camera }, dt) => {
    flame.current.quaternion.copy(camera.quaternion);
    if (state.reduce) { uni.uT.value = 0; uni.uA.value = 0; }
    else { uni.uT.value += dt; uni.uA.value = audio.level; }
    const t = uni.uT.value;
    seeds.forEach(([a, r, y, sp], i) => {
      const ang = a + t * sp * (1 + audio.mid);
      const rr = r * (0.75 + 0.25 * Math.sin(t * sp * 2 + a));
      dummy.position.set(Math.cos(ang) * rr, y + 9 + Math.sin(t * 3 * sp + a) * 1.5, Math.sin(ang) * rr);
      dummy.rotation.set(Math.sin(t * 20 + i) * 0.8, -ang, 0);
      dummy.scale.setScalar(0.5 + (i % 3) * 0.2);
      dummy.updateMatrix();
      moths.current.setMatrixAt(i, dummy.matrix);
    });
    moths.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group position-y={-8}>
      <mesh position-y={2}>
        <cylinderGeometry args={[2.2, 2.4, 14, 48]} />
        <meshStandardMaterial color="#f3e6d2" roughness={0.6} emissive="#ff8a3a" emissiveIntensity={0.08} />
      </mesh>
      <mesh position-y={-5.4}>
        <cylinderGeometry args={[4.5, 5.2, 1.2, 48]} />
        <meshStandardMaterial {...OLD_GOLD} />
      </mesh>
      <mesh ref={flame} position-y={11.4}>
        <planeGeometry args={[2.4, 5, 1, 24]} />
        <shaderMaterial vertexShader={flameVert} fragmentShader={flameFrag} uniforms={uni} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight position-y={12} color="#ffa04a" intensity={60} distance={70} decay={1.6} />
      <instancedMesh ref={moths} args={[null, null, N]}>
        <planeGeometry args={[1.1, 0.6]} />
        <meshStandardMaterial color="#c8b8a0" side={THREE.DoubleSide} roughness={1} transparent opacity={0.9} />
      </instancedMesh>
    </group>
  );
}

/* 4 · LA TRAICIÓN — treinta monedas de plata alrededor de un beso de luz roja */
function Kiss() {
  const coins = useRef(), heart = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const t = state.reduce ? 0 : performance.now() * 0.001;
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2 + t * 0.25, r = 14 + Math.sin(t + i) * 1.2;
      dummy.position.set(Math.cos(a) * r, Math.sin(a * 3 + t) * 2.5, Math.sin(a) * r);
      dummy.rotation.set(t * 1.3 + i, a, 0.4);
      dummy.updateMatrix();
      coins.current.setMatrixAt(i, dummy.matrix);
    }
    coins.current.instanceMatrix.needsUpdate = true;
    const s = 1 + audio.beat * 0.25 + Math.sin(t * 1.3) * 0.04;
    heart.current.scale.setScalar(s);
  });
  return (
    <group>
      <instancedMesh ref={coins} args={[null, null, 30]}>
        <cylinderGeometry args={[1.1, 1.1, 0.16, 40]} />
        <meshStandardMaterial color="#d9dde3" metalness={1} roughness={0.22} />
      </instancedMesh>
      <group ref={heart}>
        {[-1, 1].map(side => (
          <mesh key={side} position={[side * 2.6, 0, 0]} rotation-y={side * 0.35}>
            <torusKnotGeometry args={[2.4, 0.55, 160, 16, 2, 3]} />
            <meshStandardMaterial color="#2a0008" emissive="#ff073a" emissiveIntensity={2.2} metalness={0.5} roughness={0.3} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <pointLight color="#ff073a" intensity={40} distance={60} decay={1.6} />
    </group>
  );
}

/* 5 · LA DEUDA — esfera de agua salada, llave dorada y cadena con candado entreabierto */
function Debt() {
  const water = useRef(), key = useRef(), chain = useRef();
  const links = 22;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const t = state.reduce ? 0 : performance.now() * 0.001;
    water.current.rotation.y = t * 0.1;
    water.current.material.thickness = 4 + audio.bass * 6;
    key.current.rotation.set(Math.sin(t * 0.5) * 0.3, t * 0.4, Math.cos(t * 0.3) * 0.2);
    for (let i = 0; i < links; i++) {
      const u = i / (links - 1), a = u * Math.PI * 1.6 - 0.8;
      dummy.position.set(Math.sin(a) * 18, -10 + Math.cos(a * 2 + t * 0.6) * 1.5 - u * 2, Math.cos(a) * 18 - 18 + 8);
      dummy.rotation.set(0, a, i % 2 ? Math.PI / 2 : 0);
      dummy.updateMatrix();
      chain.current.setMatrixAt(i, dummy.matrix);
    }
    chain.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <mesh ref={water}>
        <icosahedronGeometry args={[10, 24]} />
        <meshPhysicalMaterial color="#9fd9ff" transmission={1} thickness={4} roughness={0.04} ior={1.34} clearcoat={1} attenuationColor="#2d6c8a" attenuationDistance={18} />
      </mesh>
      <group ref={key} scale={0.9}>
        <mesh position-x={-3.2}><torusGeometry args={[1.8, 0.45, 16, 48]} /><meshStandardMaterial {...GOLD} /></mesh>
        <mesh position-x={1.2} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.32, 0.32, 7, 16]} /><meshStandardMaterial {...GOLD} /></mesh>
        {[0, 1, 2].map(i => (
          <mesh key={i} position={[3.4 - i * 0.9, -0.8 - (i % 2) * 0.3, 0]}><boxGeometry args={[0.5, 1.2 + (i % 2) * 0.5, 0.35]} /><meshStandardMaterial {...GOLD} /></mesh>
        ))}
      </group>
      <instancedMesh ref={chain} args={[null, null, links]}>
        <torusGeometry args={[1.2, 0.28, 10, 28]} />
        <meshStandardMaterial color="#8d8f96" metalness={1} roughness={0.35} />
      </instancedMesh>
      <group position={[13, -13, 2]}>
        <mesh><boxGeometry args={[4.2, 3.6, 1.6]} /><meshStandardMaterial {...OLD_GOLD} /></mesh>
        {/* grillete entreabierto: un arco alzado y girado */}
        <mesh position={[0.4, 3, 0]} rotation={[0, 0.5, 0]}><torusGeometry args={[1.5, 0.3, 12, 40, Math.PI]} /><meshStandardMaterial color="#9a9ca3" metalness={1} roughness={0.3} /></mesh>
      </group>
    </group>
  );
}

/* 6 · LA REDENCIÓN — plumas blancas y negras que caen; la cruz y su sombra invertida */
function Feathers() {
  const white = useRef(), black = useRef();
  const N = 140;
  const seeds = useMemo(() => Array.from({ length: N * 2 }, () => [rand() * 40 - 20, rand() * 60, rand() * 40 - 20, rand() * 6.28, 0.5 + rand()]), []);
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -1.6); s.quadraticCurveTo(0.7, -0.2, 0.18, 1.6); s.quadraticCurveTo(-0.5, 0.2, 0, -1.6);
    return new THREE.ShapeGeometry(s, 12);
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const t = state.reduce ? 0 : performance.now() * 0.001;
    [white, black].forEach((ref, k) => {
      for (let i = 0; i < N; i++) {
        const [x, y0, z, ph, sp] = seeds[i + k * N];
        const y = 30 - ((y0 + t * 2.2 * sp) % 60);
        dummy.position.set(x + Math.sin(t * sp + ph) * 2.5, y, z + Math.cos(t * sp * 0.7 + ph) * 2);
        dummy.rotation.set(Math.sin(t * sp + ph) * 0.9, t * 0.5 * sp + ph, Math.cos(t * sp + ph) * 0.6);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
    });
  });
  return (
    <group>
      <instancedMesh ref={white} args={[geo, null, N]}>
        <meshStandardMaterial color="#f4f1ec" side={THREE.DoubleSide} roughness={0.9} emissive="#ffffff" emissiveIntensity={0.08} />
      </instancedMesh>
      <instancedMesh ref={black} args={[geo, null, N]}>
        <meshStandardMaterial color="#0d0a0c" side={THREE.DoubleSide} roughness={0.6} metalness={0.2} />
      </instancedMesh>
      <group position-y={6}>
        <mesh><boxGeometry args={[1.6, 18, 1.6]} /><meshStandardMaterial color="#1a0006" emissive="#ff073a" emissiveIntensity={1.4} toneMapped={false} /></mesh>
        <mesh position-y={4}><boxGeometry args={[10, 1.6, 1.6]} /><meshStandardMaterial color="#1a0006" emissive="#ff073a" emissiveIntensity={1.4} toneMapped={false} /></mesh>
      </group>
      {/* sombra invertida: la misma cruz, boca abajo, en oscuro */}
      <group position-y={-16} rotation-z={Math.PI}>
        <mesh><boxGeometry args={[1.6, 18, 1.6]} /><meshStandardMaterial color="#050003" roughness={1} transparent opacity={0.85} /></mesh>
        <mesh position-y={4}><boxGeometry args={[10, 1.6, 1.6]} /><meshStandardMaterial color="#050003" roughness={1} transparent opacity={0.85} /></mesh>
      </group>
    </group>
  );
}

const SETS = [Mirror, Elevator, Candle, Kiss, Debt, Feathers];

export function Monuments() {
  return SETS.map((C, s) => <Facing key={s} s={s}><C /></Facing>);
}
