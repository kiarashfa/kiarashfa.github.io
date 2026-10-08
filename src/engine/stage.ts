// The stage: one renderer, one scene, the room, the liquid and the emblem in
// view. It is created once and lives across page changes.
import * as T from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import type { EmblemProject } from '../emblems';
import { emblemUniforms, makeEmblem, type StageEmblem } from './emblem';
import { makeEnvironment } from './environment';
import { fitBound, liquidMesh, liquidUniforms } from './liquid';
import { LOOK, PLINTH_TOP, TIERS, type TierName } from './look';
import { atelier, voidRoom, type Room } from './rooms';

/** Replaces any NaN or infinite pixel before the bloom spreads it across the frame. */
const GuardShader = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); if (any(isnan(c)) || any(isinf(c))) c = vec4(0., 0., 0., 1.); gl_FragColor = vec4(min(c.rgb, vec3(40.)), c.a); }`,
};

const FOV = { landscape: 30, portrait: 46 };

export type Stage = Awaited<ReturnType<typeof createStage>>;

export async function createStage(
  canvas: HTMLCanvasElement,
  initialTier: TierName,
  progress: (p: number, label: string) => void,
) {
  let tier = initialTier,
    cfg = TIERS[tier];
  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, cfg.dpr));
  renderer.toneMapping = LOOK.toneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  const scene = new T.Scene(),
    camera = new T.PerspectiveCamera(FOV.landscape, 1, 0.05, 600);

  progress(0.15, 'Polishing the mercury');
  const env = makeEnvironment(renderer);
  scene.environment = env.pmrem;

  const U = liquidUniforms(
    env.cube,
    LOOK.liquid.gain,
    LOOK.liquid.lod,
    LOOK.liquid.spec,
    cfg.steps,
  );
  const liquid = liquidMesh(U);
  scene.add(liquid);

  // the emblem on the plinth, and its twin under the glossy floor
  const EU = emblemUniforms();
  const holder = new T.Group();
  holder.position.y = PLINTH_TOP;
  scene.add(holder);
  const mirrorHolder = new T.Group();
  mirrorHolder.scale.y = -1;
  scene.add(mirrorHolder);
  const emblems = new Map<string, Promise<StageEmblem>>();
  let current: StageEmblem | null = null;

  const prepare = (p: EmblemProject) => {
    let e = emblems.get(p.slug);
    if (!e) emblems.set(p.slug, (e = makeEmblem(p, EU)));
    return e;
  };
  async function setProject(p: EmblemProject): Promise<StageEmblem> {
    const e = await prepare(p);
    if (current && current !== e) {
      holder.remove(current.group);
      mirrorHolder.remove(current.mirror);
    }
    holder.add(e.group);
    mirrorHolder.add(e.mirror);
    current = e;
    U.uSdf.value = e.sdf.tex;
    U.uBoxMin.value.copy(e.sdf.min);
    U.uBoxMax.value.copy(e.sdf.max);
    return e;
  }

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new ShaderPass(GuardShader));
  const bloom = new UnrealBloomPass(new T.Vector2(1, 1), ...LOOK.bloom);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let room: Room | null = null;
  function setRoom(): void {
    if (room) {
      scene.remove(room.group);
      room.group.traverse((o) => {
        if (o instanceof T.Mesh) o.geometry.dispose();
      });
    }
    room = cfg.room === 'atelier' ? atelier(scene, cfg) : voidRoom(scene);
    renderer.toneMappingExposure = room.exposure;
    U.uEnvGain.value = room.envGain;
    U.uMirrorY.value = room.mirrorY;
    mirrorHolder.position.y = 2 * room.mirrorY - PLINTH_TOP;
    [bloom.strength, bloom.radius, bloom.threshold] = room.bloom;
    scene.traverse((o) => {
      if (o instanceof T.Mesh)
        ([] as T.Material[]).concat(o.material).forEach((m) => (m.needsUpdate = true));
    });
  }

  let shift: [number, number] = [0, 0];
  function applyShift(): void {
    const w = innerWidth,
      h = innerHeight;
    if (shift[0] || shift[1]) camera.setViewOffset(w, h, shift[0] * w, shift[1] * h, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  function resize(): void {
    const w = innerWidth,
      h = innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.fov = w < h ? FOV.portrait : FOV.landscape;
    applyShift();
  }
  addEventListener('resize', resize);
  progress(0.3, 'Lighting the room');

  const v = new T.Vector3();
  const stage = {
    renderer,
    scene,
    camera,
    U,
    EU,
    holder,
    prepare,
    setProject,
    get room(): Room {
      return room!;
    },
    get tier(): TierName {
      return tier;
    },
    get current(): StageEmblem | null {
      return current;
    },
    setShift(x: number, y: number) {
      if (x === shift[0] && y === shift[1]) return;
      shift = [x, y];
      applyShift();
    },
    setTier(t: TierName) {
      tier = t;
      cfg = TIERS[t];
      renderer.setPixelRatio(Math.min(devicePixelRatio, cfg.dpr));
      U.uSteps.value = cfg.steps;
      resize();
      setRoom();
    },
    resize,
    /**
     * Compile every material for the composer's own buffer, which is what the
     * frames render into: compiling for the screen would leave the real
     * variants to the first frame, which takes seconds on some systems.
     */
    async compile() {
      const prev = renderer.getRenderTarget();
      renderer.setRenderTarget(composer.readBuffer);
      try {
        await renderer.compileAsync(scene, camera);
      } catch {
        /* compiled lazily on the first frame instead */
      }
      renderer.setRenderTarget(prev);
    },
    /** Screen position of a point in the scene, in CSS pixels. */
    project(p: T.Vector3): [number, number] {
      const q = v.copy(p).project(camera);
      return [(q.x * 0.5 + 0.5) * innerWidth, (-q.y * 0.5 + 0.5) * innerHeight];
    },
    frame(t: number) {
      U.uTime.value = t;
      room!.update(t);
      if (current) {
        current.tick(t);
        U.uObjRot.value = -holder.rotation.y;
        mirrorHolder.rotation.y = holder.rotation.y;
        U.uObjPos.value.set(holder.position.x, PLINTH_TOP, holder.position.z);
      }
      liquid.visible = fitBound(U) || U.uMorph.value > 0;
      composer.render();
    },
  };
  setRoom();
  resize();
  return stage;
}
