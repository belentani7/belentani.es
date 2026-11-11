/* motor.js — motor WebGL2 del Instituto Belentani (sin dependencias).
   Cada página declara data-shader; el motor compila la escena correspondiente.
   Respeta prefers-reduced-motion: un solo fotograma. Degrada a CSS si no hay WebGL. */
(function () {
  "use strict";
  var REDUCIR = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var VERT = [
    "#version 300 es",
    "in vec2 pos;",
    "out vec2 uv;",
    "void main(){ uv = pos * .5 + .5; gl_Position = vec4(pos, 0., 1.); }"
  ].join("\n");
  var FRAGS = {
    "nebulosa-cristal": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "float ruido(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }",
      "float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*ruido(p); p*=2.03; a*=.5; } return v; }",
      "void main(){ vec2 p = uv*3.0; float n = fbm(p + t*.05);",
      " float cristal = smoothstep(.42,.5,abs(fract(n*4.+t*.02)-.5));",
      " vec3 base = mix(vec3(.05,.07,.09), acento*.7, n*.8);",
      " color = vec4(base + cristal*acento*.35, 1.); }"].join("\n"),
    "lengua-de-fuego": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "void main(){ vec2 p = uv; p.x *= 1.6; float f = 0.;",
      " for(float i=1.;i<6.;i++){ f += sin(p.y*9.*i + t*1.4 + i)* .5/i; }",
      " float llama = smoothstep(.1,.9, f*.5+p.y*.4+.35);",
      " vec3 c = mix(vec3(.02,.02,.03), acento, llama);",
      " color = vec4(c + pow(llama,6.)*.6, 1.); }"].join("\n"),
    "constelacion-aula": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "float hash(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453); }",
      "void main(){ vec2 g = fract(uv*14.)-.5; float d = length(g);",
      " float estrella = smoothstep(.08,.0,d) * step(.92, hash(floor(uv*14.)));",
      " float pulso = .6+.4*sin(t*2.+hash(floor(uv*14.))*6.28);",
      " vec3 c = vec3(.04,.06,.09) + estrella*pulso*mix(vec3(1.),acento,.4)*1.6;",
      " color = vec4(c,1.); }"].join("\n"),
    "forja-neon": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "void main(){ float y = uv.y*8.; float barra = step(.86, abs(fract(y*.5)-.5)*2.);",
      " float brillo = pow(.5+.5*sin(t*3.+y),3.);",
      " vec3 c = mix(vec3(.03,.04,.06), acento, barra*brillo);",
      " color = vec4(c,1.); }"].join("\n"),
    "reactor-omega": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "void main(){ vec2 p = uv-.5; float a = atan(p.y,p.x); float r = length(p);",
      " float anillos = sin(a*6. + r*24. - t*2.)*.5+.5;",
      " float nucleo = smoothstep(.42,.05,r);",
      " vec3 c = vec3(.03,.03,.05) + anillos*acento*.35*(1.-r) + nucleo*acento*.8;",
      " color = vec4(c,1.); }"].join("\n"),
    "mercado-vidrio": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "void main(){ vec2 p = uv*2.-1.; float vidrio = max(0., 1.-abs(p.x*p.y)*3.5);",
      " float reflejo = pow(max(0., 1.-length(p*vec2(1.,2.4))),2.);",
      " vec3 c = mix(vec3(.04,.04,.07), acento, reflejo*(.6+.4*sin(t)));",
      " color = vec4(c + vidrio*.03,1.); }"].join("\n"),
    "campo-abierto": ["#version 300 es","precision highp float;","in vec2 uv;",
      "out vec4 color;","uniform float t;","uniform vec3 acento;",
      "float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }",
      "void main(){ float v = 0.; for(int i=0;i<4;i++){",
      " vec2 g = uv*(6.+float(i)*6.); v += smoothstep(.48,.5, hash(floor(g+t*.01*float(i)))); }",
      " vec3 c = mix(vec3(.05,.05,.08), acento, v*.12);",
      " color = vec4(c,1.); }"].join("\n")
  };
  function acento(){ var b=document.body; var c=getComputedStyle(b).getPropertyValue("--acento").trim()||"#ff2d55";
    var m=/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c);
    return m?[parseInt(m[1],16)/255,parseInt(m[2],16)/255,parseInt(m[3],16)/255]:[1.,.18,.33]; }
  function compilar(gl, tipo, src){ var s=gl.createShader(tipo); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ throw gl.getShaderInfoLog(s); } return s; }
  function iniciar(){
    var lienzo=document.querySelector("canvas.lienzo"); if(!lienzo) return;
    var nombre=document.body.dataset.shader||"campo-abierto";
    var gl=lienzo.getContext("webgl2",{alpha:true,antialias:true});
    if(!gl){ lienzo.classList.add("lienzo-css"); return; }
    var frag=FRAGS[nombre]||FRAGS["campo-abierto"];
    try{
      var prog=gl.createProgram();
      gl.attachShader(prog,compilar(gl,gl.VERTEX_SHADER,VERT));
      gl.attachShader(prog,compilar(gl,gl.FRAGMENT_SHADER,frag));
      gl.linkProgram(prog);
      if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw gl.getProgramInfoLog(prog);
      gl.useProgram(prog);
      var buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1, 3,-1, -1,3]),gl.STATIC_DRAW);
      var loc=gl.getAttribLocation(prog,"pos");
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      var ut=gl.getUniformLocation(prog,"t"), ua=gl.getUniformLocation(prog,"acento");
      var a=acento();
      if(ua) gl.uniform3f(ua,a[0],a[1],a[2]);
      var t0=performance.now();
      function ajustar(){ var r=lienzo.getBoundingClientRect(), d=Math.min(devicePixelRatio||1,2);
        lienzo.width=Math.max(2,r.width*d); lienzo.height=Math.max(2,r.height*d);
        gl.viewport(0,0,lienzo.width,lienzo.height); }
      addEventListener("resize",ajustar,{passive:true}); ajustar();
      var t=0;
      function frame(){ t=(performance.now()-t0)/1000; if(ut) gl.uniform1f(ut,t);
        gl.drawArrays(gl.TRIANGLES,0,3);
        if(!REDUCIR) requestAnimationFrame(frame); }
      frame();
    }catch(e){ lienzo.classList.add("lienzo-css"); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",iniciar);
  else iniciar();
})();
