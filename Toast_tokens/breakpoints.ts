// Figma Foundations — Breakpoints
// Mobile-first responsive. Values match Next.js / Tailwind conventions.

export const breakpoints = {
  sm:  '640px',   // phablet / large phone landscape
  md:  '768px',   // tablet portrait
  lg:  '1024px',  // tablet landscape / small laptop
  xl:  '1280px',  // standard desktop
  '2xl':'1536px', // wide desktop
} as const

// Content widths (derived from Figma screen widths in EmpScreen-1 to 4)
export const contentWidths = {
  content: '1000px', // main content column (EmpScreen 1–3)
  detail:  '700px',  // detail panel column (EmpScreen 4)
  narrow:  '480px',  // narrow centred panels
} as const

export type BreakpointToken  = keyof typeof breakpoints
export type ContentWidthToken = keyof typeof contentWidths
