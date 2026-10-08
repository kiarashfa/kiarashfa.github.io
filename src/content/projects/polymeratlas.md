---
name: PolymerAtlas
title: Atlas of Polymers
roots: [polymer, atlas]
split: 7
family: encyclopedias
flagship: true
color: '#c9a55c'
started: '2024-11'
sort: '2024-11-11'
dates:
  - '2023 the Polymat model online (polymatai.pythonanywhere.com)'
  - 2024-11-11 Molinfo, first commit
  - 2026-04-22 Molecular Calculator
  - 2026-07-14 the Atlas build begins
  - 2026-07-15 the Atlas goes live
url: https://kiarashfa.github.io/PolymerAtlas/
repo: https://github.com/kiarashfa/PolymerAtlas
line: The polymers that made the modern world, each told inside the year it was first made.
made: for everyone who has wondered what their world is made of
---

## The idea

A free encyclopedia of the materials that made the modern world, told as stories and paired with working tools. Each polymer is met in the year it entered the world, and what happened that year (a market crash, a world's fair, the eve of a war) is told alongside its chemistry, so the material is remembered together with its moment. After the story comes the reference: structure, synthesis, properties, processing, uses and fate. Beside the encyclopedia sit a molecule lookup, a property predictor running my own models, and a comparison of any three polymers. Read it as a catalogue, along a timeline of eras, or across a chart of two centuries; set it in Gilt, Vellum or Atelier, light or dark, SI or imperial.

## The story

Polymers are the field I studied, through a bachelor's and a master's in polymer engineering, and the wish to make something of that field never went away. Later, feeding molecules to neural networks as SMILES strings, I saw how much a single line of text could power. Around 2023 the model I was developing at Polymat [[1]](https://doi.org/10.1039/D3PY00246B) [[2]](https://doi.org/10.1002/aidi.202500248) went online with a web interface of its own, on PythonAnywhere, and showed that a free Python server could do real work. Molinfo followed in November 2024: a small app that reads a SMILES string and describes the molecule, built only to see the pipeline work. In April 2026 I joined my personal PythonAnywhere account to a page on GitHub and made the Molecular Calculator, one more trial to get a bigger idea rolling.

All the while, I was writing about every polymer I knew, from an angle of my own: the history of the year a polymer was discovered, patented or first mass-produced, woven together with the story of the polymer itself. Many synthetic polymers were invented to answer a need in the world wars, and how their makers produced them is always a fascinating story. The aim was to step away from the textbook, where I had first learned these materials by memorising them, and make each one memorable, with deeper insight. At first the only reader was me: the writing was a way to study the polymers again, properly. The plan was always a book, my own, one day.

Better at building websites by then, I changed the medium from a book to a site: more accessible, easier to edit and update, and with me as the publisher. It was also the chance to join the two worlds I had been working in, the models and computational tools on one side and the stories on the other. That is how PolymerAtlas was born.

The name mattered. Polymer sites with names like Polypedia already existed; I wanted a name that fitted the project, sounded good, and did not yet exist anywhere on the web. PolymerAtlas was all three.

## The challenges

1. **From one manuscript to a website.** The stories were written first, as entries in one long Word document. Each was cut into its own page by a script that turns Word's styles into page structure (headings, lists, the "Did you know?" box) and never touches a word of the text.
2. **Reading values out of the handbooks.** The property values come from two reference handbooks, read as PDFs, each polymer matched to its chapter in both books. One of them extracts with broken glyphs (minus signs, decimal points and range dashes come out as the wrong characters, in the file itself, whatever library reads it), so every value taken from it is repaired and checked against the raw text.
3. **Every structure in one hand.** Every chemical structure is drawn in ChemDraw and modelled in Chem3D, driven from scripts rather than by hand, so all of them share one house style. Each repeat unit is checked against its monomers before it is drawn, and the drawings are rewritten to take the page's colour, so they read in light and dark alike.
4. **Tools that live on a free server.** The molecule lookup and the property predictor run as two small Python services on PythonAnywhere's free tier, my own, and the one that first put the models online, called from a static site. A name is resolved through PubChem, with a second resolver when PubChem has no answer; and when the service is unreachable, the molecule lookup switches to RDKit running in the browser, with no network at all.

## What makes it special

It joins the two halves of my working life in one place: stories that weave each polymer into the history of its year, and tools built on my own models. The book I always meant to write, published by me, as a site.

## Built with

Astro · React islands · MDX with KaTeX · Python scripts for the manuscript, the handbooks and ChemDraw / Chem3D · RDKit (server and WebAssembly) · 3Dmol.js · two Flask services on PythonAnywhere · Pagefind search · GitHub Actions and GitHub Pages. No ads, no accounts, no trackers; preferences stay in the reader's browser.
