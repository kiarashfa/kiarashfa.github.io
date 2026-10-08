// The room every reflection sees: the atelier at night as a dark studio.
// Soft-edged strips (a smooth falloff instead of hard rectangles) over a dome
// that is dark but never black, and a dim bounce reaching below the horizon:
// a face turned to the viewer and seen from above reflects downwards, so it
// must find light there too.
import * as T from 'three';
import { LOOK } from './look';

function softPanelTexture(): T.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!,
    d = g.createImageData(128, 128);
  for (let y = 0; y < 128; y++)
    for (let x = 0; x < 128; x++) {
      const u = (x + 0.5) / 64 - 1,
        v = (y + 0.5) / 64 - 1;
      const k =
        Math.pow(
          Math.max(0, 1 - Math.pow(Math.abs(u), 8)) * Math.max(0, 1 - Math.pow(Math.abs(v), 8)),
          1.3,
        ) * 255;
      const i = (y * 128 + x) * 4;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = k;
      d.data[i + 3] = 255;
    }
  g.putImageData(d, 0, 0);
  return new T.CanvasTexture(c);
}

function nightStudio(): T.Scene {
  const s = new T.Scene(),
    soft = softPanelTexture();
  const dome = new T.Mesh(
    new T.SphereGeometry(40, 64, 32),
    new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      vertexShader:
        'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
      fragmentShader: `varying vec3 vP; void main(){ float y = vP.y;
        vec3 top = vec3(.085, .085, .095), hor = vec3(.032, .031, .034), bot = vec3(.018, .018, .02);
        vec3 c = y > 0. ? mix(hor, top, smoothstep(0., .8, y)) : mix(hor, bot, smoothstep(0., .3, -y));
        gl_FragColor = vec4(c, 1.); }`,
    }),
  );
  s.add(dome);
  const panel = (
    w: number,
    h: number,
    intensity: number,
    x: number,
    y: number,
    z: number,
    color = 0xfff1e2,
    look: [number, number, number] = [0, 1.2, 0],
  ) => {
    const p = new T.Mesh(
      new T.PlaneGeometry(w, h),
      new T.MeshBasicMaterial({
        map: soft,
        color: new T.Color(color).multiplyScalar(intensity),
        side: T.DoubleSide,
        transparent: true,
        blending: T.AdditiveBlending,
        depthWrite: false,
      }),
    );
    p.position.set(x, y, z);
    p.lookAt(...look);
    s.add(p);
  };
  // the atelier's softboxes: bright, crisp strips
  for (const [x, k] of [
    [-4.4, 1],
    [4.4, 1],
    [-8.4, 0.65],
    [8.4, 0.65],
  ] as const)
    panel(0.9, 6, 5.5 * k, x, 3.4, -7);
  panel(4.5, 2.6, 2.6, 0, 7, -0.4); // the skylight above the plinth
  panel(9, 6, 1.2, -9, 7, 8); // a soft key, high front left
  panel(2, 7, 1.6, -10.5, 3.4, 1.5); // side strips
  panel(2, 7, 1.1, 10.5, 3.4, -0.5);
  panel(26, 1.6, 0.9, 0, 0.6, 10, 0xd8e2ff); // a cool low strip behind the viewer
  panel(34, 16, 0.5, 0, -1.4, 14, 0xe6ebf2); // the dim bounce card, below the horizon
  for (const sd of [-1, 1]) panel(14, 12, 0.28, sd * 15, -0.5, 3, 0xe6ebf2);
  return s;
}

export interface Environment {
  /** Prefiltered environment for physically based materials. */
  pmrem: T.Texture;
  /** A sharp cube map for the raymarched liquid. */
  cube: T.CubeTexture;
}

export function makeEnvironment(renderer: T.WebGLRenderer): Environment {
  const room = nightStudio();
  const generator = new T.PMREMGenerator(renderer);
  const pmrem = generator.fromScene(room, LOOK.envSigma).texture;
  generator.dispose();
  const target = new T.WebGLCubeRenderTarget(256, {
    type: T.HalfFloatType,
    generateMipmaps: true,
    minFilter: T.LinearMipmapLinearFilter,
  });
  const camera = new T.CubeCamera(0.1, 100, target);
  camera.position.set(0, 1.2, 0);
  camera.update(renderer, room);
  return { pmrem, cube: target.texture };
}
