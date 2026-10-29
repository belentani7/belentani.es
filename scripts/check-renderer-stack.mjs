import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packagePath = new URL('../package.json', import.meta.url);

function exactVersion(value, label, errors) {
  if (typeof value !== 'string' || !/^\d+\.\d+\.\d+$/.test(value)) {
    errors.push(`${label} must be pinned to an exact semver version (found ${String(value)})`);
    return null;
  }
  return Number(value.split('.')[0]);
}

/**
 * Fast, dependency-free compatibility gate for the App Router WebGL stack.
 * Tests import this function and pass deliberate mismatches to prevent regressions.
 */
export function validateRendererStack(manifest) {
  const errors = [];
  const deps = manifest?.dependencies ?? {};
  const dev = manifest?.devDependencies ?? {};
  const overrides = manifest?.pnpm?.overrides ?? {};

  const react = exactVersion(deps.react, 'react', errors);
  const reactDom = exactVersion(deps['react-dom'], 'react-dom', errors);
  const fiber = exactVersion(deps['@react-three/fiber'], '@react-three/fiber', errors);
  const drei = exactVersion(deps['@react-three/drei'], '@react-three/drei', errors);
  const next = exactVersion(deps.next, 'next', errors);

  if (deps.react !== deps['react-dom']) errors.push('react and react-dom must use the same version');
  if (react === 18 && fiber !== 8) errors.push('React 18 requires @react-three/fiber 8');
  if (react === 19 && fiber !== 9) errors.push('React 19 requires @react-three/fiber 9');
  if (react !== null && react !== 18 && react !== 19) errors.push('Review and explicitly support this new React major before upgrading');
  if (drei !== null && fiber !== null && drei >= 10 && fiber < 9) {
    errors.push('@react-three/drei 10 requires a compatible @react-three/fiber 9 renderer');
  }
  if (next !== null && next >= 15 && fiber !== null && fiber <= 8) {
    errors.push('Next.js App Router 15+ WebGL requires a verified React 19 / Fiber 9 stack; Fiber 8 crashes at runtime');
  }

  const tailwind = deps.tailwindcss;
  exactVersion(tailwind, 'tailwindcss', errors);
  for (const [label, version] of Object.entries({
    '@tailwindcss/postcss': deps['@tailwindcss/postcss'],
    '@tailwindcss/oxide': overrides['@tailwindcss/oxide'],
    '@tailwindcss/node': overrides['@tailwindcss/node'],
  })) {
    exactVersion(version, label, errors);
    if (version !== tailwind) {
      errors.push(`Tailwind version mismatch: ${label}=${String(version)} but tailwindcss=${String(tailwind)}`);
    }
  }
  if (dev['@types/react'] && react !== null) {
    const typesReact = exactVersion(dev['@types/react'], '@types/react', errors);
    if (typesReact !== react) errors.push('@types/react must match the React major');
  }
  if (dev['@types/react-dom'] && reactDom !== null) {
    const typesDom = exactVersion(dev['@types/react-dom'], '@types/react-dom', errors);
    if (typesDom !== reactDom) errors.push('@types/react-dom must match react-dom major');
  }
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifest = JSON.parse(readFileSync(packagePath, 'utf8'));
  const errors = validateRendererStack(manifest);
  if (errors.length) {
    console.error('[Renderer compatibility] FAIL:\n- ' + errors.join('\n- '));
    process.exitCode = 1;
  } else {
    console.log('[Renderer compatibility] PASS: React/Fiber/Drei/Next.js + Tailwind package majors aligned');
  }
}
