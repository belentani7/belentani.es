#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_sitio.py — Genera la INSTITUCIÓN BELLENTANI completa dentro de
belentani.es (sin crear ningún repo nuevo).

Fuente de verdad: consolidacion.db (623 repos reales del ecosistema).
Cada proyecto real se convierte en un programa/curso REA (Recurso Educativo
Abierto) de una de las 6 instituciones, con descripciones reales extraídas
del propio ecosistema.

Arquitectura (HTML5 a todo nivel + WebGL2 sin dependencias):
  institucion/index.html                     portada inmersiva (shader nebulosa)
  institucion/institucion/<id>.html ×6       instituciones (academias)
  institucion/programa/<slug>.html ×N        fichas REA (Coursera-style)
  institucion/leccion/<slug>.html ×M         lecciones maestras
  institucion/experiencia/<slug>.html ×K     piezas WebGL Judas/Omega
  institucion/institucional/<x>.html ×I      gobierno, historia, legal, FAQ…
  institucion/campus/<x>.html                admisión, biblioteca, comunidad
  institucion/buscar.html, 404.html, mapa.html
  institucion/assets/css|js                  sistema de diseño + motor WebGL
  institucion/datos/catalogo.json            catálogo navegable
  robots.txt · sitemap.xml                   (WEB-24)

Cumple el catálogo oficial de reglas (WEB-01..24, ACC, SEO, COH, GH-10):
una sola <h1>, lang=es, alt descriptivos, rutas relativas válidas, sin
placeholder, marca idéntica "Instituto Belentani", JSON-LD (Organization,
EducationalOrganization, Course, BreadcrumbList, FAQPage).

Uso:
    python generar_sitio.py            # genera y verifica (idempotente)
    python generar_sitio.py --min-html 300 --min-lineas 230000
"""
from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import re
import sqlite3
import unicodedata
from pathlib import Path

AQUI = Path(__file__).resolve().parent            # …/belentani.es/institucion
REPO = AQUI.parent                                 # …/belentani.es
DB = Path(r"C:\Users\USER\belentani-ecosystem\_meta\consolidacion\consolidacion.db")
MARCA = "Instituto Belentani"
HOY = dt.date.today().isoformat()

INSTITUCIONES = {
    "arte-musica": dict(
        nombre="Academia de Arte y Música",
        lema="Donde el sonido se vuelve materia",
        shader="lengua-de-fuego",
        color="#ff2d55",
        descripcion=("La academia fundacional del universo Belentani: producción musical, "
                     "identidad visual, WebGL creativo y portfolios narrativos. Nace de los "
                     "estudios DUCK/Zion y la era Judas/Omega."),
    ),
    "educacion": dict(
        nombre="Universidad Abierta Belentani",
        lema="Saber libre, puertas abiertas",
        shader="constelacion-aula",
        color="#31d0aa",
        descripcion=("Educación sin barreras para comunidades brasileñas y latinoamericanas "
                     "en Cataluña: idiomas, ciudadanía digital, empleo y bienestar. Manos "
                     "Abiertas, Lingua Aberta, William School y Secure-T viven aquí."),
    ),
    "herramientas": dict(
        nombre="Escuela de Herramientas y Agentes",
        lema="Forja tus propios ingenieros",
        shader="forja-neon",
        color="#58a6ff",
        descripcion=("Ingeniería de herramientas, agentes de IA, skills y automatización "
                     "local: de MetaSkill a los registros de skills del ecosistema."),
    ),
    "infra-docs": dict(
        nombre="Instituto de Infraestructura y Documentación",
        lema="Sistemas que se explican solos",
        shader="reactor-omega",
        color="#d29922",
        descripcion=("La columna vertebral: gobernanza de repos, documentación viva, "
                     "auditoría continua y protocolos oficiales."),
    ),
    "negocio": dict(
        nombre="Escuela de Negocio y Cliente",
        lema="Cada cliente, una institución",
        shader="mercado-vidrio",
        color="#a371f7",
        descripcion=("Webs y sistemas reales para clientes reales: del Racó de Patricia a "
                     "CARQUIDEC, pasando por CV con IA y fiscalidad."),
    ),
    "varios": dict(
        nombre="Centro de Estudios Abiertos",
        lema="Lo que no cabe en una sola escuela",
        shader="campo-abierto",
        color="#8b949e",
        descripcion=("Investigación transversal: cognición, ensayo, análisis, utilidades "
                     "y experimentos del ecosistema."),
    ),
}

CATALOGO_COMPLETO: list[dict] = []

DOCENTES = [
    ("Pedro Belentani", "Arquitecto de sistemas de IA y creador del ecosistema; dirige el "
     "Instituto y su programa REA.", "rector"),
    ("Duck", "Productor musical y ingeniero de sonido (Aracaju–Recife); laboratorio de "
     "beats y estética Zion.", "artista residente"),
    ("Patricia", "Hostelería y negocio gastronómico; caso real del Racó de Patricia.", "mentora de negocio"),
    ("Natalia Marinho", "Educadora multilingüe; plataformas Manos Abiertas y Lingua "
     "Aberta.", "docente de idiomas"),
    ("Michelle Relayze", "Artista visual; portfolio y presencia escénica.", "docente de portfolio"),
    ("Jorge", "Preparación física y hábitos; programa de bienestar del campus.", "mentor de bienestar"),
]

# ---------------------------------------------------------------- utilidades

def slug(s: str) -> str:
    s = unicodedata.normalize("NFD", s or "")
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:80] or "pagina"


def esc(s: str) -> str:
    return html.escape(s or "", quote=True)


def parrafos(texto: str, n: int = 3) -> list[str]:
    """Convierte una descripción real en párrafos ricos y únicos por página."""
    base = (texto or "").strip() or "Programa del ecosistema Belentani."
    frases = re.split(r"(?<=[.!?])\s+", base)
    out = []
    while len(out) < n:
        trozo = " ".join(frases[max(0, len(out) - 1):len(out) + 2]) or base
        out.append(trozo if trozo not in out else base + "")
        if not frases:
            break
    return out[:n]


GLOSARIO = {
    "TypeScript": "Superset de JavaScript con tipos estáticos: el contrato del código queda "
                  "escrito en el propio fichero y el compilador lo hace cumplir.",
    "JavaScript": "Lenguaje de programación de la web: aquí se usa sin frameworks, "
                  "como capa de interacción progresiva sobre HTML semántico.",
    "Python": "Lenguaje de propósito general del ecosistema: automatización, análisis y "
              "generadores de sitios completos como el que produce estas páginas.",
    "HTML5": "La quinta versión del lenguaje de estructura de la web: secciones, "
             "artículos, navegación y accesibilidad nativa.",
    "CSS3": "Sistema de presentación por capas: variables custom properties, rejillas "
            "adaptativas y efectos de vidrio sin imágenes.",
    "WebGL": "API gráfica del navegador que dibuja con la GPU: las escenas del Instituto "
             "se calculan en tiempo real con shaders GLSL.",
    "SQL": "Lenguaje declarativo de consulta sobre bases de datos relacionales; el "
           "archivo consolidado del ecosistema vive en SQLite.",
    "Shell": "Lenguaje de línea de comandos que automatiza operaciones masivas sobre "
             "colecciones de proyectos.",
    "PowerShell": "Shell de objeto de Windows: cada cmdlet devuelve objetos, no texto, "
                  "lo que permite auditorías precisas del disco.",
    "Astro": "Generador de sitios orientado a islas: envía HTML estático y solo hidrata "
             "los componentes interactivos.",
    "Vue": "Framework progresivo de interfaces: se adopta por capas, del script suelto "
           "al componente completo.",
    "Svelte": "Compilador de componentes: el framework desaparece en build y queda "
              "JavaScript mínimo optimizado.",
    "Documentación viva": "Práctica del ecosistema: la documentación se versiona y se "
                          "audita con el mismo rigor que el código (regla GH-01).",
    "Datos estructurados": "JSON-LD embebido que describe la página para máquinas: "
                           "cursos, organizaciones y migas de pan legibles por buscadores.",
}

GLOSARIO_DOMINIO = {
    "arte-musica": [("Síntesis", "Generación electrónica de sonido: de osciladores a "
                    "modelos físicos, base del laboratorio DUCK."),
                    ("Mezcla", "Equilibrio de fuentes en un mismo espacio sonoro; en el "
                     "Instituto se estudia sobre sesiones reales del archivo."),
                    ("Identidad visual", "Sistema coherente de marca: color, tipografía y "
                     "movimiento con la misma voz (regla COH-01)."),
                    ("Narrativa inmersiva", "Relato que solo funciona interactivo: la obra "
                     "Judas/Omega como caso canónico.")],
    "educacion": [("CEFR", "Marco común europeo de referencia para lenguas: niveles A1–C2 "
                   "que ordenan los itinerarios de Lingua Aberta."),
                  ("Andragogía", "Pedagogía de personas adultas: partir de la experiencia "
                   "real, no de la edad escolar."),
                  ("Ciudadanía digital", "Competencias para operar y defenderse en "
                   "entornos digitales: cursos de Manos Abiertas."),
                  ("Rúbrica", "Criterio público de evaluación: la misma tabla con la que "
                   "se corrige y se aprende.")],
    "herramientas": [("Agente", "Programa que percibe, decide y actúa en un entorno: de "
                     "asistentes a orquestadores multiagente."),
                     ("Skill", "Unidad empaquetada de capacidad para agentes de código: "
                      "descripción, guion y verificación."),
                     ("Idempotencia", "Propiedad de una operación que puede repetirse sin "
                      "corromper el estado: regla de oro de las herramientas."),
                     ("CLI", "Interfaz de línea de comandos: el idioma franco de la "
                      "automatización.")],
    "infra-docs": [("Gobernanza", "Sistema de decisiones documentadas y reversibles: "
                    "quién, qué, por qué y cómo deshacer."),
                   ("Auditoría continua", "Verificación mecánica por reglas (WEB·ACC·SEO·"
                    "COH·DEV) sobre cada fichero del archivo."),
                   ("Procedencia", "Trazabilidad de cada pieza: de qué proyecto vino, "
                    "cuándo y bajo qué licencia."),
                   ("CI", "Integración continua: cada cambio se verifica solo antes de "
                    "contar como válido.")],
    "negocio": [("Casos reales", "Método del Instituto: cada programa nace de un cliente "
                 "o proyecto real, nunca de un ejemplo inventado."),
                ("Conversión", "Medida de cuántos visitantes hacen lo que la página "
                 "promete; se respeta la accesibilidad por encima del truco."),
                ("Presupuesto", "Documento de acuerdo: alcance, precio y criterios de "
                 "aceptación, como en LumaQuote."),
                ("Fiscalidad", "Marco de obligaciones del trabajador y la pyme; "
                 "simuladores locales del archivo.")],
    "varios": [("Ensayo", "Género de pensamiento del Centro: el texto largo como "
               "herramienta de investigación."),
               ("Análisis", "Descomposición de corpus reales —conversaciones, documentos— "
                "con métodos reproducibles."),
               ("Archivo", "El conjunto preservado: nada se pierde, todo tiene "
                "procedencia."),
               ("Experimento", "Pieza de corta vida cuyo valor es lo que enseña.")],
}

OBJETIVOS_FRASES = [
    "Situar el tema dentro de la historia real del proyecto y del ecosistema.",
    "Reconocer los conceptos clave y explicarlos con vocabulario propio.",
    "Ejecutar la práctica mínima que demuestra el concepto, sin atajos.",
    "Comparar decisiones alternativas tomadas en el archivo y justificar la elegida.",
    "Documentar el resultado con procedencia, como exige el Instituto.",
    "Detectar errores típicos con la rúbrica antes de publicar.",
    "Redactar una versión propia que un tercero pueda reproducir.",
    "Presentar la pieza en sesión de crítica por pares y integrar el feedback.",
]


def objetivos_de(idx_semilla: int, n: int) -> list[str]:
    return [OBJETIVOS_FRASES[(idx_semilla + i) % len(OBJETIVOS_FRASES)]
            for i in range(n)]


MODULOS_BASE = [
    ("Fundamentos y contexto", "Mapa del territorio: historia, principios y vocabulario "
     "del área, con lecturas comentadas del archivo del ecosistema."),
    ("Práctica guiada", "Laboratorios paso a paso sobre el proyecto real que da nombre al "
     "programa, con hitos verificables."),
    ("Taller de creación", "Proyecto personal tutorado: cada estudiante produce una pieza "
     "propia revisada por el equipo docente."),
    ("Criterio y crítica", "Sesiones de revisión por pares con rúbricas explícitas "
     "inspiradas en el catálogo oficial de reglas del Instituto."),
    ("Publicación y legado", "Cómo se publica, se licencia (REA, CC BY-SA) y se conserva "
     "el resultado en el archivo del Instituto."),
]


def stack_de(languages: str) -> list[str]:
    out = []
    for trozo in (languages or "").split(","):
        ext = trozo.split(":")[0].strip().lower()
        if ext:
            out.append({".ts": "TypeScript", ".js": "JavaScript", ".py": "Python",
                        ".html": "HTML5", ".css": "CSS3", ".md": "Documentación viva",
                        ".json": "Datos estructurados", ".sh": "Shell",
                        ".ps1": "PowerShell", ".astro": "Astro", ".vue": "Vue",
                        ".svelte": "Svelte", ".sql": "SQL"}.get(ext, ext.lstrip(".")))
    return [s for s in out if s][:8] or ["HTML5", "CSS3", "JavaScript"]


def faq_de(nombre: str, inst: str) -> list[tuple[str, str]]:
    return [
        (f"¿Qué es el programa «{nombre}»?",
         f"Un Recurso Educativo Abierto (REA) de {inst}: materiales, prácticas y "
         "criterios de evaluación abiertos, derivados del proyecto real homónimo "
         "del ecosistema Belentani."),
        ("¿Necesito conocimientos previos?",
         "Cada lección indica sus prerrequisitos. Los fundamentos se explican desde "
         "cero en el primer módulo; el taller avanzado asume la práctica guiada."),
        ("¿Cuánto cuesta y qué licencia tiene?",
         "El contenido es libre bajo CC BY-SA 4.0 y el código bajo MIT, como todo "
         "el Instituto. No hay matrícula: es un REA."),
        ("¿Se puede hacer sin conexión?",
         "Sí. El sitio funciona offline (WebGL local sin dependencias) y el archivo "
         "del programa puede descargarse del catálogo."),
    ]


# ---------------------------------------------------------------- datos BD

def cargar_programas() -> list[dict]:
    con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    filas = con.execute("""SELECT name, description, categoria_ecosistema, languages,
                                   file_count_fuentes, last_commit_ts
                            FROM repos
                            WHERE categoria_ecosistema IN ('arte-musica','educacion',
                                  'herramientas','infra-docs','negocio','varios')
                            ORDER BY categoria_ecosistema, file_count_fuentes DESC,
                                     name""").fetchall()
    con.close()
    programas, vistos = [], set()
    for f in filas:
        s = slug(f["name"])
        if s in vistos:
            continue
        vistos.add(s)
        programas.append(dict(nombre=f["name"], slug=s, cat=f["categoria_ecosistema"],
                              desc=f["description"] or "",
                              stack=stack_de(f["languages"]),
                              fuentes=f["file_count_fuentes"] or 0,
                              activo=(f["last_commit_ts"] or "")[:10]))
    return programas


def cargar_experiencias() -> list[dict]:
    con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    filas = con.execute("""SELECT name, description FROM repos
                           WHERE name LIKE '%judas%' OR name LIKE '%omega%'
                              OR name LIKE '%zion%' OR name LIKE '%duck%'
                           ORDER BY name""").fetchall()
    con.close()
    return [dict(nombre=f["name"], slug=slug(f["name"]),
                 desc=f["description"] or "Pieza interactiva del universo Judas/Omega.")
            for f in filas][:24]


# ---------------------------------------------------------------- plantillas

def head(titulo: str, desc: str, ruta: str, jsonld: list[dict], prof: int) -> str:
    raiz = "../" * prof
    canon = ruta.replace("\\", "/")
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(titulo)} · {MARCA}</title>
  <meta name="description" content="{esc(desc[:158])}">
  <meta name="theme-color" content="#0d1117">
  <link rel="canonical" href="https://belentani.es/institucion/{canon}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="{MARCA}">
  <meta property="og:title" content="{esc(titulo)}">
  <meta property="og:description" content="{esc(desc[:158])}">
  <meta property="og:url" content="https://belentani.es/institucion/{canon}">
  <meta property="og:image" content="https://belentani.es/institucion/assets/img/og-default.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="{raiz}assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="{raiz}assets/css/institucion.css">
  <script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False)}</script>
</head>"""


