// Figma Foundations — Opacity Levels
// Used for disabled states, overlays, and watermark decorations.

export const opacity = {
  '0':    '0',
  '5':    '0.05',
  '10':   '0.10',
  '20':   '0.20',
  '30':   '0.30',
  '40':   '0.40',
  '50':   '0.50',
  '60':   '0.60',
  '70':   '0.70',
  '75':   '0.75',
  '80':   '0.80',
  '90':   '0.90',
  '95':   '0.95',
  '100':  '1',
  // Named aliases for common use-cases
  disabled:  '0.40',  // Disabled button / input
  overlay:   '0.50',  // Modal backdrop
  watermark:  '0.05', // TrsHeroCard decorative background text
} as const

export type OpacityToken = keyof typeof opacity
