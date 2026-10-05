// Planetas fotorreales (Solar System Scope 2K, CC BY 4.0) + atmósfera fresnel + anillos + soles.
import { useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { placed, suns, TEX, FAM, state } from "./journey.js";

const url = n => `./tex/2k_${n}.webp`;

function useTextures() {
  const maps = useLoader(THREE.TextureLoader, TEX.map(url));
  const [ring, sun] = useLoader(THREE.TextureLoader, ["./tex/2k_saturn_ring_alpha.webp", "./tex/2k_sun.webp"]);
  return useMemo(() => {
    const out = {};
    TEX.forEach((n, i) => { maps[i].colorSpace = THREE.SRGBColorSpace; maps[i].anisotropy = 8; out[n] = maps[i]; });
    ring.colorSpace = sun.colorSpace = THREE.SRGBColorSpace;
    return { maps: out, ring, sun };
  }, [maps, ring, sun]);
}

const atmoVert = `varying vec3 n; varying vec3 v; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); n = normalize(normalMatrix*normal); v = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`;
const atmoFrag = `uniform vec3 c; uniform float o; varying vec3 n; varying vec3 v; void main(){ float f = pow(1. - max(dot(n,v),0.), 3.); gl_FragColor = vec4(c*f*2.2, f*o); }`;

const ringGeo = (() => {
  const g = new THREE.RingGeometry(1.24, 2.27, 160, 1), p = g.attributes.position, uv = g.attributes.uv, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); uv.setXY(i, (v.length() - 1.24) / 1.03, 0.5); }
  return g;
})();

function Planet({ p, tex, onOpen }) {
  const body = useRef(), grp = useRef(), atmo = useRef();
  const [hover, setHover] = useState(false);
  const [near, setNear] = useState(false);
  const uniforms = useMemo(() => ({ c: { value: new THREE.Color(FAM[p.fam] || FAM.belentani) }, o: { value: 1 } }), [p.fam]);
  useFrame(({ camera }, dt) => {
    if (!state.reduce) body.current.rotation.y += p.spin * dt;
    const dim = state.filter !== "all" && state.filter !== p.fam;
    const target = dim ? 0.12 : 1;
    uniforms.o.value += (target - uniforms.o.value) * 0.08;
    body.current.material.opacity = uniforms.o.value;
    const s = hover ? 1.12 : 1;
    grp.current.scale.lerp(new THREE.Vector3(s, s, s), 0.15);
    const isNear = camera.position.distanceTo(p.pos) < 170 && !dim;
    if (isNear !== near) setNear(isNear);
  });
  return (
    <group ref={grp} position={p.pos}>
      <group scale={p.radius}>
        <mesh ref={body} rotation-z={p.tilt}
          onPointerOver={e => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
          onClick={e => { e.stopPropagation(); onOpen(p); }}>
          <sphereGeometry args={[1, 96, 64]} />
          <meshStandardMaterial map={tex.maps[p.tex]} roughness={0.95} metalness={0} transparent />
        </mesh>
        <mesh ref={atmo} scale={1.07}>
          <sphereGeometry args={[1, 64, 48]} />
          <shaderMaterial vertexShader={atmoVert} fragmentShader={atmoFrag} uniforms={uniforms}
            transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        {p.ring && (
          <mesh geometry={ringGeo} rotation={[Math.PI / 2 - 0.42, 0.22, 0]}>
            <meshStandardMaterial map={tex.ring} transparent side={THREE.DoubleSide} depthWrite={false} roughness={1} />
          </mesh>
        )}
      </group>
      {(near || hover) && (
        <Html center position={[0, -p.radius - 2.5, 0]} style={{ pointerEvents: "none" }} zIndexRange={[5, 0]}>
          <div className={"plabel " + p.fam}>{p.id}</div>
        </Html>
      )}
    </group>
  );
}

export function Planets({ onOpen }) {
  const tex = useTextures();
  return placed.map(p => <Planet key={p.id} p={p} tex={tex} onOpen={onOpen} />);
}

export function Suns() {
  const tex = useTextures();
  const refs = useRef([]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ map: tex.sun, color: new THREE.Color(2.6, 1.6, 1.05), toneMapped: false }), [tex.sun]);
  useFrame((_, dt) => { if (state.reduce) return; refs.current.forEach(m => m && (m.rotation.y += dt * 0.02)); });
  return suns.map((pos, i) => (
    <group key={i} position={pos}>
      <mesh ref={el => (refs.current[i] = el)} material={mat} scale={30}>
        <sphereGeometry args={[1, 64, 48]} />
      </mesh>
      <pointLight intensity={5.5} distance={0} decay={0} color="#fff0e0" />
    </group>
  ));
}
