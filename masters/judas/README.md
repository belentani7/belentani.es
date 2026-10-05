# JUDAS — master streaming (local)

## Fuente
`Downloads/Judas demo pura de Pedro Belentani (1).mp3`
- Metadatos: title Judas · artist Belentani · genre Dark Pop · 2026 · FL Studio 2025
- Duración ≈ 3:59 · 192 kb/s · 48 kHz

## Medición pre-master
- Integrated: **−10.0 LUFS**
- True peak: **+0.72 dBTP** (peligroso para normalizadores de plataforma)
- LRA: 3.8 LU

## Master generado (ffmpeg loudnorm 2-pass)
Carpeta: `masters/judas/`

| Archivo | Uso |
|---------|-----|
| `JUDAS_master_streaming_-14LUFS.wav` | Máster PCM 44.1 kHz |
| `JUDAS_master_streaming_-14LUFS.mp3` | Preview 320 kb/s (también en `unificado/audio/`) |

## Verificación post-master
- Integrated: **−14.0 LUFS**
- True peak: **−3.3 dBTP** (objetivo ≤ −1.5)
- LRA: 3.8 LU

## Nota
Esto es un **master de streaming técnico** (loudness + true peak), no un remix ni un master comercial de estudio. Para distribución oficial, preferir el WAV exportado desde FL Studio y repetir loudnorm sobre ese archivo.

No publicado. No hay commit/push.
