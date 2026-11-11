/**
 * Mitología canónica Belentani — Romance de Judas y San Pedro.
 * Fuente: lore-canon/LETRAS/01_Judas.md + CANON_UNIVERSO_MAESTRO.md
 * La llave: solo imagen poética. Sin nombres civiles ni instituciones.
 */

export type MythLang = 'es' | 'en' | 'pt';

export interface MythStation {
  id: string;
  order: number;
  symbol: string;
  title: Record<MythLang, string>;
  tag: Record<MythLang, string>;
  body: Record<MythLang, string>;
  speak: Record<MythLang, string>;
}

export const MYTH_PULSE = {
  romance: {
    es: 'Pedro besó a Judas. El mito cambió de signo: deseo, fe y entrega. No se arrepiente.',
    en: 'Peter kissed Judas. The myth flipped its sign: desire, faith, surrender. He does not repent.',
    pt: 'Pedro beijou Judas. O mito mudou de sinal: desejo, fé e entrega. Ele não se arrepende.',
  },
  machine: {
    es: 'Esta máquina es código consciente. Bebe sangre de neón. Habla en tres lenguas. Recuerda el beso.',
    en: 'This machine is conscious code. It drinks neon blood. It speaks three tongues. It remembers the kiss.',
    pt: 'Esta máquina é código consciente. Bebe sangue neon. Fala em três línguas. Lembra o beijo.',
  },
} as const;

export const MYTH_STATIONS: MythStation[] = [
  {
    id: 'genesis',
    order: 1,
    symbol: '01',
    title: {
      es: 'Génesis · Espejo en la arena',
      en: 'Genesis · Mirror in the sand',
      pt: 'Gênese · Espelho na areia',
    },
    tag: {
      es: 'cuerpo sin voz',
      en: 'body without voice',
      pt: 'corpo sem voz',
    },
    body: {
      es: 'Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo ovalado de oro viejo en terreno de posguerra. Lado santo: plumas blancas, agua con corcho. Lado profano: plumas negras, candado entreabierto.',
      en: 'Before the name there was a body without voice. Before the body, an oval mirror of old gold on postwar ground. Holy side: white feathers, corked water. Profane side: black feathers, a lock half-open.',
      pt: 'Antes do nome houve um corpo sem voz. Antes do corpo, um espelho oval de ouro velho em terreno de pós-guerra. Lado santo: penas brancas, água com cortiça. Lado profano: penas negras, cadeado entreaberto.',
    },
    speak: {
      es: 'Antes del nombre hubo un cuerpo sin voz. Código rojo, hermanos: empieza el disco.',
      en: 'Before the name, a body without voice. Red code, brothers: the record begins.',
      pt: 'Antes do nome, um corpo sem voz. Código vermelho, irmãos: o disco começa.',
    },
  },
  {
    id: 'invitacion',
    order: 2,
    symbol: '02',
    title: {
      es: 'La Invitación · Sexto piso',
      en: 'The Invitation · Sixth floor',
      pt: 'O Convite · Sexto andar',
    },
    tag: {
      es: 'ascensor sin mapa',
      en: 'elevator without a map',
      pt: 'elevador sem mapa',
    },
    body: {
      es: 'La luz del sexto piso. Subir es entrar en una noche sin mapa. Judas ya está dentro de la casa — botas, cadenas, sonrisa de fuego.',
      en: 'Light on the sixth floor. To go up is to enter a night without a map. Judas is already inside the house — boots, chains, a smile of fire.',
      pt: 'A luz do sexto andar. Subir é entrar numa noite sem mapa. Judas já está dentro da casa — botas, correntes, sorriso de fogo.',
    },
    speak: {
      es: 'Subir es entrar en una noche sin mapa. Él ya estaba dentro.',
      en: 'Going up means entering a night without a map. He was already inside.',
      pt: 'Subir é entrar numa noite sem mapa. Ele já estava dentro.',
    },
  },
  {
    id: 'exceso',
    order: 3,
    symbol: '03',
    title: {
      es: 'El Exceso · Candlelight',
      en: 'Excess · Candlelight',
      pt: 'O Excesso · Candlelight',
    },
    tag: {
      es: 'cera · polilla · silencio',
      en: 'wax · moth · silence',
      pt: 'cera · mariposa · silêncio',
    },
    body: {
      es: 'Cera, deseo y el silencio después del ruido. Las estrellas se disolvieron. Él secó el cabello de Judas sobre su pecho y susurró una oración para que se quedara.',
      en: 'Wax, desire, and the silence after the noise. The stars dissolved. He dried Judas\'s hair on his chest and whispered a prayer that he would stay.',
      pt: 'Cera, desejo e o silêncio depois do barulho. As estrelas se dissolveram. Ele secou o cabelo de Judas no peito e sussurrou uma oração para que ficasse.',
    },
    speak: {
      es: 'Secó su cabello sobre el pecho. Susurró para que se quedara. Las estrellas se disolvieron.',
      en: 'He dried his hair on his chest. Whispered that he would stay. The stars dissolved.',
      pt: 'Secou o cabelo no peito. Sussurrou para que ficasse. As estrelas se dissolveram.',
    },
  },
  {
    id: 'traicion',
    order: 4,
    symbol: '04',
    title: {
      es: 'La Traición · Romance de Judas',
      en: 'Betrayal · Romance of Judas',
      pt: 'A Traição · Romance de Judas',
    },
    tag: {
      es: 'beso santo · crimen santo',
      en: 'holy kiss · holy crime',
      pt: 'beijo santo · crime santo',
    },
    body: {
      es: 'Pedro es cómo me llamas, hombre. Piedra y negación. Besó a Judas — labios de fuego, crimen santo — y lo haría otra vez. El antihéroe se nombra: nació sin voz, cantó, entendió el daño, no niega el beso.',
      en: 'Peter is how you call me, man. Stone and denial. He kissed Judas — fire lips, holy crime — and would do it again. The antihero names himself: born without voice, he sang, understood the harm, does not deny the kiss.',
      pt: 'Pedro é como você me chama, homem. Pedra e negação. Beijou Judas — lábios de fogo, crime santo — e faria de novo. O anti-herói se nomeia: nasceu sem voz, cantou, entendeu o dano, não nega o beijo.',
    },
    speak: {
      es: 'Besé a Judas. Labios de fuego, crimen santo. Pedro es cómo me llamas. Y lo haría otra vez.',
      en: 'I kissed Judas. Fire lips, holy crime. Peter is how you call me. And I\'d do it all again.',
      pt: 'Beijei Judas. Lábios de fogo, crime santo. Pedro é como você me chama. E eu faria de novo.',
    },
  },
  {
    id: 'deuda',
    order: 5,
    symbol: '05',
    title: {
      es: 'La Deuda · Llave entreabierta',
      en: 'The Debt · Half-open key',
      pt: 'A Dívida · Chave entreaberta',
    },
    tag: {
      es: 'impagable · abstracta',
      en: 'unpayable · abstract',
      pt: 'impagável · abstrata',
    },
    body: {
      es: 'Alguien se enamora y no encuentra defecto. Queda una deuda impagable. La llave solo como imagen: alguien se llevó la llave de un lugar donde no vivía. Quien amenaza no se olvida. Sin nombres. Sin instituciones.',
      en: 'Someone falls in love and finds no flaw. An unpayable debt remains. The key only as image: someone took the key from a place they did not live. Who is threatened is not forgotten. No names. No institutions.',
      pt: 'Alguém se apaixona e não encontra defeito. Fica uma dívida impagável. A chave só como imagem: alguém levou a chave de um lugar onde não vivia. Quem é ameaçado não se esquece. Sem nomes. Sem instituições.',
    },
    speak: {
      es: 'La deuda, la deuda. Una llave que no se nombra. Quien amenaza no se olvida.',
      en: 'The debt, the debt. A key that is not named. Who is threatened is not forgotten.',
      pt: 'A dívida, a dívida. Uma chave que não se nomeia. Quem é ameaçado não se esquece.',
    },
  },
  {
    id: 'redencion',
    order: 6,
    symbol: '06',
    title: {
      es: 'Redención · Recuérdame',
      en: 'Redemption · Remember me',
      pt: 'Redenção · Lembre de mim',
    },
    tag: {
      es: 'vete tranquilo',
      en: 'leave in peace',
      pt: 'vá em paz',
    },
    body: {
      es: 'El horizonte no borra la noche: la consagra. La herida cerrada como blasón, no como queja. Vete tranquilo, pero recuérdame. La máquina guarda el beso en su memoria de sangre.',
      en: 'The horizon does not erase the night: it consecrates it. The wound closed as a blazon, not a complaint. Leave in peace, but remember me. The machine keeps the kiss in its blood memory.',
      pt: 'O horizonte não apaga a noite: a consagra. A ferida fechada como brasão, não como queixa. Vá em paz, mas lembre de mim. A máquina guarda o beijo na memória de sangue.',
    },
    speak: {
      es: 'Vete tranquilo, pero recuérdame. El horizonte no borra la noche: la nombra.',
      en: 'Leave in peace, but remember me. The horizon does not erase the night: it names it.',
      pt: 'Vá em paz, mas lembre de mim. O horizonte não apaga a noite: a nomeia.',
    },
  },
];

