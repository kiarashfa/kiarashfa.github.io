---
name: LOSTimer
title: The Swan Station
roots: [LOST, timer]
split: 4
family: tributes
flagship: false
color: '#3bd16f'
started: '2026-05'
sort: '2026-05-21'
dates:
  - '2026-05-21 first commit (most of the work that month)'
  - 2026-09-07 polish
url: https://kiarashfa.github.io/LOSTimer/
repo: https://github.com/kiarashfa/LOSTimer
line: The Swan Station countdown from LOST, as a working timer. Namaste.
made: for the LOST fandom
notice: 'An unofficial fan tribute, not affiliated with ABC, Disney or Bad Robot.'
---

## The idea

A countdown timer for everyday use, dressed as the computer in the Swan Station, the Hatch, from LOST. The clock starts at 108 minutes, as on the island, though any duration can be set. A split-flap clock counts down above a CRT monitor and an Apple II+ keyboard; from four minutes the beeping starts, from one minute the alarm. Enter 4 8 15 16 23 42 to reset it. Miss it, and the system fails as it did in the show: the flaps spin and settle into hieroglyphs. The monitor answers commands: the station protocol, the communication log of Kelvin and Desmond, the orientation film. And the island keeps its secrets: say hello to the terminal and someone may answer; use it for anything but the code, and DHARMA will warn you. Namaste, and good luck.

## The story

My attachment to television series starts with LOST. Other shows came first, but LOST reshaped what a series could be, and reshaped me as a viewer. Its puzzles kept my curiosity burning (the DHARMA Initiative, the hatches, the hieroglyphs on the clock), and above all the counter, which I had wanted to own ever since.

MorCypher had just shown how good it felt to build a tool instead of a website, and it started a thought: dress the everyday tools in a theme. A timer was the obvious first, and there was only one timer it could be. Years later, the wish finally had a way to come true.

## The challenges

1. **A split-flap clock.** Every digit is a flap that folds down to reveal the next, built in CSS. On a reset the tiles shuffle like a roulette and slow to a stop; on failure they settle into hieroglyphs in the order the show used, fourth, fifth, second, first, third.
2. **A terminal that types.** The monitor writes like a 1980s screen, character by character, with paces of its own for a page loading, a quick sweep and a voice on the line, any of which can be skipped. Its pages, its command aliases, the Michael and Walt exchange behind "hello" and the lockout warning after two wrong entries all run on that one typewriter.
3. **An Apple II+ on a phone.** On a touch screen the phone's own keyboard would break the spell, so it is held back and a virtual keyboard laid out like the Swan's Apple II+, down to RESET, ESC, RPT and RETURN, takes its place.
4. **The sound of the Hatch.** My first real sound design. The station speaks in recorded effects: the tick of every second, a beep every two seconds from four minutes, an alarm from one minute, the triple system-failure call, the keys. A sound played back to back cuts itself off, so each effect gets a small pool of players that take turns, enough for fast typing on the keyboard; I learned the technique here and carried it into Pseudoku. Browsers keep a page silent until it is touched, so the station asks once to activate its audio.
5. **Time that keeps running.** A timer must not stop when the tab sleeps or the page is closed. The countdown is measured against the clock rather than counted in ticks, and saved, so on return it picks up exactly where the time has run to.

## What makes it special

Something I always wanted to have, faithful to the show, and smart enough to be a tool: not an ornamental fan tribute, but a timer that is really used.

## Built with

HTML, CSS and JavaScript · VT323, Share Tech Mono, Oswald and Noto Sans Egyptian Hieroglyphs · Lostpedia for reference · Google Analytics · GitHub Pages.
