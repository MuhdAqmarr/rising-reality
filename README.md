# A Rising Reality

A single-page scrollytelling experience about climate change, built with GSAP, ScrollTrigger, Lenis, and SplitType on top of Vite.

The story unfolds over six scenes — from a quiet title intro, through the visible effects of warming (heatwaves, droughts, floods, storms, ecosystem collapse), into the human causes, the actions we can take, and a final call to action.

## Quick Start

```bash
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173/`). Open it in a browser.

To build for production:

```bash
npm run build
npm run preview
```

## Tech Stack

- **[Vite](https://vitejs.dev/)** — dev server and bundler
- **[GSAP](https://gsap.com/)** + ScrollTrigger — animation timeline driven by scroll
- **[Lenis](https://lenis.darkroom.engineering/)** — smooth wheel input
- **[SplitType](https://github.com/lukePeavey/SplitType)** — splits text into chars/words/lines for granular animation

## Project Structure

```
.
├── docs/                   Student-facing documentation (HTML)
│   ├── index.html
│   ├── run-and-edit.html
│   ├── architecture.html
│   ├── scene-guide.html
│   ├── debugging.html
│   ├── asset-inventory.html
│   └── Rising-Reality-WireframeStoryboard.pdf
├── public/
│   ├── assets/             Images, SVGs, GIFs, video
│   ├── BG-Audio.mp3        Background music
│   ├── favicon.svg
│   └── icon.png
├── src/
│   ├── scripts/main.js     Animation controller (GSAP + Lenis + SplitType)
│   └── styles/main.css     Layout, scene styling, responsive rules
├── index.html              Story markup (scenes 1–6)
└── package.json
```

## How It Works

1. `.scroll-container` creates the total scroll height.
2. `.camera` is a fixed viewport that holds every `.scene`.
3. A single GSAP master timeline runs with `scrub: true`, mapping scroll progress to animation time.
4. Lenis smooths the wheel input; `wheelMultiplier` is intentionally low so the story does not rush forward.
5. Scene 5A has a scroll lock — the user presses **Enter** (or taps, on touch devices) to play a window-shutter transition into Scene 5B.

For a deeper walkthrough, open [`docs/index.html`](docs/index.html) in a browser.

## Where to Edit

| File | What lives here |
|------|-----------------|
| `index.html` | Scene markup and layered structure |
| `src/scripts/main.js` | Animation timing, scroll triggers, interactions |
| `src/styles/main.css` | Layout, visuals, responsive rules |
| `public/assets/` | Runtime media (images, SVG, GIF, video) |
| `docs/` | Learning documentation |

## Documentation

The `docs/` folder contains student-facing guides:

- **Start Here** — overview and quick orientation
- **Run & Edit Guide** — install, run, edit text, swap assets, adjust animation
- **Architecture** — fixed camera pattern, GSAP timeline, Lenis bridge
- **Scene Guide** — scene-by-scene breakdown
- **Debugging** — common issues and fixes
- **Asset Inventory** — what each file in `public/assets/` is used for

Open [`docs/index.html`](docs/index.html) locally to browse them.
