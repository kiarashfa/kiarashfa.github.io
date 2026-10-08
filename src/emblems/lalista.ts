// Spanish opens its exclamations and questions: ¡ and ¿ as two monoline
// enamel glyphs.
import * as T from 'three';
import { mesh, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M) => {
  const g = new T.Group(),
    teal = M.enamel(0x4b9c8b),
    amber = M.enamel(0xc47f25),
    r = 0.05;
  g.add(
    mesh(new T.SphereGeometry(0.062, 32, 24), teal)
      .translateY(0.82)
      .translateX(-0.2),
  );
  g.add(
    mesh(new T.CapsuleGeometry(r, 0.44, 8, 24), teal)
      .translateY(0.37)
      .translateX(-0.2),
  );
  const qx = 0.1;
  g.add(
    mesh(new T.SphereGeometry(0.062, 32, 24), amber)
      .translateY(0.82)
      .translateX(qx),
  );
  g.add(
    mesh(new T.CapsuleGeometry(r, 0.1, 8, 24), amber)
      .translateY(0.6)
      .translateX(qx),
  );
  const arc = 1.45 * Math.PI,
    hook = mesh(new T.TorusGeometry(0.15, r, 20, 96, arc), amber);
  hook.rotation.z = Math.PI / 2;
  hook.position.set(qx, 0.4, 0);
  g.add(hook);
  const end = Math.PI / 2 + arc;
  g.add(
    mesh(new T.SphereGeometry(r, 24, 16), amber)
      .translateX(qx + Math.cos(end) * 0.15)
      .translateY(0.4 + Math.sin(end) * 0.15),
  );
  g.add(
    mesh(new T.BoxGeometry(0.78, 0.04, 0.3), M.porcelain())
      .translateY(0.02)
      .translateX(-0.04),
  );
  return g;
};

export default build;
