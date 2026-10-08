// A project's narrative, split into its sections and rendered to HTML.
// The shape is checked here, at build time, so a new narrative that misses a
// section, or has more than five challenges, stops the build with a message
// that says what to fix.
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import type { Project } from './projects';

export const SECTIONS = {
  idea: 'The idea',
  story: 'The story',
  challenges: 'The challenges',
  special: 'What makes it special',
  stack: 'Built with',
  figures: 'Figures',
} as const;

type Key = keyof typeof SECTIONS;
const REQUIRED: Key[] = ['idea', 'story', 'challenges', 'special', 'stack'];
const MAX_CHALLENGES = 5;

export type Narrative = Record<Exclude<Key, 'figures'>, string> & { figures: string | null };

const processor = createMarkdownProcessor();

const fail = (project: Project, message: string): never => {
  throw new Error(`src/content/projects/${project.id}.md: ${message}`);
};

export async function narrative(project: Project): Promise<Narrative> {
  const body = (project.body ?? '').replace(/\r\n/g, '\n');
  const parts = body.split(/^## +(.+)$/m);
  if (parts[0]!.trim()) fail(project, 'text before the first "## " heading.');

  const found = new Map<Key, string>();
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i]!.trim();
    const key = (Object.keys(SECTIONS) as Key[]).find((k) => SECTIONS[k] === heading);
    if (!key)
      fail(project, `unknown section "## ${heading}". Use: ${Object.values(SECTIONS).join(', ')}.`);
    if (found.has(key!)) fail(project, `"## ${heading}" appears twice.`);
    found.set(key!, parts[i + 1]!.trim());
  }
  for (const key of REQUIRED) if (!found.get(key)) fail(project, `missing "## ${SECTIONS[key]}".`);

  const challenges = found.get('challenges')!.match(/^\d+\.\s+\*\*/gm)?.length ?? 0;
  if (challenges < 1 || challenges > MAX_CHALLENGES)
    fail(
      project,
      `"## The challenges" needs 1 to ${MAX_CHALLENGES} numbered items, each opening with a bold title; found ${challenges}.`,
    );

  const md = await processor;
  const html = async (key: Key) => {
    const src = found.get(key);
    if (!src) return null;
    const { code } = await md.render(src);
    // a challenge's title is a heading of its own: no closing full stop
    return key === 'challenges'
      ? code.replace(/<strong>(.*?)\.<\/strong>/g, '<strong>$1</strong>')
      : code;
  };
  return {
    idea: (await html('idea'))!,
    story: (await html('story'))!,
    challenges: (await html('challenges'))!,
    special: (await html('special'))!,
    stack: (await html('stack'))!,
    figures: await html('figures'),
  };
}
