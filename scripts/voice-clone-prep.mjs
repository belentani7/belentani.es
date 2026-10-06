#!/usr/bin/env node
/**
 * Inventaria muestras de voz privadas para clonación — sin copiarlas al web.
 * Lee `_private_audio_no_web/` y escribe un manifiesto local (también gitignored vía carpeta).
 *
 * Uso: node scripts/voice-clone-prep.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = process.cwd();
const PRIVATE = path.join(ROOT, '_private_audio_no_web');
const OUT = path.join(PRIVATE, 'VOICE_CLONE_MANIFEST.json');
const AUDIO_EXT = new Set(['.wav', '.mp3', '.ogg', '.m4a', '.flac', '.webm', '.aiff', '.aif']);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name === 'node_modules' || name.name === '.git') continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full, acc);
    else if (AUDIO_EXT.has(path.extname(name.name).toLowerCase())) acc.push(full);
  }
  return acc;
}

function sha256file(file) {
  const h = createHash('sha256');
  h.update(fs.readFileSync(file));
  return h.digest('hex').slice(0, 16);
}

const files = walk(PRIVATE);
const samples = files.map((abs) => {
  const stat = fs.statSync(abs);
  const rel = path.relative(PRIVATE, abs).replace(/\\/g, '/');
  return {
    path: rel,
    bytes: stat.size,
    sha16: sha256file(abs),
    mtime: stat.mtime.toISOString(),
    langGuess: /pt|br|portug/i.test(rel)
      ? 'pt-BR'
      : /en|eng|judas/i.test(rel)
        ? 'en'
        : 'es',
  };
});

const manifest = {
  generatedAt: new Date().toISOString(),
  root: '_private_audio_no_web',
  count: samples.length,
  totalBytes: samples.reduce((n, s) => n + s.bytes, 0),
  samples,
  nextSteps: [
    'Entrenar/clonar FUERA del repo (RVC, ElevenLabs Instant Voice, Coqui XTTS).',
    'Exponer un POST JSON { text, lang, voiceId } → audio/* en VOICE_CLONE_UPSTREAM.',
    'En .env.local (nunca commit): VOICE_CLONE_UPSTREAM=... VOICE_CLONE_API_KEY=...',
    'NEXT_PUBLIC_VOICE_CLONE_ENDPOINT=/api/voice/speak',
    'La web usa browser TTS hasta que el clone responda 200.',
  ],
  safety: [
    'No copiar muestras a public/ ni a commits.',
    '_private_audio_no_web/ está en .gitignore.',
  ],
};

if (!fs.existsSync(PRIVATE)) {
  fs.mkdirSync(PRIVATE, { recursive: true });
}
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`voice-clone-prep: ${samples.length} muestras · ${manifest.totalBytes} bytes`);
console.log(`manifiesto: ${path.relative(ROOT, OUT)}`);
if (samples.length === 0) {
  console.log('Aviso: no hay audio aún en _private_audio_no_web/. Añade WAV/MP3 tuyos (PT-BR / ES / EN).');
}
