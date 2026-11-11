/* app.js — interacción del Instituto: navegación, búsqueda local y revelado.
   Sin dependencias, sin rastreadores, teclado primero. */
(function () {
  "use strict";
  var REDUCIR = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* revelado suave al hacer scroll */
  if ("IntersectionObserver" in window && !REDUCIR) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: .12 });
    document.querySelectorAll(".tarjeta, .modulo, details.faq").forEach(function (el) {
      el.classList.add("revelar"); io.observe(el);
    });
  }
  /* búsqueda local sobre el catálogo embebido */
  var campo = document.getElementById("busqueda");
  var resultados = document.getElementById("resultados");
  if (campo && resultados && typeof CATALOGO !== "undefined") {
    var render = function (q) {
      q = q.trim().toLowerCase();
      if (q.length < 2) { resultados.innerHTML = ""; return; }
      var n = 0, html = "";
      CATALOGO.forEach(function (p) {
        if (n >= 40) return;
        if ((p.n + " " + p.d + " " + p.i).toLowerCase().indexOf(q) !== -1) {
          html += '<li><article class="tarjeta"><h3><a href="' + p.u + '">' +
                  p.n.replace(/</g, "&lt;") + "</a></h3><p>" +
                  (p.d || "").replace(/</g, "&lt;").slice(0, 140) + "…</p>" +
                  '<p class="meta">' + p.i + "</p></article></li>";
          n++;
        }
      });
      resultados.innerHTML = n ? html :
        "<li><p>Sin resultados para «" + q.replace(/</g, "&lt;") + "». Prueba otro término.</p></li>";
    };
    campo.addEventListener("input", function () { render(campo.value); });
  }
  /* año dinámico del pie */
  var ano = document.querySelector(".pie-final time");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
