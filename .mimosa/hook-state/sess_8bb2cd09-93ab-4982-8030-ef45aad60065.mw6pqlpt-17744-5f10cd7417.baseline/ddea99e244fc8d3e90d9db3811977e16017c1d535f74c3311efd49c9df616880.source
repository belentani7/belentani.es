/**
 * BELENTANI UNIVERSE ENGINE
 * Fondo de universo animado para el ecosistema Belentani / NOIACORE.
 *
 * Basado en tecnicas de Vanta.js (MIT, tengbao/vanta) y Three.js (MIT, mrdoob/three.js).
 * Adaptado a la identidad visual propia: negro #000000, rojo neon #ff073a,
 * dorado Zion #d4af37, cyan #4de8e0. Frecuencia 432 Hz.
 *
 * Sin dependencias externas: dibuja sobre <canvas> con la API 2D.
 * Uso:
 *   const u = BelentaniUniverse.attach(document.getElementById('fondo'), { mode: 'galaxia' });
 *   u.destroy();
 *
 * Modos: 'galaxia' | 'nebulosa' | 'red'
 */
(function (root) {
  'use strict';

  var IDENTIDAD = {
    negro: '#000000',
    rojoNeon: '#ff073a',
    doradoZion: '#d4af37',
    cyan: '#4de8e0',
    frecuencia: 432
  };

  var PERFILES = {
    galaxia: {
      estrellas: 1100,
      velocidad: 0.35,
      deriva: 0.06,
      radio: 0.85,
      paleta: [IDENTIDAD.cyan, '#ffffff', IDENTIDAD.doradoZion, IDENTIDAD.rojoNeon],
      pesoColor: [0.46, 0.30, 0.16, 0.08],
      nucleo: IDENTIDAD.doradoZion,
      nebulosa: 0.11
    },
    nebulosa: {
      estrellas: 900,
      velocidad: 0.14,
      deriva: 0.03,
      radio: 1.05,
      paleta: [IDENTIDAD.rojoNeon, IDENTIDAD.cyan, '#ffffff'],
      pesoColor: [0.50, 0.30, 0.20],
      nucleo: IDENTIDAD.rojoNeon,
      nebulosa: 0.11
    },
    red: {
      estrellas: 1300,
      velocidad: 0.5,
      deriva: 0.1,
      radio: 0.8,
      paleta: [IDENTIDAD.rojoNeon, IDENTIDAD.doradoZion, IDENTIDAD.cyan],
      pesoColor: [0.62, 0.24, 0.14],
      nucleo: IDENTIDAD.rojoNeon,
      nebulosa: 0.09
    }
  };

  function elegirColor(perfil, azar) {
    var acumulado = 0;
    for (var i = 0; i < perfil.paleta.length; i++) {
      acumulado += perfil.pesoColor[i];
      if (azar <= acumulado) return perfil.paleta[i];
    }
    return perfil.paleta[perfil.paleta.length - 1];
  }

  function hexARgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16)
    };
  }

  function Universo(contenedor, opciones) {
    opciones = opciones || {};
    var modo = opciones.mode || 'galaxia';
    var perfil = PERFILES[modo] || PERFILES.galaxia;

    var lienzo = document.createElement('canvas');
    lienzo.setAttribute('aria-hidden', 'true');
    lienzo.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    if (getComputedStyle(contenedor).position === 'static') {
      contenedor.style.position = 'relative';
    }
    contenedor.appendChild(lienzo);

    var ctx = lienzo.getContext('2d');
    var ancho = 0, alto = 0, dpr = 1;
    var estrellas = [];
    var nebulosas = [];
    var tiempo = 0;
    var animacion = null;
    var vivo = true;

    var reducirMovimiento = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = contenedor.clientWidth || window.innerWidth;
      alto = contenedor.clientHeight || window.innerHeight;
      lienzo.width = Math.floor(ancho * dpr);
      lienzo.height = Math.floor(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function sembrar() {
      estrellas = [];
      var cantidad = reducirMovimiento ? Math.round(perfil.estrellas * 0.5) : perfil.estrellas;
      for (var i = 0; i < cantidad; i++) {
        estrellas.push({
          angulo: Math.random() * Math.PI * 2,
          distancia: Math.pow(Math.random(), 0.6),
          tamano: Math.random() * 2.1 + 0.5,
          color: elegirColor(perfil, Math.random()),
          brillo: Math.random() * 0.45 + 0.55,
          fase: Math.random() * Math.PI * 2,
          giro: (Math.random() * 0.5 + 0.75) * (Math.random() < 0.5 ? -1 : 1)
        });
      }
      nebulosas = [];
      for (var j = 0; j < 5; j++) {
        nebulosas.push({
          x: Math.random(),
          y: Math.random(),
          radio: Math.random() * 0.32 + 0.18,
          color: elegirColor(perfil, Math.random()),
          derivaX: (Math.random() - 0.5) * 0.02,
          derivaY: (Math.random() - 0.5) * 0.02,
          fase: Math.random() * Math.PI * 2
        });
      }
    }

    function pintarNebulosas() {
      var alfa = perfil.nebulosa;
      for (var i = 0; i < nebulosas.length; i++) {
        var n = nebulosas[i];
        n.x += n.derivaX * 0.001;
        n.y += n.derivaY * 0.001;
        if (n.x < -0.2) n.x = 1.2;
        if (n.x > 1.2) n.x = -0.2;
        if (n.y < -0.2) n.y = 1.2;
        if (n.y > 1.2) n.y = -0.2;
        var pulso = 1 + Math.sin(tiempo * 0.0008 + n.fase) * 0.12;
        var cx = n.x * ancho, cy = n.y * alto;
        var r = n.radio * Math.max(ancho, alto) * pulso;
        var rgb = hexARgb(n.color);
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alfa + ')');
        g.addColorStop(1, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0)');
        ctx.fillStyle = g;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    }

    function pintarNucleo() {
      var cx = ancho * 0.5, cy = alto * 0.5;
      var r = Math.min(ancho, alto) * 0.34;
      var rgb = hexARgb(perfil.nucleo);
      var pulso = 1 + Math.sin(tiempo * 0.0012) * 0.06;
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * pulso);
      g.addColorStop(0, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.42)');
      g.addColorStop(0.45, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.14)');
      g.addColorStop(1, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    function pintarEstrellas() {
      var cx = ancho * 0.5, cy = alto * 0.5;
      var escala = Math.min(ancho, alto) * 0.5 * perfil.radio;
      for (var i = 0; i < estrellas.length; i++) {
        var e = estrellas[i];
        e.angulo += (perfil.velocidad * e.giro) * 0.0009 * (1 - e.distancia * 0.5);
        e.distancia += perfil.deriva * 0.0016;
        if (e.distancia > 1) { e.distancia = 0; e.angulo = Math.random() * Math.PI * 2; }

        var x = cx + Math.cos(e.angulo) * e.distancia * escala;
        var y = cy + Math.sin(e.angulo) * e.distancia * escala * 0.62;
        var cercania = 1 - e.distancia;
        var titileo = 0.72 + Math.sin(tiempo * 0.002 + e.fase) * 0.28;
        var alfa = Math.max(0, e.brillo * titileo * (0.34 + cercania * 0.66));
        var rgb = hexARgb(e.color);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alfa.toFixed(3) + ')';
        ctx.arc(x, y, e.tamano * (0.5 + cercania * 0.9), 0, Math.PI * 2);
        ctx.fill();

        if (cercania > 0.82 && e.tamano > 1.1) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + (alfa * 0.32).toFixed(3) + ')';
          ctx.lineWidth = 0.7;
          ctx.moveTo(x, y);
          ctx.lineTo(cx + Math.cos(e.angulo) * e.distancia * escala * 0.86,
                     cy + Math.sin(e.angulo) * e.distancia * escala * 0.62 * 0.86);
          ctx.stroke();
        }
      }
    }

    function fotograma(ahora) {
      if (!vivo) return;
      if (!tiempo) tiempo = ahora;
      var delta = Math.min(ahora - tiempo, 50);
      tiempo = ahora;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = IDENTIDAD.negro;
      ctx.fillRect(0, 0, ancho, alto);

      ctx.globalCompositeOperation = 'lighter';
      pintarNebulosas();
      pintarNucleo();
      pintarEstrellas();
      ctx.globalCompositeOperation = 'source-over';

      if (!reducirMovimiento) {
        animacion = requestAnimationFrame(fotograma);
      }
    }

    function alRedimensionar() {
      medir();
      sembrar();
    }

    medir();
    sembrar();
    if (reducirMovimiento) {
      fotograma(16);
    } else {
      animacion = requestAnimationFrame(fotograma);
    }
    window.addEventListener('resize', alRedimensionar);

    return {
      modo: modo,
      identidad: IDENTIDAD,
      destroy: function () {
        vivo = false;
        if (animacion) cancelAnimationFrame(animacion);
        window.removeEventListener('resize', alRedimensionar);
        if (lienzo.parentNode) lienzo.parentNode.removeChild(lienzo);
      }
    };
  }

  root.BelentaniUniverse = {
    attach: function (contenedor, opciones) {
      if (!contenedor) throw new Error('BelentaniUniverse: falta el contenedor');
      return new Universo(contenedor, opciones);
    },
    identidad: IDENTIDAD,
    modos: Object.keys(PERFILES)
  };
})(typeof window !== 'undefined' ? window : this);
