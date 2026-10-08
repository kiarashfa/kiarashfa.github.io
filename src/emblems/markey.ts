// A fastback coupe in polished aluminium, the wind tunnel's streamlines
// hugging its roof.
import * as T from 'three';
import { mesh, tube, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M) => {
  const g = new T.Group();
  const body = new T.Shape();
  body.moveTo(-0.56, 0.11);
  body.bezierCurveTo(-0.59, 0.17, -0.5, 0.2, -0.38, 0.215);
  body.bezierCurveTo(-0.25, 0.228, -0.16, 0.236, -0.1, 0.248);
  body.lineTo(0.36, 0.258);
  body.bezierCurveTo(0.46, 0.25, 0.53, 0.23, 0.565, 0.2);
  body.bezierCurveTo(0.58, 0.17, 0.575, 0.12, 0.55, 0.11);
  body.lineTo(-0.56, 0.11);
  const bg = new T.ExtrudeGeometry(body, {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.045,
    bevelSegments: 8,
    curveSegments: 40,
  });
  bg.translate(0, 0, -0.14);
  g.add(mesh(bg, M.silver()));

  const cab = new T.Shape();
  cab.moveTo(-0.13, 0.24);
  cab.bezierCurveTo(-0.05, 0.3, 0.02, 0.335, 0.12, 0.337);
  cab.bezierCurveTo(0.24, 0.336, 0.34, 0.3, 0.42, 0.25);
  cab.lineTo(-0.13, 0.24);
  const cg = new T.ExtrudeGeometry(cab, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.03,
    bevelSegments: 6,
    curveSegments: 32,
  });
  cg.translate(0, 0, -0.1);
  g.add(
    mesh(
      cg,
      new T.MeshPhysicalMaterial({
        color: 0x0d1117,
        metalness: 0.3,
        roughness: 0.05,
        clearcoat: 1,
      }),
    ),
  );

  for (const [x, z] of [
    [-0.33, 0.2],
    [0.33, 0.2],
    [-0.33, -0.2],
    [0.33, -0.2],
  ] as const) {
    const w = mesh(new T.CylinderGeometry(0.088, 0.088, 0.06, 40), M.rubber());
    w.rotation.x = Math.PI / 2;
    w.position.set(x, 0.088, z);
    g.add(w);
    const hub = mesh(new T.CylinderGeometry(0.05, 0.05, 0.064, 24), M.gold());
    hub.rotation.x = Math.PI / 2;
    hub.position.set(x, 0.088, z);
    g.add(hub);
  }

  // the streamlines follow the roof line
  const outline = body.getPoints(60).concat(cab.getPoints(40));
  const top = (x: number) => {
    let y = 0.11;
    for (const p of outline) if (Math.abs(p.x - x) < 0.03) y = Math.max(y, p.y);
    return y;
  };
  for (let k = 0; k < 6; k++) {
    const z = (k - 2.5) * 0.06,
      off = 0.035 + (k % 3) * 0.03,
      pts: [number, number, number][] = [];
    for (let i = 0; i <= 44; i++) {
      const x = -0.85 + (i / 44) * 1.75,
        inside = x > -0.6 && x < 0.6;
      const lead = Math.max(0, 1 - Math.abs(x + 0.6) * 4) * 0.05;
      pts.push([x, (inside ? top(x) : 0.16) + off + lead + (x > 0.6 ? (x - 0.6) * -0.05 : 0), z]);
    }
    g.add(mesh(tube(pts, 0.0022, 120), M.enamel(0x9fd0ff), false));
  }
  g.add(mesh(new T.BoxGeometry(1.35, 0.02, 0.62), M.lacquer()).translateY(0.01));
  return g;
};

export default build;
