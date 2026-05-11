# Scene Guide

Use this file as a quick map when editing the story.

## Scene 1 - Title Intro

Markup: `index.html`, `.scene-1`

Purpose: introduces the title and sets the cinematic window/camera metaphor.

Key assets:

- `window_frame.png`
- `iceberg_bg.png`

Key animation area: the intro autoplay timeline and early master timeline in
`src/scripts/main.js`.

## Scene 2 - The Problem

Markup: `index.html`, `.scene-2`

Purpose: reframes climate change from something distant to something personal.

Key animation idea: text is split with SplitType and revealed in sequence.

## Scene 3 - Effects

Markup: `index.html`, `.scene-3`

Purpose: shows climate effects such as warming, melting ice, heatwaves, droughts,
floods, storms, and ecosystem disruption.

Key assets:

- `globe_space.mp4`
- `world.svg`
- `termometer_burned.png`
- `sun.png`
- tree images
- storm cloud images
- `hurricane.gif`

Implementation note: rain drops are generated dynamically in `main.js` so the
HTML does not need 80 repeated elements.

## Scene 4 - Causes

Markup: `index.html`, `.scene-4`

Purpose: explains human causes through a vertical timeline path.

Key assets:

- `factory.png`
- `house.png`
- `car.png`
- tree images
- building images

Implementation note: the SVG path length is measured in JavaScript, then
`strokeDasharray` and `strokeDashoffset` are animated to draw the line.

## Scene 5 - What We Can Do

Markup: `index.html`, `.scene-5`

Purpose: shifts the story from problem to action.

Key interactions:

- Enter key unlocks the transition from 5A to 5B.
- Energy usage buttons reveal subtext.
- Transport, consumption, and collective action panels continue through scroll.

Key assets:

- `bus.png`
- `walk.png`
- `bicycle.png`
- `bottle.png`
- `recycle_bag.png`
- `recycle.png`
- `handshake.png`

## Scene 6 - Call To Action

Markup: `index.html`, `.scene-6`

Purpose: ends with a hopeful final message and CTA button.

Key assets:

- `healthy_forest.jpeg`
- `kemarau.jpg`

Implementation note: the final `US` word is highlighted with `.s6-us-highlight`.
The CTA button uses a CSS pseudo-element to draw the border on hover.

