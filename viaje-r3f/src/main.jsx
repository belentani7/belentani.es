import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { Scene } from "./Scene.jsx";
import { STATIONS, N, PLANETS, state, stationT } from "./journey.js";
import { start as startAudio, stop as stopAudio } from "./audio.js";
import "./styles.css";
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) { state.auto = false; state.target = state.vel = 0; state.reduce = true; }

function Loader() {
  const { progress, active } = useProgress();
  return <div className={"boot" + (active ? "" : " done")}><b>BELENTANI</b><span>SINTONIZANDO GALAXIA · {Math.round(progress)}%</span></div>;
}

function App() {
  const [st, setSt] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [menu, setMenu] = useState(innerWidth > 760);
  const [fam, setFam] = useState("all");
  const [auto, setAuto] = useState(state.auto);
  const [world, setWorld] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [quality, setQuality] = useState(innerWidth < 760 ? 0 : 2);
  const [sound, setSound] = useState(false);
  const toggleSound = async () => {
    if (sound) { stopAudio(); setSound(false); }
    else { try { await startAudio(); setSound(true); } catch { setSound(false); } }
  };
  const prevSt = useRef(-1);
  const jumpStation = useCallback(direction => {
    const destination = (st + direction + N) % N;
    state.warpTo = stationT(destination) + 0.001;
    if (innerWidth < 760) setMenu(false);
  }, [st]);

  const onStation = useCallback(i => {
    if (prevSt.current === N - 1 && i === 0) setCycle(c => c + 1);              // cruce de ciclo hacia delante
    else if (prevSt.current === 0 && i === N - 1) setCycle(c => Math.max(1, c - 1));  // cruce hacia atrás
    prevSt.current = i; setSt(i);
  }, []);
  const opener = useRef(null);
  const panel = useRef(null);
  const open = useCallback(p => { opener.current = document.activeElement; setWorld(p); setLoaded(false); state.paused = true; }, []);
  const close = () => {
    setWorld(null); state.paused = false;
    const el = opener.current; opener.current = null;
    if (el && el.isConnected && el.focus) el.focus(); else document.querySelector("canvas")?.focus();
  };
  useEffect(() => { if (world) panel.current?.querySelector(".x")?.focus(); }, [world]);
  const trap = e => {                                                             // Tab trap en el panel de mundo
    if (e.key === "Escape") { e.stopPropagation(); close(); return; }
    if (e.key !== "Tab") return;
    const f = [...panel.current.querySelectorAll("button,a[href],iframe")];
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  useEffect(() => {
    const wheel = e => { if (world) return; state.target = Math.max(state.auto ? 0.00006 : 0, Math.min(0.004, state.target + e.deltaY * 0.0000025)); };
    let ty = null;
    const ts = e => (ty = e.touches[0].clientY);
    const tm = e => { if (world) return; const y = e.touches[0].clientY; state.target = Math.max(0, Math.min(0.004, state.target + (ty - y) * 0.000008)); ty = y; };
    const pm = e => (state.pointer = [e.clientX / innerWidth - 0.5, -(e.clientY / innerHeight - 0.5)]);
    const key = e => {
      if (e.target.closest && e.target.closest("button,a,input,textarea,select,iframe")) return;
      if (world && e.key !== "Escape") return;
      if (e.key === "ArrowRight") { e.preventDefault(); jumpStation(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); jumpStation(-1); }
      else if (e.key === "ArrowUp") state.target = Math.min(0.004, state.target + 0.0003);
      else if (e.key === "ArrowDown") state.target = Math.max(0, state.target - 0.0003);
      else if (e.key === " ") { state.paused = !state.paused; e.preventDefault(); }
      else if (e.key.toLowerCase() === "m") setMenu(m => !m);
      else if (e.key === "Escape") close();
    };
    addEventListener("wheel", wheel, { passive: true }); addEventListener("touchstart", ts, { passive: true });
    addEventListener("touchmove", tm, { passive: true }); addEventListener("pointermove", pm); addEventListener("keydown", key);
    return () => { removeEventListener("wheel", wheel); removeEventListener("touchstart", ts); removeEventListener("touchmove", tm); removeEventListener("pointermove", pm); removeEventListener("keydown", key); };
  }, [world, jumpStation]);

  const s = STATIONS[st];
  const count = PLANETS.filter((_, i) => i % N === st).length;
  return (
    <>
      <Canvas className="gl" aria-label="Galaxia Belentani en 3D: viaje por seis estaciones del lore. Usa la rueda o las flechas para avanzar y el menú para saltar." role="img" tabIndex={0} camera={{ fov: 55, near: 0.5, far: 6000, position: [420, 50, 0] }}
        gl={{ antialias: false, powerPreference: "high-performance" }} dpr={[1, innerWidth < 760 ? 1.5 : 2]}>
        <Scene onOpen={open} onStation={onStation} quality={quality} setQuality={setQuality} />
      </Canvas>
      <Loader />

      <nav className={"menu glass" + (menu ? "" : " closed")} aria-label="Menú principal">
        <div className="brand">BELENTANI<small>VIAJE · GALAXIA SIN FIN</small></div>
        <div className="sec">ESTACIONES DEL LORE</div>
        {STATIONS.map((x, i) => (
          <button key={x.id} className="st" aria-current={i === st} onClick={() => { state.warpTo = stationT(i) + 0.001; if (innerWidth < 760) setMenu(false); }}>
            <i>{String(i + 1).padStart(2, "0")}</i>{x.titulo}
          </button>
        ))}
        <div className="sec">CONSTELACIONES</div>
        <div className="fams">
          {["all", "judas", "omega", "belentani"].map(f => (
            <button key={f} className={"fam " + f} aria-pressed={fam === f} onClick={() => { setFam(f); state.filter = f; }}>
              {f === "all" ? "Todas" : f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="foot">
          Rueda / ↑↓ viajar · espacio pausa · M menú
          <a href="../">← Shell principal</a><a href="../viaje/">Viaje (versión ligera)</a>
          <span>Texturas: Solar System Scope · CC BY 4.0</span>
        </div>
        <button className="st" onClick={() => setMenu(false)}><i>‹</i>Ocultar menú</button>
      </nav>
      {!menu && <button className="toggle glass" aria-label="Abrir menú" onClick={() => setMenu(true)}>☰</button>}

      <div className="ctl glass">
        <button aria-pressed={auto} onClick={() => { state.auto = !state.auto; setAuto(state.auto); }}>AUTO</button>
        <button onClick={() => (state.target = 0.0035)}>WARP ›</button>
        <button aria-pressed={sound} onClick={toggleSound} title="La Deuda">{sound ? "♪ ON" : "♪ OFF"}</button>
      </div>

      <section className="hud glass" aria-live="polite" key={st}>
        <div className="tag">ESTACIÓN {st + 1}/{N} · {(s.tag || "").toUpperCase()}</div>
        <h1>{s.titulo}</h1>
        <p>{s.copy}</p>
        <div className="meta"><span>CICLO {cycle}</span><span>{count} MUNDOS</span></div>
        <div className="hud-nav" aria-label="Controles de estación">
          <button type="button" onClick={() => jumpStation(-1)} aria-label="Estación anterior">← ANTERIOR</button>
          <button type="button" onClick={() => jumpStation(1)} aria-label="Siguiente estación">SIGUIENTE →</button>
        </div>
      </section>

      {world && (
        <aside className="world glass" ref={panel} role="dialog" aria-modal="true" aria-label={world.id} onKeyDown={trap}>
          <header>
            <div><h2>{world.id}</h2><p>{world.desc || "Mundo del universo Belentani."}</p></div>
            <button className="x" aria-label="Cerrar" onClick={close}>✕</button>
          </header>
          <div className="frame">
            {!loaded && <div className="load">SINTONIZANDO SEÑAL…</div>}
            <iframe title={world.id} src={world.url} onLoad={() => setLoaded(true)} sandbox="allow-scripts allow-same-origin allow-popups allow-forms" />
          </div>
          <footer><span>CONSTELACIÓN {world.fam.toUpperCase()}</span><a href={world.url} target="_blank" rel="noopener">Abrir mundo ↗</a></footer>
        </aside>
      )}
    </>
  );
}

document.getElementById("static")?.classList.add("sr-only");
createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
