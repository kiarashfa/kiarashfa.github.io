---
name: Xefy
title: Recipe encyclopedia
roots: [chef, y]
split: 3
family: encyclopedias
flagship: true
color: '#b8432f'
started: '2026-08'
sort: '2026-08-06'
dates:
  - '2026-08-06 first commit (a visual prototype, ver7, on 7 Aug)'
  - 2026-08-10 the engine and the data pipeline
  - 2026-08-11 the first recipes
  - 2026-09-27 one design shared with its sibling encyclopedias
url: https://kiarashfa.github.io/Xefy/
repo: https://github.com/kiarashfa/Xefy
line: Recipes where every quantity, nutrition figure and timing is computed, never typed.
made: for those who find joy in every bite
---

## The idea

A recipe encyclopedia with one page per dish and one trusted way to make it. What sets it apart is invisible until you touch it: not a single number on a page is typed by hand. Quantities, nutrition, timings, oven temperatures and pan sizes are all worked out from structured data, so when you cook for three instead of six, or switch to cups and Fahrenheit, everything changes together, in the method as well as the ingredient list. A shared sauce or spice blend folds into the dish that uses it, steps and all; a timeline counts back from when you want to eat to when you should start; and a plan of the week's cooking turns itself into one shopping list. Free, with no ads and no account; whatever it remembers stays in your browser.

## The story

I had always wanted a cookbook, and every cookbook runs out of pages: the world's food does not fit in five hundred of them, unless you buy an encyclopedia in ten volumes. The internet has no such limit, but it has a thousand sites, each with its own style and its own way of writing an ingredient list, many with adverts wedged between the paragraphs. The same dish turns up on three pages by three authors; an Italian grandmother's recipe has its charm, but the inconsistency put me off. American sites give measures only in cups and Fahrenheit, which I have no feel for. And asking a chatbot is no better: the answer is gone once the cooking is done, and the same question weeks later can return a different recipe. I wanted one constant recipe for each dish, to come back to again and again, the way real learning happens.

It was also a step up in scale. PolymerAtlas had about a hundred pages; Xefy is planned for thousands. I wanted to push Astro further, this time with Svelte instead of React, and began with the engine that every page would stand on.

Behind both Xefy and its sibling eXir is a curiosity about what people eat and drink across cultures, nations and kitchens, and the conviction that eating and drinking well is one of life's most accessible pleasures. Now, whenever I cook, the recipe comes from Xefy.

The name came from cooking like a chef: something chef-y, with the _ch_ swapped for my favourite letter, the X of DrXRates. In Portuguese, Catalan and Galician, and close enough in Chinese pinyin, an X is said as _sh_.

## The challenges

1. **Static pages with numbers that move.** Every page is plain static HTML, yet every quantity, nutrition figure, timing, temperature and pan size on it must follow the serving count and the unit system. Not one number is typed by hand (a digit slipping into the method fails the build), and the same engine renders the page on the server and recomputes it in the browser, so the two cannot disagree. Keeping that clean across thousands of pages was the heart of the work.
2. **Accurate, and written correctly.** Nutrition comes from USDA FoodData Central, record by record, and the records have traps: careful entries missing their energy figure, micrograms arriving under two different symbols (miss one and every vitamin vanishes), ingredients such as guanciale that are not there at all and take the closest record with a note. The background of each dish rests on references, at least two independent publishers for every claim, with Wikipedia allowed to support one but never to carry it alone.
3. **Photographs at scale.** I already knew how to find pictures on Wikimedia Commons; the new problem was scale, and the difference between finding a picture and being sure it shows the right dish. Every candidate is looked at before it is adopted and its licence checked, and each is brought to a neutral balance before the house grade, so photographs from thousands of cameras read as one book.
4. **A sauce inside a dish.** A shared preparation such as béchamel joins the recipe that uses it as if written there: its steps fall into the method, its flour merges with the flour already on the list into one line, and the timing counts all of it. The merge checks itself, because the merged line's portions must still add up.
5. **When to start, what to buy.** Two features need no extra writing at all. The cook-back timeline works out, from each step's duration, phase and what runs alongside it, when to start for a meal at a chosen hour; and a week's plan and its shopping list are two views of one plan, shared as a link that the recipient's page recomputes in their own units.

## What makes it special

One constant, consistent recipe for every dish, free of adverts and authors' quirks, whose every number is computed, so a page can be scaled, converted and trusted, and returned to for years.

## Built with

Astro · Svelte · TypeScript · Tailwind CSS · MDX · Zod · Pagefind · USDA FoodData Central · Wikimedia Commons, Open Food Facts and Openverse · Google Analytics · GitHub Pages.
