/**
 * scripts/build-tokens.ts
 *
 * Reads every value from Toast_tokens/ and writes the generated @theme block
 * into src/app/tokens.generated.css.
 *
 * Run:  node --experimental-strip-types scripts/build-tokens.ts
 * Auto: hooked into `predev` and `prebuild` in package.json
 *
 * RULE: Never edit tokens.generated.css by hand — it is overwritten on every run.
 * Edit Toast_tokens/ source files instead.
 *
 * NOTE: Token files use extensionless imports (from './palette') which require
 * a bundler or module aliases to resolve. To avoid patching the token files,
 * this script imports palette.ts directly and re-derives the semantic mappings
 * inline — keeping it as a thin re-export of the same values.
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Import palette and standalone token files directly (no cross-file imports needed)
import { gray, opacityBlack, orange, blue, sky } from '../Toast_tokens/palette.ts'
import { radii } from '../Toast_tokens/radii.ts'
import { shadows } from '../Toast_tokens/shadows.ts'

// ── Build output lines ────────────────────────────────────────────────────────

const lines: string[] = []

function block(comment: string, vars: Record<string, string>) {
  lines.push(`  /* ${comment} */`)
  for (const [k, v] of Object.entries(vars)) {
    lines.push(`  --${k}: ${v};`)
  }
  lines.push('')
}

// ── 1. Gray palette (palette.ts → gray) ──────────────────────────────────────
block('Gray palette — palette.ts › gray', {
  'color-gray-white': gray.white,
  'color-gray-0':     gray['0'],
  'color-gray-25':    gray['25'],
  'color-gray-30':    gray['30'],
  'color-gray-50':    gray['50'],
  'color-gray-75':    gray['75'],
  'color-gray-100':   gray['100'],
  'color-gray-110':   gray['110'],
  'color-gray-125':   gray['125'],
})

// ── 2. Opacity-black palette (palette.ts → opacityBlack) ─────────────────────
block('Opacity-black — palette.ts › opacityBlack', {
  'color-black-4':  opacityBlack['4'],
  'color-black-8':  opacityBlack['8'],
  'color-black-12': opacityBlack['12'],
  'color-black-56': opacityBlack['56'],
  'color-black-80': opacityBlack['80'],
})

// ── 3. Primary brand palette (palette.ts → orange / blue) ────────────────────
block('Primary palette — palette.ts › orange, blue', {
  'color-orange-50': orange['50'],   // #ff4c00 — brand primary
  'color-blue-0':    blue['0'],      // #e7eaf6 — action subtle bg
  'color-blue-75':   blue['75'],     // #2b4fb9 — action / link
})

// ── 4. Semantic text colors (colors.ts mappings, sourced from palette above) ──
// color-text-default      = gray.125
// color-text-secondary    = gray.100
// color-text-action       = blue.75
// color-border-brand      = orange.50
block('Semantic text — colors.ts › textColors', {
  'color-ink':       gray['125'],    // color-text-default
  'color-secondary': gray['100'],    // color-text-secondary
  'color-tertiary':  '#616161',      // between gray-75/#7a7a7a and gray-100/#666 — no exact entry
  'color-muted':     '#999999',      // chart axis/hint — sits between gray-75 and gray-50
  'color-action':    blue['75'],     // color-text-action
  'color-brand':     orange['50'],   // color-border-brand
})

// ── 5. Semantic border colors (colors.ts → borderColors) ─────────────────────
// color-border-default           = opacityBlack.12
// color-border-subtle            = opacityBlack.8
// color-border-bold              = gray.50
// color-border-default-highlight = opacityBlack.56
block('Semantic borders — colors.ts › borderColors', {
  'color-border':        opacityBlack['12'],  // color-border-default
  'color-border-subtle': opacityBlack['8'],   // color-border-subtle
  'color-border-mid':    gray['50'],          // color-border-bold
  'color-border-strong': opacityBlack['56'],  // color-border-default-highlight
  'color-border-grid':   '#ebebeb',           // chart grid lines — between gray-25 and white
})

// ── 6. Semantic surfaces (colors.ts → backgroundColors / surfaceColors) ───────
// color-bg-default-highlight = opacityBlack.4
// color-surface-dim/base     = #F0F0F2 (surfaceColors)
// gray.25 = badge background
// gray.0  = table header / muted surface
// gray.30 = toggle group background
block('Semantic surfaces — colors.ts › backgroundColors + surfaceColors', {
  'color-background':       '#ffffff',           // page/card base — generates bg-background, text-background
  'color-surface-card':     opacityBlack['4'],  // color-bg-default-highlight
  'color-surface-badge':    gray['25'],          // badge / pill background
  'color-surface-base':     '#f0f0f2',           // color-surface-dim — no palette entry
  'color-surface-muted':    gray['0'],           // table header
  'color-surface-control':  gray['30'],          // toggle group bg
  'color-surface-selected': '#f5f5f5',           // dropdown hover — between gray-0 and gray-25
  'color-surface-neutral':  '#888888',           // vested/unvested mixed swatch — no palette entry
})

// ── 7. Info surfaces (sky palette) ───────────────────────────────────────────
block('Info surfaces — palette.ts › sky', {
  'color-bg-info-subtle': sky['0'],   // #E3F0FB — row highlight, info backgrounds
})

// ── 8. Tooltip surfaces (renumbered) ─────────────────────────────────────────
block('Tooltip surfaces — chart + grants', {
  'color-tooltip':        'rgba(0,0,0,0.82)',          // GrantsTab tooltip bg
  'color-tooltip-chart':  'rgba(0,0,0,0.78)',          // VestingChart hover tooltip bg
  'color-tooltip-muted':  'rgba(255,255,255,0.70)',    // secondary text inside dark tooltip
})

// ── 8. Border radius (radii.ts) ───────────────────────────────────────────────
// Tailwind v4 defaults already match radii.ts for the main stops:
//   rounded-sm  (0.25rem=4px)  = radii.small
//   rounded-lg  (0.5rem=8px)   = radii.medium
//   rounded-xl  (0.75rem=12px) = radii.large
//   rounded-2xl (1rem=16px)    = radii['2xl']
//   rounded-full               = radii.full
// Only 10px (inner cards) is missing from both TW defaults and radii.ts.
block('Custom border radius — radii.ts', {
  'radius-inner': '0.625rem',   // 10px — inner preset / summary cards
})

// ── 9. Shadows (shadows.ts) ───────────────────────────────────────────────────
block('Elevation shadows — shadows.ts', {
  'shadow-card':     shadows.card,
  'shadow-dropdown': shadows.md,
  // toggle pill active shadow — no named entry in shadows.ts; matches elevation-1 pattern
  'shadow-toggle':   '0 1px 5px rgba(0,0,0,0.04), 0 2px 2px rgba(0,0,0,0.06), 0 3px 1px -2px rgba(0,0,0,0.09)',
})

// ── 10. Custom font sizes ─────────────────────────────────────────────────────
// typography.ts maps: xs=12px, sm=14px, base=16px, lg=18px, xl=20px (all TW defaults ✓)
// Non-standard sizes used in components:
block('Custom font sizes — typography.ts (non-standard)', {
  'text-chip':       '0.625rem',     // 10px — TODAY chip, small labels
  'text-caption-sm': '0.6875rem',    // 11px — tooltip detail / badge counters
  'text-label-sm':   '0.8125rem',    // 13px — tooltip header, quarter bar labels (renamed to avoid conflict with --color-tooltip)
  'text-value':      '0.9375rem',    // 15px — period vested/unvested amounts
})

// ── 11. Letter-spacing ────────────────────────────────────────────────────────
// typography.ts: overline=1.2px, ui=0.2px. Extra stops for badge/chip variants.
block('Letter-spacing — typography.ts › letterSpacing', {
  'tracking-ui':       '0.0125rem',    // 0.2px
  'tracking-badge':    '0.05rem',      // 0.8px — uppercase badge labels
  'tracking-badge-sm': '0.0375rem',    // 0.6px — smaller badge labels
  'tracking-chip':     '0.01875rem',   // 0.3px — TODAY chip
  'tracking-overline': '0.075rem',     // 1.2px — typography.ts: overline
})

// ── 14. Font families ─────────────────────────────────────────────────────────
// Source Sans loaded via next/font in layout.tsx as --font-source-sans.
block('Font families — typography.ts › fontFamily', {
  'font-ui':             "var(--font-source-sans, 'Source Sans Pro', system-ui, sans-serif)",
  'font-heading':        "var(--font-source-sans, 'Effra', Georgia, serif)",
  'font-heading-medium': "var(--font-source-sans, 'Effra Medium', Georgia, serif)",
})

// ── Write output ──────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const outPath    = resolve(__dirname, '../src/app/tokens.generated.css')

mkdirSync(dirname(outPath), { recursive: true })

const varCount = lines.filter(l => l.trim().startsWith('--')).length
const output = `/* ============================================================
 * AUTO-GENERATED — DO NOT EDIT
 * Source:      Toast_tokens/  →  scripts/build-tokens.ts
 * Regenerate:  npm run tokens
 * ============================================================ */

@theme {
${lines.join('\n')}
}
`

writeFileSync(outPath, output, 'utf8')
console.log(`✓  tokens.generated.css written — ${varCount} variables`)
