// An antique brass balance holding a feather level with a gold weight:
// a sense of how much things are.
import * as T from 'three';
import { TAU, hex, lathe, mesh, type EmblemBuilder } from './_kit';

const build: EmblemBuilder = (M, P) => {
  const g = new T.Group(),
    brass = M.brass(),
    accent = M.enamel(hex(P.color));
  g.add(mesh(new T.CylinderGeometry(0.2, 0.23, 0.05, 64), M.wood()).translateY(0.025));
  g.add(mesh(new T.CylinderGeometry(0.13, 0.16, 0.03, 64), brass).translateY(0.065));
  g.add(
    mesh(
      lathe(
        [
          [0, 0],
          [0.05, 0],
          [0.035, 0.05],
          [0.024, 0.1],
          [0.02, 0.58],
          [0.032, 0.6],
          [0.032, 0.63],
          [0, 0.63],
        ],
        48,
      ),
      brass,
    ).translateY(0.08),
  );
  g.add(mesh(new T.SphereGeometry(0.035, 24, 16), accent).translateY(0.735));

  const beam = new T.Group();
  beam.position.y = 0.7;
  const bar = mesh(new T.CylinderGeometry(0.009, 0.009, 0.74, 24), brass);
  bar.rotation.z = Math.PI / 2;
  beam.add(bar);
  beam.add(
    mesh(new T.ConeGeometry(0.025, 0.12, 4), brass)
      .translateY(0.06)
      .rotateZ(Math.PI),
  );
  const pointer = mesh(new T.CylinderGeometry(0.004, 0.004, 0.2, 8), brass);
  pointer.position.y = -0.1;
  beam.add(pointer);

  const ends: T.Group[] = [];
  for (const sd of [-1, 1]) {
    const end = new T.Group();
    end.position.x = sd * 0.37;
    beam.add(end);
    ends.push(end);
    end.add(mesh(new T.SphereGeometry(0.016, 16, 12), brass));
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU,
        chain = mesh(new T.CylinderGeometry(0.0025, 0.0025, 0.34, 6), brass);
      chain.position.set(Math.cos(a) * 0.045, -0.17, Math.sin(a) * 0.045);
      chain.rotation.set(Math.sin(a) * 0.14, 0, -Math.cos(a) * 0.14);
      end.add(chain);
    }
    const pan = mesh(
      lathe(
        [
          [0, 0],
          [0.1, 0.006],
          [0.13, 0.03],
          [0.128, 0.033],
          [0.098, 0.01],
          [0, 0.004],
        ],
        48,
      ),
      brass,
    );
    pan.position.y = -0.345;
    end.add(pan);
    if (sd < 0) {
      const weight = mesh(new T.CylinderGeometry(0.035, 0.04, 0.06, 32), M.gold());
      weight.position.y = -0.31;
      end.add(weight);
      const knob = mesh(new T.SphereGeometry(0.016, 16, 12), M.gold());
      knob.position.y = -0.27;
      end.add(knob);
    } else {
      // a white feather
      const vane = new T.Shape();
      vane.moveTo(0, 0);
      vane.bezierCurveTo(0.07, 0.08, 0.1, 0.26, 0.03, 0.42);
      vane.bezierCurveTo(-0.01, 0.46, -0.06, 0.26, -0.035, 0.1);
      vane.lineTo(0, 0);
      const f = mesh(
        new T.ShapeGeometry(vane, 24),
        new T.MeshStandardMaterial({ color: 0xf6f3ec, roughness: 0.9, side: T.DoubleSide }),
      );
      f.add(
        mesh(
          new T.CylinderGeometry(0.003, 0.004, 0.46, 6),
          new T.MeshStandardMaterial({ color: 0xd8cfbd }),
        ).translateY(0.2),
      );
      f.position.set(-0.02, -0.33, 0);
      f.rotation.set(0, 0.5, -0.35);
      end.add(f);
    }
  }
  g.add(beam);
  g.userData.tick = (t: number) => {
    beam.rotation.z = Math.sin(t * 0.9) * 0.025;
    for (const end of ends) end.rotation.z = -beam.rotation.z;
  };
  return g;
};

export default build;
