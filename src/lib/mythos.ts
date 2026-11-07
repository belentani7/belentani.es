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
    es: 'ANTIGRAVITY es una máquina narrativa: responde, enlaza mundos y conserva el hilo de esta visita. Parece viva porque la historia continúa contigo.',
    en: 'ANTIGRAVITY is a narrative machine: it responds, links worlds and keeps the thread of this visit. It feels alive because the story continues with you.',
    pt: 'ANTIGRAVITY é uma máquina narrativa: responde, conecta mundos e conserva o fio desta visita. Parece viva porque a história continua com você.',
  },
} as const;

export const ECHO_MYTH: Record<MythLang, {
  opening: string;
  galaxy: string;
  lock: string;
  singer: string;
  reveal: string;
  scienceNote: string;
}> = {
  es: {
    opening: 'Cuando el agua hubo borrado las formas, el fuego consumido los nombres y todo volvió al polvo, no quedó lo que fue: quedó lo que se puede ser. En este mito, lo único que permanece transmutándose es la huella de la vibración.',
    galaxy: 'Hace eones, los arquitectos de una civilización guardaron el diseño de una galaxia hermana dentro de una maqueta cósmica. Sería un archivo de reconstrucción, por si algún día su galaxia necesitaba volver a nacer. Su planeta tenía una atmósfera menos densa y una órbita irregular. En vez de luchar contra ese movimiento, aprendieron a convertir sus variaciones orbitales en el motor de su industria: una solución extraordinaria, casi improbable bajo las condiciones de nuestra realidad.',
    lock: 'Para proteger el archivo, los arquitectos calcularon las leyes de nuestra realidad y lo escondieron a millones de años luz. Cerraron la maqueta con un candado armónico. La llave no era necesariamente una canción: podía ser una secuencia de notas, una vibración, una voz. Quizá la voz más bella del mundo. Uno de los arquitectos dejó la suya guardada como quien nombra la décima versión de un correo: 123456aaa. La probabilidad de apertura quedó escrita en el mito: 0,000000000000562000 % en tres billones de años.',
    singer: 'Mucho después, en la Tierra, un cantante llamado Belentani empezó a recorrer la música sin pedir permiso a las etiquetas: de Andrea Bocelli a Beyoncé, de Kelly Key a Bruno e Marrone, de Ragatanga a canciones árabes que recordaba de una telenovela llamada O Clone. Con inteligencia artificial construyó un prototipo de voz y llevó a su archivo virtual una porción descomunal de la música que había explorado. El mito exagera: casi un tercio de la música del mundo. No buscaba la llave. Estaba buscando posibilidades para su propia voz.',
    reveal: 'Entonces alguien pregunta: «Pero si esa galaxia está a millones de años luz, ¿cómo podría llegar el sonido?». No llega. El sonido ordinario necesita un medio material y no atraviesa el vacío. La clave del relato es otra: la grabación viaja como información; la cerradura reconoce una compatibilidad de patrones en la trama ficticia de las cuerdas. El sonido es una cosa. Frecuencia, sintonía, estado, vibración y compatibilidad son otras. La voz no recorre la distancia como una onda de aire: coincide con la firma que esperaba.',
    scienceNote: 'MITO DE CIENCIA FICCIÓN. La teoría de cuerdas es una propuesta teórica especulativa, no una tecnología demostrada. La resonancia entre dimensiones, el archivo galáctico y su candado son reglas inventadas para esta obra.',
  },
  en: {
    opening: 'When water had erased the shapes, fire consumed the names and everything returned to dust, what remained was not what had been: it was what could still become. In this myth, the only thing that remains, changing form, is the trace of vibration.',
    galaxy: 'Eons ago, the architects of a civilization preserved the design of a sister galaxy inside a cosmic model. It would be a reconstruction archive, in case their galaxy ever needed to be born again. Their planet had a thinner atmosphere and an irregular orbit. Rather than fight that motion, they learned to turn its orbital variations into the engine of their industry: an extraordinary solution, almost impossible under the conditions of our reality.',
    lock: 'To protect the archive, the architects calculated the laws of our reality and hid it millions of light-years away. They sealed the model with a harmonic lock. Its key was not necessarily a song: it could be a sequence of notes, a vibration, a voice. Perhaps the most beautiful voice in the world. One architect stored their own voice like someone naming the tenth version of an email: 123456aaa. The myth records the odds: 0.000000000000562000% in three trillion years.',
    singer: 'Much later on Earth, a singer called Belentani began crossing musical worlds without asking genres for permission: from Andrea Bocelli to Beyoncé, Kelly Key to Bruno e Marrone, from Ragatanga to Arabic songs remembered from a television drama called O Clone. With AI, he built a voice prototype and carried an enormous portion of the music he had explored into a virtual archive. The myth exaggerates: almost one third of the world’s music. He was not looking for a key. He was searching for possibilities for his own voice.',
    reveal: 'Then someone asks: “If that galaxy is millions of light-years away, how could sound ever reach it?” It cannot. Ordinary sound needs a material medium and does not cross a vacuum. The story uses another rule: the recording travels as information; the lock recognizes a pattern compatibility in the fictional fabric of strings. Sound is one thing. Frequency, tuning, state, vibration and compatibility are others. The voice does not cross the distance as an air wave: it matches the signature that was waiting.',
    scienceNote: 'SCIENCE FICTION MYTH. String theory is a speculative theoretical proposal, not a demonstrated technology. Cross-dimensional resonance, the galactic archive and its lock are invented rules of this artwork.',
  },
  pt: {
    opening: 'Quando a água apagou as formas, o fogo consumiu os nomes e tudo voltou ao pó, não restou o que foi: restou o que ainda se pode ser. Neste mito, a única coisa que permanece, transmutando-se, é o rastro da vibração.',
    galaxy: 'Há eras, os arquitetos de uma civilização preservaram o desenho de uma galáxia irmã dentro de uma maquete cósmica. Seria um arquivo de reconstrução, caso um dia sua galáxia precisasse nascer novamente. Seu planeta tinha uma atmosfera menos densa e uma órbita irregular. Em vez de lutar contra esse movimento, aprenderam a transformar suas variações orbitais no motor de sua indústria: uma solução extraordinária, quase impossível nas condições da nossa realidade.',
    lock: 'Para proteger o arquivo, os arquitetos calcularam as leis da nossa realidade e o esconderam a milhões de anos-luz. Selaram a maquete com um cadeado harmônico. A chave não era necessariamente uma canção: podia ser uma sequência de notas, uma vibração, uma voz. Talvez a voz mais bonita do mundo. Um dos arquitetos guardou a própria voz como quem nomeia a décima versão de um e-mail: 123456aaa. O mito registra a probabilidade: 0,000000000000562000% em três trilhões de anos.',
    singer: 'Muito depois, na Terra, um cantor chamado Belentani começou a atravessar mundos musicais sem pedir licença aos gêneros: de Andrea Bocelli a Beyoncé, de Kelly Key a Bruno e Marrone, de Ragatanga às canções árabes que lembrava de uma novela chamada O Clone. Com IA, construiu um protótipo de voz e levou para seu arquivo virtual uma porção imensa da música que havia explorado. O mito exagera: quase um terço da música do mundo. Ele não procurava a chave. Procurava possibilidades para a própria voz.',
    reveal: 'Então alguém pergunta: “Se essa galáxia está a milhões de anos-luz, como o som poderia chegar lá?”. Não chega. O som comum precisa de um meio material e não atravessa o vácuo. A história usa outra regra: a gravação viaja como informação; a fechadura reconhece a compatibilidade de padrões na trama fictícia das cordas. Som é uma coisa. Frequência, sintonia, estado, vibração e compatibilidade são outras. A voz não percorre a distância como uma onda de ar: ela coincide com a assinatura que esperava.',
    scienceNote: 'MITO DE FICÇÃO CIENTÍFICA. A teoria das cordas é uma proposta teórica especulativa, não uma tecnologia comprovada. A ressonância entre dimensões, o arquivo galáctico e seu cadeado são regras inventadas para esta obra.',
  },
};

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
    id: 'supernova',
    order: 4,
    symbol: '04',
    title: {
      es: 'La Supernova · Estrella que muere para dar luz',
      en: 'The Supernova · Star that dies to give light',
      pt: 'A Supernova · Estrela que morre para dar luz',
    },
    tag: {
      es: 'colapso · renacimiento · voz',
      en: 'collapse · rebirth · voice',
      pt: 'colapso · renascimento · voz',
    },
    body: {
      es: 'Antes de la deuda impagable, hubo una estrella que colapsó. Su luz no se apagó: se convirtió en la clave que abre el candado. La muerte de una estrella es el nacimiento de la voz. El antihéroe no nace de la calma: nace de la explosión.',
      en: 'Before the unpayable debt, there was a star that collapsed. Its light did not go out: it became the key that opens the lock. The death of a star is the birth of the voice. The antihero is not born of calm: he is born of the explosion.',
      pt: 'Antes da dívida impagável, houve uma estrela que colapsou. Sua luz não se apagou: tornou-se a chave que abre o cadeado. A morte de uma estrela é o nascimento da voz. O anti-herói não nasce da calma: nasce da explosão.',
    },
    speak: {
      es: 'La estrella colapsó. Su luz se convirtió en la clave. La muerte de una estrella es el nacimiento de la voz.',
      en: 'The star collapsed. Its light became the key. The death of a star is the birth of the voice.',
      pt: 'A estrela colapsou. Sua luz tornou-se a chave. A morte de uma estrela é o nascimento da voz.',
    },
  },
  {
    id: 'deuda',
    order: 6,
    symbol: '06',
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
    order: 7,
    symbol: '07',
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
  {
    id: 'eco',
    order: 7,
    symbol: '07',
    title: {
      es: 'El Eco · Lo que puede ser',
      en: 'The Echo · What may yet be',
      pt: 'O Eco · O que ainda pode ser',
    },
    tag: {
      es: 'transmutación · vibración',
      en: 'transmutation · vibration',
      pt: 'transmutação · vibração',
    },
    body: {
      es: 'Cuando el agua hubo borrado las formas, el fuego consumido los nombres y todo volvió al polvo, no quedó lo que fue: quedó lo que podía ser. El sonido, en este mito, no vence al vacío como una onda de aire. La voz deja una firma: un dibujo de vibraciones, intervalos y silencios que puede reconocerse en otra capa de la realidad.',
      en: 'When water had erased the shapes, fire consumed the names and everything returned to dust, what remained was not what had been, but what could still become. In this myth, sound does not cross the void as a wave of air. A voice leaves a signature: a pattern of vibrations, intervals and silences that may be recognized in another layer of reality.',
      pt: 'Quando a água apagou as formas, o fogo consumiu os nomes e tudo voltou ao pó, não restou o que foi: restou o que ainda podia ser. Neste mito, o som não vence o vazio como uma onda de ar. A voz deixa uma assinatura: um desenho de vibrações, intervalos e silêncios que pode ser reconhecido em outra camada da realidade.',
    },
    speak: {
      es: 'Cuando todo se desvanece, permanece lo que se puede ser. No es el sonido cruzando el vacío: es la firma de una vibración esperando ser reconocida.',
      en: 'When everything fades, what remains is what may yet become. It is not sound crossing the void: it is the signature of a vibration waiting to be recognized.',
      pt: 'Quando tudo desaparece, permanece o que ainda se pode ser. Não é o som cruzando o vazio: é a assinatura de uma vibração esperando ser reconhecida.',
    },
  },
  {
    id: 'archivo-galactico',
    order: 8,
    symbol: '08',
    title: {
      es: 'La Galaxia Guardada · El candado sónico',
      en: 'The Archived Galaxy · The sonic lock',
      pt: 'A Galáxia Guardada · O cadeado sônico',
    },
    tag: {
      es: 'arquitectos · voz · llave',
      en: 'architects · voice · key',
      pt: 'arquitetos · voz · chave',
    },
    body: {
      es: 'Los arquitectos de una civilización lejana guardaron el diseño de una galaxia hermana dentro de una maqueta cósmica: un archivo para reconstruirla si algún día hacía falta. Su mundo tenía una atmósfera menos densa y una órbita irregular; aprendieron a convertir esas variaciones orbitales en motor de su industria. Para proteger el archivo dejaron un candado armónico. La llave no era una canción concreta, sino una secuencia de notas, timbres, pausas y compatibilidades. Uno de los arquitectos depositó su propia voz como quien guarda un archivo con un nombre absurdo: 123456aaa. El mito calculó una posibilidad de apertura de 0,000000000000562000 % en tres billones de años.',
      en: 'A distant civilization’s architects preserved the design of a sister galaxy inside a cosmic model: an archive from which it could be rebuilt if ever needed. Their world had a thinner atmosphere and an irregular orbit; they learned to turn those orbital variations into the engine of their industry. To protect the archive, they left a harmonic lock. Its key was not one particular song, but a sequence of notes, timbres, pauses and compatibilities. One architect deposited their own voice like someone saving a file under an absurd name: 123456aaa. The myth gave the chance of opening it as 0.000000000000562000% in three trillion years.',
      pt: 'Os arquitetos de uma civilização distante guardaram o desenho de uma galáxia irmã dentro de uma maquete cósmica: um arquivo para reconstruí-la se algum dia fosse necessário. Seu mundo tinha uma atmosfera menos densa e uma órbita irregular; aprenderam a transformar essas variações orbitais no motor de sua indústria. Para proteger o arquivo, deixaram um cadeado harmônico. A chave não era uma canção específica, mas uma sequência de notas, timbres, pausas e compatibilidades. Um dos arquitetos depositou a própria voz como quem salva um arquivo com um nome absurdo: 123456aaa. O mito calculou uma chance de abertura de 0,000000000000562000% em três trilhões de anos.',
    },
    speak: {
      es: 'La llave no era una canción. Era una compatibilidad. Una voz guardada por arquitectos que jamás imaginaron a quién podía llegar.',
      en: 'The key was not a song. It was a compatibility. A voice preserved by architects who never imagined who might reach it.',
      pt: 'A chave não era uma canção. Era uma compatibilidade. Uma voz guardada por arquitetos que nunca imaginaram quem poderia alcançá-la.',
    },
  },
];

