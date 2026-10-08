---
name: Kalculator
title: null
roots: [Kia, calculator]
split: 1
family: tools
flagship: false
color: '#b06cf0'
started: '2026-05'
sort: '2026-05-24'
dates:
  - 2026-05-24 first commit
  - '2026-06-16 installable app (manifest, offline)'
  - 2026-07-09 keyboard redesigned
  - '2026-09-26 v2.0.0: the math display, pages and documents'
url: https://kiarashfa.github.io/Kalculator/
repo: https://github.com/kiarashfa/Kalculator
line: A calculator that writes natural math, solves, graphs and converts.
made: for everyone who counts
---

## The idea

A scientific calculator that sets math as a textbook would while you type it: a fraction stacks the moment you press the bar, a power climbs, a root's sign grows to cover what is under it. The same keypad then does far more than arithmetic: it solves equations and lists every root, real and complex; plots functions; takes derivatives and integrals; converts units, currencies and number bases. Each calculation sits on its own page, still editable after the answer appears, and pages gather into documents, much like a spreadsheet file: saved as you go, copied, reopened, carried to another device. It installs like an app and keeps working with no connection.

## The story

For more than ten years my calculator has been HandyCalc, on Android: light, fast, reliable, and with the best interface a calculator has ever had. Write a very long equation, then touch the one spot in the middle that needs changing, and it is changed. Nothing else came close.

But the app has long stopped growing, and every new version of Android risks leaving an old app behind as permissions and the system change around it. I could not risk losing it. There was a second thought too: with a calculator of my own, I could add the features I had always wanted, and the result could become something even better.

So I built Kalculator from scratch, in the spirit of HandyCalc, with the K for Kia.

## The challenges

1. **A full calculator, from scratch, in a browser.** Everything a phone app had done for years, and more, had to be rebuilt to run in a web page: an engine for exact and numerical math, a keypad and display that work with a finger or a keyboard, room on a phone screen for both, and an app that installs and keeps working offline, with no server behind it.
2. **Math that looks like math, while you type and edit.** The expression is a tree, not a line of text: fractions, powers, roots and functions are real structures, drawn with the fraction bar on the math axis and brackets and radicals that stretch to fit. Editing it had to feel as easy as on HandyCalc: a touch places the cursor at the nearest point, arrow keys walk in and out of fractions and powers, backspace steps into a structure instead of flattening it, a selection never cuts a fraction in half, and copying keeps the structure, so 2^3 pastes back as 2³.
3. **One calculator that does everything, and gets it right.** The first solver missed roots. Now a polynomial is recognised from sample points and all its roots are found together, complex ones and repeats included; any other equation is searched within a range the answer always states. Calculator habits are kept where the math library differs: sin 180° is exactly 0, log is base ten, % is a percentage. And every name typed is checked against the calculator's own functions, so no expression can reach into the engine and change how it computes.
4. **Work that is never lost.** Pages save themselves as you go, stay in step across browser tabs, and are written to files that open on any device. An opened file is never trusted: it is rebuilt piece by piece and every result is calculated again.

## What makes it special

Math that looks like a textbook while you type and edit it, in a calculator that also solves, graphs, converts and keeps every calculation in documents of its own.

## Built with

React · Vite · math.js · IndexedDB and the File System Access API · a service worker (installable, offline) · Inter, Space Grotesk and DM Mono · Node's test runner · Google Analytics · GitHub Pages.
