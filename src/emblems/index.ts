// Loading emblems for the stage. Each one is fetched only when first needed.
import type { EmblemBuilder } from './_kit';
import fallback from './_fallback';
import { emblemModules } from './registry';

export { EMBLEM_SLUGS } from './registry';

/** The builder for a project's emblem, or the plain drop when it has none yet. */
export async function loadEmblem(slug: string): Promise<EmblemBuilder> {
  const load = emblemModules[`./${slug}.ts`];
  return load ? (await load()).default : fallback;
}

export type { EmblemBuilder, EmblemProject, Materials } from './_kit';
export { materials } from './_kit';
