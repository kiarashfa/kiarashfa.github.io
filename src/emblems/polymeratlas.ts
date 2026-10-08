// A globe wound from one continuous gold wire, tilted on a lacquer stand:
// a long chain that becomes a world.
import * as T from 'three';
import { TAU, mesh, plinth, tube, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M) => {
  const g = new T.Group(),
    R = 0.36,
    pts: [number, number, number][] = [];
  for (let i = 0; i <= 900; i++) {
    const t = i / 900,
      ph = 0.04 + t * (Math.PI - 0.08),
      th = t * TAU * 14;
    pts.push([R * Math.sin(ph) * Math.cos(th), R * Math.cos(ph), R * Math.sin(ph) * Math.sin(th)]);
  }
  const globe = new T.Group();
  globe.add(mesh(tube(pts, 0.0065, 1800), M.gold()));
  const meridian = mesh(new T.TorusGeometry(R + 0.035, 0.007, 12, 160), M.silver());
  meridian.rotation.y = Math.PI / 2;
  globe.add(meridian);
  globe.rotation.z = 0.41;
  globe.position.y = 0.62;
  g.add(globe);
  const arm = mesh(new T.TorusGeometry(R + 0.035, 0.012, 12, 120, Math.PI), M.silver());
  arm.position.y = 0.62;
  arm.rotation.z = Math.PI / 2 + 0.41;
  g.add(arm);
  g.add(mesh(new T.CylinderGeometry(0.012, 0.016, 0.22, 16), M.silver()).translateY(0.15));
  g.add(plinth(M, 0.17, 0.04).translateY(0.02));
  return g;
};

export default build;
