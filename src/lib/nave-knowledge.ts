import { judasChapters } from './judas-data';
import { ARCHETYPES } from './archetypes';

export interface NaveAnswer { text: string; href: string; label: string; source: string }

const entries: (NaveAnswer & { terms: string[] })[] = [
  {
    terms: ['pedro', 'belentani', 'bio', 'biografia', 'artista', 'barcelona', 'sao paulo'],
    text: 'Pedro Belentani nació en São Paulo y reside en Barcelona. Compone y produce entre el R&B alternativo, el pop oscuro y la electrónica experimental. Su voz enlaza los mundos.',
    href: '/artista', label: 'CONOCE AL ARTISTA', source: 'biografía artística',
  },
  {
    terms: ['judas', 'historia', 'capitulos', 'cronica', 'orden'],
    text: 'Seis umbrales: Génesis, Invitación, Exceso, Traición, Deuda y Redención. El espejo abre; la llave reaparece; la voz llega al final.',
    href: '/judas', label: 'LEER JUDAS', source: 'crónica de JUDAS',
  },
  {
    terms: ['llave', 'deuda', 'clave', 'acertijo', 'desafio'],
    text: 'Pista: no confundas el objeto con la salida. Sigue el espejo hasta el cuarto capítulo; la respuesta se escucha en la voz.',
    href: '/judas/deuda', label: 'SEGUIR LA LLAVE', source: 'capítulo Deuda',
  },
  {
    terms: ['musica', 'canciones', 'catalogo', 'escuchar', 'tema', 'voz'],
    text: 'La música es el hilo que sobrevive al cambio de escena. Explora el catálogo y vuelve al mito por la canción JUDAS.',
    href: '/musica', label: 'ESCUCHAR', source: 'catálogo artístico',
  },
  {
    terms: ['nave', 'maquina', 'terminal', 'memoria', 'agente'],
    text: 'Yo guardo fragmentos, no una versión perfecta. En la máquina puedes recorrer estaciones, mundos y señales de la historia.',
    href: '/maquina', label: 'ABRIR EL NÚCLEO', source: 'máquina consciente',
  },
  ...judasChapters.filter((chapter) => chapter.kind === 'chapter').map((chapter) => ({
    terms: [chapter.id, chapter.name.toLowerCase()],
    text: `${chapter.name}: ${chapter.lore}`,
    href: `/judas/${chapter.id}`, label: `ABRIR ${chapter.name.toUpperCase()}`,
    source: `capítulo ${chapter.name}`,
  })),
  ...ARCHETYPES.map((item) => ({
    terms: [item.id, item.role.toLowerCase()], text: `${item.name}, ${item.role}. ${item.copy} ${item.clue}`,
    href: item.href, label: `SEGUIR ${item.name}`, source: `códice ${item.name}`,
  })),
];

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function answerFromCanon(question: string): NaveAnswer {
  const normalized = normalize(question);
  const words = normalized.split(/[^a-z0-9]+/).filter((word) => word.length > 2);
  let best: (typeof entries)[number] | undefined;
  let high = 0;
  for (const entry of entries) {
    const score = entry.terms.reduce((total, term) => {
      const value = normalize(term);
      return total + (normalized.includes(value) ? (value.includes(' ') ? 3 : 2) : 0)
        + words.filter((word) => word === value).length;
    }, 0);
    if (score > high) { high = score; best = entry; }
  }
  return best ? { text: best.text, href: best.href, label: best.label, source: best.source } : {
    text: 'Esa señal no aparece en mi archivo verificado. Prueba con espejo, JUDAS, diamantes, música o la llave.',
    href: '/judas', label: 'VER EL CANON', source: 'archivo local',
  };
}
