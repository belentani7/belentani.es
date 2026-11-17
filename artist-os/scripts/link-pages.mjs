// Reversible navigation integration for the 16 first-party artistic HTML pages.
// node scripts/link-pages.mjs --dry-run | --apply | --undo
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const site=path.resolve(here,'../..');
const workspace=path.resolve(site,'..');
const backupRoot=path.join(workspace,'_SNAPSHOTS','BELENTANI_OS_20261117','belentani.es');
const mode=process.argv.includes('--apply')?'apply':process.argv.includes('--undo')?'undo':'dry-run';
const catalog=JSON.parse(fs.readFileSync(path.join(site,'artist-os','catalog.json'),'utf8'));
let changed=0,skipped=0,errors=0;
for(const item of catalog.items.filter(x=>x.kind==='page'&&x.repo==='belentani.es')){
 const relative=item.path;
 // Catalog entries are data: accept only safe, relative first-party HTML paths.
 if(!/^[a-zA-Z0-9_.\/-]+$/.test(relative)||relative.split('/').some(s=>s==='.'||s==='..')){errors++;continue}
 const file=path.resolve(site,...relative.split('/'));
 if(!file.startsWith(site+path.sep)){errors++;continue}
 const backup=path.join(backupRoot,...relative.split('/'));
 const marker='data-belentani-os="ruby-v1"';
 const source=fs.readFileSync(file,'utf8');
 const link=path.relative(path.dirname(file),path.join(site,'artist-os','bridge.js')).replaceAll('\\','/');
 // Only the exact bridge asset can become a script URL; no quoted HTML attributes.
 if(!/^(?:\.\.\/)*artist-os\/bridge\.js$/.test(link)){errors++;continue}
 const theme=item.zone==='archive'?'nav':'ruby';
 const injection='<script '+marker+' data-belentani-os-theme="'+theme+'" src="'+link+'" defer></script>';
 if(mode==='undo'){
  if(!source.includes(marker)||!fs.existsSync(backup)){skipped++;continue}
  const original=fs.readFileSync(backup,'utf8');
  const originalBodyEnd=original.toLowerCase().lastIndexOf('</body>');
  if(originalBodyEnd<0){errors++;continue}
  const expected=original.slice(0,originalBodyEnd)+'\n'+injection+'\n'+original.slice(originalBodyEnd);
  if(source!==expected){console.log('SKIP: changed since integration:',relative);skipped++;continue}
  fs.writeFileSync(file,original,'utf8');changed++;continue;
 }
 if(source.includes(marker)){skipped++;continue}
 const bodyEnd=source.toLowerCase().lastIndexOf('</body>');
 if(bodyEnd<0){errors++;console.log('SKIP: no </body>:',relative);continue}
 if(mode==='apply'){
  fs.mkdirSync(path.dirname(backup),{recursive:true});
  if(!fs.existsSync(backup))fs.copyFileSync(file,backup);
  const edited=source.slice(0,bodyEnd)+'\n'+injection+'\n'+source.slice(bodyEnd);
  fs.writeFileSync(file,edited,'utf8');
 }
 console.log((mode==='apply'?'LINK ':'WOULD LINK ')+relative+' -> '+link);
 changed++;
}
console.log('MODE',mode,'MATCHED',changed,'SKIPPED',skipped,'ERRORS',errors);
