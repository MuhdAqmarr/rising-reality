# A Rising Reality

A Rising Reality is a climate-change scrollytelling website built with Vite,
GSAP, ScrollTrigger, Lenis, and SplitType. The page uses one fixed viewport
called the "camera" and a very tall invisible scroll container. As the user
scrolls, GSAP scrubs through one master timeline and changes the visible scene.

## Quick Start

```bash
npm install
npm run dev
```

Build the production version with:

```bash
npm run build
```

Preview the production build with:

```bash
npm run preview
```

## Project Structure

```text
.
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ASSET_INVENTORY.md
│   ├── DEBUGGING.md
│   ├── SCENE_GUIDE.md
│   └── Rising-Reality-WireframeStoryboard.pdf
├── public/
│   ├── favicon.svg
│   └── assets/
├── src/
│   ├── scripts/main.js
│   └── styles/main.css
├── index.html
├── package.json
└── package-lock.json
```

## Where To Edit

- Story markup: `index.html`
- Animation timing and interactions: `src/scripts/main.js`
- Layout, visual styling, and responsive rules: `src/styles/main.css`
- Runtime media files: `public/assets/`
- Learning documentation: `docs/`

## Learning Goals

Students can study this project to learn:

- How scrollytelling separates scroll distance from screen layout.
- How a GSAP master timeline controls many scenes.
- How ScrollTrigger connects a timeline to scroll progress.
- How Lenis smooth scrolling is connected to ScrollTrigger.
- How SplitType prepares text for character, word, and line animation.
- How to organize a frontend project so runtime code, assets, and docs are easy
  to find.

## Maintenance Notes

Keep `public/assets/` limited to files that are actually referenced by
`index.html` or `src/styles/main.css`. Generated folders such as `dist/` and
dependencies such as `node_modules/` should not be committed.

