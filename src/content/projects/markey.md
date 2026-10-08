---
name: Markey
title: Car encyclopedia
roots: [marque, key]
split: 3
family: encyclopedias
flagship: true
color: '#d0d5dc'
started: '2026-08'
sort: '2026-08-17'
dates:
  - '2026-08-17 first commit; phases 0 to 5 the same day'
  - 2026-08-18 phase 6
  - 2026-09-27 one design shared with its sibling encyclopedias
url: https://kiarashfa.github.io/Markey/
repo: https://github.com/kiarashfa/Markey
line: Production cars, sourced or computed, with a real wind tunnel running on your GPU.
made: for those who find joy in every mile
---

## The idea

An encyclopedia of production cars, from the Model T to the present, where every figure is either sourced or computed and always says which. A specification names the document it was read in, down to the revision; a figure nobody has published stays visibly empty. Beside the claims sits the physics: acceleration, top speed, drag, braking and energy use modelled from each car's own published data, with the gap to the maker's figure stated plainly. And on every Test Drive page there is a real wind tunnel, a fluid solver running on your graphics card, with smoke that flows over a body shaped to the car's dimensions. Browse by body, powertrain, drivetrain, origin, segment, market or decade; set four cars side by side; let the matchmaker narrow the field to what you need; work out what a car costs to run; or design a car that never existed and send it through the same physics.

## The story

Cars have fascinated me since childhood. I kept a notebook of cars of my own design, each with a name, drawn and painted with real dedication, every curve and crease of the body and the cabin too, and dreamed of designing a real one some day. The interiors were an obsession: any new car parked in the street meant a look through its windows to see the inside.

Then came the first car catalogue of my life, one car to a spread: on one page a clean studio photograph, on the other the full sheet of figures, specifications and price. Markey carries that layout into the browser. Add every Need for Speed, and a few dozen garages' worth of cars collected in GTA V, and after Xefy and eXir a car encyclopedia was the obvious next step. This one began not from a frustration but from love.

## The challenges

1. **A wind tunnel in a web page.** Markey steps up from its siblings with a simulation engine of its own: the Test Drive. Its tunnel is a three-dimensional lattice-Boltzmann solver (D3Q19, with a two-relaxation-time collision and an eddy-viscosity model for the turbulence it cannot resolve), written in raw WebGL2 rather than three.js and loaded only on Test Drive pages. Its structure follows the Aeolus solver, used with its author's permission, whose notes on a stability trap saved a day of rediscovery.
2. **Earning the right to a drag number.** The solver exists twice, on the GPU for you and on the CPU for the build, which checks it against published drag. The first attempt compared it with the textbook figures for a sphere or a cube, and that turned out to be a category error: those hold at high Reynolds numbers, and a test-sized grid runs at a few dozen, where a sphere's real drag is three times higher. The gate now checks against a published correlation at the Reynolds number actually run, nothing is ever tuned to match, and a solve that turns unstable withdraws its figure rather than report one.
3. **Choosing a car, not just reading about one.** The second new section is a set of tools for deciding: a matchmaker that asks what you need and narrows the field, a guided browse, four cars side by side, a garage of your own, and the cost of running a car at the price you actually pay. Each reads the same catalogue the encyclopedia is built from, so a tool can never disagree with a page.
4. **Light pages for a heavy catalogue.** The tool pages once carried the whole catalogue inside them, close to a megabyte each. They now fetch one shared file, once, that the browser keeps for every tool, and the catalogue pages load a light index and page through it.

## What makes it special

Everything that makes Xefy and eXir what they are, every figure sourced or computed and an unpublished one left empty, now with a step up: tools that help you choose and compare, and a real wind tunnel to put a car in.

## Built with

Astro · Svelte · TypeScript · Tailwind CSS · Zod · raw WebGL2 and GLSL · Pagefind · Barlow · Google Analytics · GitHub Pages.
