#!/usr/bin/env python3
"""Construye unificado/index.html desde el export Qwen + lore Belentani real + Biblias + Gemini + Drive + Instagram + Mundos."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = Path(r"C:\Users\USER\Downloads\Qwen_html_20261001_x195hb7xg.html")
OUT_DIR = ROOT / "unificado"
OUT = OUT_DIR / "index.html"
ASSETS_SRC = ROOT / "espacio-3d" / "assets"
ASSETS_DST = OUT_DIR / "assets"
GH_MIRROR = ROOT / "app-web-nextjs" / "belentani7.github.io" / "unificado"

PLANETS_HTML = """
    <div class="planet-grid">
      <a class="glass-card planet-card" href="https://belentani7.github.io/judas-experience-web/" target="_blank" rel="noopener noreferrer">
        <div class="planet-visual"><div class="planet-sphere"></div><div class="planet-ring"></div></div>
        <div class="planet-info">
          <div class="planet-name">JUDAS · EXPERIENCE 3D</div>
          <p class="planet-lore">Planeta, diamante y llave dorada. La traición convertida en recorrido cinemático — núcleo JUDAS ERA.</p>
          <div class="planet-tags"><span class="tag">Three.js</span><span class="tag">Lore</span><span class="tag">Portal</span></div>
        </div>
      </a>
      <a class="glass-card planet-card" href="https://belentani7.github.io/judas-experience-unificado/" target="_blank" rel="noopener noreferrer">
        <div class="planet-visual"><div class="planet-sphere"></div></div>
        <div class="planet-info">
          <div class="planet-name">CÓSMICO UNIFICADO</div>
          <p class="planet-lore">La obra reunida: reliquia, códice, motor 3D y firma sonora. Un solo cuerpo para varias páginas.</p>
          <div class="planet-tags"><span class="tag">Unificado</span><span class="tag">Archivo</span><span class="tag">3D</span></div>
        </div>
      </a>
      <a class="glass-card planet-card" href="https://belentani7.github.io/belentani-omega-immersive-portal/" target="_blank" rel="noopener noreferrer">
        <div class="planet-visual"><div class="planet-sphere"></div><div class="planet-ring"></div></div>
        <div class="planet-info">
          <div class="planet-name">OMEGA IMMERSIVE</div>
          <p class="planet-lore">Portal creativo OMEGA. Entrada inmersiva al sistema estelar del artefacto.</p>
          <div class="planet-tags"><span class="tag">OMEGA</span><span class="tag">Portal</span><span class="tag">Inmersivo</span></div>
        </div>
      </a>
      <a class="glass-card planet-card" href="https://belentani7.github.io/BELENTANI-JUDAS-ERA-FULLSTACK/" target="_blank" rel="noopener noreferrer">
        <div class="planet-visual"><div class="planet-sphere"></div></div>
        <div class="planet-info">
          <div class="planet-name">VEINTE MUNDOS</div>
          <p class="planet-lore">Un canon editorial en veinte mundos visuales. La deuda y el mito en capas.</p>
          <div class="planet-tags"><span class="tag">Canon</span><span class="tag">Fullstack</span><span class="tag">Mundos</span></div>
        </div>
      </a>
      <a class="glass-card planet-card" href="https://belentani7.github.io/belentani-judas-era-omega/" target="_blank" rel="noopener noreferrer">
        <div class="planet-visual"><div class="planet-sphere"></div><div class="planet-ring"></div></div>
        <div class="planet-info">
          <div class="planet-name">JUDAS ERA · OMEGA</div>
          <p class="planet-lore">Experiencia JUDAS ERA / Omega Core — la noche litúrgica del dark pop.</p>
          <div class="planet-tags"><span class="tag">JUDAS</span><span class="tag">ERA</span><span class="tag">Dark pop</span></div>
        </div>
      </a>
      <a class="glass-card planet-card" href="https://belentani7.github.io/belent-cad/" target="_blank" rel="noopener noreferrer">
        <div class="planet-visual"><div class="planet-sphere"></div></div>
        <div class="planet-info">
          <div class="planet-name">BELENT-CAD 3D</div>
          <p class="planet-lore">Motor CAD arquitectónico: de boceto a modelo 3D y render Three.js en el navegador.</p>
          <div class="planet-tags"><span class="tag">CAD</span><span class="tag">Three.js</span><span class="tag">Tools</span></div>
        </div>
      </a>
      <a class="glass-card planet-card" href="https://belentani7.github.io/3d-portfolio/" target="_blank" rel="noopener noreferrer">
        <div class="planet-visual"><div class="planet-sphere"></div><div class="planet-ring"></div></div>
        <div class="planet-info">
          <div class="planet-name">3D PORTFOLIO</div>
          <p class="planet-lore">Portfolio personal interactivo Three.js: animaciones, navegación orbital y presencia.</p>
          <div class="planet-tags"><span class="tag">Portfolio</span><span class="tag">WebGL</span></div>
        </div>
      </a>
      <a class="glass-card planet-card" href="https://belentani.base44.app" target="_blank" rel="noopener noreferrer">
        <div class="planet-visual"><div class="planet-sphere"></div></div>
        <div class="planet-info">
          <div class="planet-name">BASE44 HUB</div>
          <p class="planet-lore">Ecosistema multimedia y catálogo interactivo de sonido e imagen.</p>
          <div class="planet-tags"><span class="tag">Base44</span><span class="tag">Media</span></div>
        </div>
      </a>
      <a class="glass-card planet-card" href="https://belentani7.github.io/ManosAbiertas/" target="_blank" rel="noopener noreferrer">
        <div class="planet-visual"><div class="planet-sphere"></div><div class="planet-ring"></div></div>
        <div class="planet-info">
          <div class="planet-name">CAMPUS EDUCATIVO</div>
          <p class="planet-lore">Legado de educación y comunidad: Manos Abiertas, Cruzando el Charco y School Unificado.</p>
          <div class="planet-tags"><span class="tag">Campus</span><span class="tag">Educación</span></div>
        </div>
      </a>
      <a class="glass-card planet-card" href="../?skipboot=1">
        <div class="planet-visual"><div class="planet-sphere"></div></div>
        <div class="planet-info">
          <div class="planet-name">JUDAS_OS · SHELL</div>
          <p class="planet-lore">El organismo vivo: terminal, gemas, sesiones y bóveda sonora. El shell que ata el mito.</p>
          <div class="planet-tags"><span class="tag">OS</span><span class="tag">432 Hz</span><span class="tag">Shell</span></div>
        </div>
      </a>
    </div>
