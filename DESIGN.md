# DESIGN.md — belentani.es

## Direction
Inmersivo espacial/galáctico. Fondo #050505 (void), texto #FFFFFF (ink), acentos rojo #FF7777, oro #FDE047, violeta #D8B4FE. Tipografía: Orbitron (display), Rajdhani (cuerpo), Share Tech Mono (código/datos). Modo oscuro por defecto.

## Craft floor (bans aplicados)
- No eyebrow/kicker encima de headings.
- Sin sección numérica salvo que la secuencia lleve información.
- Sin gradient text.
- Tracking floor -0.04em; -0.02/-0.03 prefiere.
- Card radius 12-16px; pills solo controles pequeños.
- Contraste ≥4.5:1 cuerpo, ≥3:1 texto grande.
- Estados: hover, disabled, loading, error, empty + focus visible.
- Respetar prefers-reduced-motion.

## Tokens
--color-void: #050505 / --color-voidElevated: #0A0A0A
--color-ink: #FFFFFF / --color-mute: #B3B3B3
--color-red: #FF7777 / --color-gold: #FDE047 / --color-violet: #D8B4FE
--font-display: Orbitron / --font-body: Rajdhani / --font-mono: Share Tech Mono

## Surfaces
- Home (/): Experience. Galaxia navegable, lore stations, experiencia 3D.
- /agency, /consultoria: Persuade. Servicios profesionales del artista.
- /ai-lab, /lab, /maquina: Operate. Experiencias interactivas.
- /school: Read. Recursos educativos.
- /judas, /judas-era: Experience. Universo narrativo JUDAS.

## i18n
9 idiomas: es, en, ca, fr, it, pt, de, nl, ja. es por defecto. Selector de idioma persistente (localStorage). Todo el copy traducido.
