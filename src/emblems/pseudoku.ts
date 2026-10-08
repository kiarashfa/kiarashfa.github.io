// Lumon's MDR workstation: a cream terminal, its screen full of numbers.
import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { canvasTex, mesh, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M, P) => {
  const g = new T.Group(),
    cream = M.enamel(0xe8e2d0);
  g.add(mesh(new RoundedBoxGeometry(0.56, 0.44, 0.44, 5, 0.06), cream).translateY(0.36));
  const scr = canvasTex(512, 384, (c, w, h) => {
    c.fillStyle = '#071723';
    c.fillRect(0, 0, w, h);
    c.fillStyle = P.color;
    c.font = '28px Courier New, monospace';
    c.textAlign = 'center';
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 10; x++) {
        c.globalAlpha = 0.45 + ((x * 7 + y * 3) % 5) * 0.12;
        c.fillText(String((x * 3 + y * 7) % 10), 30 + x * 50, 60 + y * 42);
      }
    c.globalAlpha = 1;
    c.strokeStyle = P.color;
    c.lineWidth = 2;
    c.strokeRect(12, 12, w - 24, h - 24);
  });
  const screen = new T.Mesh(new T.PlaneGeometry(0.42, 0.31), M.screen(scr));
  screen.position.set(0, 0.37, 0.221);
  g.add(screen);
  g.add(
    mesh(new T.BoxGeometry(0.6, 0.05, 0.24), cream)
      .translateY(0.025)
      .translateZ(0.34)
      .rotateX(0.08),
  );
  g.add(
    mesh(new T.SphereGeometry(0.035, 24, 16), M.lacquer())
      .translateY(0.06)
      .translateZ(0.34)
      .translateX(0.24),
  );
  g.add(mesh(new T.BoxGeometry(0.3, 0.14, 0.3), cream).translateY(0.07));
  return g;
};

export default build;
