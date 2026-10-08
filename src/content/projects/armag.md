---
name: ARMAG
title: Firearms reference
roots: [arm, magazine]
split: 2
family: encyclopedias
flagship: true
color: '#9ad4ea'
started: '2026-08'
sort: '2026-08-26'
dates:
  - '2026-08-26 first commit; scaffold, schemas, math engine and page templates the same day'
  - 2026-08-27 catalogue search and compare tools
  - 2026-09-27 one design shared with its sibling encyclopedias
url: https://kiarashfa.github.io/ARMAG/
repo: https://github.com/kiarashfa/ARMAG
line: Firearms and cartridges, laid out like a magazine, with real ballistics.
made: for those who respect every round
notice: 'A reference only: not legal advice or safety instruction.'
---

## The idea

A reference for firearms and their cartridges, laid out like a magazine: one page for each firearm, each cartridge and each maker, joined by a family tree of what descends from what. Every figure is sourced or computed and says which; a number nobody has published is shown as a gap. The physics is real: trajectory, retained energy, momentum, recoil and sight geometry are worked out from each cartridge's own published data, and every derived number opens a panel showing its formula, its inputs and where each input came from. Two lines are never crossed. There is no damage, lethality or "stopping power" figure anywhere, because energy is physics and stopping power is not; and there is no legal layer: the site says what a firearm is, never what a reader may do with it.

## The story

I grew up in the 1990s, surrounded by shooting games and action films and all the adrenaline that came with them, and I still play shooters today to let off stress; I do not believe the games themselves necessarily harm young people. But my feelings about real guns have changed, and I do not support civilians owning them.

So ARMAG began in conflict. I wanted to take the encyclopedias into this field too, without doing harm, and the whole design follows from that. ARMAG is informative and nothing else: it never promotes using a gun, it publishes no figure for the damage a gun can do, it says what a firearm is and never what anyone may do with it, and a disclaimer stands on its About page.

## The challenges

1. **A shooting range that tells the truth.** ARMAG's simulation engine is a trajectory solver: the flight is integrated step by step (Runge–Kutta, in three dimensions, so wind drift comes out of the same solver as drop) against the US Army's public-domain G1 and G7 drag tables. The tables were transcribed and then checked row by row against an independent open-source implementation, and the solver is tested against a reference trajectory and against manufacturers' published tables, so the site can claim accuracy rather than assert it. Energy and momentum come out of it; stopping power never does.
2. **Choosing and comparing.** The matchmaker narrows the field by what a reader needs, including a tolerance for recoil that is computed honestly, as a lower bound, since the site will not publish the powder charges a complete figure needs. Four arms stand side by side with percentile bars that carry real units, so a figure is placed among all the others rather than just printed.
3. **Size at true scale.** Any four firearms can be overlaid at true scale. No real outlines exist to draw from, so each shape is a family profile fitted to that arm's sourced length, height and barrel, with a magazine drawn only where the feed system has one; the drawing says plainly that the dimensions are sourced and the shape is not. Getting the live comparison to keep up with a reader's choices took its own fix: one reactive loop kept rewriting what it read until the page froze.

## What makes it special

Everything that makes its siblings what they are, every figure sourced or computed and the unpublished left empty, with Markey's step up of tools and a simulation engine, here a shooting range, and with the care a difficult subject asks for: informative, never promotional, and silent on harm by design.

## Built with

Astro · Svelte · TypeScript · Tailwind CSS · Zod · Pagefind · the G1 and G7 drag tables · Wikidata · IBM Plex Sans · Google Analytics · GitHub Pages.
