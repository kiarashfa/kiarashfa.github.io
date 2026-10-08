// Still portraits of emblems on a transparent ground, rendered once by a
// second small renderer: in pure mercury for siblings, in colour for the
// project whose page it is.
import * as T from 'three';
import type { EmblemProject } from '../emblems';
import { fitted, mercuryGeometry, mercuryMaterial } from './emblem';
import { makeEnvironment } from './environment';
import { LOOK } from './look';

const SIZE = 256;
let ctx: { renderer: T.WebGLRenderer; scene: T.Scene; camera: T.PerspectiveCamera } | null = null;
const cache = new Map<string, Promise<string>>();
let queue: Promise<unknown> = Promise.resolve();

function setup() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const renderer = new T.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(SIZE, SIZE, false);
  renderer.toneMapping = LOOK.toneMapping;
  renderer.toneMappingExposure = LOOK.exposure * 1.3;
  renderer.setClearColor(0x000000, 0);
  const scene = new T.Scene();
  scene.environment = makeEnvironment(renderer).pmrem;
  const key = new T.DirectionalLight(0xfff1e0, 1.4);
  key.position.set(-2, 4, 3);
  const front = new T.DirectionalLight(0xe8ecf2, 0.6);
  front.position.set(1, 1, 4);
  scene.add(key, front, new T.HemisphereLight(0x8a8478, 0x111111, 0.7));
  return { renderer, scene, camera: new T.PerspectiveCamera(24, 1, 0.05, 50) };
}

async function shoot(p: EmblemProject, colour: boolean): Promise<string> {
  ctx ??= setup();
  const { renderer, scene, camera } = ctx;
  let obj: T.Object3D;
  if (colour) {
    obj = (await fitted(p)).obj;
    obj.traverse((o) => {
      if (o instanceof T.Mesh)
        ([] as T.Material[]).concat(o.material).forEach((m) => (m.side = T.DoubleSide));
    });
  } else obj = new T.Mesh(await mercuryGeometry(p), mercuryMaterial());
  const g = new T.Group();
  g.add(obj);
  g.rotation.y = 0.55;
  scene.add(g);
  g.updateMatrixWorld(true);
  const box = new T.Box3().setFromObject(g),
    centre = box.getCenter(new T.Vector3()),
    size = box.getSize(new T.Vector3());
  const span = Math.max(size.y * 0.95, Math.hypot(size.x, size.z) * 0.78);
  const distance = (span / 2 / Math.tan(T.MathUtils.degToRad(12))) * 1.12;
  camera.position.copy(centre).addScaledVector(new T.Vector3(0, 0.32, 1).normalize(), distance);
  camera.lookAt(centre);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');
  scene.remove(g);
  return url;
}

/** A data URL of the emblem's portrait; one at a time, so the page never stalls. */
export function portrait(p: EmblemProject, colour = false): Promise<string> {
  const key = `${p.slug}:${colour ? 'colour' : 'mercury'}`;
  let shot = cache.get(key);
  if (!shot) {
    shot = queue
      .then(() => new Promise<void>((r) => requestAnimationFrame(() => r())))
      .then(() => shoot(p, colour));
    queue = shot.catch(() => undefined);
    cache.set(key, shot);
  }
  return shot;
}
