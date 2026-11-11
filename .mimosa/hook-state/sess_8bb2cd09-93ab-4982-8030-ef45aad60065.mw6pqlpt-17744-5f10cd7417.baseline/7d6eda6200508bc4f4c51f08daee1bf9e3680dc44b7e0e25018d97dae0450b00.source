import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

describe('artistic typography remains consistent across deployment environments', () => {
  it('preserves the three signature typeface families without build-time network fetching', () => {
    const layout = read('app/layout.tsx');
    expect(layout).not.toContain("from 'next/font/google'");
    expect(layout).toContain('Orbitron:wght');
    expect(layout).toContain('Rajdhani:wght');
    expect(layout).toContain('Share+Tech+Mono');
    expect(layout).toContain('display=swap');
  });
  it('retains legible offline fallback fonts and stable tracing configuration', () => {
    const css = read('app/globals.css');
    expect(css).toContain('--font-orbitron: "Orbitron"');
    expect(css).toContain('--font-rajdhani: "Rajdhani"');
    expect(css).toContain('--font-share-tech-mono: "Share Tech Mono"');
    const next = read('next.config.mjs');
    expect(next).toMatch(/\n  outputFileTracingExcludes:/);
    expect(next).not.toMatch(/experimental:\s*\{\s*outputFileTracingExcludes:/);
  });
});
