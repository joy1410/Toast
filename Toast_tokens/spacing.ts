// Figma Foundations — Spacing Scale
// Source: Figma "Sizing and Spacing" > space group
// Last updated: 2026-05-14
//
// Figma named tokens → dimension values (px):
//   space-none     → 0
//   space-3xsmall  → 2
//   space-2xsmall  → 4
//   space-xsmall   → 8
//   space-small    → 12
//   space-medium   → 16
//   space-large    → 24
//   space-xlarge   → 32
//   space-2xlarge  → 40
//   space-3xlarge  → 48
//   space-4xlarge  → 56
//   space-5xlarge  → 64
//
// Numeric keys retain Tailwind utility compatibility (p-4 = 16px).

export const spacing = {
  // — Figma named tokens ——————————————————————————————————————————————————
  'space-none':    '0px',
  'space-3xsmall': '2px',
  'space-2xsmall': '4px',
  'space-xsmall':  '8px',
  'space-small':   '12px',
  'space-medium':  '16px',
  'space-large':   '24px',
  'space-xlarge':  '32px',
  'space-2xlarge': '40px',
  'space-3xlarge': '48px',
  'space-4xlarge': '56px',
  'space-5xlarge': '64px',

  // — Numeric aliases (Tailwind-compatible, 4px base grid) ———————————————
  px:    '1px',
  '0':   '0px',
  '0.5': '2px',
  '1':   '4px',
  '1.5': '6px',
  '2':   '8px',
  '2.5': '10px',
  '3':   '12px',
  '3.5': '14px',
  '4':   '16px',
  '5':   '20px',
  '6':   '24px',
  '7':   '28px',
  '8':   '32px',
  '9':   '36px',
  '10':  '40px',
  '11':  '44px',
  '12':  '48px',
  '14':  '56px',
  '16':  '64px',
  '20':  '80px',
  '24':  '96px',
  '28':  '112px',
  '32':  '128px',
  '36':  '144px',
  '40':  '160px',
  '48':  '192px',
  '56':  '224px',
  '64':  '256px',
  '72':  '288px',
  '80':  '320px',
  '96':  '384px',
} as const

export type SpacingToken = keyof typeof spacing
