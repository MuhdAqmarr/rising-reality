# Debugging Guide

## Build Check

Run this before sharing the project:

```bash
npm run build
```

If the build passes, Vite was able to resolve the scripts, styles, and runtime
asset paths.

## Broken Images

All runtime media should live in `public/assets/`.

Use paths like:

```html
<img src="/assets/example.png" alt="Example">
```

For CSS backgrounds:

```css
background-image: url('/assets/example.png');
```

If an image does not load, check:

- The file exists in `public/assets/`.
- The filename case matches exactly, especially `.PNG` vs `.png`.
- The path starts with `/assets/`.

## ScrollTrigger Feels Wrong

Common causes:

- A new scene was added but the master timeline duration was not adjusted.
- An element starts with the wrong `opacity`, `autoAlpha`, or transform.
- Fonts or images load late and change layout after ScrollTrigger measured the
  page.

Useful tools:

```js
ScrollTrigger.refresh()
```

Add it after major dynamic layout changes.

## Button Hover Does Not Show

The final CTA button is styled in `src/styles/main.css` under:

```css
.cta-button
.cta-button::before
.cta-button:hover::before
```

The border draw effect is created by changing four background-size values on the
`::before` pseudo-element.

## Interaction Does Not Click

Most scene layers start with `pointer-events: none` so they do not block scroll.
Interactive elements need their own `pointer-events: auto`.

For example, the CTA button sets:

```css
pointer-events: auto;
```

## Performance Notes

Prefer animating these properties:

- `transform`
- `opacity`
- `clip-path` when necessary

Avoid animating layout-heavy properties such as `top`, `left`, `width`, or
`height` during scroll unless the section is simple.

