// A full telegraph set: the brass key in front, the sounder on its coils
// behind, and a tall reel of tape still running.
import * as T from 'three';
import { TAU, canvasTex, mesh, ribbon, v3, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M, P) => {
  const g = new T.Group(),
    brass = M.brass(),
    wood = M.wood();
  g.add(mesh(new T.BoxGeometry(0.8, 0.07, 0.36), wood).translateY(0.035));
  g.add(mesh(new T.BoxGeometry(0.82, 0.012, 0.38), brass).translateY(0.075));

  // the key, in front
  const key = new T.Group();
  key.position.set(0.06, 0.08, 0.1);
  g.add(key);
  key.add(mesh(new T.BoxGeometry(0.42, 0.02, 0.07), brass).translateY(0.01));
  for (const z of [-0.03, 0.03])
    key.add(
      mesh(new T.CylinderGeometry(0.013, 0.016, 0.09, 16), brass)
        .translateY(0.055)
        .translateX(-0.08)
        .translateZ(z),
    );
  const lever = new T.Group();
  lever.position.set(-0.08, 0.1, 0);
  key.add(lever);
  lever.add(mesh(new T.BoxGeometry(0.4, 0.018, 0.032), brass).translateX(0.1));
  lever.add(
    mesh(new T.CylinderGeometry(0.045, 0.05, 0.025, 32), M.rubber())
      .translateX(0.3)
      .translateY(0.03),
  );
  lever.add(
    mesh(new T.CylinderGeometry(0.04, 0.04, 0.035, 32), M.lacquer())
      .translateX(0.3)
      .translateY(0.055),
  );

  // the sounder, behind: two copper coils under a brass armature on a tall frame
  const snd = new T.Group();
  snd.position.set(-0.14, 0.08, -0.08);
  g.add(snd);
  snd.add(mesh(new T.BoxGeometry(0.3, 0.03, 0.14), brass).translateY(0.015));
  const coilTex = canvasTex(64, 256, (c, w, h) => {
    for (let y = 0; y < h; y += 3) {
      c.fillStyle = y % 6 ? '#b8683a' : '#7e3f1e';
      c.fillRect(0, y, w, 3);
    }
  });
  coilTex.wrapS = coilTex.wrapT = T.RepeatWrapping;
  coilTex.repeat.set(4, 2);
  const coilMat = new T.MeshPhysicalMaterial({ map: coilTex, metalness: 0.6, roughness: 0.35 });
  for (const x of [-0.06, 0.06]) {
    const coil = mesh(new T.CylinderGeometry(0.045, 0.045, 0.2, 32), coilMat);
    coil.position.set(x, 0.13, 0);
    snd.add(coil);
    snd.add(
      mesh(new T.CylinderGeometry(0.05, 0.05, 0.015, 32), M.lacquer())
        .translateX(x)
        .translateY(0.235),
    );
  }
  for (const x of [-0.13, 0.13])
    snd.add(
      mesh(new T.BoxGeometry(0.02, 0.38, 0.03), brass)
        .translateX(x)
        .translateY(0.2),
    );
  snd.add(mesh(new T.BoxGeometry(0.3, 0.022, 0.04), brass).translateY(0.39));
  const arm = mesh(new T.BoxGeometry(0.24, 0.018, 0.05), brass);
  arm.position.y = 0.27;
  snd.add(arm);
  snd.add(
    mesh(new T.CylinderGeometry(0.01, 0.01, 0.14, 12), brass)
      .translateY(0.32)
      .translateX(0.1),
  );

  // a reel of tape standing at the left end, the tape running to the front
  const reel = new T.Group();
  reel.position.set(-0.33, 0.3, 0.05);
  g.add(reel);
  for (const z of [-0.022, 0.022]) {
    const flange = mesh(new T.TorusGeometry(0.15, 0.012, 12, 64), M.gold());
    flange.position.z = z;
    reel.add(flange);
    for (let k = 0; k < 6; k++) {
      const spoke = mesh(new T.BoxGeometry(0.008, 0.29, 0.006), M.gold());
      spoke.rotation.z = (k / 6) * Math.PI;
      spoke.position.z = z;
      reel.add(spoke);
    }
  }
  reel.add(
    mesh(
      new T.CylinderGeometry(0.09, 0.09, 0.04, 48),
      new T.MeshStandardMaterial({ color: 0xf4efe2, roughness: 0.85 }),
    ).rotateX(Math.PI / 2),
  );
  reel.add(mesh(new T.CylinderGeometry(0.015, 0.015, 0.07, 16), brass).rotateX(Math.PI / 2));
  g.add(
    mesh(new T.BoxGeometry(0.02, 0.24, 0.02), brass)
      .translateX(-0.33)
      .translateY(0.18)
      .translateZ(0.05),
  );
  const tape = canvasTex(1024, 32, (c, w, h) => {
    c.fillStyle = '#f4efe2';
    c.fillRect(0, 0, w, h);
    c.fillStyle = P.color;
    let x = 20;
    for (const ch of '-- ...  ... -- / -.- .. .-') {
      if (ch === '.') {
        c.beginPath();
        c.arc(x, h / 2, 6, 0, TAU);
        c.fill();
        x += 22;
      } else if (ch === '-') {
        c.fillRect(x - 6, h / 2 - 6, 34, 12);
        x += 46;
      } else x += 26;
    }
  });
  const pts: T.Vector3[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    pts.push(v3(-0.33 + t * 0.65, 0.19 - t * 0.1 + Math.sin(t * 3) * 0.015, 0.05 + t * 0.22));
  }
  g.add(
    new T.Mesh(
      ribbon(new T.CatmullRomCurve3(pts), 80, 0.014, 'y'),
      new T.MeshStandardMaterial({ map: tape, side: T.DoubleSide, roughness: 0.8 }),
    ),
  );
  g.userData.tick = (t: number) => {
    lever.rotation.z = Math.sin(t * 9) > 0.3 ? -0.04 : 0;
    arm.rotation.z = lever.rotation.z * 0.5;
    reel.rotation.z = -t * 0.4;
  };
  g.scale.setScalar(1.1);
  return g;
};

export default build;
