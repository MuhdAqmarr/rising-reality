---
name: awwwards-scrollytelling
description: >
  Custom skill distilled from deep analysis of 13 real Awwwards-style GSAP projects in this workspace
  (cursor-driven, followart, house-of-epochs, inversa, ironhill, jesko, moblink, orbit-matter, ova,
  poly-app, prototypestudio, split-card, waabi). Covers architecture, scroll choreography, typography
  animation, preloaders, page transitions, cursor/parallax effects, WebGL/Three.js integration, and
  production-level code patterns. Combines with all installed gsap-* skills.
  Use for: building Awwwards-level scrollytelling, cinematic hero sections, pinned scrub sequences,
  SplitText reveals, page transitions, preloaders, cursor effects, or any premium interactive website.
---

# Awwwards Scrollytelling — Custom Skill

Derived from hands-on analysis of 13 production GSAP projects. This skill encodes the **exact patterns,
architecture decisions, and code idioms** that define Awwwards-winning vanilla-JS websites.

---

## 1. FOUNDATIONAL ARCHITECTURE — The Setup Trinity

Every project uses the **same 3-part setup** at the top of the main script:

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// Lenis + GSAP integration (canonical pattern from all 13 projects)
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0); // CRITICAL: prevents lag on tab switch
```

**Alternative RAF pattern** (ironhill, house-of-epochs style — cleaner for complex sites):
```js
function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

**Rule:** Always wrap in `DOMContentLoaded` for vanilla JS projects. For React/Next.js use
`useGSAP` + `useEffect` with `lenis/react`.

---

## 2. THE PINNED HERO SCRUB — Core Pattern

The single most-used pattern across all projects. The hero is pinned and scroll progress
drives everything via `onUpdate`:

```js
ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  end: `+=${window.innerHeight * 3}px`,  // multiply by phases needed
  pin: true,
  pinSpacing: true,
  scrub: 1,                               // scrub: 1 = 1s lag = cinematic feel
  onUpdate: (self) => {
    const progress = self.progress;       // 0 to 1
    // Drive everything from this single value
  },
});
```

**Key insight from all 13 projects:** Use `gsap.set()` inside `onUpdate` (not `gsap.to()`) for
scrub-driven animations. `gsap.set()` is synchronous and avoids animation conflicts during scrubbing.

---

## 3. PHASE-BASED PROGRESS MAPPING — The Core Technique

All complex animations break `progress` (0–1) into phases with a custom ease:

```js
// Custom smoothstep ease (used in inversa, jesko, prototypestudio)
const ease = (x) => x * x * (3 - 2 * x);

// Phase mapping pattern
onUpdate: (self) => {
  const p = self.progress;

  // Phase 1: 0 → 0.4
  let phase1 = Math.min(p / 0.4, 1);

  // Phase 2: 0.4 → 0.7
  let phase2 = Math.max(0, Math.min((p - 0.4) / 0.3, 1));

  // Phase 3: 0.7 → 1.0
  let phase3 = Math.max(0, Math.min((p - 0.7) / 0.3, 1));

  gsap.set(el1, { y: -phase1 * 500 });
  gsap.set(el2, { opacity: phase2 });
  gsap.set(el3, { scale: 1 + phase3 * 0.5 });
}
```

**From inversa** — Multi-property phase mapping with eased entry AND exit:
```js
// Element appears and disappears within a scroll range
let opacity;
if (p <= 0.475) {
  opacity = 0;
} else if (p <= 0.5) {
  opacity = ease((p - 0.475) / 0.025);   // eased IN over 2.5% of scroll
} else if (p <= 0.75) {
  opacity = 1;
} else if (p <= 0.775) {
  opacity = 1 - ease((p - 0.75) / 0.025); // eased OUT over 2.5% of scroll
} else {
  opacity = 0;
}
gsap.set(el, { opacity });
```

**From prototypestudio** — Per-element progress within a global progress:
```js
projectNames.forEach((p, index) => {
  const startProgress = index / totalCount;
  const endProgress = (index + 1) / totalCount;
  const localProgress = Math.max(0, Math.min(
    1,
    (globalProgress - startProgress) / (endProgress - startProgress)
  ));
  gsap.set(p, { y: -localProgress * moveDistance });
});
```

---

## 4. SPLITTEXT — Typography Animation Patterns

Four patterns used across projects. Always wait for `document.fonts.ready`:

```js
document.fonts.ready.then(() => { initAnimations(); });
```

