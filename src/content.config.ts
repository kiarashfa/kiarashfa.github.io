import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'YYYY-MM');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD');
const milestone = z.string().regex(/^\d{4}(-\d{2}){0,2}\s+\S/, 'a date, then what happened');

// One Markdown file per project; the file name is the slug and the page's
// address (/p/<slug>/). The body holds the sections The idea, The story,
// The challenges, What makes it special, Built with, and optionally Figures.
// Adding a project is two files: src/content/projects/<slug>.md and its
// emblem, src/emblems/<slug>.ts (until that exists it stands as a plain drop).
// Every list, the timeline and the home pick it up from there.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    // As the project writes itself: "DrXRates", "eXir", "ARMAG".
    name: z.string(),
    // The project's own subtitle, if it has one.
    title: z.string().nullish(),
    // The two words the name fuses; on the home each rides one of two drops.
    roots: z.tuple([z.string(), z.string()]),
    // Where the name is split to seat the mercury dot between its two halves.
    split: z.number().int().positive(),
    // An id from src/content/families.yaml.
    family: reference('families'),
    flagship: z.boolean(),
    // The colour the emblem blooms into on the project's own page.
    color: z.string().regex(/^#[0-9a-f]{6}$/i),
    // The milestone the site shows, as Month Year.
    started: yearMonth,
    // Orders the timeline; where only the month is known the day only keeps the order.
    sort: isoDate,
    dates: z.array(milestone).default([]),
    url: z.url().startsWith('https://kiarashfa.github.io/'),
    repo: z.url().startsWith('https://github.com/kiarashfa/'),
    // One sentence.
    line: z.string().max(140),
    // The closing line of the project's README, after "Made with ❤️".
    made: z.string().nullish(),
    // A line the project's page must carry, such as a fan tribute's disclaimer.
    notice: z.string().nullish(),
  }),
});

const families = defineCollection({
  loader: file('./src/content/families.yaml'),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    line: z.string(),
  }),
});

// Contact and support links, with the name of their icon in src/assets/icons/.
const links = defineCollection({
  loader: file('./src/content/links.yaml'),
  schema: z.object({
    id: z.string(),
    group: z.enum(['contact', 'support']),
    label: z.string(),
    href: z.string(),
    icon: z.enum(['globe', 'github', 'mail', 'coffee', 'paypal']),
  }),
});

export const collections = { projects, families, links };
