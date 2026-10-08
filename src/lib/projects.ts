import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { EMBLEM_SLUGS } from '../emblems/registry';
import type { StageProject } from '../engine/types';
import { MONTHS, yearOf } from './dates';

export type Project = CollectionEntry<'projects'>;
export type Family = CollectionEntry<'families'>;

/** The address of a project's page on this site. */
export const projectPath = (project: Project): string => `/p/${project.id}/`;

let warned = false;

/** Every project in the order it began: the timeline. */
export async function projectsByTime(): Promise<Project[]> {
  const all = await getCollection('projects');
  if (!warned) {
    warned = true;
    for (const p of all)
      if (!EMBLEM_SLUGS.includes(p.id))
        console.warn(
          `[emblems] "${p.id}" has no src/emblems/${p.id}.ts yet: it stands as a plain mercury drop.`,
        );
  }
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

export async function familyOf(project: Project): Promise<Family> {
  const family = await getEntry(project.data.family);
  if (!family)
    throw new Error(
      `src/content/projects/${project.id}.md: unknown family "${project.data.family.id}".`,
    );
  return family;
}

/** A family with its members, in the order they began. */
export async function familyWithMembers(
  project: Project,
): Promise<{ family: Family; members: Project[] }> {
  const family = await familyOf(project);
  const members = (await projectsByTime()).filter((p) => p.data.family.id === family.id);
  return { family, members };
}

export async function familyNames(): Promise<Map<string, string>> {
  return new Map((await getCollection('families')).map((f) => [f.id, f.data.name]));
}

export interface TimelineRow {
  slug: string;
  name: string;
  family: string;
  month: string;
  year: number;
  href: string;
  /** Months since the project before it, when two or more. */
  gap: number;
}

const monthIndex = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return y! * 12 + (m! - 1);
};

/** Every project in time, for the timeline wheel. */
export async function timeline(): Promise<TimelineRow[]> {
  const [list, names] = await Promise.all([projectsByTime(), familyNames()]);
  return list.map((p, i) => {
    const m = monthIndex(p.data.started),
      before = i ? monthIndex(list[i - 1]!.data.started) : m;
    return {
      slug: p.id,
      name: p.data.name,
      family: names.get(p.data.family.id) ?? '',
      month: MONTHS[m % 12]!.slice(0, 3),
      year: Math.floor(m / 12),
      href: projectPath(p),
      gap: m - before >= 2 ? m - before : 0,
    };
  });
}

/** What the stage needs to know about every project, in the home's order. */
export async function stageProjects(): Promise<StageProject[]> {
  const [list, names] = await Promise.all([projectsForHome(), familyNames()]);
  return list.map((p) => ({
    slug: p.id,
    name: p.data.name,
    split: p.data.split,
    roots: p.data.roots,
    familyName: names.get(p.data.family.id) ?? '',
    flagship: p.data.flagship,
    color: p.data.color,
    year: yearOf(p.data.started),
    line: p.data.line,
    made: p.data.made ?? null,
    href: projectPath(p),
  }));
}
