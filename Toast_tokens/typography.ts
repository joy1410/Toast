// Figma Foundations — Typography Tokens
// Source: Figma type scale screenshot, Restaurant Web mode
// Last updated: 2026-05-15
//
// Three font files are used:
//   heading         → 'Effra'         (Effra Regular)   — Headline-X/Regular variants
//   heading-medium  → 'Effra Medium'  (Effra Medium)    — Headline-X/Medium variants
//   sans            → 'Source Sans Pro'                  — Large, Default, Subhead, Caption, Overline
//
// IMPORTANT: Both Effra Regular and Effra Medium use font-weight: 400 in CSS.
// They are separate font files and are distinguished by font-family name only,
// NOT by font-weight. Do NOT use font-weight to switch between them.
//
// ─── HOW TO ADD FONT FILES ───────────────────────────────────────────────────
// Option A — next/font/local (recommended for Next.js):
//   1. Place font files in src/fonts/:
//        Effra-Regular.woff2
//        Effra-Medium.woff2
//        SourceSansPro-Regular.woff2
//        SourceSansPro-SemiBold.woff2
//        SourceSansPro-Bold.woff2
//   2. In src/app/layout.tsx, uncomment and use the three localFont declarations
//      (see layout.tsx for the exact code block to uncomment).
//   3. No changes needed in this file after that — CSS variables are already wired.
//
// Option B — @font-face in globals.css:
//   1. Add @font-face blocks in globals.css with:
//        font-family: 'Effra'        → Effra-Regular.woff2
//        font-family: 'Effra Medium' → Effra-Medium.woff2
//        font-family: 'Source Sans Pro' → all three weight files
//   2. No changes needed in this file — the names already match.
// ────────────────────────────────────────────────────────────────────────────

// Explicit mutable type so Tailwind fontSize theme key accepts it without readonly conflicts.
type FontSizeEntry = [string, { lineHeight: string; letterSpacing?: string; fontWeight?: string }]

// — Font families —————————————————————————————————————————————————————————————
// First entry is the exact Figma font name.
// After adding font files, the CSS variable in globals.css is updated — no change needed here.
export const fontFamily = {
  // Effra Regular — use for Headline-X/Regular (Figma: Font = "Effra")
  heading: ['Effra', 'serif', 'Georgia'],
  // Effra Medium — use for Headline-X/Medium (Figma: Font = "Effra Medium")
  'heading-medium': ['Effra Medium', 'serif', 'Georgia'],
  // Source Sans Pro — use for all body/UI text (Large, Default, Subhead, Caption, Overline)
  sans: ['Source Sans Pro', 'system-ui', '-apple-system', 'sans-serif'],
} as const

// — Font size scale ———————————————————————————————————————————————————————————
// ─── USAGE PATTERN ───────────────────────────────────────────────────────────
//
// Effra Regular headings (Figma: Headline-X/Regular):
//   <h1 class="font-heading text-headline-1">…</h1>
//
// Effra Medium headings (Figma: Headline-X/Medium):
//   <span class="font-heading-medium text-headline-3">$ 243,000</span>
//   <span class="font-heading-medium text-headline-7">Total Rewards for 2026</span>
//   <span class="font-heading-medium text-headline-6">Your rewards breakdown</span>
//
// Source Sans Pro body text — weight variants via font-weight utility:
//   <p    class="font-sans text-default">…</p>                  (Default/Regular  — 400)
//   <p    class="font-sans text-default font-semibold">…</p>    (Default/Semibold — 600)
//   <p    class="font-sans text-default font-bold">…</p>        (Default/Bold     — 700)
//   <p    class="font-sans text-large font-semibold">…</p>      (Large/Semibold   — 600)
//   <button class="font-sans text-default font-semibold        (Button/Default/Semibold)
//                  text-color-text-action">View details</button>
//
// ─────────────────────────────────────────────────────────────────────────────
//
// Sizes in rem (converted from Figma px at 16px base):
//   68px = 4.25rem  | 52px = 3.25rem  | 42px = 2.625rem | 34px = 2.125rem
//   32px = 2rem     | 26px = 1.625rem | 24px = 1.5rem   | 20px = 1.25rem
//   18px = 1.125rem | 16px = 1rem     | 14px = 0.875rem | 12px = 0.75rem

export const fontSize: Record<string, FontSizeEntry> = {
  // — Effra — Display & Headings (font-heading) ——————————————————————————————
  // Figma: Regular/Medium, font-weight: 400, letter-spacing: auto (0)
  'display':    ['4.25rem',  { lineHeight: '4.25rem', letterSpacing: '0' }],  // 68/68px
  'headline-1': ['3.125rem', { lineHeight: '3.25rem', letterSpacing: '0' }],  // 50/52px
  'headline-2': ['2.375rem', { lineHeight: '2.625rem', letterSpacing: '0' }], // 38/42px
  'headline-3': ['1.875rem', { lineHeight: '2.125rem', letterSpacing: '0' }], // 30/34px
  'headline-4': ['1.625rem', { lineHeight: '2rem',    letterSpacing: '0' }],  // 26/32px
  'headline-5': ['1.375rem', { lineHeight: '1.625rem', letterSpacing: '0' }], // 22/26px
  'headline-6': ['1.25rem',  { lineHeight: '1.5rem',  letterSpacing: '0' }],  // 20/24px
  'headline-7': ['1.125rem', { lineHeight: '1.25rem', letterSpacing: '0' }],  // 18/20px

  // — Source Sans Pro — Body / UI (font-sans) ————————————————————————————————
  // Figma: Regular (400) / Semibold (600) / Bold (700), letter-spacing in px
  // Default font-weight is Regular (400); apply font-semibold or font-bold as needed.
  'large':    ['1.25rem',  { lineHeight: '1.5rem',  letterSpacing: '0.2px' }],  // 20/24px, ls 0.2
  'default':  ['1rem',     { lineHeight: '1.5rem',  letterSpacing: '0.2px' }],  // 16/24px, ls 0.2
  'subhead':  ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.2px' }],  // 14/20px, ls 0.2
  'caption':  ['0.75rem',  { lineHeight: '1rem',    letterSpacing: '0.4px' }],  // 12/16px, ls 0.4
  'overline': ['0.75rem',  { lineHeight: '1rem',    letterSpacing: '1.2px' }],  // 12/16px, ls 1.2
}

// — Font weights ——————————————————————————————————————————————————————————————
// Effra "Regular/Medium" in Figma = font-weight 400 (confirmed by Figma CSS exports)
// Source Sans Pro weights: Regular=400, Semibold=600, Bold=700
export const fontWeight = {
  regular:  '400',
  semibold: '600',
  bold:     '700',
} as const

// — Letter spacing ————————————————————————————————————————————————————————————
// Named tokens matching Figma letter-spacing values
export const letterSpacing = {
  auto:     '0',      // Effra headings — Figma "auto"
  ui:       '0.2px',  // Source Sans Pro Large / Default / Subhead
  caption:  '0.4px',  // Source Sans Pro Caption
  overline: '1.2px',  // Source Sans Pro Overline
} as const

// — Line heights ——————————————————————————————————————————————————————————————
export const lineHeight = {
  none:    '1',
  tight:   '1.1',
  snug:    '1.25',
  normal:  '1.5',
  relaxed: '1.625',
} as const