### Pattern A: Line Mask Reveal (orbit-matter, ova, house-of-epochs)
```js
// Most cinematic text reveal — lines slide up from behind a mask
const split = SplitText.create(element, {
  type: "lines",
  mask: "lines",           // KEY: creates mask per line automatically
  autoSplit: true,
  linesClass: "line",
  onSplit(self) {
    gsap.set(self.lines, { yPercent: 100 });
    const anim = gsap.to(self.lines, {
      yPercent: 0,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.1,
      paused: animateOnScroll,
    });
    if (animateOnScroll) {
      ScrollTrigger.create({
        trigger: element,
        start: "top 70%",
        animation: anim,
        toggleActions: "play none none none",
      });
    }
  },
});
```

### Pattern B: Word-by-Word Opacity (ironhill, waabi)
```js
// Words reveal sequentially based on scroll progress
const split = new SplitText(el, { type: "words" });
gsap.set(split.words, { opacity: 0 });

ScrollTrigger.create({
  trigger: el,
  start: "top 25%",
  end: "bottom 100%",
  onUpdate: (self) => {
    const progress = self.progress;
    split.words.forEach((word, i) => {
      const wordProgress = i / split.words.length;
      const opacity = progress >= wordProgress
        ? Math.min((progress - wordProgress) / (1 / split.words.length), 1)
        : 0;
      gsap.to(word, { opacity, duration: 0.1, overwrite: true });
    });
  },
});
```

### Pattern C: Character Flicker (orbit-matter)
```js
// Scramble/flicker reveal — Awwwards signature effect
SplitText.create(el, {
  type: "chars",
  autoSplit: true,
  onSplit(self) {
    gsap.set(self.chars, { opacity: 0 });
    gsap.to(self.chars, {
      opacity: 1,
      duration: 0.05,
      ease: "power2.inOut",
      stagger: {
        amount: 0.5,
        each: 0.1,
        from: "random",   // KEY: random order = flicker effect
      },
    });
  },
});
```

### Pattern D: yPercent slide-in with SplitText (ova slider)
```js
// For dynamic content that changes (slider titles)
if (currentSplit) currentSplit.revert(); // cleanup old split
el.innerHTML = `<h1>${newText}</h1>`;
currentSplit = new SplitText(el.querySelector("h1"), {
  type: "lines",
  linesClass: "line",
  mask: "lines",
});
gsap.set(currentSplit.lines, { yPercent: 100, opacity: 0 });
gsap.to(currentSplit.lines, {
  yPercent: 0,
  opacity: 1,
  duration: 0.75,
  stagger: 0.1,
  ease: "power3.out",
});
```

---

## 5. PRELOADER PATTERNS

### Grid Block Preloader (orbit-matter, house-of-epochs)
```js
// Create full-screen grid of blocks
const GRID_BLOCK_SIZE = 60;
const gridWidth = container.offsetWidth || window.innerWidth;
const gridHeight = container.offsetHeight || window.innerHeight;
const cols = Math.ceil(gridWidth / GRID_BLOCK_SIZE);
const rows = Math.ceil(gridHeight / GRID_BLOCK_SIZE) + 1;
// Center the grid
const offsetX = (gridWidth - cols * GRID_BLOCK_SIZE) / 2;
const offsetY = (gridHeight - rows * GRID_BLOCK_SIZE) / 2;

// Populate blocks
const cells = [];
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");
    cell.style.cssText = `
      position: absolute;
      width: ${GRID_BLOCK_SIZE}px;
      height: ${GRID_BLOCK_SIZE}px;
      left: ${c * GRID_BLOCK_SIZE + offsetX}px;
      top: ${r * GRID_BLOCK_SIZE + offsetY}px;
    `;
    container.appendChild(cell);
    cells.push(cell);
  }
}

// Animate OUT with random stagger (signature effect)
gsap.to(cells, {
  opacity: 0,
  duration: 0.05,
  ease: "power2.inOut",
  stagger: {
    amount: 0.5,
    each: 0.01,
    from: "random",
  },
  onComplete: () => {
    container.remove();
    lenis.start();
  },
});
```

**sessionStorage pattern** for preloader (orbit-matter):
```js
// Only show preloader on first visit per session
const hasSeenPreloader = sessionStorage.getItem("preloaderSeen") === "true";
if (hasSeenPreloader) {
  preloaderOverlay.style.display = "none";
  return;
}
// ... run preloader ...
sessionStorage.setItem("preloaderSeen", "true");
```

