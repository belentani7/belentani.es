#!/usr/bin/env node
/**
 * Auditoría de la Máquina Consciente + unificación sin rotura.
 * Cobertura declarada: ficheros listados abajo (no "todo el disco").
 *
 * Uso: node scripts/audit-conscious-machine.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const checks = [];

function ok(id, msg) {
  checks.push({ id, pass: true, msg });
}
function fail(id, msg) {
  checks.push({ id, pass: false, msg });
}
function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}
function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

const REQUIRED = [
  'src/components/machine/ConsciousMachine.tsx',
  'src/components/machine/LivingTerminal.tsx',
  'src/lib/mythos.ts',
  'src/lib/worlds-atlas.ts',
  'src/hooks/useVoiceNarrator.ts',
  'app/page.tsx',
  'app/(immersive)/galaxia/page.tsx',
  'app/api/voice/speak/route.ts',
  'app/unificado/page.tsx',
  'src/styles/redglass.css',
  'lore-canon/LETRAS/01_Judas.md',
  'lore-canon/CANON_UNIVERSO_MAESTRO.md',
];

for (const rel of REQUIRED) {
  if (exists(rel)) ok(`exists:${rel}`, 'presente');
  else fail(`exists:${rel}`, 'FALTA');
}

// Home = viaje continuo (película-juego), no landing plana ni dashboard
if (exists('app/page.tsx')) {
  const home = read('app/page.tsx');
  if (home.includes('VoyageCinema')) ok('home-machine', 'Home = VoyageCinema (viaje continuo)');
  else if (home.includes('BelentaniHero')) fail('home-machine', 'Home aún es landing plana');
  else if (home.includes('ConsciousMachine')) fail('home-machine', 'Home aún es dashboard');
  else fail('home-machine', 'Home no monta VoyageCinema');
}

if (exists('src/lib/voyage-places.ts')) {
  const v = read('src/lib/voyage-places.ts');
  // El catálogo actual sustituyó nombres históricos (diamond/blackhole/key)
  // por estaciones navegables del mismo universo. Auditar el contrato actual,
  // no exigir alias retirados que producen falsos negativos.
  const need = ['viaje3d', 'planet', 'judas-web', 'unificado', 'expanded', 'identity-core', 'memory-os', 'nucleo'];
  const missing = need.filter((n) => !v.includes(n));
  const urlCount = (v.match(/url:\s*'/g) || []).length;
  if (missing.length === 0 && urlCount >= need.length) ok('voyage-places', 'Catálogo actual de estaciones + warps presente');
  else fail('voyage-places', `Falta: ${missing.join(', ') || 'URL en estación'}`);
} else {
  fail('voyage-places', 'Falta voyage-places.ts');
}

// Galaxia conserva JudasEraShell (no rotura)
if (exists('app/(immersive)/galaxia/page.tsx')) {
  const g = read('app/(immersive)/galaxia/page.tsx');
  if (g.includes('JudasEraShell')) ok('galaxia-intact', 'Galaxia sigue siendo JudasEraShell');
  else fail('galaxia-intact', 'Galaxia perdió JudasEraShell');
}

// Mitología Pedro/Judas
if (exists('src/lib/mythos.ts')) {
  const m = read('src/lib/mythos.ts');
  const need = ['traicion', 'Pedro', 'Judas', 'pt:', 'en:', 'es:', 'MYTH_STATIONS'];
  const missing = need.filter((n) => !m.includes(n));
  if (missing.length === 0) ok('mythos-trilingual', 'Mitología trilingüe + traición OK');
  else fail('mythos-trilingual', `Falta: ${missing.join(', ')}`);
}

// Atlas no fusiona a martillazos — URLs externas presentes
if (exists('src/lib/worlds-atlas.ts')) {
  const w = read('src/lib/worlds-atlas.ts');
  const need = [
    'judas-experience-web',
    'judas-experience-unificado',
    'BELENTANI-JUDAS-ERA-FULLSTACK',
    'portal-immersive',
    'judas-era-core',
  ];
  const missing = need.filter((u) => !w.includes(u));
  if (missing.length === 0) ok('atlas-links', 'Mundos clave enlazados');
  else fail('atlas-links', `Faltan: ${missing.join(', ')}`);
}

// Audio privado no debe estar en public
const leak = ['public/_private_audio_no_web', 'public/masters/judas'];
for (const rel of leak) {
  if (exists(rel)) fail(`leak:${rel}`, 'Audio privado expuesto en public/');
  else ok(`leak:${rel}`, 'sin fuga');
}

// .gitignore cubre private audio
if (exists('.gitignore')) {
  const gi = read('.gitignore');
  if (gi.includes('_private_audio_no_web')) ok('gitignore-audio', 'private audio ignorado');
  else fail('gitignore-audio', '_private_audio_no_web no está en .gitignore');
}

// Llave: sin instituciones en mythos público
if (exists('src/lib/mythos.ts')) {
  const m = read('src/lib/mythos.ts').toLowerCase();
  const banned = ['deudafix', 'banco ', 'juzgado', 'expediente'];
  const hit = banned.filter((b) => m.includes(b));
  if (hit.length === 0) ok('canon-llave', 'Sin datos identificables en mythos');
  else fail('canon-llave', `Posible fuga: ${hit.join(', ')}`);
}

const passed = checks.filter((c) => c.pass).length;
const failed = checks.filter((c) => !c.pass);
const report = {
  generatedAt: new Date().toISOString(),
  coverageFiles: REQUIRED.length + leak.length + 2,
  checked: checks.length,
  passed,
  failed: failed.length,
  checks,
};

const outDir = path.join(ROOT, 'docs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'AUDIT_CONSCIOUS_MACHINE.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log(`\nAUDITORÍA MÁQUINA CONSCIENTE · ${passed}/${checks.length} OK`);
console.log(`Cobertura: ${report.coverageFiles} rutas de fichero inspeccionadas`);
for (const c of checks) {
  console.log(`${c.pass ? '✓' : '✗'} ${c.id} — ${c.msg}`);
}
console.log(`\nInforme: ${path.relative(ROOT, outPath)}`);
process.exit(failed.length ? 1 : 0);
