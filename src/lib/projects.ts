import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Family = CollectionEntry<'families'>;

/** The address of a project's page on this site. */
export const projectPath = (project: Project): string => `/p/${project.id}/`;

/** Every project in the order it began: the timeline. */
export async function projectsByTime(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort(
    (a, b) => a.data.sort.localeCompare(b.data.sort) || a.data.name.localeCompare(b.data.name),
  );
}

/** Flagships first, then the rest, each in the order they began: the home's sequence. */
export async function projectsForHome(): Promise<Project[]> {
  const byTime = await projectsByTime();
  return [...byTime.filter((p) => p.data.flagship), ...byTime.filter((p) => !p.data.flagship)];
}

/** The name in two halves, for the mercury dot seated between them. */
export function splitName(project: Project): [string, string] {
  const { name, split } = project.data;
  return [name.slice(0, split).trimEnd(), name.slice(split).trimStart()];
}

/** "Encyclopedias · Flagship · 2026": the small line above a project's name. */
export function kicker(project: Project, familyName: string, when: string): string {
  return [familyName, project.data.flagship && 'Flagship', when].filter(Boolean).join(' · ');
}

/** A family with its members, in the order they began. */
export async function familyOf(project: Project): Promise<{ family: Family; members: Project[] }> {
  const families = await getCollection('families');
  const family = families.find((f) => f.id === project.data.family);
  if (!family) throw new Error(`Unknown family "${project.data.family}" in ${project.id}`);
  const members = (await projectsByTime()).filter((p) => p.data.family === family.id);
  return { family, members };
}
