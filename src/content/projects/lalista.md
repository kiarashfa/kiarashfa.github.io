---
name: LaLista
title: null
roots: [la, lista]
split: 2
family: learning
flagship: true
color: '#4b9c8b'
started: '2024-04'
sort: '2024-04-18'
dates:
  - '2024-04-18 the Memrise course Español Esencial and its audio script'
  - 2026-07-18 first commit of the site
  - 2026-09-29 cloud sync
url: https://kiarashfa.github.io/LaLista/
repo: https://github.com/kiarashfa/LaLista
line: Spanish as it is spoken in Spain, one word and one rule at a time.
made: 'and a lot of ¿ and ¡'
---

## The idea

A free place to learn Spanish as it is spoken in Spain, Castellano, with vocabulary and grammar side by side. The vocabulary is a flashcard trainer: words in topic groups, each with recorded pronunciation, Castilian phonetics and an example sentence, climbing seven stages from New to Mastered, with a relaxed Review and a timed Test beside it. The grammar is a reference in which each topic, ser against estar or the subjunctive, gets one chapter that carries it from its basics to its rarest exceptions, followed by a workbook of exercises. There is nothing to sign into: progress lives in a small file the learner keeps, and, if they like, their own Google Drive or Dropbox keeps it in step across devices.

## The story

I live in Spain and needed Castellano, quickly and well. To grow my vocabulary, I built a course on Memrise, [Español Esencial](https://community-courses.memrise.com/community/course/6645358/espanol-esencial/), and wrote a script to give its words their pronunciation. But Memrise handled its community courses poorly: first they were split from the main app, then they were to be deleted by the end of the year, then the date moved, then the plan changed again. I grew frustrated, and worried about losing my records.

The answer was a site of my own: full control, and learning rhythms set to my own taste. It was never meant to be the Memrise course moved house. I wanted something bigger, sturdier and more complete, so the grammar came in beside the words, and LaLista grew into two complete halves, grammar and vocabulary, learned together.

The name came from playing with Spanish words. _La lista_ is the list, the list of words on the flashcards, and _lista_ also means clever. A double meaning, and a catchy name. Split in two, it also maps the site: _la_ stands for the grammar, _lista_ for the words.

## The challenges

1. **A voice for every word.** Pronunciation had to be real and Castilian, and no single source had it all. Every word now has up to three voices from three sources: a consistent Castilian recording, volunteers' recordings from Lingua Libre, and a Castilian synthetic voice (Piper) that covers every word, so none is ever silent. Recordings exist only for exact headwords, and filling a gap with a near match (_ojo_ for _ojos_, _gracia_ for _gracias_) would teach the wrong word, so the synthetic voice fills it instead.
2. **Choosing the words.** The Memrise list was a start, not the answer: many of its words were changed. The list had to hold the words Spanish speakers use most, and at the same time reach across many levels and subjects, each word placed in its topic with its phonetics and an example sentence.
3. **Complete, without overwhelming.** Each grammar topic is told completely in one chapter, which risks burying a beginner under the finest exceptions. Every chapter follows the same arc, from the core pattern out to the nuances, and every section carries its level (A1 to C2), so a new learner can read what belongs to them and leave the rest for later.
4. **Saving to the cloud without a server.** My first time giving users a cloud save. With no backend, sync talks straight from the browser to the learner's own Google Drive or Dropbox, in a folder only LaLista can see, so studying moves seamlessly from laptop to phone or tablet. When the same profile was studied on two devices between syncs, a three-way merge combines them, so no study is lost.
5. **A whole learning app, first-hand.** Making the flashcards was the easy part; making them teach was not. The trainer had to have a rhythm: new words in small batches, seven stages with spaced returns, difficult words that resurface more often, a Review that reinforces without touching progress, and a Test with a clock and five lives that cannot harm it. Getting all of it to work together, end to end, was the invaluable lesson of the project.

## What makes it special

A place for self-study where vocabulary and grammar are learned together, both very complete, in the way I like to learn.

## Built with

Astro · React islands · MDX · TypeScript scripts reading Excel (ExcelJS) · Python for the audio and phonetics · Piper TTS · Lingua Libre (Wikimedia Commons) · ipa-dict · Google Drive and Dropbox APIs (browser only) · GitHub Actions and GitHub Pages. No ads, no accounts, no trackers, no cookie banners.
