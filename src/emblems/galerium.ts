// A gilded arch, its two leaves swung open onto warm light.
import * as T from 'three';
import { mesh, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M) => {
  const g = new T.Group(),
    W = 0.32,
    H = 0.5,
    R = W / 2,
    m = 0.06;
  const arch = (w: number, h: number, r: number, cx = 0) => {
    const sh = new T.Shape();
    sh.moveTo(cx - w / 2, 0);
    sh.lineTo(cx - w / 2, h);
    sh.absarc(cx, h, r, Math.PI, 0, true);
    sh.lineTo(cx + w / 2, 0);
    sh.lineTo(cx - w / 2, 0);
    return sh;
  };
  const outer = arch(W + m * 2, H, R + m);
  outer.holes.push(arch(W, H, R));
  g.add(
    mesh(
      new T.ExtrudeGeometry(outer, {
        depth: 0.07,
        bevelEnabled: true,
        bevelSize: 0.01,
        bevelThickness: 0.01,
        bevelSegments: 3,
        curveSegments: 48,
      }),
      M.gold(),
    ).translateZ(-0.035),
  );
  const light = new T.Mesh(
    new T.ShapeGeometry(arch(W, H, R), 48),
    new T.MeshBasicMaterial({ color: 0xffe3a8, toneMapped: false }),
  );
  light.position.z = -0.03;
  g.add(light);

  const leafShape = new T.Shape();
  leafShape.moveTo(0, 0);
  leafShape.lineTo(W / 2, 0);
  leafShape.lineTo(W / 2, H + R);
  leafShape.absarc(W / 2, H, R, Math.PI / 2, Math.PI, false);
  leafShape.lineTo(0, 0);
  for (const s of [-1, 1]) {
    const lg = new T.ExtrudeGeometry(leafShape, {
      depth: 0.012,
      bevelEnabled: false,
      curveSegments: 24,
    });
    if (s > 0) lg.scale(-1, 1, 1);
    const leaf = mesh(lg, M.gold());
    leaf.position.set((s * W) / 2, 0, -0.006);
    leaf.rotation.y = s * 0.78;
    g.add(leaf);
  }
  const step = mesh(new T.BoxGeometry(W + m * 2 + 0.14, 0.05, 0.3), M.enamel(0x1b2140));
  step.position.y = -0.025;
  g.add(step);
  g.position.y = 0.05;
  const w = new T.Group();
  w.add(g);
  w.scale.setScalar(1.15);
  return w;
};

export default build;
