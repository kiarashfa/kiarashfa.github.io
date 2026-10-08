// Every src/emblems/<slug>.ts is a project's emblem, found by its file name.
// Files starting with `_` are helpers, not emblems.
import type { EmblemBuilder } from './_kit';

export const emblemModules = import.meta.glob<{ default: EmblemBuilder }>([
  './*.ts',
  '!./_*.ts',
  '!./index.ts',
  '!./registry.ts',
]);

/** Every slug with an emblem of its own. */
export const EMBLEM_SLUGS: readonly string[] = Object.keys(emblemModules).map((path) =>
  path.slice(2, -3),
);
