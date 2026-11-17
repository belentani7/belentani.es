/* BELENTANI OS — navigation shell and low-cost procedural alloy.
   No images, textures, libraries, tracking or network calls. */
(()=>{
 'use strict';
 const zones={
  home:{n:'01',label:'INICIO',heading:'Tu punto de origen.',text:'Cada obra tiene una coordenada. Entra por una unidad del ordenador o elige una de estas puertas principales.'},
  music:{n:'02',label:'MÚSICA',heading:'El disco guarda la voz.',text:'Canciones, partituras de una vida y los laboratorios donde el sonido encuentra su forma.'},
  world:{n:'03',label:'MUNDOS',heading:'Todo tiene un universo.',text:'JUDAS, OMEGA, portales, narrativas y experiencias. Mundos distintos dentro de una misma obra.'},
  visual:{n:'04',label:'VISUAL',heading:'La materia de la mirada.',text:'Galerías, esculturas de luz, cristal y experiencias visuales vinculadas al artista.'},
  studio:{n:'05',label:'ESTUDIO',heading:'El lugar donde se crea.',text:'Instrumentos, experimentos y sistemas de producción musical y visual.'},
  archive:{n:'06',label:'ARCHIVO',heading:'Nada se pierde aquí.',text:'Versiones, ediciones, prototipos e historia. El archivo preserva el recorrido sin confundirlo con la portada.'}
 };
 const catalog=window.BELENTANI_CATALOG||{items:[],total:0,stats:{}};
 const items=Array.isArray(catalog.items)?catalog.items:[];
 const $=id=>document.getElementById(id);
 const path=$('screen-path'), heading=$('panel-heading'),desc=$('panel-description'),pid=$('panel-id'),list=$('item-list'),results=$('result-label'),counts=$('count-label'),status=$('status-text'),summary=$('catalog-summary'),search=$('search'),filter=$('red-filter'),more=$('load-more'),power=$('power');
 const state={zone:'home',query:'',red:false,limit:11,on:true};
 const escapeTag=t=>String(t||'').replace(/\s+/g,' ').slice(0,110);
 const cleanZone=()=>{const s=location.hash.replace(/^#\/?/,'').toLowerCase();return zones[s]?s:'home'};
 function selectZone(zone,updateHash=true){
  if(!zones[zone])return;
  state.zone=zone;state.query='';state.red=false;state.limit=11;
  search.value='';filter.setAttribute('aria-pressed','false');
  if(!state.on){state.on=true;document.getElementById('monitor').classList.remove('is-off');power.setAttribute('aria-pressed','true');power.setAttribute('aria-label','Apagar pantalla')}
  if(updateHash&&location.hash!=='#'+zone)location.hash=zone;
  render();
 }
 function entryWeight(x){
  let s=x.kind==='page'?0:x.kind==='drive'?8:13;
  if(x.repo==='belentani-Omega')s-=2;
  if(x.repo==='belentani-webs-historicas')s-=1;
  if(x.path==='index.html')s-=10;
  if(x.path.startsWith('ediciones/'))s+=8;
  if(x.red)s-=1;
  return s;
 }
 function homeEntries(){
  const chosen=[],used=new Set();
  for(const z of ['home','music','world','visual','studio','archive']){
   const arr=items.filter(x=>x.zone===z).sort((a,b)=>entryWeight(a)-entryWeight(b)||a.title.localeCompare(b.title));
   for(const v of arr.slice(0,z==='world'?3:2)){if(!used.has(v.id)){chosen.push(v);used.add(v.id)}}
  }
  return chosen;
 }
 function getEntries(){
  const q=state.query.trim().toLocaleLowerCase('es');
  let values=q?items.filter(x=>[x.title,x.path,x.repo,x.zone,x.collection].some(v=>String(v||'').toLocaleLowerCase('es').includes(q))):state.zone==='home'?homeEntries():items.filter(x=>x.zone===state.zone);
  if(state.red)values=values.filter(x=>x.red);
  if(!q&&state.zone!=='home')values.sort((a,b)=>entryWeight(a)-entryWeight(b)||a.title.localeCompare(b.title,'es'));
  else if(q)values.sort((a,b)=>entryWeight(a)-entryWeight(b)||a.title.localeCompare(b.title,'es'));
  return values;
 }
 function makeEntry(x){
  const anchor=document.createElement('a');anchor.className='entry';anchor.href=x.href;
  if(x.kind!=='page'){anchor.target='_blank';anchor.rel='noopener noreferrer'}
  anchor.title=x.kind==='page'?'Abrir página del sitio':x.kind==='drive'?'Abrir archivo de Drive':'Ver archivo en el repositorio GitHub';
  const left=document.createElement('span'),right=document.createElement('span');
  left.style.minWidth='0';
  const name=document.createElement('span');name.className='entry-title';name.textContent=escapeTag(x.title);
  const meta=document.createElement('span');meta.className='entry-meta';meta.textContent=x.repo+' / '+x.path+(x.red?' / RUBY':'');
  left.append(name,meta);
  right.className='entry-tag';
  const tag=document.createElement('span');tag.textContent=x.kind==='page'?'PÁGINA':x.kind==='drive'?'DRIVE':'GITHUB';
  const arrow=document.createElement('span');arrow.className='entry-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent=x.kind==='page'?'↗':'↗';
  right.append(tag,arrow);anchor.append(left,right);
  anchor.addEventListener('click',()=>{
    try{sessionStorage.setItem('belentani.os.last',JSON.stringify({id:x.id,zone:state.zone,title:x.title}))}catch{}
    status.textContent='ABRIENDO / '+x.title.toUpperCase().slice(0,45);
  });
  return anchor;
 }
 function render(){
  const z=zones[state.zone];document.querySelectorAll('[data-zone]').forEach(b=>{
    const active=b.dataset.zone===state.zone;b.classList.toggle('is-active',active);
    if(b.matches('.folder')){b.setAttribute('aria-current',active?'page':'false');b.setAttribute('aria-pressed',String(active))}
  });
  path.textContent='B:\\UNIVERSE\\'+(state.query?'SEARCH':z.label.normalize('NFD').replace(/[\u0300-\u036f]/g,'')).toUpperCase();
  pid.textContent='DIRECTORIO / '+z.n+(state.query?' / GLOBAL SEARCH':'');
  heading.textContent=state.query?'Buscar en todo el universo.':z.heading;
  desc.textContent=state.query?'Resultados en páginas del sitio principal, repositorios conectados y archivos identificados de Drive.':z.text;
  const matches=getEntries(),visible=matches.slice(0,state.limit);
  results.textContent=state.query?'BÚSQUEDA GLOBAL':state.zone==='home'?'PRIMERAS PUERTAS / SELECCIÓN':'CONTENIDO / '+z.label;
  counts.textContent=matches.length+' ENTRADAS';
  list.replaceChildren();
  if(visible.length===0){const el=document.createElement('p');el.className='empty';el.textContent='No hay archivos para esta combinación. Prueba otra palabra o desactiva «Solo rojos».';list.append(el)}
  else{const fragment=document.createDocumentFragment();for(const x of visible)fragment.append(makeEntry(x));list.append(fragment)}
  more.hidden=matches.length<=state.limit;
  more.textContent='VER MÁS ARCHIVOS  ↓  ('+(matches.length-state.limit)+' RESTANTES)';
  const mode=state.query?'INDEX / SEARCH':z.label+' / '+matches.length+' ENTRADAS';
  status.textContent='BELENTANI OS / '+mode;
  summary.textContent=(catalog.total||items.length)+' ENTRADAS · '+items.filter(x=>x.kind==='page').length+' PÁGINAS LOCALES · GITHUB · DRIVE';
 }
 document.querySelectorAll('button[data-zone]').forEach(button=>button.addEventListener('click',()=>selectZone(button.dataset.zone)));
 window.addEventListener('hashchange',()=>selectZone(cleanZone(),false));
 search.addEventListener('input',()=>{state.query=search.value.trim();state.limit=11;render()});
 filter.addEventListener('click',()=>{state.red=!state.red;state.limit=11;filter.setAttribute('aria-pressed',String(state.red));render()});
 more.addEventListener('click',()=>{state.limit+=18;render()});
 power.addEventListener('click',()=>{
   state.on=!state.on;document.getElementById('monitor').classList.toggle('is-off',!state.on);
   power.setAttribute('aria-pressed',String(state.on));power.setAttribute('aria-label',state.on?'Apagar pantalla':'Encender pantalla');
   document.getElementById('screen-off').setAttribute('aria-hidden',String(state.on));
   if(state.on)render();
 });
 const help=$('help-dialog');$('help-button').addEventListener('click',()=>help.showModal());
 document.addEventListener('keydown',e=>{
   if(e.key==='Escape'&&help.open)return;
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(!state.on)power.click();search.focus();search.select();return}
   if(e.key==='Escape'&&document.activeElement===search){search.value='';state.query='';render();search.blur();return}
   if(e.target instanceof HTMLElement&&e.target.closest('input,textarea,[contenteditable]'))return;
   if(!e.altKey&&!e.ctrlKey&&!e.metaKey&&/^[1-6]$/.test(e.key)){selectZone(Object.keys(zones)[Number(e.key)-1]);}
 });
 const last=(()=>{try{return JSON.parse(sessionStorage.getItem('belentani.os.last')||'null')}catch{return null}})();
 if(last&&last.zone&&zones[last.zone]&&!location.hash)state.zone=last.zone;
 else state.zone=cleanZone();
 render();

 // Procedural chrome accent in a tiny panel. CPU/GPU economy: max 28fps, DPR capped.
 const canvas=$('alloy'),prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let gl=null,prog=null,raf=0,prev=0,frames=0,resumeDraw=null;
 try{gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,premultipliedAlpha:false,powerPreference:'low-power'})}catch{}
 if(gl){
  const vertex='attribute vec2 p; void main(){gl_Position=vec4(p,0.0,1.0);}';
  const fragment=[
   'precision mediump float; uniform vec2 resolution; uniform float tm;',
   'void main(){',
   ' vec2 uv=(gl_FragCoord.xy/resolution-0.5)*vec2(2.0,2.6);',
   ' float r=length(uv); float a=atan(uv.y,uv.x);',
   ' float shell=abs(r-(0.55+0.085*sin(3.0*a+tm*0.38)))-0.15;',
   ' float m=1.0-smoothstep(0.04,0.16,shell);',
   ' float flow=sin(14.0*a-9.0*r+tm*0.26)*0.5+0.5;',
   ' float streak=pow(max(0.0,sin(a*2.5+0.6+tm*0.19)),18.0);',
   ' float cut=pow(max(0.0,sin(a*5.5-r*5.5-0.2)),18.0);',
   ' vec3 dark=vec3(0.035,0.006,0.023);',
   ' vec3 red=vec3(0.45,0.023,0.116)+vec3(0.29,0.11,0.115)*flow;',
   ' vec3 col=mix(dark,red,0.72+0.18*flow)+vec3(0.68,0.38,0.42)*streak+vec3(0.22,0.028,0.065)*cut;',
   ' float glow=0.09*exp(-5.0*shell*shell);',
   ' gl_FragColor=vec4(col*m+vec3(0.25,0.009,0.04)*glow,clamp(m*0.94+glow,0.0,1.0));',
   '}'
  ].join('\n');
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
  try{
   prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(prog);
   if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));
   gl.useProgram(prog);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
   const loc=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
   const rez=gl.getUniformLocation(prog,'resolution'),ut=gl.getUniformLocation(prog,'tm');
   const draw=ms=>{
    if(document.visibilityState!=='visible'){raf=requestAnimationFrame(draw);return}
    if(ms-prev<35&&!prefersReduced){raf=requestAnimationFrame(draw);return}
    prev=ms;const rect=canvas.getBoundingClientRect();const scale=Math.min(devicePixelRatio||1,1.2);
    const w=Math.min(320,Math.max(2,Math.floor(rect.width*scale))),h=Math.min(470,Math.max(2,Math.floor(rect.height*scale)));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
    gl.viewport(0,0,w,h);gl.uniform2f(rez,w,h);gl.uniform1f(ut,prefersReduced?0:ms*.001);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,6);frames++;
    if(!prefersReduced)raf=requestAnimationFrame(draw);
   };
   resumeDraw=draw;raf=requestAnimationFrame(draw);
  }catch(err){canvas.style.display='none';console.warn('Chrome renderer disabled:',err.message)}
 }else canvas.style.display='none';
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){cancelAnimationFrame(raf)}else if(gl&&prog&&!prefersReduced)raf=requestAnimationFrame(resumeDraw)});
 // Material highlights follow pointer, without faking an image texture.
 const chromeHeading=document.querySelector('.chrome-title');
 document.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch')return;
  const x=e.clientX/Math.max(1,innerWidth),y=e.clientY/Math.max(1,innerHeight);
  document.documentElement.style.setProperty('--mx',(x*100).toFixed(1)+'%');
  document.documentElement.style.setProperty('--my',(y*100).toFixed(1)+'%');
  if(chromeHeading)chromeHeading.style.backgroundPosition=(x*55).toFixed(0)+'% '+(20+y*52).toFixed(0)+'%';
 },{passive:true});
})();
