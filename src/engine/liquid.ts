// The liquid: drops of mercury raymarched on one full-screen quad. They melt
// together smoothly, and can morph into an emblem's shape through its baked
// distance field. A floor mirror reflects them.
import * as T from 'three';

export const MAX_DROPS = 24;

const VERTEX = `void main(){ gl_Position = vec4(position.xy, 0., 1.); }`;

const FRAGMENT = `
precision highp sampler3D;
#define MAXB ${MAX_DROPS}
uniform vec4 uView; uniform mat4 uInvProj, uCamWorld; uniform float uTime;
uniform vec4 uBalls[MAXB]; uniform float uSquash[MAXB]; uniform int uCount; uniform float uK, uWob, uMorph, uHide;
uniform sampler3D uSdf; uniform vec3 uBoxMin, uBoxMax, uObjPos; uniform float uObjRot, uObjScale;
uniform samplerCube uEnv; uniform float uEnvGain, uEnvLod, uSpec; uniform vec4 uBound; uniform int uSteps; uniform float uMirrorY, uMirror;
uniform mat4 projectionMatrix;
float smin(float a, float b, float k){ float h = clamp(.5 + .5*(b-a)/k, 0., 1.); return mix(b, a, h) - k*h*(1.-h); }
float sdObj(vec3 p){
  vec3 q = (p - uObjPos) / uObjScale; float c = cos(uObjRot), s = sin(uObjRot); q.xz = mat2(c, -s, s, c) * q.xz;
  vec3 e = uBoxMax - uBoxMin, cl = clamp((q - uBoxMin) / e, 0., 1.), qc = uBoxMin + cl * e;
  return (textureLod(uSdf, cl, 0.).r + length(q - qc)) * uObjScale;
}
float map(vec3 p){
  float w = sin(p.x*7.+uTime*1.7)*sin(p.y*8.-uTime*1.3)*sin(p.z*7.+uTime)*.02*uWob;
  float d = 1e3;
  for (int i = 0; i < MAXB; i++) { if (i >= uCount) break; vec4 b = uBalls[i]; if (b.w <= 0.) continue; float sq = uSquash[i];
    vec3 q = p - b.xyz; q.y /= sq; d = smin(d, (length(q) - b.w) * min(sq, 1.), uK); }
  d += w;
  if (uMorph > 0.) d = mix(d, sdObj(p), uMorph);
  return d + uHide;
}
vec3 nrm(vec3 p){ vec2 e = vec2(.0015, -.0015); return normalize(e.xyy*map(p+e.xyy) + e.yyx*map(p+e.yyx) + e.yxy*map(p+e.yxy) + e.xxx*map(p+e.xxx) + 1e-6); }
bool march(vec3 ro, vec3 rd, out vec3 p){
  vec3 oc = ro - uBound.xyz; float b = dot(oc, rd), c = dot(oc, oc) - uBound.w*uBound.w, h = b*b - c;
  if (h < 0.) return false;
  float t = max(0., -b - sqrt(h)), tEnd = -b + sqrt(h);
  for (int i = 0; i < 160; i++) { if (i >= uSteps) break; p = ro + rd*t; float d = map(p); if (d < .0012) return true; t += d * .75; if (t > tEnd) return false; }
  return false;
}
vec3 shade(vec3 p, vec3 rd){
  vec3 n = nrm(p), r = reflect(rd, n);
  float fr = .72 + .28 * pow(1. - clamp(dot(n, -rd), 0., 1.), 5.);
  vec3 col = textureLod(uEnv, r, uEnvLod).rgb * uEnvGain * vec3(.93, .945, .96) * fr;
  col += vec3(1.) * pow(max(dot(r, normalize(vec3(-.4, 1., .5))), 0.), 16.) * uSpec;
  return col;
}
float depthOf(vec3 p){ vec4 clip = projectionMatrix * viewMatrix * vec4(p, 1.); return clip.z / clip.w * .5 + .5; }
void main(){
  vec2 ndc = (gl_FragCoord.xy - uView.xy) / uView.zw * 2. - 1.;
  vec4 vp = uInvProj * vec4(ndc, 1., 1.); vp /= vp.w;
  vec3 ro = cameraPosition, rd = normalize((uCamWorld * vec4(vp.xyz, 0.)).xyz), p, col;
  if (march(ro, rd, p)) { col = shade(p, rd); gl_FragDepth = depthOf(p); }
  else {
    if (uMirror <= 0. || rd.y >= -.001) discard;
    float tf = (uMirrorY - ro.y) / rd.y; if (tf <= 0.) discard;
    vec3 fp = ro + rd * tf, rd2 = reflect(rd, vec3(0., 1., 0.));
    if (!march(fp + rd2 * .002, rd2, p)) discard;
    col = shade(p, rd2) * uMirror; gl_FragDepth = depthOf(vec3(p.x, 2. * uMirrorY - p.y, p.z));
  }
  if (any(isnan(col)) || any(isinf(col))) col = vec3(0.);
  gl_FragColor = vec4(min(col, vec3(20.)), 1.);
}`;

