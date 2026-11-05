import { useEffect, useRef } from "react";

/**
 * Hero con shader WebGL animado. Sin dependencias.
 *
 * <HeroShader />                         -> ocupa el contenedor al 100 %
 * <HeroShader colorA="#0b1026" colorB="#5b8cff" className="hero" />
 *
 * Respeta prefers-reduced-motion (frame estático) y pausa el render
 * cuando el canvas sale del viewport.
 */
const VERT = `attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAG = `precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_a;
uniform vec3 u_b;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  vec2 m = (u_mouse - 0.5) * 0.35;
  float t = u_time * 0.12;
  float n = fbm(uv * 1.6 + m + vec2(t, -t * 0.7));
  float r = length(uv - vec2(0.15 * sin(t * 2.0), 0.1 * cos(t * 1.7)));
  float glow = smoothstep(0.95, 0.05, r + (n - 0.5) * 0.55);
  vec3 col = mix(u_a, u_b, clamp(n * glow * 1.4, 0.0, 1.0));
  col += u_b * pow(max(0.0, 1.0 - r * 1.6), 3.0) * 0.35;
  col += vec3(hash(gl_FragCoord.xy + u_time) * 0.02);
  gl_FragColor = vec4(col, 1.0);
}`;

function rgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return [0.05, 0.07, 0.16];
  return [1, 2, 3].map((i) => parseInt(m[i], 16) / 255);
}

export default function HeroShader({
  colorA = "#0b1026",
  colorB = "#5b8cff",
  className,
  style,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      canvas.style.background = "radial-gradient(circle at 30% 30%, #16213e, #05060f 70%)";
      return;
    }

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(sh) || "shader error");
      }
      return sh;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    gl.uniform3fv(gl.getUniformLocation(prog, "u_a"), rgb(colorA));
    gl.uniform3fv(gl.getUniformLocation(prog, "u_b"), rgb(colorB));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let raf = 0;
    let running = false;
    let start = 0;
    const mouse = [0.5, 0.5];
    const target = [0.5, 0.5];

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const frame = (now) => {
      if (!start) start = now;
      mouse[0] += (target[0] - mouse[0]) * 0.05;
      mouse[1] += (target[1] - mouse[1]) * 0.05;
      gl.uniform1f(uTime, reduced ? 3 : (now - start) / 1000);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (running && !reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      target[0] = (e.clientX - r.left) / r.width;
      target[1] = 1 - (e.clientY - r.top) / r.height;
    };

    resize();
    frame(0);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas);
    else window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove, { passive: true });

    if (!reduced) {
      running = true;
      raf = requestAnimationFrame(frame);
    }

    const io = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries) => {
            if (reduced) return;
            entries.forEach((en) => {
              if (en.isIntersecting && !running) {
                running = true;
                raf = requestAnimationFrame(frame);
              } else if (!en.isIntersecting) {
                running = false;
                cancelAnimationFrame(raf);
              }
            });
          },
          { threshold: 0.01 }
        )
      : null;
    if (io) io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      if (io) io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [colorA, colorB]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
      aria-hidden="true"
    />
  );
}
