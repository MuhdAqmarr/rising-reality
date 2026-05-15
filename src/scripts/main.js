/**
 * Main animation controller for A Rising Reality.
 *
 * Learning note:
 * This project uses a fixed "camera" and one very tall `.scroll-container`.
 * The user scrolls through the tall container, while GSAP updates the fixed
 * scenes inside the camera. That pattern is common in scrollytelling sites
 * because it separates narrative time (scroll distance) from screen layout.
 */
import '../styles/main.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

// 1. Lenis Setup (smooth wheel, but slowed down for scrollytelling control)
const lenis = new Lenis({
  lerp: 0.06, // Lower = smoother, higher = tighter to wheel input
  smoothWheel: true,
  wheelMultiplier: 0.55, // Smaller wheel steps stop the story from rushing forward
})
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0) // Prevents lag jump on tab switch
initFixedUi()

// Wait for fonts to load before splitting text
document.fonts.ready.then(() => {
  initAnimations()
})

function initFixedUi() {
  const root = document.documentElement
  const scrollbar = document.querySelector('.story-scrollbar')
  const scrollbarTrack = document.querySelector('.story-scrollbar-track')
  const audio = document.querySelector('.bg-audio')
  const audioToggle = document.querySelector('.audio-toggle')

  const getScrollLimit = () => (
    typeof lenis.limit === 'number'
      ? lenis.limit
      : document.documentElement.scrollHeight - window.innerHeight
  )

  const updateScrollProgress = () => {
    const limit = getScrollLimit()
    const current = typeof lenis.scroll === 'number' ? lenis.scroll : window.scrollY
    const progress = limit > 0 ? Math.min(Math.max(current / limit, 0), 1) : 0
    root.style.setProperty('--scroll-progress', progress.toFixed(4))
    root.style.setProperty('--scroll-progress-percent', `${(progress * 100).toFixed(2)}%`)
  }

  lenis.on('scroll', updateScrollProgress)
  window.addEventListener('resize', updateScrollProgress)
  updateScrollProgress()

  if (scrollbar && scrollbarTrack) {
    let isDraggingScrollbar = false

    const scrollToPointer = (clientY, immediate = true) => {
      const rect = scrollbarTrack.getBoundingClientRect()
      const progress = rect.height > 0
        ? Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1)
        : 0
      lenis.scrollTo(getScrollLimit() * progress, {
        immediate,
        force: true,
      })
      root.style.setProperty('--scroll-progress', progress.toFixed(4))
      root.style.setProperty('--scroll-progress-percent', `${(progress * 100).toFixed(2)}%`)
    }

    scrollbar.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      isDraggingScrollbar = true
      scrollbar.classList.add('is-dragging')
      scrollbar.setPointerCapture?.(event.pointerId)
      scrollToPointer(event.clientY, true)
    })

    scrollbar.addEventListener('pointermove', (event) => {
      if (!isDraggingScrollbar) return
      event.preventDefault()
      scrollToPointer(event.clientY, true)
    })

    const stopDraggingScrollbar = (event) => {
      if (!isDraggingScrollbar) return
      isDraggingScrollbar = false
      scrollbar.classList.remove('is-dragging')
      scrollbar.releasePointerCapture?.(event.pointerId)
    }

    scrollbar.addEventListener('pointerup', stopDraggingScrollbar)
    scrollbar.addEventListener('pointercancel', stopDraggingScrollbar)
  }

  if (!audio || !audioToggle) return

  audio.volume = 0.45

  const setAudioState = (isPlaying) => {
    audioToggle.classList.toggle('is-playing', isPlaying)
    audioToggle.setAttribute('aria-pressed', String(isPlaying))
    audioToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music')
  }

  const playAudio = async () => {
    try {
      await audio.play()
      setAudioState(true)
      return true
    } catch (error) {
      setAudioState(false)
      return false
    }
  }

  const unlockAudio = async () => {
    const didPlay = await playAudio()
    if (!didPlay) return
    window.removeEventListener('pointerdown', unlockAudio)
    window.removeEventListener('keydown', unlockAudio)
    window.removeEventListener('wheel', unlockAudio)
    window.removeEventListener('touchstart', unlockAudio)
  }

  playAudio()
  window.addEventListener('pointerdown', unlockAudio, { passive: true })
  window.addEventListener('keydown', unlockAudio)
  window.addEventListener('wheel', unlockAudio, { passive: true })
  window.addEventListener('touchstart', unlockAudio, { passive: true })

  audioToggle.addEventListener('click', async () => {
    if (audio.paused) {
      await playAudio()
      return
    }

    audio.pause()
    setAudioState(false)
  })

  audio.addEventListener('pause', () => setAudioState(false))
  audio.addEventListener('play', () => setAudioState(true))
}

