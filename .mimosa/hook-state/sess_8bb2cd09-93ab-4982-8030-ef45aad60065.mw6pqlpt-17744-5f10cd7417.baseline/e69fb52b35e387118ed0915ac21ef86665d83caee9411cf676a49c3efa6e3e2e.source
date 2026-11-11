"""Create a local source-only archive, excluding private data and dependencies."""
from pathlib import Path
import json
import zipfile

root = Path.cwd()
bucket = root.parent.parent / '_bucket_descartes' / '2026-10-06_belentani_rotation'
target = bucket / 'Belentani-galaxias-fuentes.zip'
excluded = {'node_modules', '.git', '.next', 'dist', 'build', 'audio', 'masters', '_private_audio_no_web'}
allowed = {'.html', '.js', '.jsx', '.ts', '.tsx', '.css', '.glsl', '.vert', '.frag', '.md', '.json'}
files = []
with zipfile.ZipFile(target, 'x', compression=zipfile.ZIP_DEFLATED) as archive:
    for folder in ['unificado', 'viaje-r3f', 'espacio-3d', 'src/components/canvas', 'src/components/eras']:
        base = root / folder
        if not base.exists():
            continue
        for file in base.rglob('*'):
            if not file.is_file() or any(part in excluded for part in file.relative_to(root).parts):
                continue
            if file.suffix.lower() not in allowed or file.name.startswith('.env'):
                continue
            relative = str(file.relative_to(root)).replace('\\', '/')
            archive.write(file, relative)
            files.append(relative)
    archive.writestr('SOURCE_MANIFEST.json', json.dumps(files, indent=2))
print('Source archive:', target)
print('Files:', len(files))
