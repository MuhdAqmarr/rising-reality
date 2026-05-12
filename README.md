# A Rising Reality

A single-page scrollytelling experience about climate change, built with GSAP, ScrollTrigger, Lenis, and SplitType on top of Vite.

The story unfolds over six scenes — from a quiet title intro, through the visible effects of warming (heatwaves, droughts, floods, storms, ecosystem collapse), into the human causes, the actions we can take, and a final call to action.

## Getting Started

### Prerequisites

Install these once on your computer:

1. **[Node.js](https://nodejs.org/)** — download the **LTS** version and run the installer (just click Next until done).
2. **[Visual Studio Code](https://code.visualstudio.com/)** — the code editor you will use.

### Step-by-step

1. **Unzip the project** somewhere easy to find (e.g. Desktop). You should now have a folder called `rising-reality`.
2. **Open VS Code.**
3. In VS Code, go to **File → Open Folder…** and pick the `rising-reality` folder you just unzipped.
   - If a popup asks *"Do you trust the authors of the files in this folder?"*, click **Yes, I trust the authors**.
4. **Open the built-in terminal** in VS Code: top menu **Terminal → New Terminal** (shortcut: `` Ctrl+` `` on Windows, `` Cmd+` `` on Mac). A terminal panel opens at the bottom.
5. In that terminal, type the following and press Enter. This downloads everything the project needs (only required the first time):
   ```bash
   npm install
   ```
6. After it finishes, run the website locally:
   ```bash
   npm run dev
   ```
7. The terminal will show a line like `Local: http://localhost:5173/`. **Hold Ctrl** (Windows) or **Cmd** (Mac) and click that link — the website opens in your browser.
8. To **stop** the server later, click in the terminal and press `Ctrl+C`.

### Build for production (optional)

If you want a final shippable version of the site:

```bash
npm run build
npm run preview
```

`npm run build` outputs the optimized site into a `dist/` folder. `npm run preview` lets you check the built version locally.

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
