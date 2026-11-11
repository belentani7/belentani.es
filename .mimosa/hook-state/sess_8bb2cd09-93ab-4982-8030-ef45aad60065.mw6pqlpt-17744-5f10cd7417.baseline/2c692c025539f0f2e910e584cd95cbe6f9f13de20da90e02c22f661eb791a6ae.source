"use client";

import { useState } from "react";
import styles from "./school.module.css";

type Locale = "es" | "pt" | "en";

const DESTINATIONS = {
  // Configured domain on the connected Open School Vercel project, 2026-10-13.
  campus: "https://open-school-gamma.vercel.app/",
  // Public Manos Abiertas page inspected on 2026-10-13; its CV entry is visible there.
  cv: "https://manosabiertas-seven.vercel.app/es",
} as const;

const LANGUAGES = [
  { code: "pt", name: "Português" },
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "hi", name: "हिन्दी" },
  { code: "ar", name: "العربية" },
  { code: "bn", name: "বাংলা" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "fr", name: "Français" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

const COPY = {
  es: {
    section: "BELENTANI / EDUCACIÓN ABIERTA",
    index: "03 — CAMPUS",
    titleA: "Cada llegada merece",
    titleB: "un comienzo.",
    lead: "Aprender, hablar y encontrar tu camino. Tres puertas conectadas por una idea: el conocimiento debe estar al alcance de quien lo necesita.",
    access: "Explora las puertas",
    languageLabel: "Idioma de esta página",
    accessName: "Acceso abierto",
    accessDescription: "Recursos educativos sin matrícula en el campus de Open School.",
    campusKicker: "01 / APRENDER",
    campusTitle: "Open School",
    campusDescription: "Explora rutas de aprendizaje y sigue tu progreso en el navegador. Su catálogo ya se puede recorrer; el contenido de las lecciones sigue ampliándose.",
    campusNote: "Interfaz actual en español · progreso en este dispositivo",
    campusAction: "Entrar al campus",
    pathKicker: "02 / IDIOMAS",
    pathTitle: "LinguaForge",
    pathDescription: "Traza una ruta entre los diez idiomas del catálogo. El proyecto trabaja con progresión A1–C2, práctica y repetición espaciada; esta selección muestra el recorrido, sin crear una cuenta ni enviar datos.",
    from: "Hablo",
    to: "Quiero aprender",
    swap: "Intercambiar idiomas",
    route: "Tu ruta",
    pathNote: "Vista del catálogo. La plataforma LinguaForge se publica por separado.",
    cvKicker: "03 / AVANZAR",
    cvTitle: "Manos Abiertas",
    cvDescription: "Una puerta práctica para quienes llegan a España: aprendizaje digital, recursos de acogida y una herramienta para crear tu CV.",
    cvAction: "Crear mi CV",
    cvNote: "Se abre Manos Abiertas en otra pestaña. Aquí no se recogen datos del CV.",
    closing: "Tres proyectos. Una misma dirección.",
    closingDetail: "Open School organiza el aprendizaje, LinguaForge trabaja los idiomas y Manos Abiertas ayuda a convertir lo aprendido en un paso concreto.",
    newTab: "(se abre en una pestaña nueva)",
  },
  pt: {
    section: "BELENTANI / EDUCAÇÃO ABERTA",
    index: "03 — CAMPUS",
    titleA: "Cada chegada merece",
    titleB: "um começo.",
    lead: "Aprender, falar e encontrar o seu caminho. Três portas ligadas por uma ideia: o conhecimento deve estar ao alcance de quem precisa dele.",
    access: "Explore as portas",
    languageLabel: "Idioma desta página",
    accessName: "Acesso aberto",
    accessDescription: "Recursos educativos sem matrícula no campus da Open School.",
    campusKicker: "01 / APRENDER",
    campusTitle: "Open School",
    campusDescription: "Explore percursos de aprendizagem e acompanhe o seu progresso no navegador. O catálogo já pode ser consultado; o conteúdo das aulas continua a crescer.",
    campusNote: "Interface atual em espanhol · progresso neste dispositivo",
    campusAction: "Entrar no campus",
    pathKicker: "02 / IDIOMAS",
    pathTitle: "LinguaForge",
    pathDescription: "Trace um percurso entre os dez idiomas do catálogo. O projeto usa progressão A1–C2, prática e repetição espaçada; esta seleção mostra a rota sem criar uma conta nem enviar dados.",
    from: "Falo",
    to: "Quero aprender",
    swap: "Trocar idiomas",
    route: "O seu percurso",
    pathNote: "Vista do catálogo. A plataforma LinguaForge é publicada separadamente.",
    cvKicker: "03 / AVANÇAR",
    cvTitle: "Manos Abiertas",
    cvDescription: "Uma porta prática para quem chega a Espanha: aprendizagem digital, recursos de acolhimento e uma ferramenta para criar o seu CV.",
    cvAction: "Criar o meu CV",
    cvNote: "O Manos Abiertas abre noutra aba. Nenhum dado de CV é recolhido aqui.",
    closing: "Três projetos. Uma direção.",
    closingDetail: "A Open School organiza a aprendizagem, o LinguaForge trabalha os idiomas e o Manos Abiertas ajuda a transformar o aprendido num passo concreto.",
    newTab: "(abre numa nova aba)",
  },
  en: {
    section: "BELENTANI / OPEN EDUCATION",
    index: "03 — CAMPUS",
    titleA: "Every arrival deserves",
    titleB: "a beginning.",
    lead: "Learn, speak, and find your way forward. Three doors share one idea: knowledge should be within reach of those who need it.",
    access: "Explore the doors",
    languageLabel: "Language of this page",
    accessName: "Open access",
    accessDescription: "Educational resources without enrollment at Open School.",
    campusKicker: "01 / LEARN",
    campusTitle: "Open School",
    campusDescription: "Explore learning pathways and track progress in your browser. The catalog is browsable now; lesson content is still growing.",
    campusNote: "Current interface in Spanish · progress on this device",
    campusAction: "Enter the campus",
    pathKicker: "02 / LANGUAGES",
    pathTitle: "LinguaForge",
    pathDescription: "Map a pathway between the catalog's ten languages. The project uses A1–C2 progression, practice, and spaced repetition; this selector previews the pathway without creating an account or sending data.",
    from: "I speak",
    to: "I want to learn",
    swap: "Swap languages",
    route: "Your pathway",
    pathNote: "Catalog preview. The LinguaForge platform is published separately.",
    cvKicker: "03 / MOVE FORWARD",
    cvTitle: "Manos Abiertas",
    cvDescription: "A practical doorway for people arriving in Spain: digital learning, newcomer resources, and a tool to create your CV.",
    cvAction: "Create my CV",
    cvNote: "Manos Abiertas opens in a new tab. No CV information is collected here.",
    closing: "Three projects. One direction.",
    closingDetail: "Open School organizes learning, LinguaForge develops language pathways, and Manos Abiertas helps turn learning into a concrete next step.",
    newTab: "(opens in a new tab)",
  },
} as const;

function languageName(code: LanguageCode): string {
  return LANGUAGES.find((language) => language.code === code)?.name ?? code;
}

export default function SchoolPortal() {
  const [locale, setLocale] = useState<Locale>("es");
  const [from, setFrom] = useState<LanguageCode>("pt");
  const [to, setTo] = useState<LanguageCode>("es");
  const copy = COPY[locale];

  return (
    <section className={styles.portal} aria-labelledby="school-heading" lang={locale}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.topline}>
          <span className={styles.wordmark}>{copy.section}</span>
          <span className={styles.index}>{copy.index}</span>
        </div>

        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><span className={styles.signal} /> {copy.accessName}</span>
            <h1 id="school-heading" className={styles.heading}>
              {copy.titleA}<br /><em>{copy.titleB}</em>
            </h1>
            <p className={styles.lead}>{copy.lead}</p>
            <a href="#school-pathways" className={styles.heroLink}>{copy.access}<span aria-hidden="true">↘</span></a>
          </div>
          <div className={styles.heroAside}>
            <div className={styles.orbit} aria-hidden="true"><span /><span /><span /></div>
            <p className={styles.asideIndex}>EDU / 001—003</p>
            <p className={styles.asideTitle}>{copy.accessName}</p>
            <p className={styles.asideText}>{copy.accessDescription}</p>
          </div>
        </div>

        <div className={styles.localeSwitch} role="group" aria-label={copy.languageLabel}>
          <span className={styles.localeLabel}>{copy.languageLabel}</span>
          {(["es", "pt", "en"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={locale === option}
              onClick={() => setLocale(option)}
            >{option.toUpperCase()}</button>
          ))}
        </div>

        <div className={styles.sectionLabel} id="school-pathways">
          <span>01 — 03</span><span>{copy.closing}</span>
        </div>

        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.campusCard}`}>
            <div className={styles.cardTop}><span>{copy.campusKicker}</span><span aria-hidden="true">↗</span></div>
            <div className={styles.campusVisual} aria-hidden="true">
              <span className={styles.vertical}>OPEN / SCHOOL</span>
              <div className={styles.bookSpine}><i /><i /><i /></div>
              <span className={styles.visualMark}>O<span>.</span>S</span>
            </div>
            <div className={styles.cardBody}>
              <h3>{copy.campusTitle}</h3>
              <p>{copy.campusDescription}</p>
              <p className={styles.detail}>{copy.campusNote}</p>
              <a href={DESTINATIONS.campus} target="_blank" rel="noopener noreferrer" aria-label={`${copy.campusAction} ${copy.newTab}`} className={styles.cardLink}>{copy.campusAction}<span aria-hidden="true">↗</span></a>
            </div>
          </article>

          <article className={`${styles.card} ${styles.languageCard}`}>
            <div className={styles.cardTop}><span>{copy.pathKicker}</span><span aria-hidden="true">↗</span></div>
            <div className={styles.languageVisual} aria-hidden="true">
              <span className={styles.largeGlyph}>語</span><span className={styles.languageRing} />
              <span className={styles.visualCaption}>LANGUAGE / FORGE</span>
            </div>
            <div className={styles.cardBody}>
              <h3>{copy.pathTitle}</h3>
              <p>{copy.pathDescription}</p>
              <div className={styles.routeControl}>
                <label htmlFor="school-from">{copy.from}
                  <select id="school-from" value={from} onChange={(event) => setFrom(event.target.value as LanguageCode)}>
                    {LANGUAGES.map((language) => <option key={language.code} value={language.code} disabled={language.code === to}>{language.name}</option>)}
                  </select>
                </label>
                <button className={styles.swap} type="button" aria-label={copy.swap} onClick={() => { setFrom(to); setTo(from); }}>⇄</button>
                <label htmlFor="school-to">{copy.to}
                  <select id="school-to" value={to} onChange={(event) => setTo(event.target.value as LanguageCode)}>
                    {LANGUAGES.map((language) => <option key={language.code} value={language.code} disabled={language.code === from}>{language.name}</option>)}
                  </select>
                </label>
              </div>
              <p className={styles.selectedRoute} aria-live="polite"><span>{copy.route}</span>{languageName(from)} <b aria-hidden="true">→</b> {languageName(to)}</p>
              <p className={styles.detail}>{copy.pathNote}</p>
            </div>
          </article>

          <article className={`${styles.card} ${styles.cvCard}`}>
            <div className={styles.cardTop}><span>{copy.cvKicker}</span><span aria-hidden="true">↗</span></div>
            <div className={styles.cvVisual} aria-hidden="true">
              <div className={styles.paper}><span /><span /><span /><span /></div>
              <div className={styles.paperShadow} />
              <span className={styles.cvMonogram}>M<span>+</span>A</span>
            </div>
            <div className={styles.cardBody}>
              <h3>{copy.cvTitle}</h3>
              <p>{copy.cvDescription}</p>
              <p className={styles.detail}>{copy.cvNote}</p>
              <a href={DESTINATIONS.cv} target="_blank" rel="noopener noreferrer" aria-label={`${copy.cvAction} ${copy.newTab}`} className={styles.cardLink}>{copy.cvAction}<span aria-hidden="true">↗</span></a>
            </div>
          </article>
        </div>

        <p className={styles.closing}>{copy.closingDetail}</p>
      </div>
    </section>
  );
}
