---
name: AudiOptix
title: An evolving music visualizer
roots: [audio, optics]
split: 4
family: tools
flagship: false
color: '#e8c890'
started: '2025-09'
sort: '2025-09-01'
dates:
  - '2025-09 Suno v5 is released; my first song with it'
  - 2026-05-03 first commit
  - 2026-05-25 the last upload of the first version
  - '2026-09-09 polish (self-hosted fonts, link check, sitemap)'
url: https://kiarashfa.github.io/audioptix/
repo: https://github.com/kiarashfa/audioptix
line: A music player and visualizer, built so my own music is heard the way it should be.
made: for music lovers
---

## The idea

A music player that turns whatever is playing into moving light. It plays my own songs, written and produced with Suno, and anyone's own files too: drag tracks in to build a playlist, and AudiOptix reads their tags and cover art and drives the visuals from the sound itself. Themes change the whole room, each with its own type and colour; the visualizers can be chosen and tuned, and the look and the sound shaped to taste. Nothing is uploaded and nothing streams: the music never leaves the device. Even the browser tab listens, its icon dancing to the music.

## The story

In September 2025 Suno released its v5 model, and I made my first song with it. I wanted to share my music, but not as a bare MP3. Whoever hears it should hear it on a player I built, one that plays it the way I believe it must be heard.

So the player came first, with the visuals as its other half: the sound and what you see together. That is the name, audio and optics, AudiOptix.

## The challenges

1. **Music files, inside the browser.** Every one of my projects is a new field for me, and this one was music: playing a listener's own files without uploading them, and reading the titles, artists and cover art stored inside each file. Tags are read in the browser itself; for a bundled song they arrive over a ranged request, so a cover costs a few tens of kilobytes rather than the whole track.
2. **Turning sound into light.** The player feeds the Web Audio API, whose analyser splits the music into frequencies many times a second, and the visuals follow them. Browsers refuse to start sound on their own, so the audio graph is built at the first press of play.
3. **A favicon that listens.** My first live favicon: while music plays, the icon in the browser tab becomes a tiny visualizer of its own, its bars drawn from the same analyser at a few frames a second, rising fast and falling slowly like real meters. When the music stops, it settles back into the AudiOptix mark.

## What makes it special

My own music on my own player: songs heard exactly as their maker means them to be, with visuals that move with every note, down to the icon in the tab.

## Built with

React · the Web Audio API · Canvas · jsmediatags · Babel · Node and Python tools for fonts, icons, sitemap and link checks · Suno for the music · Google Analytics · GitHub Pages.
