---
name: Perceptense
title: Have a Sense About Everything
roots: [perception, sense]
split: 7
family: learning
flagship: false
color: '#7cc6cd'
started: '2025-06'
sort: '2025-06-01'
dates:
  - 2025-06 the idea, and the first modules
  - 2026-04-11 first commit
  - 2026-04-27 the fiftieth module
  - 2026-09-10 the rebuild begins
  - '2026-09-15 v1.1: the redesign (spotlight and wheels)'
url: https://kiarashfa.github.io/perceptense/
repo: https://github.com/kiarashfa/perceptense
line: Bite-sized interactive modules for an intuition about everything.
made: for curious minds
---

## The idea

A free course that trades memorised facts for a sense of proportion: not only that something is big, far, old or influential, but how much, and next to what. Each module takes one subject (weight, time, money, materials, sleep, music, philosophy, climate) and builds intuition with a toolkit mixed differently every time: anchors to compare against, calculators to play with, visual scales, animations, games, and quick questions where you guess first and then reveal the truth. Any module can be opened first, none depends on another, and nothing is scored; browse them on a turning wheel, by subject, or by search.

## The story

Perceptense is an answer to my own curiosity. It began in June 2025: to make my intuition for the world stronger, and to understand better what happens all around. It began with simple subjects, the first eight or ten modules of the site.

That summer I was helping a friend look for work and prepare for interviews, where Fermi estimation questions came up. Such questions have no definite answer. What counts is the path of thinking and a mind for solving problems, and that is the mind Perceptense builds: a sense of numbers, instead of numbers memorised.

Soon the project grew to every area I could think of, art, philosophy, sport and the rest, trying to cover whatever someone might face, experience or wonder about in a life. The world is vast and no course can hold all of it, but Perceptense is my best effort to satisfy one curious mind: mine.

The name says the idea: perception and sense, Perceptense.

## The challenges

1. **Fifty modules, fifty codebases.** The course grew module by module, from ten to fifty, each with its own styles and scripts, and none of it planned for the moment they would have to live together. Moving them into one framework meant changing the structure and nothing of the content: the build compares every page's words with an approved copy and fails on any difference, the modules' scripts keep answering their clicks, and each module's styles are fenced inside its own page.
2. **One set of styles.** The same cards, charts and buttons had been defined again and again, separately in each module. The repeated styles were found, renamed consistently and merged into one shared sheet that every module draws on.
3. **Dark mode for every module.** Modules drawn for a light page had to read in the dark too, all in the same way: every chart and colour checked for contrast, and charts that pick their colours as they draw now redraw the moment the theme changes.
4. **Nothing may move.** After all of that, every module had to look exactly as it did before. A geometry check compares every element's box and style with the original site, so a refactor that shifts anything is caught.
5. **Found by Google.** The first version had dead-end pages that linked nowhere, and Google struggled to index them: my first real lesson in SEO. Now every page is reachable without JavaScript and links on to its neighbours and related modules, with one heading, its own title and description, social cards, structured data and a sitemap, and every old address still leads to its module. The build checks all of it.

## What makes it special

The interactive and visual elements made for every subject. Perceptense has plenty of text, but it is never an old-school textbook: every idea comes with visuals worth looking at and tools to play with, so you learn while you play.

## Built with

Astro · TypeScript · interactive JavaScript, SVG and CSS animation · Python and Node build and verification scripts · Pagefind search · local SVG icons · Google Analytics · GitHub Pages.

## Figures

Fifty modules in eight subjects.