### SVG Path Preloader (house-of-epochs React)
```js
// Animate SVG path stroke drawing
const L = path.getTotalLength();
gsap.set(path, { strokeDasharray: `${L} ${L}`, strokeDashoffset: L });
gsap.to(path, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" });

// Then collapse grid from center
gsap.fromTo(cells,
  { scale: 1.05 },
  {
    scale: 0,
    duration: 0.5,
    ease: "power2.inOut",
    stagger: {
      grid: [rows, cols],
      from: "center",       // collapse FROM center outward
      each: 0.05,
    },
  }
);
```

---

## 6. PAGE TRANSITIONS

**Full-page grid transition system** (orbit-matter):
```js
// Cover screen before navigation
function animateTransition() {
  return new Promise((resolve) => {
    gsap.to(blocks, {
      opacity: 1,
      duration: 0.05,
      stagger: { amount: 0.5, each: 0.01, from: "random" },
      onComplete: () => setTimeout(resolve, 300),
    });
  });
}

// Intercept all internal links
document.addEventListener("click", async (event) => {
  const link = event.target.closest("a");
  if (!link || isExternalLink(link.href) || isSamePage(link.href)) return;

  event.preventDefault();
  sessionStorage.setItem("pageTransition", "true");
  await animateTransition();
  window.location.href = link.href;
}, { capture: true, passive: false });

// On new page: reveal by animating blocks away
if (sessionStorage.getItem("pageTransition") === "true") {
  sessionStorage.removeItem("pageTransition");
  gsap.set(blocks, { opacity: 1 });
  gsap.to(blocks, {
    opacity: 0,
    duration: 0.05,
    stagger: { amount: 0.5, each: 0.01, from: "random" },
    onComplete: () => ScrollTrigger.refresh(),
  });
}
```

---

## 7. CURSOR & PARALLAX EFFECTS

### Cursor-Driven Depth Layers (moblink)
```js
const SENSITIVITY = 0.3;
const LERP = 0.04;
const STAGGER_DELAY = 8;       // frames of delay between layers

const layers = depthLayers.map((node, i) => ({
  el: node,
  delay: (totalDepthLayers - 1 - i) * STAGGER_DELAY,
  current: { x: 0, y: 0 },
}));

// Ring buffer for cursor trail
const BUFFER_SIZE = totalDepthLayers * STAGGER_DELAY + 1;
const cursorTrail = [];

gsap.ticker.add(() => {
  cursorTrail.push({
    x: mouse.x * rect.width * SENSITIVITY,
    y: mouse.y * rect.height * SENSITIVITY,
  });
  if (cursorTrail.length > BUFFER_SIZE) cursorTrail.shift();

  layers.forEach((layer) => {
    const trailIndex = Math.max(0, cursorTrail.length - 1 - layer.delay);
    const target = cursorTrail[trailIndex];
    layer.current.x += (target.x - layer.current.x) * LERP;
    layer.current.y += (target.y - layer.current.y) * LERP;
    gsap.set(layer.el, { x: layer.current.x, y: layer.current.y });
  });
});
```

### Normalize mouse to -1, +1
```js
hero.addEventListener("mousemove", (e) => {
  const rect = hero.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
});
```

---

## 8. WEBGL / THREE.JS INTEGRATION

### Cursor-Driven Spotlight on 3D Model (cursor-driven)
```js
// Key: use lerp on 3D hit point for smooth follow
const uHit = new THREE.Vector3(0, 100, 0);   // off-screen initially
const target = new THREE.Vector3(0, 100, 0);
const config = { lerp: 0.05 };

// In RAF:
uHit.lerp(target, config.lerp);

// Inject uniforms into existing material shader:
node.material.onBeforeCompile = (shader) => {
  shader.uniforms.uHitPoint = { value: uHit };
  shader.uniforms.uActive = { value: 0 };
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", `#include <common>\n${vertexPars}`);
  shaders.push(shader); // store ref for RAF updates
};
```

### Scroll-Driven WebGL Shader (ironhill)
```js
// Scroll progress drives shader uniform
let scrollProgress = 0;

lenis.on("scroll", ({ scroll }) => {
  const maxScroll = hero.offsetHeight - window.innerHeight;
  scrollProgress = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1);
});

// In RAF:
material.uniforms.uProgress.value = scrollProgress;
```

---

## 9. FLIP PLUGIN — Layout Transition

**Awwwards signature effect: morphing layout on scroll** (house-of-epochs Showreel):

```js
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

// 1. Capture current state
const state = Flip.getState(elements);