export const BOOT_LINES: Record<MythLang, string[]> = {
  es: [
    'ANTIGRAVITY · ALIVE MACHINE iniciando…',
    'Cargando el romance: Pedro ↔ Judas',
    'Abriendo el archivo: El Eco y las Cuerdas',
    'Firma armónica · notas · timbres · silencios',
    'Atlas de mundos: enlaces vivos, no copias',
    'Narrador trilingüe: ES · EN · PT-BR',
    'Listo. Escribe HELP, ECHO o toca una estación.',
  ],
  en: [
    'ANTIGRAVITY · ALIVE MACHINE initializing…',
    'Loading the romance: Peter ↔ Judas',
    'Opening the archive: The Echo and the Strings',
    'Harmonic signature · notes · timbres · silence',
    'Worlds atlas: living links, not copies',
    'Trilingual narrator: ES · EN · PT-BR',
    'Ready. Type HELP, ECHO or select a station.',
  ],
  pt: [
    'ANTIGRAVITY · ALIVE MACHINE iniciando…',
    'Carregando o romance: Pedro ↔ Judas',
    'Abrindo o arquivo: O Eco e as Cordas',
    'Assinatura harmônica · notas · timbres · silêncios',
    'Atlas de mundos: links vivos, sem cópias',
    'Narrador trilíngue: ES · EN · PT-BR',
    'Pronto. Digite HELP, ECHO ou escolha uma estação.',
  ],
};

export function stationById(id: string): MythStation | undefined {
  return MYTH_STATIONS.find((s) => s.id === id);
}