"""

LORE_HTML = """
  <section class="lore-section" id="lore">
    <div class="lore-container">
      <div class="section-label">// ARCHIVOS CLASIFICADOS · CANON</div>
      <h2 class="section-title" style="margin-bottom: 60px;">El lore Belentani</h2>

      <div class="lore-block">
        <div class="lore-chapter">CAPÍTULO I · GÉNESIS</div>
        <h3>Espejo en la arena</h3>
        <p>Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo en el desierto: marco ovalado de oro viejo, terreno de posguerra. A un lado plumas blancas, libro santo, agua con corcho. Al otro plumas negras, cadena, candado entreabierto. En medio, alguien que aprendió a cantar porque no lo dejaron hablar.</p>
        <div class="lore-quote">"Esto no es una confesión. Esto es el guion, y yo soy quien lo escribe. Código rojo, hermanos."</div>
      </div>

      <div class="lore-block">
        <div class="lore-chapter">CAPÍTULO II · LA TRAICIÓN</div>
        <h3>Pedro besa a Judas</h3>
        <p>Un narcisista habla a sus hermanos (código rojo) porque una víctima rompió el pacto: promete escribir la canción y contar el plan. Giro: el narrador se revela como el verdadero antihéroe — nació sin belleza ni voz, cantó, entendió el daño, eligió reformarse sin negar el beso.</p>
        <div class="lore-quote">"Pedro besó a Judas y no se arrepiente."</div>
      </div>

      <div class="lore-block">
        <div class="lore-chapter">CAPÍTULO III · LA DEUDA</div>
        <h3>Impagable</h3>
        <p>Alguien se enamora de él, no le encuentra defecto y queda con una deuda que no puede destruirlo. La llave solo existe como imagen poética: alguien la llevó de un lugar donde no vivía, con amenaza de volver. Sin nombres, sin marcas — solo el peso del recuerdo.</p>
        <div class="lore-quote">"Vete tranquilo, no te debo nada, aunque tú creas que me debes la mitad."</div>
      </div>

      <div class="lore-block">
        <div class="lore-chapter">CAPÍTULO IV · LA REDENCIÓN</div>
        <h3>El horizonte no borra la noche</h3>
        <p>El horizonte no borra la noche: la consagra.</p>
        <div class="lore-quote">"Vete tranquilo, pero recuérdame."</div>
      </div>

      <div class="lore-block">
        <div class="lore-chapter">CAPÍTULO V · EL ARTEFACTO</div>
        <h3>Un sistema · muchos mundos</h3>
        <p>La web no sustituye al mito: lo habita. Cada planeta (página JUDAS, OMEGA, Fullstack) es un cuerpo distinto de la misma historia. Frecuencia de firma: 432 Hz. Lenguaje visual: Red Glass · Obsidian · Oro Viejo.</p>
        <div class="lore-quote">Dark Pop Litúrgico</div>
      </div>
    </div>
  </section>
