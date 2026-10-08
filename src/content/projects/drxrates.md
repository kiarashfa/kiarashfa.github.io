---
name: DrXRates
title: The Cinema Ledger
roots: [Director, X]
split: 2
family: film
flagship: true
color: '#c9a86a'
started: '2022-12'
sort: '2022-12-01'
dates:
  - '2017-10-01 first score (The Matrix, on Twitter)'
  - '2022-12 Twitter stops the creation of new Moments: the move begins'
  - 2023 the wish for a home of its own grows
  - 2024-06 the decision to build the site
  - 2026-07-07 first commit
url: https://kiarashfa.github.io/DrXRates/
repo: https://github.com/kiarashfa/DrXRates
line: A personal film archive with a ten-part rating system.
made: for cinephiles
---

## The idea

Every film I watch is scored out of ten, in two halves: five marks for what the film says (originality, character, continuity, suspense, meaning) and five for how it says it (acting, cinematography, sound, directing, production design). Content is blue and form is red, the oldest duality in film criticism, worn on purpose. The Cinema Ledger opens that habit up as an archive of more than twenty thousand films, with my scores beside those of TMDB, IMDb, Rotten Tomatoes and Metacritic, and hands the same scorecard to every visitor.

## The story

It began on 1 October 2017, fittingly with The Matrix, scored on Twitter ([the first post](https://x.com/DrXRates/status/914486863142047744)). Every film since has been scored the same way.

The name came from Microsoft's DirectX, a name I always liked, crossed with the cinema's director: DirectorX, DrX. The X stood for anonymity too. A critic's reputation should not make the words truer or falser; nothing should be accepted just because André Bazin said it. The hashtag #DrX made every score easy to find: type a film's name with #DrX and my verdict comes up without the noise. In 2017 nobody guessed that Twitter itself would one day be called X.

The turn came in December 2022, when Twitter stopped the creation of new Moments. The platform kept changing under the ledger: Moments disappeared, and posts of four pictures stopped showing the frames the way they were chosen. The wish for a home of its own grew through 2023, and in June 2024 I decided to act. The Cinema Ledger is the answer: a place I control, built to last. The critic is no longer anonymous (my name is in the footer), but the belief behind the X stands.

## The challenges

1. **Choosing the tools.** It was one of my first projects, so the whole system had to be chosen and learned at once: npm, Astro, a component framework. It started in React and moved to Svelte, which proved lighter for a site like this. React has since become the exception, kept for small projects.
2. **Gathering twenty thousand films.** The archive is built from TMDB and OMDb, which means pulling data in bulk through APIs that were never meant for it. TMDB's sorted lists stop at page 500, so the most-voted films are collected in bands, each starting below the last. OMDb's free key allows about a thousand requests a day, so its scores arrive in daily batches, rated films first. Every answer is cached on disk, so nothing is fetched twice and the archive can grow.
3. **Joining the spreadsheet to the archive.** The scores live in the Excel file I have kept since 2017, with its own habits: separator columns, running averages, placeholders, even a title Excel had turned into a time ("2:22"). The site reads the file exactly as it is, and matches every rated film to its one true record without guessing. A near match goes to a review list, and my correction always wins.
4. **Bringing the still frames home.** After every film, I post still frames on X under the film's #DrX hashtag. They are brought home from the downloaded X archive: each post is matched to its film by its hashtag, even when a long title was shortened or two films share a name, and the frames appear on the film's page.

## What makes it special

Years of one unchanging discipline, every film since The Matrix scored the same ten ways, moved off a platform that kept changing into a ledger of its own. And anyone who loves cinema can score a film with the same card.

## Built with

Astro · Svelte · Node scripts reading Excel (ExcelJS) · the TMDB and OMDb APIs · Wikimedia Commons for portraits · Playwright · GitHub Pages. Fully static: no server, no accounts, no trackers; visitors' ratings stay in their own browser, with export and import.

## Figures

About 21,000 films, about 1,270 of them rated by me, over 21,000 prebuilt pages, three themes (light, dark, matrix).
