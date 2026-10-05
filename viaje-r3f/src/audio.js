// Audio reactivo: "La Deuda" alimenta bandas (sub, medios, agudos) y un "beat" detectado.
// El navegador exige gesto del usuario: start() se llama desde el botón de la HUD.
export const audio = { on: false, level: 0, bass: 0, mid: 0, high: 0, beat: 0, time: 0, duration: 0, el: null };

let ctx, analyser, data, avgBass = 0;

export async function start(src = "./audio/la-deuda.mp3") {
  if (!audio.el) {
    const el = new Audio(src);
    el.loop = true; el.crossOrigin = "anonymous"; el.preload = "auto";
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const node = ctx.createMediaElementSource(el);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.78;
    node.connect(analyser); analyser.connect(ctx.destination);
    data = new Uint8Array(analyser.frequencyBinCount);
    audio.el = el;
    el.addEventListener("loadedmetadata", () => (audio.duration = el.duration));
  }
  await ctx.resume();
  await audio.el.play();
  audio.on = true;
}

export function stop() {
  audio.el?.pause();
  audio.on = false;
}

const band = (a, b) => { let s = 0; for (let i = a; i < b; i++) s += data[i]; return s / ((b - a) * 255); };

// llamar una vez por frame (desde useFrame)
export function sample() {
  if (!audio.on || !analyser) {
    for (const k of ["level", "bass", "mid", "high", "beat"]) audio[k] *= 0.92;
    return audio;
  }
  analyser.getByteFrequencyData(data);
  // bins de ~47 Hz con fftSize 1024 a 48 kHz
  const bass = band(1, 5), mid = band(5, 60), high = band(60, 220);
  audio.bass += (bass - audio.bass) * 0.35;
  audio.mid += (mid - audio.mid) * 0.25;
  audio.high += (high - audio.high) * 0.25;
  audio.level = audio.bass * 0.5 + audio.mid * 0.35 + audio.high * 0.15;
  avgBass += (bass - avgBass) * 0.04;
  // golpe: sub por encima de su media reciente
  if (bass > avgBass * 1.18 && bass > 0.45) audio.beat = 1; else audio.beat *= 0.9;
  audio.time = audio.el.currentTime;
  return audio;
}
