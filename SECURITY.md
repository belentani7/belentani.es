# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

## Reporting a Vulnerability

Please report security vulnerabilities by emailing security@belentani.com or by opening a private security advisory on GitHub.

We will acknowledge receipt within 48 hours and provide a timeline for resolution within 5 business days.

## Security Measures

- All dependencies are scanned weekly via Dependabot
- CodeQL analysis runs on every push and pull request
- Gitleaks secret scanning runs on every push
- Branch protection requires passing CI and code review
- All secrets are managed via environment variables, never committed

## Disclosure Policy

We follow responsible disclosure. Please give us time to address the issue before making it public.

<!-- repo-forge:security:inicio -->
# Seguridad

## Reportar una vulnerabilidad

No abras un issue público. Usa el canal privado de GitHub Security del repositorio.
Incluye: versión o commit, pasos para reproducir, impacto y, si puedes, una corrección.

## Qué se considera vulnerabilidad

- Ejecución de código o comandos no previstos.
- Lectura o escritura de archivos fuera del alcance declarado.
- Exposición de credenciales en logs, informes o manifiestos.
- Dependencia con CVE conocido en una ruta ejecutable.

## Reglas del proyecto

- Ningún secreto se escribe en disco, en un log ni en un informe.
- Toda operación de escritura requiere `--apply` explícito.
- Las operaciones destructivas están bloqueadas por diseño.

<!-- repo-forge:security -->
<!-- repo-forge:security:fin -->
