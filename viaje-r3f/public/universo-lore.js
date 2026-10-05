/*!
 * BELENTANI — espina del LORE (núcleo de la experiencia)
 * Une múltiples páginas/mundos alrededor del arco narrativo.
 * Canon: lore-canon/belentani-universo-SKILL.md + letras del canon
 */
(function (root) {
  "use strict";

  const ARCO = {
    resumen:
      "Un narcisista habla a sus hermanos (código rojo). Giro: él es el antihéroe — nació sin belleza ni voz, aprendió a cantar, entendió el daño. Alguien le debe una deuda impagable. Cierre: vete tranquilo, pero recuérdame.",
    simbolos: [
      "Espejo en el desierto (marco ovalado de oro viejo)",
      "Plumas blancas / plumas negras",
      "Libro santo vs libro ilegible",
      "Llave (solo imagen poética — sin nombres ni datos)",
      "Cadena y candado entreabierto",
      "Cruz y su sombra invertida"
    ],
    retrato:
      "Soberano melancólico: pelo rizado oscuro, barba, moda Mugler/Rick Owens, negro-oro-violeta, luz de alto contraste."
  };

  /** Estaciones = cómo se lee el universo en la web (lore primero). */
  const ESTACIONES = [
    {
      id: "genesis",
      orden: 1,
      titulo: "GÉNESIS",
      tag: "espejo en la arena",
      copy: "Antes del nombre hubo un cuerpo sin voz. Código rojo, hermanos: empieza el disco.",
      letra: "lore-canon/LETRAS/08_La_Deuda_Narcisista_ES.md",
      mundos: ["local-unificado", "sessions"]
    },
    {
      id: "invitacion",
      orden: 2,
      titulo: "LA INVITACIÓN",
      tag: "sexto piso · ascensor",
      copy: "La luz del sexto piso. Subir es entrar en una noche sin mapa.",
      letra: "lore-canon/LETRAS/00_Six_Floors_Up.md",
      mundos: ["judas-web", "omega-immersive"]
    },
    {
      id: "exceso",
      orden: 3,
      titulo: "EL EXCESO",
      tag: "vela · polilla · candlelight",
      copy: "Cera, deseo y el silencio después del ruido.",
      letra: "lore-canon/LETRAS/03_Candlelight.md",
      mundos: ["judas-unificado", "local-unificado"]
    },
    {
      id: "traicion",
      orden: 4,
      titulo: "LA TRAICIÓN",
      tag: "judas · el beso",
      copy: "Pedro besa a Judas. El mito cambia de signo: deseo, fe y entrega.",
      letra: "lore-canon/LETRAS/01_Judas.md",
      mundos: ["judas-web", "local-unificado"]
    },
    {
      id: "deuda",
      orden: 5,
      titulo: "LA DEUDA",
      tag: "agua · sal · llave",
      copy: "Deuda impagable. La llave solo como imagen: quien amenaza no se olvida.",
      letra: "lore-canon/LETRAS/08_La_Deuda_Narcisista_ES.md",
      mundos: ["fullstack-20", "judas-unificado"]
    },
    {
      id: "redencion",
      orden: 6,
      titulo: "LA REDENCIÓN",
      tag: "estática · recuerdo",
      copy: "Vete tranquilo, pero recuérdame. El horizonte no borra la noche: la nombra.",
      letra: "lore-canon/LETRAS/08_La_Deuda_Narcisista_ES.md",
      mundos: ["hub", "audio"]
    }
  ];

  /**
   * Mundos = páginas reales a unificar.
   * El shell no las reescribe: las presenta como capítulos del lore.
   */
  const MUNDOS = {
    hub: {
      name: "SHELL · JUDAS_OS",
      url: null,
      cmd: null,
      blurb: "Esta página: el organismo que sostiene el mito."
    },
    sessions: {
      name: "NUEVE SESIONES",
      url: null,
      cmd: "JUDAS SESSIONS",
      blurb: "Mapa local de puertas del atlas."
    },
    audio: {
      name: "BÓVEDA SONORA",
      url: null,
      cmd: "JUDAS AUDIO",
      blurb: "Stems y preescuchas del archivo."
    },
    visuales: {
      name: "ARCHIVO VISUAL",
      url: null,
      cmd: "OMEGA",
      blurb: "Señales visuales del canon."
    },
    "local-unificado": {
      name: "UNIVERSO UNIFICADO",
      url: "unificado/",
      blurb: "Galaxia local + lore + master Judas + legado."
    },
    "judas-web": {
      name: "THE JUDAS EXPERIENCE",
      url: "https://belentani7.github.io/judas-experience-web/",
      blurb: "Portal 3D: planeta, diamante, llave dorada."
    },
    "judas-unificado": {
      name: "JUDAS · CÓSMICO UNIFICADO",
      url: "https://belentani7.github.io/judas-experience-unificado/",
      blurb: "Obra reunida: reliquia, códice, motor 3D."
    },
    "omega-immersive": {
      name: "OMEGA IMMERSIVE PORTAL",
      url: "https://belentani7.github.io/belentani-omega-immersive-portal/",
      blurb: "Portal creativo 3D OMEGA."
    },
    "judas-era-omega": {
      name: "JUDAS ERA · OMEGA CORE",
      url: "https://belentani7.github.io/belentani-judas-era-omega/",
      blurb: "Experiencia JUDAS ERA."
    },
    "fullstack-20": {
      name: "VEINTE MUNDOS",
      url: "https://belentani7.github.io/BELENTANI-JUDAS-ERA-FULLSTACK/",
      blurb: "Un canon editorial en veinte mundos visuales."
    },
    "judas-creative-os": {
      name: "JUDAS CREATIVE OS",
      url: "https://belentani7.github.io/belentani-judas-web/",
      blurb: "OS creativo Vite + SEO."
    },
    "belent-cad": {
      name: "BELENT-CAD 3D",
      url: "https://belentani7.github.io/belent-cad/",
      blurb: "Digitalización de bocetos a 3D arquitectónico con Three.js."
    },
    "noiacore": {
      name: "NOIACORE LAB",
      url: "https://noiacore.com/",
      blurb: "Laboratorio SaaS de sistemas e ingeniería."
    },
    "belentani-eu": {
      name: "BELENTANI.EU",
      url: "https://belentani.eu/",
      blurb: "Perfil profesional y consultoría."
    },
    "base44": {
      name: "BASE44 MULTIMEDIA",
      url: "https://belentani.base44.app",
      blurb: "Ecosistema multimedia y catálogo visual."
    },
    "portfolio-3d": {
      name: "3D PORTFOLIO",
      url: "https://belentani7.github.io/3d-portfolio/",
      blurb: "Cara 3D del autor — satélite, no el mito."
    },
    "belentani-es": {
      name: "belentani.es",
      url: "https://belentani.es/",
      blurb: "Dominio artístico."
    }
  };

  const BIBLIAS = {
    musica: {
      titulo: "La Biblia de la Música · Melodic Math",
      lineaje: "Denniz PoP → Max Martin → Andreas Carlsson → Lady Gaga / The Weeknd → Belentani",
      motivo: "5 ♭6 5 4 ♭3 2 1",
      frecuencia: "432 Hz",
      master: "-14 LUFS (streaming)",
      reglaOctava: "Verso grave-hablado; coro estalla una octava arriba."
    },
    tech: {
      titulo: "Biblia de Desarrollo de Software v3.0",
      estandares: ["PRD", "TRD", "ADR", "TDD", "BDD", "Idempotencia", "Zero-Trust"]
    }
  };

  const COGNICION = {
    gemini: "Contexto Gemini: Memoria cognitiva, Prompt Maestro y modelado de arquitecturas.",
    qwen: "Qwen Oracle: Análisis forense vocal, stems F#m y Melodic Math aplicada.",
    gdrive: "Bóveda Drive: LA DEUDA.docx, SOBERANIA.docx, GOD IS AI.docx y archivo original.",
    instagram: "@belentani_: Silueta Mugler/Rick Owens, oro viejo, obsidian y desierto posguerra."
  };

  const GEMAS = [
    { id: "pedro", name: "PEDRO", title: "LA ROCA" },
    { id: "marcos", name: "MARCOS", title: "EL CRONISTA" },
    { id: "santos", name: "SANTOS", title: "LA ANTENA" },
    { id: "belentani", name: "BELENTANI", title: "EL ARTEFACTO" },
    { id: "human", name: "THE HUMAN", title: "LA INTERFAZ" }
  ];

  root.BELENTANI_LORE = {
    version: "2026-10-02-universo",
    arco: ARCO,
    estaciones: ESTACIONES,
    mundos: MUNDOS,
    gemas: GEMAS,
    biblias: BIBLIAS,
    cognicion: COGNICION,
    banco: {
      python: "inventariar_recursos_galacticos.py",
      inventario: "banco-recursos-galacticos/inventario.json",
      comoUnir: "banco-recursos-galacticos/COMO_UNIR.md",
      canonLocal: "lore-canon/"
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