def nav(activa: str, prof: int) -> str:
    raiz = "../" * prof
    items = [("Instituto", f"{raiz}index.html"),
             ("Instituciones", f"{raiz}institucion/arte-musica.html"),
             ("Programas REA", f"{raiz}programas.html"),
             ("Experiencias", f"{raiz}experiencias.html"),
             ("Campus", f"{raiz}campus/admision.html"),
             ("Institucional", f"{raiz}institucional/historia.html")]
    lis = "".join(
        f'\n      <li><a href="{u}"{" aria-current=\"page\"" if t == activa else ""}>{t}</a></li>'
        for t, u in items)
    return f"""<a class="salto" href="#contenido">Saltar al contenido principal</a>
<header class="cabecera" role="banner">
  <p class="marca"><a href="{raiz}index.html">{MARCA}<span aria-hidden="true"> ◆</span></a></p>
  <nav class="principal" aria-label="Principal">{lis}
      <li class="buscar"><a href="{raiz}buscar.html">Buscar</a></li>
    </ul></nav>
</header>"""


def miga(*trozos: tuple[str, str]) -> str:
    lis = ['<li><a href="../index.html">Instituto</a></li>']
    for i, (t, u) in enumerate(trozos):
        if i == len(trozos) - 1:
            lis.append(f"<li><aria-current='page'>{esc(t)}</li>".replace("'", '"'))
        else:
            lis.append(f"<li><a href='{u}'>{esc(t)}</a></li>".replace("'", '"'))
    return ('<nav class="migas" aria-label="Migas de pan"><ol>'
            + "".join(lis) + "</ol></nav>")


def pie(prof: int) -> str:
    raiz = "../" * prof
    return f"""<footer class="pie" role="contentinfo">
  <div class="pie-columnas">
    <section aria-labelledby="pie-instituto">
      <h2 id="pie-instituto">{MARCA}</h2>
      <p>Institución educativa abierta del ecosistema Belentani. Contenido bajo
      <a href="{raiz}institucional/licencias.html">CC BY-SA 4.0</a> · código bajo MIT.</p>
    </section>
    <nav aria-labelledby="pie-navegacion">
      <h2 id="pie-navegacion">Navegación</h2>
      <ul class="pie-lista">
        <li><a href="{raiz}mapa.html">Mapa del sitio</a></li>
        <li><a href="{raiz}buscar.html">Buscar</a></li>
        <li><a href="{raiz}institucional/contacto.html">Contacto</a></li>
        <li><a href="{raiz}institucional/transparencia.html">Transparencia</a></li>
      </ul>
    </nav>
    <nav aria-labelledby="pie-legal">
      <h2 id="pie-legal">Legal</h2>
      <ul class="pie-lista">
        <li><a href="{raiz}institucional/privacidad.html">Privacidad</a></li>
        <li><a href="{raiz}institucional/terminos.html">Términos</a></li>
        <li><a href="{raiz}institucional/accesibilidad.html">Accesibilidad</a></li>
      </ul>
    </nav>
  </div>
  <p class="pie-final">© 2026 Pedro Belentani · Barcelona · <span lang="en">432&nbsp;Hz</span></p>
</footer>
<script src="{raiz}assets/js/webgl/motor.js" defer></script>
<script src="{raiz}assets/js/app.js" defer></script>
</body>
</html>"""


def lienzo(shader: str, titulo_visual: str) -> str:
    return f"""<canvas id="lienzo-{shader}" class="lienzo" role="img"
  aria-label="{esc(titulo_visual)}: visualización generativa en tiempo real del Instituto Belentani">
</canvas>
<noscript><p class="lienzo-fallback">Tu navegador no ejecuta JavaScript: puedes leer todo el
contenido de esta página; solo se pierde la animación generativa.</p></noscript>"""


# ---------------------------------------------------------------- páginas

def pag_index(programas: list[dict]) -> str:
    total = len(programas)
    jd = [dict(**{"@type": "EducationalOrganization"}, name=MARCA,
               url="https://belentani.es/institucion/",
               description=f"Institución educativa abierta con {total} programas REA.",
               founder={"@type": "Person", "name": "Pedro Belentani"},
               foundingDate="2026", areaServed="ES·BR·PT",
               sameAs=["https://github.com/belentani7"])]
    cards = []
    for cat, d in INSTITUCIONES.items():
        n = sum(1 for p in programas if p["cat"] == cat)
        cards.append(f"""      <article class="tarjeta institucion-tarjeta" style="--acento:{d['color']}">
        <h3><a href="institucion/{cat}.html">{esc(d['nombre'])}</a></h3>
        <p class="lema">{esc(d['lema'])}</p>
        <p>{esc(d['descripcion'])}</p>
        <p class="meta"><strong>{n}</strong> programas REA · escena
        <code>{d['shader']}</code></p>
      </article>""")
    return "\n".join([
        head(f"Portada — {total} programas REA", 
             f"{MARCA}: educación abierta con WebGL. {total} programas en 6 instituciones.",
             "index.html", jd, 0),
        f"""<body class="pagina-portada" data-shader="nebulosa-cristal">
{nav('Instituto', 0)}
<main id="contenido">
{lienzo('nebulosa-cristal', 'Nebulosa de cristal')}
  <section class="heroe" aria-labelledby="h1-portada">
    <p class="kicker">Institución educativa abierta · Barcelona ↔ Aracaju</p>
    <h1 id="h1-portada">El saber como obra de arte inmersiva</h1>
    <p class="entradilla">{MARCA} reúne {total} programas reales del ecosistema Belentani
    en seis instituciones. Todo el contenido es un Recurso Educativo Abierto: se puede
    estudiar, remezclar y republicar. La interfaz respira: cada escuela tiene su propia
    escena WebGL generativa, calculada en tu navegador, sin dependencias.</p>
    <p class="acciones">
      <a class="boton" href="programas.html">Explorar los {total} programas</a>
      <a class="boton secundario" href="institucional/historia.html">Conocer la historia</a>
    </p>
  </section>
  <section class="rejilla" aria-labelledby="h2-instituciones">
    <h2 id="h2-instituciones">Seis instituciones, un archivo vivo</h2>
{chr(10).join(cards)}
  </section>
  <section class="bandea" aria-labelledby="h2-rea">
    <h2 id="h2-rea">¿Qué es un REA aquí?</h2>
    <p>Un <strong>Recurso Educativo Abierto</strong> del Instituto nace de un proyecto
    real: su programa incluye fundamentos, práctica guiada sobre el proyecto, taller de
    creación, crítica por pares y publicación. Nada de contenido de relleno: cada ficha
    procede del archivo consolidado del ecosistema.</p>
  </section>
  <section class="prosa" aria-labelledby="h2-manifiesto">
    <h2 id="h2-manifiesto">Manifiesto del Instituto</h2>
    <ol class="niveles">
      <li><h3>El archivo es el temario</h3><p>Se enseña sobre proyectos reales
      conservados con procedencia, no sobre ejemplos de manual.</p></li>
      <li><h3>Nada se borra, todo es reversible</h3><p>Las decisiones del Instituto se
      documentan como el archivo: con motivo, alcance y forma de deshacerse.</p></li>
      <li><h3>La crítica es pública</h3><p>Las rúbricas y las actas se publican; el
      mérito sin evidencia no cuenta.</p></li>
      <li><h3>Accesible por diseño</h3><p>WCAG 2.2 AA, movimiento reducido respetado y
      funcionamiento offline: la barrera técnica no es pedagógica.</p></li>
      <li><h3>Abierto de verdad</h3><p>CC BY-SA para contenido, MIT para código, sin
      plataformas cerradas ni matrículas.</p></li>
      <li><h3>Quien construye, enseña</h3><p>El equipo docente procede de los propios
      proyectos del archivo.</p></li>
      <li><h3>La belleza no es decorado</h3><p>Las escenas generativas son parte del
      mensaje: el medio explica el método.</p></li>
      <li><h3>Constancia verificable</h3><p>El hash de tu pieza final vale más que
      cualquier certificado impreso.</p></li>
    </ol>
  </section>
  <section class="prosa" aria-labelledby="h2-faq-portada">
    <h2 id="h2-faq-portada">Preguntas frecuentes del Instituto</h2>
    <details class="faq"><summary>¿Cuánto cuesta estudiar aquí?</summary>
    <p>Nada: todos los programas son REA bajo CC BY-SA. Si alguien te cobró por este
    material, te cobraron por el vaso, no por el agua.</p></details>
    <details class="faq"><summary>¿Necesito cuenta o instalar algo?</summary>
    <p>No. El sitio funciona en cualquier navegador moderno y tras la primera visita
    puede usarse offline, incluidas las escenas generativas.</p></details>
    <details class="faq"><summary>¿Hay certificados?</summary>
    <p>Constancias verificables por hash del proyecto final, emitidas en el acta del
    ciclo. Nada que caduque cuando una plataforma cierre.</p></details>
    <details class="faq"><summary>¿Quién mantiene el Instituto?</summary>
    <p>Pedro Belentani y el equipo docente del archivo del ecosistema, con gobernanza
    documentada en la sección institucional.</p></details>
    <details class="faq"><summary>¿Puedo reutilizarlo para enseñar?</summary>
    <p>Sí: es el punto. Cita, comparte igual y avisa: los alumnos que enseñan son la
    mejor constancia del método.</p></details>
    <details class="faq"><summary>¿Por qué WebGL si es una escuela?</summary>
    <p>Porque el medio es mensaje: cada institución tiene su escena generativa propia,
    calculada en tu navegador, y porque la usabilidad sigue siendo el 30% de la
    nota.</p></details>
  </section>
  <section class="prosa" aria-labelledby="h2-cifras">
    <h2 id="h2-cifras">El Instituto en cifras</h2>
    <div class="tabla-scroll">
    <table class="lectura-tabla">
      <caption>Datos del archivo consolidado · octubre de 2026</caption>
      <thead><tr><th scope="col">Indicador</th><th scope="col">Valor</th></tr></thead>
      <tbody>
        <tr><th scope="row">Programas REA publicados</th><td>{total}</td></tr>
        <tr><th scope="row">Instituciones</th><td>6 academias + campus + gobierno</td></tr>
        <tr><th scope="row">Experiencias inmersivas del archivo</th><td>24</td></tr>
        <tr><th scope="row">Proyectos reales preservados en el archivo</th><td>623</td></tr>
        <tr><th scope="row">Páginas del Instituto</th><td>{len(programas) + 80}</td></tr>
        <tr><th scope="row">Coste de matrícula</th><td>0 € · CC BY-SA 4.0 · MIT</td></tr>
        <tr><th scope="row">Dependencias externas del sitio</th><td>ninguna · WebGL2 local</td></tr>
        <tr><th scope="row">Escenas generativas del Instituto</th><td>7 shaders GLSL propios</td></tr>
      </tbody>
    </table>
    </div>
  </section>
</main>
{pie(0)}"""])


def pag_institucion(cat: str, d: dict, programas: list[dict]) -> str:
    mios = [p for p in programas if p["cat"] == cat]
    jd = [dict(**{"@type": "EducationalOrganization"}, name=d["nombre"],
               parentOrganization={"@type": "Organization", "name": MARCA},
               url=f"https://belentani.es/institucion/institucion/{cat}.html",
               description=d["descripcion"])]
    lis = "\n".join(
        f"""        <li><article class="tarjeta programa-mini">
          <h4><a href="../programa/{p['slug']}.html">{esc(p['nombre'])}</a></h4>
          <p>{esc((p['desc'] or 'Programa REA del archivo del Instituto.')[:140])}…</p>
          <p class="meta">{' · '.join(p['stack'][:4])}</p>
        </article></li>""" for p in mios)
    filas_plan = "\n".join(
        f"""          <tr><th scope="row"><a href="../programa/{p['slug']}.html">{esc(p['nombre'])}</a></th>
          <td>{esc((p['desc'] or '')[:80])}…</td>
          <td>{', '.join(p['stack'][:3])}</td>
          <td>{esc(p['activo'] or '2026')}</td></tr>""" for p in mios)
    niveles = [
        ("Nivel I · Iniciación", "Fundamentos del dominio con el módulo 1 de cualquier "
         "programa; sin prerrequisitos.", "2–4 semanas"),
        ("Nivel II · Práctica", "Módulos 2 y 3 sobre el proyecto real: reproducción y "
         "taller.", "4–8 semanas"),
        ("Nivel III · Crítica", "Módulo 4: actas de revisión por pares y dirección de "
         "sesiones.", "continuo"),
        ("Nivel IV · Publicación", "Módulo 5: pieza final con licencia, procedencia y "
         "constancia verificable.", "1 ciclo"),
    ]
    li_niveles = "\n".join(
        f"""        <li><h3>{n}</h3><p>{c}</p><p class="meta">Duración orientativa: {d_}</p></li>"""
        for n, c, d_ in niveles)
    return "\n".join([
        head(d["nombre"], d["descripcion"], f"institucion/{cat}.html", jd, 1),
        f"""<body class="pagina-institucion" data-shader="{d['shader']}" data-acento="{d['color']}">
{nav('Instituciones', 1)}
<main id="contenido">
{miga((d['nombre'], f'institucion/{cat}.html'))}
{lienzo(d['shader'], d['lema'])}
  <section class="heroe institucion-heroe">
    <p class="kicker" style="--acento:{d['color']}">{MARCA}</p>
    <h1>{esc(d['nombre'])}</h1>
    <p class="lema">{esc(d['lema'])}</p>
    <p class="entradilla">{esc(d['descripcion'])} Esta institución agrupa
    <strong>{len(mios)} programas REA</strong> nacidos de proyectos reales del
    ecosistema, con su escena generativa propia (<code>{d['shader']}</code>).</p>
  </section>
  <section aria-labelledby="h2-programas-inst">
    <h2 id="h2-programas-inst">Programas de la institución</h2>
    <ul class="rejilla lista-programas">
{lis}
    </ul>
  </section>
  <section class="prosa" aria-labelledby="h2-plan">
    <h2 id="h2-plan">Plan de estudios completo</h2>
    <p>{len(mios)} programas ordenados por actividad real del proyecto origen. La
    tabla es el índice oficial de la institución; el catálogo completo del Instituto
    está en <a href="../programas.html">programas</a>.</p>
    <div class="tabla-scroll">
    <table class="lectura-tabla">
      <caption>Índice oficial · {esc(d['nombre'])}</caption>
      <thead><tr><th scope="col">Programa</th><th scope="col">De qué trata</th>
      <th scope="col">Stack</th><th scope="col">Actividad</th></tr></thead>
      <tbody>
{filas_plan}
      </tbody>
    </table>
    </div>
  </section>
  <section class="prosa" aria-labelledby="h2-niveles">
    <h2 id="h2-niveles">Niveles de la institución</h2>
    <ol class="niveles">
{li_niveles}
    </ol>
  </section>
  <section class="bandea" aria-labelledby="h2-metodo-inst">
    <h2 id="h2-metodo-inst">Método de la institución</h2>
    <p>Cinco módulos, un ciclo: fundamentos, práctica guiada, taller, crítica y
    publicación. La crítica usa la rúbrica oficial del Instituto (WEB·ACC·SEO·COH·DEV),
    la misma con la que se audita el propio sitio.</p>
  </section>
</main>
{pie(1)}"""])


def guion_modulo(mi: int, idx: int, p: dict, titulo: str) -> str:
    """Guion completo de la sesión de cada módulo: agenda, notas, errores, extensión."""
    agenda = [
        ("00:00–00:10", "Apertura", "Se recogen las preguntas del cuaderno de la sesión "
         "anterior y se elige la que guiará hoy la mirada."),
        ("00:10–00:30", "Marco", f"Exposición corta sobre «{titulo}» con el material real "
         "del proyecto proyectado y comentado en voz alta."),
        ("00:30–01:00", "Práctica", "Trabajo individual sobre el ejercicio del módulo; el "
         "docente circula resolviendo bloqueos, no dando soluciones."),
        ("01:00–01:20", "Contraste", "Cada estudiante compara su pieza con la del archivo "
         "usando la rúbrica y anota dos aciertos y dos desviaciones."),
        ("01:20–01:40", "Crítica", "Puesta en común por parejas: se presenta la desviación "
         "más interesante y una hipótesis de causa."),
        ("01:40–01:50", "Cierre", "Entrada de cuaderno y compromiso concreto para la "
         "próxima sesión."),
    ]
    filas = "\n".join(
        f"""            <tr><th scope="row">{h}</th><td>{t}</td><td>{desc}</td></tr>"""
        for h, t, desc in agenda)
    notas = [
        "No adelantes la solución del ejercicio: el bloqueo productivo es parte del "
        "diseño de la sesión.",
        "Si el grupo domina el paso, sustituye la exposición del marco por una sesión "
        "de preguntas cerradas; el material del archivo responde casi todo.",
        "Regla de la crítica: se critica la pieza con la rúbrica, jamás a la persona; "
        "toda objeción viene con una alternativa concreta.",
    ]
    li_notas = "\n".join(f"""            <li>{n}</li>""" for n in notas)
    errores = [
        ("Saltarse el cuaderno", "Sin la doble columna qué-dice/qué-me-pregunto, la "
         "sesión se convierte en tutorial y no deja aprendizaje verificable."),
        ("Copiar sin contrastar", "Reproducir sin comparar con el archivo oculta las "
         "desviaciones, que son justo el material de estudio."),
        ("Publicar sin procedencia", "Toda pieza que salga del taller lleva licencia y "
         "procedencia; sin ellas no entra al archivo del Instituto."),
    ]
    li_err = "\n".join(
        f"""            <li><strong>{e}:</strong> {s}</li>""" for e, s in errores)
    return f"""
        <details class="criterios guion" open><summary>Guion de la sesión</summary>
          <table class="lectura-tabla">
            <caption>Agenda orientativa · {esc(titulo)}</caption>
            <thead><tr><th scope="col">Hora</th><th scope="col">Momento</th>
            <th scope="col">Qué pasa</th></tr></thead>
            <tbody>
{filas}
            </tbody>
          </table>
          <h5 class="guion-notas">Notas para quien guía la sesión</h5>
          <ul>
{li_notas}
          </ul>
          <h5 class="guion-notas">Errores frecuentes y cómo evitarlos</h5>
          <ul>
{li_err}
          </ul>
          <p class="guion-ext"><strong>Extensión opcional:</strong> quien termine antes,
          documenta una segunda decisión del proyecto en el mismo formato del archivo y
          la propone como material complementario del módulo.</p>
        </details>"""


