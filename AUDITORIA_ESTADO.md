# AUDITORIA_ESTADO — belentani.es

> Repositorio físico: `belentani-ecosystem/arte-musica/belentani.es`

## Situación actual

| Indicador | Valor |
|-----------|-------|
| Categoría | arte-musica |
| Lenguaje | HTML |
| Rama | main |
| package.json | Sí |
| Python | No |
| Docker | Sí |
| README | Sí |
| AGENTS.md | Sí |
| Tests | No |
| CI | Sí |

## Comentarios

- Hub de artista: portfolio 3D inmersivo, catálogo musical y universo narrativo.
- Repo curado (categoría creative). Sitio en línea: https://belentani.es
- Tiene AGENTS.md y CI, pero falta tests.

## Comando para arreglar y elevar

```bash
npm install
npm run build
# HTML estático: copiar archivos al servidor
npm run test  # crear tests básicos si no existen
# Verificar WCAG, SEO y Open Graph en todas las páginas HTML
gitleaks detect --source .