import type { LoreContext } from './lore-prompts';

const LORE: Record<LoreContext, string> = {
  judas:
    'Estoy en modo memoria (sin nube). Soy la voz de la Era Judas: un origen sin voz, un antihéroe que reconoce su daño, la traición, una deuda impagable y la orden de irse en paz pero sin olvidar. Cuéntame un símbolo —el espejo, las plumas, la llave— y lo iluminamos juntos.',
  biblia:
    'Estoy en modo memoria (sin nube). Esta es la Biblia de la Música: el taller de letras, melodía y estructura. Dame una idea, un sentimiento o una imagen y te devuelvo ángulos para escribir la canción.',
  qwen:
    'Estoy en modo memoria (sin nube). Soy el núcleo cognitivo: descompongo ideas, separo lo verificado de lo especulativo y ordeno el universo en sistema. Planteame tu pregunta y la estructuramos.',
};

export const fallbacks = {
  loreChat(context: LoreContext): string {
    return LORE[context] ?? LORE.judas;
  },
  lyricAnalysis(): string {
    return 'Análisis de letra no disponible sin nube. Activa una clave de modelo o descríbeme la letra y te doy una lectura manual: tema, imagen rectora, arco emocional y posibles rima/métrica.';
  },
  promptOpt(): string {
    return 'Optimizador de prompts en modo memoria. Describe qué quieres generar y te devuelvo una versión más precisa, con contexto, tono y restricciones explícitas.';
  },
};