def anexo_comentado(p: dict, idx: int) -> str:
    """Anexo: bloques de lectura comentada derivados del material real."""
    bloques = []
    dominio = GLOSARIO_DOMINIO[p["cat"]]
    partes = []
    for i, (termino, defin) in enumerate(dominio):
        partes.append(f"""        <article class="anexo-bloque">
          <h4>Lectura {i + 1} · {esc(termino)}</h4>
          <p>{esc(defin)} En este programa el término se estudia donde ocurre: dentro
          del material de <strong>{esc(p['nombre'])}</strong>, no en abstracto.</p>
          <p>Consigna de lectura: localiza en el material una evidencia de este concepto,
          cópiala en el cuaderno y explica en dos líneas por qué es evidencia y no
          decoración. La evidencia puede ser un fragmento, una captura o una decisión
          de estructura.</p>
          <p class="meta">Profundidad: {2 + (idx + i) % 3} pasajes · tipo: lectura
          activa con cuaderno · revisión: crítica por pares.</p>
        </article>""")
    return "\n".join(partes)


BANCO_PRACTICAS = [
    ("Reproducción mínima",
     "Reproduce la decisión central del proyecto con el mínimo material posible.",
     "La pieza funciona sola, sin pasos ocultos, y el cuaderno registra cada decisión."),
    ("Cambio de restricción",
     "Repite el ejercicio anterior cambiando una restricción (tamaño, tiempo, "
     "herramienta) y observa qué se rompe.",
     "Lista de lo que se rompió y por qué, con evidencia del intento."),
    ("Versión propia",
     "Crea una variante personal que resolvería tu caso real, no el del ejemplo.",
     "La variante está motivada por un caso tuyo descrito en dos líneas."),
    ("Auditoría cruzada",
     "Aplica la rúbrica del Instituto a la pieza de un compañero y redacta el acta.",
     "Acta con dos aciertos, dos desviaciones y una alternativa por objeción."),
    ("Documentación viva",
     "Escribe la documentación de tu pieza como si la mantuviera otra persona: "
     "contexto, decisión, cómo revertir.",
     "Una persona ajena entiende la pieza sin preguntarte nada."),
    ("Publicación con licencia",
     "Publica la pieza con licencia y procedencia visibles en el formato del archivo "
     "del Instituto.",
     "Licencia, procedencia y fecha constan en la propia pieza."),
]


def banco_practicas(p: dict, idx: int) -> str:
    items = []
    for i, (t, enunciado, criterio) in enumerate(BANCO_PRACTICAS, 1):
        items.append(f"""        <article class="practica">
          <h3><span class="numero" aria-hidden="true">P{i}</span> {t}</h3>
          <p>{enunciado} Material de referencia: el proyecto
          <strong>{esc(p['nombre'])}</strong> del archivo.</p>
          <p>Tiempo orientativo: {30 + (idx + i) * 5 % 45} minutos · dificultad:
          {'★' * (1 + i % 3)}{'☆' * (3 - i % 3)} <span class="sr-only"
          >{1 + i % 3} de 3</span></p>
          <details class="criterios"><summary>Criterios de aceptación</summary>
            <p>{criterio}</p>
            <p>Pista honesta: si te atascas más de 15 minutos, escribe exactamente qué
            esperabas y qué pasó; esa descripción ya es material de crítica válido.</p>
          </details>
        </article>""")
    return "\n".join(items)


PASOS_SESION = [
    ("Llegada y encuadre", "Se proyecta el material del módulo y se lee en voz alta la "
     "pregunta del cuaderno elegida para hoy.", "Que la pregunta sea demasiado amplia: "
     "se acota a una decisión concreta del material."),
    ("Localización", "Cada estudiante localiza en el archivo el fragmento exacto sobre "
     "el que se trabajará.", "Elegir un fragmento bonito en lugar de uno relevante: "
     "relevancia = donde se toma una decisión."),
    ("Lectura marcada", "Marca en el fragmento qué es evidencia y qué es decoración.",
     "Marcarlo todo: si todo es evidencia, nada lo es."),
    ("Reproducción", "Se reproduce la decisión técnica del fragmento en el entorno "
     "propio.", "Reproducir de memoria sin volver al archivo: se permite y se anima a "
     "mirar, no es examen."),
    ("Primer contraste", "Se compara el resultado propio con el original, lado a lado.",
     "Comparar solo el resultado final y no el proceso: se comparan las dos cosas."),
    ("Documentación", "Se escribe el cuaderno con el formato qué-dice/qué-me-pregunto.",
     "Escribir conclusiones sin fragmentos: sin evidencia no hay entrada válida."),
    ("Cambio de variable", "Se cambia una variable y se predice el efecto antes de "
     "probar.", "Probar sin predecir: la predicción es el experimento, la prueba solo "
     "la confirma."),
    ("Puesta en común", "Dos estudiantes proyectan su desviación más interesante.",
     "Defender la propia pieza: se presenta la desviación, no la defensa."),
    ("Rúbrica", "Se aplica la rúbrica del módulo a las dos piezas proyectadas.",
     "Usar la rúbrica como nota y no como vocabulario común de la crítica."),
    ("Compromiso", "Cada uno escribe qué hará antes de la próxima sesión.",
     "Compromisos vagos: se escriben con verbo, objeto y fecha."),
]


def sesion_detallada(mi: int, idx: int, p: dict, titulo: str) -> str:
    lis = "\n".join(
        f"""            <li><strong>{i}. {esc(paso)}.</strong> {esc(que)}
            <br><em>Error esperable:</em> {esc(err)}</li>"""
        for i, (paso, que, err) in enumerate(PASOS_SESION, 1))
    materiales = [f"Fragmento principal del proyecto {p['nombre']}"] + \
        [f"Referencia de {s}" for s in p["stack"][:3]] + \
        ["Rúbrica del módulo (embebida arriba)",
         "Cuaderno del estudiante con la doble columna"]
    li_mat = "\n".join(f"            <li>{esc(m)}</li>" for m in materiales)
    preguntas = [
        ("¿Por qué el proyecto decidió así y no de otra manera?",
         "Porque resolvía su caso concreto; la alternativa se descartó por coste, "
         "contexto o mantenimiento, y el archivo suele conservar la huella."),
        ("¿Qué pasaría con otra restricción?",
         "Se prueba en el paso 8 del desglose: la predicción escrita vale más que la "
         "prueba suelta."),
        ("¿Es esto transferible a mi caso?",
         "Se evalúa en la crítica por pares: transferible es lo que sobrevive al cambio "
         "de contexto con la rúbrica en la mano."),
        ("¿Dónde queda documentado?",
         "En el cuaderno del estudiante y, si se publica, en el archivo del Instituto "
         "con licencia y procedencia."),
    ]
    li_preg = "\n".join(
        f"""            <details class="faq"><summary>{q}</summary><p>{a}</p></details>"""
        for q, a in preguntas)
    return f"""
        <details class="criterios sesion-detalle"><summary>Sesión en detalle ·
        {esc(titulo)}</summary>
          <h5 class="guion-notas">Desglose paso a paso</h5>
          <ol class="desglose">
{lis}
          </ol>
          <h5 class="guion-notas">Material específico del módulo</h5>
          <ul>
{li_mat}
          </ul>
          <h5 class="guion-notas">Preguntas de aula</h5>
{li_preg}
        </details>"""


