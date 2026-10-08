// A black monolith on a black river, the digital rain falling inside it, and
// a spoon that bends.
import * as T from 'three';
import { TAU, canvasTex, mesh, tube, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M, P) => {
  const g = new T.Group();
  const cols = 24,
    drops = Array.from({ length: cols }, (_, i) => (i * 37) % 40);
  const rain = canvasTex(256, 640, (c, w, h) => {
    c.fillStyle = '#000';
    c.fillRect(0, 0, w, h);
  });
  const draw = (t: number) => {
    const c = rain.userData.ctx;
    c.fillStyle = 'rgba(0,0,0,.18)';
    c.fillRect(0, 0, 256, 640);
    c.font = '18px monospace';
    for (let i = 0; i < cols; i++) {
      const y = ((drops[i]! + t * (6 + (i % 5))) % 40) * 18;
      c.fillStyle = '#c9ffd6';
      c.fillText(String.fromCharCode(0x30a0 + ((i * 13 + Math.floor(t * 9)) % 90)), i * 10.6, y);
      c.fillStyle = P.color;
      c.fillText(
        String.fromCharCode(0x30a0 + ((i * 7 + Math.floor(t * 5)) % 90)),
        i * 10.6,
        y - 18,
      );
    }
    rain.needsUpdate = true;
  };
  for (let k = 0; k < 40; k++) draw(k * 0.1);
  g.add(mesh(new T.BoxGeometry(0.32, 0.9, 0.1), M.lacquer()).translateY(0.47));
  const face = new T.Mesh(new T.PlaneGeometry(0.28, 0.86), M.screen(rain));
  face.position.set(0, 0.47, 0.051);
  g.add(face);
  const river = mesh(
    new T.CylinderGeometry(0.45, 0.45, 0.01, 96),
    new T.MeshPhysicalMaterial({ color: 0x020403, metalness: 0.2, roughness: 0.05, clearcoat: 1 }),
  );
  river.position.y = 0.005;
  g.add(river);

  // there is no spoon: a silver spoon standing up from a small base, its upper half bent towards the viewer
  const spoon = new T.Group(),
    silver = M.silver(),
    B = 1.0;
  const hpts: [number, number, number][] = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30,
      a = (Math.max(0, t - 0.5) / 0.5) * B,
      L = 0.2;
    hpts.push(
      t <= 0.5
        ? [0, t * L, 0]
        : [
            ((1 - Math.cos(a)) / B) * (t - 0.5) * L * 1.6,
            0.5 * L + (Math.sin(a) / B) * (t - 0.5) * L,
            0,
          ],
    );
  }
  spoon.add(mesh(tube(hpts, 0.0055, 60), silver));
  const tip = new T.Vector3(...hpts[30]!),
    dir = new T.Vector3(Math.sin(B), Math.cos(B), 0),
    up = new T.Vector3(0, 0, -1);
  const bowl = mesh(
    new T.SphereGeometry(0.065, 32, 16, 0, TAU, 0, 0.95),
    new T.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.06,
      side: T.DoubleSide,
    }),
  );
  bowl.geometry.scale(0.62, 0.45, 1.15);
  const xAxis = new T.Vector3().crossVectors(up, dir);
  bowl.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(xAxis, up, dir));
  bowl.position.copy(tip).addScaledVector(dir, 0.06).addScaledVector(up, -0.016);
  spoon.add(bowl);
  spoon.scale.setScalar(2.1);
  spoon.position.set(-0.04, 0.075, 0.24);
  g.add(spoon);
  g.add(
    mesh(new T.CylinderGeometry(0.09, 0.1, 0.07, 40), M.lacquer())
      .translateY(0.04)
      .translateZ(0.24),
  );
  g.userData.tick = draw;
  return g;
};

export default build;
