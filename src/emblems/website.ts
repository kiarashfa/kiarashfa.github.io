// KF, cast: the mark of my personal site, a mirrored K and an F whose outer
// bars run off like bonds, cast as a bevelled bar and held up on a slim stand.
// In colour it takes the site's own teal.
import * as T from 'three';
import { hex, mesh, plinth, type EmblemBuilder } from './_kit';

const K: [number, number][] = [
  [0, 227],
  [78, 227],
  [165, 107],
  [250, 103],
  [130, 250],
  [250, 400],
  [168, 395],
  [78, 272],
  [0, 272],
];
const F: [number, number][] = [
  [260, 103],
  [435, 115],
  [476, 165],
  [335, 165],
  [335, 240],
  [512, 240],
  [512, 285],
  [335, 290],
  [333, 322],
  [260, 402],
];

const build: EmblemBuilder = (M, P) => {
  const g = new T.Group(),
    s = (1 / 256) * 0.5;
  const shape = (pts: [number, number][]) => {
    const sh = new T.Shape();
    pts.forEach(([x, y], i) =>
      i ? sh.lineTo((x - 256) * s, -(y - 256) * s) : sh.moveTo((x - 256) * s, -(y - 256) * s),
    );
    sh.closePath();
    return sh;
  };
  const geo = new T.ExtrudeGeometry([shape(K), shape(F)], {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.022,
    bevelSegments: 8,
    curveSegments: 4,
  });
  geo.center();
  const kf = mesh(geo, M.enamel(hex(P.color)));
  kf.position.y = 0.64;
  kf.rotation.y = -0.3;
  g.add(kf);
  g.add(mesh(new T.CylinderGeometry(0.014, 0.014, 0.36, 16), M.silver()).translateY(0.2));
  g.add(plinth(M, 0.15, 0.04).translateY(0.02));
  return g;
};

export default build;
