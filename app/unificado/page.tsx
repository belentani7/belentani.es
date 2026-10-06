'use client';

import Link from 'next/link';

/**
 * Puente al universo unificado local / publicado.
 * No copia el HTML de `unificado/` (puede regenerarse); lo presenta como warp.
 */
export default function UnificadoPortalPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '48px 24px',
        background:
          'radial-gradient(ellipse at top, rgba(255,7,58,.2), transparent 55%), #030008',
        color: '#f2e8ef',
        fontFamily: 'var(--font-body), system-ui, sans-serif',
      }}
    >
      <div
        className="ng-redglass"
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: 32,
          borderRadius: 18,
          border: '1px solid rgba(255,7,58,.35)',
        }}
      >
        <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, letterSpacing: '0.16em', color: '#d4af37' }}>
          WARP · UNIVERSO UNIFICADO
        </p>
        <h1 style={{ fontFamily: 'var(--font-display), monospace', fontSize: 36, margin: '12px 0 16px' }}>
          Galaxia local intacta
        </h1>
        <p style={{ color: '#c5b8c2', lineHeight: 1.6, fontSize: 18 }}>
          El archivo <code>unificado/</code> sigue en el repo como experiencia Three.js propia.
          Esta puerta no lo reescribe: te lleva al satélite publicado o te devuelve a la máquina consciente.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
          <a
            href="https://belentani7.github.io/judas-experience-unificado/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#ff073a',
              color: '#030008',
              padding: '12px 18px',
              borderRadius: 10,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Abrir cósmico publicado ↗
          </a>
          <Link
            href="/"
            style={{
              border: '1px solid rgba(255,7,58,.4)',
              color: '#f2e8ef',
              padding: '12px 18px',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            ← Máquina consciente
          </Link>
          <Link
            href="/galaxia"
            style={{
              border: '1px solid rgba(212,175,55,.4)',
              color: '#d4af37',
              padding: '12px 18px',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            Judas Era Shell
          </Link>
        </div>
      </div>
    </main>
  );
}
