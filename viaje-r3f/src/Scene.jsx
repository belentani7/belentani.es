import { Suspense, useEffect, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import * as THREE from "three";
import { Galaxy, Core } from "./Galaxy.jsx";
import { Planets, Suns } from "./Planets.jsx";
import { Monuments } from "./Monuments.jsx";
import { sample, audio } from "./audio.js";
import { curve, state, N, BASE } from "./journey.js";

function Sky() {
  const { scene } = useThree();
  const tex = useLoader(THREE.TextureLoader, "./tex/2k_stars_milky_way.webp");
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace; tex.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = tex; scene.backgroundIntensity = 0.32;
    scene.environment = tex; scene.environmentIntensity = 0.9;
    new THREE.TextureLoader().load("./tex/8k_stars_milky_way.webp", hi => {
      hi.colorSpace = THREE.SRGBColorSpace; hi.mapping = THREE.EquirectangularReflectionMapping; scene.background = hi; scene.environment = hi;
    });
  }, [tex, scene]);
  return null;
}

// el bloom respira con la música
const bloomRef = { current: null };
function AudioBloom() {
  useFrame(() => { if (state.reduce) return; const b = bloomRef.current; if (b) b.intensity = 1.15 + audio.bass * 1.4 + audio.beat * 0.6; });
  return null;
}

// cámara sobre la curva cerrada: el viaje nunca termina, solo da la vuelta
const wrapT = t => ((t % 1) + 1) % 1;
const look = new THREE.Vector3(), ahead = new THREE.Vector3(), center = new THREE.Vector3(0, -40, 0);
function Rig({ onStation }) {
  const last = useRef(-1);
  useFrame(({ camera }, dt) => {
    const s = state;
    sample();
    if (s.warpTo != null) {                       // salto suave a la estación por el camino corto (ida o vuelta)
      let d = wrapT(s.warpTo - s.t);
      if (d > 0.5) d -= 1;                        // negativo: la estación está detrás
      if (Math.abs(d) < 0.002) { s.warpTo = null; s.target = BASE; s.vel = Math.max(-0.0008, Math.min(0.0008, s.vel)); }
      else s.target = Math.max(-0.005, Math.min(0.005, d * 0.025 + Math.sign(d) * 0.00015));
    } else if (s.auto) s.target += (BASE - s.target) * 0.02;
    else s.target *= 0.96;
    if (!s.paused) { s.vel += (s.target - s.vel) * 0.06; s.t = wrapT(s.t + s.vel * Math.min(dt * 60, 3)); }
    const p = curve.getPointAt(s.t);
    camera.position.lerp(p, 0.5);
    curve.getPointAt((s.t + 0.008) % 1, ahead);
    look.copy(ahead).lerp(center, 0.18);
    look.x += s.pointer[0] * 30; look.y += s.pointer[1] * 18;   // respuesta suave al puntero
    camera.up.set(0, 1, 0);
    const m = new THREE.Matrix4().lookAt(camera.position, look, camera.up);
    camera.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(m), 0.08);
    camera.fov += ((55 + Math.min(30, Math.abs(s.vel) * 9000)) - camera.fov) * 0.08;  // FOV se abre al acelerar (ida o vuelta)
    camera.updateProjectionMatrix();
    const st = Math.floor(((s.t + 0.5 / N / 2) % 1) * N) % N;
    if (st !== last.current) { last.current = st; onStation(st, s.t); }
  });
  return null;
}

export function Scene({ onOpen, onStation, quality, setQuality }) {
  return (
    <>
      <PerformanceMonitor onDecline={() => setQuality(q => Math.max(0, q - 1))} onIncline={() => setQuality(q => Math.min(2, q + 1))} />
      <AdaptiveDpr pixelated={false} />
      <ambientLight intensity={0.08} color="#3a1020" />
      <Suspense fallback={null}>
        <Sky />
        <Suns />
        <Planets onOpen={onOpen} />
        <Monuments />
      </Suspense>
      <Galaxy count={[70000, 150000, 260000][quality]} />
      <Core />
      <Rig onStation={onStation} />
      <AudioBloom />
      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom ref={bloomRef} mipmapBlur intensity={1.15} luminanceThreshold={0.62} luminanceSmoothing={0.2} radius={0.75} />
        <ChromaticAberration offset={[0.0006, 0.0004]} radialModulation modulationOffset={0.35} blendFunction={BlendFunction.NORMAL} />
        <Noise opacity={0.035} premultiply />
        <Vignette offset={0.25} darkness={0.8} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
