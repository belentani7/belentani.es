/* BELENTANI OS bridge: shared chrome navigation isolated in a Shadow DOM. */
(()=>{
'use strict';
const own=document.currentScript&&document.currentScript.src;
if(!own)return;
const home=new URL('./index.html',own);
if(location.pathname.endsWith('/artist-os/index.html')||document.getElementById('belentani-os-access'))return;
const materialEnabled=(document.currentScript?.getAttribute('data-belentani-os-theme')??'ruby')!=='nav';
if(materialEnabled){
// The same material travels with the visitor: browser-native ruby metal, not imagery.
document.documentElement.setAttribute('data-belentani-os-skin','ruby-v1');
const material=document.createElement('link');
material.rel='stylesheet';material.href=new URL('./material.css',own).href;
material.setAttribute('data-belentani-os-material','ruby-v1');document.head.append(material);
const veil=document.createElement('div');veil.id='belentani-ruby-material';veil.setAttribute('aria-hidden','true');document.body.append(veil);
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 let next=0;document.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'||performance.now()-next<90)return;next=performance.now();
  document.documentElement.style.setProperty('--bel-ruby-pointer-x',Math.round(e.clientX/Math.max(1,innerWidth)*100)+'%');
  document.documentElement.style.setProperty('--bel-ruby-pointer-y',Math.round(e.clientY/Math.max(1,innerHeight)*100)+'%');
 },{passive:true});
}
}
const host=document.createElement('div');host.id='belentani-os-access';
const shadow=host.attachShadow({mode:'open'});
const style=document.createElement('style');
style.textContent=[
':host{all:initial;position:fixed;right:clamp(11px,2vw,26px);bottom:clamp(11px,2vw,25px);z-index:2147483000;font-family:Consolas,"Segoe UI",monospace;line-height:1.35}',
'button,a{box-sizing:border-box;font-family:inherit}button{cursor:pointer}',
'.trigger{border:1px solid #d95d83;border-radius:13px;display:flex;align-items:center;gap:9px;padding:10px 14px;color:#ffd6e0;font-size:11px;letter-spacing:.11em;background:repeating-linear-gradient(107deg,rgba(255,211,219,.04) 0 1px,transparent 1px 7px),linear-gradient(150deg,#a13659 0%,#381022 31%,#0e060e 60%,#85284d 84%,#1c0915);box-shadow:inset 0 1px rgba(255,222,230,.4),0 5px 25px rgba(0,0,0,.73),0 0 12px rgba(179,38,81,.23);backdrop-filter:blur(13px)}',
'.trigger:hover{border-color:#ffb0c6}.brand{display:grid;place-items:center;width:23px;height:23px;border:1px solid #f28aa8;border-radius:5px;background:linear-gradient(160deg,#f5b1c3,#d43963,#371020,#e56c91);color:#360718;font-size:15px;font-weight:900}',
'.drawer{width:min(315px,calc(100vw - 25px));margin:0 0 9px auto;padding:14px;border:1px solid #a84b6b;border-radius:14px;color:#e8bccb;background:repeating-linear-gradient(105deg,rgba(249,193,207,.026) 0 1px,transparent 1px 8px),linear-gradient(150deg,rgba(78,20,42,.97),rgba(11,7,15,.99) 45%,rgba(60,15,36,.97));box-shadow:0 25px 75px rgba(0,0,0,.9),inset 0 1px rgba(255,176,201,.25)}.drawer[hidden]{display:none}',
'.head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;border-bottom:1px solid #78344c;padding-bottom:10px}.head strong{font-size:16px;letter-spacing:.1em;background:linear-gradient(170deg,#ffc7d6,#e94d76,#470c27,#ee6c8f);color:transparent;background-clip:text;-webkit-background-clip:text}',
'.close{padding:3px 9px;background:#280a1b;border:1px solid #76344c;border-radius:5px;color:#f2adbe;font-size:15px}.hint{color:#c08a9e;font-size:10px;line-height:1.5;margin:0 0 11px}',
'.links{display:grid;grid-template-columns:1fr 1fr;gap:7px}.links a{text-decoration:none;display:flex;justify-content:space-between;align-items:center;padding:10px;border:1px solid #622a43;border-radius:6px;background:linear-gradient(125deg,#3e152b,#100912);color:#e5afc0;font-size:10px;letter-spacing:.06em}.links a:hover,.home:hover{border-color:#e55d83;background:#702342;color:#ffe8ef}',
'.home{display:block;text-align:center;text-decoration:none;padding:11px;border:1px solid #d15478;border-radius:6px;background:linear-gradient(150deg,#a3335a,#330d24,#7d1f46);color:#f8cdda;font-size:11px;letter-spacing:.1em;margin-top:10px}.foot{display:block;margin-top:9px;font-size:9px;color:#937083;letter-spacing:.1em;text-align:center}',
'@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}'
].join('');
const trigger=document.createElement('button');trigger.className='trigger';trigger.type='button';trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','Abrir el mapa del universo BELENTANI');
const b=document.createElement('span');b.className='brand';b.textContent='B';
const tx=document.createElement('span');tx.textContent='BELENTANI / OS';
const ico=document.createElement('span');ico.textContent='⌘';trigger.append(b,tx,ico);
const drawer=document.createElement('nav');drawer.className='drawer';drawer.hidden=true;drawer.setAttribute('aria-label','Mapa universal de BELENTANI');
const header=document.createElement('div');header.className='head';
const logo=document.createElement('strong');logo.textContent='BELENTANI.OS';
const close=document.createElement('button');close.type='button';close.className='close';close.textContent='×';close.setAttribute('aria-label','Cerrar mapa');header.append(logo,close);
const hint=document.createElement('p');hint.className='hint';hint.textContent='Estás dentro de una obra. Vuelve al ordenador o salta directamente a otro directorio.';
const links=document.createElement('div');links.className='links';
for(const [title,zone] of [['⌂ INICIO','home'],['♫ MÚSICA','music'],['◇ MUNDOS','world'],['✧ VISUAL','visual'],['≋ ESTUDIO','studio'],['▤ ARCHIVO','archive']]){
 const a=document.createElement('a');a.href=home.href+'#'+zone;a.textContent=title;
 const arrow=document.createElement('span');arrow.textContent='↗';a.append(arrow);links.append(a);
}
const start=document.createElement('a');start.className='home';start.href=home.href+'#home';start.textContent='⎋ VOLVER AL ORDENADOR';
const foot=document.createElement('small');foot.className='foot';foot.textContent='RUBY ALLOY / SHARED DESIGN SYSTEM';
drawer.append(header,hint,links,start,foot);shadow.append(style,drawer,trigger);document.body.append(host);
function show(v){drawer.hidden=!v;trigger.setAttribute('aria-expanded',String(v));if(v)close.focus();else trigger.focus()}
trigger.addEventListener('click',()=>show(drawer.hidden));close.addEventListener('click',()=>show(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)show(false)});
})();