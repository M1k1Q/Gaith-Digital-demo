// Rain → data lake → cloud particle morph.
export const particleVS = /* glsl */ `
uniform float uRainTime, uTime, uT1, uT2, uSize, uPR;
attribute vec3 aGrid; attribute vec3 aCloud; attribute float aSpeed, aRand, aKind;
varying float vStreak, vAlpha; varying vec3 vColor;
void main(){
  vec3 rain = position;
  rain.y = mod(position.y - uRainTime * aSpeed + 10.0, 30.0) - 10.0;
  vec3 g = aGrid; float d = length(g.xz);
  g.y += sin(d * 0.8 - uTime * 1.4) * 0.12 + sin(g.x * 0.5 + uTime * 0.7) * 0.05;
  vec3 c = aCloud + vec3(sin(uTime*0.4 + aRand*30.0), cos(uTime*0.35 + aRand*20.0), sin(uTime*0.3 + aRand*10.0)) * 0.12;
  float t1 = smoothstep(0.0, 1.0, clamp(uT1 * 1.5 - aRand * 0.5, 0.0, 1.0));
  float t2 = aKind * smoothstep(0.0, 1.0, clamp(uT2 * 1.5 - aRand * 0.5, 0.0, 1.0));
  vec3 p = mix(mix(rain, g, t1), c, t2);
  p.y += sin(t2 * 3.14159) * 1.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = uSize * mix(3.0, 1.0, t1) * mix(1.0, 0.85, t2);
  gl_PointSize = min(size * uPR / -mv.z, 64.0 * uPR);
  vStreak = 1.0 - t1;
  float tw = 0.65 + 0.35 * sin(uTime * 2.0 + aRand * 50.0);
  vAlpha = mix(0.3, mix(0.8 * tw, 0.5, t2), t1);
  vColor = mix(mix(vec3(0.62, 0.85, 1.0), vec3(0.16, 0.92, 0.78), t1), vec3(0.75, 0.9, 1.0), t2);
}`;

export const particleFS = /* glsl */ `
uniform float uOpacity;
varying float vStreak, vAlpha; varying vec3 vColor;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  c.x *= mix(1.0, 6.0, vStreak);
  float a = 1.0 - smoothstep(0.0, 1.0, length(c) * 2.0);
  a *= a;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
}`;

export const skyVS = /* glsl */ `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
export const skyFS = /* glsl */ `varying vec3 vP; void main(){
  float h = vP.y; vec3 top = vec3(0.008,0.016,0.035); vec3 hor = vec3(0.035,0.075,0.12); vec3 bot = vec3(0.005,0.01,0.018);
  vec3 col = h > 0.0 ? mix(hor, top, pow(h, 0.55)) : mix(hor, bot, pow(-h, 0.35));
  gl_FragColor = vec4(col, 1.0); }`;

// Security dome: fresnel rim + reveal front rising from the ground + slow scan bands.
export const shieldVS = /* glsl */ `varying vec3 vN, vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`;
export const shieldFS = /* glsl */ `uniform float uReveal, uTime, uOpacity; varying vec3 vN, vW;
void main(){
  float cut = mix(-2.0, 14.5, uReveal);
  if (vW.y < -2.0 || vW.y > cut) discard;
  vec3 v = normalize(cameraPosition - vW);
  float f = pow(1.0 - abs(dot(normalize(vN), v)), 2.2);
  float front = smoothstep(0.9, 0.0, cut - vW.y);
  float scan = smoothstep(0.06, 0.0, abs(fract(vW.y * 0.06 - uTime * 0.12) - 0.5)) * 0.35;
  float a = (f * 0.55 + front * 0.7 + scan * f) * uOpacity;
  gl_FragColor = vec4(mix(vec3(0.2, 0.75, 1.0), vec3(0.2, 1.0, 0.85), f), a);
}`;
export const wireVS = /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
export const wireFS = /* glsl */ `uniform float uReveal, uOpacity; varying vec3 vW;
void main(){ float cut = mix(-2.0, 14.5, uReveal); if (vW.y < -2.0 || vW.y > cut) discard;
  float front = smoothstep(1.2, 0.0, cut - vW.y);
  gl_FragColor = vec4(0.35, 0.9, 1.0, (0.13 + front * 0.6) * uOpacity); }`;
