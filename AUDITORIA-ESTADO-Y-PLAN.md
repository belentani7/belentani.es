# Auditoría, situación y plan de elevación — `belentani.es`

Generado 2026-11-03 por el pase de reglas del ecosistema (catálogo `_meta/reglas-oficiales.md`).
Todo lo afirmado aquí sale de datos reales: base de consolidación, gate oficial y git.

- **Categoría:** arte-musica · **Ruta:** `C:\Users\USER\belentani-ecosystem\arte-musica\belentani.es`
- **Remoto:** https://github.com/belentani7/belentani.es.git · **Rama:** main · **HEAD:** c2305ce (docs(auditoria): gobernanza GH-01..10 verificada (GH-09/GH-10 OK) + estado y pla)
- **Lenguajes:** .tsx:149,.ts:79,.md:23,.json:22,.mjs:19,.css:19 · **Commits (git real):** 30 · **Tamaño worktree:** 19.8 MB
- **Visibilidad GitHub:** public · **Homepage:** https://belentani.es · **HTTP:** HTTP_200
- **GitHub Pages:** no activo

## 1. Situación actual

- **Consolidación:** familia `proyecto-belentanies` · acción survivor (estable).
- **Git:** 2 ficheros sin commitear · 7 commits sin push · 6 commits del pase de reglas (desde 2026-11-02).
- **Reglas web (gate oficial):** 378 HTML · **0 hallazgos** · 0 títulos duplicados.
- **Gobernanza GitHub (protocolo MS):** 11/11 reglas aplicadas · completo.
- **Secretos (triaje):** sin hallazgos.

## 2. Comandos para arreglar y elevar (ejecutar en este orden)

1. **Reglas web: ya cumplidas (0 hallazgos).** Barrera continua:
   ```powershell
   python C:\Users\USER\belentani-ecosystem\_meta\check_web_rules.py belentani.es
   ```
2. **Publicar en GitHub Pages** (repo público; la cuenta free solo publica repos públicos):
   ```powershell
   gh api -X POST repos/belentani7/belentani.es/pages -f source[branch]=main -f source[path]=/
   gh api -X POST repos/belentani7/belentani.es/pages/builds/latest -X POST 2>$null   # o dejar que el workflow publique
   ```
3. **Limpiar 2 ficheros sin commitear** (revisar antes; si son del pase de reglas, commitear):
   ```powershell
   git -C "C:\Users\USER\belentani-ecosystem\arte-musica\belentani.es" status --short
   git -C "C:\Users\USER\belentani-ecosystem\arte-musica\belentani.es" add -- <solo los ficheros del pase> ; git -C "C:\Users\USER\belentani-ecosystem\arte-musica\belentani.es" commit -m "fix(web-rules): ..."
   ```
4. **Subir al remoto** (requiere tu confirmación explícita; hoy ningún repo tiene push):
   ```powershell
   git -C "C:\Users\USER\belentani-ecosystem\arte-musica\belentani.es" push origin main
   ```

## 3. Qué puede alcanzar este repositorio

- **Repositorio público**: puede publicar gratis en GitHub Pages (`https://belentani7.github.io/belentani.es/`) y mantener Vercel; hoy tiene Pages desactivado
- Con 378 páginas HTML y el catálogo de reglas cumplido, es candidato a **superviviente/documentado** del ecosistema: README con arranque real, índice navegable y CI que ejecute `check_web_rules.py`.

---
*Evidencia: `_meta/consolidacion/consolidacion.db` · `_meta/specs/2026-11-01-*` · gate `check_web_rules.py` · git log. Regenerable con `python _meta/gen_auditoria_repos.py`.*
