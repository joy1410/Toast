'use client'

import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react'
import gsap from 'gsap'

// ─── Public types ────────────────────────────────────────────────────────────────

export interface CarouselCard {
  id: string | number
  content: ReactNode
}

// ─── Constants ───────────────────────────────────────────────────────────────────

const AUTO_SECS = 6
const PILL_TRANSITION_MS = 150
const PILL_TRANSITION_S = PILL_TRANSITION_MS / 1000

// ─── Slot configs ────────────────────────────────────────────────────────────────

const FRONT = {
  x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, zIndex: 4,
  bg: '#ffffff',
  shadow: '0px 5px 5px -3px rgba(0,0,0,0.09), 0px 8px 19px 1px rgba(0,0,0,0.06), 0px 3px 14px 2px rgba(0,0,0,0.04)',
}
const BACK = {
  x: 38, y: -18, rotation: 6, scale: 1, opacity: 1, zIndex: 2,
  bg: '#efefef', shadow: 'none',
}
const OFF_R = { x: 90, y: -18, rotation: 10, scale: 0.95, opacity: 0, zIndex: 1, bg: '#efefef', shadow: 'none' }
const OFF_L = { x: -80, y: -18, rotation: -8, scale: 0.95, opacity: 0, zIndex: 1, bg: '#ffffff', shadow: 'none' }

type Slot = typeof FRONT
function slotFor(pos: number): Slot { return pos === 0 ? FRONT : pos === 1 ? BACK : OFF_R }
function getPos(ci: number, cur: number, n: number) { return (ci - cur + n) % n }

// ─── Component ───────────────────────────────────────────────────────────────────

interface Props {
  cards: CarouselCard[]
}

