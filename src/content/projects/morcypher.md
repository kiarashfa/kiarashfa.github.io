---
name: MorCypher
title: Morse Code Device
roots: [Morse, cypher]
split: 3
family: learning
flagship: false
color: '#f29a2e'
started: '2026-05'
sort: '2026-05-17'
dates:
  - 2026-05-17 first commit
  - '2026-06-02 a second round (fonts, icons, manifest)'
  - 2026-09-07 polish
url: https://kiarashfa.github.io/morcypher/
repo: https://github.com/kiarashfa/morcypher
line: A virtual telegraph key for sending, decoding and learning Morse code.
made: 'and — — ● ● ●   ● ● ● — —'
---

## The idea

A telegraph key in the browser. Send with the on-screen key, the space bar or the mouse, a short press for a dot and a long one for a dash, or write ordinary text and have it keyed for you; it plays back as a genuine CW tone, in a clean sine, a telegraph click or a rasping buzzer, at any speed from a beginner's to an expert's. As each signal arrives, a binary tree lights up the path from the antenna to its letter, so you see Morse as it is built: a dot starts the E branch, a dash the T branch. Text turns into Morse and back, a message can travel as a link, and a drill trains the ear, with the code shown or hidden. The device is yours to dress: its finish (matte, plastic, wood, circuit, brushed metal), its glow, its type and its speed.

## The story

It started with a picture on the internet: the Morse code tree. I had always seen Morse as a list to memorise, with no system behind it. The tree showed that everything falls into place in one diagram: a dot starts the E branch, a dash starts the T branch, and so on down. Suddenly a device that shows the flow of that diagram was irresistible. The compact view, with its mirrored spines, is the one that inspired it.

Then the features came one by one: numbers and punctuation, Morse to text and text to Morse, the drill to learn by practice, a blind mode for the drill, and the choices of colour, finish and speed. MorCypher became the Morse device I always wanted to make; maybe not in real life, but a virtual one, made with code.

It was my second tool after AudiOptix, something to use rather than a website to read, and I loved the experience. It started a thought: dressing everyday tools, like a timer, in a theme. That thought became LOSTimer.

## The challenges

1. **A tree that shows the flow.** The tree had to light up the path of every signal as it arrives, and fit any screen. It comes in four layouts, from the classic tree to the compact one with mirrored spines, all the same height so switching between them is seamless, with the numbers and punctuation as rows of chips or as lights on the tree itself.
2. **Telling a dot from a dash.** A human hand is not a metronome. How long a press counts as a dash, and how long a pause ends a letter, is measured against the chosen speed rather than fixed, so the key reads a beginner's slow hand and a fast one alike.
3. **The sound of a real key.** Every tone is built live with the Web Audio API, with a few milliseconds of rise and fall on each signal so it sounds like a key and never clicks, and three voices made from oscillators and a filter.

## What makes it special

You watch Morse being built: every signal travels down the tree to its letter, so the code that always looked like a list to memorise becomes a diagram you can follow.

## Built with

HTML, CSS and JavaScript · the Web Audio API · SVG · Google Analytics · GitHub Pages.
