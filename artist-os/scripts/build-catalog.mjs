// BELENTANI OS public catalog builder — first-party published pages ONLY.
// Private repo/Drive inventory is kept OUTSIDE this repository.
// Run: node artist-os/scripts/build-catalog.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const out=path.resolve(here,'..');
const allow=[
 'legacy-home.html',
 'institucion/experiencia/belentani-judas-era-export.html',
 'institucion/experiencia/belentani-judas-era-omega.html',
 'institucion/experiencia/belentani-judas-escape-mobile.html',
 'institucion/experiencia/belentani-judas-evolved.html',
 'institucion/experiencia/belentani-judas-experience.html',
 'institucion/experiencia/belentani-judas-monograph.html',
 'institucion/experiencia/belentani-judas-web.html',
 'institucion/experiencia/belentani-omega-core.html',
 'institucion/experiencia/belentani-omega-immersive-portal.html',
 'institucion/experiencia/belentani-omega-live.html',
 'institucion/experiencia/belentani-omega-master.html',
 'institucion/experiencia/belentani-omega-showcase.html',
 'institucion/experiencia/belentani-omega.html'
];
const items=[];
const hashes=new Set();
for(const p of allow){
 const filename=path.resolve(root,...p.split('/'));
 if(!filename.startsWith(root+path.sep))throw Error('Unsafe catalog path: '+p);
 if(!fs.existsSync(filename))throw Error('Missing first-party route: '+p);
 const source=fs.readFileSync(filename,'utf8');
 const hash=crypto.createHash('sha256').update(source).digest('hex');
 if(hashes.has(hash))continue;hashes.add(hash);
 const m=source.match(/<title[^>]*>([\s\S]{0,220}?)<\/title>/i);
 let title=m?m[1].replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&mdash;/g,'—').trim():'';
 if(!title)title=path.basename(p,'.html').replace(/[-_]/g,' ');
 const zone=p==='legacy-home.html'?'archive':/judas|omega/i.test(p)?'world':'home';
 const red=/#(?:ff073a|ff0033|ff1a4a|8c0119|9f0c29)|ruby|cromo|ne[oó]n rojo/i.test(source.slice(0,120000))?1:0;
 items.push({id:'belentani.es/'+p,title:title.slice(0,110),zone,kind:'page',href:'../'+p,repo:'belentani.es',path:p,red});
}
items.sort((a,b)=>a.zone.localeCompare(b.zone,'es')||a.title.localeCompare(b.title,'es'));
const catalog={generated:'2026-11-17',source:'First-party approved HTML pages only',stats:{'belentani.es':{items:items.length}},total:items.length,items};
fs.writeFileSync(path.join(out,'catalog.js'),'window.BELENTANI_CATALOG='+JSON.stringify(catalog)+';\n','utf8');
fs.writeFileSync(path.join(out,'catalog.json'),JSON.stringify(catalog,null,2)+'\n','utf8');
console.log('PUBLIC APPROVED CATALOG',items.length,'items; no private remote references');