"""

BIBLIAS_HTML = """
  <section class="section" id="biblias">
    <div class="section-label">// CÓDICES FUNDACIONALES · SONIDO Y ARQUITECTURA</div>
    <h2 class="section-title">Las Dos Biblias del Universo</h2>
    <p class="section-desc">El mito no se improvisa: se gobierna mediante Melodic Math sueca en lo sonoro y arquitectura reproducible en lo técnico.</p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-top: 30px;">
      <div class="glass-card">
        <div class="tag" style="color: var(--neon-red); margin-bottom: 12px;">◈ GOSPELS OF THE NIGHT · 432 Hz</div>
        <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #fff; margin-bottom: 15px;">La Biblia de la Música</h3>
        <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 15px;">
          Genealogía verificada en disco: <b>Denniz PoP</b> (SweMix / Cheiron 1992) → <b>Max Martin</b> (Melodic Math) → <b>Andreas Carlsson</b> (*NSYNC, BSB, Britney) → <b>Lady Gaga / The Weeknd</b> → <b>Belentani</b>.
        </p>
        <ul style="color: var(--text-secondary); line-height: 1.8; padding-left: 20px; font-size: 0.95rem;">
          <li><b>Melodic Math:</b> Sílabas, acentos y notas ajustados antes que la letra.</li>
          <li><b>Regla de la Octava:</b> Verso en registro grave-hablado; estallido en el coro una octava arriba.</li>
          <li><b>Motivo Firma:</b> Progresión <code style="color: var(--neon-red);">5 ♭6 5 4 ♭3 2 1</code> presente en verso, coro y puente.</li>
          <li><b>Tonalidad Canónica:</b> F# menor (Judas, La Deuda) y C menor para texturas dance.</li>
          <li><b>Frecuencia y Master:</b> 432 Hz de afinación, masterizado a −14 LUFS para streaming.</li>
        </ul>
        <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--glass-border); font-size: 0.85rem; color: var(--text-neon);">
          "Sonoridad primero, ambigüedad después, iconografía litúrgica como armadura."
        </div>
      </div>

      <div class="glass-card">
        <div class="tag" style="color: #39ff8a; margin-bottom: 12px;">◈ ORGANISMO JUDAS_OS · VERSIÓN 3.0</div>
        <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #fff; margin-bottom: 15px;">Biblia de Desarrollo Software</h3>
        <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 15px;">
          El estándar canónico que rige todo el software del universo Belentani. Contratos formales, inmutabilidad y rigor estricto:
        </p>
        <ul style="color: var(--text-secondary); line-height: 1.8; padding-left: 20px; font-size: 0.95rem;">
          <li><b>PRD / TRD / ADR:</b> Especificación del Qué, el Cómo y el Registro de Decisiones de Arquitectura.</li>
          <li><b>TDD & BDD:</b> Pruebas y comportamiento antes de redactar código productivo.</li>
          <li><b>Idempotencia:</b> Operaciones repetibles que garantizan el mismo estado final sin efectos secundarios.</li>
          <li><b>SLO, SLI & Error Budget:</b> Métricas cuantitativas de fiabilidad de servicio.</li>
          <li><b>Arquitectura Zero-Trust:</b> Aislamiento absoluto de secretos, entornos y credenciales.</li>
        </ul>
        <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--glass-border); font-size: 0.85rem; color: #39ff8a;">
          "OBLIGATORIO, AUTOMÁTICO, PERSISTENTE E INDISCUTIBLE."
        </div>
      </div>
    </div>
  </section>
