// Figma Foundations — Border Radius & Border Width Tokens
// Source: Figma "Sizing and Spacing" > border-radius + border-width groups
// Last updated: 2026-05-14
//
// Dimension references (all in px):
//   dimension-0    = 0     → border-radius-none / border-width-none
//   dimension-1    = 1px   → border-width-small
//   dimension-2    = 2px   → border-width-medium
//   dimension-3    = 3px   → border-width-large / border-width-focus
//   dimension-4    = 4px   → border-radius-small
//   dimension-8    = 8px   → border-radius-medium
//   dimension-12   = 12px  → border-radius-large
//   dimension-9999 = 9999px→ border-radius-full

// — border-radius ——————————————————————————————————————————————————————————
export const radii = {
  none:   '0px',
  small:  '4px',
  medium: '8px',
  large:  '12px',
  full:   '9999px',
  // Backwards-compat aliases for existing components using xs/sm/md/lg/xl keys
  xs:    '2px',    // not in Figma — nearest reasonable value
  sm:    '4px',    // = border-radius-small
  md:    '8px',    // = border-radius-medium
  lg:    '12px',   // = border-radius-large
  xl:    '12px',   // = border-radius-large
  '2xl': '16px',   // TODO: verify — not in Figma screenshot
  '3xl': '24px',   // TODO: verify — not in Figma screenshot
} as const

// Named aliases that mirror component descriptions in CLAUDE.local.md
export const radiiAliases = {
  card:  radii.large,
  badge: radii.full,
  btn:   radii.full,
  input: radii.medium,
} as const

// — border-width ——————————————————————————————————————————————————————————
// dimension-0=0  dimension-1=1px  dimension-2=2px  dimension-3=3px
export const borderWidth = {
  none:   '0px',
  small:  '1px',
  medium: '2px',
  large:  '3px',
  focus:  '3px',
} as const

export type RadiiToken       = keyof typeof radii
export type BorderWidthToken = keyof typeof borderWidth