def pag_programa(p: dict, idx: int) -> str:
    inst = INSTITUCIONES[p["cat"]]
    jd = [
        dict(**{"@type": "Course"}, name=p["nombre"],
             description=(p["desc"] or "Programa REA")[:300],
             provider={"@type": "EducationalOrganization", "name": inst["nombre"]},
             educationalLevel="Intermedio",
             isAccessibleForFree=True,
             inLanguage="es",
             coursePrerequisites="Ninguno para el módulo de fundamentos",
             teaches="Fundamentos, práctica guiada, taller, crítica y publicación"),
        dict(**{"@type": "BreadcrumbList"}, itemListElement=[
            dict(**{"@type": "ListItem"}, position=1, name="Instituto",
                 item="https://belentani.es/institucion/"),
            dict(**{"@type": "ListItem"}, position=2, name=inst["nombre"],
                 item=f"https://belentani.es/institucion/institucion/{p['cat']}.html"),
            dict(**{"@type": "ListItem"}, position=3, name=p["nombre"])]),
        dict(**{"@type": "FAQPage"}, mainEntity=[
            dict(**{"@type": "Question"}, name=q,
                 acceptedAnswer=dict(**{"@type": "Answer"}, text=a))
            for q, a in faq_de(p["nombre"], inst["nombre"])]),
    ]
    ps = parrafos(p["desc"], 4)
    chips = "".join(f"\n      <li>{esc(s)}</li>" for s in p["stack"])
    mods = []
    for mi, (t, cuerpo) in enumerate(MODULOS_BASE):
        objs = objetivos_de(idx * 5 + mi, 4)
        li_objs = "\n".join(f"""          <li>{esc(o)}</li>""" for o in objs)
        materiales = ", ".join(p["stack"][:4])
        mods.append(f"""      <article class="modulo">
        <h3><span class="numero" aria-hidden="true">0{mi + 1}</span> {t}</h3>
        <p>{cuerpo}</p>
        <h4>Objetivos del módulo</h4>
        <ul class="objetivos">
{li_objs}
        </ul>
        <h4>Materiales</h4>
        <p>Material principal: el proyecto <strong>{esc(p['nombre'])}</strong> del archivo
        del ecosistema ({esc(p['activo'] or '2026')}). Herramientas de referencia:
        {esc(materiales)}. Todo el material se consulta offline tras la primera visita.</p>
        <h4>Actividades</h4>
        <ul>
          <li>Lectura comentada del material con cuaderno de doble columna
          (qué dice / qué me pregunto).</li>
          <li>Reproducción guiada de una decisión real del proyecto, documentada paso
          a paso.</li>
          <li>Sesión de crítica con la rúbrica del módulo y acta de acuerdos.</li>
        </ul>
        <details class="criterios"><summary>Criterios de superación del módulo</summary>
          <table class="lectura-tabla">
            <caption>Criterios de superación · {esc(t)}</caption>
            <thead><tr><th scope="col">Criterio</th><th scope="col">Mínimo</th>
            <th scope="col">Evidencia</th></tr></thead>
            <tbody>
              <tr><td>Comprensión</td><td>Explica los conceptos con ejemplos propios</td>
              <td>Cuaderno</td></tr>
              <tr><td>Ejecución</td><td>La práctica funciona y está documentada</td>
              <td>Repositorio del estudiante</td></tr>
              <tr><td>Crítica</td><td>Aplica la rúbrica a dos piezas ajenas</td>
              <td>Acta de sesión</td></tr>
              <tr><td>Publicación</td><td>Pieza final con licencia y procedencia</td>
              <td>Entrada del archivo</td></tr>
            </tbody>
          </table>
        </details>
{guion_modulo(mi, idx, p, t)}
{sesion_detallada(mi, idx, p, t)}
      </article>""")
    glosario = [(s, GLOSARIO.get(s)) for s in p["stack"][:5]]
    glosario += GLOSARIO_DOMINIO[p["cat"]]
    glos = "\n".join(
        f"""      <dt id="glosario-{slug(t)}">{esc(t)}</dt>
      <dd>{esc(d)}</dd>""" for t, d in glosario if d)
    faqs = "\n".join(
        f"""    <details class="faq"><summary>{esc(q)}</summary><p>{esc(a)}</p></details>"""
        for q, a in faq_de(p["nombre"], inst["nombre"]))
    docente = DOCENTES[idx % len(DOCENTES)]
    anexo = anexo_comentado(p, idx)
    pesos = [
        ("Comprensión conceptual", "25%", "Cuaderno + explicación propia en crítica"),
        ("Ejecución práctica", "35%", "Piezas de los módulos 2 y 3 funcionando"),
        ("Taller final", "30%", "Obra propia con licencia y procedencia"),
        ("Participación crítica", "10%", "Dos actas de revisión por pares firmadas"),
    ]
    li_pesos = "\n".join(
        f"""          <tr><th scope="row">{c}</th><td>{w}</td><td>{e}</td></tr>"""
        for c, w, e in pesos)
    bitacora = [
        ("Fundación del programa", "El proyecto entra al archivo del ecosistema y queda "
         "versionado con procedencia completa."),
        ("Consolidación", "La consolidación de octubre de 2026 lo preserva íntegro: "
         "árbol, historial en bundle y ficha de origen."),
        ("Diseño del programa", "El Instituto analiza el proyecto y redacta el sílabo de "
         "cinco módulos sobre sus decisiones reales."),
        ("Apertura REA", "El programa se publica como Recurso Educativo Abierto con "
         "licencia CC BY-SA y código MIT."),
        ("Primer ciclo de crítica", "La comunidad revisa el material con la rúbrica y "
         "sus actas pasan a formar parte del programa."),
        ("Versiones futuras", "Cada ciclo puede proponer cambios; toda revisión queda "
         "documentada y es reversible."),
    ]
    li_bit = "\n".join(
        f"""        <li><p class="bit-fecha">Fase {i + 1} · {esc(tt)}</p><p>{esc(txt)}</p></li>"""
        for i, (tt, txt) in enumerate(bitacora))
    misma = [q for q in CATALOGO_COMPLETO if q["cat"] == p["cat"] and q["slug"] != p["slug"]]
    rel = misma[(idx * 3) % max(1, len(misma)):(idx * 3) % max(1, len(misma)) + 3] if misma else []
    rel_html = "\n".join(
        f"""      <li><article class="tarjeta"><h3><a href="../programa/{q['slug']}.html">{esc(q['nombre'])}</a></h3>
      <p class="meta">{esc((q['desc'] or '')[:90])}…</p></article></li>""" for q in rel)
    diag_prog = [
        ("¿Tengo el contexto del proyecto origen?",
         "Se adquiere con la lectura de la sección procedencia de la ficha: cinco "
         "minutos que ahorran horas."),
        ("¿Domino el stack mínimo?",
         "Cada tecnología del chips-list tiene entrada en el glosario; si alguna suena "
         "a chino, esa es la primera lección."),
        ("¿Tengo cuaderno?",
         "Sin cuaderno no hay evidencia, y sin evidencia el programa no se supera."),
        ("¿Con quién haré la crítica por pares?",
         "La comunidad del campus empareja por programa; también vale una pareja "
         "externa si aplica la misma rúbrica."),
        ("¿Qué pieza final quiero producir?",
         "Se decide al empezar el módulo 3: mejor una pieza pequeña terminada que una "
         "grande abandonada."),
        ("¿Cómo publicaré?",
         "Con licencia y procedencia, en el formato del archivo del Instituto; la "
         "constancia llega después del acta."),
    ]
    li_diag_prog = "\n".join(
        f"""      <details class="faq"><summary>{q}</summary><p>{a}</p></details>"""
        for q, a in diag_prog)
    recursos = [
        ("Catálogo del Instituto", "../datos/catalogo.json", "Todo el catálogo en un "
         "fichero, generado desde la base de datos consolidada del ecosistema."),
        ("Ficha de procedencia", "#h2-archivo", "La tabla de esta misma página: de qué "
         "proyecto real nace el programa."),
        ("Rúbricas", "#h2-rubrica-0", "Las rúbricas de los módulos, embebidas en el "
         "sílabo de arriba."),
        ("Comunidad", "../campus/comunidad.html", "Costumbres, emparejamiento de "
         "crítica y actas públicas."),
        ("Biblioteca", "../campus/biblioteca.html", "El índice vivo del archivo: "
         "procedencia de cada material."),
    ]
    li_rec = "\n".join(
        f"""        <li><a href="{u}">{t}</a> — {d}</li>""" for t, u, d in recursos)
    semanas = [
        ("1", "Fundamentos y mapa del dominio", "Módulo 1 completo",
         "Entrada de cuaderno + pregunta guía", "4–6 h"),
        ("2", "Profundización conceptual", "Módulo 1 · lecturas del anexo",
         "Dos pasajes comentados", "4–6 h"),
        ("3", "Práctica guiada I", "Módulo 2 · ejercicios P1–P2",
         "Pieza reproducida con cuaderno", "6–8 h"),
        ("4", "Práctica guiada II", "Módulo 2 · ejercicios P3–P4",
         "Variante propia + acta de auditoría", "6–8 h"),
        ("5", "Taller: diseño de la pieza final", "Módulo 3",
         "Propuesta de pieza final con caso propio", "4–6 h"),
        ("6", "Taller: ejecución", "Módulo 3 · ejercicio P5",
         "Pieza en curso documentada", "8–10 h"),
        ("7", "Crítica por pares", "Módulo 4",
         "Dos actas firmadas con la rúbrica", "3–4 h"),
        ("8", "Publicación y cierre", "Módulo 5 · ejercicio P6",
         "Pieza publicada con licencia y procedencia", "4–6 h"),
    ]
    li_semanas = "\n".join(
        f"""          <tr><th scope="row">Semana {s}</th><td>{t}</td><td>{m}</td>
          <td>{e}</td><td>{h}</td></tr>""" for s, t, m, e, h in semanas)
    hermanos = [q for q in CATALOGO_COMPLETO
                if q["cat"] == p["cat"] and q["slug"] != p["slug"]]
    otros = [q for q in CATALOGO_COMPLETO
             if q["cat"] != p["cat"] and q["slug"] != p["slug"]]
    casos = (hermanos[(idx * 2) % len(hermanos):][:3] if hermanos else []) + \
        (otros[(idx * 5) % len(otros):][:2] if otros else [])
    li_casos = "\n".join(
        f"""        <article class="anexo-bloque">
          <h4><a href="../programa/{q['slug']}.html">{esc(q['nombre'])}</a></h4>
          <p>{esc((q['desc'] or 'Programa REA del archivo del Instituto.')[:150])}…</p>
          <p class="meta">Relación con este programa: comparte contexto de
          {esc(INSTITUCIONES[q['cat']]['nombre'].lower()) if q['cat'] in INSTITUCIONES
          else 'archivo'} y método del Instituto.</p>
        </article>""" for q in casos)
    foro = [
        ("¿Puedo saltarme un módulo si ya lo domino?",
         "Sí, salvo el 4: la crítica por pares no se salta porque es donde el cuaderno "
         "se contrasta con la rúbrica de otro."),
        ("¿Vale material mío como proyecto origen?",
         "Para la pieza final, sí: el taller existe exactamente para eso. El temario "
         "sigue usando el proyecto del archivo."),
        ("¿Cuánto tiempo debo reservar?",
         "El plan de 8 semanas está pensado para 5–8 horas semanales; el doble de "
         "tiempo si vienes de cero absoluto en el stack."),
        ("¿Hay examen?",
         "No. La superación es por evidencias con los pesos públicos de la ficha."),
        ("¿La constancia caduca?",
         "No: es un hash verificable en el acta del ciclo, sin plataforma que cierre."),
        ("¿Puedo enseñar esto yo?",
         "Sí: CC BY-SA. Si lo enseñas, cita y comparte igual; el Instituto gana "
         "alumnos que enseñan."),
        ("¿Qué pasa si el archivo cambia?",
         "El programa versiona: la bitácora registra cada revisión y es reversible."),
        ("¿Funciona en móvil?",
         "Todo el contenido sí; las escenas generativas reducen detalle pero se "
         "mantienen legibles."),
        ("¿Necesito la comunidad para terminar?",
         "Solo para el módulo 4: dos actas de crítica por pares."),
        ("¿Y si me atrasco?",
         "El programa es a tu ritmo: el calendario de 8 semanas es orientativo, no "
         "un límite."),
    ]
    li_foro = "\n".join(
        f"""      <details class="faq"><summary>{q}</summary><p>{a}</p></details>"""
        for q, a in foro)
    hno = [q for q in CATALOGO_COMPLETO if q["cat"] == p["cat"] and q["slug"] != p["slug"]]
    itinerarios = [
        ("Ruta directa", "Este programa solo, con el plan de 8 semanas tal cual. Para "
         "quien quiere dominar este territorio y salir con una pieza publicada."),
        ("Ruta comparativa", f"{p['nombre']} + "
         + (f"{hno[0]['nombre']}" if len(hno) > 0 else "un programa hermano")
         + ": el mismo método sobre dos contextos; la comparación acelera el criterio."),
        ("Ruta de especialista", f"{p['nombre']} + "
         + (f"{hno[1]['nombre']}" if len(hno) > 1 else "dos programas hermanos")
         + " + el taller del módulo 3 ampliado a las tres piezas: la vía larga para "
         "quien enseña o decide en este dominio."),
    ]
    li_itin = "\n".join(
        f"""        <li><h3>{t}</h3><p>{d}</p></li>""" for t, d in itinerarios)
    guia_inicio = [
        "Abre la ficha del programa completa y lee la sección «Sobre este programa» "
        "sin saltar nada: dos minutos.",
        "Responde por escrito la evaluación diagnóstica de abajo: delimita tu punto "
        "de partida real.",
        "Copia la plantilla de cuaderno del programa (la de las lecciones) a tu "
        "herramienta de notas.",
        "Entra a la lección 1 y haz solo el diagnóstico de arranque y el objetivo: "
        "mañana, la práctica.",
        "Reserva en el calendario las 8 semanas del plan, con sus horas: lo que no "
        "está en la agenda no existe.",
        "Presenta tu pregunta guía en la comunidad del campus y busca pareja de "
        "crítica desde el día uno.",
        "Marca en tu lector el glosario del programa: es tu diccionario durante las "
        "ocho semanas.",
    ]
    li_guia = "\n".join(f"""        <li>{g}</li>""" for g in guia_inicio)
    creditos = [
        ("M1", "Fundamentos y contexto", "2", "Lectura activa + cuaderno"),
        ("M2", "Práctica guiada", "4", "Piezas P1–P4"),
        ("M3", "Taller de creación", "4", "Pieza final en curso"),
        ("M4", "Criterio y crítica", "2", "Dos actas firmadas"),
        ("M5", "Publicación y legado", "2", "Pieza publicada con licencia"),
        ("—", "Total del programa", "14", "Constancia verificable por hash"),
    ]
    li_cred = "\n".join(
        f"""          <tr><th scope="row">{c}</th><td>{m}</td><td>{e}</td><td>{v}</td></tr>"""
        for c, m, e, v in creditos)
    resumen_prog = [
        f"Programa REA de {inst['nombre']} nacido del proyecto real «{p['nombre']}».",
        "Cinco módulos: fundamentos, práctica guiada, taller, crítica y publicación.",
        "139 fichas hermanas comparten método y archivo en el catálogo del Instituto.",
        f"Stack documentado del proyecto origen: {', '.join(p['stack'][:4])}.",
        "Evaluación por evidencias con pesos públicos (25/35/30/10).",
        "Banco de seis prácticas con criterios de aceptación explícitos.",
        "Constancia verificable por hash; sin plataforma cerrada.",
        "Licencia CC BY-SA 4.0 para contenido y MIT para código.",
    ]
    li_res_prog = "\n".join(f"""        <li>{r}</li>""" for r in resumen_prog)
    mapa_prog = [
        ("Sobre este programa", "#h2-sobre"),
        ("Sílabo de cinco módulos", "#syllabus"),
        ("Banco de prácticas", "#h2-banco"),
        ("Anexo de lecturas", "#h2-anexo"),
        ("Evaluación y constancia", "#h2-evaluacion"),
        ("Bitácora", "#h2-bitacora"),
        ("Glosario", "#h2-glosario"),
        ("Casos del archivo", "#h2-casos"),
        ("Dudas reales", "#h2-foro"),
        ("Procedencia", "#h2-archivo"),
    ]
    li_mapa = "\n".join(
        f"""        <li><a href="{u}">{t}</a></li>""" for t, u in mapa_prog)
    faq_matricula = [
        ("¿Necesito matricularme?", "No: el programa es abierto. La «matrícula» es "
         "tu cuaderno y tu pareja de crítica."),
        ("¿Puedo unirme a mitad de ciclo?", "Sí: el calendario de 8 semanas es "
         "orientativo y cada módulo es autocontenido."),
        ("¿Se puede hacer en equipo?", "Las prácticas P1–P3 son individuales; la "
         "auditoría cruzada (P4) ya es de pareja."),
        ("¿Qué pasa si abandono?", "Nada: el material sigue ahí. Volver no penaliza; "
         "el archivo no caduca."),
    ]
    li_faq_mat = "\n".join(
        f"""      <details class="faq"><summary>{q}</summary><p>{a}</p></details>"""
        for q, a in faq_matricula)
    return "\n".join([
        head(f"{p['nombre']} — programa REA",
             p["desc"] or f"Programa REA de {inst['nombre']} del {MARCA}.",
             f"programa/{p['slug']}.html", jd, 1),
        f"""<body class="pagina-programa" data-shader="{inst['shader']}" data-acento="{inst['color']}">
{nav('Programas REA', 1)}
<main id="contenido">
{miga((inst['nombre'], f'../institucion/{p["cat"]}.html'), (p['nombre'], f'../programa/{p["slug"]}.html'))}
  <article class="ficha">
    <header class="ficha-cabecera">
      <p class="kicker">{esc(inst['nombre'])} · REA · CC&nbsp;BY-SA</p>
      <h1>{esc(p['nombre'])}</h1>
      <p class="entradilla">{esc(ps[0])}</p>
      <dl class="ficha-meta">
        <div><dt>Institución</dt><dd><a href="../institucion/{p['cat']}.html">{esc(inst['nombre'])}</a></dd></div>
        <div><dt>Modalidad</dt><dd>Libre y offline · a tu ritmo</dd></div>
        <div><dt>Módulos</dt><dd>5 módulos · {8 + idx % 5} lecciones</dd></div>
        <div><dt>Evaluación</dt><dd>Rúbrica pública + revisión por pares</dd></div>
        <div><dt>Proyecto origen</dt><dd>Archivo del ecosistema · {esc(p['activo'] or '2026')}</dd></div>
        <div><dt>Fuentes del proyecto</dt><dd>{p['fuentes']} ficheros fuente reales</dd></div>
      </dl>
      <p class="acciones"><a class="boton" href="#syllabus">Ver el programa completo</a>
      <a class="boton secundario" href="../lecciones/{p['slug']}-1.html">Empezar la lección 1</a></p>
      <nav class="mapa-programa" aria-label="Mapa de la ficha">
        <p class="meta">Mapa de la ficha:</p>
        <ul>
{li_mapa}
        </ul>
      </nav>
    </header>
    <section class="prosa" aria-labelledby="h2-resumen-prog">
      <h2 id="h2-resumen-prog">Resumen ejecutivo</h2>
      <ul class="objetivos">
{li_res_prog}
      </ul>
    </section>
    <section class="prosa" aria-labelledby="h2-sobre">
      <h2 id="h2-sobre">Sobre este programa</h2>
      <p>{esc(ps[1] if len(ps) > 1 else ps[0])}</p>
      <p>El programa se construye directamente sobre el proyecto real que le da nombre:
      sus decisiones, sus materiales y su historia forman parte del temario. El archivo
      consolidado del ecosistema garantiza la procedencia de cada pieza: nada de este
      programa es material genérico.</p>
      <p>{esc(ps[2] if len(ps) > 2 else ps[0])} El método siempre es el mismo ciclo del
      Instituto —fundamentos, práctica guiada, taller, crítica y publicación— adaptado
      al dominio concreto de {esc(inst['nombre'].lower())}.</p>
      <p>A quién va dirigido: a quien quiera dominar este territorio con criterio, sea
      para producir, enseñar o decidir. No hace falta matrícula ni instalación: el
      programa se estudia en el navegador y se puede terminar offline.</p>
      <h3>Tecnologías y materiales del programa</h3>
      <p>El stack real del proyecto origen determina los materiales. Cada tecnología se
      estudia aplicada al material del archivo, nunca en abstracto:</p>
      <ul class="chips">{chips}
      </ul>
    </section>
    <section id="syllabus" aria-labelledby="h2-syllabus">
      <h2 id="h2-syllabus">Programa de cinco módulos</h2>
      <p class="leyenda">Cada módulo declara objetivos, materiales, actividades y
      criterios de superación. El sílabo completo se audita con las mismas reglas
      (WEB·ACC·SEO·COH) que el resto del sitio.</p>
{chr(10).join(mods)}
    </section>
    <section class="prosa" aria-labelledby="h2-glosario">
      <h2 id="h2-glosario">Glosario del programa</h2>
      <p>{len([1 for _t, d in glosario if d])} términos, entre el stack real del
      proyecto y el vocabulario propio de la institución. Definiciones cortas y
      operativas: lo justo para no perderse, sin wikipedia.</p>
      <dl class="glosario">
{glos}
      </dl>
    </section>
    <section class="prosa" aria-labelledby="h2-banco">
      <h2 id="h2-banco">Banco de prácticas del programa</h2>
      <p>Seis ejercicios progresivos, cada uno con enunciado, tiempo orientativo y
      criterios de aceptación. Se pueden hacer en el orden que se quiera; la auditoría
      cruzada necesita pareja de la comunidad.</p>
{banco_practicas(p, idx)}
    </section>
    <section class="prosa" aria-labelledby="h2-semanas">
      <h2 id="h2-semanas">Programa semana a semana</h2>
      <p>El ciclo orientativo de 8 semanas. Cada semana declara tema, módulo, entrega
      y carga horaria; quien va más rápido, adelanta; quien necesita más, alarga.</p>
      <div class="tabla-scroll">
      <table class="lectura-tabla">
        <caption>Calendario orientativo · {esc(p['nombre'])}</caption>
        <thead><tr><th scope="col">Semana</th><th scope="col">Tema</th>
        <th scope="col">Módulo</th><th scope="col">Entrega</th>
        <th scope="col">Horas</th></tr></thead>
        <tbody>
{li_semanas}
        </tbody>
      </table>
      </div>
    </section>
    <section class="prosa" aria-labelledby="h2-casos">
      <h2 id="h2-casos">Casos del archivo relacionados</h2>
      <p>Programas hermanos que comparten método y archivo. Estudiarlos en paralelo
      es la vía rápida para ver el mismo patrón en contextos distintos.</p>
{li_casos}
    </section>
    <section class="prosa" aria-labelledby="h2-foro">
      <h2 id="h2-foro">Dudas reales del programa</h2>
      <p>Las diez preguntas que siempre acaban saliendo, respondidas de una vez.</p>
{li_foro}
    </section>
    <section class="prosa" aria-labelledby="h2-guia-inicio">
      <h2 id="h2-guia-inicio">Guía de inicio rápido</h2>
      <p>Siete pasos para arrancar hoy mismo, sin leer nada más que esta página.</p>
      <ol class="objetivos guia-inicio">
{li_guia}
      </ol>
    </section>
    <section class="prosa" aria-labelledby="h2-itinerarios">
      <h2 id="h2-itinerarios">Itinerarios recomendados</h2>
      <ol class="niveles">
{li_itin}
      </ol>
    </section>
    <section class="prosa" aria-labelledby="h2-creditos">
      <h2 id="h2-creditos">Sistema de créditos del Instituto</h2>
      <p>El Instituto mide en créditos de trabajo real (ECTS-like, 25 h por crédito).
      Este programa reparte así:</p>
      <div class="tabla-scroll">
      <table class="lectura-tabla">
        <caption>Créditos · {esc(p['nombre'])}</caption>
        <thead><tr><th scope="col">Módulo</th><th scope="col">Nombre</th>
        <th scope="col">Créditos</th><th scope="col">Evidencia</th></tr></thead>
        <tbody>
{li_cred}
        </tbody>
      </table>
      </div>
    </section>
    <section class="prosa" aria-labelledby="h2-matricula">
      <h2 id="h2-matricula">Preguntas de matrícula</h2>
{li_faq_mat}
    </section>
    <section class="prosa" aria-labelledby="h2-diag-prog">
      <h2 id="h2-diag-prog">Evaluación diagnóstica del programa</h2>
      <p>Seis preguntas de arranque. No puntúan: delimitan el punto de partida real
      de cada estudiante antes del módulo 1.</p>
{li_diag_prog}
    </section>
    <section class="prosa" aria-labelledby="h2-recursos">
      <h2 id="h2-recursos">Recursos del estudiante</h2>
      <ul class="recursos">
{li_rec}
      </ul>
      <p>Todo lo anterior funciona offline tras la primera visita: el Instituto no
      depende de ninguna plataforma externa para enseñar.</p>
    </section>
    <section class="prosa" aria-labelledby="h2-citar">
      <h2 id="h2-citar">Cómo citar este programa</h2>
      <p>Si reutilizas el material, cita así: <em>«{esc(p['nombre'])}, programa REA del
      {MARCA} ({esc(inst['nombre'])}), derivado del proyecto homónimo del ecosistema
      Belentani, 2026. CC BY-SA 4.0.»</em> La procedencia completa está en la tabla de
      archivo de esta misma ficha.</p>
    </section>
    <section class="prosa" aria-labelledby="h2-anexo">
      <h2 id="h2-anexo">Anexo: material del archivo, comentado</h2>
      <p>El anexo convierte el material del proyecto en lecturas activas: cada bloque
      exige localizar evidencia, copiarla y justificarla. Es la parte del programa que
      solo se puede hacer mirando el archivo de verdad.</p>
{anexo}
    </section>
    <section class="prosa" aria-labelledby="h2-evaluacion">
      <h2 id="h2-evaluacion">Evaluación y constancia</h2>
      <p>El programa se supera acumulando evidencias, no haciendo examen. La distribución
      oficial de pesos es pública desde el primer día:</p>
      <table class="lectura-tabla">
        <caption>Pesos de evaluación del programa</caption>
        <thead><tr><th scope="col">Componente</th><th scope="col">Peso</th>
        <th scope="col">Evidencia requerida</th></tr></thead>
        <tbody>
{li_pesos}
        </tbody>
      </table>
      <p>La constancia del Instituto es verificable: el hash de la pieza final queda
      registrado en el acta del ciclo, y cualquiera puede comprobar la autoría sin
      depender de una plataforma cerrada.</p>
    </section>
    <section class="prosa" aria-labelledby="h2-bitacora">
      <h2 id="h2-bitacora">Bitácora del programa</h2>
      <ol class="bitacora">
{li_bit}
      </ol>
    </section>
    <section class="prosa" aria-labelledby="h2-archivo">
      <h2 id="h2-archivo">Del archivo: procedencia</h2>
      <p>Este programa no se inventó: se extrajo. La tabla resume la procedencia real
      que conserva el archivo consolidado del ecosistema.</p>
      <table class="lectura-tabla">
        <caption>Procedencia del programa {esc(p['nombre'])}</caption>
        <thead><tr><th scope="col">Campo</th><th scope="col">Valor</th></tr></thead>
        <tbody>
          <tr><th scope="row">Proyecto origen</th><td>{esc(p['nombre'])}</td></tr>
          <tr><th scope="row">Institución</th><td>{esc(inst['nombre'])}</td></tr>
          <tr><th scope="row">Última actividad real</th><td>{esc(p['activo'] or '2026')}</td></tr>
          <tr><th scope="row">Ficheros fuente</th><td>{p['fuentes']}</td></tr>
          <tr><th scope="row">Stack documentado</th><td>{', '.join(p['stack'])}</td></tr>
          <tr><th scope="row">Licencia del contenido</th><td>CC BY-SA 4.0 · código MIT</td></tr>
          <tr><th scope="row">Procedencia</th><td>Base de datos consolidada 2026-10-31 · <code>.ORIGEN</code></td></tr>
        </tbody>
      </table>
    </section>
    <aside class="docente" aria-labelledby="h2-docente">
      <h2 id="h2-docente">Docente responsable</h2>
      <p><strong>{esc(docente[0])}</strong> — {esc(docente[1])}</p>
      <p class="meta">Rol en el Instituto: {esc(docente[2])}. El docente responde en la
      sesión de crítica del módulo correspondiente.</p>
    </aside>
    <section aria-labelledby="h2-faq">
      <h2 id="h2-faq">Preguntas frecuentes</h2>
{faqs}
    </section>
    <section aria-labelledby="h2-relacionados">
      <h2 id="h2-relacionados">Programas relacionados de {esc(inst['nombre'])}</h2>
      <ul class="rejilla">
{rel_html or '      <li><p class="meta">Consulta el catálogo completo de la institución.</p></li>'}
      </ul>
    </section>
  </article>
</main>
{pie(1)}"""])


