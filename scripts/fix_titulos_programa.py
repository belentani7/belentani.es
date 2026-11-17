# -*- coding: utf-8 -*-
"""Arregla las fichas de programa: h1 visible, meta description y og:description.

- h1: slug ASCII feo -> titulo legible (guiones/underscores -> espacios, mayuscula inicial,
  caso especial "Compa ero" -> "Compañero").
- description/og: derivadas del h1 legible, con contexto real del Instituto.

Idempotente: si el h1 ya es legible y la description ya contiene "ecosistema Belentani", no toca.
Uso: python fix_titulos_programa.py
"""
import glob
import os
import re

SPECIAL = {"compa ero": "Compañero"}


def nice(base):
    base = base.replace("_", " ").replace("-", " ")
    base = " ".join(base.split())
    low = base.lower()
    for k, v in SPECIAL.items():
        if low.startswith(k):
            base = v + base[len(k):]
            break
    if not base:
        return base
    return base[0].upper() + base[1:]


def needs_fix(h1):
    # feo si contiene guion o underscore o todo minusculas
    return ("-" in h1) or ("_" in h1) or h1.islower()


def main():
    files = sorted(glob.glob("*.html"), key=lambda f: -os.path.getsize(f))[:17]
    changed = 0
    for f in files:
        html = open(f, encoding="utf-8").read()
        h1m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
        if not h1m:
            print("SIN-H1", f)
            continue
        h1 = h1m.group(1).strip()
        if not needs_fix(h1):
            # h1 ya legible; solo asegurar description si falta
            nice_h1 = h1
            if "ecosistema Belentani" in html and re.search(r'<meta name="description" content="[^"]*Belentani', html):
                print("SKIP", f)
                continue
        else:
            nice_h1 = nice(h1)
        desc = nice_h1 + " — programa del ecosistema Belentani. Instituto Belentani, Centro de Estudios Abiertos (REA)."

        new_html = html
        # h1 (con posibles atributos en la etiqueta)
        new_html = re.sub(
            r"(<h1[^>]*>).*?(</h1>)",
            lambda m: m.group(1) + nice_h1 + m.group(2),
            new_html,
            count=1,
            flags=re.S,
        )
        # meta description
        new_html = re.sub(
            r'(<meta name="description" content=")[^"]*(")',
            lambda m: m.group(1) + desc + m.group(2),
            new_html,
            count=1,
        )
        # og:description
        new_html = re.sub(
            r'(<meta property="og:description" content=")[^"]*(")',
            lambda m: m.group(1) + desc + m.group(2),
            new_html,
            count=1,
        )

        if new_html != html:
            open(f, "w", encoding="utf-8", newline="\n").write(new_html)
            changed += 1
            print("FIX", f, "->", nice_h1)
        else:
            print("SKIP", f)
    print("MODIFICADOS:", changed)


if __name__ == "__main__":
    main()
