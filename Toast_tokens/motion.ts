// Figma Foundations — Motion & Animation Tokens
// TODO: verify exact durations from Figma Foundations once MCP quota resets

export const duration = {
  instant:   '0ms',
  fast:      '100ms',
  normal:    '200ms',
  moderate:  '300ms',
  slow:      '400ms',
  deliberate:'600ms',
} as const

export const easing = {
  standard:  'cubic-bezier(0.4, 0, 0.2, 1)',  // Material standard
  decelerate:'cubic-bezier(0, 0, 0.2, 1)',     // Elements entering screen
  accelerate:'cubic-bezier(0.4, 0, 1, 1)',     // Elements leaving screen
  sharp:     'cubic-bezier(0.4, 0, 0.6, 1)',
  linear:    'linear',
} as const

export type DurationToken = keyof typeof duration
export type EasingToken   = keyof typeof easing