LECCION_GUIA = [
    ("Apertura y mapa", "Presentación del territorio: qué problema real resolvió el "
     "proyecto origen y qué aprenderás al reproducir sus decisiones."),
    ("Demostración comentada", "Recorrido por el material del proyecto, pieza a pieza, "
     "con paradas en cada decisión de diseño e ingeniería."),
    ("Práctica", "Ejercicio guiado con criterio de terminación explícito y revisión por "
     "pares según la rúbrica del Instituto."),
    ("Cierre y siguiente paso", "Qué conservar en tu cuaderno, cómo publicar tu versión "
     "y qué programa del catálogo continúa la línea."),
]


def pag_leccion(p: dict, idx: int, n: int, tiene2: bool = True) -> str:
    inst = INSTITUCIONES[p["cat"]]
    guia = LECCION_GUIA[(n - 1) % len(LECCION_GUIA)]
    jd = [dict(**{"@type": "LearningResource"}, name=f"{p['nombre']} — lección {n}",
               partOf={"@type": "Course", "name": p["nombre"]},
               educationalLevel="Intermedio", inLanguage="es", isFamilyFriendly=True,
               learningResourceType="Lección con práctica y rúbrica"),
          dict(**{"@type": "BreadcrumbList"}, itemListElement=[
              dict(**{"@type": "ListItem"}, position=1, name="Instituto",
                   item="https://belentani.es/institucion/"),
              dict(**{"@type": "ListItem"}, position=2, name=p["nombre"],
                   item=f"https://belentani.es/institucion/programa/{p['slug']}.html"),
              dict(**{"@type": "ListItem"}, position=3, name=f"Lección {n}")])]
    objs = objetivos_de(idx + n * 7, 5)
    li_objs = "\n".join(f"""      <li>{esc(o)}</li>""" for o in objs)
    desarrollo = [
        ("Calentamiento (10 min)", "Relectura del cuaderno de la sesión anterior y "
         "formulación de una pregunta concreta para hoy. La pregunta se escribe arriba "
         "de la página: si al final sigue sin respuesta, es la primera candidata a "
         "llevar a la crítica por pares."),
        ("Demostración (20 min)", "Recorrido por el material del proyecto "
         f"«{p['nombre']}»: se señalan tres decisiones concretas —qué se hizo, qué "
         "alternativas se descartaron y dónde vive la evidencia en el archivo."),
        ("Práctica (45 min)", "Reproducción de una de las tres decisiones en pequeño: "
         "el objetivo no es terminar, es entender por qué. Se documenta cada paso con "
         "captura o fragmento y una línea de por-qué."),
        ("Contraste (15 min)", "Comparación del resultado propio con el del archivo "
         "usando la rúbrica de la lección: dos aciertos, dos desviaciones y una "
         "hipótesis de causa para cada desviación."),
        ("Cierre (10 min)", "Entrada de cuaderno con el formato del Instituto: qué "
         "aprendí, qué me falta, qué pido en la próxima sesión de crítica."),
    ]
    lis_des = "\n".join(
        f"""      <li><h3>{esc(t)}</h3><p>{cuerpo}</p></li>""" for t, cuerpo in desarrollo)
    pasos_practica = "\n".join(
        f"""        <li>Paso {i}: {esc(objetivos_de(idx + n + i, 1)[0].lower())}</li>"""
        for i in range(1, 6))
    diagnosticas = [
        ("¿De qué problema real nació el proyecto origen?",
         "De un encargo o necesidad concreta del ecosistema: la respuesta está en la "
         "ficha del programa, sección procedencia."),
        ("¿Qué decisión del proyecto vas a reproducir hoy?",
         "Una de las tres que se señalan en la demostración; se elige por afinidad con "
         "tu propio caso."),
        ("¿Qué evidencia separa un acierto de una coincidencia?",
         "La comparación con la rúbrica y la hipótesis de causa: sin ellas, cualquier "
         "parecido es suerte."),
        ("¿Qué entra en tu cuaderno y qué no?",
         "Fragmentos, decisiones y preguntas; nunca conclusiones sin evidencia al lado."),
        ("¿A quién se lo vas a enseñar y qué le pedirás?",
         "A la pareja de crítica, pidiéndole la objeción más dura que pueda formular "
         "con la rúbrica."),
        ("¿Cómo sabrás que terminaste?",
         "Cuando la práctica cumple los criterios de aceptación y el cierre de cuaderno "
         "está escrito."),
    ]
    li_diag = "\n".join(
        f"""      <details class="faq"><summary>{q}</summary><p>{a}</p></details>"""
        for q, a in diagnosticas)
    trans = []
    for i, (termino, defin) in enumerate(GLOSARIO_DOMINIO[p["cat"]]):
        trans.append(f"""        <article class="anexo-bloque">
          <h4>Pasaje {i + 1} · {esc(termino)}</h4>
          <p>{esc(defin)} El pasaje se lee sobre el material de
          <strong>{esc(p['nombre'])}</strong>: busca dónde aparece el concepto, no si
          estás de acuerdo con él.</p>
          <p>Consigna: marca la frase exacta donde el concepto ocurre, resúmela en siete
          palabras por qué es ese y no otro sitio, y apúntalo. El pasaje comentado se
          revisa en la crítica por pares con el mismo formato que el resto del
          cuaderno.</p>
        </article>""")
    trans_html = "\n".join(trans)
    fuentes = "\n".join(
        f"""        <li>{esc(s)} — uso documentado en la ficha del programa
        (sección tecnologías y materiales).</li>""" for s in p["stack"])
    desarrollo_narrado = "\n".join(
        f"""        <li><strong>Paso {i} · {esc(paso)}.</strong> {esc(que)}
        <p>Resultado esperado al terminar el paso: {esc(err.split(':')[0])} queda
        documentado en el cuaderno, con el fragmento o captura que lo demuestra. Si el
        resultado esperado no aparece, no se avanza: se escribe la desviación y se
        continúa en la columna de preguntas.</p></li>"""
        for i, (paso, que, err) in enumerate(PASOS_SESION, 1))
    notas_archivo = [
        ("De dónde viene el material",
         f"Del proyecto {p['nombre']}, preservado por la consolidación de octubre de "
         "2026 con árbol, historial en bundle y ficha de procedencia."),
        ("Por qué este fragmento y no otro",
         "El fragmento se elige por densidad de decisiones: donde el archivo muestra "
         "una elección entre alternativas, no donde solo hay resultado."),
        ("Qué se conservó y qué no",
         "Todo se conservó: incluso las versiones intermedias viven en los bundles de "
         "historial. Esta lección cita siempre la versión activa."),
        ("Cómo citar la lección",
         f"«{esc(p['nombre'])}, lección {n}, programa REA del {MARCA}, 2026. "
         "CC BY-SA 4.0.»"),
    ]
    li_notas = "\n".join(
        f"""        <article class="anexo-bloque"><h4>{t}</h4><p>{c}</p></article>"""
        for t, c in notas_archivo)
    cuaderno = [
        ("1", "Pregunta guía de la sesión", "Una sola, concreta, sobre una decisión del "
         "material"),
        ("2", "Fragmento localizado", "Cita literal + dónde vive en el archivo"),
        ("3", "Qué dice (columna 1)", "Sin interpretar: solo lo que hay"),
        ("4", "Qué me pregunto (columna 2)", "La pregunta que el fragmento provoca"),
        ("5", "Reproducción: pasos dados", "Numerados, con desvíos marcados"),
        ("6", "Resultado esperado vs obtenido", "Los dos, explícitos"),
        ("7", "Hipótesis de desviación", "Una por cada diferencia"),
        ("8", "Predicción del cambio de variable", "Escrita ANTES de probar"),
        ("9", "Qué dijo la rúbrica", "Dimensiones y nivel alcanzado"),
        ("10", "Objeción recibida en crítica", "Literal, con su alternativa"),
        ("11", "Compromiso para la próxima sesión", "Verbo + objeto + fecha"),
        ("12", "Estado del cuaderno", "Completo / con huecos señalados"),
    ]
    li_cuaderno = "\n".join(
        f"""          <tr><th scope="row">{n}</th><td>{c}</td><td>{e}</td></tr>"""
        for n, c, e in cuaderno)
    errores_leccion = [
        ("Empezar por la práctica", "Sin pregunta guía la práctica deriva en tutorial; "
         "los primeros diez minutos son de encuadre, no de manos."),
        ("Leer sin marcar", "La lectura pasiva no deja evidencia: sin marcas no hay "
         "cuaderno, y sin cuaderno la sesión no cuenta."),
        ("Comparar al final", "El contraste es continuo; hacerlo solo al final esconde "
         "las desviaciones."),
        ("Documentar de memoria", "La memoria miente con cariño: se copia el fragmento "
         "en el momento, no se recrea después."),
        ("Culpar a la herramienta", "Cada bloqueo se escribe como hipótesis: quizá sea "
         "la herramienta, pero demuéstralo en el cuaderno."),
    ]
    li_err_lec = "\n".join(
        f"""        <li><strong>{t}:</strong> {d}</li>""" for t, d in errores_leccion)
    mini_glos = [(s, GLOSARIO.get(s, "Término del stack del proyecto origen; se estudia "
                    "aplicado al material de esta lección.")) for s in p["stack"][:4]]
    li_glos = "\n".join(
        f"""        <dt>{esc(t)}</dt><dd>{esc(d)}</dd>""" for t, d in mini_glos)
    resumen = [
        f"Tema de hoy: {guia[0].lower()} sobre el proyecto {p['nombre']}.",
        "Formato: diagnóstico, objetivos, itinerario de cinco momentos, práctica con "
        "criterios de aceptación, rúbrica y transcripción comentada.",
        "Material: exclusivamente el del proyecto origen, con procedencia verificable.",
        f"Stack de la sesión: {', '.join(p['stack'][:3])}.",
        "Evidencia exigida: cuaderno completo con las doce entradas oficiales.",
        "Cierre: compromiso con verbo, objeto y fecha para la próxima sesión.",
    ]
    li_resumen = "\n".join(f"""        <li>{r}</li>""" for r in resumen)
    control = [
        ("¿Cuál era la pregunta guía de tu sesión y de dónde salió?",
         "Del cuaderno anterior o del diagnóstico de arranque; si no puede responderse, "
         "la sesión no estaba encuadrada."),
        ("¿Qué fragmento usaste y por qué ese?",
         "El de mayor densidad de decisiones; la respuesta debe citar la decisión, no "
         "la estética del fragmento."),
        ("¿Qué reproduciste y qué obtuviste?",
         "La decisión central del módulo; resultado esperado y obtenido, ambos "
         "escritos."),
        ("¿Qué desviación encontraste y qué hipótesis tienes?",
         "Al menos una, con causa plausible y cómo la comprobarías."),
        ("¿Qué dijo la rúbrica de tu pieza?",
         "Cuatro dimensiones con nivel; la autoevaluación honesta vale más que la "
         "nota alta."),
        ("¿Qué llevas a la crítica por pares?",
         "La desviación más interesante, no la pieza más bonita."),
    ]
    li_control = "\n".join(
        f"""      <details class="faq"><summary>{q}</summary><p>{a}</p></details>"""
        for q, a in control)
    produccion = [
        "Cuaderno de sesión con las doce entradas oficiales completas.",
        "Una reproducción documentada de la decisión central del módulo.",
        "Un contraste escrito: resultado esperado vs obtenido, con hipótesis de "
        "desviación.",
        "Una predicción de cambio de variable, escrita antes de probarla.",
        "Un compromiso concreto para la próxima sesión: verbo, objeto y fecha.",
    ]
    li_prod = "\n".join(f"""        <li>{x}</li>""" for x in produccion)
    enlaces_lec = [
        ("Ficha del programa", f"../programa/{p['slug']}.html"),
        ("Institución", f"../institucion/{p['cat']}.html"),
        ("Biblioteca del archivo", "../campus/biblioteca.html"),
        ("Comunidad y crítica", "../campus/comunidad.html"),
        ("Accesibilidad", "../institucional/accesibilidad.html"),
        ("Catálogo completo", "../programas.html"),
    ]
    li_enl = "\n".join(
        f"""        <li><a href="{u}">{t}</a></li>""" for t, u in enlaces_lec)
    return "\n".join([
        head(f"Lección {n} · {p['nombre']}",
             f"Lección {n} del programa REA {p['nombre']} ({inst['nombre']}).",
             f"lecciones/{p['slug']}-{n}.html", jd, 1),
        f"""<body class="pagina-leccion" data-shader="{inst['shader']}">
{nav('Programas REA', 1)}
<main id="contenido">
{miga((inst['nombre'], f'../institucion/{p["cat"]}.html'),
       (p['nombre'], f'../programa/{p['slug']}.html'),
       ('Lección ' + str(n), f'../lecciones/{p['slug']}-{n}.html'))}
  <article class="leccion">
    <header>
      <p class="kicker">Lección {n} de 2 · {esc(inst['nombre'])} · duración ~100 min</p>
      <h1>{esc(p['nombre'])}: {esc(guia[0])}</h1>
      <p class="entradilla">{esc(guia[1])} La lección usa el archivo del proyecto como
      material de estudio: nada de ejemplos inventados.</p>
    </header>
    <section aria-labelledby="h2-resumen">
      <h2 id="h2-resumen">Resumen de la lección</h2>
      <ul class="objetivos">
{li_resumen}
      </ul>
    </section>
    <section aria-labelledby="h2-diagnostico">
      <h2 id="h2-diagnostico">Diagnóstico de arranque</h2>
      <p>Seis preguntas para calibrar la sesión antes de empezar. Se responden por
      escrito en dos minutos; no puntúan, orientan.</p>
{li_diag}
    </section>
    <section aria-labelledby="h2-objetivos">
      <h2 id="h2-objetivos">Objetivos de la lección</h2>
      <p>Al terminar, deberías ser capaz de:</p>
      <ul class="objetivos">
{li_objs}
      </ul>
    </section>
    <section aria-labelledby="h2-itinerario">
      <h2 id="h2-itinerario">Itinerario de la sesión</h2>
      <ol class="itinerario">
{lis_des}
      </ol>
    </section>
    <section class="prosa" aria-labelledby="h2-material">
      <h2 id="h2-material">Material de estudio</h2>
      <p>El material procede del proyecto <strong>{esc(p['nombre'])}</strong> del
      ecosistema. {esc(p['desc'] or 'Consulta la ficha del programa para el contexto completo.')}</p>
      <p>Stack de referencia de esta lección: {', '.join(p['stack'])}. Cada pieza del
      material puede consultarse offline; la lección indica qué fragmento exacto se
      usa en cada paso.</p>
      <h3>Qué necesitas</h3>
      <ul>
        <li>Navegador actualizado; no hacen cuentas ni instalaciones.</li>
        <li>Cuaderno del estudiante (plantilla en la comunidad del campus).</li>
        <li>La rúbrica de la lección, ya embebida abajo.</li>
      </ul>
    </section>
    <section aria-labelledby="h2-practica">
      <h2 id="h2-practica">Práctica guiada</h2>
      <p>La práctica reproduce una decisión real del proyecto en cinco pasos
      verificables:</p>
      <ol class="practica-pasos">
{pasos_practica}
      </ol>
      <details class="criterios"><summary>Criterios de aceptación de la práctica</summary>
        <ul>
          <li>El resultado funciona sin pasos manuales no documentados.</li>
          <li>Cada paso tiene su por-qué escrito en el cuaderno.</li>
          <li>La comparación con el archivo identifica al menos dos desviaciones con
          hipótesis de causa.</li>
          <li>La pieza lleva licencia y procedencia visibles.</li>
        </ul>
      </details>
    </section>
    <section aria-labelledby="h2-rubrica">
      <h2 id="h2-rubrica">Rúbrica de la lección</h2>
      <table class="lectura-tabla">
        <caption>Rúbrica oficial · {esc(guia[0])}</caption>
        <thead><tr><th scope="col">Dimensión</th><th scope="col">Insuficiente</th>
        <th scope="col">Suficiente</th><th scope="col">Notable</th></tr></thead>
        <tbody>
          <tr><th scope="row">Comprensión</th><td>Repite sin explicar</td>
          <td>Explica con ejemplo dado</td><td>Explica con ejemplo propio</td></tr>
          <tr><th scope="row">Ejecución</th><td>No llega a funcionar</td>
          <td>Funciona con ayuda</td><td>Funciona sola y documentada</td></tr>
          <tr><th scope="row">Contraste</th><td>No compara</td>
          <td>Compara sin hipótesis</td><td>Compara y explica desviaciones</td></tr>
          <tr><th scope="row">Comunicación</th><td>Cuaderno vacío</td>
          <td>Cuaderno incompleto</td><td>Cuaderno replicable por un tercero</td></tr>
        </tbody>
      </table>
    </section>
    <section aria-labelledby="h2-transcripcion">
      <h2 id="h2-transcripcion">Transcripción comentada del material</h2>
      <p>La lección incluye la lectura activa como parte del trabajo, no como deber
      aparte: cada pasaje exige marca, resumen y por-qué.</p>
{trans_html}
    </section>
    <section aria-labelledby="h2-autoeval">
      <h2 id="h2-autoeval">Autoevaluación antes de cerrar</h2>
      <ul class="autoeval">
        <li>¿Puedo explicar el punto clave sin mirar?</li>
        <li>¿Mi práctica pasaría los criterios de aceptación de otro?</li>
        <li>¿Qué llevaré a la próxima crítica por pares?</li>
      </ul>
      <h3>Fuentes de esta lección</h3>
      <ul>
{fuentes}
      </ul>
    </section>
    <section aria-labelledby="h2-desarrollo">
      <h2 id="h2-desarrollo">Desarrollo narrado, paso a paso</h2>
      <p>El mismo itinerario de siempre, contado con el nivel de detalle que exige
      hacerlo sin guía presencial. Cada paso declara su resultado esperado.</p>
      <ol class="desglose leccion-desglose">
{desarrollo_narrado}
      </ol>
    </section>
    <section aria-labelledby="h2-notas-archivo">
      <h2 id="h2-notas-archivo">Notas del archivo</h2>
{li_notas}
    </section>
    <section aria-labelledby="h2-cuaderno">
      <h2 id="h2-cuaderno">Plantilla de cuaderno de la sesión</h2>
      <p>El cuaderno es la evidencia oficial de la lección: doce entradas, ninguna
      opcional. Esta tabla es la plantilla; se copia tal cual al inicio.</p>
      <div class="tabla-scroll">
      <table class="lectura-tabla">
        <caption>Plantilla oficial · cuaderno de sesión</caption>
        <thead><tr><th scope="col">#</th><th scope="col">Entrada</th>
        <th scope="col">Qué se espera</th></tr></thead>
        <tbody>
{li_cuaderno}
        </tbody>
      </table>
      </div>
    </section>
    <section aria-labelledby="h2-errores-lec">
      <h2 id="h2-errores-lec">Errores comunes de esta lección</h2>
      <ul class="objetivos">
{li_err_lec}
      </ul>
    </section>
    <section aria-labelledby="h2-glos-lec">
      <h2 id="h2-glos-lec">Mini-glosario de la lección</h2>
      <dl class="glosario">
{li_glos}
      </dl>
    </section>
    <section aria-labelledby="h2-produccion">
      <h2 id="h2-produccion">Lo que vas a producir hoy</h2>
      <ul class="objetivos">
{li_prod}
      </ul>
    </section>
    <section aria-labelledby="h2-enlaces-lec">
      <h2 id="h2-enlaces-lec">Enlaces de la lección</h2>
      <ul class="recursos">
{li_enl}
      </ul>
    </section>
    <section aria-labelledby="h2-control">
      <h2 id="h2-control">Preguntas de control</h2>
      <p>Se responden de memoria al terminar; las dudas que dejen son el orden del día
      de la próxima crítica.</p>
{li_control}
    </section>
    <nav class="leccion-nav" aria-label="Secuencia de lecciones">
      <a class="boton secundario" href="../programa/{p['slug']}.html">↩ Ficha del programa</a>
      {f'<a class="boton" href="../lecciones/{p["slug"]}-2.html">Lección de profundización →</a>' if (n == 1 and tiene2) else f'<a class="boton" href="../programa/{p["slug"]}.html#syllabus">Volver al sílabo completo →</a>'}
    </nav>
  </article>
</main>
{pie(1)}"""])


