# AUDITORIA_ESTADO — belentani.es

- Cumplimiento: **83.3%** (35 ok / 7 incumple / 7 no evaluable)
- Paginas HTML muestreadas: 375
- Generado: 2026-11-07T15:18:51

## Reglas que incumple

| Regla | Detalle |
|---|---|
| COH-01 | variantes de marca: ['belentani', 'belentani7', 'belentani_', 'belentaniuniverse'] |
| DEV-04 | scripts sin documentar: ['prebuild', 'lint', 'test:watch', 'test:e2e'] |
| SEO-01 | institucion/experiencia/03-duck-web-build-everything-drive.html: title 70 chars |
| SEO-02 | index.html: description 60 chars |
| SEO-03 | institucion/404.html: title y h1 no comparten termino |
| WEB-06 | _universo_assets/prueba.html: sin <header> |
| WEB-23 | _universo_assets/prueba.html: sin favicon |

## Reparacion

```bash
python _audit/reparar.py --apply --only belentani.es
```
