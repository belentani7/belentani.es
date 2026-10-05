#!/usr/bin/env python3
"""Inventario del banco de recursos galácticos (efectos, herramientas, assets, páginas).

No es discografía: es el arsenal técnico/visual para unificar el universo Belentani.
Uso: python inventariar_recursos_galacticos.py
"""
from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "banco-recursos-galacticos"
OUT_JSON = OUT_DIR / "inventario.json"
OUT_MD = OUT_DIR / "inventario.md"

# Carpetas del banco local
SCAN_DIRS = [
    ROOT / "Ciclona",
    ROOT / "espacio-3d",
    ROOT / "_universo_assets",
    ROOT / "app-web-nextjs" / "belentani7.github.io",
]

SKIP_DIR_NAMES = {
    "node_modules", ".git", ".next", "dist", "build", "__pycache__",
    ".turbo", ".cache", "coverage", "venv", ".venv",
}

EFFECT_HINTS = re.compile(
    r"(shader|galaxy|star|nebula|particle|bloom|post|vanta|three|webgl|globe|"
    r"halo|rings|ascii|raymarch|volumetric|cloud|planet|space|fx|effect)",
    re.I,
)
TOOL_HINTS = re.compile(
    r"(tool|forge|player|terminal|session|universe|catalog|biblia|judas|omega)",
    re.I,
)
ASSET_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".glb", ".gltf", ".hdr", ".exr", ".mp3", ".wav", ".ogg", ".mp4", ".webm"}
CODE_EXTS = {".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".glsl", ".vert", ".frag", ".wgsl"}


def classify(path: Path) -> str:
    name = path.name
    rel = str(path).replace("\\", "/")
    if path.suffix.lower() in ASSET_EXTS:
        return "asset"
    if EFFECT_HINTS.search(name) or EFFECT_HINTS.search(rel):
        return "efecto"
    if TOOL_HINTS.search(name) or TOOL_HINTS.search(rel):
        return "herramienta"
    if path.suffix.lower() in CODE_EXTS:
        return "codigo"
    if path.suffix.lower() in {".json", ".md", ".txt", ".csv"}:
        return "dato"
    return "otro"


def walk_bank(base: Path) -> list[dict]:
    rows: list[dict] = []
    if not base.is_dir():
        return rows
    for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIR_NAMES and not d.startswith(".")]
        # poda profunda de demos enormes
        depth = Path(dirpath).relative_to(base).parts
        if len(depth) > 5:
            dirnames[:] = []
        for fn in filenames:
            p = Path(dirpath) / fn
            try:
                size = p.stat().st_size
            except OSError:
                continue
            kind = classify(p)
            if kind == "otro" and size < 2048 and p.suffix.lower() not in CODE_EXTS | ASSET_EXTS:
                continue
            rows.append({
                "path": str(p.relative_to(ROOT)).replace("\\", "/"),
                "base": base.name,
                "kind": kind,
                "ext": p.suffix.lower() or "(sin)",
                "bytes": size,
                "name": p.name,
            })
    return rows


def ciclona_projects() -> list[dict]:
    root = ROOT / "Ciclona"
    if not root.is_dir():
        return []
    out = []
    for child in sorted(root.iterdir()):
        if not child.is_dir() or child.name.startswith("."):
            continue
        pkg = child / "package.json"
        readme = child / "README.md"
        tech = []
        desc = ""
        if pkg.is_file():
            try:
                data = json.loads(pkg.read_text(encoding="utf-8", errors="ignore"))
                deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
                for k in ("three", "@react-three/fiber", "@react-three/drei", "gsap", "tone"):
                    if k in deps:
                        tech.append(k)
            except Exception:
                pass
        if readme.is_file():
            try:
                first = readme.read_text(encoding="utf-8", errors="ignore").strip().splitlines()
                desc = next((ln.lstrip("# ").strip() for ln in first if ln.strip()), "")[:160]
            except Exception:
                pass
        out.append({
            "id": child.name,
            "path": str(child.relative_to(ROOT)).replace("\\", "/"),
            "tech": tech,
            "desc": desc,
            "role": "efecto-demo",
        })
    return out