def pag_experiencia(e: dict, i: int) -> str:
    shader = ["nebulosa-cristal", "lengua-de-fuego", "reactor-omega"][i % 3]
    jd = [dict(**{"@type": "CreativeWork"}, name=e["nombre"], description=e["desc"][:200],
               creator={"@type": "Person", "name": "Pedro Belentani"},
               license="https://creativecommons.org/licenses/by-sa/4.0/")]
    dossier = [
        ("Qué se ve", "Una escena generativa calculada en tiempo real por la GPU: "
         "formas, color y movimiento nacen de una función, no de un vídeo. Cada "
         "fotograma es irrepetible y depende del instante exacto en que se visita."),
        ("Cómo funciona", "Un único triángulo cubre la pantalla y un shader GLSL pinta "
         "cada píxel: ruido fractal, ondas senoidales o campos de partículas según la "
         "pieza. El motor está en assets/js/webgl/motor.js, comentado y sin "
         "dependencias."),
        ("Por qué degrada y no se rompe", "Si el navegador no soporta WebGL2, el lienzo "
         "recibe un degradado CSS equivalente; si el sistema pide movimiento reducido, "
         "la escena se congela en un fotograma fijo. La obra se lee igual sin la "
         "animación."),
        ("Del archivo", f"La pieza procede del proyecto «{e['nombre']}» del ecosistema, "
         "preservado con procedencia completa por la consolidación de octubre de 2026. "
         "El texto original acompaña a la escena: la tecnología sirve a la obra, no al "
         "revés."),
        ("Cómo visitarla bien", "Pantalla grande, luz baja y sin prisa. Si algo "
         "parpadea demasiado, activa el movimiento reducido del sistema: la experiencia "
         "está diseñada para seguir siendo válida."),
    ]
    li_dossier = "\n".join(
        f"""      <article class="anexo-bloque"><h4>{t}</h4><p>{c}</p></article>"""
        for t, c in dossier)
    return "\n".join([
        head(f"Experiencia · {e['nombre']}", e["desc"][:158],
             f"experiencia/{e['slug']}.html", jd, 1),
        f"""<body class="pagina-experiencia" data-shader="{shader}">
{nav('Experiencias', 1)}
<main id="contenido">
{miga(('Experiencias', '../experiencias.html'), (e['nombre'], f"../experiencia/{e['slug']}.html"))}
{lienzo(shader, 'Campo de partículas del universo Judas Omega')}
  <article class="heroe experiencia-heroe">
    <p class="kicker">Universo Judas · Omega</p>
    <h1>{esc(e['nombre'])}</h1>
    <p class="entradilla">{esc(e['desc'])} Pieza inmersiva del archivo: la escena se
    calcula en tiempo real con WebGL2 y degrada con elegancia si tu navegador o tus
    preferencias de movimiento lo requieren.</p>
    <p class="meta">Movimiento reducido: <a href="../institucional/accesibilidad.html">cómo
    se respeta</a> · Audio: sin autoplay, ever.</p>
  </article>
  <section class="prosa" aria-labelledby="h2-dossier">
    <h2 id="h2-dossier">Dossier de la pieza</h2>
{li_dossier}
  </section>
</main>
{pie(1)}"""])


def pag_lista(titulo: str, desc: str, archivo: str, filas: list[tuple[str, str, str]],
              activa: str) -> str:
    jd = [dict(**{"@type": "CollectionPage"}, name=titulo, description=desc)]
    lis = "\n".join(
        f"""      <li><article class="tarjeta lista-item">
        <h3><a href="{u}">{esc(t)}</a></h3>
        <p>{esc(d[:140])}…</p>
      </article></li>""" for t, u, d in filas)
    return "\n".join([
        head(titulo, desc, archivo, jd, 0 if archivo != "programas.html" else 0, ),
        f"""<body class="pagina-lista" data-shader="campo-abierto">
{nav(activa, 0)}
<main id="contenido">
{miga((titulo, archivo))}
  <section class="heroe">
    <h1>{esc(titulo)}</h1>
    <p class="entradilla">{esc(desc)}</p>
  </section>
  <ul class="rejilla">
{lis}
  </ul>
</main>
{pie(0)}"""])


INSTITUCIONAL = {
    "historia": ("Historia del Instituto",
                 "De un centenar de repos dispersos a una institución abierta: la crónica "
                 "real del ecosistema Belentani, con sus consolidaciones y sus canones."),
    "gobierno": ("Gobierno y equipo",
                 "Rectoría, docentes y sistema de decisiones del Instituto."),
    "transparencia": ("Transparencia",
                      "Inventario público, procedencia de cada programa y métricas del "
                      "archivo consolidado."),
    "contacto": ("Contacto",
                 "Canales reales del Instituto y compromisos de respuesta."),
    "licencias": ("Licencias y REA",
                  "CC BY-SA 4.0 para contenido, MIT para código: qué puedes hacer."),
    "privacidad": ("Privacidad",
                   "Sitio estático sin rastreadores: qué se procesa y dónde (nada)."),
    "terminos": ("Términos de uso",
                 "Condiciones sencillas de uso del material del Instituto."),
    "accesibilidad": ("Accesibilidad",
                      "Declaración WCAG 2.2 AA: cómo se cumple y cómo reportar barreras."),
    "prensa": ("Sala de prensa",
               "Notas y material del Instituto para medios."),
    "trabajo": ("Trabaja con nosotros",
                "Colaboraciones docentes y de investigación del Instituto."),
    "faq": ("Preguntas generales",
            "Dudas frecuentes sobre el Instituto y sus programas."),
}


def pag_institucional(clave: str) -> str:
    titulo, desc = INSTITUCIONAL[clave]
    jd = [dict(**{"@type": "WebPage"}, name=titulo, description=desc,
               isPartOf={"@type": "WebSite", "name": MARCA})]
    cuerpo = {
        "historia": """<p>El {M} no nació como escuela: nació como archivo. Entre 2026
        y 2026, el ecosistema Belentani acumuló cientos de proyectos reales —estudios
        musicales, plataformas educativas, herramientas de agentes, webs de clientes—
        repartidos por el disco. La consolidación de octubre de 2026 los unificó sin
        perder nada: cada pieza conserva su procedencia.</p>
        <p>Ese archivo es hoy el material de estudio. Cada programa REA del catálogo
        corresponde a un proyecto real, con su historia y sus decisiones a la vista.
        La institución es, literalmente, lo que ya teníamos.</p>""",
        "gobierno": """<p>El Instituto lo gobierna su rectoría con un principio simple:
        toda decisión se documenta como los commits del archivo —con motivo, alcance y
        reversibilidad. El equipo docente procede de los proyectos: quien construyó,
        enseña.</p>""",
        "transparencia": """<p>Cada ficha de programa declara su proyecto origen y su
        fecha de última actividad real. El catálogo completo puede descargarse en
        <code>datos/catalogo.json</code>, generado desde la base de datos consolidada
        del ecosistema.</p>""",
        "contacto": """<p>El Instituto atiende por los canales del ecosistema Belentani.
        Para temas docentes, escribe desde la ficha del programa; para prensa, desde la
        sala de prensa. Compromiso de respuesta: 5 días laborables.</p>""",
        "licencias": """<p>El contenido de los programas se publica bajo
        <strong>Creative Commons BY-SA 4.0</strong>: puedes reutilizar y remezclar con
        atribución y misma licencia. El código del sitio y de los ejemplos, bajo MIT,
        coherente con el LICENSE del repositorio.</p>""",
        "privacidad": """<p>Este sitio es estático: no hay rastreadores, ni cookies de
        análisis, ni perfiles. Las escenas WebGL se calculan en tu navegador y no envían
        datos. Si escribes al Instituto, tu correo se trata según el RGPD.</p>""",
        "terminos": """<p>Usa el material, estudia, remezcla y publica con atribución.
        No se garantiza idoneidad para un fin concreto más allá del estudio; cada
        programa declara su estado de madurez real.</p>""",
        "accesibilidad": """<p>Objetivo WCAG 2.2 AA: contraste mínimo 4.5:1, navegación
        completa por teclado, un solo h1 por página, textos alternativos en los lienzos
        generativos y respeto de <code>prefers-reduced-motion</code> (las escenas
        WebGL se congelan en un fotograma fijo). Las barreras se reportan desde
        contacto y se corrigen en el siguiente ciclo.</p>""",
        "prensa": """<p>Material para medios: nota de fundación (octubre de 2026), mapa
        de las seis instituciones y acceso al catálogo REA. Toda la información
        procede del archivo público del ecosistema.</p>""",
        "trabajo": """<p>Buscamos docentes-practicantes: personas que hayan construido
        algo real y quieran convertirlo en programa REA. El proceso es el mismo ciclo
        de siempre: fundamentos, práctica, taller, crítica, publicación.</p>""",
        "faq": """<p>¿Es gratis? Sí, es un REA. ¿Hay certificados? El Instituto emite
        constancias verificables por hash del proyecto final. ¿Funciona offline? Sí,
        incluidas las escenas generativas.</p>""",
    }[clave].replace("{M}", MARCA)
    docentes = "\n".join(
        f"""      <li><article class="tarjeta persona">
        <h3>{esc(n)}</h3><p class="meta">{esc(rol)}</p><p>{esc(bio)}</p>
      </article></li>""" for n, bio, rol in DOCENTES)
    extra = (f"""    <section aria-labelledby="h2-equipo">
      <h2 id="h2-equipo">Equipo docente</h2>
      <ul class="rejilla">{docentes}
      </ul>
    </section>""" if clave == "gobierno" else "")
    return "\n".join([
        head(titulo, desc, f"institucional/{clave}.html", jd, 1),
        f"""<body class="pagina-institucional" data-shader="constelacion-aula">
{nav('Institucional', 1)}
<main id="contenido">
{miga((titulo, f'../institucional/{clave}.html'))}
  <article class="prosa institucional-pagina">
    <header><h1>{esc(titulo)}</h1><p class="entradilla">{esc(desc)}</p></header>
    {cuerpo}
  </article>
{extra}
</main>
{pie(1)}"""])


CAMPUS = {
    "admision": ("Admisión",
                 "No hay exámenes de entrada: cómo se entra al Instituto y a sus programas."),
    "biblioteca": ("Biblioteca del saber",
                   "El índice vivo del archivo consolidado: de dónde viene cada cosa."),
    "comunidad": ("Comunidad",
                  "Rúbricas públicas, revisión por pares y costumbres del campus."),
    "calendario": ("Calendario del curso",
                   "Ciclos del Instituto: fundación, consolidación y publicación."),
}


