// Sound made visible: a vinyl disc ringed by golden bars that breathe with
// the music.
import * as T from 'three';
import { TAU, mesh, plinth, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M) => {
  const g = new T.Group(),
    disc = new T.Group();
  disc.add(mesh(new T.CylinderGeometry(0.3, 0.3, 0.012, 96), M.lacquer()));
  disc.add(mesh(new T.CylinderGeometry(0.1, 0.1, 0.014, 64), M.gold()));
  disc.add(mesh(new T.CylinderGeometry(0.012, 0.012, 0.03, 16), M.silver()));
  const bars: T.Mesh[] = [],
    n = 72;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU,
      b = mesh(new T.BoxGeometry(0.012, 1, 0.012), M.gold());
    b.geometry.translate(0, 0.5, 0);
    b.position.set(Math.cos(a) * 0.32, 0, Math.sin(a) * 0.32);
    b.rotation.set(0, -a, -Math.PI / 2);
    disc.add(b);
    bars.push(b);
  }
  disc.rotation.x = Math.PI / 2 - 0.5;
  disc.position.y = 0.5;
  g.add(disc);
  g.add(mesh(new T.CylinderGeometry(0.01, 0.014, 0.3, 16), M.silver()).translateY(0.15));
  g.add(plinth(M, 0.14, 0.03).translateY(0.015));
  const tick = (t: number) =>
    bars.forEach((b, i) => {
      const h = 0.03 + 0.09 * Math.abs(Math.sin(t * 2.2 + i * 0.37) * Math.sin(t * 1.3 + i * 0.11));
      b.scale.set(1, h, 1);
    });
  g.userData.tick = tick;
  tick(0);
  return g;
};

export default build;