def pages_map() -> list[dict]:
    """Páginas/destinos a unificar (no un solo HTML)."""
    return [
        {"id": "hub-os", "url": "local:belentani7.github.io/index.html", "role": "shell", "lore": "JUDAS_OS · puerta al universo"},
        {"id": "ecosistema", "url": "local:belentani7.github.io/ecosistema.html", "role": "atlas-links", "lore": "circuito de mundos"},
        {"id": "judas-web", "url": "https://belentani7.github.io/judas-experience-web/", "role": "experiencia-3d", "lore": "traición / planeta / llave"},
        {"id": "judas-unificado", "url": "https://belentani7.github.io/judas-experience-unificado/", "role": "experiencia-3d", "lore": "cósmico unificado"},
        {"id": "omega-immersive", "url": "https://belentani7.github.io/belentani-omega-immersive-portal/", "role": "portal", "lore": "OMEGA portal"},
        {"id": "judas-era-omega", "url": "https://belentani7.github.io/belentani-judas-era-omega/", "role": "portal", "lore": "JUDAS ERA"},
        {"id": "judas-web-vite", "url": "https://belentani7.github.io/belentani-judas-web/", "role": "os-web", "lore": "Creative OS"},
        {"id": "fullstack-20", "url": "https://belentani7.github.io/BELENTANI-JUDAS-ERA-FULLSTACK/", "role": "canon-mundos", "lore": "20 mundos visuales"},
        {"id": "3d-portfolio", "url": "https://belentani7.github.io/3d-portfolio/", "role": "portfolio", "lore": "cara profesional 3D"},
        {"id": "base44", "url": "https://belentani.base44.app", "role": "spa-externa", "lore": "ecosistema multimedia"},
        {"id": "belentani-es", "url": "https://belentani.es/", "role": "dominio-artistico", "lore": "universo artístico"},
        {"id": "belentani-eu", "url": "https://belentani.eu/", "role": "dominio-profesional", "lore": "perfil profesional (fuera del lore)"},
    ]


def lore_spine() -> dict:
    """El eje: la web se une alrededor del lore, no del CV ni del catálogo solo."""
    return {
        "principio": "LORE primero. Música, 3D y herramientas sirven al mito.",
        "arcos": [
            {"id": "invitacion", "titulo": "La Invitación", "estacion": "Ascensor / sexto piso"},
            {"id": "exceso", "titulo": "El Exceso", "estacion": "Pábilo / vela / polilla"},
            {"id": "traicion", "titulo": "La Traición", "estacion": "El beso · Pedro / Judas"},
            {"id": "deuda", "titulo": "La Deuda", "estacion": "Agua, sal, llave, moneda"},
            {"id": "redencion", "titulo": "La Redención", "estacion": "Estática / horizonte"},
        ],
        "gemas": ["Pedro·Roca", "Marcos·Cronista", "Santos·Antena", "Belentani·Artefacto", "TheHuman·Interfaz"],
        "firma": "432 Hz · Red Glass · JUDAS_OS",
        "como_unir": [
            "1. Un solo shell (index) con rutas lore: /lore, /mundos, /escucha, /archivo",
            "2. Cada página externa entra como MUNDO con id + blurb lore + uplink, no como lista de repos",
            "3. Ciclona = banco de efectos: se importan piezas (shader/partículas), no se enlazan demos crudas",
            "4. espacio-3d/assets = texturas/arte del canon visual",
            "5. Disco G: (Google Drive) = origen de packs; copiar solo lo canónico al shell local",
            "6. belentani.eu / CV / income = fuera del shell lore (atelier)",
        ],
    }


def write_md(payload: dict) -> str:
    lines = [
        f"# Banco de recursos galácticos — {payload['generated_at']}",
        "",
        "## Principio",
        payload["lore"]["principio"],
        "",
        "## Cómo unir (arquitectura)",
    ]
    lines.extend(f"- {s}" for s in payload["lore"]["como_unir"])
    lines += ["", "## Demos Ciclona (efectos)", ""]
    for p in payload["ciclona_projects"]:
        tech = ", ".join(p["tech"]) or "—"
        lines.append(f"- `{p['id']}` — {p['desc'] or '(sin README)'} · tech: {tech}")
    lines += ["", "## Páginas a unificar", ""]
    for p in payload["pages"]:
        lines.append(f"- **{p['id']}** [{p['role']}] — {p['lore']} — `{p['url']}`")
    by_kind = payload["stats"]["by_kind"]
    lines += ["", "## Archivos indexados", ""]
    for k, n in sorted(by_kind.items(), key=lambda x: -x[1]):
        lines.append(f"- {k}: {n}")
    lines.append(f"- total: {payload['stats']['total_files']}")
    return "\n".join(lines) + "\n"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    files: list[dict] = []
    for d in SCAN_DIRS:
        files.extend(walk_bank(d))
    by_kind: dict[str, int] = {}
    for r in files:
        by_kind[r["kind"]] = by_kind.get(r["kind"], 0) + 1
    payload = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "root": str(ROOT),
        "lore": lore_spine(),
        "ciclona_projects": ciclona_projects(),
        "pages": pages_map(),
        "stats": {"total_files": len(files), "by_kind": by_kind},
        "files": files,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    OUT_MD.write_text(write_md(payload), encoding="utf-8")
    print("OK", OUT_JSON)
    print("OK", OUT_MD)
    print("stats", by_kind)
    print("ciclona demos", len(payload["ciclona_projects"]))
    print("pages", len(payload["pages"]))


if __name__ == "__main__":
    main()
