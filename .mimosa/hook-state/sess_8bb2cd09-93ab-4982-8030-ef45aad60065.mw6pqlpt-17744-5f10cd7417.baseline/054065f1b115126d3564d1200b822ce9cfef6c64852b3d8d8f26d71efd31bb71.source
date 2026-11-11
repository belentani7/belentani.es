import styles from "./agency.module.css";

export type AgencyPortalProps = {
  /** Route back to the artist hub. */
  homeHref?: string;
  /** A verified contact destination. The existing artist contact route is the fallback. */
  contactHref?: string;
};

const services = [
  {
    number: "01",
    title: "Arquitectura de agentes",
    text: "Diseño de flujos con límites claros, puntos de revisión humana e interfaces que permiten entender cada decisión.",
    tags: ["Diseño de sistemas", "Revisión humana"],
  },
  {
    number: "02",
    title: "Trust & Safety",
    text: "Políticas, validación y observabilidad para productos que incorporan IA y necesitan respuestas trazables.",
    tags: ["Políticas", "Observabilidad"],
  },
  {
    number: "03",
    title: "Evidencia de decisiones",
    text: "Registros comprensibles de la política aplicada, las señales disponibles y el motivo de una resolución.",
    tags: ["Trazabilidad", "Integridad"],
  },
];

const prototypes = [
  {
    name: "AgentGuard",
    type: "API de Trust & Safety",
    description: "Base FastAPI con rutas de organización, autenticación, facturación y salud. La arquitectura documenta políticas y observabilidad; cada integración requiere validación para su uso real.",
    mark: "AG",
  },
  {
    name: "Evidence Ledger",
    type: "Registro local de decisiones",
    description: "Recibos con decisión, política y justificación; encadenamiento SHA-256, comprobación de integridad y exportación JSON.",
    mark: "EL",
  },
  {
    name: "Belentani Console",
    type: "Interfaz comercial y técnica",
    description: "Una superficie para presentar arquitectura IA y trabajo reutilizable. El alcance de cada proyecto se define antes de cualquier integración.",
    mark: "BC",
  },
];

export default function AgencyPortal({
  homeHref = "/",
  contactHref = "/prensa",
}: AgencyPortalProps) {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#agency-main">Saltar al contenido</a>

      <header className={styles.header}>
        <a className={styles.brand} href={homeHref} aria-label="Belentani, volver al universo">
          <span className={styles.brandGlyph} aria-hidden="true">B<span>.</span></span>
          <span className={styles.brandWords}>BELENTANI <span>AGENCY</span></span>
        </a>
        <nav className={styles.nav} aria-label="Navegación de Agency">
          <a href="#agency-services">Servicios</a>
          <a href="#agency-work">Laboratorio</a>
          <a href="#agency-method">Método</a>
        </nav>
        <a className={styles.headerContact} href={contactHref}>Contacto <span aria-hidden="true">↗</span></a>
      </header>

      <main id="agency-main">
        <section className={styles.hero} aria-labelledby="agency-title">
          <div className={styles.heroNoise} aria-hidden="true" />
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroOrb} aria-hidden="true">
            <div className={styles.orbCore} />
            <div className={styles.orbRingOne} />
            <div className={styles.orbRingTwo} />
            <div className={styles.orbAxis} />
          </div>
          <div className={styles.heroTopline}>
            <span>NOIACORE / BELENTANI</span>
            <span>BARCELONA · SISTEMAS CON CRITERIO</span>
          </div>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}><span className={styles.liveDot} /> IA · PRODUCTO · TRUST &amp; SAFETY</p>
            <h1 id="agency-title">La inteligencia<br />debe poder <em>explicarse.</em></h1>
            <p className={styles.heroLead}>Diseñamos productos y flujos de IA que dejan ver qué ocurrió, por qué se decidió y dónde interviene una persona.</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#agency-services">Explorar capacidades <span aria-hidden="true">↗</span></a>
              <a className={styles.textButton} href="#agency-work">Ver trabajo de laboratorio <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className={styles.heroBottomline}>
            <span>ESTUDIO INDEPENDIENTE / PEDRO BELENTANI</span>
            <span>01 — 03</span>
          </div>
        </section>

        <section className={styles.statement} aria-label="Enfoque">
          <span className={styles.sectionLabel}>MANIFIESTO / 001</span>
          <p>La automatización es útil cuando sus límites son visibles. Construimos la capa que permite <strong>entender, revisar y mejorar</strong> las decisiones de un sistema.</p>
          <span className={styles.statementGlyph} aria-hidden="true">✳</span>
        </section>

        <section className={styles.services} id="agency-services" aria-labelledby="agency-services-title">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>CAPACIDADES / 002</span>
              <h2 id="agency-services-title">Ingeniería con<br /><em>responsabilidad.</em></h2>
            </div>
            <p>De la arquitectura inicial a la evidencia que permite operar con criterio.</p>
          </div>
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <article className={styles.serviceCard} key={service.number}>
                <div className={styles.cardTop}><span>{service.number} / 03</span><span aria-hidden="true">↗</span></div>
                <div className={styles.cardIcon} aria-hidden="true"><span /></div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <ul className={styles.tagList} aria-label={`Áreas de ${service.title}`}>
                  {service.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.work} id="agency-work" aria-labelledby="agency-work-title">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>LABORATORIO / 003</span>
              <h2 id="agency-work-title">Piezas construidas.<br /><em>Alcance verificable.</em></h2>
            </div>
            <p>Componentes y prototipos privados del ecosistema. Su presencia aquí no implica un servicio público conectado.</p>
          </div>
          <div className={styles.projectList}>
            {prototypes.map((project, index) => (
              <article className={styles.projectRow} key={project.name}>
                <span className={styles.projectIndex}>0{index + 1}</span>
                <div className={styles.projectMark} aria-hidden="true">{project.mark}</div>
                <div className={styles.projectInfo}>
                  <span>{project.type}</span>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
                <span className={styles.projectState}>PROTOTIPO<br />PRIVADO</span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.method} id="agency-method" aria-labelledby="agency-method-title">
          <div className={styles.methodIntro}>
            <span className={styles.sectionLabel}>MÉTODO / 004</span>
            <h2 id="agency-method-title">Primero el problema.<br />Luego <em>el sistema.</em></h2>
            <p>Antes de conectar herramientas, definimos la decisión, el límite humano y la evidencia que habrá que conservar.</p>
          </div>
          <ol className={styles.methodSteps}>
            <li><span>01</span><div><h3>Delimitar</h3><p>Objetivo, entradas, riesgos y criterio de éxito.</p></div></li>
            <li><span>02</span><div><h3>Construir</h3><p>Un flujo entendible con validaciones y puntos de intervención.</p></div></li>
            <li><span>03</span><div><h3>Comprobar</h3><p>Pruebas, trazas y revisión de los casos que importan.</p></div></li>
          </ol>
        </section>

        <section className={styles.contact} id="agency-contact" aria-labelledby="agency-contact-title">
          <span className={styles.sectionLabel}>SIGUIENTE PASO / 005</span>
          <h2 id="agency-contact-title">Una idea exige<br /><em>una conversación real.</em></h2>
          <p>Cuéntanos qué decisión quieres mejorar y qué necesita saber la persona que la supervisa.</p>
          <a href={contactHref} className={styles.primaryButton}>Abrir contacto <span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer className={styles.footer}>
        <a className={styles.footerBrand} href={homeHref}>BELENTANI<span>.</span> AGENCY</a>
        <span>IA &amp; TRUST &amp; SAFETY · BARCELONA</span>
        <a href={homeHref}>Volver al universo <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  );
}