// 2. Apply end-state class (change CSS layout)
elements.forEach(el => el.classList.add("end-state"));

// 3. Create paused Flip animation
const flip = Flip.from(state, {
  duration: 1,
  ease: "none",
  absolute: true,
  paused: true,
});

// 4. Drive with ScrollTrigger
ScrollTrigger.create({
  trigger: section,
  start: "top top",
  end: () => `+=${window.innerHeight * 2}`,
  pin: true,
  onUpdate: (self) => flip.progress(self.progress),
});
```

---

## 10. GSAP.UTILS IN AWWWARDS CONTEXT

### mapRange for scrub-to-value mapping (split-card)
```js
// Map scroll progress range to a value range
const headerProgress = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);
const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
const opacity = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);
gsap.set(el, { y: yValue, opacity });
```

### interpolate for dimension morphing (waabi)
```js
// Image shrinks from fullscreen to thumbnail on scroll
const width = gsap.utils.interpolate(window.innerWidth, 150, heroImgProgress);
const height = gsap.utils.interpolate(window.innerHeight, 150, heroImgProgress);
const borderRadius = gsap.utils.interpolate(0, 10, heroImgProgress);
gsap.set(".hero-img", { width, height, borderRadius });
```

### toArray for DOM queries (moblink)
```js
const depthLayers = gsap.utils.toArray(".depth-layer");
```

---

## 11. RESIZE HANDLING

Every project handles resize carefully:

```js
// Debounced resize with full reinit
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Kill all triggers, reinit
    ScrollTrigger.getAll().forEach(t => t.kill());
    initAnimations();
    ScrollTrigger.refresh();
  }, 250);
});
```

**gsap.matchMedia for responsive** (split-card):
```js
const mm = gsap.matchMedia();
mm.add("(max-width: 999px)", () => {
  // Reset all inline styles for mobile
  document.querySelectorAll(".card").forEach(el => el.style = "");
  return {}; // cleanup fn
});
mm.add("(min-width: 1000px)", () => {
  // Desktop animations
  ScrollTrigger.create({ ... });
  return () => {}; // cleanup fn
});
```

---

## 12. SCROLLTRIGGER BEST PRACTICES (from all 13 projects)

```js
// ALWAYS call ScrollTrigger.refresh() after:
// - Content changes
// - Layout shifts
// - Page transitions
ScrollTrigger.refresh();

// After font loading:
document.fonts.ready.then(() => {
  initAnimations();
  ScrollTrigger.refresh();
});

// For dynamic elements: use functional end value
end: () => `+=${window.innerHeight * 3}`,  // recalculates on resize

// Kill triggers on cleanup (React):
return () => {
  trigger?.kill();
  tween?.kill();
  gsap.killTweensOf(elements);
};
```

---

## 13. PARALLAX COLUMNS PATTERN (waabi)

```js
// Multiple columns with different speeds = depth illusion
const cols = [
  { id: "#col-1", y: -500 },
  { id: "#col-2", y: -250 },
  { id: "#col-3", y: -250 },
  { id: "#col-4", y: -500 },
];

cols.forEach(({ id, y }) => {
  gsap.to(id, {
    y,
    scrollTrigger: {
      trigger: ".section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,   // scrub: true = no lag = snappy parallax
    },
  });
});
```

---

## 14. SCROLL-DRIVEN SLIDER WITH PINNING (ova)

```js
// Slide changes based on scroll progress threshold
let activeSlide = 0;

ScrollTrigger.create({
  trigger: ".slider",
  start: "top top",
  end: `+=${window.innerHeight * slides.length}px`,
  scrub: 1,
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => {
    gsap.set(progressBar, { scaleY: self.progress });

    const currentSlide = Math.floor(self.progress * slides.length);
    if (activeSlide !== currentSlide && currentSlide < slides.length) {
      activeSlide = currentSlide;
      animateNewSlide(activeSlide);   // trigger discrete animation
    }
  },
});

// New slide: image scale + opacity + SplitText title
function animateNewSlide(index) {
  const img = document.createElement("img");
  img.src = slides[index].image;
  gsap.set(img, { opacity: 0, scale: 1.1 });
  container.appendChild(img);
  gsap.to(img, { opacity: 1, scale: 1, duration: 0.5 });
  // SplitText for title
  currentSplit?.revert();
  currentSplit = new SplitText(titleEl, { type: "lines", mask: "lines" });
  gsap.fromTo(currentSplit.lines,
    { yPercent: 100 },
    { yPercent: 0, duration: 0.75, stagger: 0.1, ease: "power3.out" }
  );
}
```

---

## 15. CSS ARCHITECTURE — Awwwards Style

Critical CSS patterns observed across all projects:

```css
/* Root setup */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scrollbar-width: none; } /* hide scrollbar - Lenis handles it */
html::-webkit-scrollbar { display: none; }
body { overflow-x: hidden; }

