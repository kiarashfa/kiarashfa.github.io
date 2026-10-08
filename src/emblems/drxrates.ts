// A 35 mm reel with film running off it: the ledger of everything watched.
import * as T from 'three';
import { TAU, canvasTex, mesh, ribbon, v3, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M) => {
  const g = new T.Group();
  const s = new T.Shape();
  s.absarc(0, 0, 0.34, 0, TAU, false);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + 0.3,
      h = new T.Path();
    h.absarc(Math.cos(a) * 0.19, Math.sin(a) * 0.19, 0.075, 0, TAU, true);
    s.holes.push(h);
  }
  const hub = new T.Path();
  hub.absarc(0, 0, 0.03, 0, TAU, true);
  s.holes.push(hub);
  const reel = mesh(
    new T.ExtrudeGeometry(s, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      curveSegments: 64,
    }),
    M.silver(),
  );
  reel.position.set(0, 0.45, -0.015);
  g.add(reel);
  const core = mesh(new T.CylinderGeometry(0.27, 0.27, 0.022, 96), M.lacquer());
  core.rotation.x = Math.PI / 2;
  core.position.set(0, 0.45, 0);
  g.add(core);
  const film = canvasTex(64, 1024, (c, w, h) => {
    c.fillStyle = '#2a1f14';
    c.fillRect(0, 0, w, h);
    c.fillStyle = '#d9c29a';
    for (let y = 6; y < h; y += 22) {
      c.fillRect(4, y, 8, 12);
      c.fillRect(w - 12, y, 8, 12);
    }
    c.fillStyle = 'rgba(201,168,106,.55)';
    for (let y = 0; y < h; y += 90) c.fillRect(16, y + 6, w - 32, 78);
  });
  film.wrapS = film.wrapT = T.RepeatWrapping;
  const pts: T.Vector3[] = [];
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    pts.push(
      v3(0.3 + t * 0.32, 0.45 - t * 0.44 + Math.sin(t * 4) * 0.03, 0.02 + Math.sin(t * 5) * 0.08),
    );
  }
  g.add(
    new T.Mesh(
      ribbon(new T.CatmullRomCurve3(pts), 100, 0.03, 'z', 3),
      new T.MeshStandardMaterial({
        map: film,
        side: T.DoubleSide,
        roughness: 0.35,
        metalness: 0.2,
      }),
    ),
  );
  g.add(mesh(new T.BoxGeometry(0.16, 0.1, 0.12), M.lacquer()).translateY(0.05));
  g.add(mesh(new T.CylinderGeometry(0.015, 0.015, 0.32, 16), M.silver()).translateY(0.25));
  return g;
};

export default build;
