// The Swan Station counter: a steel housing with split flaps reading 108.
import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { canvasTex, mesh, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M) => {
  const g = new T.Group();
  g.add(mesh(new RoundedBoxGeometry(0.9, 0.32, 0.2, 4, 0.03), M.silver()).translateY(0.2));
  ['1', '0', '8', '0', '0'].forEach((d, i) => {
    const seconds = i > 2;
    const tex = canvasTex(128, 192, (c, w, h) => {
      c.fillStyle = seconds ? '#d9d4c7' : '#121212';
      c.fillRect(0, 0, w, h);
      c.fillStyle = seconds ? '#121212' : '#f2efe6';
      c.font = 'bold 150px Helvetica, Arial, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(d, w / 2, h / 2 + 8);
      c.fillStyle = 'rgba(0,0,0,.6)';
      c.fillRect(0, h / 2 - 2, w, 4);
    });
    const flap = new T.Mesh(
      new T.PlaneGeometry(0.13, 0.2),
      new T.MeshStandardMaterial({ map: tex, roughness: 0.5 }),
    );
    flap.position.set(-0.32 + i * 0.15 + (seconds ? 0.03 : 0), 0.2, 0.101);
    g.add(flap);
  });
  g.add(mesh(new T.BoxGeometry(0.95, 0.02, 0.26), M.lacquer()).translateY(0.03));
  for (const s of [-1, 1])
    g.add(
      mesh(new T.CylinderGeometry(0.015, 0.015, 0.02, 16), M.lacquer())
        .translateY(0.04)
        .translateX(s * 0.4),
    );
  return g;
};

export default build;