/* Pinned sections must have explicit height */
.hero { height: 100vh; position: relative; }

/* Performance: use will-change only on actively animating elements */
.animating { will-change: transform, opacity; }

/* For clip-path animations */
.clip-reveal { clip-path: inset(0 100% 0 0); }
.clip-reveal.revealed { clip-path: inset(0 0% 0 0); }

/* Layered parallax container */
.parallax-container {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
```

---

## 16. REACT / NEXT.JS PATTERNS (house-of-epochs)

```jsx
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);

export default function Component() {
  const ref = useRef(null);

  useGSAP(
    () => {
      // All GSAP code here — auto-cleanup on unmount
      const trigger = ScrollTrigger.create({ ... });
      // Return cleanup if needed
      return () => trigger.kill();
    },
    { scope: ref }  // scope = scoped selectors
  );

  return <div ref={ref}>...</div>;
}
```

---

## 17. MARQUEE / TICKER PATTERN (house-of-epochs)

```js
// Infinite marquee — clone content and loop
const items = track.querySelectorAll("p");
const singleSetCount = items.length / 2;  // content is doubled in HTML
const gap = parseFloat(getComputedStyle(track).gap || 0);

let singleSetWidth = 0;
for (let i = 0; i < singleSetCount; i++) {
  singleSetWidth += items[i].offsetWidth + gap;
}

gsap.to(track, {
  x: -singleSetWidth,     // move by exactly one set width
  duration: 12,
  ease: "none",
  repeat: -1,             // infinite
});
```

---

## 18. PRODUCTION CHECKLIST

Before shipping an Awwwards-level site, verify:

- [ ] `gsap.ticker.lagSmoothing(0)` — no lag on tab switch
- [ ] `document.fonts.ready.then(...)` — text animations after fonts load
- [ ] `ScrollTrigger.refresh()` after any layout change
- [ ] Debounced resize handler with full reinit
- [ ] `gsap.matchMedia()` for mobile/desktop variants
- [ ] `sessionStorage` for preloader (skip on revisit)
- [ ] `capture: true, passive: false` on link click interceptors
- [ ] `will-change: transform` only on actively animating elements
- [ ] `force3D: true` on elements with frequent position updates
- [ ] Kill all tweens on cleanup: `gsap.killTweensOf(el)`
- [ ] `overwrite: true` on rapidly-triggered tweens
- [ ] `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` for WebGL

---

## 19. AWWWARDS DESIGN PRINCIPLES (observed across all 13 projects)

1. **One pinned section = one story beat** — don't rush multiple ideas into one pin
2. **Scroll distance = narrative time** — longer scroll = more emphasis on content
3. **gsap.set() in onUpdate, gsap.to() for discrete events** — never mix
4. **Every element has ONE job** — text reveals, images translate, backgrounds change color
5. **Ease = emotion**: `power3.out` for entries (confidence), `power2.in` for exits (gravity),
   `power3.inOut` for UI transitions (smooth)
6. **Typography is the hero** — SplitText reveals should feel like breathing
7. **Progress bar as UX** — always show scroll progress somewhere (vertical bar, percentage counter)
8. **Dark background + high contrast text** = default Awwwards aesthetic
9. **Custom cursor** = immediate premium signal
10. **Preloader exists only to buy time for assets** — keep under 3 seconds

---

## COMBINING WITH INSTALLED SKILLS

This skill works in tandem with all installed `gsap-*` skills:

| Installed Skill | Complements This Skill For |
|---|---|
| `gsap-scrolltrigger` | Official API reference for trigger config |
| `gsap-timeline` | Sequencing discrete animations (preloader, transitions) |
| `gsap-plugins` | SplitText, Flip, DrawSVG API reference |
| `gsap-core` | Tween API (to/from/set/fromTo) reference |
| `gsap-utils` | mapRange, interpolate, clamp details |
| `gsap-performance` | will-change, force3D, batching rules |
| `gsap-react` | useGSAP hook pattern reference |

When building for this workspace, ALWAYS read this skill FIRST, then reference the installed
`gsap-*` skills for specific API syntax.