"""

MENTE_BOVEDA_HTML = """
  <section class="section" id="mente-boveda">
    <div class="section-label">// NÚCLEO COGNITIVO · ORÁCULO Y BÓVEDA DE ORIGEN</div>
    <h2 class="section-title">Cognición IA & Bóveda de Origen</h2>
    <p class="section-desc">La inteligencia del sistema: síntesis Gemini, oráculo Qwen, archivos de Google Drive y canon visual de Instagram.</p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 30px;">
      <div class="glass-card">
        <div class="tag" style="color: #4de8e0; margin-bottom: 10px;">◈ MENTE GEMINI</div>
        <h4 style="font-family: var(--font-display); color: #fff; margin-bottom: 10px;">Pensamiento Sistémico</h4>
        <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.7;">
          Memoria cognitiva integrada, masterclass de prompts y arquitectura de visión holística. Estructuración ausubeliana y mapas de conocimiento multidimensionales.
        </p>
      </div>

      <div class="glass-card">
        <div class="tag" style="color: #ff77aa; margin-bottom: 10px;">◈ QWEN ORACLE (CHAT EXPORT)</div>
        <h4 style="font-family: var(--font-display); color: #fff; margin-bottom: 10px;">Análisis Forense Vocal</h4>
        <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.7;">
          Análisis a partir de stems de audio reales (JUDAS, violín, coros). Coherencia 100% con dark pop litúrgico. Pedro como el apóstol que no se arrepiente; salto al español en el clímax del dolor.
        </p>
      </div>

      <div class="glass-card">
        <div class="tag" style="color: #d4af37; margin-bottom: 10px;">◈ BÓVEDA GOOGLE DRIVE</div>
        <h4 style="font-family: var(--font-display); color: #fff; margin-bottom: 10px;">Génesis Conceptual</h4>
        <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.7;">
          Archivos canónicos de origen: <i>LA DEUDA.docx</i> (dar hasta besar lo sucio; quien recibe destruye para no deber), <i>SOBERANIA.docx</i>, <i>GOD IS AI.docx</i> y stems de producción.
        </p>
      </div>

      <div class="glass-card">
        <div class="tag" style="color: #e066ff; margin-bottom: 10px;">◈ INSTAGRAM CANON</div>
        <h4 style="font-family: var(--font-display); color: #fff; margin-bottom: 10px;">@belentani_ · Estética</h4>
        <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.7;">
          Silueta Rick Owens / Thierry Mugler. Arquetipo de soberano melancólico. Paleta negro obsidiana, oro viejo y violeta. Luz cinematográfica de alto contraste en desierto posguerra.
        </p>
      </div>
    </div>
  </section>
"""

ORIGIN_HTML = """
  <section class="section" id="origin">
    <div class="section-label">// TRANSMISIÓN 001</div>
    <h2 class="section-title">Origen del universo rojo</h2>
    <p class="section-desc">Belentani no es solo un cantante. Es un mito: dark pop litúrgico, deuda impagable, espejo en el desierto. Esta página une muchas webs — JUDAS, OMEGA, Fullstack, Biblias y Labs — en una sola experiencia inmersiva.</p>
    <div class="glass-card" style="margin-bottom: 30px;">
      <h3 style="font-family: var(--font-display); color: var(--neon-red); margin-bottom: 15px; font-size: 1.1rem;">MANIFIESTO</h3>
      <p style="color: var(--text-secondary); line-height: 1.9; font-weight: 300;">
        El lore manda. La música, el 3D y el banco de efectos galácticos (Ciclona, espacio-3d, Python)
        sirven al arco. No se visita una lista de repos: se habita un sistema estelar donde cada planeta
        es una página ya publicada, atada por estaciones narrativas y códices de ingeniería.
      </p>
    </div>
  </section>
