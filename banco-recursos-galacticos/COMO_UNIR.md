# Cómo unir todo (prioridad #1)

No hay “una página”. Hay **muchas** (GitHub Pages, Base44, dominios, demos Ciclona, packs en G:).
La unión no es copiar HTML a un solo archivo. Es un **shell + banco + lore**.

## Mapa de capas

```
LORE (núcleo)                    ← belentani-universo + letras + estaciones
   │
   ├── SHELL                         ← belentani7.github.io/index.html
   │     rutas narrativas: Invitación → Exceso → Traición → Deuda → Redención
   │
   ├── BANCO GALÁCTICO (Python)      ← inventariar_recursos_galacticos.py
   │     Ciclona = efectos/shaders/partículas (se IMPORTAN, no se enlazan crudos)
   │     espacio-3d/assets = arte/texturas del canon
   │     _universo_assets = prototipos (Vanta, capturas)
   │
   ├── MUNDOS (páginas ya publicadas) ← uplink con ficha lore, no lista de repos
   │     judas-experience-web
   │     judas-experience-unificado
   │     omega-immersive-portal
   │     belentani-judas-era-omega
   │     belentani-judas-web
   │     JUDAS-ERA-FULLSTACK (20 mundos)
   │     3d-portfolio / belentani.es / base44
   │
   └── ORIGEN EN DISCO G:            ← G:\Mi unidad\Belentani + RESPALDO_...
         skills, letras, stems, openvj  → se espejan a lore-canon/ (local)
```

## Regla de oro

**El lore manda.** Cantante, catálogo Spotify, CV y herramientas son satélites.
Si un visitante solo lee el arco (narcisista → antihéroe → deuda impagable → “vete tranquilo pero recuérdame”) y ve la simbología (espejo en el desierto, plumas, llave), la web ya cumplió.

## Flujo técnico de unión

1. **Inventariar** (Python): `python inventariar_recursos_galacticos.py`
   → `banco-recursos-galacticos/inventario.json` (efectos, assets, herramientas, páginas).
2. **Canon narrativo**: `lore-canon/` (espejo de G: — skills + letras + auditoría v3).
3. **Datos vivos en el shell**:
   - `universo-lore.js` → arcos, gemas, mundos (páginas unificadas por id).
   - `catalogo-artista.js` → discografía (satélite, no centro).
4. **UI**: el shell muestra primero **estaciones del lore**; cada estación abre un mundo (URL) o un módulo local (sessions/audio/3D).
5. **Efectos**: de Ciclona se elige 1–2 sistemas (p.ej. partículas / galaxy shader) y se portan al shell; el resto queda en el banco como referencia.
6. **Fuera del shell lore**: belentani.eu, CV, income, DEUDAFIX, NOIACORE java — atelier / otro dominio.

## Qué NO hacer

- No fusionar 20 repos a martillazos en un monorepo gigante sin mapa.
- No poner demos Ciclona enteras en producción.
- No mezclar expediente legal (G: CASO_/DEUDAFIX) con el universo artístico.
- No tratar el catálogo Spotify como la página: el disco y el mito son el centro.

## Estado del banco (última corrida local)

Ver `inventario.md` en esta carpeta: demos Ciclona, páginas a unificar, conteo por tipo (efecto/asset/herramienta/código).
