// Stands in for a project whose own emblem has not been made yet: a single
// mercury drop on a slim stand, so a new project never breaks a page.
import * as T from 'three';
import { mesh, plinth, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M) => {
  const g = new T.Group();
  const drop = mesh(new T.SphereGeometry(0.2, 64, 48), M.silver());
  drop.scale.set(1, 1.08, 1);
  drop.position.y = 0.62;
  g.add(drop);
  g.add(mesh(new T.CylinderGeometry(0.012, 0.016, 0.4, 16), M.silver()).translateY(0.22));
  g.add(plinth(M, 0.15, 0.04).translateY(0.02));
  return g;
};

export default build;
