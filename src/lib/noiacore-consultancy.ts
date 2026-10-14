export interface NoiacoreSource {
  readonly name: string;
  readonly role: string;
  readonly evidence: string;
  readonly status: 'embedded' | 'reference' | 'candidate';
}

export interface NoiacoreCapability {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface NoiacoreOffer {
  readonly title: string;
  readonly subtitle: string;
  readonly deliverable: string;
}

export const NOIACORE_DESCRIPTION =
  'NOIACORE es la consultoria premium de Pedro Belentani para convertir IA, producto, marca y operaciones en sistemas inteligentes con criterio visible. El core es invisible; el impacto tiene que poder verse, explicarse y escalarse.';

export const NOIACORE_TAGLINE = 'Core is invisible. Impact is inevitable.';

export const NOIACORE_SOURCES: readonly NoiacoreSource[] = [
  {
    name: 'NOIACORE',
    role: 'HTML real y terminal base',
    evidence: 'README: Creative Intelligence Lab, logo Λ, landing v8, terminal del observador y API de proyectos.',
    status: 'embedded',
  },
  {
    name: 'noiacore-private / noiacore-art-lab',
    role: 'Memoria de laboratorio',
    evidence: 'Terminal.tsx y versiones legacy del sistema como referencia de comandos, interfaz y lore.',
    status: 'reference',
  },
  {
    name: 'hbo-noir-icons',
    role: 'Lenguaje visual noir glass',
    evidence: 'PlasmaCanvas, cascadas 3D, interfaz de baja luz, textura cinematografica y terminal DevOps.',
    status: 'reference',
  },
  {
    name: 'saas-plasma',
    role: 'Columna SaaS',
    evidence: 'Producto del dominio PRODUCTS usado como base conceptual para empaquetar auditoria, blueprint y sprint.',
    status: 'reference',
  },
  {
    name: 'github-ai-terminal',
    role: 'Terminal comercial',
    evidence: 'Proyecto TypeScript con terminal de IA conectado al ecosistema de GitHub.',
    status: 'reference',
  },
  {
    name: 'neural-git-tui',
    role: 'Metafora de red neuronal',
    evidence: 'TUI que representa commits como neuronas y rutas de exploracion por teclado.',
    status: 'reference',
  },
  {
    name: 'noir-informatica-privada-barcelona',
    role: 'Consultoria privada noir',
    evidence: 'Repo TypeScript de informatica privada en Barcelona dentro del ecosistema Belentani.',
    status: 'reference',
  },
  {
    name: 'firelab',
    role: 'Caballo negro',
    evidence: 'Prompt engine: powerful black stallion, dark misty void, dramatic rim light, low key, editorial cinematic.',
    status: 'embedded',
  },
  {
    name: 'Google Drive',
    role: 'Busqueda de foto black stallion',
    evidence: 'La busqueda encontro candidatos compartidos con nombres de camara. Se usa marca procedural para no exponer fotos privadas sin verificacion visual completa.',
    status: 'candidate',
  },
];

export const NOIACORE_CAPABILITIES: readonly NoiacoreCapability[] = [
  {
    number: '01',
    title: 'AI Transformation Intelligence',
    description: 'Mapa de procesos, riesgos, oportunidades y decisiones que una empresa puede convertir en sistemas de IA.',
    tags: ['audit', 'strategy', 'systems'],
  },
  {
    number: '02',
    title: 'AgentOps y terminales',
    description: 'Diseño de agentes, consolas, trazas y rutas de mando para convertir workflows dispersos en una maquina operable.',
    tags: ['agents', 'terminal', 'ops'],
  },
  {
    number: '03',
    title: 'SaaS Launchpad',
    description: 'Paquetes de producto, pricing, onboarding, paneles y demos para convertir consultoria en plataforma vendible.',
    tags: ['saas', 'plasma', 'growth'],
  },
  {
    number: '04',
    title: 'Noir interface systems',
    description: 'Frontend de autoridad: glassmorfismo rojo, baja luz, diamante, caballo negro, terminal y narrativa visual.',
    tags: ['noir', 'glass', 'brand'],
  },
];

export const NOIACORE_OFFERS: readonly NoiacoreOffer[] = [
  {
    title: 'Audit',
    subtitle: 'Diagnostico ejecutivo',
    deliverable: 'Mapa de oportunidades IA, matriz de riesgo, quick wins, coste y ruta de implantacion.',
  },
  {
    title: 'Blueprint',
    subtitle: 'Arquitectura del sistema',
    deliverable: 'Diseño de agentes, datos, UI, guardrails, trazabilidad y plan tecnico para el primer sprint.',
  },
  {
    title: 'Build',
    subtitle: 'SaaS o terminal operativo',
    deliverable: 'Prototipo navegable, consola de comandos, landing comercial y backlog listo para producto.',
  },
];

export const NOIACORE_COMMANDS = [
  'help',
  'status',
  'noiacore',
  'saas',
  'noir',
  'repos',
  'caballo',
  'voz',
  'contacto',
  'clear',
] as const;
