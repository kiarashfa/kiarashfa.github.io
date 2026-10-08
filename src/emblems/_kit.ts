// Shared tools for the emblems: the material set, and small geometry helpers.
// Every emblem is a builder `(M, P) => THREE.Group` that stands on y = 0, about
// one unit tall, with a footprint within r ≈ 0.55. Materials always come from M,
// so the same builder serves the pure-mercury copy and the coloured one.
// `group.userData.tick(t)` animates moving parts.
import * as T from 'three';

export const TAU = Math.PI * 2;
export const v2 = (x: number, y: number) => new T.Vector2(x, y);
export const v3 = (x: number, y: number, z: number) => new T.Vector3(x, y, z);

export interface EmblemProject {
  slug: string;
  color: string;
  flagship: boolean;
}

export type Materials = ReturnType<typeof materials>;
export type EmblemBuilder = (M: Materials, P: EmblemProject) => T.Group;

export function materials() {
  const cache = new Map<string, T.MeshPhysicalMaterial>();
  const phys = (key: string, o: T.MeshPhysicalMaterialParameters) => {
    let m = cache.get(key);
    if (!m) cache.set(key, (m = new T.MeshPhysicalMaterial(o)));
    return m;
  };
  return {
    gold: () => phys('gold', { color: 0xdcb46e, metalness: 1, roughness: 0.17, clearcoat: 0.3 }),
    silver: () => phys('silver', { color: 0xe4e7ea, metalness: 1, roughness: 0.1 }),
    brass: () => phys('brass', { color: 0xc59a52, metalness: 1, roughness: 0.28 }),
    copper: () => phys('copper', { color: 0xc8764a, metalness: 1, roughness: 0.22 }),
    enamel: (c: number) =>
      phys(`enamel${c}`, {
        color: c,
        metalness: 0,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
    lacquer: () =>
      phys('lacquer', {
        color: 0x0b0b0c,
        metalness: 0.1,
        roughness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
    glass: () =>
      phys('glass', {
        color: 0xf4f8ff,
        metalness: 0,
        roughness: 0.02,
        transmission: 1,
        thickness: 0.2,
        ior: 1.5,
        specularIntensity: 1,
        envMapIntensity: 2.4,
        clearcoat: 1,
        iridescence: 0.25,
        sheen: 0.4,
        sheenColor: 0xdfe8ff,
      }),
    liquid: (c: number) =>
      phys(`liquid${c}`, {
        color: c,
        metalness: 0,
        roughness: 0.05,
        transmission: 0.6,
        thickness: 0.4,
        ior: 1.36,
        attenuationColor: c,
        attenuationDistance: 0.8,
        emissive: c,
        emissiveIntensity: 0.35,
      }),
    porcelain: () =>
      phys('porcelain', { color: 0xf1ede6, metalness: 0, roughness: 0.32, clearcoat: 0.6 }),
    screen: (tex: T.Texture) => new T.MeshBasicMaterial({ map: tex, toneMapped: false }),
    glow: (c: number) =>
      phys(`glow${c}`, { color: c, emissive: c, emissiveIntensity: 1.6, roughness: 0.4 }),
    rubber: () => phys('rubber', { color: 0x141414, roughness: 0.7 }),
    wood: () => phys('wood', { color: 0x2a1a12, roughness: 0.45, clearcoat: 0.7 }),
  };
}

export interface DrawnTexture extends T.CanvasTexture {
  userData: { ctx: CanvasRenderingContext2D };
}

/** A texture painted once on a 2D canvas; `userData.ctx` keeps the context for repainting. */
export function canvasTex(
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
): DrawnTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  draw(g, w, h);
  const t = new T.CanvasTexture(c) as DrawnTexture;
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 4;
  t.userData = { ctx: g };
  return t;
}

export const mesh = (geo: T.BufferGeometry, mat: T.Material, cast = true) => {
  const m = new T.Mesh(geo, mat);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
};

export const lathe = (pts: [number, number][], segments = 96) =>
  new T.LatheGeometry(
    pts.map(([x, y]) => v2(x, y)),
    segments,
  );

export const tube = (pts: [number, number, number][], r: number, segments = 200, closed = false) =>
  new T.TubeGeometry(
    new T.CatmullRomCurve3(
      pts.map(([x, y, z]) => v3(x, y, z)),
      closed,
    ),
    segments,
    r,
    12,
    closed,
  );

export const plinth = (M: Materials, r = 0.3, h = 0.05) =>
  mesh(new T.CylinderGeometry(r, r * 1.04, h, 64), M.lacquer());

/** A ribbon following a curve, for film and tape. */
export function ribbon(
  curve: T.Curve<T.Vector3>,
  steps: number,
  half: number,
  axis: 'y' | 'z',
  uvRepeat = 1,
) {
  const geo = new T.BufferGeometry(),
    pos: number[] = [],
    uv: number[] = [],
    idx: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps,
      p = curve.getPoint(t);
    if (axis === 'y') pos.push(p.x, p.y - half, p.z, p.x, p.y + half, p.z);
    else pos.push(p.x, p.y, p.z - half, p.x, p.y, p.z + half);
    uv.push(
      axis === 'y' ? t : 0,
      axis === 'y' ? 0 : t * uvRepeat,
      axis === 'y' ? t : 1,
      axis === 'y' ? 1 : t * uvRepeat,
    );
    if (i) {
      const a = (i - 1) * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

export const hex = (color: string) => new T.Color(color).getHex();
