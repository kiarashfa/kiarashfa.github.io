// A silver cloche lifted off a porcelain platter: a glazed roast chicken
// underneath, with lemon and rosemary.
import * as T from 'three';
import { TAU, canvasTex, lathe, mesh, type EmblemBuilder } from './_kit';

/** Push a sphere's vertices in and out for an uneven, roasted surface. */
function lump(geo: T.BufferGeometry, amp: number, f: number) {
  const p = geo.attributes.position!,
    v = new T.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * f) * Math.sin(v.y * f * 1.3 + 1.7) * Math.sin(v.z * f * 0.9 + 0.4);
    v.multiplyScalar(1 + n * amp);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

const build: EmblemBuilder = (M) => {
  const g = new T.Group();
  g.add(
    mesh(
      lathe([
        [0, 0],
        [0.46, 0],
        [0.5, 0.014],
        [0.52, 0.036],
        [0.44, 0.036],
        [0.14, 0.026],
        [0, 0.026],
      ]),
      M.porcelain(),
    ),
  );

  // roasted skin: darker caramelised patches and a few bright glints
  const skin = canvasTex(512, 256, (c, w, h) => {
    c.fillStyle = '#a4521c';
    c.fillRect(0, 0, w, h);
    for (let k = 0; k < 900; k++) {
      const x = Math.random() * w,
        y = Math.random() * h,
        r = 2 + Math.random() * 14;
      c.fillStyle = `rgba(${90 + Math.random() * 60},${35 + Math.random() * 25},10,${0.08 + Math.random() * 0.18})`;
      c.beginPath();
      c.arc(x, y, r, 0, TAU);
      c.fill();
    }
    for (let k = 0; k < 400; k++) {
      const x = Math.random() * w,
        y = Math.random() * h;
      c.fillStyle = `rgba(255,${190 + Math.random() * 50},120,${0.08 + Math.random() * 0.1})`;
      c.beginPath();
      c.arc(x, y, 1 + Math.random() * 4, 0, TAU);
      c.fill();
    }
  });
  const roast = new T.MeshPhysicalMaterial({
    map: skin,
    roughness: 0.38,
    clearcoat: 0.8,
    clearcoatRoughness: 0.25,
    sheen: 0.6,
    sheenColor: new T.Color(0xffc27a),
    sheenRoughness: 0.5,
  });

  const bird = new T.Group();
  const body = mesh(lump(new T.SphereGeometry(0.2, 64, 48), 0.05, 23), roast);
  body.scale.set(1.15, 0.72, 0.9);
  body.position.y = 0.13;
  bird.add(body);
  const breast = mesh(lump(new T.SphereGeometry(0.13, 48, 32), 0.04, 30), roast);
  breast.scale.set(1.2, 0.8, 1.05);
  breast.position.set(0.06, 0.19, 0);
  bird.add(breast);
  const frillMat = new T.MeshStandardMaterial({
    color: 0xfaf7f0,
    roughness: 0.9,
    side: T.DoubleSide,
  });
  for (const sd of [-1, 1]) {
    const thigh = mesh(lump(new T.SphereGeometry(0.085, 40, 28), 0.05, 35), roast);
    thigh.scale.set(1.25, 0.85, 0.9);
    thigh.position.set(-0.1, 0.15, sd * 0.12);
    thigh.rotation.z = 0.4;
    bird.add(thigh);
    const leg = mesh(new T.CapsuleGeometry(0.032, 0.12, 8, 20), roast);
    leg.position.set(-0.2, 0.2, sd * 0.09);
    leg.rotation.set(sd * 0.25, 0, 1.1);
    bird.add(leg);
    const bone = mesh(new T.CylinderGeometry(0.012, 0.014, 0.05, 16), M.porcelain());
    bone.position.set(-0.27, 0.25, sd * 0.075);
    bone.rotation.set(sd * 0.25, 0, 1.1);
    bird.add(bone);
    const frill = mesh(new T.CylinderGeometry(0.03, 0.017, 0.045, 18, 1, true), frillMat);
    frill.position.set(-0.3, 0.265, sd * 0.07);
    frill.rotation.set(sd * 0.25, 0, 1.1);
    bird.add(frill);
    const wing = mesh(lump(new T.SphereGeometry(0.07, 32, 20), 0.06, 40), roast);
    wing.scale.set(1.4, 0.55, 0.7);
    wing.position.set(0.08, 0.12, sd * 0.17);
    wing.rotation.x = sd * 0.5;
    bird.add(wing);
  }
  bird.position.set(0.03, 0.02, 0);
  bird.rotation.y = 0.5;
  bird.scale.setScalar(1.35);
  g.add(bird);

  // lemon halves and rosemary sprigs on the platter
  const lemonCut = canvasTex(256, 256, (c) => {
    c.fillStyle = '#f6e27a';
    c.beginPath();
    c.arc(128, 128, 126, 0, TAU);
    c.fill();
    c.fillStyle = '#fbf3c8';
    c.beginPath();
    c.arc(128, 128, 112, 0, TAU);
    c.fill();
    for (let k = 0; k < 10; k++) {
      const a = (k / 10) * TAU;
      c.fillStyle = '#f3d24a';
      c.beginPath();
      c.moveTo(128, 128);
      c.arc(128, 128, 104, a + 0.05, a + TAU / 10 - 0.05);
      c.fill();
    }
    c.fillStyle = '#fbf3c8';
    c.beginPath();
    c.arc(128, 128, 14, 0, TAU);
    c.fill();
  });
  const rindMat = new T.MeshPhysicalMaterial({ color: 0xf2cc2e, roughness: 0.45, clearcoat: 0.5 });
  const faceMat = new T.MeshStandardMaterial({ map: lemonCut, roughness: 0.6 });
  for (const [x, z, r] of [
    [0.36, 0.22, 0.3],
    [0.4, -0.1, -0.2],
    [-0.36, -0.28, 0.9],
  ] as const) {
    const L = new T.Group();
    const rind = mesh(new T.SphereGeometry(0.06, 32, 16, 0, TAU, 0, Math.PI / 2), rindMat);
    rind.rotation.x = Math.PI;
    L.add(rind);
    const face = mesh(new T.CircleGeometry(0.06, 32), faceMat);
    face.rotation.x = -Math.PI / 2;
    face.position.y = 0.0005;
    L.add(face);
    L.position.set(x, 0.05, z);
    L.rotation.set(-0.25, r, 0.2);
    g.add(L);
  }
  const herb = new T.MeshStandardMaterial({ color: 0x3e5e2e, roughness: 0.7 });
  const stem = new T.MeshStandardMaterial({ color: 0x5a4a2a });
  for (const [x, z, r] of [
    [-0.2, 0.27, 0.5],
    [0.18, -0.3, 2.4],
    [-0.36, 0.05, 1.4],
  ] as const) {
    const sp = new T.Group();
    sp.add(mesh(new T.CylinderGeometry(0.004, 0.005, 0.2, 6), stem).rotateZ(Math.PI / 2));
    for (let k = 0; k < 16; k++) {
      const lf = mesh(new T.CapsuleGeometry(0.0045, 0.03, 4, 6), herb);
      const t = k / 16 - 0.5;
      lf.position.set(t * 0.19, 0.006, (k % 2 ? 1 : -1) * 0.012);
      lf.rotation.set(Math.PI / 2, 0, k % 2 ? 0.7 : -0.7);
      sp.add(lf);
    }
    sp.position.set(x, 0.045, z);
    sp.rotation.y = r;
    g.add(sp);
  }

  // the cloche, lifted and tilted back
  const dome = new T.Group();
  const prof: [number, number][] = [[0.41, -0.005]];
  for (let i = 0; i <= 24; i++) {
    const a = ((i / 24) * Math.PI) / 2;
    prof.push([Math.cos(a) * 0.4, Math.sin(a) * 0.38]);
  }
  dome.add(mesh(lathe(prof), M.silver()));
  dome.add(mesh(new T.SphereGeometry(0.038, 32, 16), M.silver()).translateY(0.4));
  dome.add(mesh(new T.CylinderGeometry(0.013, 0.022, 0.03, 16), M.silver()).translateY(0.372));
  dome.position.set(-0.08, 0.5, -0.34);
  dome.rotation.set(-0.85, 0, 0.1);
  g.add(dome);
  return g;
};

export default build;