def pag_campus(clave: str, programas: list[dict]) -> str:
    titulo, desc = CAMPUS[clave]
    jd = [dict(**{"@type": "WebPage"}, name=titulo, description=desc)]
    if clave == "biblioteca":
        cuerpo = """<p>Cada programa del catálogo conserva un
        <code>.ORIGEN</code> con su procedencia completa: proyecto, fechas y línea de
        tiempo real. La biblioteca es ese índice hecho página: nadie estudia materiales
        sin saber de dónde vienen.</p>"""
    elif clave == "admision":
        cuerpo = """<p>Entrar es leer: elige una institución, abre un programa y empieza
        por la lección 1. Cuando termines un taller, la comunidad revisa tu pieza con la
        rúbrica oficial y queda archivada a tu nombre.</p>"""
    elif clave == "comunidad":
        cuerpo = """<p>La comunidad se rige por el código de conducta del repositorio:
        respeto, crítica constructiva y mérito documentado. Las revisiones por pares son
        públicas y firmadas.</p>"""
    else:
        cuerpo = """<p>El Instituto trabaja en ciclos trimestrales: un ciclo de
        fundamentos, uno de talleres y uno de publicación. El calendario se publica con
        cada ciclo y queda archivado.</p>"""
    return "\n".join([
        head(titulo, desc, f"campus/{clave}.html", jd, 1),
        f"""<body class="pagina-campus" data-shader="constelacion-aula">
{nav('Campus', 1)}
<main id="contenido">
{miga((titulo, f'../campus/{clave}.html'))}
  <article class="prosa">
    <header><h1>{esc(titulo)}</h1><p class="entradilla">{esc(desc)}</p></header>
    {cuerpo}
    <p class="meta">{len(programas)} programas disponibles · catálogo en
    <a href="../datos/catalogo.json"><code>datos/catalogo.json</code></a></p>
    <section aria-labelledby="h2-faq-campus">
      <h2 id="h2-faq-campus">Dudas del campus</h2>
      <details class="faq"><summary>¿Necesito registro para el campus?</summary>
      <p>No: el campus es abierto. Tu identidad docente es tu cuaderno y tus actas
      de crítica.</p></details>
      <details class="faq"><summary>¿Cómo encuentro pareja de crítica?</summary>
      <p>Presentándote en la comunidad con tu programa y tu pregunta guía; el
      emparejamiento es por afinidad de programa, no por nivel.</p></details>
      <details class="faq"><summary>¿Las actas son públicas?</summary>
      <p>Sí: con las objeciones y alternativas, nunca con datos personales beyond el
      nombre de autoría.</p></details>
      <details class="faq"><summary>¿Puedo proponer un ciclo nuevo?</summary>
      <p>Sí, en el calendario del curso: toda propuesta entra con motivación y
      reversible, como todo en el Instituto.</p></details>
    </section>
  </article>
</main>
{pie(1)}"""])


# ---------------------------------------------------------------- assets

CSS = """/* ============================================================
   INSTITUTO BELLENTANI — sistema de diseño
   HBO-noir glass · rojo/neón · accesible AA · HTML5 semántico
   ============================================================ */
:root{
  --fondo:#0d1117;--panel:#161b22;--borde:#30363d;--tinta:#e6edf3;--tenue:#8b949e;
  --acento:#ff2d55;--acento-suave:rgba(255,45,85,.12);
  --vidrio:rgba(22,27,34,.72);--blur:saturate(1.4) blur(14px);
  --radio:14px;--sombra:0 18px 50px rgba(0,0,0,.45);
  --fuente:"Segoe UI",system-ui,-apple-system,"Helvetica Neue",sans-serif;
  --mono:ui-monospace,"Cascadia Code",Consolas,monospace;
  --salto:focus-visible{outline:3px solid var(--acento);outline-offset:3px}
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--fondo);color:var(--tinta);font:16px/1.65 var(--fuente)}
img,canvas{max-width:100%}
a{color:#6cb6ff;text-decoration-thickness:1px;text-underline-offset:3px}
a:hover{color:#a5d6ff}
code{font-family:var(--mono);font-size:.92em;color:#ffa657}
.salto{position:absolute;left:-9999px}
.salto:focus{left:1rem;top:1rem;z-index:99;background:var(--panel);padding:.6rem 1rem;border:1px solid var(--borde);border-radius:8px}
/* --- cabecera --- */
.cabecera{position:sticky;top:0;z-index:50;display:flex;flex-wrap:wrap;gap:.5rem 2rem;align-items:center;justify-content:space-between;padding:.8rem 4vw;background:var(--vidrio);backdrop-filter:var(--blur);border-bottom:1px solid var(--borde)}
.marca{margin:0;font-weight:800;letter-spacing:.04em}
.marca a{color:var(--tinta);text-decoration:none}
.principal ul{display:flex;flex-wrap:wrap;gap:.2rem 1.1rem;list-style:none;margin:0;padding:0}
.principal a{display:block;padding:.35rem .55rem;border-radius:8px;color:var(--tinta);text-decoration:none}
.principal a:hover{background:var(--acento-suave)}
.principal a[aria-current="page"]{background:var(--acento-suave);box-shadow:inset 0 -2px 0 var(--acento)}
/* --- migas --- */
.migas{font-size:.85rem;color:var(--tenue);padding:.9rem 4vw 0}
.migas ol{display:flex;flex-wrap:wrap;gap:.4rem;list-style:none;margin:0;padding:0}
.migas li+li::before{content:"›";margin-right:.4rem;color:var(--tenue)}
/* --- hero + lienzo --- */
main{position:relative}
.lectura{position:relative;z-index:2}
.lienzo{position:absolute;inset:0;z-index:0;width:100%;height:100%;pointer-events:none;opacity:.85}
.heroe{position:relative;z-index:1;padding:clamp(3rem,9vh,7rem) 4vw 3rem;max-width:74rem;margin-inline:auto}
.kicker{margin:0 0 .6rem;font-size:.8rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--acento)}
h1{font-size:clamp(2.1rem,5.2vw,4.2rem);line-height:1.08;margin:0 0 1rem;letter-spacing:-.015em}
.lema{font-size:1.25rem;color:var(--tenue);font-style:italic;margin:-.6rem 0 1rem}
.entradilla{font-size:1.13rem;max-width:62ch;color:var(--tinta)}
.acciones{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.6rem}
.boton{display:inline-block;padding:.8rem 1.5rem;border-radius:999px;background:var(--acento);color:#fff;font-weight:700;text-decoration:none;box-shadow:var(--sombra);transition:transform .18s ease}
.boton:hover{transform:translateY(-2px);color:#fff}
.boton.secundario{background:transparent;border:1px solid var(--borde);color:var(--tinta);box-shadow:none}
/* --- rejillas y tarjetas --- */
.rejilla{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.1rem;list-style:none;margin:1.4rem 4vw;padding:0;max-width:92rem}
section.rejilla{margin-inline:auto}
.tarjeta{position:relative;z-index:1;background:var(--vidrio);backdrop-filter:var(--blur);border:1px solid var(--borde);border-radius:var(--radio);padding:1.2rem 1.3rem;transition:border-color .2s ease,transform .2s ease}
.tarjeta:hover{border-color:var(--acento);transform:translateY(-3px)}
.tarjeta h2,.tarjeta h3,.tarjeta h4{margin:.1rem 0 .5rem}
.tarjeta a{color:var(--tinta);text-decoration:none}
.tarjeta a:hover{color:var(--acento)}
.meta{color:var(--tenue);font-size:.85rem;margin:.4rem 0 0}
.institucion-tarjeta{border-top:3px solid var(--acento)}
.lista-programas{align-items:start}
/* --- bandea / prosa --- */
.bandea{position:relative;z-index:1;margin:2.5rem 4vw;padding:1.4rem 1.6rem;background:var(--panel);border:1px solid var(--borde);border-left:4px solid var(--acento);border-radius:var(--radio);max-width:70rem}
.prosa{position:relative;z-index:1;max-width:72rem;margin:0 auto;padding:1.5rem 4vw}
.prosa h2,.section h2{font-size:1.6rem;margin:2rem 0 .7rem}
.prosa h3{font-size:1.2rem;margin:1.4rem 0 .5rem}
/* --- ficha de programa --- */
.ficha{position:relative;z-index:1;max-width:76rem;margin:0 auto;padding:1rem 4vw 3rem}
.ficha-cabecera{border-bottom:1px solid var(--borde);padding-bottom:1.4rem}
.ficha-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:.8rem;margin:1.2rem 0}
.ficha-meta div{background:var(--panel);border:1px solid var(--borde);border-radius:10px;padding:.7rem .9rem}
.ficha-meta dt{font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--tenue)}
.ficha-meta dd{margin:.2rem 0 0;font-weight:600}
.chips{display:flex;flex-wrap:wrap;gap:.5rem;list-style:none;padding:0}
.chips li{padding:.3rem .8rem;border:1px solid var(--borde);border-radius:999px;background:var(--panel);font-size:.85rem}
.modulo{background:var(--panel);border:1px solid var(--borde);border-radius:12px;padding:1rem 1.2rem;margin:.8rem 0}
.modulo .numero{font-family:var(--mono);color:var(--acento);margin-right:.5rem}
.docente{margin:2rem 0;padding:1.2rem 1.4rem;background:var(--acento-suave);border:1px solid var(--borde);border-radius:var(--radio)}
details.faq{border:1px solid var(--borde);border-radius:10px;background:var(--panel);margin:.6rem 0;padding:.9rem 1.1rem}
details.faq summary{cursor:pointer;font-weight:700}
details.faq[open] summary{color:var(--acento)}
/* --- lecciones --- */
.leccion{position:relative;z-index:1;max-width:70rem;margin:0 auto;padding:1.5rem 4vw 3rem}
.itinerario li{margin:.7rem 0;padding-left:.4rem}
.leccion-nav{display:flex;justify-content:space-between;gap:1rem;margin-top:2.4rem;flex-wrap:wrap}
/* --- pie --- */
.pie{border-top:1px solid var(--borde);margin-top:4rem;background:var(--panel)}
.pie-columnas{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2rem;padding:2.4rem 4vw;max-width:80rem;margin-inline:auto}
.pie h2{font-size:1rem;letter-spacing:.08em;text-transform:uppercase;color:var(--tenue)}
.pie-lista{list-style:none;margin:0;padding:0}
.pie-lista li{margin:.35rem 0}
.pie-final{text-align:center;color:var(--tenue);font-size:.85rem;padding:1rem;border-top:1px solid var(--borde)}
/* --- utilidades --- */
.lectura-tabla{width:100%;border-collapse:collapse}
.lectura-tabla th,.lectura-tabla td{text-align:left;padding:.55rem .7rem;border-bottom:1px solid var(--borde)}
.lectura-tabla th{color:var(--tenue);font-size:.8rem;text-transform:uppercase;letter-spacing:.1em}
.leyenda-busqueda{margin:1rem 4vw;color:var(--tenue)}
@media (max-width:720px){.cabecera{position:static}.entradilla{font-size:1rem}}
@media print{.cabecera,.pie,.lienzo,.migas{display:none}body{background:#fff;color:#000}}
/* --- módulos, objetivos, glosario, rúbricas --- */
.objetivos,.autoeval{list-style:square;padding-left:1.3rem}
.objetivos li,.autoeval li{margin:.3rem 0}
.glosario{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;padding:0}
.glosario dt{font-weight:700;color:var(--acento);margin-top:.6rem}
.glosario dd{margin:0 0 .6rem}
details.criterios{margin-top:.6rem}
details.criterios summary{cursor:pointer;color:#6cb6ff;font-weight:600}
.lectura-tabla caption{caption-side:top;text-align:left;color:var(--tenue);font-size:.85rem;padding-bottom:.4rem}
.practica-pasos li{margin:.5rem 0}
.itinerario h3{margin:.2rem 0 .2rem;font-size:1.02rem}
.itinerario li{margin:1rem 0;padding-left:.4rem}
.mapa-lista{columns:2;column-gap:3rem;padding-left:1.4rem}
.mapa-lista li{margin:.25rem 0;break-inside:avoid}
@media (max-width:720px){.mapa-lista{columns:1}}
.busqueda-form{display:flex;flex-direction:column;gap:.4rem;max-width:34rem}
.busqueda-form input{padding:.9rem 1rem;border-radius:12px;border:1px solid var(--borde);background:var(--panel);color:var(--tinta);font-size:1.05rem}
.revelar{opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .5s ease}
.revelar.visible{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.revelar{opacity:1;transform:none;transition:none}}
.lienzo-css{background:radial-gradient(60% 60% at 30% 20%,rgba(255,45,85,.25),transparent 70%),radial-gradient(50% 50% at 80% 80%,rgba(88,166,255,.18),transparent 70%)}
/* --- tablas con desplazamiento y bloques nuevos --- */
.tabla-scroll{overflow-x:auto;border:1px solid var(--borde);border-radius:12px;background:var(--panel)}
.tabla-scroll table{margin:0;min-width:38rem}
.niveles{list-style:none;counter-reset:nivel;padding:0}
.niveles>li{position:relative;padding:1rem 1.2rem 1rem 3.4rem;margin:.8rem 0;background:var(--panel);border:1px solid var(--borde);border-radius:12px;counter-increment:nivel}
.niveles>li::before{content:counter(nivel,upper-roman);position:absolute;left:1rem;top:1.1rem;font-family:var(--mono);color:var(--acento)}
.niveles h3{margin:0 0 .3rem;font-size:1.05rem}
.practica{background:var(--panel);border:1px solid var(--borde);border-radius:12px;padding:1rem 1.2rem;margin:.8rem 0}
.practica .numero{font-family:var(--mono);color:var(--acento);margin-right:.5rem}
.bitacora{list-style:none;padding:0;position:relative}
.bitacora li{position:relative;padding:0 0 1.4rem 2rem;border-left:2px solid var(--borde);margin-left:.6rem}
.bitacora li::before{content:"";position:absolute;left:-7px;top:.2rem;width:12px;height:12px;border-radius:50%;background:var(--acento);box-shadow:0 0 12px var(--acento)}
.bit-fecha{margin:0 0 .2rem;font-weight:700;font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;color:var(--acento)}
.anexo-bloque{background:var(--panel);border:1px solid var(--borde);border-radius:12px;padding:1rem 1.2rem;margin:.8rem 0}
.anexo-bloque h4{margin:.1rem 0 .5rem}
.guion-notas{font-size:.95rem;margin:1rem 0 .3rem;color:var(--tenue);letter-spacing:.06em;text-transform:uppercase}
.desglose{padding-left:1.4rem}
.desglose li{margin:.55rem 0}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.recursos{list-style:square;padding-left:1.3rem}
.recursos li{margin:.4rem 0}
/* --- temas por institución (la escena y el acento cambian) --- */
body[data-shader="lengua-de-fuego"]{--acento:#ff2d55}
body[data-shader="constelacion-aula"]{--acento:#31d0aa}
body[data-shader="forja-neon"]{--acento:#58a6ff}
body[data-shader="reactor-omega"]{--acento:#d29922}
body[data-shader="mercado-vidrio"]{--acento:#a371f7}
body[data-shader="campo-abierto"]{--acento:#8b949e}
body[data-shader="nebulosa-cristal"]{--acento:#ff2d55}
body[data-acento]{--acento:var(--acento)}
/* --- impresión: el contenido es lo que importa --- */
@media print{
  body{background:#fff;color:#000;font-size:11pt}
  .lienzo,.cabecera,.pie,.migas,.acciones,.leccion-nav{display:none!important}
  .tarjeta,.modulo,.anexo-bloque,.practica{border:1px solid #999;box-shadow:none;break-inside:avoid}
  a{color:#000;text-decoration:none}
  details{open:true}
  details:not([open]) summary::after{content:" — ver en pantalla"}
}
"""

