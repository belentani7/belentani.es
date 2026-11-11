from pathlib import Path
import re

p = Path(r"C:\Users\USER\Desktop\belentani.es\unificado\index.html")
t = p.read_text(encoding="utf-8")
m = re.search(r"<script>\s*\(function\(\)\s*\{(.*?)\}\)\(\);\s*</script>\s*</body>", t, re.S)
print("script_found", bool(m))
if not m:
    raise SystemExit(1)
s = m.group(1)
print("brace_delta", s.count("{") - s.count("}"))
print("paren_delta", s.count("(") - s.count(")"))
print("dup_canvas", s.count("getElementById('universe-canvas')"))
print("dup_animateCursor", s.count("function animateCursor"))
print("webGLAvailable", "webGLAvailable" in s)
print("contact", "contact@belentani.es" in t)
print("nav_logo", t.count("class=\"nav-logo\""))
# write script to temp for node check
Path(r"C:\Users\USER\Desktop\belentani.es\unificado\_check.js").write_text(
    "(function(){\n" + s + "\n})();\n", encoding="utf-8"
)
print("wrote _check.js", len(s))