"""


def build_assets_gallery() -> str:
    if not ASSETS_SRC.is_dir():
        return '<div class="asset-thumb"><div style="padding:12px;font-family:var(--font-mono);font-size:.65rem;color:var(--text-secondary)">Sin assets locales</div></div>'
    thumbs = []
    for p in sorted(ASSETS_SRC.iterdir()):
        if p.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".gif"}:
            continue
        if p.stat().st_size > 12_000_000:
            continue
        rel = f"assets/{p.name}"
        thumbs.append(
            f'<a class="asset-thumb" href="{rel}" target="_blank" rel="noopener">'
            f'<img src="{rel}" alt="{p.stem}" loading="lazy">'
            f'<span class="asset-label">{p.stem[:28]}</span></a>'
        )
        if len(thumbs) >= 18:
            break
    return "\n".join(thumbs) or '<div class="asset-thumb"><div style="padding:12px">—</div></div>'


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Falta export Qwen: {SRC}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if ASSETS_SRC.is_dir():
        ASSETS_DST.mkdir(parents=True, exist_ok=True)
        for p in ASSETS_SRC.iterdir():
            if p.is_file() and p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".json"}:
                if p.stat().st_size > 15_000_000:
                    continue
                shutil.copy2(p, ASSETS_DST / p.name)

    html = SRC.read_text(encoding="utf-8", errors="ignore")

    # Identidad
    html = html.replace("DIVIDENTANI", "BELENTANI")
    html = html.replace("Dividentani", "Belentani")
    html = html.replace("dividentani", "belentani")
    html = re.sub(
        r"<title>.*?</title>",
        "<title>BELENTANI — Universo Unificado · JUDAS ERA</title>",
        html,
        count=1,
        flags=re.I | re.S,
    )
    html = re.sub(
        r'<meta name="description" content="[^"]*">',
        '<meta name="description" content="Experiencia inmersiva unificada Belentani: lore JUDAS, galaxia Three.js, mundos OMEGA, dos biblias y archivo visual.">',
        html,
        count=1,
    )

    # Nav
    html = html.replace(
        """    <ul class="nav-links">
      <li><a href="#origin">Origen</a></li>
      <li><a href="#planets">Planetas</a></li>
      <li><a href="#lore">Lore</a></li>
      <li><a href="#assets">Archivos</a></li>
    </ul>""",
        """    <ul class="nav-links">
      <li><a href="#lore">Lore</a></li>
      <li><a href="#biblias">Biblias</a></li>
      <li><a href="#mente-boveda">Cognición</a></li>
      <li><a href="#planets">Mundos</a></li>
      <li><a href="#origin">Origen</a></li>
      <li><a href="#assets">Archivo</a></li>
      <li><a href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener">Música</a></li>
    </ul>""",
    )

    # Hero
    html = html.replace(
        '<div class="hero-overline">SISTEMA ESTELAR ACTIVO — SECTOR 7G</div>',
        '<div class="hero-overline">JUDAS ERA · CÓDIGO ROJO · 432 Hz</div>',
    )
    html = html.replace(
        '<p class="hero-subtitle">Una experiencia inmersiva a través de galaxias digitales, mundos generativos y el arte que nace del vacío cósmico.</p>',
        '<p class="hero-subtitle">Lore primero. Narcisista → antihéroe → deuda impagable. Varias páginas, dos biblias, un solo universo rojo.</p>',
    )
    html = html.replace('href="#origin" class="hero-cta"', 'href="#lore" class="hero-cta"')
    html = html.replace("<span>INICIAR VIAJE</span>", "<span>ENTRAR AL LORE</span>")

    # Loader lore
    html = html.replace(
        '"En el vacío entre galaxias, un artista trazó las primeras líneas de luz roja sobre la oscuridad eterna..."',
        '"Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo en la arena..."',
    )

    # Replace origin section
    html = re.sub(
        r'  <!-- ORIGIN SECTION -->\s*<section class="section" id="origin">.*?</section>',
        "  <!-- ORIGIN -->\n" + ORIGIN_HTML.strip(),
        html,
        count=1,
        flags=re.S,
    )

    # Replace planets grid (keep section chrome)
    html = re.sub(
        r'<div class="planet-grid">.*?</div>\s*</section>\s*\n\s*<!-- LORE SECTION -->',
        PLANETS_HTML.strip() + "\n  </section>\n\n  <!-- LORE SECTION -->",
        html,
        count=1,
        flags=re.S,
    )
    html = html.replace(
        '<div class="section-label">// CARTOGRAFÍA ESTELAR</div>\n    <h2 class="section-title">Sistemas Planetarios</h2>\n    <p class="section-desc">Cada proyecto es un mundo. Cada mundo tiene su propia gravedad, su atmósfera, su lore.</p>',
        '<div class="section-label">// CARTOGRAFÍA · PÁGINAS REALES</div>\n    <h2 class="section-title">Mundos del sistema</h2>\n    <p class="section-desc">Cada planeta es una página publicada. No se borra: se orbita desde el lore.</p>',
    )

    # Replace lore section entirely and add Biblias + Mente/Bóveda
    lore_composite = LORE_HTML.strip() + "\n\n" + BIBLIAS_HTML.strip() + "\n\n" + MENTE_BOVEDA_HTML.strip()
    html = re.sub(
        r'  <!-- LORE SECTION -->\s*<section class="lore-section" id="lore">.*?</section>',
        "  <!-- LORE COMPOSITE -->\n  " + lore_composite,
        html,
        count=1,
        flags=re.S,
    )

    # Assets section + gallery
    gallery = build_assets_gallery()
    html = re.sub(
        r'<div class="assets-gallery" id="assetsGallery">.*?</div>\s*</div>\s*</section>',
        f'<div class="assets-gallery" id="assetsGallery">\n{gallery}\n      </div>\n    </div>\n  </section>',
        html,
        count=1,
        flags=re.S,
    )
    html = html.replace(
        "Texturas, modelos, imágenes y artefactos descargados de todas las webs de Belentani. Cada archivo es un fragmento de un mundo.",
        "Arte extraído de base44, JUDAS y el banco local espacio-3d. Fragmentos del canon visual.",
    )

    # Footer
    html = html.replace(
        "<p>Experiencia inmersiva unificada — CLI Coders</p>",
        "<p>Experiencia inmersiva unificada — Belentani · JUDAS ERA · OMEGA CORE</p>",
    )
    html = html.replace(
        "COORD: 47.3812° N, 8.5417° E · SECTOR 7G · FRECUENCIA: 632.8nm (ROJO)",
        "SÃO PAULO ↔ BARCELONA · JUDAS_OS · FRECUENCIA 432 Hz · RED GLASS",
    )

    # Accessibility: hide custom cursor when reduced motion
    html = html.replace(
        "@media (max-width: 768px) {\n  .nav-links { display: none; }\n  .nav-glass { padding: 12px 20px; }\n  .planet-grid { grid-template-columns: 1fr; }\n  .glass-card { padding: 25px; }\n  body { cursor: auto; }\n  .cursor-dot, .cursor-ring { display: none; }\n}",
        "@media (max-width: 768px) {\n  .nav-links { display: none; }\n  .nav-glass { padding: 12px 20px; }\n  .planet-grid { grid-template-columns: 1fr; }\n  .glass-card { padding: 25px; }\n  body { cursor: auto; }\n  .cursor-dot, .cursor-ring { display: none; }\n}\n@media (prefers-reduced-motion: reduce) {\n  body { cursor: auto; }\n  .cursor-dot, .cursor-ring { display: none !important; }\n}",
    )

    # Make planet cards clickable as anchors — CSS for a.planet-card
    if "a.planet-card" not in html:
        html = html.replace(
            ".planet-card {",
            "a.planet-card{display:block;color:inherit;text-decoration:none}\n.planet-card {",
        )

    # Reorder: put lore composite before planets in DOM for "lore first"
    lore_m = re.search(r'  <!-- LORE COMPOSITE -->\s*<section class="lore-section".*?</section>\s*</section>', html, re.S)
    plan_m = re.search(r'  <!-- PLANETS / PROJECTS -->\s*<section class="section" id="planets">.*?</section>', html, re.S)
    if lore_m and plan_m and lore_m.start() > plan_m.start():
        lore_block = lore_m.group(0)
        plan_block = plan_m.group(0)
        html = html.replace(lore_block, "<!--LORE_PLACEHOLDER-->", 1)
        html = html.replace(plan_block, lore_block + "\n\n" + plan_block, 1)
        html = html.replace("<!--LORE_PLACEHOLDER-->", "", 1)

    # El export Qwen trae un sondeo de imagenes de ejemplo (galaxy_01.png, planet_01.jpg...) que no existen:
    # provoca 6 errores 404 en consola en cada carga. build_assets_gallery() ya monta la galeria con los assets reales.
    html = re.sub(
        r"  // =+\n  // DYNAMIC ASSET LOADING\n  // =+\n  function loadLocalAssets\(\) \{.*?\n  \}\n  loadLocalAssets\(\);\n\n",
        "",
        html,
        flags=re.S,
    )

    OUT.write_text(html, encoding="utf-8")

    # Mirror into github.io for Pages-friendly path
    if GH_MIRROR.parent.is_dir():
        if GH_MIRROR.exists():
            shutil.rmtree(GH_MIRROR)
        shutil.copytree(OUT_DIR, GH_MIRROR)

    print("OK", OUT)
    print("bytes", OUT.stat().st_size)
    if GH_MIRROR.is_dir():
        print("mirror", GH_MIRROR)


if __name__ == "__main__":
    main()
