// A rifle cartridge in brass and copper, standing to attention.
import * as T from 'three';
import { lathe, mesh, plinth, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M) => {
  const g = new T.Group();
  const caseProfile: [number, number][] = [
    [0, 0],
    [0.105, 0],
    [0.11, 0.01],
    [0.11, 0.04],
    [0.088, 0.05],
    [0.088, 0.065],
    [0.112, 0.075],
    [0.106, 0.58],
    [0.098, 0.6],
    [0.064, 0.66],
    [0.062, 0.75],
    [0, 0.75],
  ];
  g.add(mesh(lathe(caseProfile), M.brass()));
  const bullet: [number, number][] = [
    [0, 0.74],
    [0.06, 0.74],
  ];
  for (let i = 1; i <= 20; i++) {
    const t = i / 20;
    bullet.push([0.06 * Math.cos((t * Math.PI) / 2) ** 0.7, 0.74 + t * 0.3]);
  }
  g.add(mesh(lathe(bullet), M.copper()));
  g.add(mesh(new T.CylinderGeometry(0.028, 0.028, 0.006, 32), M.copper()).translateY(0.003));
  g.position.y = 0.02;
  const w = new T.Group();
  w.add(g);
  w.add(plinth(M, 0.2, 0.03).translateY(0.015));
  return w;
};

export default build;
