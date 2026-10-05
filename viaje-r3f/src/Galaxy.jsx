// Galaxia espiral en GPU: rotación diferencial, polvo luminoso y profundidad.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { audio } from "./audio.js";
import { state } from "./journey.js";

const vert = /* glsl */`
  uniform float uTime, uSize, uPixel, uPulse;
  attribute vec3 aOffset; attribute float aRadius, aAngle, aScale; attribute vec3 aColor;
  varying vec3 vColor; varying float vFade;
  void main(){
    float ang = aAngle + uTime * 0.6 / (aRadius * 0.012 + 1.0);   // dentro gira más rápido
    vec3 pos = vec3(cos(ang) * aRadius, 0.0, sin(ang) * aRadius) + aOffset;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float pulse = 1.0 + uPulse * smoothstep(400.0, 0.0, aRadius);   // el núcleo late con el sub
    gl_PointSize = uSize * aScale * uPixel * pulse * (300.0 / -mv.z);
    vFade = smoothstep(4.0, 60.0, -mv.z);                          // no tapar la cámara al cruzar
    vColor = aColor;
  }`;
const frag = /* glsl */`
  varying vec3 vColor; varying float vFade;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float a = pow(1.0 - smoothstep(0.0, 0.5, d), 2.4);
    gl_FragColor = vec4(vColor * a, a * vFade);
  }`;

export function Galaxy({ count = 220000, radius = 900, arms = 5 }) {
  const mat = useRef();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const off = new Float32Array(count * 3), rad = new Float32Array(count), ang = new Float32Array(count),
      sc = new Float32Array(count), col = new Float32Array(count * 3);
    const cIn = new THREE.Color("#ffe3b8"), cMid = new THREE.Color("#ff073a"), cOut = new THREE.Color("#5b2cff"), c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.7) * radius;
      const branch = ((i % arms) / arms) * Math.PI * 2, spin = r * 0.0042;
      const rnd = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.08 + r / radius * 0.3) * radius * 0.35;
      rad[i] = r; ang[i] = branch + spin;
      off[i * 3] = rnd(); off[i * 3 + 1] = rnd() * (0.18 + 0.5 * Math.exp(-r / 120)); off[i * 3 + 2] = rnd();
      const k = r / radius;
      c.copy(cIn).lerp(cMid, Math.min(1, k * 2.2)).lerp(cOut, Math.max(0, k * 1.6 - 0.6));
      const boost = Math.random() < 0.015 ? 3 : 1;                  // estrellas brillantes -> bloom
      col[i * 3] = c.r * boost; col[i * 3 + 1] = c.g * boost; col[i * 3 + 2] = c.b * boost;
      sc[i] = (0.4 + Math.random() * 1.2) * (boost > 1 ? 2.2 : 1);
    }
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aOffset", new THREE.BufferAttribute(off, 3));
    g.setAttribute("aRadius", new THREE.BufferAttribute(rad, 1));
    g.setAttribute("aAngle", new THREE.BufferAttribute(ang, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(sc, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius * 1.3);
    return g;
  }, [count, radius, arms]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSize: { value: 2.2 }, uPixel: { value: Math.min(devicePixelRatio, 2) }, uPulse: { value: 0 } }), []);
  useFrame((_, dt) => { if (state.reduce) return; uniforms.uTime.value += dt * (0.05 + audio.mid * 0.12); uniforms.uPulse.value = audio.bass * 0.9 + audio.beat * 0.5; });
  return (
    <points geometry={geo} position={[0, -40, 0]}>
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms}
        transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
}

// núcleo: resplandor volumétrico del bulbo
export function Core() {
  return (
    <mesh position={[0, -40, 0]}>
      <sphereGeometry args={[70, 48, 48]} />
      <shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false}
        vertexShader={`varying vec3 n; varying vec3 v; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); n = normalize(normalMatrix*normal); v = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`}
        fragmentShader={`varying vec3 n; varying vec3 v; void main(){ float f = pow(max(dot(n,v),0.),2.5); gl_FragColor = vec4(vec3(1.,.72,.45)*f*2.2, f); }`} />
    </mesh>
  );
}
