// BELENTANI OS — public, first-party-only navigation catalog.
// Includes only HTML already tracked in the PUBLIC belentani.es Git repository.
// Run: node artist-os/scripts/build-catalog.mjs (local Git working copy).
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../..');
const out=path.resolve(dir,'..');
const tracked=execFileSync('git',['ls-files','--','*.html'],{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024}).split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
function zone(p){
 const s=p.toLowerCase();
 if(s==='legacy-home.html')return 'home';
 if(/^institucion\/experiencia\/belentani-(?:judas|omega)/.test(s)||/^public\/omega-living\.html$/.test(s))return 'world';
 if(/^institucion\/institucion\/arte-musica\.html$/.test(s))return 'music';
 if(/^_universo_assets\/(?:three-galaxy|prueba)\.html$/.test(s))return 'visual';
 if(/(?:studio|compositor|sonic|music-lab|producer|sfx|shader)/.test(s)&&!s.startsWith('institucion/lecciones/'))return 'studio';
 if(/(?:gallery|galeria|bosque|cristal|visual|fotograf|video)/.test(s)&&!s.startsWith('institucion/lecciones/'))return 'visual';
 if(/\/(?:lecciones|campus|institucional|programa|institucion)\//.test(s)||/(?:docs|privacidad|privacy|accesibilidad|accessibility|404|aviso-legal|ampliacion)/.test(s))return 'archive';
 if(/(?:judas|omega|universe|universo|experience|experiencia|cosmos)/.test(s))return 'world';
 return 'archive';
}
const featured=new Set(['legacy-home.html','institucion/experiencia/belentani-judas-experience.html','institucion/experiencia/belentani-omega.html','public/omega-living.html','_universo_assets/three-galaxy.html']);
const items=[];
for(const p of tracked){
 if(p==='index.html'||p==='artist-os/index.html'||p.startsWith('artist-os/private')||p.startsWith('artist-os/all-html'))continue;
 const full=path.resolve(root,...p.split('/'));
 if(!full.startsWith(root+path.sep)||!fs.existsSync(full))continue;
 const source=fs.readFileSync(full,'utf8');
 const match=source.match(/<title[^>]*>([\s\S]{0,230}?)<\/title>/i);
 let title=match?match[1].replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&mdash;/g,'—').replace(/\s+/g,' ').trim():'';
 if(!title)title=path.basename(p,'.html').replace(/[-_]+/g,' ');
 const red=/#(?:ff073a|ff0033|ff1a4a|8c0119|e11d48|f43f5e)\b|chrome red|rub[yí]|cromo rojo|ne[oó]n rojo/i.test(source.slice(0,180000));
 items.push({id:'belentani.es/'+p,title:title.slice(0,115),zone:zone(p),kind:'page',href:'../'+p.split('/').map(encodeURIComponent).join('/'),repo:'belentani.es',path:p,red:red?1:0,featured:featured.has(p)});
}
const order={home:0,music:1,world:2,visual:3,studio:4,archive:5};
items.sort((a,b)=>(order[a.zone]??9)-(order[b.zone]??9)||Number(b.featured)-Number(a.featured)||a.title.localeCompare(b.title,'es'));
const catalog={generated:'2026-11-17',source:'Existing tracked public HTML in belentani.es',stats:{'belentani.es':{items:items.length}},total:items.length,items};
fs.writeFileSync(path.join(out,'catalog.js'),'window.BELENTANI_CATALOG='+JSON.stringify(catalog)+';\n','utf8');
fs.writeFileSync(path.join(out,'catalog.json'),JSON.stringify(catalog,null,2)+'\n','utf8');
console.log('PUBLIC_CATALOG',items.length,'APPROVED_PUBLIC_REPO_ONLY');
console.log('PUBLIC_ZONES',JSON.stringify(items.reduce((a,x)=>(a[x.zone]=(a[x.zone]||0)+1,a),{})));