export type LiquidUniforms = ReturnType<typeof liquidUniforms>;

export function liquidUniforms(
  envCube: T.CubeTexture,
  gain: number,
  lod: number,
  spec: number,
  steps: number,
) {
  // a one-voxel field so the 3D sampler is always bound before the first emblem
  const placeholder = new T.Data3DTexture(new Uint16Array([T.DataUtils.toHalfFloat(1)]), 1, 1, 1);
  placeholder.format = T.RedFormat;
  placeholder.type = T.HalfFloatType;
  placeholder.needsUpdate = true;
  return {
    uView: { value: new T.Vector4() },
    uInvProj: { value: new T.Matrix4() },
    uCamWorld: { value: new T.Matrix4() },
    uTime: { value: 0 },
    uBalls: { value: Array.from({ length: MAX_DROPS }, () => new T.Vector4(0, -50, 0, 0)) },
    uSquash: { value: new Array<number>(MAX_DROPS).fill(1) },
    uCount: { value: 0 },
    uK: { value: 0.25 },
    uWob: { value: 1 },
    uMorph: { value: 0 },
    uHide: { value: 0 },
    uSdf: { value: placeholder as T.Data3DTexture },
    uBoxMin: { value: new T.Vector3() },
    uBoxMax: { value: new T.Vector3() },
    uObjPos: { value: new T.Vector3() },
    uObjRot: { value: 0 },
    uObjScale: { value: 1 },
    uEnv: { value: envCube },
    uEnvGain: { value: gain },
    uEnvLod: { value: lod },
    uSpec: { value: spec },
    uBound: { value: new T.Vector4(0, 1, 0, 2) },
    uSteps: { value: steps },
    uMirrorY: { value: 0 },
    uMirror: { value: 0.14 },
  };
}

export function liquidMesh(U: LiquidUniforms): T.Mesh {
  const mesh = new T.Mesh(
    new T.PlaneGeometry(2, 2),
    new T.ShaderMaterial({
      uniforms: U,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      depthTest: true,
      depthWrite: true,
    }),
  );
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;
  const viewport = new T.Vector4();
  mesh.onBeforeRender = (renderer, _scene, camera) => {
    renderer.getCurrentViewport(viewport);
    U.uView.value.copy(viewport);
    U.uInvProj.value.copy(camera.projectionMatrix).invert();
    U.uCamWorld.value.copy(camera.matrixWorld);
  };
  return mesh;
}

const box = new T.Box3(),
  tv = new T.Vector3(),
  tv2 = new T.Vector3();

/** Fit the raymarch's bounding sphere to the drops and the emblem; false when nothing is there. */
export function fitBound(U: LiquidUniforms): boolean {
  box.makeEmpty();
  const balls = U.uBalls.value;
  for (let i = 0; i < U.uCount.value; i++) {
    const b = balls[i]!;
    if (b.w <= 0) continue;
    tv.set(b.x, b.y, b.z);
    box.expandByPoint(tv2.copy(tv).addScalar(b.w + 0.3));
    box.expandByPoint(tv2.copy(tv).addScalar(-b.w - 0.3));
  }
  if (U.uMorph.value > 0) {
    const s = U.uObjScale.value,
      o = U.uObjPos.value,
      r = Math.max(U.uBoxMax.value.length(), U.uBoxMin.value.length()) * s;
    box.expandByPoint(tv.set(o.x - r, o.y - 0.1, o.z - r));
    box.expandByPoint(tv.set(o.x + r, o.y + r * 1.4, o.z + r));
  }
  if (box.isEmpty()) {
    U.uBound.value.set(0, -50, 0, 0.01);
    return false;
  }
  const c = box.getCenter(tv),
    r = box.getSize(tv2).length() / 2;
  U.uBound.value.set(c.x, c.y, c.z, r);
  return true;
}
