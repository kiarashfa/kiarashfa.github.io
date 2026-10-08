---
name: Galerium
title: A Museum of Art History
roots: [gallery, museum]
split: 5
family: learning
flagship: true
color: '#c8a24b'
started: '2026-07'
sort: '2026-07-04'
dates:
  - 2026-07-04 first commit
  - 2026-07-05 the timeline becomes a floor plan
  - '2026-07-06 room sizes; the inspect view'
  - 2026-09-10 polish
url: https://kiarashfa.github.io/Galerium/
repo: https://github.com/kiarashfa/Galerium
line: A museum of art history, with a walkable gallery for every artist.
made: for people who read every placard
---

## The idea

A museum of Western painting with no opening hours. Its directory is the building itself, drawn in section: one floor for each period, Medieval and Gothic at street level and the present day at the top. Open a floor and its artists' rooms appear along it, each placed at the years its painter actually worked. Read the placard, pass through the doors, and you are inside that artist's own gallery in 3D: real paintings in gilded frames, each under its own picture light, a polished wooden floor that reflects them, benches down the middle and the painter's name in raised gold letters on the far wall. Walk up to any canvas and the camera glides in; a high-resolution view opens beside its story and the facts on record. It walks with a keyboard and mouse at a desk, and with a thumb joystick and a finger on a phone.

## The story

Painting has always fascinated me, with one conviction attached: a picture gives far more once you know what lies behind it. Much of what people feel before the Mona Lisa comes from its fame; many other canvases change entirely once you learn who the sitters were, what the painter was living through, and why the picture was made. Galerium sets out to give every painting that background.

Painting is the art that makes it possible. Good images of the works exist, most of them free of copyright, and their stories and their painters' lives have already been written, waiting to be gathered and read. A sculpture would not travel so well. Collecting all of it, hanging it in rooms and letting people wander through them seemed the least such a treasure deserved.

There was a second question too. The 3D backgrounds of my personal site had opened the door to three.js, and I wanted to find out how far it could go, and whether the sky was the limit.

The name joins gallery and museum, the _-ium_ made from the last letter of one and the last letters of the other.

## The challenges

1. **A museum built from Wikipedia.** My first work with Wikipedia and Wikimedia Commons, and the discovery of how much they offer: every biography, painting story, date and image here comes through their public APIs, gathered by a pipeline I wrote. A painting whose title does not match a Wikipedia article is refused out loud, never quietly swapped for something close, and only images that may be shown are hung. What was learned here went on to feed the encyclopedias that followed.
2. **A timeline that is a building.** Each artist sits at the median year of their paintings, the truest sign of when they worked, nudged just enough that no two rooms overlap. One floor opens at a time while the others fold to a band, and zooming stops before any label becomes unreadable.
3. **A room that feels like a museum.** Floors, walls and the coffered ceiling are drawn by code; each painting has its own picture light with a visible fixture; the name on the far wall is real extruded lettering that shrinks to fit any name; the doors carry a gilded exit plaque between etiquette notices. Reflections are lightened on phones so the room still runs smoothly there.
4. **Walking on any device.** At a desk the mouse steers the view. Where the browser refuses to lock the pointer, and on every touch screen, dragging steers instead, and walking takes a joystick, my first design of one for a phone: it follows one finger only, so a second touch never makes the view jump.

## What makes it special

An immersive, visual and educational walk through the whole of Western painting, built entirely on free knowledge from the internet and running in a browser. It is the chance I wish every museum could give: open to anyone, including people who cannot travel, cannot afford a ticket, or cannot easily walk through a real gallery.

## Built with

React · three.js through React Three Fiber and drei · Zustand · TypeScript and Vite · Node scripts on the Wikipedia and Wikimedia Commons APIs · Playwright · Cormorant Garamond and Inter · Google Analytics · GitHub Pages.
