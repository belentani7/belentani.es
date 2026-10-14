/** Las cinco firmas son funciones simbólicas del códice, no identidades distintas. */
export const ARCHETYPES = [
  { id: 'pedro', name: 'PEDRO', role: 'LA ROCA', color: '#d4af37', copy: 'El cuerpo que sostiene. La voz permanece cuando cambia el escenario.', href: '/artista', clue: 'La piedra abre el camino: busca el espejo antes de buscar la llave.' },
  { id: 'marcos', name: 'MARCOS', role: 'EL CRONISTA', color: '#4de8e0', copy: 'La memoria observa y deja constancia de cada umbral.', href: '/maquina', clue: 'El cronista recuerda seis estaciones; el cuarto umbral cambia el signo.' },
  { id: 'santos', name: 'SANTOS', role: 'LA ANTENA', color: '#a995e9', copy: 'Escuchar primero. El silencio también tiene frecuencia.', href: '/musica', clue: 'La antena escucha el intervalo entre exceso y traición.' },
  { id: 'belentani', name: 'BELENTANI', role: 'EL ARTEFACTO', color: '#ff073a', copy: 'El conflicto se convierte en obra. La voz atraviesa JUDAS.', href: '/judas', clue: 'El artefacto no es la llave: sigue la voz.' },
  { id: 'human', name: 'THE HUMAN', role: 'LA INTERFAZ', color: '#f4f0f2', copy: 'La persona real y el presente, más allá de la ficción.', href: '/galaxia', clue: 'La quinta firma deja espacio a una sexta variable: tú.' },
] as const;

export type ArchetypeId = (typeof ARCHETYPES)[number]['id'];
