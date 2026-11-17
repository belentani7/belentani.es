// Verify that the BELENTANI OS public catalog references only existing public HTML.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const cat=JSON.parse(fs.readFileSync(path.join(root,'artist-os','catalog.json'),'utf8'));
assert(Array.isArray(cat.items));
assert.equal(cat.total,cat.items.length);
const seen=new Set();const counts={ruby:0,nav:0};
const siteBase=new URL('https://www.belentani.es/artist-os/');
for(const entry of cat.items){
 assert.equal(entry.kind,'page','Only public HTML pages are permitted');
 assert.equal(entry.repo,'belentani.es','No external repos allowed');
 assert(entry.href.startsWith('../')&&!/^..\/\//.test(entry.href),'Only first-party relative links allowed');
 const target=new URL(entry.href,siteBase);
 assert.equal(target.origin,siteBase.origin,'External destination forbidden');
 assert.equal(target.pathname,'/'+entry.path.split('/').map(encodeURIComponent).join('/'),'Unexpected URL destination');
 assert(!seen.has(entry.id),'Duplicated index ID');seen.add(entry.id);
 const file=path.resolve(root,...entry.path.split('/'));
 assert(file.startsWith(root+path.sep),'Traversal attempt: '+entry.path);
 assert(fs.existsSync(file),'Missing HTML: '+entry.path);
 const raw=fs.readFileSync(file,'utf8');
 assert(raw.includes('data-belentani-os="ruby-v1"'),'Missing return navigation: '+entry.path);
 if(raw.includes('data-belentani-os-theme="nav"'))counts.nav++;
 else counts.ruby++;
}
assert(!cat.items.some(x=>x.path==='index.html'||x.path==='artist-os/index.html'),'Self navigation forbidden');
const src=fs.readFileSync(path.join(root,'artist-os','scripts','build-catalog.mjs'),'utf8');
assert(src.includes("execFileSync('git'")&&src.includes("'ls-files'"),'Public catalog must be generated from tracked Git files');
console.log('PUBLIC_OS_VERIFIED',cat.total,'RUBY',counts.ruby,'NAV_ONLY',counts.nav);
