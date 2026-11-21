'use client';

import { useState } from 'react';
import styles from './lore.module.css';

const motifs = [
  { atmosphere: 'un corredor de cristal negro iluminado por neón rojo', movement: 'la cámara se acerca lentamente hasta revelar un segundo reflejo', question: '¿Qué queda de nosotros cuando nadie está mirando?' },
  { atmosphere: 'una catedral de sombras con polvo dorado suspendido', movement: 'una llave gira en el aire y convierte la luz en una puerta', question: '¿Qué abrirías si no hubiera forma de volver atrás?' },
  { atmosphere: 'un horizonte de estrellas lechosas y arquitectura imposible', movement: 'la voz recorre la distancia como una onda de luz escarlata', question: '¿Y si el recuerdo fuera el verdadero escenario?' },
  { atmosphere: 'un teatro vacío donde solo late una luz carmesí', movement: 'un espejo se desplaza hasta quedar frente a una silla solitaria', question: '¿Quién decide cómo termina esta historia?' },
];

export default function LoreEngine() {
  const [symbol, setSymbol] = useState('la llave y el espejo');
  const [intention, setIntention] = useState('misterio');
  const [scene, setScene] = useState<string | null>(null);
  const [iteration, setIteration] = useState(0);
  const generate = () => {
    const next = iteration + 1;
    const motif = motifs[(next - 1) % motifs.length];
    const idea = symbol.trim().slice(0, 100) || 'la voz';
    setIteration(next);
    setScene('ESCENA ' + String(next).padStart(2, '0') + ' / ' + intention.toUpperCase() + '\n\nSímbolo: ' + idea + '.\nEspacio: ' + motif.atmosphere + '.\nAcción: ' + motif.movement + '.\nÚltima pregunta: ' + motif.question + '\n\nDirección visual: fotografía natural, negro vítreo, rojo vivo, resplandor lechoso y movimientos suaves.');
  };
  return (
    <div className={styles.generator}>
      <label htmlFor="lore-symbol">TU SÍMBOLO</label>
      <input id="lore-symbol" value={symbol} onChange={(event) => setSymbol(event.target.value)} maxLength={100} />
      <label htmlFor="lore-intention">INTENCIÓN</label>
      <select id="lore-intention" value={intention} onChange={(event) => setIntention(event.target.value)}>
        <option value="misterio">Misterio</option><option value="liberación">Liberación</option><option value="memoria">Memoria</option><option value="renacimiento">Renacimiento</option>
      </select>
      <button type="button" onClick={generate}>GENERAR ESCENA ORIGINAL <span aria-hidden="true">✦</span></button>
      <output aria-live="polite" className={styles.output}>{scene ?? 'La escena aparecerá aquí. Cada activación propone una variación distinta, sin APIs ni datos personales.'}</output>
      <small>Generación narrativa local basada en combinaciones predefinidas. No es un servicio de IA.</small>
    </div>
  );
}
