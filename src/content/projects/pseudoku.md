---
name: Pseudoku
title: Macrodata Refinement
roots: [pseudo, sudoku]
split: 6
family: tributes
flagship: false
color: '#7fdfff'
started: '2026-06'
sort: '2026-06-04'
dates:
  - '2026-06-04 first commit (most of the work in June)'
  - 2026-09-07 polish
url: https://kiarashfa.github.io/pseudoku/
repo: https://github.com/kiarashfa/pseudoku
line: Sudoku inside Lumon's MDR terminal. Please enjoy each puzzle equally.
made: for the Severance fandom
notice: 'An unofficial fan tribute, not affiliated with Apple TV+ or the makers of Severance.'
---

## The idea

A complete Sudoku workstation, installed on a severed floor. As a tool it does everything a player needs: it deals puzzles at four tempers named after Lumon's own, Woe, Frolic, Dread and Malice (easy to expert), checks a grid or finishes it, and accepts puzzles typed in, pasted as a string of digits, or photographed, while a ledger keeps every file refined and prints it as a Refinement Report. As a set it is Lumon to the last detail: Kier's sayings on the wall, company notices that turn from cheerful to passive to unsettling the longer you sit idle, a Break Room for those who err too often, a Waffle Party for the diligent, a command line that rewards the right names, and the Refinement Floor, where the scary numbers are found by feel under a magnifier and filed into their bins exactly as in the show.

## The story

I came out of Severance struck above all by Macrodata Refinement: rooms of people searching screens of numbers for the ones that belong together and sending them to the right box. A Sudoku player does nearly the same thing, and the overlap was too neat to leave alone.

It came straight after LOSTimer, and the two are siblings: a tool and a favourite series fused into one. That was the starting point. But I set out to try new things here: reading a puzzle from a photograph, rating difficulty the way a solver feels it, and rebuilding the Floor as a game of its own. And for those who know, the Hatch code works on Lumon's terminal too.

The name comes from my fondness for _pseu-_ words, with the P that is written and never heard. What I built here is more than a Sudoku, so it took the prefix: Pseudoku, which runs on into the word Sudoku itself.

## The challenges

1. **A puzzle from a photograph.** My first time taking a photo from the user, uploaded or taken on the spot, and reading numbers from it. Several approaches were tried, among them a CNN I trained and ran through ONNX; the one that worked best runs OpenCV and Tesseract in the browser, loaded only when first needed. The grid is found and straightened (with a white margin added so a grid flush with the photo's edge still stands alone, and corners snapped to the true intersections), each cell is cleaned so that grid lines vanish but the tail of a 9 survives, and every digit is read three times and settled by a weighted vote. A cell with ink but no reading goes to a review step, and only a puzzle with exactly one solution is accepted.
2. **Difficulty by technique, not by count.** Fewer clues do not make a harder puzzle. The solver reasons as a player does, from singles to pointing and claiming to pairs, and guesses only when logic stalls; each new puzzle is rated by the hardest step its solution needs and kept only if that matches the chosen temper. Woe needs singles alone, and Malice cannot be finished without a guess.
3. **The Refinement Floor, as in the show.** True Macrodata Refinement, not number sorting: every digit carries a hidden temper in small clusters that stir as the magnifier passes over them, the selection is made by hand with a sweep that never skips a digit, and a wrong drop earns the show's "Nope". Above all the boxes: each bin's lids swing open, the real digits leave the grid and fly in, the bin's four temper meters climb, and the lids close again.
4. **A sound pool, carried over.** The pool of players I first built for LOSTimer, so a sound can repeat back to back without cutting itself off, returns here on the Web Audio API: every cue is decoded in advance so none lags, and when too many play at once the oldest gives way. The error sound plays only for a mistake the grid actually shows, never for one only the hidden solution knows.
5. **A CRT that fits every screen.** The terminal scales itself to any window, shrinking but never stretching, and refits whenever its own content changes; on a phone the controls fold into a drawer.

## What makes it special

A faithful Severance tribute that is also a real Sudoku engine: generate, import from a photo, solve and keep score, all inside the Macrodata Refinement ritual.

## Built with

HTML, CSS and JavaScript (ES modules) · OpenCV.js and Tesseract.js · jsPDF · canvas-confetti · the Web Audio API · IBM Plex Mono and Archivo · Google Analytics · GitHub Pages.