export function WhatChangedCarousel({ cards }: Props) {
  const N = cards.length

  const [current, setCurrent] = useState(0)
  const isAnimating = useRef(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const fillRefs = useRef<(HTMLDivElement | null)[]>([])
  const autoRef = useRef<gsap.core.Tween | null>(null)
  const fillTweenRef = useRef<gsap.core.Tween | null>(null)
  const navigateRef = useRef<(dir: 1 | -1) => void>(() => { })

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const applySlot = (el: HTMLDivElement, s: Slot) => {
    gsap.set(el, { x: s.x, y: s.y, rotation: s.rotation, scale: s.scale, opacity: s.opacity, zIndex: s.zIndex })
    el.style.backgroundColor = s.bg
    el.style.boxShadow = s.shadow
  }

  const killProgress = () => {
    if (autoRef.current) { autoRef.current.kill(); autoRef.current = null }
    if (fillTweenRef.current) { fillTweenRef.current.kill(); fillTweenRef.current = null }
  }

  const pauseProgress = () => { fillTweenRef.current?.pause(); autoRef.current?.pause() }
  const resumeProgress = () => { fillTweenRef.current?.resume(); autoRef.current?.resume() }

  const startProgress = useCallback((idx: number) => {
    killProgress()
    const fill = fillRefs.current[idx]
    if (!fill) return
    gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' })
    fillTweenRef.current = gsap.to(fill, { scaleX: 1, duration: AUTO_SECS - PILL_TRANSITION_S, ease: 'none', delay: PILL_TRANSITION_S })
    autoRef.current = gsap.delayedCall(AUTO_SECS, () => navigateRef.current(1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Navigate ──────────────────────────────────────────────────────────────────

  const navigate = useCallback((dir: 1 | -1) => {
    if (isAnimating.current) return
    isAnimating.current = true
    killProgress()

    const next = (current + dir + N) % N

    setCurrent(next)
    startProgress(next)

    const tl = gsap.timeline({
      onComplete: () => {
        cardRefs.current.forEach((el, i) => { if (el) applySlot(el, slotFor(getPos(i, next, N))) })
        isAnimating.current = false
      },
    })

    if (dir === 1) {
      // ══ NEXT ══════════════════════════════════════════════════════════════════
      // 1a. Front fades out     (0.00 → 0.30s)
      // 1b. Back arcs to front  (0.10 → 0.54s) — overlaps with 1a
      // 2.  New back drifts in  (0.52 → 0.88s) — begins when 1b is ~70% done
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const oldPos = getPos(i, current, N)
        const newPos = getPos(i, next, N)

        if (oldPos === 0) {
          tl.to(el, { opacity: 0, scale: 0.94, y: 6, duration: 0.30, ease: 'power2.out' }, 0)
          tl.set(el, { zIndex: 1 }, 0.30)

        } else if (oldPos === 1) {
          tl.to(el, {
            x: FRONT.x, rotation: FRONT.rotation, scale: FRONT.scale,
            duration: 0.44, ease: 'power2.out', zIndex: FRONT.zIndex,
            onStart: () => { el.style.backgroundColor = FRONT.bg; el.style.boxShadow = FRONT.shadow },
          }, 0.10)
          tl.to(el, { y: FRONT.y, duration: 0.44, ease: 'back.out(1.8)' }, 0.10)

        } else if (newPos === 1) {
          gsap.set(el, { x: BACK.x + 14, y: BACK.y - 8, rotation: BACK.rotation + 2, scale: 0.96, opacity: 0, zIndex: BACK.zIndex })
          el.style.backgroundColor = BACK.bg; el.style.boxShadow = BACK.shadow
          tl.to(el, { x: BACK.x, y: BACK.y, rotation: BACK.rotation, scale: BACK.scale, opacity: 1, duration: 0.36, ease: 'power2.out' }, 0.52)
        }
      })

    } else {
      // ══ PREV ══════════════════════════════════════════════════════════════════
      // 1a. Back fades out           (0.00 → 0.27s)
      // 1b. Front arcs to back slot  (0.10 → 0.50s) — overlaps with 1a
      // 2.  New front from left      (0.32 → 0.72s) — begins when 1b is ~55% done
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const oldPos = getPos(i, current, N)
        const newPos = getPos(i, next, N)

        if (oldPos === 1) {
          tl.to(el, { opacity: 0, scale: 0.96, duration: 0.27, ease: 'power2.out' }, 0)
          tl.set(el, { zIndex: 1 }, 0.27)

        } else if (oldPos === 0) {
          tl.to(el, {
            x: BACK.x, rotation: BACK.rotation, scale: BACK.scale,
            duration: 0.40, ease: 'power2.inOut', zIndex: BACK.zIndex,
            onStart: () => { el.style.backgroundColor = BACK.bg; el.style.boxShadow = BACK.shadow },
          }, 0.10)
          tl.to(el, { y: BACK.y, duration: 0.40, ease: 'back.out(1.1)' }, 0.10)

        } else if (newPos === 0) {
          gsap.set(el, { x: -52, y: -5, rotation: -4, scale: 1, opacity: 0, zIndex: 6 })
          el.style.backgroundColor = FRONT.bg; el.style.boxShadow = FRONT.shadow
          tl.to(el, { opacity: 1, duration: 0.16, ease: 'power2.out' }, 0.32)
          tl.to(el, { x: FRONT.x, y: FRONT.y, rotation: FRONT.rotation, duration: 0.38, ease: 'power2.out' }, 0.32)
          tl.set(el, { zIndex: FRONT.zIndex }, 0.72)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, N, startProgress])

  useEffect(() => { navigateRef.current = navigate }, [navigate])

  // ── Init ──────────────────────────────────────────────────────────────────────

  useEffect(() => {
    cardRefs.current.forEach((el, i) => { if (el) applySlot(el, slotFor(getPos(i, 0, N))) })
    startProgress(0)
    return killProgress
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="relative bg-white" style={{ width: 535, height: 407, borderRadius: 16, overflow: 'visible' }}>

      {/* Header */}
      <div className="absolute flex items-center justify-between" style={{ top: 28, left: 32, right: 28 }}>
        <span style={{ color: '#666', fontSize: 18, fontWeight: 500, lineHeight: '20px' }}>
          What changed
        </span>
        <button className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
          <svg width="15" height="3" viewBox="0 0 15 3" fill="none">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#252525" />
            <circle cx="7.5" cy="1.5" r="1.5" fill="#252525" />
            <circle cx="13.5" cy="1.5" r="1.5" fill="#252525" />
          </svg>
        </button>
      </div>

      {/* Card stack — hover pauses the auto-advance timer */}
      <div
        className="absolute"
        style={{ left: 28, top: 104 }}
        onMouseEnter={pauseProgress}
        onMouseLeave={resumeProgress}
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            ref={el => { cardRefs.current[i] = el }}
            className="absolute"
            style={{
              width: 290, height: 275, borderRadius: 14,
              willChange: 'transform', padding: 24,
              display: 'flex', flexDirection: 'column',
            }}
          >
            {card.content}
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      <div className="absolute flex" style={{ left: 397, top: 298, gap: 15 }}>
        {([
          { key: 'prev', handler: () => navigate(-1), d: 'M10 12L6 8L10 4' },
          { key: 'next', handler: () => navigate(1), d: 'M6 4L10 8L6 12' },
        ] as const).map(({ key, handler, d }) => (
          <button
            key={key}
            onClick={handler}
            className="flex items-center justify-center rounded-full"
            style={{ width: 45, height: 45, border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d={d} stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {/* Step indicator */}
      <div className="absolute flex items-center" style={{ left: 368, top: 378, gap: 4 }}>
        {cards.map((_, i) => (
          <div
            key={i}
            style={{
              position: 'relative', height: 5, borderRadius: 46,
              backgroundColor: '#e5e5e5', overflow: 'hidden', flexShrink: 0,
              width: i === current ? 98 : 5,
              transition: `width ${PILL_TRANSITION_MS}ms ease-out`,
            }}
          >
            <div
              ref={el => { fillRefs.current[i] = el }}
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: '#3d3d3d', borderRadius: 46,
                transformOrigin: 'left center',
                opacity: i === current ? 1 : 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
