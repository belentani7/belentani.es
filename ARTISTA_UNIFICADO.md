# Belentani.es — estado de unificación

## Qué pediste (relectura)

1. **Banco de datos** = recursos *galácticos* (efectos, herramientas, assets) → Python.
2. En la web, aunque seas cantante, **lo más importante es el LORE**.
3. No es una página: son **varias** que hay que unir, pulir y describir (+ disco **G:**).
4. Lo crítico es **cómo se unen** códigos y archivos.

## Cómo se une (hecho)

| Capa | Dónde | Qué hace |
|------|-------|----------|
| Inventario Python | `inventariar_recursos_galacticos.py` | Escanea Ciclona / espacio-3d / assets → `banco-recursos-galacticos/` |
| Arquitectura | `banco-recursos-galacticos/COMO_UNIR.md` | Mapa shell + lore + mundos + G: |
| Canon G: | `lore-canon/` | Espejo de `G:\Mi unidad\Belentani` (skills + letras + auditoría v3) |
| Espina lore | `universo-lore.js` | Estaciones + mundos (URLs reales) |
| Shell | `index.html` | Lore primero; cada estación abre páginas/módulos |
| Catálogo musical | `catalogo-artista.js` | Satélite (no el centro) |

## Páginas que el lore ata (no borra)

JUDAS experience, cósmico unificado, omega immersive, judas-era-omega, judas-web, FULLSTACK 20 mundos, 3d-portfolio, belentani.es, ecosistema.html…

## Siguiente paso natural

~~Portar 1 efecto de Ciclona~~ → **elevación 2026-10-02 en curso:** shell + unificado + catálogo + legado ya curados.
Siguiente: publicar Pages solo con permiso; DistroKid con WAV de `masters/judas/`.

## App (entrada única)

Esta carpeta **es una aplicación**.

| Cómo abrir | Qué hace |
|------------|----------|
| Doble clic `ABRIR_APP.bat` | Sirve la app en `http://localhost:4321` |
| `npm start` | Igual, sin abrir el navegador solo |
| `index.html` (raíz) | Redirige al shell con `?skipboot=1` |

Núcleo servido: `app-web-nextjs/belentani7.github.io/` (shell + `unificado/` + `profesion/` + catálogo + lore).
Ciclona, banco y lore-canon son **banco de recursos**, no pantallas separadas que competir.

## Suite de dominios (local award-tier)

| Dominio | Carpeta local | Rol |
|---------|---------------|-----|
| belentani.es | `galaxia/` (+ `obra/`) | Artista · galaxia viajable |
| noiacore.com | `noiacore/` | Lab SaaS · productos |
| belentani.eu | `eu/` | Profesional · oferta + evidencia |

Live externos siguen siendo las URLs oficiales; estas páginas son el diseño canónico listo para desplegar.

## No tocar

`G:\Mi unidad\CASO_*`, `DEUDAFIX*`, expediente 148 — fuera del universo artístico.
