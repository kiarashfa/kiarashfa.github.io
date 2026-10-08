// The rooms the emblems stand in. The Atelier at night: charcoal plaster,
// bright softboxes, a glossy black stone floor that reflects, the haze of the
// key light and the dust in it. The void: a soft charcoal ground for devices
// that cannot carry the room.
import * as T from 'three';
import { LOOK, PLINTH_TOP, type Tier } from './look';

export interface Room {
  id: 'atelier' | 'void';
  group: T.Group;
  mirrorY: number;
  exposure: number;
  bloom: readonly [number, number, number];
  envGain: number;
  cam: { y: number; look: number };
  update(t: number): void;
}

export function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => (s = (Math.imul(s ^ (s >>> 15), 2246822519) + 0x9e3779b9) >>> 0) / 4294967296;
}

function canvasTex(
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
  repeat: [number, number] = [1, 1],
): T.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!, w, h);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.wrapS = t.wrapT = T.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 8;
  return t;
}

function grain(g: CanvasRenderingContext2D, w: number, h: number, amp: number, seed = 1) {
  const r = rng(seed),
    d = g.getImageData(0, 0, w, h);
  for (let i = 0; i < d.data.length; i += 4) {
    const n = (r() - 0.5) * amp;
    d.data[i]! += n;
    d.data[i + 1]! += n;
    d.data[i + 2]! += n;
  }
  g.putImageData(d, 0, 0);
}

/** A soft cone of light in the air, for the key light's haze. */
function beam(color: number, rt: number, rb: number, h: number, intensity: number): T.Mesh {
  const b = new T.Mesh(
    new T.CylinderGeometry(rt, rb, h, 48, 1, true),
    new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      side: T.DoubleSide,
      uniforms: { uC: { value: new T.Color(color) }, uI: { value: intensity } },
      vertexShader: `varying vec2 vU; varying vec3 vN, vV; void main(){ vU = uv; vec4 w = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-w.xyz); gl_Position = projectionMatrix * w; }`,
      fragmentShader: `uniform vec3 uC; uniform float uI; varying vec2 vU; varying vec3 vN, vV; void main(){ gl_FragColor = vec4(uC * uI * pow(abs(dot(vN, vV)), 1.6) * pow(vU.y, 1.4), 1.); }`,
    }),
  );
  b.renderOrder = 10;
  return b;
}

const lacquer = () =>
  new T.MeshPhysicalMaterial({
    color: 0x131315,
    roughness: 0.36,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2,
  });
const brass = () => new T.MeshPhysicalMaterial({ color: 0xc9a466, metalness: 1, roughness: 0.32 });

/** The room's twin under the glossy floor: lights off, the bright parts dimmed, the plaster unlit. */
function mirrorOf(group: T.Group, y: number): T.Group {
  const m = group.clone(true);
  m.traverse((o) => {
    if (o instanceof T.Light) o.visible = false;
    if (!(o instanceof T.Mesh)) return;
    o.castShadow = false;
    const mat = o.material as T.MeshStandardMaterial;
    if (o.userData.unlitMirror)
      o.material = new T.MeshBasicMaterial({ map: mat.map, color: new T.Color(0.14, 0.135, 0.13) });
    if (o.userData.dimMirror)
      o.material = new T.MeshBasicMaterial({
        color: mat.color.clone().multiplyScalar(o.userData.dimMirror as number),
        fog: false,
      });
  });
  m.scale.y = -1;
  m.position.y = 2 * y;
  return m;
}

/** The glossy floor keeps its reflections but not the lamps' own hot spots. */
function calmFloor(mat: T.Material, k = 0.1) {
  mat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace(
      '#include <aomap_fragment>',
      `reflectedLight.directSpecular *= ${k.toFixed(2)};
#ifdef USE_CLEARCOAT
  clearcoatSpecularDirect *= ${k.toFixed(2)};
#endif
#include <aomap_fragment>`,
    );
  };
  mat.customProgramCacheKey = () => 'calm-floor';
}

const stoneTexture = () =>
  canvasTex(
    1024,
    1024,
    (c, w, h) => {
      c.fillStyle = LOOK.room.stone;
      c.fillRect(0, 0, w, h);
      const r = rng(4);
      for (let k = 0; k < 60; k++) {
        c.strokeStyle = `rgba(150,150,160,${0.02 + r() * 0.04})`;
        c.lineWidth = 0.6 + r() * 1.5;
        c.beginPath();
        let x = r() * w,
          y = r() * h;
        c.moveTo(x, y);
        for (let s = 0; s < 8; s++) {
          x += (r() - 0.4) * 160;
          y += (r() - 0.5) * 90;
          c.lineTo(x, y);
        }
        c.stroke();
      }
      grain(c, w, h, 10, 2);
    },
    [6, 6],
  );

