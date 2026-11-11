'use client';

import Link from 'next/link';
import { judasChapters } from '@/lib/judas-data';
import { ScrollSection, Card, Button } from '@/design-system';

/* The chapter order is drawn from the actual six published routes.
   These three editorial acts are navigation, not a replacement for their lore. */
const acts = [
  {
    id: 'umbral',
    index: 'I',
    name: 'El umbral',
    subtitle: 'La identidad antes del nombre',
    text: 'Todo comienza con una pregunta: ¿quién aparece en el espejo cuando nadie está mirando? La invitación no ofrece respuestas, solo la primera puerta.',
    chapterIds: ['genesis', 'invitacion'],
  },
  {
    id: 'fractura',
    index: 'II',
    name: 'La fractura',
    subtitle: 'Lo que sucede después del deseo',
    text: 'El exceso deja un eco y la traición modifica el recuerdo. Ninguna de las dos escenas necesita explicarse como sentencia: son capítulos de una misma voz.',
    chapterIds: ['exceso', 'traicion'],
  },
  {
    id: 'permanencia',
    index: 'III',
    name: 'La permanencia',
    subtitle: 'Lo que permanece cuando la escena termina',
    text: 'La deuda pregunta qué se conserva. La redención responde sin borrar lo ocurrido: transformar una herida en relato no significa negar su existencia.',
    chapterIds: ['deuda', 'redencion'],
  },
] as const;

export default function JudasEraPage() {
  const chapters = judasChapters.filter(c => c.kind === 'chapter');
  const appendices = judasChapters.filter(c => c.kind === 'appendix');

  return (
    <div className="spectral-art-direction max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <ScrollSection variant="hero" className="block w-full">
        <header className="spectral-editorial-hero" aria-labelledby="judas-title">
          <div className="spectral-hero-copy">
            <p className="spectral-overline">BELENTANI / EL ARCHIVO VIVO / ERA JUDAS</p>
            <h1 id="judas-title" className="font-display font-black text-white">
              Una voz.<br /><span>Seis decisiones.</span>
            </h1>
            <p className="spectral-lead">
              JUDAS es un recorrido narrativo por la identidad, el deseo y la memoria.
              No empieza en una pantalla: empieza en una voz. Cada capítulo tiene su
              propio espacio y conserva sus escenas, símbolos y palabras.
            </p>
            <nav className="spectral-quicklinks" aria-label="Explorar la Era JUDAS">
              <a href="#ritual-acts">Recorrer la historia <span aria-hidden="true">↘</span></a>
              <a href="#judas-appendices">Explorar los anexos <span aria-hidden="true">↘</span></a>
            </nav>
          </div>
          <div className="spectral-artifact" aria-hidden="true">
            <span className="spectral-artifact-ring spectral-artifact-ring-a" />
            <span className="spectral-artifact-ring spectral-artifact-ring-b" />
            <span className="spectral-artifact-core">J</span>
            <span className="spectral-artifact-caption">THE VOICE IS THE KEY</span>
          </div>
        </header>

        <section id="ritual-acts" aria-labelledby="ritual-title" className="spectral-rituals">
          <div className="spectral-section-heading">
            <div>
              <p className="spectral-overline">01 / TRES ACTOS · SEIS CAPÍTULOS</p>
              <h2 id="ritual-title" className="font-display text-white">Una historia que se atraviesa.</h2>
            </div>
            <p>El orden es parte de la obra. Cada escena también puede abrirse de forma independiente.</p>
          </div>
          <ol className="spectral-act-list">
            {acts.map((act) => (
              <li key={act.id} className="spectral-act">
                <div className="spectral-act-intro">
                  <span className="spectral-act-number" aria-hidden="true">{act.index}</span>
                  <div>
                    <p className="spectral-overline">{act.subtitle}</p>
                    <h3 className="spectral-act-name">{act.name}</h3>
                    <p className="spectral-act-text">{act.text}</p>
                  </div>
                </div>
                <div className="spectral-chapter-grid">
                  {act.chapterIds.map((chapterId) => {
                    const chapter = chapters.find(c => c.id === chapterId);
                    if (!chapter) return null;
                    return (
                      <Card key={chapter.id} variant="redglass" className="spectral-chapter-card group">
                        <span className="spectral-card-index">CAPÍTULO {String(chapter.order).padStart(2, '0')}</span>
                        <div className="spectral-chapter-symbol" aria-hidden="true">{chapter.symbol}</div>
                        <h4 className="spectral-card-title">{chapter.name}</h4>
                        <p className="spectral-card-lore">{chapter.lore}</p>
                        <Button asChild variant="primary" className="w-full">
                          <Link href={`/judas/${chapter.id}`}>
                            Entrar en {chapter.name} <span aria-hidden="true">↗</span>
                          </Link>
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="judas-appendices" aria-labelledby="appendix-title" className="spectral-appendices">
          <div className="spectral-section-heading">
            <div>
              <p className="spectral-overline">02 / DOCUMENTOS COMPLEMENTARIOS</p>
              <h2 id="appendix-title" className="font-display text-white">Más allá del escenario.</h2>
            </div>
            <p>Una segunda lectura del universo: procesos creativos y exploraciones conceptuales que amplían el relato sin sustituir sus capítulos.</p>
          </div>
          <div className="spectral-appendix-grid">
            {appendices.map((chapter) => (
              <Card key={chapter.id} variant="goldglass" className="spectral-chapter-card spectral-appendix-card group">
                <span className="spectral-card-index">ANEXO {String(chapter.order - chapters.length).padStart(2, '0')}</span>
                <span className="spectral-chapter-symbol" aria-hidden="true">{chapter.symbol}</span>
                <h3 className="spectral-card-title">{chapter.name}</h3>
                <p className="spectral-card-lore">{chapter.lore}</p>
                <Button asChild variant="ghost" className="w-full">
                  <Link href={`/judas/${chapter.id}`}>Explorar el anexo <span aria-hidden="true">↗</span></Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <footer className="spectral-story-footer">
          <p className="spectral-overline">LA OBRA CONTINÚA</p>
          <p>El código construye espacios. La música les da una razón para existir.</p>
          <Link href="/" className="spectral-return">Volver al universo BELENTANI <span aria-hidden="true">↗</span></Link>
          <p className="spectral-access-note">Las escenas conservan sus controles originales; la disponibilidad de audio y 3D depende del navegador y del dispositivo.</p>
        </footer>
      </ScrollSection>
    </div>
  );
}
