'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { ARCHETYPES, type ArchetypeId } from '@/lib/archetypes';
import { useVoiceNarrator } from '@/hooks/useVoiceNarrator';
import styles from './NaveCompanion.module.css';

interface Answer { text: string; href: string; label: string; source: string; mode: 'ia' | 'archivo' }
const initial: Answer = {
  text: 'Hay una llave. Antes de tocarla, encuentra el espejo. Puedo darte una pista breve.',
  href: '/judas/genesis', label: 'ABRIR EL ESPEJO', source: 'capítulo Génesis', mode: 'archivo',
};

export default function NaveCompanion({ archetypeId, unlocked }: { archetypeId: ArchetypeId; unlocked: boolean }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<Answer>(initial);
  const [ready, setReady] = useState<'ia' | 'archivo'>('archivo');
  const [loading, setLoading] = useState(false);
  const voice = useVoiceNarrator('es');
  const ownerVoiceReady = Boolean(process.env.NEXT_PUBLIC_VOICE_CLONE_ID) && voice.naturalReady;
  const archetype = ARCHETYPES.find((item) => item.id === archetypeId) ?? ARCHETYPES[3];

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/nave', { cache: 'no-store', signal: controller.signal })
      .then((response) => response.json())
      .then((data) => { if (!controller.signal.aborted && data.mode === 'ia') setReady('ia'); })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  async function ask(value: string) {
    if (!value.trim() || loading) return;
    setLoading(true);
    voice.stop();
    try {
      const response = await fetch('/api/nave', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: value.trim().slice(0, 280) }),
      });
      if (!response.ok) throw new Error('sin señal');
      setAnswer(await response.json() as Answer);
    } catch {
      setAnswer({ text: 'La señal se ha interrumpido. El archivo de JUDAS sigue accesible.', href: '/judas', label: 'ABRIR ARCHIVO', source: 'enlace local', mode: 'archivo' });
    } finally { setLoading(false); setQuestion(''); }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void ask(question); }

  return <aside className={styles.dock} aria-label="NAVE, guía del universo">
    {open && <div className={styles.panel} id="nave-panel">
      <header><span className={styles.pulse} aria-hidden="true">◇</span><div><strong>NAVE / MEMORIA FRAGMENTADA</strong><small>{ready === 'ia' ? 'IA CONECTADA · CANON ACOTADO' : 'ARCHIVO LOCAL · RESPUESTAS VERIFICADAS'}</small></div>
        <button type="button" className={styles.close} onClick={() => { voice.stop(); setOpen(false); }} aria-label="Cerrar NAVE">×</button>
      </header>
      <div className={styles.readout} role="status" aria-live="polite">
        <small>SEÑAL / {answer.source.toUpperCase()}</small><p>{loading ? 'Buscando un fragmento…' : answer.text}</p>
        <Link href={answer.href}>{answer.label} ↗</Link>
      </div>
      <div className={styles.hint}><span style={{ color: archetype.color }}>◇ {archetype.name}</span><p>{unlocked ? 'Cinco firmas activas. La sexta variable eres tú. La puerta maestra está abierta.' : archetype.clue}</p>
        {unlocked && <Link href="/unificado">ENTRAR EN LA PUERTA MAESTRA ↗</Link>}
      </div>
      <div className={styles.quick} role="group" aria-label="Preguntas sugeridas">
        {['JUDAS', 'ESPEJO', 'LLAVE', 'MÚSICA'].map((word) => <button type="button" onClick={() => void ask(word)} key={word} disabled={loading}>{word}</button>)}
      </div>
      <form onSubmit={submit}><label htmlFor="nave-question">PREGUNTA A NAVE</label><div><input id="nave-question" maxLength={280} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="¿Qué significa el diamante?" autoComplete="off" /><button type="submit" disabled={loading || question.trim().length < 2} aria-label="Enviar pregunta">↵</button></div></form>
      <footer><button type="button" disabled={!ownerVoiceReady || loading} onClick={() => voice.speaking ? voice.stop() : void voice.speak(answer.text)}>{voice.speaking ? '■ SILENCIO' : '▶ VOZ DEL UNIVERSO'}</button><span>{ownerVoiceReady ? 'MODELO DE VOZ CONFIGURADO' : 'VOZ PROPIA PENDIENTE'}</span></footer>
    </div>}
    <button type="button" className={styles.launch} aria-expanded={open} aria-controls="nave-panel" onClick={() => setOpen((value) => !value)}><span aria-hidden="true">◇</span> NAVE <small>{open ? 'CERRAR' : 'PREGÚNTAME'}</small></button>
  </aside>;
}