function initAnimations() {
  // Initialize Text Splits
  const title1 = new SplitType('.hero-title.part-1', { types: 'chars' })
  const title2 = new SplitType('.hero-title.part-2', { types: 'chars' })
  const subtitle = new SplitType('.hero-subtitle', { types: 'lines' })
  const s2t2 = new SplitType('.s2-text.t2', { types: 'words' })
  const s2t3 = new SplitType('.s2-text.t3 p', { types: 'lines' })
  const s3at1 = new SplitType('.s3a-t1', { types: 'words' })
  const s3at2 = new SplitType('.s3a-t2', { types: 'lines' })
  const s3bt1 = new SplitType('.s3b-t1', { types: 'words, chars' })
  const s3bt2 = new SplitType('.s3b-t2', { types: 'words' })
  const s3ct1 = new SplitType('.s3c-t1', { types: 'words, chars' })
  const s3ct2 = new SplitType('.s3c-t2', { types: 'lines' })
  const s3ct3 = new SplitType('.s3c-t3', { types: 'lines' })
  const s3dt1 = new SplitType('.s3d-t1', { types: 'words' })
  const s3dt2 = new SplitType('.s3d-t2', { types: 'words' })

  // Ensure all scenes are visible for GSAP to manipulate, but manage pointer-events
  gsap.set('.scene', { visibility: 'visible' })
  
  // Set Initial States
  gsap.set('.iceberg-bg', { scale: 0.3, opacity: 0, filter: 'blur(0px)' }) // Pure fade animation, small initially
  gsap.set(title1.chars, { opacity: 0, filter: 'blur(10px)', y: 20 })
  gsap.set(title2.chars, { opacity: 0, filter: 'blur(10px)', y: 20 })
  gsap.set(subtitle.lines, { opacity: 0, y: 20 })
  gsap.set('.scroll-cue', { opacity: 0 })
  gsap.set('.s3-temps, .s3-melting, .s3-melting-bg, .s3-ocean-bg, .s3-diving, .s3e-warm-bg, .s3-heatwave, .s3-droughts, .s3-rain, .s3-storms, .s3-ecosystems, .s3-closing', { autoAlpha: 0 }) // Hide future Scene 3 layers
  gsap.set('.scene-4', { autoAlpha: 0 })
  gsap.set('.scene-5, .scene-6', { autoAlpha: 0 }) // Hide Scene 5 + 6
  gsap.set('.s5-bg, .s6-bg', { opacity: 0 })
  gsap.set('.s6-phase-2', { yPercent: 100, willChange: 'transform' })
  gsap.set('.s6-t1', { xPercent: -50, yPercent: -50 })
  gsap.set('.s6-us-highlight', { opacity: 0, scale: 0.72, y: 36 })
  gsap.set('.s5a-t3', { opacity: 0 })
  gsap.set('.s5-transition-burst', { autoAlpha: 0 })
  gsap.set('.s5-burst-wash', { opacity: 0, scale: 0.25, rotation: 0 })
  gsap.set('.s5-burst-ring, .s5-burst-core, .s5-burst-ray', { opacity: 0 })
  // s5a-enter-hint stays at opacity: 0 (via CSS); controlled by lockScroll()

  // 5B elements are NOT scroll-driven — they animate in via the Enter-key transition
  gsap.set('.s5b-bulb', { opacity: 0, y: 30 })
  gsap.set('.s5b-t1', { opacity: 0, y: 20 })
  gsap.set('.s5b-st1', { opacity: 0 })
  gsap.set('.s5b-icons', { opacity: 0, y: 20 })
  gsap.set('.s5b-hint', { opacity: 0 })

  // Window shutters start off-screen and hidden
  gsap.set('.window-shutter-top', { y: '-100%' })
  gsap.set('.window-shutter-bottom', { y: '100%' })
  gsap.set('.window-shutter', { visibility: 'hidden' })

  // Scene 5C vehicles — center each image on its left-anchor so the 3 are evenly spaced.
  // xPercent stays at -50 throughout; entry x animations and ambient y stack on top of it.
  gsap.set('.s5c-vehicle', { xPercent: -50 })

  // Scene 5D panel — pre-positioned for the 5C → 5D horizontal swipe.
  //   x: 100vw → off-screen right (will slide in)
  //   y: -100vh → pulled up by one panel so it shares 5C's row during the swipe.
  gsap.set('.s5d-panel', { x: '100vw', y: '-100vh' })

  // Scene 5E panel — pulled up by one panel too, so it stacks tightly under 5D's new row.
  // Without this, 5D → 5E would show a 100vh empty gap mid-transition.
  gsap.set('.s5e-panel', { y: '-100vh' })

  // Initialize master line stroke-dash based on actual path length
  const s4Path = document.querySelector('#s4-line-path')
  if (s4Path) {
    const pathLen = s4Path.getTotalLength()
    gsap.set(s4Path, { strokeDasharray: pathLen, strokeDashoffset: pathLen })
  }
  gsap.set('.s3b-thermometer', { yPercent: -50, autoAlpha: 0, scale: 0.4 }) // GSAP owns the transform
  
  // Hide future scenes
  gsap.set('.scene-2', { autoAlpha: 0 })
  gsap.set('.scene-3', { autoAlpha: 0, z: -1000 })
  

  // Ambient continuous animations (Breathe effect)
  gsap.to('.s3b-map', { scale: 1.05, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  gsap.fromTo('.heat-glow', { scale: 0.9, opacity: 0.5 }, { scale: 1.2, opacity: 1, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  gsap.fromTo('.s3e-sun-glow', { scale: 0.85, opacity: 0.7 }, { scale: 1.15, opacity: 1, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })

  // Sun slowly rotates — continuous
  gsap.to('.s3e-sun', { rotation: 360, duration: 40, repeat: -1, ease: 'none' })

  // Ambient drift on paint blobs — bg never settles into flat colour
  gsap.utils.toArray('.paint-blob').forEach((blob, i) => {
    gsap.to(blob, {
      x: `+=${(i % 2 === 0 ? 1 : -1) * 30}`,
      y: `+=${(i % 3 === 0 ? -1 : 1) * 25}`,
      rotation: (i % 2 === 0 ? 8 : -8),
      duration: 8 + i,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // Heat shimmer slow rotate + scale breathe
  gsap.to('.heat-shimmer', { rotation: 360, duration: 45, repeat: -1, ease: 'none' })
  gsap.to('.heat-shimmer', { scale: 1.08, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' })

  // Animate the SVG turbulence seed to create moving heat-wave distortion
  const heatTurbulence = document.querySelector('#heat-wave feTurbulence')
  if (heatTurbulence) {
    const seedState = { seed: 1 }
    gsap.to(seedState, {
      seed: 100,
      duration: 8,
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        heatTurbulence.setAttribute('seed', seedState.seed)
      }
    })
  }

  // Heat-wave distort layer drifts upward slowly (heat rising)
  gsap.to('.heat-wave-distort', { backgroundPositionY: '-=200px', duration: 10, repeat: -1, ease: 'none' })

  // Generate rain drops dynamically for Scene 3G
  const rainContainer = document.querySelector('.s3g-rain')
  if (rainContainer) {
    for (let i = 0; i < 80; i++) {
      const drop = document.createElement('div')
      drop.className = 'rain-drop'
      drop.style.left = `${Math.random() * 100}%`
      drop.style.height = `${18 + Math.random() * 28}px`
      rainContainer.appendChild(drop)
    }
    // Each drop falls independently with random duration/delay
    gsap.utils.toArray('.rain-drop').forEach(drop => {
      const duration = 0.6 + Math.random() * 0.7
      gsap.fromTo(drop,
        { y: '-20vh', opacity: 0 },
        {
          y: '120vh',
          opacity: 0.9,
          duration: duration,
          delay: Math.random() * 2,
          ease: 'none',
          repeat: -1,
        })
    })
  }

  // Lightning bolts flicker on random intervals (Scene 3H)
  gsap.utils.toArray('.s3h-bolt').forEach((bolt, i) => {
    gsap.to(bolt, {
      opacity: 1,
      duration: 0.08,
      repeat: -1,
      repeatDelay: 1.5 + Math.random() * 3,
      yoyo: true,
      delay: 0.5 + i * 0.7,
      ease: 'power4.in'
    })
  })

  // Wind streaks fly across screen continuously — subtle motion
  gsap.utils.toArray('.wind-streak').forEach((streak, i) => {
    const tl = gsap.timeline({
      repeat: -1,
      delay: i * 0.4 + Math.random() * 0.6,
    })
    tl.fromTo(streak,
      { x: 0, opacity: 0 },
      { opacity: 0.5, duration: 0.3, ease: 'power2.out' }
    )
    .to(streak, { x: '170vw', duration: 1.6 + Math.random() * 0.8, ease: 'power2.in' }, '<')
    .to(streak, { opacity: 0, duration: 0.35, ease: 'power2.in' }, '-=0.4')
  })

  // Hurricane GIF has built-in spinning animation — no GSAP rotation needed

  // Water wave drift — slide horizontally so surface looks like its moving (Scene 3G)
  gsap.to('.s3g-water-wave', {
    x: '25%',
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // Scene 5 background — continuously shifting gradient (emerald → cyan → blue → forest)
  gsap.to('.s5-bg', {
    backgroundPosition: '100% 100%',
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // Scene 5C vehicles (PNG images) — feel alive "in place" without sliding off-spot.
  // Scrub uses x/scale for entry, ambient uses y/rotation here — no transform conflicts.

  // Walker: bob (2x per stride) + body lean = natural gait
  gsap.to('.s5c-walker', { y: -8,       duration: 0.32, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  gsap.to('.s5c-walker', { rotation: 5, duration: 0.64, repeat: -1, yoyo: true, ease: 'sine.inOut' })

  // Bus: suspension bounce (road bumps) + tiny sway as if rolling
  gsap.to('.s5c-train', { y: -3,         duration: 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  gsap.to('.s5c-train', { rotation: 1.2, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut',
                          transformOrigin: 'center bottom' })

  // Bicycle: handlebar wobble + light bounce as if pedalling
  gsap.to('.s5c-bicycle', { rotation: -2.5, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut',
                            transformOrigin: 'center bottom' })
  gsap.to('.s5c-bicycle', { y: -2,          duration: 0.45, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  
  // Window overlay starts hidden below the viewport AND transparent
  gsap.set('.window-wall-overlay', { autoAlpha: 0, yPercent: 100, scale: 1 })

  // --- INTRO AUTOPLAY (SCENE 1) ---
  const introTl = gsap.timeline()
  introTl
    .to('.iceberg-bg', { opacity: 1, duration: 2.5, ease: 'power2.inOut' }, 0) // Fade animation on background image
    .to([...title1.chars, ...title2.chars], { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.04, ease: 'power3.out' }, 0.5) // Blur animation for title
    .to(subtitle.lines, { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }, 1.5) // Sentence Cascade
    .to('.scroll-cue', { opacity: 1, duration: 1, ease: 'power2.inOut' }, 2.5) // Fade-in scroll cue

  // --- MASTER SCRUB TIMELINE (THE CAMERA MOVEMENT) ---
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true, // Exact scroll-linked scrub; no delayed catch-up smoothing
    }
  })

  // Phase 1 & 2: Scene 1 into Scene 2
  masterTl
    .addLabel('start')
    
    // 1. Jesko Title Split: A RISING goes left, REALITY goes right
    .to('.hero-title.part-1', { xPercent: -150, opacity: 0, duration: 3, ease: 'power2.inOut' }, 'start')
    .to('.hero-title.part-2', { xPercent: 150, opacity: 0, duration: 3, ease: 'power2.inOut' }, 'start')
    .to('.subtitle-wrapper, .scroll-cue', { opacity: 0, y: 50, duration: 1 }, 'start')
    
    // Scroll, Zoom in into the iceberg image.
    .to('.iceberg-bg', { scale: 1.8, duration: 4, ease: 'power1.inOut' }, 'start')
    
    .addLabel('scene2_text1', 'start+=3')
    .set('.scene-2', { autoAlpha: 1 }, 'scene2_text1')
    
    // Scroll, Text 1 appear with Zoom Out Effect.
    .fromTo('.s2-text.t1', { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' }, 'scene2_text1')
    
    .addLabel('zoom_out', 'scene2_text1+=3')
    
    // Fade out Text 1 before zoom out
    .to('.s2-text.t1', { opacity: 0, duration: 1 }, 'zoom_out')
    
    // Scroll, the iceberg image zoom-out
    .to('.iceberg-bg', { scale: 1, duration: 3, ease: 'power2.inOut' }, 'zoom_out')
    
    // Scroll, window image appear from bottom with fade
    .fromTo('.window-wall-overlay', 
      { yPercent: 100, autoAlpha: 0 }, 
      { yPercent: 0, autoAlpha: 1, duration: 3, ease: 'power3.out' }, 
      'zoom_out+=2')
    
    .addLabel('scene2_text23', 'zoom_out+=5')
    
    // Scroll, Text 2 appear with Word by Word Built Animation
    .fromTo(s2t2.words, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1 }, 'scene2_text23')
    
    // Scroll, Text 3 appear with Line-by-Line Reveal Animation
    .fromTo(s2t3.lines, { opacity: 0, x: 20 }, { opacity: 1, x: 0, stagger: 0.5, duration: 1.5 }, 'scene2_text23+=2')
    
    // Scroll, all the text and images scrolls up
    // We scroll up the text layer, the window wall, AND the iceberg background so they all move together
    .to(['.window-wall-overlay', '.iceberg-bg', '.s2-text.t2', '.s2-text.t3'], { yPercent: -100, opacity: 0, duration: 2, ease: 'power2.inOut' }, 'scene2_text23+=5')
    
    // and text 4 appear with Ascend Animation
    .fromTo('.s2-text.t4', { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 2 }, 'scene2_text23+=6')
    .to('.s2-text.t4', { yPercent: -100, opacity: 0, duration: 2 }, 'scene2_text23+=9') // Exit scene 2

  // Phase 3: Enter Scene 3 (Bringing It Closer)
  masterTl
    .addLabel('scene3', 'scene2_text23+=11')
    .set('.scene-2', { autoAlpha: 0 }, 'scene3')
    .set('.scene-3', { autoAlpha: 1, z: 0 }, 'scene3') // Remove z: -1000 trap
    
    // Scroll, a spinning globe video appear from far with fade effect
    .fromTo('.globe-video', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 4, ease: 'power2.out' }, 'scene3')
    
    // ...and text 1 appear ascend animation
    .fromTo(s3at1.words, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 1.5, ease: 'power3.out' }, 'scene3+=1')
    
    // Scroll text 2 appear below clarify animation (blur -> sharp)
    .fromTo(s3at2.lines, { filter: 'blur(10px)', opacity: 0, y: 10 }, { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 'scene3+=3')
    
    // Phase 3B: Rising Temperatures
    .addLabel('scene3b', 'scene3+=8')
    
    // Scroll, the previous scene moves to the left slowly and fades out
    .to(['.globe-video', '.s3-opening'], { xPercent: -100, opacity: 0, duration: 5, ease: 'sine.inOut' }, 'scene3b')
    
    // and the world map appear
    .fromTo('.s3-temps', { autoAlpha: 0 }, { autoAlpha: 1, duration: 2, ease: 'power2.out' }, 'scene3b+=1')
    
    // Scroll, Text 1 appear with Rise animation.
    .fromTo(s3bt1.words, { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 2, ease: 'power3.out' }, 'scene3b+=2')
    
    // Scroll, Text 2 appear word by word Rise animation
    .fromTo(s3bt2.words, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1.5, ease: 'power3.out' }, 'scene3b+=3.5')
    
    // and picture of a burning thermometer appear with zoom+fade animation.
    .to('.s3b-thermometer', { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'back.out(1.5)' }, 'scene3b+=3.5')
    
    // Phase 3C: Ice Melting
    .addLabel('scene3c', 'scene3b+=7')
    
    // Fade out 3B entirely to kill the heat vibe and map
    .to('.s3-temps', { autoAlpha: 0, duration: 2 }, 'scene3c')
    
    // Scroll, thermometer image move to the left side of the screen.
    // Starts at right: 15vw. Move it by -65vw to place it around left: 10vw.
    .to('.s3b-thermometer', { x: '-65vw', duration: 3, ease: 'power2.inOut' }, 'scene3c')
    
    // Show 3C layer and background container
    .to(['.s3-melting', '.s3-melting-bg'], { autoAlpha: 1, duration: 0.1 }, 'scene3c+=1')
    
    // The image of the iceberg melting and ocean appear with fade animation.
    .fromTo('.iceberg-image', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 3, ease: 'power2.out' }, 'scene3c+=1')
    
    // Text 1 appear with Ascend animation.
    .fromTo(s3ct1.words, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 2, ease: 'power3.out' }, 'scene3c+=2')
    
    // Scroll, Text 2 appear over the iceberg
    .fromTo(s3ct2.lines, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 2, ease: 'power2.out' }, 'scene3c+=4')
    
    // Scroll, the screen focus to the sea and text 3 appear.
    // Subtle upward shift to focus on the "sea" text at the bottom
    .fromTo(s3ct3.lines, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 2, ease: 'power2.out' }, 'scene3c+=6.5')

    // Phase 3D: Diving Transition
    .addLabel('scene3d', 'scene3c+=10')
    
    // Remove thermometer for Scene 3D
    .to('.s3b-thermometer', { autoAlpha: 0, duration: 1 }, 'scene3d')
    
    // Scroll, the previous scene scroll ups
    .to('.s3-melting', { yPercent: -100, duration: 4, ease: 'power2.inOut' }, 'scene3d')
    .to('.s3-melting-bg', { yPercent: -30, duration: 4, ease: 'power2.inOut' }, 'scene3d') // Slower for parallax overlap
    
    // The colour background remain with the same colour as the sea (Diving POV)
    .to('.s3-ocean-bg', { autoAlpha: 1, duration: 0.1 }, 'scene3d')
    .fromTo('.s3-ocean-bg', { yPercent: 100 }, { yPercent: 0, duration: 4, ease: 'power2.inOut' }, 'scene3d')
    
    // Zoom into the ocean to create diving depth
    .to('.ocean-image', { scale: 1.5, duration: 8, ease: 'none' }, 'scene3d')
    
    // Show 3D text layer
    .to('.s3-diving', { autoAlpha: 1, duration: 0.1 }, 'scene3d+=2')
    
    // Text 1 appear
    .fromTo(s3dt1.words, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 2, ease: 'power3.out' }, 'scene3d+=3')
    
    // Wavy lines appear
    .fromTo('.s3d-waves', { opacity: 0, scaleX: 0 }, { opacity: 0.8, scaleX: 1, duration: 2, ease: 'power2.out' }, 'scene3d+=4')
    
    // Scroll, text 2 appear
    .fromTo(s3dt2.words, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 2, ease: 'power3.out' }, 'scene3d+=6')

    // Phase 3E: Heatwaves — Paint-effect transition from 3D
    .addLabel('scene3e', 'scene3d+=10')

    // Show the warm bg container (blobs handle the actual reveal)
    .to('.s3e-warm-bg', { autoAlpha: 1, duration: 0.1 }, 'scene3e')

    // Paint blobs grow in with stagger — each one is a brush stroke
    // mengikut urutan, satu demi satu memenuhi screen dengan warm colour
    .to('.paint-blob', {
      scale: 2.8,
      opacity: 1,
      duration: 4,
      stagger: 0.6,
      ease: 'power2.out'
    }, 'scene3e')

    // Heat shimmer overlay fades in to give the bg life
    .to('.heat-shimmer', { opacity: 0.9, duration: 5, ease: 'power2.inOut' }, 'scene3e+=3')

    // Heat-wave distortion layer fades in (visible heat shimmer)
    .to('.heat-wave-distort', { opacity: 0.7, duration: 5, ease: 'power2.inOut' }, 'scene3e+=3')

    // Fade out ocean + diving text as the paint covers everything
    .to(['.s3-ocean-bg', '.s3-diving'], { autoAlpha: 0, duration: 4, ease: 'power2.inOut' }, 'scene3e+=2')

    // Show heatwave layer (content) once paint has mostly covered the screen
    .to('.s3-heatwave', { autoAlpha: 1, duration: 0.1 }, 'scene3e+=6')

    // Text 1 (HEATWAVES) slowly fades in
    .fromTo('.s3e-t1',
      { opacity: 0 },
      { opacity: 1, duration: 4, ease: 'power2.inOut' },
      'scene3e+=6')

    // Sun image fade in
    .fromTo('.s3e-sun',
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 3, ease: 'back.out(1.2)' },
      'scene3e+=7')

    // Sun continues growing slowly (heatwave intensifying)
    .to('.s3e-sun', { scale: 1.3, duration: 8, ease: 'power1.inOut' }, 'scene3e+=9')

    // Text 2 (subtext) slowly fades in
    .fromTo('.s3e-t2',
      { opacity: 0 },
      { opacity: 1, duration: 4, ease: 'power2.inOut' },
      'scene3e+=10')

    // Phase 3F: Droughts & Wildfires
    .addLabel('scene3f', 'scene3e+=15')

    // 3E text group exits upward
    .to('.s3e-text-group', { yPercent: -120, opacity: 0, duration: 3, ease: 'power2.inOut' }, 'scene3f')

    // Sun shrinks and moves to top-left (fully visible, "jauh" feel)
    .to('.s3e-sun-wrap', {
      x: '-22vw',
      y: '-35vh',
      scale: 0.45,
      duration: 4,
      ease: 'power2.inOut'
    }, 'scene3f')

    // Calm down the heat shimmer/distortion (less intense now — drought, not active heatwave)
    .to(['.heat-shimmer', '.heat-wave-distort'], { opacity: 0.25, duration: 3, ease: 'power2.inOut' }, 'scene3f')

    // Show 3F content layer
    .to('.s3-droughts', { autoAlpha: 1, duration: 0.1 }, 'scene3f+=2')

    // Parched ground (kemarau.jpg) fades in
    .fromTo('.s3f-ground',
      { opacity: 0 },
      { opacity: 0.7, duration: 4, ease: 'power2.inOut' },
      'scene3f+=2')

    // Title "DROUGHTS & WILDFIRES" fades in (top-right)
    .fromTo('.s3f-t1', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 2.5, ease: 'power3.out' }, 'scene3f+=3')

    // Subtext 1 fades in below title
    .fromTo('.s3f-t2', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 2.5, ease: 'power3.out' }, 'scene3f+=4')

    // 3 leafless trees appear one by one (grow from ground)
    .fromTo('.s3f-tree',
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 1.8, stagger: 0.6, ease: 'power2.out' },
      'scene3f+=5.5')

    // Bottom subtext fades in
    .fromTo('.s3f-t3', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 2.5, ease: 'power2.out' }, 'scene3f+=9')

    // ============================================
    // Phase 3G: Heavy Rain & Floods
    // ============================================
    .addLabel('scene3g', 'scene3f+=13')

    // Previous scene (3F warm world) slides up & out — including ALL 3C/3D/3E/3F leftovers
    .to(['.s3-droughts', '.s3-heatwave', '.s3e-warm-bg', '.s3e-sun-wrap', '.heat-shimmer', '.heat-wave-distort', '.s3-melting', '.s3-melting-bg', '.s3-ocean-bg', '.s3-diving'], { autoAlpha: 0, duration: 4, ease: 'power2.inOut' }, 'scene3g')
    .to(['.s3-droughts'], { yPercent: -100, duration: 4, ease: 'power2.inOut' }, 'scene3g')

    // Show 3G layer + storm background
    .to('.s3-rain', { autoAlpha: 1, duration: 0.1 }, 'scene3g+=1')
    .to('.s3g-storm-bg', { opacity: 1, duration: 4, ease: 'power2.inOut' }, 'scene3g+=1')

    // Big center cloud descends dramatically from above
    .fromTo('.s3g-big-cloud-wrap',
      { y: '-50vh', opacity: 0 },
      { y: 0, opacity: 1, duration: 4, ease: 'power3.out' },
      'scene3g+=1.5')

    // Side cloud (right edge) follows a beat later
    .fromTo('.s3g-cloud-wrap',
      { y: '-40vh', opacity: 0 },
      { y: 0, opacity: 1, duration: 3, ease: 'power3.out' },
      'scene3g+=3')

    // Title appears
    .fromTo('.s3g-t1', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 'scene3g+=4')
    .fromTo('.s3g-t2', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 'scene3g+=5')

    // Rain container fades in (drops are already falling ambient)
    .fromTo('.s3g-rain', { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.in' }, 'scene3g+=4')

    // Water rises from bottom (half top of page)
    .to('.s3g-water', { height: '50vh', duration: 6, ease: 'power2.inOut' }, 'scene3g+=7')

    // Bottom subtext
    .fromTo('.s3g-t3', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 2, ease: 'power2.out' }, 'scene3g+=11')

    // ============================================
    // Phase 3H: Storms & Hurricanes
    // Order ikut wireframe:
    //   1. Rain + water disappear
    //   2. Text 1 (STORMS & HURRICANES) appear
    //   3. Strong wind animation + Subtext 1 appear (TOGETHER)
    //   4. Hurricane GIF + Subtext 2 appear (TOGETHER)
    // ============================================
    .addLabel('scene3h', 'scene3g+=15')

    // 1. Rain + water disappear
    .to('.s3-rain', { autoAlpha: 0, duration: 3, ease: 'power2.inOut' }, 'scene3h')

    // Dark storm bg fades in
    .to('.s3-storms', { autoAlpha: 1, duration: 0.1 }, 'scene3h+=1')
    .to('.s3h-storm-bg', { opacity: 1, duration: 4, ease: 'power2.inOut' }, 'scene3h+=1')

    // 2. Text 1 (STORMS & HURRICANES) appears
    .fromTo('.s3h-t1',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 2, ease: 'power3.out' },
      'scene3h+=4')

    // 3. Strong wind animation + Subtext 1 appear TOGETHER
    .to('.s3h-wind', { opacity: 1, duration: 1.5, ease: 'power2.in' }, 'scene3h+=6')
    // Lightning bolts also fade visible (ambient flicker continues)
    .to('.s3h-bolt', { opacity: 1, duration: 0.5, stagger: 0.2, ease: 'power2.in' }, 'scene3h+=6')
    .fromTo('.s3h-t2',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 2, ease: 'power3.out' },
      'scene3h+=6')

    // 4. Hurricane GIF + Subtext 2 appear TOGETHER
    .fromTo('.s3h-hurricane-wrap',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 3, ease: 'back.out(1.2)' },
      'scene3h+=9')
    .fromTo('.s3h-t3',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 2, ease: 'power2.out' },
      'scene3h+=9')

    // ============================================
    // Phase 3I: Disruption of Ecosystems
    // Order ikut wireframe:
    //   1. Previous scene (3H) disappear to top
    //   2. Trees + Text 1 appear at the same time
    //   3. Subtext 1 + Subtext 2 enter AND trees disappear one by one (parallel)
    // ============================================
    .addLabel('scene3i', 'scene3h+=14')

    // 1. 3H slides up & out
    .to('.s3-storms', { yPercent: -100, autoAlpha: 0, duration: 4, ease: 'power2.inOut' }, 'scene3i')

    // Show 3I layer + forest bg
    .to('.s3-ecosystems', { autoAlpha: 1, duration: 0.1 }, 'scene3i+=1')
    .to('.s3i-bg', { opacity: 1, duration: 4, ease: 'power2.inOut' }, 'scene3i+=1')

    // 2. Text 1 + Trees appear TOGETHER
    .fromTo('.s3i-t1',
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 2.5, ease: 'power3.out' },
      'scene3i+=4')
    .fromTo('.s3i-tree',
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 1.8, stagger: 0.3, ease: 'power2.out' },
      'scene3i+=4')

    // 3. Subtext 1 + Subtext 2 enter AND trees disappear one by one (parallel)
    .fromTo('.s3i-t2',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 2.5, ease: 'power3.out' },
      'scene3i+=8')
    .fromTo('.s3i-t3',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 2.5, ease: 'power2.out' },
      'scene3i+=8')
    .to('.s3i-tree',
      { scaleY: 0, opacity: 0, duration: 1.5, stagger: 0.8, ease: 'power2.in' },
      'scene3i+=9')

    // ============================================
    // Phase 3J: Closing
    // ============================================
    .addLabel('scene3j', 'scene3i+=18')

    // Previous (3I) fades out completely
    .to('.s3-ecosystems', { autoAlpha: 0, duration: 4, ease: 'power2.inOut' }, 'scene3j')

    // Show closing layer with deep dark bg
    .to('.s3-closing', { autoAlpha: 1, duration: 0.1 }, 'scene3j+=1')
    .to('.s3j-bg', { opacity: 1, duration: 5, ease: 'power2.inOut' }, 'scene3j+=1')

    // Final text slowly fades in
    .fromTo('.s3j-t1', { opacity: 0 }, { opacity: 1, duration: 5, ease: 'power2.inOut' }, 'scene3j+=4')

    // ============================================
    // SCENE 4: THE CAUSES
    // Continuous scroll across 6 panels (600vh).
    // The background is fixed. The stage (content + SVG line) scrolls up.
    // ============================================

    .addLabel('scene4start', 'scene3j+=12')
    // ---- 3J → 4A: HORIZON-SPLIT REVEAL ----
    // 3J text pushes forward into the void (scale + blur + fade)
    .to('.s3j-t1', { scale: 1.7, opacity: 0, filter: 'blur(24px)', duration: 4, ease: 'power2.in' }, 'scene4start')
    // 3J background dims so the cream burst feels brighter by contrast
    .to('.s3j-bg', { opacity: 0.35, duration: 3, ease: 'power2.in' }, 'scene4start+=1')

    // Bright horizontal flash beam erupts across the center — the dawn crack
    .set('.s3-4-flash', { autoAlpha: 1, scaleY: 0.02, scaleX: 0.4 }, 'scene4start+=2.4')
    .to('.s3-4-flash', { scaleX: 1.05, duration: 0.45, ease: 'power3.out' }, 'scene4start+=2.4')
    .to('.s3-4-flash', { scaleY: 1, duration: 1.2, ease: 'power2.inOut' }, 'scene4start+=2.85')

    // Scene-4 materializes through a horizontal slit that opens vertically
    .set('.scene-4', { autoAlpha: 1, clipPath: 'inset(49% 0% 49% 0%)' }, 'scene4start+=2.6')
    .set('.s4-bg', { opacity: 1 }, 'scene4start+=2.6')
    .fromTo('.scene-4',
      { clipPath: 'inset(49% 0% 49% 0%)', filter: 'brightness(1.5)' },
      { clipPath: 'inset(0% 0% 0% 0%)', filter: 'brightness(1)', duration: 4.2, ease: 'power3.inOut' },
      'scene4start+=2.6')

    // Flash dissolves once cream has taken over; old layers cleaned up
    .to('.s3-4-flash', { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 'scene4start+=5.4')
    .to('.s3-closing', { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 'scene4start+=6.4')

    // MASTER STAGE SCROLLING
    // We move the stage from y: 0 to y: -500vh (total 6 panels)
    // Tighter duration so each panel takes ~10 timeline units (was 20) — keeps
    // gaps between scene content closer together (matches the 4A→4B pacing).
    .to('.s4-scroll-stage', {
      y: '-400vh', // Stage 500vh (C/D/E overlap -30vh, F overlap -10vh)
      duration: 60,
      ease: 'none'
    }, 'scene4start+=2')

    // MASTER LINE DRAWING
    // Draw the entire serpentine path alongside the scroll
    .set('#s4-line-path', {
      strokeDasharray: 20000,
      strokeDashoffset: 20000
    }, 'scene4start')
    .to('#s4-line-path', {
      strokeDashoffset: 0,
      duration: 56, // Match shortened stage scroll
      ease: 'none'
    }, 'scene4start+=6')

    // Panel timing — uniform 2.5-unit gap between scenes (like 4A→4B):
    //   4A: +0–+5.5  / 4B: +8–+15.6 / 4C: +18–+31.5
    //   4D: +34–+41.5 / 4E: +44–+53.2 / 4F: +56–+62

    // ---------- 4A: Opening ----------
    .set('.s4a-t1', { opacity: 1, y: 0 }, 'scene4start')
    .fromTo('.s4a-t2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 'scene4start+=2')
    .fromTo('.s4a-human', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5, ease: 'back.out(1.7)' }, 'scene4start+=4')
    .to('.dot-a', { opacity: 1, scale: 1.5, duration: 0.5 }, 'scene4start+=2')

    // ---------- 4B: Emissions ----------
    .fromTo('.s4b-t1', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' }, 'scene4start+=8')
    .fromTo('.s4b-t2', { opacity: 0 }, { opacity: 1, duration: 1.5 }, 'scene4start+=10')
    .fromTo('.s4b-t3', { opacity: 0 }, { opacity: 1, duration: 1.5 }, 'scene4start+=12')
    .fromTo('.s4b-icon', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1.2, ease: 'power2.out' }, 'scene4start+=14')
    .fromTo('.s4b-smoke',
      { opacity: 0, y: 0, scale: 0.5 },
      { opacity: 0.7, y: -100, scale: 1.5, duration: 2, stagger: 0.25, repeat: 1, ease: 'power1.out' },
      'scene4start+=16')
    .to('.dot-b', { opacity: 1, scale: 1.5, duration: 0.5 }, 'scene4start+=17')

    // ---------- 4C: Deforestation ----------  (compressed: end +25, before panel top at +27.5)
    .fromTo('.s4c-t1', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }, 'scene4start+=18')
    .fromTo('.s4c-t2', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 'scene4start+=19')
    .fromTo('.s4c-tree', { opacity: 0, y: 40, scaleY: 0 }, { opacity: 1, y: 0, scaleY: 1, stagger: 0.07, duration: 1.2, ease: 'back.out(1.5)' }, 'scene4start+=20')
    .to('.s4c-tree', { opacity: 0, scaleY: 0, stagger: { amount: 1.2, from: 'start' }, duration: 0.6, ease: 'power2.in', transformOrigin: 'bottom center' }, 'scene4start+=22')
    .fromTo('.s4c-building', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: { amount: 1.2, from: 'start' }, duration: 0.6, ease: 'back.out(1.4)' }, 'scene4start+=22.2')
    .fromTo('.s4c-t3', { opacity: 0 }, { opacity: 1, duration: 1 }, 'scene4start+=24')
    .to('.dot-c', { opacity: 1, scale: 1.5, duration: 0.5 }, 'scene4start+=26')

    // ---------- 4D: Urban & Industrial ----------  (compressed: end +33.5, before +38)
    .fromTo('.s4d-t1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 'scene4start+=28')
    .fromTo('.s4d-t2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 'scene4start+=28')
    .fromTo('.s4d-skyline', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 'scene4start+=30')
    .fromTo('.s4d-t3', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 'scene4start+=32')
    .to('.dot-d', { opacity: 1, scale: 1.5, duration: 0.5 }, 'scene4start+=34')

    // ---------- 4E: Everyday Lifestyle ----------  (compressed: end +42.5, before +48.5)
    .fromTo('.s4e-t1', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }, 'scene4start+=36.5')
    .fromTo('.s4e-t2', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 'scene4start+=37.5')
    .fromTo('.s4e-icon', { opacity: 0, scale: 0, rotate: -20 }, { opacity: 1, scale: 1, rotate: 0, stagger: 0.15, duration: 1, ease: 'back.out(1.7)' }, 'scene4start+=38.5')
    .fromTo('.s4e-list p', { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.18, duration: 1 }, 'scene4start+=40.5')
    .to('.dot-e', { opacity: 1, scale: 1.5, duration: 0.5 }, 'scene4start+=43')

    // ---------- 4F: Closing ----------  (more breathing — 4F gets extra time)
    .fromTo('.s4f-t1', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }, 'scene4start+=50')
    .fromTo('.s4f-t2', { opacity: 0 }, { opacity: 1, duration: 2 }, 'scene4start+=54')
    .to('.dot-f', { opacity: 1, scale: 1.5, duration: 0.5 }, 'scene4start+=57')

    // ============================================
    // SCENE 5: WHAT WE CAN DO
    // ============================================
    .addLabel('scene5start', 'scene4start+=65')

    // ZOOM INTO LINE TRANSITION: Grow line stroke-width to fill viewport with black,
    // hide other 4F content, then fade in dark Scene 5 bg seamlessly.
    .to(['.s4f-content', '.s4-dot'], { opacity: 0, duration: 1.2, ease: 'power2.in' }, 'scene5start')
    .to('#s4-line-path', { strokeWidth: 4000, duration: 2.4, ease: 'power2.in' }, 'scene5start')

    // Reveal Scene 5 — dark bg matches the now-black viewport
    .to('.scene-5', { autoAlpha: 1, duration: 0.1 }, 'scene5start+=2')
    .to('.s5-bg', { opacity: 1, duration: 1.6, ease: 'power2.inOut' }, 'scene5start+=2')

    // Finally fade out Scene 4 (line included) after dark bg is in place
    .to('.scene-4', { autoAlpha: 0, duration: 1.2 }, 'scene5start+=3')

    // ---------- 5A: Opening (panel stays at y:0, no scroll) ----------
    // All 3 texts appear in sequence and stay visible
    .fromTo('.s5a-t1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4 }, 'scene5start+=4')
    .fromTo('.s5a-t2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.4 }, 'scene5start+=9')
    .fromTo('.s5a-t3', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' }, 'scene5start+=14')

    // Lock marker — once scrub reaches here, scroll is locked until user presses Enter / taps
    .addLabel('s5a_lock', 'scene5start+=17')

    // Transition 5A → 5B (driven by lenis.scrollTo from the Enter/tap handler, not user scroll)
    .to('.s5-scroll-stage', { y: '-100vh', duration: 3, ease: 'power2.inOut' }, 'scene5start+=22')

    // Target after Enter/tap — scrub jumps to here; 5B panel is fully in view
    .addLabel('s5b_ready', 'scene5start+=27')

    // ---------- 5B: Energy Usage (click-driven, animated by Enter handler) ----------

    // Transition 5B → 5C
    .to('.s5-scroll-stage', { y: '-200vh', duration: 3, ease: 'power2.inOut' }, 'scene5start+=30')

    // ---------- 5C: Transport ----------
    .fromTo('.s5c-t1',   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, 'scene5start+=34')
    .fromTo('.s5c-line', { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power2.out' }, 'scene5start+=34')
    .fromTo('.s5c-st1',  { opacity: 0 }, { opacity: 1, duration: 1.4 }, 'scene5start+=34')

    .fromTo('.s5c-st2',     { opacity: 0 }, { opacity: 1, duration: 1.4 }, 'scene5start+=39')
    .fromTo('.s5c-train',   { x: '-60vw', opacity: 0 }, { x: 0, opacity: 1, duration: 1.8, ease: 'power3.out' }, 'scene5start+=39')
    .fromTo('.s5c-walker',  { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'back.out(1.6)' }, 'scene5start+=40')
    .fromTo('.s5c-bicycle', { x: '60vw', opacity: 0 }, { x: 0, opacity: 1, duration: 1.8, ease: 'power3.out' }, 'scene5start+=39')

    // Transition 5C → 5D: SWIPE TO LEFT
    .to('.s5c-panel', { x: '-100vw', duration: 3, ease: 'power3.inOut' }, 'scene5start+=46')
    .to('.s5d-panel', { x: 0,        duration: 3, ease: 'power3.inOut' }, 'scene5start+=46')

    // ---------- 5D: Sustainable Choices ----------
    .fromTo('.s5d-t1', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 'scene5start+=48')
    .fromTo('.s5d-icon', { opacity: 0, x: -30 }, { opacity: 1, x: 0, stagger: 0.3, duration: 1.4 }, 'scene5start+=50')
    .fromTo(['.s5d-st1', '.s5d-st2', '.s5d-st3', '.s5d-st4'], { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.55, duration: 1.4 }, 'scene5start+=53')

    // Transition 5D → 5E (vertical)
    .to('.s5-scroll-stage', { y: '-300vh', duration: 4.5, ease: 'power2.inOut' }, 'scene5start+=62')

    // ---------- 5E: Closing ----------
    .fromTo('.s5e-t1', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.4 }, 'scene5start+=68')
    .fromTo('.s5e-handshake', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.6, ease: 'back.out(1.5)' }, 'scene5start+=71')
    .fromTo('.s5e-t2', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.4 }, 'scene5start+=74')
    .fromTo('.s5e-t3', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.4 }, 'scene5start+=77')

    // ============================================
    // SCENE 6: CALL TO ACTION
    // ============================================
    .addLabel('scene6start', 'scene5start+=86')

    // Exit Scene 5 with an impact burst instead of a simple fade
    .to('.s5e-content', { scale: 0.88, filter: 'blur(2px)', opacity: 0.32, duration: 2, ease: 'power2.inOut' }, 'scene6start')
    .to('.s5-transition-burst', { autoAlpha: 1, duration: 0.1 }, 'scene6start+=0.4')
    .to('.s5-burst-wash', { opacity: 0.78, scale: 1, rotation: 28, duration: 2.4, ease: 'power3.out' }, 'scene6start+=0.4')
    .to('.s5-burst-core', { opacity: 0.85, scale: 1, duration: 1.4, ease: 'back.out(1.8)' }, 'scene6start+=0.6')
    .to('.s5-burst-ring', { opacity: 0.7, scale: 2.8, duration: 2.4, stagger: 0.2, ease: 'power3.out' }, 'scene6start+=0.7')
    .to('.s5-burst-ray', { opacity: 0.55, scaleY: 1.8, duration: 2.0, stagger: 0.1, ease: 'power2.out' }, 'scene6start+=1')
    .to('.s5-scroll-stage', { scale: 1.08, filter: 'blur(10px)', duration: 3.2, ease: 'power2.inOut' }, 'scene6start+=1.2')
    // Burst exits earlier so it clears before REALITY arrives — no more contrast clash
    .to('.s5-transition-burst', { scale: 6, opacity: 0, duration: 2.2, ease: 'power3.in' }, 'scene6start+=2.4')
    .to('.scene-5', { autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' }, 'scene6start+=3.6')

    // Enter Scene 6 — fade cream bg in while the burst is still finishing,
    // so the handoff feels like the burst dissolves INTO the cream rather than over it.
    .to('.scene-6', { autoAlpha: 1, duration: 0.1 }, 'scene6start+=3.2')
    .fromTo('.s6-bg',
      { opacity: 0, filter: 'brightness(1.8)' },
      { opacity: 1, filter: 'brightness(1)', duration: 3.2, ease: 'power2.inOut' },
      'scene6start+=3.2')

    // Phase 1: REALITY text appears AFTER burst is fully gone (burst ends ~+=4.6)
    .fromTo('.s6-t1', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 2, ease: 'power3.out' }, 'scene6start+=5')
    .to('.reality-word', { scale: 15, y: '-4vh', duration: 6, ease: 'power2.in' }, 'scene6start+=8')
    // Bg darkens as REALITY consumes the screen — smooth tonal handoff into the forest beat
    .to('.s6-bg', { backgroundColor: '#1f1a14', duration: 4, ease: 'power2.inOut' }, 'scene6start+=9.5')
    .to(['.s6-t2', '.s6-t3'], { color: '#e8e2d5', duration: 0.1, ease: 'none' }, 'scene6start+=13')
    .to('.s6-t1', { autoAlpha: 0, filter: 'blur(10px)', duration: 2.5, ease: 'power2.inOut' }, 'scene6start+=12')

    // Text 2, then Text 3, then the before/after image appears
    .fromTo('.s6-t2', { opacity: 0, y: 28, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2, ease: 'power3.out' }, 'scene6start+=15')
    .fromTo('.s6-t3', { opacity: 0, y: 28, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2, ease: 'power3.out' }, 'scene6start+=19')
    .fromTo('.s6-slider', { opacity: 0, scale: 0.78, y: 46, filter: 'blur(8px) brightness(0.85)' }, { opacity: 1, scale: 1, y: 0, filter: 'blur(0px) brightness(0.85)', duration: 3, ease: 'power3.out' }, 'scene6start+=23')

    // Phase 1 content lifts upward as the cream panel sweeps up from below.
    // Swipe duration is stretched so it tracks scroll progress 1:1 — user must
    // scroll the full panel travel before phase-2 fully lands.
    .to(['.s6-t2', '.s6-t3', '.s6-slider'], { autoAlpha: 0, y: -80, duration: 3, ease: 'power2.in' }, 'scene6start+=34')
    .to('.s6-phase-2', { yPercent: 0, duration: 6, ease: 'none' }, 'scene6start+=35')
    .to('.s6-phase-1', { opacity: 0, duration: 0.4 }, 'scene6start+=40.6')

    // Final line stencil fill, with US highlighted, then button appears
    .fromTo('.s6-stencil:not(.s6-us-highlight)',
      { opacity: 0, y: 24, backgroundSize: '0% 100%' },
      { opacity: 1, y: 0, backgroundSize: '100% 100%', stagger: 0.2, duration: 2.2, ease: 'power3.out' },
      'scene6start+=41.4')
    .to('.s6-us-highlight',
      { opacity: 1, scale: 1, y: 0, backgroundSize: '100% 100%', duration: 1.5, ease: 'back.out(1.55)' },
      'scene6start+=43.8')
    .fromTo('.cta-button',
      { opacity: 0, y: 28, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 1.25, ease: 'back.out(1.35)' },
      'scene6start+=45.6')

  // ============================================
  // SCENE 5A: Scroll lock + Enter-driven window-open transition
  // ============================================
  // Flow:
  //   1. Once scrub reaches s5a_lock label, lenis.stop() halts the page + hint fades in.
  //   2. User presses Enter → window-shutter panels close in, scroll jumps to s5b_ready,
  //      panels open, then bulb+t1 → st1 → icons → hint reveal in sequence.
  //   3. After reveal, scroll is released; user clicks the 3 buttons to reveal subtexts.

  let s5aLocked = false
  let s5aTransitioning = false
  let navIgnoreLock = false

  const showHint = () => gsap.to('.s5a-enter-hint', { opacity: 1, duration: 0.6, ease: 'power2.out' })

  const resetS5B = () => {
    gsap.set('.s5b-bulb', { opacity: 0, y: 30 })
    gsap.set('.s5b-t1',   { opacity: 0, y: 20 })
    gsap.set('.s5b-st1',  { opacity: 0 })
    gsap.set('.s5b-icons',{ opacity: 0, y: 20 })
    gsap.set('.s5b-hint', { opacity: 0 })
    document.querySelectorAll('.s5b-item.revealed').forEach(b => b.classList.remove('revealed'))
    document.querySelector('.s5b-hint')?.classList.remove('hide')
  }

  const lockAt5A = () => {
    if (s5aLocked || s5aTransitioning) return
    s5aLocked = true
    lenis.stop()
    resetS5B()
    showHint()
  }

  const maybeLockAt5A = () => {
    if (s5aLocked || s5aTransitioning || navIgnoreLock) return
    const lockTime = masterTl.labels['s5a_lock']
    if (lockTime == null) return
    const now = masterTl.time()
    if (now >= lockTime && now <= lockTime + 8) lockAt5A()
  }

  // Watch scrub time; lock when entering the 5A settle range
  lenis.on('scroll', maybeLockAt5A)

  // Prevent keyboard scroll while locked
  const blockedScrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End', 'Spacebar']
  window.addEventListener('keydown', (e) => {
    if ((s5aLocked || s5aTransitioning) && blockedScrollKeys.includes(e.key)) {
      e.preventDefault()
    }
  })

  // Mobile-sized coarse-pointer screens use tap copy/interaction.
  const mobileViewportQuery = window.matchMedia('(max-width: 720px)')
  const coarsePointerQuery = window.matchMedia('(hover: none) and (pointer: coarse)')
  const isMobileTapMode = () => mobileViewportQuery.matches && coarsePointerQuery.matches
  const hintEl = document.querySelector('.s5a-enter-hint')
  const updateS5AInteractionHint = () => {
    if (!hintEl) return
    hintEl.innerHTML = isMobileTapMode()
      ? 'Tap anywhere to continue'
      : 'Press <kbd>Enter</kbd> to continue'
  }
  updateS5AInteractionHint()
  mobileViewportQuery.addEventListener?.('change', updateS5AInteractionHint)
  coarsePointerQuery.addEventListener?.('change', updateS5AInteractionHint)

  const runS5BTransition = () => {
    if (!s5aLocked || s5aTransitioning) return
    s5aLocked = false
    s5aTransitioning = true

    const st = masterTl.scrollTrigger
    const targetTime = masterTl.labels['s5b_ready']
    const progress = targetTime / masterTl.duration()
    const targetScroll = st.start + (st.end - st.start) * progress

    const tl = gsap.timeline({
      onComplete: () => { s5aTransitioning = false }
    })

    // 1. Fade out hint + close shutters in parallel
    tl.to('.s5a-enter-hint', { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
      .set('.window-shutter', { visibility: 'visible' }, 0)
      .to('.window-shutter-top',    { y: '0%', duration: 0.55, ease: 'power2.in' }, 0)
      .to('.window-shutter-bottom', { y: '0%', duration: 0.55, ease: 'power2.in' }, 0)

      // 2. While screen is fully covered, resume Lenis and jump scroll
      .call(() => {
        lenis.start()
        lenis.scrollTo(targetScroll, { immediate: true, force: true })
      })

      // 3. Hold cover briefly so scrub (1.5s smoothing) catches up to the new scroll
      .to({}, { duration: 1.1 })

      // 4. Guarantee 5B starts hidden (scrub may have momentarily passed through reveal)
      .call(() => resetS5B())

      // 5. Open shutters to reveal 5B
      .to('.window-shutter-top',    { y: '-100%', duration: 0.75, ease: 'power3.out' })
      .to('.window-shutter-bottom', { y: '100%',  duration: 0.75, ease: 'power3.out' }, '<')
      .set('.window-shutter', { visibility: 'hidden' })

      // 6. Sequential reveal per storyboard:
      //    Text 1 + Bulb appear → Subtext 1 → Icons (3 buttons) → click hint
      .to(['.s5b-bulb', '.s5b-t1'], { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' })
      .to('.s5b-st1',   { opacity: 1, duration: 0.9, ease: 'power2.out' }, '+=0.3')
      .to('.s5b-icons', { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '+=0.35')
      .to('.s5b-hint',  { opacity: 1, duration: 0.6, ease: 'power2.out' }, '+=0.2')
  }

  // Enter key (desktop) triggers the window-open transition
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return
    if (!s5aLocked || s5aTransitioning) return
    e.preventDefault()
    runS5BTransition()
  })

  // Tap anywhere in mobile view triggers the same transition.
  // Ignore taps on the audio toggle so it stays interactive.
  window.addEventListener('pointerdown', (e) => {
    if (!isMobileTapMode()) return
    if (!s5aLocked || s5aTransitioning) return
    if (e.target.closest('.audio-toggle')) return
    runS5BTransition()
  })

  // ============================================
  // SCENE 5B: Click interaction (reveal subtext on click, no scroll lock)
  // ============================================
  document.querySelectorAll('.s5b-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('revealed')) return
      btn.classList.add('revealed')
      // Hide hint once any icon clicked
      const hint = document.querySelector('.s5b-hint')
      if (hint && document.querySelectorAll('.s5b-item.revealed').length >= 1) {
        hint.classList.add('hide')
      }
    })
  })

  // ============================================
  // SCENE 6: CTA BUTTON → JUMPS BACK TO SCENE 5
  // Reuses the same label+offset pattern as chapter dots.
  // ============================================
  const ctaButton = document.querySelector('.cta-button')
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      const st = masterTl.scrollTrigger
      if (!st) return
      const labelName = ctaButton.dataset.chapterLabel || 'scene5start'
      const offset = parseFloat(ctaButton.dataset.chapterOffset || '0')
      const baseTime = masterTl.labels[labelName]
      if (baseTime == null) return
      const time = baseTime + offset
      const progress = time / masterTl.duration()
      const targetY = st.start + (st.end - st.start) * progress
      navIgnoreLock = true
      if (s5aLocked) {
        s5aLocked = false
        lenis.start()
      }
      gsap.to('.s5a-enter-hint', { opacity: 0, duration: 0.3, overwrite: true })
      lenis.scrollTo(targetY, {
        duration: 1.6,
        force: true,
        onComplete: () => {
          navIgnoreLock = false
          lockAt5A()
        }
      })
    })
  }

  // ============================================
  // SCENE 6: BEFORE/AFTER SLIDER (USER-DRAGGABLE)
  // Replaces the scroll-driven clipPath scrub — user controls the comparison.
  // ============================================
  const slider = document.querySelector('#s6-slider')
  if (slider) {
    const afterWrap = slider.querySelector('.s6-slider-after-wrap')
    const handle = slider.querySelector('.s6-slider-handle')
    let dragging = false
    let activePointerId = null

    const setSliderPosition = (pct) => {
      const clamped = Math.min(Math.max(pct, 0), 100)
      afterWrap.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`
      handle.style.left = `${clamped}%`
    }

    const updateFromClientX = (clientX) => {
      const rect = slider.getBoundingClientRect()
      if (rect.width === 0) return
      const pct = ((clientX - rect.left) / rect.width) * 100
      setSliderPosition(pct)
    }

    slider.addEventListener('pointerdown', (e) => {
      dragging = true
      activePointerId = e.pointerId
      slider.classList.add('is-dragging')
      updateFromClientX(e.clientX)
      e.preventDefault()
      e.stopPropagation()
    })

    // Listen on document so drag tracks even if cursor leaves the slider
    document.addEventListener('pointermove', (e) => {
      if (!dragging) return
      if (activePointerId !== null && e.pointerId !== activePointerId) return
      updateFromClientX(e.clientX)
    })

    const stopDrag = () => {
      if (!dragging) return
      dragging = false
      activePointerId = null
      slider.classList.remove('is-dragging')
    }
    document.addEventListener('pointerup', stopDrag)
    document.addEventListener('pointercancel', stopDrag)
  }

  // ============================================
  // CHAPTER NAVIGATION DOTS
  // Position each dot along the scrollbar based on its label time in the master
  // timeline, then wire clicks to jump there via Lenis.
  // ============================================
  const chapterDots = document.querySelectorAll('.story-chapter-dot')

  // Compute target timeline time for a dot (label time + offset)
  const dotTargetTime = (dot) => {
    const labelName = dot.dataset.chapterLabel
    const offset = parseFloat(dot.dataset.chapterOffset || '0')
    const baseTime = masterTl.labels[labelName]
    if (baseTime == null) return null
    return baseTime + offset
  }

  const dotTargetScrollY = (dot) => {
    const st = masterTl.scrollTrigger
    if (!st) return 0
    const time = dotTargetTime(dot)
    if (time == null) return 0
    const progress = time / masterTl.duration()
    return st.start + (st.end - st.start) * progress
  }

  // Position each dot at its target moment on the scrollbar
  const positionChapterDots = () => {
    chapterDots.forEach(dot => {
      const time = dotTargetTime(dot)
      if (time == null) return
      const progress = time / masterTl.duration()
      const pct = Math.min(Math.max(progress * 100, 0), 100)
      dot.style.setProperty('--chapter-pos', `${pct}%`)
    })
  }

  positionChapterDots()

  chapterDots.forEach(dot => {
    // Stop pointerdown so the scrollbar track's scrub-drag doesn't fire underneath
    dot.addEventListener('pointerdown', (e) => e.stopPropagation())

    dot.addEventListener('click', (e) => {
      e.stopPropagation()
      const targetY = dotTargetScrollY(dot)
      // Block lock-re-entry BEFORE touching lenis so no in-flight scroll re-triggers it
      navIgnoreLock = true
      // Release the 5A lock if user is jumping somewhere else
      if (s5aLocked) {
        s5aLocked = false
        lenis.start()
      }
      // Always fade — covers any state where hint is visible but s5aLocked drifted
      gsap.to('.s5a-enter-hint', { opacity: 0, duration: 0.3, overwrite: true })
      lenis.scrollTo(targetY, {
        duration: 1.4,
        force: true,
        onComplete: () => {
          navIgnoreLock = false
          maybeLockAt5A()
        }
      })
    })
  })

  // Highlight "passed" chapters as user scrolls
  const updateChapterStates = () => {
    const current = masterTl.time()
    chapterDots.forEach(dot => {
      const time = dotTargetTime(dot)
      if (time == null) return
      dot.classList.toggle('is-passed', current >= time)
    })
  }
  lenis.on('scroll', updateChapterStates)
  updateChapterStates()

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      positionChapterDots();
    }, 250);
  });
}
