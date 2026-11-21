/** Shared procedural surfaces adapted from the artist's Visual Engine and Cosmos scenes. */
export const celestialVertex = `
varying vec3 vLocal;
varying vec3 vWorldNormal;
varying vec3 vEye;
void main() {
  vLocal = normalize(position);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vEye = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const noise3 = `
float hash3(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
float valueNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x),
        mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
        mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float terrain(vec3 p) {
  float n = 0.0, weight = 0.5;
  for (int j = 0; j < 4; j++) {
    n += valueNoise(p) * weight;
    p = p * 2.03 + 7.13;
    weight *= 0.5;
  }
  return n;
}
`;

export const planetFragment = `
uniform vec3 uColor;
uniform vec3 uShadow;
uniform float uSeed;
uniform float uKind;
uniform float uTime;
varying vec3 vLocal;
varying vec3 vWorldNormal;
varying vec3 vEye;
${noise3}
void main() {
  vec3 p = vLocal * 5.2 + vec3(uSeed * 3.13);
  float continents = terrain(p);
  float detail = terrain(p * 3.4);
  float land = smoothstep(0.45, 0.68, continents + (detail - 0.5) * 0.16);
  vec3 color = mix(uShadow * (0.7 + detail * 0.4),
                   mix(uColor * 0.64, uColor * 1.5, detail), land);
  if (uKind > 0.5 && uKind < 1.5) {
    float bands = sin(vLocal.y * 38.0 + continents * 12.0 + uTime * 0.03);
    color = mix(uShadow, uColor * 1.42, 0.4 + bands * 0.22 + continents * 0.25);
  }
  if (uKind > 1.5) {
    float fissures = smoothstep(0.66, 0.76, detail + sin(vLocal.x * 43.0) * 0.035);
    color = mix(uShadow * 0.72, uColor * 0.72, land) + uColor * fissures * 0.85;
  }
  float diffuse = max(dot(normalize(vWorldNormal), normalize(vec3(-0.42, 0.65, 0.72))), 0.0);
  float rim = pow(1.0 - max(dot(normalize(vWorldNormal), normalize(vEye)), 0.0), 3.0);
  color = color * (0.12 + diffuse * 1.16) * smoothstep(-0.16, 0.25, diffuse)
        + uColor * rim * 0.28;
  gl_FragColor = vec4(color, 1.0);
}
`;

export const atmosphereFragment = `
uniform vec3 uColor;
varying vec3 vWorldNormal;
varying vec3 vEye;
void main() {
  float rim = pow(1.0 - max(dot(normalize(vWorldNormal), normalize(vEye)), 0.0), 3.4);
  gl_FragColor = vec4(uColor * 1.45, rim * 0.51);
}
`;

export const cloudFragment = `
uniform float uSeed;
uniform float uTime;
varying vec3 vLocal;
${noise3}
void main() {
  float n = terrain(vLocal * 8.0 + vec3(uSeed + uTime * 0.006));
  gl_FragColor = vec4(vec3(0.89, 0.82, 0.81), smoothstep(0.62, 0.76, n) * 0.31);
}
`;

export const starVertex = `
attribute vec3 color;
varying vec3 vColor;
uniform float uSize;
void main() {
  vColor = color;
  vec4 eye = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = clamp(uSize / max(2.0, -eye.z), 1.0, 5.0);
  gl_Position = projectionMatrix * eye;
}
`;
export const starFragment = `
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float glow = exp(-d * d * 18.0);
  gl_FragColor = vec4(vColor * (1.0 + glow * 0.45), glow * 0.72);
}
`;
