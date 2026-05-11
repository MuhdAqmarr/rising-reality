# Architecture

This project is a single-page scrollytelling experience. It does not use a
router or component framework. Instead, the whole story is built from HTML
sections, CSS scene layers, and one GSAP animation controller.

## Core Pattern

The main pattern is:

1. `.scroll-container` creates a very tall page.
2. `.camera` is fixed to the viewport.
3. Every `.scene` sits inside the camera.
4. GSAP changes opacity, transforms, clipping, and text states as scroll
   progress advances.

This is useful because the browser scrolls through normal page height, while the
viewer sees a cinematic fixed canvas.

## Main Files

- `index.html` contains all scene markup. It is intentionally explicit so
  students can inspect the full story structure without jumping across many
  components.
- `src/scripts/main.js` registers GSAP plugins, initializes Lenis, splits text,
  sets initial animation states, builds the master timeline, and handles custom
  interactions.
- `src/styles/main.css` defines the fixed camera, scene layouts, art direction,
  responsive styling, and non-scroll CSS effects.
- `public/assets/` stores images, SVGs, GIFs, and video files used at runtime.

## Animation Stack

GSAP handles animation values and sequencing.

ScrollTrigger connects the master timeline to the scroll container.

Lenis smooths wheel scrolling. The important bridge is:

```js
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
```

SplitType converts selected text into chars, words, or lines so GSAP can animate
smaller pieces of text.

## Scene Visibility

CSS starts most scenes hidden. `main.js` then uses `gsap.set()` to prepare the
starting state. During the master timeline, scenes fade in and out with
`autoAlpha`, `opacity`, and `visibility`.

Use `autoAlpha` when the element should become invisible and non-interactive.
Use `opacity` when the element can remain present but visually transparent.

## Interaction Model

Most of the website is scroll-driven. Scene 5 has a special interaction:

- The scroll reaches a lock marker.
- The page waits for the user to press Enter.
- GSAP plays a transition into the next panel.
- The user clicks buttons to reveal extra content.

That section is intentionally different because it teaches how scroll-driven and
event-driven animation can work together.

