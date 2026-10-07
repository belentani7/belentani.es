'use client';
import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { judasChapters } from '@/lib/judas-data';
import styles from './ChapterContent.module.css';

const sceneMap = {
  genesis: dynamic(() => import('./components/GenesisScene').then(m => m.GenesisScene), { ssr: false }),
  traicion: dynamic(() => import('./components/DiamondScene').then(m => m.DiamondScene), { ssr: false }),
  deuda: dynamic(() => import('./components/KeyScene').then(m => m.KeyScene), { ssr: false }),
  redencion: dynamic(() => import('./components/MachineScene').then(m => m.MachineScene), { ssr: false }),
  'biblia-musica': dynamic(() => import('./components/BibliaScene').then(m => m.BibliaScene), { ssr: false }),
  'qwen-perfil': dynamic(() => import('./components/CognitionScene').then(m => m.CognitionScene), { ssr: false }),
};

export default function ChapterContent({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const index = judasChapters.findIndex(chapter => chapter.id === chapterId);
  const chapter = judasChapters[index];
  const previous = judasChapters[index - 1];
  const next = judasChapters[index + 1];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, button, a, [contenteditable], [role="slider"]')) return;
      const destination = event.key === 'Escape' ? '/judas-era'
        : event.key === 'ArrowLeft' && previous ? `/judas/${previous.id}`
        : event.key === 'ArrowRight' && next ? `/judas/${next.id}` : null;
      if (destination) { event.preventDefault(); router.push(destination); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [previous, next, router]);

  if (!chapter) return null;
  const Scene = sceneMap[chapter.id as keyof typeof sceneMap];
  return (
    <main className={styles.chapter}>
      <header className={styles.intro}>
        <Link className={styles.back} href="/judas-era">← Universo Judas</Link>
        <p className={styles.eyebrow}>{chapter.symbol} · Capítulo {index + 1}</p>
        <h1>{chapter.name}</h1>
        <p className={styles.lore}>{chapter.lore}</p>
      </header>
      <div className={styles.scene}>
        <Suspense fallback={<p role="status" className={styles.loading}>Cargando capítulo…</p>}>
          <Scene />
        </Suspense>
      </div>
      <nav className={styles.navigation} aria-label="Recorrer capítulos">
        {previous ? <Link href={`/judas/${previous.id}`}>← {previous.name}</Link> : <span>El origen</span>}
        <span className={styles.counter}>{index + 1} / {judasChapters.length}</span>
        {next ? <Link href={`/judas/${next.id}`}>{next.name} →</Link> : <Link href="/galaxia">Volver a la galaxia →</Link>}
      </nav>
    </main>
  );
}
