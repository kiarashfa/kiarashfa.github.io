// A real desk calculator in graphite, its equals key blown up and glossy in
// Kalculator's purple.
import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { canvasTex, mesh, type EmblemBuilder } from './_kit';

const LABELS = [
  ['C', '÷', '×', '−'],
  ['7', '8', '9', '+'],
  ['4', '5', '6', '%'],
  ['1', '2', '3', ''],
  ['0', '.', '', ''],
];

const build: EmblemBuilder = (M, P) => {
  const g = new T.Group(),
    W = 0.46,
    D = 0.62;
  const bodyMat = new T.MeshPhysicalMaterial({
    color: 0x2a2a2e,
    roughness: 0.42,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
  });

  // a wedge body, higher at the back
  const side = new T.Shape();
  side.moveTo(-D / 2, 0);
  side.lineTo(D / 2, 0);
  side.lineTo(D / 2, 0.05);
  side.lineTo(-D / 2, 0.1);
  side.lineTo(-D / 2, 0);
  const bg = new T.ExtrudeGeometry(side, {
    depth: W,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 4,
  });
  bg.translate(0, 0, -W / 2);
  bg.rotateY(-Math.PI / 2);
  g.add(mesh(bg, bodyMat));
  const tilt = Math.atan2(0.05, D),
    top = new T.Group();
  top.position.y = 0.075 + 0.012;
  top.rotation.x = tilt;
  g.add(top);

  // the display
  const lcd = canvasTex(512, 128, (c, w) => {
    c.fillStyle = '#c9d2c2';
    c.fillRect(0, 0, w, 128);
    c.fillStyle = 'rgba(40,48,36,.9)';
    c.font = '600 64px Georgia, serif';
    c.textAlign = 'right';
    c.fillText('√2 × √2 = 2', w - 24, 86);
    c.fillStyle = 'rgba(40,48,36,.25)';
    c.font = '22px monospace';
    c.textAlign = 'left';
    c.fillText('Kalculator', 18, 30);
  });
  top.add(mesh(new T.BoxGeometry(W * 0.86, 0.012, 0.12), M.lacquer()).translateZ(-D * 0.36));
  const screen = new T.Mesh(
    new T.PlaneGeometry(W * 0.8, 0.095),
    new T.MeshStandardMaterial({ map: lcd, roughness: 0.3 }),
  );
  screen.rotation.x = -Math.PI / 2;
  screen.position.set(0, 0.0065, -D * 0.36);
  top.add(screen);

  // the keys: four columns, five rows of domed keys
  const keyMat = new T.MeshPhysicalMaterial({ color: 0x3a3a3f, roughness: 0.45, clearcoat: 0.4 }),
    opMat = new T.MeshPhysicalMaterial({ color: 0xc9c4ba, roughness: 0.4, clearcoat: 0.4 });
  const keyGeo = new T.CylinderGeometry(0.03, 0.033, 0.022, 32);
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 4; c++) {
      if (c >= 2 && r >= 3) continue;
      const op = c === 3 || r === 0;
      const x = (c - 1.5) * 0.1,
        z = -D * 0.18 + r * 0.085;
      const k = mesh(keyGeo, op ? opMat : keyMat);
      k.position.set(x, 0.011, z);
      top.add(k);
      const label = canvasTex(64, 64, (g2, w, h) => {
        g2.fillStyle = op ? '#c9c4ba' : '#3a3a3f';
        g2.fillRect(0, 0, w, h);
        g2.fillStyle = op ? '#2a2a2e' : '#f1ede6';
        g2.font = '600 34px Helvetica, Arial, sans-serif';
        g2.textAlign = 'center';
        g2.textBaseline = 'middle';
        g2.fillText(LABELS[r]![c]!, 32, 34);
      });
      const face = new T.Mesh(
        new T.CircleGeometry(0.029, 32),
        new T.MeshPhysicalMaterial({ map: label, roughness: 0.4, clearcoat: 0.4 }),
      );
      face.rotation.x = -Math.PI / 2;
      face.position.set(x, 0.0225, z);
      top.add(face);
    }

  // the oversized equals key, spilling over the edge
  const eqMat = new T.MeshPhysicalMaterial({
    color: new T.Color(P.color),
    roughness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    iridescence: 0.45,
    iridescenceIOR: 1.4,
    sheen: 0.5,
    sheenColor: new T.Color(0xf472b6),
  });
  const eq = mesh(new RoundedBoxGeometry(0.16, 0.11, 0.22, 8, 0.05), eqMat);
  eq.position.set(0.165, 0.05, D * 0.2);
  top.add(eq);
  const bars = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
  for (const z of [-0.03, 0.03]) {
    const b = mesh(new RoundedBoxGeometry(0.09, 0.016, 0.03, 3, 0.007), bars);
    b.position.set(0.165, 0.108, D * 0.2 + z);
    top.add(b);
  }

  // propped on a small easel so its face meets the viewer
  const easel = new T.Group();
  easel.add(g);
  g.rotation.x = 1.0;
  g.position.set(0, 0.29, -0.12);
  const stand = mesh(new T.BoxGeometry(0.04, 0.42, 0.02), M.lacquer());
  stand.position.set(0, 0.2, -0.3);
  stand.rotation.x = -0.42;
  easel.add(stand);
  easel.add(
    mesh(new T.BoxGeometry(0.6, 0.03, 0.5), M.lacquer())
      .translateY(0.015)
      .translateZ(-0.12),
  );
  easel.rotation.y = -0.3;
  easel.scale.setScalar(1.15);
  const w = new T.Group();
  w.add(easel);
  return w;
};

export default build;
