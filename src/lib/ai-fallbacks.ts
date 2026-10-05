export const fallbacks = {
  loreChat: (context: 'judas' | 'biblia' | 'qwen') => {
    const responses = {
      judas: 'Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo en la arena. La deuda no se paga con dinero, se paga con memoria.',
      biblia: 'Regla de la octava aplicada: verso en grave, coro una octava arriba. Motivo firma 5 ♭6 5 4 ♭3 2 1 en F#m detectado. Frecuencia base: 432 Hz. Genealogía: Denniz PoP → Max Martin → Andreas Carlsson → Lady Gaga/The Weeknd → Belentani.',
      qwen: 'Perfil desde stems: narrador = Pedro (apóstol que ama, niega, besa). Español en herida ("la deuda, la deuda"). Arquetipos Rey/Guerrero/Mago/Amante unificados. Stems analizados: violín, coros hi/lo, mix A/B, instrumental.',
    };
    return responses[context];
  },

  lyricAnalysis: () => 'Análisis melódico: regla de la octava confirmada. Motivo firma 5 ♭6 5 4 ♭3 2 1 en F# menor presente en coros. Estructura: verso grave → pre-coro ascendente → coro octava arriba. Frecuencia: 432 Hz. Loudness: −14 LUFS integrado.',

  promptOpt: () => 'Prompt cinemático optimizado: [subject: espejo en desierto posguerra], [lighting: alto contraste, hora dorada], [camera: anamórfico 2.39:1, lente 35mm], [mood: melancolía soberana], [palette: void #030008, red #ff073a, gold #d4af37], [film: Kodak Vision3 500T, grano fino].',
};