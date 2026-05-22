// Figma Foundations — Shadow Tokens
// Source: Figma "Sizing and Spacing" > shadow-blur / shadow-spread / shadow-positioning
// Last updated: 2026-05-14

// — shadow-blur primitives ————————————————————————————————————————————————————
// dimension: none=0  3xs=1  2xs=2  xs=4  sm=8  md=12  lg=16  xl=24  2xl=32  3xl=40
export const shadowBlur = {
  none:      '0px',
  '3xsmall': '1px',
  '2xsmall': '2px',
  xsmall:    '4px',
  small:     '8px',
  medium:    '12px',
  large:     '16px',
  xlarge:    '24px',
  '2xlarge': '32px',
  '3xlarge': '40px',
} as const

// — shadow-spread primitives ——————————————————————————————————————————————————
// none=0  3xs=-8  2xs=-4  xs=-2  sm=-1  md=1  lg=2  xl=4  2xl=8
export const shadowSpread = {
  none:      '0px',
  '3xsmall': '-8px',
  '2xsmall': '-4px',
  xsmall:    '-2px',
  small:     '-1px',
  medium:    '1px',
  large:     '2px',
  xlarge:    '4px',
  '2xlarge': '8px',
} as const

// — shadow-positioning primitives (x / y offset) ——————————————————————————————
// none=0  3xs=1  2xs=2  xs=3  sm=4  md=6  lg=8  xl=12  2xl=16  3xl=24
export const shadowPositioning = {
  none:      '0px',
  '3xsmall': '1px',
  '2xsmall': '2px',
  xsmall:    '3px',
  small:     '4px',
  medium:    '6px',
  large:     '8px',
  xlarge:    '12px',
  '2xlarge': '16px',
  '3xlarge': '24px',
} as const

// — Composed elevation shadows ————————————————————————————————————————————————
// Format: offset-x offset-y blur spread color
// Colors reference opacity-black palette values (rgba(0,0,0,α))
export const shadows = {
  none: 'none',

  // Elevation 1 — Card (subtle lift)
  // y=positioning-3xsmall(1) blur=blur-xsmall(4) spread=spread-small(-1)
  card:  '0 1px 4px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',

  // Elevation 2 — Dropdown / Popovers
  // y=positioning-small(4) blur=blur-small(8) spread=spread-xsmall(-2)
  md:    '0 4px 8px -2px rgba(0,0,0,0.12), 0 2px 4px -2px rgba(0,0,0,0.08)',

  // Elevation 3 — Modal / Dialog
  // y=positioning-large(8) blur=blur-medium(12) spread=spread-xsmall(-2)
  lg:    '0 8px 12px -2px rgba(0,0,0,0.16), 0 4px 6px -4px rgba(0,0,0,0.10)',

  // Elevation 4 — Sticky nav / floating elements
  // y=positioning-2xlarge(16) blur=blur-xlarge(24) spread=spread-small(-1)
  xl:    '0 16px 24px -1px rgba(0,0,0,0.20), 0 8px 10px -6px rgba(0,0,0,0.12)',

  // Inner — form input inset
  // blur=blur-2xsmall(2) spread=spread-medium(1)
  inner: 'inset 0 2px 2px 1px rgba(0,0,0,0.08)',

  // Focus ring — border-width-focus(3px) + blue-50
  focus: '0 0 0 3px rgba(80,105,195,0.40)',
} as const

export type ShadowBlurToken        = keyof typeof shadowBlur
export type ShadowSpreadToken      = keyof typeof shadowSpread
export type ShadowPositioningToken = keyof typeof shadowPositioning
export type ShadowToken            = keyof typeof shadows