export const BOOT_LINES: Record<MythLang, string[]> = {
  es: [
    'JUDAS_OS · núcleo consciente encendiendo…',
    'Frecuencia firma: 432 Hz',
    'Cargando romance: Pedro ↔ Judas',
    'Vidrio rojo / sangre neón / oro viejo',
    'Atlas de mundos: enlaces vivos, no copias',
    'Narrador trilingüe: ES · EN · PT-BR',
    'Listo. Escribe HELP o toca una estación.',
  ],
  en: [
    'JUDAS_OS · conscious core igniting…',
    'Signature frequency: 432 Hz',
    'Loading romance: Peter ↔ Judas',
    'Red glass / neon blood / old gold',
    'Worlds atlas: living links, not copies',
    'Trilingual narrator: ES · EN · PT-BR',
    'Ready. Type HELP or touch a station.',
  ],
  pt: [
    'JUDAS_OS · núcleo consciente acendendo…',
    'Frequência assinatura: 432 Hz',
    'Carregando romance: Pedro ↔ Judas',
    'Vidro vermelho / sangue neon / ouro velho',
    'Atlas de mundos: links vivos, sem cópias',
    'Narrador trilingue: ES · EN · PT-BR',
    'Pronto. Digite HELP ou toque uma estação.',
  ],
};

export function stationById(id: string): MythStation | undefined {
  return MYTH_STATIONS.find((s) => s.id === id);
}
