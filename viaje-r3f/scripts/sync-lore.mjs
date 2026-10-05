// Fuente única del lore: viaje-r3f/public/universo-lore.js.
// Vite ya la copia a viaje3d/; aquí se replica a la raíz del sitio para que no derive.
import { copyFileSync, readFileSync } from "node:fs";
const src = new URL("../public/universo-lore.js", import.meta.url);
const dst = new URL("../../app-web-nextjs/belentani7.github.io/universo-lore.js", import.meta.url);
copyFileSync(src, dst);
if (!readFileSync(src).equals(readFileSync(dst))) throw new Error("sync-lore: copia distinta");
console.log("sync-lore: universo-lore.js sincronizado");
