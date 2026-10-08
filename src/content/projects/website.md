---
name: Personal site
title: null
roots: [Kiarash, Fa]
split: 8
family: personal
flagship: false
color: '#3cc7b8'
started: '2025-02'
sort: '2025-02-01'
dates:
  - '2025-02 the review paper begins, and the first version of the site, in the repo "about"'
  - 2025-02-10 the earliest blog post
  - 2026-03 the main development, as the Polymat contract nears its end
  - '2026-04-22 moved to the repo "website"'
url: https://kiarashfa.github.io/website/
repo: https://github.com/kiarashfa/website
line: My own site, with features built just for it.
made: null
---

## The idea

My personal site and weblog: the research, the papers, the résumé, the writing, the photographs. Its heart is a duality set in the themes. Each is a living three.js world behind every page, answering the mouse and diving deeper as you scroll. The light theme is a polymerization reactor, the scientist's side: molecules drift in a solvent, a spark creates a radical, and a chain grows as monomers join it. The dark theme is the programmer's side, a neural network suspended in space and learning as you watch, its neurons firing and light running along the connections. Around them sit the résumé and CV, the papers, a blog, a gallery, resources, and PolyLab, where my work in machine learning and chemical engineering becomes something to play with.

## The story

The site began around February 2025, when I started writing a [review paper](https://www.sciencedirect.com/science/article/pii/S007967002500108X). It first lived in a repository called _about_, now archived; the old address still leads to the new site, so the link printed on my résumé keeps working. Most of it was built in spring 2026, above all in March, as my research contract at Polymat was nearing its end and my résumé deserved a better portfolio. In April it moved to its own repository, _website_, carrying its posts and pages with it.

It was my first hands-on 3D on the web, and the first time I built three-dimensional work for HTML at all. The backgrounds were state of the art when they were designed, and they opened the door to everything in three.js that followed, Galerium among them.

## The challenges

1. **A network you can watch learn.** The dark background had to look like a neural network in training, not a static diagram. Glowing pulses travel along the edges, a neuron that fires throws sparks, and a click starts a cascade that spreads from node to node like a thought through a brain.
2. **A cinematic camera.** Scrolling flies the camera along a Catmull-Rom spline, from far outside into the heart of each world, while a second spline steers where it looks, the field of view widens as it dives, and a slight sway keeps it alive. Its position, path and angles were a whole world for me to learn.
3. **The illusion of infinity.** A few hundred nodes or molecules would look like a small cluster in empty space. Thousands of faint particles fill the depth behind them, glowing with additive blending on the dark side and fading into a white fog on the light side, where the same trick would make them vanish.
4. **PolyLab: the work, made playable.** I wanted to show what machine learning does for chemical engineering, interactively. In one demo a polymer chemistry-informed network, a plain network and a mechanistic model predict the same reaction; push the conditions past the training data and only the informed model stays physical. In the other, the visitor shapes a reactor's feed and then lets a reinforcement-learning agent try.
5. **Pages without a build.** Blog posts are plain Markdown files listed in one index and rendered in the browser, so a new post is a new file. The résumé and CV are drawn page by page with PDF.js in a viewer of their own rather than an embedded file, and the papers are shown with their graphical abstracts.

## What makes it special

The duality of its two themes: by day a polymerization reactor for the scientist, by night a neural network in training for the programmer, both alive behind every page.

## Built with

three.js · PDF.js · Marked · GitHub Pages.
