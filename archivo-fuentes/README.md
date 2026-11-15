# archivo-fuentes

Material recuperado de fuera del repositorio —conversaciones de Qwen, inventario de Google
Drive, restos de Gemini y DeepSeek— filtrado, clasificado y colocado donde corresponde.

**Regla de esta carpeta:** aquí solo entra lo que sirve para construir o narrar Belentani.
Lo privado (casos legales, credenciales, audios, datos de terceros) queda fuera por diseño:
se documenta que existe y dónde está, nunca su contenido.

---

## Qué se leyó y qué se quedó

| Fuente | Volumen real | Único | Destino |
|---|---|---|---|
| Export Qwen nº1 `chat-export-1793320950348.zip` | 1.271 chats · 36,6 M caracteres | — | `qwen/` |
| Export Qwen nº2 `chat-export-1794054763159.json.gz` | 1.291 chats · 37,3 M caracteres | — | `qwen/` |
| **Qwen, unificado y deduplicado** | 2.562 leídos | **1.294 únicos · 42,2 M caracteres · 2025-02-20 → 2026-11-07** | `qwen/INDICE.md`, `qwen/chats.csv` |
| Google Drive (inventario) | 1.200 ítems | — | `drive/INDICE.md` |
| DeepSeek | 8 HTML + 1 TXT | — | `deepseek-gemini/FUENTES.md` |
| Gemini / Antigravity | transcripciones de agente | — | `deepseek-gemini/FUENTES.md` |

Los dos exports de Qwen son de la misma cuenta (`c2739080-…`): el segundo es una tanda
posterior que repite casi todo el primero y añade ~23 chats nuevos. Se unificaron por
título + tamaño y quedaron 1.294 conversaciones distintas.

## Dónde está cada cosa

| Archivo | Qué contiene |
|---|---|
| `qwen/INDICE.md` | Cifras, clasificación temática y tabla de las conversaciones con más señal |
| `qwen/NARRATIVA.md` | Lo narrativo extraído: la Crónica de la Llave Dorada, la bio canónica, la letra de JUDAS, las reglas de escritura del artista y los satélites |
| `qwen/chats.csv` | Índice completo: fuente, título, fechas, mensajes, caracteres, señal narrativa, tema |
| `drive/INDICE.md` | Qué hay en Drive por familias, qué corresponde a cada repo y qué no se toca |
| `deepseek-gemini/FUENTES.md` | Restos de DeepSeek y Gemini, y qué se puede reutilizar |
| `NARRATIVA_UNIFICADA.md` | Síntesis: cómo encaja todo lo anterior con el canon que ya vive en el repo |

## Cómo se reconstruye

Los textos completos de las 185 conversaciones narrativas (13 MB) viven fuera del repo,
en `C:\Users\USER\Documents\BELENTANI_RECUPERADO\qwen-export\`. Se extrajeron en streaming
con `ijson` porque el JSON interno del primer export pesa 522 MB y no cabe en memoria.
Para rehacerlo: descomprimir el export, recorrer `data.item`, volcar a texto plano por chat
y deduplicar por hash del contenido normalizado.

## Material sin copiar (existe, no se versiona)

- Expedientes legales y forenses (Jorge, DEUDAFIX, expediente 148) presentes en Drive.
- Documento de credenciales de IA de Drive.
- Audios maestros y acapellas en `Downloads/` y `Desktop/`.
- Transcripciones de sesiones personales en `workspace/RECUPERADO_SESIONES/` (9.597 archivos).

El canon del repo ya lo dice: nada de audio privado, sesiones, credenciales, casos legales
ni datasets internos dentro de la web pública. Esta carpeta respeta esa frontera.
