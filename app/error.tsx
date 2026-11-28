'use client';

import Link from 'next/link';

export default function Error() {
  return (
    <div style={{display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '1rem'}}>
      <div style={{textAlign: 'center', maxWidth: '28rem'}}>
        <h1 style={{fontSize: '3.75rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '1rem'}}>Error</h1>
        <p style={{fontSize: '1.25rem', color: '#475569', marginBottom: '2rem'}}>Ha ocurrido un error inesperado</p>
        <Link href="/" style={{color: '#0d9488', textDecoration: 'underline'}}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}