// A crystal coupe holding amber, with a twist of peel on the rim.
import * as T from 'three';
import { TAU, hex, lathe, mesh, tube, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M, P) => {
  const g = new T.Group();
  const glass: [number, number][] = [
    [0, 0],
    [0.2, 0],
    [0.21, 0.012],
    [0.03, 0.03],
    [0.022, 0.1],
    [0.02, 0.36],
    [0.05, 0.4],
    [0.2, 0.47],
    [0.31, 0.56],
    [0.33, 0.6],
    [0.32, 0.6],
    [0.29, 0.56],
    [0.18, 0.48],
    [0.04, 0.415],
    [0, 0.41],
  ];
  g.add(mesh(lathe(glass), M.glass()));
  const liq: [number, number][] = [[0, 0.418]];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    liq.push([0.04 + t * 0.245, 0.418 + t * t * 0.12]);
  }
  liq.push([0, 0.538]);
  g.add(mesh(lathe(liq), M.liquid(hex(P.color)), false));
  const peel: [number, number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60,
      a = t * TAU * 2.2;
    peel.push([0.3 + Math.cos(a) * 0.03, 0.62 - t * 0.22, Math.sin(a) * 0.03 + 0.02]);
  }
  g.add(mesh(tube(peel, 0.009, 120), M.enamel(0xe58a2a)));
  g.scale.setScalar(1.35);
  return g;
};

export default build;
