"""Bounded metadata inventory. Never reads credentials, legal cases or audio."""
import csv
import json
import os
from pathlib import Path
import subprocess

home = Path.home()
output = home / '_bucket_descartes' / '2026-10-06_belentani_rotation' / '_MANIFESTS'
output.mkdir(parents=True, exist_ok=True)
excluded = {'node_modules', '.next', 'AppData', '.git', '_bucket_descartes', '.codex', '.agents', '.openclaw', '.cache', '.local', 'Music', 'Pictures', 'Videos'}
repos = []
def scan(folder, depth=0):
    if depth > 5:
        return
    try:
        for item in folder.iterdir():
            if not item.is_dir() or item.is_symlink() or item.name in excluded or item.name.startswith('.') or any(word in item.name.upper() for word in ['DEUDAFIX', 'CASO_', 'GMAIL_']):
                continue
            if (item / '.git').exists():
                repos.append({'path': str(item), 'name': item.name, 'worktree': (item / '.git').is_file()})
                continue
            scan(item, depth + 1)
    except (OSError, PermissionError):
        pass
scan(home)
for repo in repos:
    try:
        result = subprocess.run(['git', '-C', repo['path'], 'status', '--porcelain', '-uno'], capture_output=True, text=True, timeout=15)
        repo['dirty_tracked'] = bool(result.stdout.strip())
        repo['status_readable'] = result.returncode == 0
    except (OSError, subprocess.TimeoutExpired):
        repo['status_readable'] = False
(output / 'local-repos.json').write_text(json.dumps(repos, ensure_ascii=False, indent=2), encoding='utf-8')
try:
    result = subprocess.run(['gh', 'repo', 'list', 'belentani7', '--limit', '1000', '--json', 'name,url,isArchived,isPrivate,pushedAt,diskUsage,description'], capture_output=True, text=True, encoding='utf-8', timeout=180)
    if result.returncode == 0:
        remote = json.loads(result.stdout)
        (output / 'remote-repos.json').write_text(json.dumps(remote, ensure_ascii=False, indent=2), encoding='utf-8')
        print('Remote repositories:', len(remote))
    else:
        print('Remote inventory unavailable:', result.returncode)
except subprocess.TimeoutExpired:
    print('Remote inventory timed out')
drive = Path('G:/Mi unidad')
if drive.exists():
    entries = [{'name': item.name, 'directory': item.is_dir()} for item in drive.iterdir() if any(word in item.name.lower() for word in ['belentani', 'judas', 'galax', 'noiacore', 'respaldo', 'backup'])]
    (output / 'drive-candidates.json').write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding='utf-8')
print('Local repositories:', len(repos))
print('Inventory:', output)
