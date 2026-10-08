// Emblems on the stage. Each is built twice: a pure-mercury copy and a copy
// in its own colours. Mercury everywhere; on a project's own page a "colour
// front" sweeps over the emblem and it blooms into its colours. A noise field
// shapes both fronts, the glow rides on them, and the floor reflects a twin.
import * as T from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { loadEmblem, materials, type EmblemProject } from '../emblems';
import { LOOK } from './look';

export interface EmblemUniforms {
  [uniform: string]: T.IUniform;
  /** 0 → liquid, 1 → set into mercury. */
  uSet: T.IUniform<number>;
  /** 0 → mercury, 1 → in colour. */
  uColour: T.IUniform<number>;
  uEdge: T.IUniform<T.Color>;
}

export const emblemUniforms = (): EmblemUniforms => ({
  uSet: { value: 1 },
  uColour: { value: 0 },
  uEdge: { value: new T.Color(1, 0.74, 0.42) },
});

const NOISE = `
float h3(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
  return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }`;

/** Double-sided, because a few parts (lathed tops, open shells) face inwards. */
export const mercuryMaterial = () =>
  new T.MeshPhysicalMaterial({ ...LOOK.mercury, side: T.DoubleSide });

type Mode = 'chrome' | 'colour';

/**
 * 'chrome' shows where the set front has passed and the colour front has not;
 * 'colour' shows behind the colour front.
 */
export function patchMaterial<M extends T.Material>(m: M, EU: EmblemUniforms, mode: Mode): M {
  const chrome = mode === 'chrome';
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, EU);
    sh.vertexShader =
      'varying vec3 vDisP;\n' +
      sh.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n vDisP = position;',
      );
    sh.fragmentShader =
      'uniform float uSet, uColour; uniform vec3 uEdge; varying vec3 vDisP;\n' +
      NOISE +
      '\n' +
      sh.fragmentShader
        .replace(
          'void main() {',
          `void main() {
  float dn = vn(vDisP * 9.) * .7 + vn(vDisP * 31.) * .3, ds = uSet * 1.12 - .06, dc = uColour * 1.12 - .06;
  ${chrome ? 'if (dn > ds || dn < dc) discard;' : 'if (dn > dc) discard;'}`,
        )
        .replace(
          '#include <aomap_fragment>',
          (chrome ? `reflectedLight.directSpecular *= ${LOOK.directSpecular.toFixed(2)};\n` : '') +
            '#include <aomap_fragment>',
        )
        .replace(
          '#include <opaque_fragment>',
          `#include <opaque_fragment>
  ${
    chrome
      ? `gl_FragColor.rgb += vec3(.9, .95, 1.) * smoothstep(.04, 0., ds - dn) * step(.001, 1. - uSet) * ${LOOK.setEdge.toFixed(2)};`
      : `gl_FragColor.rgb += uEdge * smoothstep(.05, 0., dc - dn) * step(.001, 1. - uColour) * ${(LOOK.setEdge * 1.6).toFixed(2)};`
  }`,
        );
  };
  m.customProgramCacheKey = () => `emblem-${mode}`;
  return m;
}

const tick = (o: T.Object3D, t: number) =>
  (o.userData.tick as ((t: number) => void) | undefined)?.(t);

/** Build an emblem and scale it to the plinth: about one unit tall, standing on y = 0. */
export async function fitted(p: EmblemProject): Promise<{ obj: T.Group; height: number }> {
  const build = await loadEmblem(p.slug);
  const obj = build(materials(), p);
  const size = new T.Box3().setFromObject(obj).getSize(new T.Vector3());
  obj.scale.setScalar((p.flagship ? 1.05 : 0.95) / Math.max(size.y, size.x * 0.85, size.z * 0.85));
  obj.updateMatrixWorld(true);
  const b = new T.Box3().setFromObject(obj);
  obj.position.y = -b.min.y;
  obj.updateMatrixWorld(true);
  return { obj, height: b.max.y - b.min.y };
}

function dress(obj: T.Object3D, EU: EmblemUniforms, mode: Mode): void {
  obj.traverse((o) => {
    if (!(o instanceof T.Mesh)) return;
    o.castShadow = o.receiveShadow = true;
    const list = ([] as T.Material[]).concat(o.material).map((src) => {
      const m = mode === 'chrome' ? mercuryMaterial() : src.clone();
      m.side = T.DoubleSide;
      return patchMaterial(m, EU, mode);
    });
    o.material = list.length === 1 ? list[0]! : list;
  });
}

