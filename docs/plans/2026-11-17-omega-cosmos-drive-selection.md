# 2026-11-17 — Selección OMEGA COSMOS de Drive

Fuentes comparadas: OMEGA_COSMOS_ABRIR.html (197 KB, 8 mundos/50 galaxias, sin CDN); BOSQUE_CRISTAL.html (363 KB); dos Bosque de Cristal WebGL (1,8 MB cada uno); OMEGA_MERGED.html (143 KB, dependencias GSAP/Three/CDN).

Decisión: conservar originales en Drive e integrar OMEGA COSMOS autónomo en public/omega-cosmos.html. Mantener OMEGA Living anterior. No publicar los candidatos pesados ni afirmar FPS en GPU modesta antes de medir.

Transformaciones: href heredados a / y /atlas, localStorage a sessionStorage, textura SVG data:image a gradiente CSS. Sin identificadores privados de Drive ni rutas locales en la versión pública. Pruebas HTTP y DOM básicas, además de la validación completa de CI.

Control: auditoría sin credenciales/correos/peticionarios externos; no editado el fichero original de Drive. Por comprobar WebGL y fallback Canvas en hardware real.