---
name: ConStyx
title: null
roots: [Construct, Styx]
split: 3
family: tributes
flagship: false
color: '#00ff41'
started: '2026-06'
sort: '2026-06-05'
dates:
  - '2026-06 a green digital rain: a screensaver and a small game'
  - '2026-07-11 first commit; Code Vision'
  - 2026-07-12 the visual refinement of the Focus scenes
url: https://kiarashfa.github.io/constyx/
repo: https://github.com/kiarashfa/constyx
line: The Matrix as an operator's console, with programs, places and quiet scenes to work in.
made: 'for those who know there is no spoon — only Fork'
notice: 'An unofficial fan tribute, not affiliated with Warner Bros. or the Wachowskis.'
---

## The idea

The browser turned into a hovercraft operator's console from The Matrix: green phosphor, the rain of code falling behind everything, and a menu of programs to load. Sit a shift as the operator, reading anomalies in the rain and making the right call before the trace closes in. Load training programs in the white Construct, from kung fu to deep work. Jack in to places from the films and walk them in first person: the white room, the rooftop jump, the dojo, bullet time, the woman in the red dress. Or settle into a Focus scene for a long, quiet sit with nothing to win: the Mobil Ave platform as a train passes, the Oracle's park, Seraph's tea room, Neo's cubicle at MetaCortex with the window cleaners outside, the Adams Street underpass in the rain, the Architect's wall of screens, the Merovingian's restaurant. Press V anywhere there and the world becomes code. The same code can look at you through your own camera, become a screensaver you take home, or set your words in terminal letters.

## The story

I love The Matrix: the trilogy, that is, never the 2021 sequel. I have watched it more times than I can count and played its games again and again, and I do not dismiss its central idea: that we might be living in a simulation is, to me, one real possibility among others, beside parallel universes. With artificial intelligence advancing by the day, the films only grow more relevant, and their picture of a world run by machines is a cleverer one than the apocalypse of films like The Terminator. The love runs through my other work too: The Matrix was the first film in the DrXRates ledger, its pills gave the ledger its blue and red, and the ledger wears a Matrix theme.

ConStyx began small, in June 2026: a simple green digital rain, half screensaver and half little game. It came right after LOSTimer and Pseudoku had dressed tools in favourite series, and took the idea from television to the cinema. It did not stay small. Program by program it grew into the whole console: a shift to work, lessons to load, places to walk, scenes to sit in, and the rain behind all of it.

The name joins the Construct, the loading program of the films, with the Styx, the river the Greeks set at the border between worlds: ConStyx is the crossing point between reality and the Construct.

## The challenges

1. **One rain for everything.** The falling code is a single engine, independent of any framework, that keeps its pace on any screen and frame rate and takes events (a highlighted column, a glitch) from whatever runs on top of it. It runs behind the console, as the Operator's game board and as the screensaver preview, and the screensaver download packs the very same engine into one self-contained HTML file.
2. **Whole rooms written in a shader.** Every Focus scene is a single fragment shader: geometry, light, fog and glow all described as distance fields and raymarched on one flat quad, seen from one fixed seat. When a computer cannot keep up, the scene lowers its own resolution step by step rather than stutter. On the way, one quiet trap: values written to the shader through the usual React route never reached the GPU, so time stood still and the train never came until the material was built by hand.
3. **The films, not reality.** Fidelity came first. Real filming locations were researched for architecture and layout (the Adams Street pickup is a 1926 railway viaduct in Sydney, so the underpass is an elliptical concrete arch), but anything that dates itself follows the screen: the car rolling through is a 1965 Lincoln Continental, built from simple shapes inside the shader, and the cubicle wears its 1999 beige.
4. **Real textures inside a raymarched world.** Photographic textures (free, CC0) had to be brought into scenes that have no meshes to wear them: loaded in place of a placeholder, decoded to linear colour by hand because the shader gets no colour management, and mapped by each surface's direction, or by the arch's own angle along the vault.
5. **Seeing the code.** Code Vision turns a live webcam into falling green glyphs without losing what the camera sees: each cell is averaged, lifted by local contrast and edged, so a teapot still reads as a teapot. Nothing leaves the device. The same pass can be laid over any Focus scene with a key, with no change to the scenes themselves.

## What makes it special

The films rebuilt faithfully, down to the car under the bridge and the beige of the cubicle; calm places from them to sit and work in; and the whole range, a game, lessons, walkable scenes, shader worlds and a camera that sees the code, all running on one rain.

## Built with

React · TypeScript · Vite · Tailwind CSS · React Router · three.js with React Three Fiber and drei · GLSL raymarching · the Web Audio API · CC0 textures from Poly Haven · GitHub Pages.