export interface StageEmblem {
  group: T.Group;
  mirror: T.Group;
  chrome: T.Group;
  height: number;
  sdf: DistanceField;
  tick(t: number): void;
}

/** The emblem for the stage: chrome and colour copies, and their mirror images. */
export async function makeEmblem(p: EmblemProject, EU: EmblemUniforms): Promise<StageEmblem> {
  const make = async () => {
    const [c, k] = await Promise.all([fitted(p), fitted(p)]);
    dress(c.obj, EU, 'chrome');
    dress(k.obj, EU, 'colour');
    const g = new T.Group();
    g.add(c.obj, k.obj);
    return { g, chrome: c.obj, colour: k.obj, height: c.height };
  };
  const [main, mirror] = await Promise.all([make(), make()]);
  mirror.g.traverse((o) => {
    if (o instanceof T.Mesh) o.castShadow = false;
  });
  const probe = new T.Group();
  probe.add(main.chrome.clone());
  return {
    group: main.g,
    mirror: mirror.g,
    chrome: main.chrome,
    height: main.height,
    sdf: bakeDistanceField(probe),
    tick: (t) =>
      [main.chrome, main.colour, mirror.chrome, mirror.colour].forEach((o) => tick(o, t)),
  };
}

export interface DistanceField {
  tex: T.Data3DTexture;
  min: T.Vector3;
  max: T.Vector3;
}

/** One geometry in the object's own frame, positions only (and normals when asked). */
function merged(obj: T.Object3D, frame: T.Matrix4, normals: boolean): T.BufferGeometry {
  obj.updateMatrixWorld(true);
  const parts: T.BufferGeometry[] = [];
  obj.traverse((o) => {
    if (!(o instanceof T.Mesh) || !o.geometry.attributes.position) return;
    const src = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    const g = new T.BufferGeometry();
    g.setAttribute('position', src.attributes.position!.clone());
    if (normals) {
      if (src.attributes.normal) g.setAttribute('normal', src.attributes.normal.clone());
      else g.computeVertexNormals();
    }
    g.applyMatrix4(new T.Matrix4().multiplyMatrices(frame, o.matrixWorld));
    parts.push(g);
  });
  return mergeGeometries(parts);
}

/** Bake the emblem's distance field, so the liquid can pour into its shape. */
export function bakeDistanceField(obj: T.Object3D, N = 40): DistanceField {
  const inv = new T.Matrix4().copy(obj.matrixWorld).invert();
  const geo = merged(obj, inv, false),
    bvh = new MeshBVH(geo);
  const box = new T.Box3()
    .setFromBufferAttribute(geo.attributes.position as T.BufferAttribute)
    .expandByScalar(0.12);
  const size = box.getSize(new T.Vector3());
  const data = new Uint16Array(N * N * N),
    q = new T.Vector3(),
    hit = { point: new T.Vector3(), distance: 0, faceIndex: 0 };
  for (let z = 0; z < N; z++)
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        q.set(
          box.min.x + ((x + 0.5) / N) * size.x,
          box.min.y + ((y + 0.5) / N) * size.y,
          box.min.z + ((z + 0.5) / N) * size.z,
        );
        bvh.closestPointToPoint(q, hit);
        data[x + y * N + z * N * N] = T.DataUtils.toHalfFloat(hit.distance - 0.016);
      }
  const tex = new T.Data3DTexture(data, N, N, N);
  tex.format = T.RedFormat;
  tex.type = T.HalfFloatType;
  tex.minFilter = tex.magFilter = T.LinearFilter;
  tex.unpackAlignment = 1;
  tex.needsUpdate = true;
  const half = size.clone().divideScalar(N * 2);
  return { tex, min: box.min.clone().add(half), max: box.max.clone().sub(half) };
}

const geometryCache = new Map<string, Promise<T.BufferGeometry>>();

/** One merged pure-mercury geometry per emblem (one draw call), for still portraits. */
export function mercuryGeometry(p: EmblemProject): Promise<T.BufferGeometry> {
  let g = geometryCache.get(p.slug);
  if (!g) {
    g = fitted(p).then(({ obj }) => {
      const geo = merged(obj, new T.Matrix4(), true);
      geo.computeBoundingBox();
      geo.computeBoundingSphere();
      return geo;
    });
    geometryCache.set(p.slug, g);
  }
  return g;
}
