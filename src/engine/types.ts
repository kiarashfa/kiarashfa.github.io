// What the pages hand to the stage: every project, in the home's order, and
// which view the current page wants.

export interface StageProject {
  slug: string;
  name: string;
  /** Where the name is split to seat the mercury dot. */
  split: number;
  /** The two words the drops carry. */
  roots: [string, string];
  familyName: string;
  flagship: boolean;
  color: string;
  year: string;
  line: string;
  made: string | null;
  href: string;
}

export type StageView = { kind: 'home' } | { kind: 'project'; slug: string } | { kind: 'page' };