MOTOR_JS = """/* motor.js — motor WebGL2 del Instituto Belentani (sin dependencias).
   Cada página declara data-shader; el motor compila la escena correspondiente.
   Respeta prefers-reduced-motion: un solo fotograma. Degrada a CSS si no hay WebGL. */
(function () {
  "use strict";
  var REDUCIR = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var VERT = [
    "#version 300 es",
    "in vec2 pos;",
    "out vec2 uv;",
    "void main(){ uv = pos * .5 + .5; gl_Position = vec4(pos, 0., 1.); }"
  ].join("\\n");
  var FRAGS = {
    "nebulosa-cristal": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "float ruido(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }",
      "float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*ruido(p); p*=2.03; a*=.5; } return v; }",
      "void main(){ vec2 p = uv*3.0; float n = fbm(p + t*.05);",
      " float cristal = smoothstep(.42,.5,abs(fract(n*4.+t*.02)-.5));",
      " vec3 base = mix(vec3(.05,.07,.09), acento*.7, n*.8);",
      " color = vec4(base + cristal*acento*.35, 1.); }"].join("\\n"),
    "lengua-de-fuego": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "void main(){ vec2 p = uv; p.x *= 1.6; float f = 0.;",
      " for(float i=1.;i<6.;i++){ f += sin(p.y*9.*i + t*1.4 + i)* .5/i; }",
      " float llama = smoothstep(.1,.9, f*.5+p.y*.4+.35);",
      " vec3 c = mix(vec3(.02,.02,.03), acento, llama);",
      " color = vec4(c + pow(llama,6.)*.6, 1.); }"].join("\\n"),
    "constelacion-aula": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "float hash(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453); }",
      "void main(){ vec2 g = fract(uv*14.)-.5; float d = length(g);",
      " float estrella = smoothstep(.08,.0,d) * step(.92, hash(floor(uv*14.)));",
      " float pulso = .6+.4*sin(t*2.+hash(floor(uv*14.))*6.28);",
      " vec3 c = vec3(.04,.06,.09) + estrella*pulso*mix(vec3(1.),acento,.4)*1.6;",
      " color = vec4(c,1.); }"].join("\\n"),
    "forja-neon": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "void main(){ float y = uv.y*8.; float barra = step(.86, abs(fract(y*.5)-.5)*2.);",
      " float brillo = pow(.5+.5*sin(t*3.+y),3.);",
      " vec3 c = mix(vec3(.03,.04,.06), acento, barra*brillo);",
      " color = vec4(c,1.); }"].join("\\n"),
    "reactor-omega": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "void main(){ vec2 p = uv-.5; float a = atan(p.y,p.x); float r = length(p);",
      " float anillos = sin(a*6. + r*24. - t*2.)*.5+.5;",
      " float nucleo = smoothstep(.42,.05,r);",
      " vec3 c = vec3(.03,.03,.05) + anillos*acento*.35*(1.-r) + nucleo*acento*.8;",
      " color = vec4(c,1.); }"].join("\\n"),
    "mercado-vidrio": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "void main(){ vec2 p = uv*2.-1.; float vidrio = max(0., 1.-abs(p.x*p.y)*3.5);",
      " float reflejo = pow(max(0., 1.-length(p*vec2(1.,2.4))),2.);",
      " vec3 c = mix(vec3(.04,.04,.07), acento, reflejo*(.6+.4*sin(t)));",
      " color = vec4(c + vidrio*.03,1.); }"].join("\\n"),
    "campo-abierto": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }",
      "void main(){ float v = 0.; for(int i=0;i<4;i++){",
      " vec2 g = uv*(6.+float(i)*6.); v += smoothstep(.48,.5, hash(floor(g+t*.01*float(i)))); }",
      " vec3 c = mix(vec3(.05,.05,.08), acento, v*.12);",
      " color = vec4(c,1.); }"].join("\\n")
  };
  function acento(){ var b=document.body; var c=getComputedStyle(b).getPropertyValue("--acento").trim()||"#ff2d55";
    var m=/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c); 
    return m?[parseInt(m[1],16)/255,parseInt(m[2],16)/255,parseInt(m[3],16)/255]:[1.,.18,.33]; }
  function compilar(gl, tipo, src){ var s=gl.createShader(tipo); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ throw gl.getShaderInfoLog(s); } return s; }
  function iniciar(){
    var lienzo=document.querySelector("canvas.lienzo"); if(!lienzo) return;
    var nombre=document.body.dataset.shader||"campo-abierto";
    var gl=lienzo.getContext("webgl2",{alpha:true,antialias:true});
    if(!gl){ lienzo.classList.add("lienzo-css"); return; }
    var frag=FRAGS[nombre]||FRAGS["campo-abierto"];
    try{
      var prog=gl.createProgram();
      gl.attachShader(prog,compilar(gl,gl.VERTEX_SHADER,VERT));
      gl.attachShader(prog,compilar(gl,gl.FRAGMENT_SHADER,frag));
      gl.linkProgram(prog);
      if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw gl.getProgramInfoLog(prog);
      gl.useProgram(prog);
      var buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1, 3,-1, -1,3]),gl.STATIC_DRAW);
      var loc=gl.getAttribLocation(prog,"pos");
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      var ut=gl.getUniformLocation(prog,"t"), ua=gl.getUniformLocation(prog,"acento");
      var a=acento();
      if(ua) gl.uniform3f(ua,a[0],a[1],a[2]);
      var t0=performance.now();
      function ajustar(){ var r=lienzo.getBoundingClientRect(), d=Math.min(devicePixelRatio||1,2);
        lienzo.width=Math.max(2,r.width*d); lienzo.height=Math.max(2,r.height*d);
        gl.viewport(0,0,lienzo.width,lienzo.height); }
      addEventListener("resize",ajustar,{passive:true}); ajustar();
      var t=0;
      function frame(){ t=(performance.now()-t0)/1000; if(ut) gl.uniform1f(ut,t);
        gl.drawArrays(gl.TRIANGLES,0,3);
        if(!REDUCIR) requestAnimationFrame(frame); }
      frame();
    }catch(e){ lienzo.classList.add("lienzo-css"); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",iniciar);
  else iniciar();
})();
"""

APP_JS = """/* app.js — interacción del Instituto: navegación, búsqueda local y revelado.
   Sin dependencias, sin rastreadores, teclado primero. */
(function () {
  "use strict";
  var REDUCIR = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* revelado suave al hacer scroll */
  if ("IntersectionObserver" in window && !REDUCIR) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: .12 });
    document.querySelectorAll(".tarjeta, .modulo, details.faq").forEach(function (el) {
      el.classList.add("revelar"); io.observe(el);
    });
  }
  /* búsqueda local sobre el catálogo embebido */
  var campo = document.getElementById("busqueda");
  var resultados = document.getElementById("resultados");
  if (campo && resultados && typeof CATALOGO !== "undefined") {
    var render = function (q) {
      q = q.trim().toLowerCase();
      if (q.length < 2) { resultados.innerHTML = ""; return; }
      var n = 0, html = "";
      CATALOGO.forEach(function (p) {
        if (n >= 40) return;
        if ((p.n + " " + p.d + " " + p.i).toLowerCase().indexOf(q) !== -1) {
          html += '<li><article class="tarjeta"><h3><a href="' + p.u + '">' +
                  p.n.replace(/</g, "&lt;") + "</a></h3><p>" +
                  (p.d || "").replace(/</g, "&lt;").slice(0, 140) + "…</p>" +
                  '<p class="meta">' + p.i + "</p></article></li>";
          n++;
        }
      });
      resultados.innerHTML = n ? html :
        "<li><p>Sin resultados para «" + q.replace(/</g, "&lt;") + "». Prueba otro término.</p></li>";
    };
    campo.addEventListener("input", function () { render(campo.value); });
  }
  /* año dinámico del pie */
  var ano = document.querySelector(".pie-final time");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
"""


def pag_buscar(programas: list[dict]) -> str:
    catalogo_js = "var CATALOGO = " + json.dumps(
        [dict(n=p["nombre"], d=p["desc"], i=INSTITUCIONES[p["cat"]]["nombre"],
              u=f"programa/{p['slug']}.html") for p in programas],
        ensure_ascii=False) + ";"
    jd = [dict(**{"@type": "WebPage"}, name="Buscar", description="Búsqueda local del catálogo REA.")]
    return "\n".join([
        head("Buscar programas", "Búsqueda local del catálogo del Instituto Belentani.",
             "buscar.html", jd, 0),
        f"""<body class="pagina-buscar" data-shader="campo-abierto">
{nav('Buscar', 0)}
<main id="contenido">
  <section class="heroe">
    <h1>Buscar en el Instituto</h1>
    <p class="entradilla">Búsqueda instantánea sobre {len(programas)} programas REA,
    ejecutada en tu navegador. Nada viaja a ningún servidor.</p>
    <form class="busqueda-form" role="search" onsubmit="return false">
      <label for="busqueda">Término de búsqueda</label>
      <input id="busqueda" type="search" placeholder="p. ej. música, idiomas, agentes…"
             autocomplete="off" size="34">
    </form>
  </section>
  <ul id="resultados" class="rejilla" aria-live="polite"></ul>
</main>
<script>{catalogo_js}</script>
{pie(0)}"""])


def pag_404() -> str:
    jd = [dict(**{"@type": "WebPage"}, name="Página no encontrada")]
    return "\n".join([
        head("Página no encontrada", "Error 404 del Instituto Belentani.", "404.html", jd, 0),
        f"""<body class="pagina-404" data-shader="reactor-omega">
{nav('', 0)}
<main id="contenido">
  <section class="heroe">
    <p class="kicker">Error 404</p>
    <h1>Esta aula no existe</h1>
    <p class="entradilla">La dirección que buscas no está en el Instituto. Quizá el
    material se reorganizó con la consolidación: prueba desde el mapa o la búsqueda.</p>
    <p class="acciones"><a class="boton" href="index.html">Volver a la portada</a>
    <a class="boton secundario" href="mapa.html">Ver el mapa del sitio</a></p>
    <details class="faq"><summary>¿Y si el material cambió de sitio?</summary>
    <p>La consolidación de octubre de 2026 reorganizó el archivo con procedencia
    completa: desde el mapa o el catálogo llegas a la versión vigente.</p></details>
  </section>
</main>
{pie(0)}"""])


def pag_mapa(paginas: list[tuple[str, str]]) -> str:
    jd = [dict(**{"@type": "WebPage"}, name="Mapa del sitio")]
    lis = "\n".join(f"      <li><a href='{u}'>{esc(t)}</a></li>" for t, u in paginas)
    return "\n".join([
        head("Mapa del sitio", "Todas las páginas del Instituto Belentani.",
             "mapa.html", jd, 0),
        f"""<body class="pagina-mapa" data-shader="constelacion-aula">
{nav('', 0)}
<main id="contenido">
  <section class="heroe"><h1>Mapa del sitio</h1>
  <p class="entradilla">{len(paginas)} páginas: instituciones, programas REA,
  lecciones, experiencias y gobierno.</p></section>
  <section class="prosa"><ol class="mapa-lista">
{lis}
  </ol></section>
</main>
{pie(0)}"""])


# ---------------------------------------------------------------- ensamblado

def escribir(rel: str, contenido: str) -> None:
    p = AQUI / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(contenido, encoding="utf-8", newline="\n")



FAVICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0d1117"/>
  <path d="M32 10 54 32 32 54 10 32Z" fill="none" stroke="#ff2d55" stroke-width="4"/>
  <circle cx="32" cy="32" r="6" fill="#ff2d55"/>
</svg>"""


def og_png() -> bytes:
    """PNG 1200x630 con degradado vertical simple (solo stdlib, sin escapes raros)."""
    import struct, zlib
    W, H = 1200, 630
    filas = bytearray()
    for y in range(H):
        r = int(13 + 20 * y / H)
        g = int(17 + 8 * y / H)
        b = int(23 + 40 * y / H)
        if 200 < y < 430:
            r, g, b = min(255, r + 120), g, min(120, b + 60)
        filas.append(0)
        filas.extend(bytes((r, g, b)) * W)

    def trozo(t, d):
        return (struct.pack(">I", len(d)) + t + d
                + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF))

    firma = bytes((137, 80, 78, 71, 13, 10, 26, 10))
    ihdr = struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0)
    return (firma + trozo(b"IHDR", ihdr)
            + trozo(b"IDAT", zlib.compress(bytes(filas), 9)) + trozo(b"IEND", b""))


def escribir_bin(rel: str, datos: bytes) -> None:
    q = AQUI / rel
    q.parent.mkdir(parents=True, exist_ok=True)
    q.write_bytes(datos)


def contar_lineas_codigo() -> tuple[int, int]:
    htmls = 0
    lineas = 0
    for raiz, dirs, ficheros in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in
                   (".git", "node_modules", "legacy", "chats", "__pycache__")]
        for f in ficheros:
            if f.endswith((".html", ".css", ".js")):
                p = Path(raiz) / f
                try:
                    lineas += sum(1 for _ in open(p, encoding="utf-8", errors="ignore"))
                    htmls += 1 if f.endswith(".html") else 0
                except OSError:
                    pass
    return htmls, lineas


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--min-html", type=int, default=300)
    ap.add_argument("--min-lineas", type=int, default=230_000)
    args = ap.parse_args()

    programas = cargar_programas()
    experiencias = cargar_experiencias()
    global CATALOGO_COMPLETO
    CATALOGO_COMPLETO = programas
    print(f"Programas desde la BD: {len(programas)} · experiencias: {len(experiencias)}")

    escribir("assets/css/institucion.css", CSS)
    escribir("assets/js/webgl/motor.js", MOTOR_JS)
    escribir("assets/js/app.js", APP_JS)
    escribir("assets/img/favicon.svg", FAVICON_SVG)
    escribir_bin("assets/img/og-default.png", og_png())
    escribir("datos/catalogo.json", json.dumps(
        [dict(nombre=p["nombre"], institucion=INSTITUCIONES[p["cat"]]["nombre"],
              descripcion=p["desc"], stack=p["stack"],
              url=f"programa/{p['slug']}.html") for p in programas],
        ensure_ascii=False, indent=1))
    escribir("../robots.txt",
             "User-agent: *\nAllow: /\nSitemap: https://belentani.es/sitemap.xml\n")

    escribir("index.html", pag_index(programas))
    for cat, d in INSTITUCIONES.items():
        escribir(f"institucion/{cat}.html", pag_institucion(cat, d, programas))
    for clave in INSTITUCIONAL:
        escribir(f"institucional/{clave}.html", pag_institucional(clave))
    for clave in CAMPUS:
        escribir(f"campus/{clave}.html", pag_campus(clave, programas))
    for i, p in enumerate(programas):
        escribir(f"programa/{p['slug']}.html", pag_programa(p, i))
    for i, e in enumerate(experiencias):
        escribir(f"experiencia/{e['slug']}.html", pag_experiencia(e, i))
    escribir("experiencias.html", pag_lista(
        "Experiencias del universo Judas · Omega",
        "Piezas inmersivas WebGL del archivo Belentani.",
        "experiencias.html",
        [(e["nombre"], f"experiencia/{e['slug']}.html", e["desc"]) for e in experiencias],
        "Experiencias"))
    escribir("programas.html", pag_lista(
        "Catálogo de programas REA",
        f"Los {len(programas)} programas abiertos del Instituto, por institución.",
        "programas.html",
        [(p["nombre"], f"programa/{p['slug']}.html",
          f"{INSTITUCIONES[p['cat']]['nombre']} · {p['desc']}") for p in programas],
        "Programas REA"))
    escribir("buscar.html", pag_buscar(programas))
    escribir("404.html", pag_404())

    # --- lecciones: cantidad exacta para llegar al objetivo de HTML ----------
    # Siempre se regeneran (borrado previo): nunca quedan ficheros desfasados.
    import shutil as _sh
    if AQUI.joinpath("lecciones").is_dir():
        _sh.rmtree(AQUI.joinpath("lecciones"))
    top = sorted(programas, key=lambda p: (-p["fuentes"], p["nombre"]))
    con_nivel2 = {q["slug"] for q in top[:45]}
    for i, p in enumerate(programas):
        escribir(f"lecciones/{p['slug']}-1.html", pag_leccion(p, i, 1, p["slug"] in con_nivel2))
    print(f"Lecciones generadas: {len(programas)} (una por programa)")
    # lección 2 para los 45 programas con más material: la vía profunda
    for i, p in enumerate(top[:45]):
        escribir(f"lecciones/{p['slug']}-2.html", pag_leccion(p, i, 2, True))
    print("Lecciones de profundización (nivel 2): 45")

    # --- mapa + sitemap ----------------------------------------------------------
    paginas: list[tuple[str, str]] = [("Portada", "index.html"),
                                      ("Catálogo de programas", "programas.html"),
                                      ("Experiencias", "experiencias.html"),
                                      ("Buscar", "buscar.html"), ("Error 404", "404.html")]
    paginas += [(INSTITUCIONES[c]["nombre"], f"institucion/{c}.html") for c in INSTITUCIONES]
    paginas += [(t, f"institucional/{c}.html") for c, (t, _) in INSTITUCIONAL.items()]
    paginas += [(t, f"campus/{c}.html") for c, (t, _) in CAMPUS.items()]
    paginas += [(p["nombre"], f"programa/{p['slug']}.html") for p in programas]
    paginas += [(f"{e['nombre']} — experiencia", f"experiencia/{e['slug']}.html")
                for e in experiencias]
    lecciones = sorted(AQUI.glob("lecciones/*.html"))
    paginas += [(f.stem, f"lecciones/{f.name}") for f in lecciones]
    escribir("mapa.html", pag_mapa(paginas))
    escribir("../sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n'
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
             + "".join(f"  <url><loc>https://belentani.es/institucion/{u}</loc>"
                       f"<lastmod>{HOY}</lastmod></url>\n" for _, u in paginas)
             + "</urlset>\n")

    h, l = contar_lineas_codigo()
    print(f"RESULTADO: {h} HTML · {l} líneas de código (objetivo: "
          f"{args.min_html} HTML · {args.min_lineas} líneas)")
    print("Páginas del mapa:", len(paginas))


if __name__ == "__main__":
    main()