export function atelier(scene: T.Scene, tier: Tier): Room {
  const g = new T.Group(),
    still = new T.Group();
  g.add(still);
  const span = 40,
    wallZ = -7;
  const L = LOOK.room;
  scene.background = new T.Color(L.bg);
  scene.fog = new T.FogExp2(L.bg, 0.035);
  const plaster = canvasTex(
    512,
    512,
    (c, w, h) => {
      c.fillStyle = L.plaster;
      c.fillRect(0, 0, w, h);
      grain(c, w, h, 12, 7);
    },
    [span / 5, 3],
  );
  const wall = new T.Mesh(
    new T.PlaneGeometry(span, 14),
    new T.MeshStandardMaterial({ map: plaster, roughness: 0.95 }),
  );
  wall.position.set(0, 7, wallZ);
  wall.userData.unlitMirror = true;
  still.add(wall);
  const boxes: [number, number][] = [
    [-4.4, 1],
    [4.4, 1],
    [-8.4, 0.6],
    [8.4, 0.6],
  ];
  for (const [x, k] of boxes) {
    const box = new T.Mesh(
      new T.PlaneGeometry(0.55, 5.2),
      new T.MeshBasicMaterial({
        color: new T.Color(1, 0.94, 0.85).multiplyScalar(L.box * k),
        fog: false,
      }),
    );
    box.position.set(x, 3.2, wallZ + 0.07);
    box.userData.dimMirror = 0.3;
    still.add(box);
    const frame = new T.Mesh(
      new T.BoxGeometry(0.7, 5.4, 0.1),
      new T.MeshStandardMaterial({ color: 0x0c0c0d, roughness: 0.5 }),
    );
    frame.position.set(x, 3.2, wallZ - 0.04);
    still.add(frame);
    const wash = new T.SpotLight(0xffe9d2, 15 * k, 16, 0.5, 1, 1.4);
    wash.position.set(x, 3.2, wallZ + 0.4);
    wash.target.position.set(x * 0.15, 0.5, 0);
    g.add(wash, wash.target);
  }
  const plinth = new T.Mesh(new T.CylinderGeometry(0.62, 0.66, PLINTH_TOP, 96), lacquer());
  plinth.position.y = PLINTH_TOP / 2;
  plinth.castShadow = plinth.receiveShadow = true;
  still.add(plinth);
  const seam = new T.Mesh(new T.TorusGeometry(0.62, 0.006, 8, 160), brass());
  seam.rotation.x = Math.PI / 2;
  seam.position.y = PLINTH_TOP - 0.04;
  still.add(seam);
  g.add(mirrorOf(still, 0));

  const floorMat = new T.MeshPhysicalMaterial({
    map: stoneTexture(),
    color: 0xffffff,
    transparent: true,
    opacity: 0.88,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.16,
    envMapIntensity: 0.24,
  });
  calmFloor(floorMat);
  const floor = new T.Mesh(new T.CircleGeometry(30, 96), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.renderOrder = 2;
  g.add(floor);

  const key = new T.SpotLight(0xfff1e0, 80, 14, 0.34, 0.8, 1.6);
  key.position.set(0.6, 6, 1.2);
  key.target.position.set(0, PLINTH_TOP, 0);
  if (tier.shadows) {
    key.castShadow = true;
    key.shadow.mapSize.set(tier.shadows, tier.shadows);
    key.shadow.bias = -0.0004;
    key.shadow.radius = 6;
  }
  g.add(key, key.target);
  g.add(new T.HemisphereLight(0x3a352e, 0x060606, L.hemi));

  if (tier.haze) {
    const haze = beam(0xffe6c8, 0.9, 1.9, 6.2, 0.028);
    haze.position.set(0.3, 3.4, 0.4);
    haze.rotation.z = -0.1;
    g.add(haze);
  }
  let dust: T.Points | null = null;
  if (tier.dust) {
    const n = tier.dust,
      p = new Float32Array(n * 3),
      r = rng(9);
    for (let i = 0; i < n; i++) {
      const a = r() * 6.28,
        rad = Math.sqrt(r());
      p[i * 3] = Math.cos(a) * rad;
      p[i * 3 + 1] = r() * 6;
      p[i * 3 + 2] = Math.sin(a) * rad;
    }
    const dg = new T.BufferGeometry();
    dg.setAttribute('position', new T.BufferAttribute(p, 3));
    dust = new T.Points(
      dg,
      new T.PointsMaterial({
        color: 0xffe4c4,
        size: 0.012,
        transparent: true,
        opacity: 0.5,
        blending: T.AdditiveBlending,
        depthWrite: false,
      }),
    );
    g.add(dust);
  }
  scene.add(g);
  return {
    id: 'atelier',
    group: g,
    mirrorY: 0,
    exposure: LOOK.exposure,
    bloom: LOOK.bloom,
    envGain: LOOK.liquid.gain,
    cam: { y: 1.3, look: 0.98 },
    update(t) {
      if (dust) dust.rotation.y = t * 0.02;
    },
  };
}

export function voidRoom(scene: T.Scene): Room {
  const g = new T.Group(),
    Y = PLINTH_TOP;
  scene.background = new T.Color(0x070708);
  scene.fog = null;
  const fade = canvasTex(512, 512, (c, w, h) => {
    const gr = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, '#fff');
    gr.addColorStop(0.5, '#aaa');
    gr.addColorStop(1, '#000');
    c.fillStyle = gr;
    c.fillRect(0, 0, w, h);
  });
  const floor = new T.Mesh(
    new T.CircleGeometry(4.5, 96),
    new T.MeshPhysicalMaterial({
      color: 0x0c0c0e,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      transparent: true,
      opacity: 0.9,
      alphaMap: fade,
      envMapIntensity: 0.45,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = Y;
  floor.renderOrder = 2;
  g.add(floor);
  const key = new T.SpotLight(0xffffff, 40, 14, 0.42, 1, 1.6);
  key.position.set(0.8, 6, 2.5);
  key.target.position.set(0, Y, 0);
  g.add(key, key.target);
  g.add(new T.HemisphereLight(0x34343a, 0x060606, 0.5));
  scene.add(g);
  return {
    id: 'void',
    group: g,
    mirrorY: Y,
    exposure: LOOK.exposure,
    bloom: LOOK.bloom,
    envGain: LOOK.liquid.gain,
    cam: { y: 1.3, look: 0.98 },
    update() {},
  };
}
