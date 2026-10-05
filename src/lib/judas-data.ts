export interface Chapter {
  id: string;
  name: string;
  symbol: string;
  lore: string;
  audio?: string;
  scene: 'planet' | 'diamond' | 'key' | 'machine' | 'biblia' | 'cognition';
}

export const judasChapters: Chapter[] = [
  {
    id: 'genesis',
    name: 'Génesis',
    symbol: '🪞',
    lore: 'Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo en la arena.',
    audio: '/assets/audio/sessions/instrumental.mp3',
    scene: 'planet',
  },
  {
    id: 'traicion',
    name: 'Traición',
    symbol: '💎',
    lore: 'El narrador se revela antihéroe: cantó, entendió el daño, no niega el beso. Pedro besó a Judas y no se arrepiente.',
    audio: '/assets/audio/sessions/violin.mp3',
    scene: 'diamond',
  },
  {
    id: 'deuda',
    name: 'Deuda',
    symbol: '🔑',
    lore: 'Alguien queda con una deuda impagable. La llave solo como imagen — sin nombres ni instituciones. Vete tranquilo, pero recuérdame.',
    audio: '/assets/audio/sessions/coros.mp3',
    scene: 'key',
  },
  {
    id: 'redencion',
    name: 'Redención',
    symbol: '⚙️',
    lore: 'El horizonte no borra la noche: la consagra. La herida cerrada como blasón, no como queja. Vete tranquilo, pero recuérdame.',
    audio: '/assets/audio/sessions/mixA.mp3',
    scene: 'machine',
  },
  {
    id: 'biblia-musica',
    name: 'Biblia Música',
    symbol: '📖',
    lore: 'Genealogía comprobada: Denniz PoP (Cheiron 1992) → Max Martin → Andreas Carlsson → Lady Gaga/The Weeknd → Belentani. Matemática melódica: sílabas, acentos, notas. Regla octava. Motivo 5 ♭6 5 4 ♭3 2 1 en F#m. 432 Hz. -14 LUFS.',
    audio: '/assets/audio/sessions/coro_hi.mp3',
    scene: 'biblia',
  },
  {
    id: 'qwen-perfil',
    name: 'Cognición Qwen',
    symbol: '🧠',
    lore: 'Perfil desde stems reales. Narrador = Pedro. Español en herida. Arquetipos unificados. Stems: violín, coros, mixA/B, instrumental.',
    audio: '/assets/audio/sessions/violin_m.mp3',
    scene: 'cognition',
  },
];