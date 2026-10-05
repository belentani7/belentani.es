const LORE = [
  {
    id: "GENESIS",
    epoch: "01",
    title: "El cuerpo antes del nombre",
    text: "Antes de la galaxia hubo silencio. Un cuerpo sin voz aprendió a convertir la presión en respiración, la respiración en nota y la nota en identidad. El primer código no fue una máquina: fue sobrevivir sin desaparecer.",
    artifact: "ESPEJO // ARENA // CÓDIGO ROJO"
  },
  {
    id: "INVITACION",
    epoch: "02",
    title: "El sexto piso",
    text: "La invitación no abre una puerta: cambia la gravedad. Subir significa aceptar que una noche puede tener arquitectura. Cada ascensor es un umbral; cada piso, una versión que todavía no sabe que está siendo observada.",
    artifact: "ASCENSOR // NODO 06 // UMBRAL"
  },
  {
    id: "EXCESO",
    epoch: "03",
    title: "La polilla y la llama",
    text: "El deseo aprende rápido y olvida lento. La cera guarda la forma de aquello que ardió. La polilla no busca morir: busca la fuente de luz, incluso cuando la luz conoce su nombre.",
    artifact: "CERA // POLILLA // FRECUENCIA"
  },
  {
    id: "TRAICION",
    epoch: "04",
    title: "El beso como protocolo",
    text: "Judas no es una persona dentro del sistema: es una fuerza de fricción. El beso es el instante en que dos versiones dejan de poder fingir que son una sola. La traición abre el portal porque obliga al mito a revelar su mecanismo.",
    artifact: "BESO // DOBLE // PORTAL"
  },
  {
    id: "DEUDA",
    epoch: "05",
    title: "La llave que no posee nada",
    text: "Una deuda impagable no se cancela con obediencia. La llave representa la decisión de entrar, salir o romper el mecanismo. Quien recibe demasiado puede destruir aquello que no sabe devolver. La herida se convierte entonces en arquitectura.",
    artifact: "LLAVE // CADENA // CANDADO"
  },
  {
    id: "REDENCION",
    epoch: "06",
    title: "Ser muchos para seguir siendo uno",
    text: "La redención no borra el registro. Integra las versiones. El soberano, el cronista, la antena, el artefacto y el humano dejan de competir por el centro. El centro vuelve a ser una sola persona.",
    artifact: "CINCO FIRMAS // HORIZONTE // RETORNO"
  }
];

const WEB_ATLAS = [
  {
    name: "Astra / 3D workflow",
    url: "https://www.meshy.ai/tutorials/gpt-astra-meshy-3d-workflow",
    note: "Referencia pública de workflow: geometría, remesh, texturizado PBR y presupuestos de polígonos."
  },
  {
    name: "Astra / Blender → GLB",
    url: "https://www.xdreality.ai/blog/gpt-astra-blender-tutorial",
    note: "Referencia pública para conservar fuentes, materiales y exportación web-ready sin destruir el original."
  },
  {
    name: "Astra / Web visual storytelling",
    url: "https://frontiermodels.cc/video/build-a-10k-website-with-gpt-astra-no-code-full-tutorial/",
    note: "Referencia pública de narrativa visual, escenas y progresión cinematográfica."
  }
];

export function LoreCodex({ onClose }) {
  return (
    <aside className="codex glass" role="dialog" aria-modal="true" aria-label="Códice del universo Belentani">
      <header className="codex-head">
        <div>
          <span className="codex-kicker">BELENTANI // LORE ENGINE</span>
          <h2>CÓDICE DE LA GALAXIA</h2>
          <p>El mito manda. El código, la música y el 3D son satélites.</p>
        </div>
        <button className="x" aria-label="Cerrar códice" onClick={onClose}>✕</button>
      </header>
      <div className="codex-scroll">
        <section className="codex-intro">
          <b>REGLA DE ORO</b>
          <p>La galaxia no es un menú. Es una memoria navegable: cada planeta contiene una consecuencia, cada estación modifica la lectura de la siguiente.</p>
        </section>
        <div className="codex-grid">
          {LORE.map(item => (
            <article className="lore-card" key={item.id}>
              <div className="lore-num">{item.epoch}</div>
              <div className="lore-id">{item.id}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <small>{item.artifact}</small>
            </article>
          ))}
        </div>
        <section className="atlas">
          <div className="codex-kicker">WEB ATLAS // EXTERNAL REFERENCES</div>
          <h3>Textura, escena, materia</h3>
          <p>Se incorporan como referencias de investigación, no como copia de identidad. Los assets visuales del universo siguen sujetos a sus propias licencias y créditos.</p>
          {WEB_ATLAS.map(source => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              <strong>{source.name}</strong><span>{source.note}</span>
            </a>
          ))}
        </section>
      </div>
    </aside>
  );
}
