// Figma Foundations — Semantic Color Tokens
// Source: Figma "Color Tokens" table, Restaurant Web mode
// Last updated: 2026-05-15
//
// HOW TO UPDATE:
//   1. Get updated screenshots of the Figma semantic/global token table.
//   2. Diff values against palette.ts entries — update mappings here only.
//   3. Never use raw hex values unless the Figma token has no palette entry
//      (marked with "// Figma raw value").
//
// Structure mirrors Figma exactly:
//   aliasColors      → alias/* intermediate tokens (brand, action, error, warning, success, info)
//   textColors       → color-text-*
//   borderColors     → color-border-*
//   backgroundColors → color-bg-*
//   iconColors       → color-icon-*
//   surfaceColors    → color-surface-*
//   dataColors       → color-data-*
//   shadowColors     → color-shadow-*
//   darkSemanticColors → dark-mode overrides (TODO: verify)

import {
  orange, blue,
  gray, coolGray, opacityBlack, opacityWhite,
  grass, sky, orchid, terraCotta, quinceYellow,
  dataOrange, dataYellow, dataTeal, dataSky,
  dataLavender, dataOrchid, dataMagenta,
} from './palette'

// — alias/* ————————————————————————————————————————————————————————————————————
// Intermediate tokens referenced by semantic groups below.
// Figma path: alias/brand-*, alias/action-*, alias/error-*, etc.
export const aliasColors = {
  // brand → color/primary/orange
  'brand-0':   orange['0'],
  'brand-25':  orange['25'],
  'brand-50':  orange['50'],
  'brand-75':  orange['75'],
  'brand-100': orange['100'],

  // action → color/primary/blue
  'action-0':   blue['0'],
  'action-25':  blue['25'],
  'action-50':  blue['50'],
  'action-75':  blue['75'],
  'action-100': blue['100'],

  // error → color/secondary/terra-cotta (0/25) + Figma raw (50/75/100)
  'error-0':   terraCotta['0'],
  'error-25':  terraCotta['25'],
  'error-50':  '#EE6868', // Figma raw value — no palette entry
  'error-75':  '#D40023', // Figma raw value — no palette entry
  'error-100': '#B4001E', // Figma raw value — no palette entry

  // warning → color/secondary/quince-yellow (0/25/50/75) + Figma raw (100)
  'warning-0':   quinceYellow['0'],
  'warning-25':  quinceYellow['25'],
  'warning-50':  quinceYellow['50'],
  'warning-75':  quinceYellow['75'],
  'warning-100': '#C54300', // Figma raw value — no palette entry

  // success → color/secondary/grass (0/25/50/75) + Figma raw (100)
  'success-0':   grass['0'],
  'success-25':  grass['25'],
  'success-50':  grass['50'],
  'success-75':  grass['75'],
  'success-100': '#006400', // Figma raw value — no palette entry

  // info → color/secondary/sky (0/25/50/75) + blue-100 (100)
  'info-0':   sky['0'],
  'info-25':  sky['25'],
  'info-50':  sky['50'],
  'info-75':  sky['75'],
  'info-100': blue['100'],
} as const

// — color-text-* ——————————————————————————————————————————————————————————————
export const textColors = {
  'color-text-default':              gray['125'],
  'color-text-default-inverse':      gray.white,
  'color-text-secondary':            gray['100'],
  'color-text-secondary-inverse':    opacityWhite['80'],
  'color-text-hint':                 gray['75'],
  'color-text-light':                gray.white,
  'color-text-dark':                 gray['125'],
  'color-text-action':               blue['75'],         // alias/action-75
  'color-text-action-highlight':     blue['100'],        // alias/action-100
  'color-text-link':                 blue['75'],         // alias/action-75
  'color-text-link-highlight':       blue['100'],        // alias/action-100
  'color-text-link-visited':         orchid['75'],
  'color-text-action-destructive':   '#D40023',          // alias/error-75
  'color-text-default-disabled':     gray['50'],
  'color-text-error':                '#D40023',          // alias/error-75
  'color-text-success':              '#006400',          // alias/success-100
} as const

// — color-border-* ————————————————————————————————————————————————————————————
export const borderColors = {
  'color-border-default':            opacityBlack['12'],
  'color-border-default-highlight':  opacityBlack['56'],
  'color-border-subtle':             opacityBlack['8'],
  'color-border-bold':               gray['50'],
  'color-border-action':             blue['75'],          // alias/action-75
  'color-border-action-highlight':   blue['100'],         // alias/action-100
  'color-border-focus':              sky['50'],
  'color-border-focus-inverse':      opacityWhite['60'],
  'color-border-error':              '#D40023',           // alias/error-75
  'color-border-error-highlight':    '#B4001E',           // alias/error-100
  'color-border-error-subtle':       terraCotta['25'],    // alias/error-25
  'color-border-warning-subtle':     quinceYellow['50'],  // alias/warning-50
  'color-border-success-subtle':     grass['25'],         // alias/success-25
  'color-border-info-subtle':        sky['25'],           // alias/info-25
  'color-border-brand':              orange['50'],        // alias/brand-50
} as const

// — color-bg-* ————————————————————————————————————————————————————————————————
export const backgroundColors = {
  'color-bg-default':                         gray.white,
  'color-bg-default-highlight':               opacityBlack['4'],
  'color-bg-default-highlight-inverse':       opacityWhite['20'],
  'color-bg-action':                          blue['75'],         // alias/action-75
  'color-bg-action-subtle':                   blue['0'],          // alias/action-0
  'color-bg-action-processing':               blue['75'],         // alias/action-75
  'color-bg-action-highlight':                blue['100'],        // alias/action-100
  'color-bg-action-destructive':              '#D40023',          // alias/error-75
  'color-bg-action-destructive-highlight':    '#B4001E',          // alias/error-100
  'color-bg-action-disabled':                 opacityBlack['8'],
  'color-bg-error-subtle':                    terraCotta['0'],    // alias/error-0
  'color-bg-error':                           '#EE6868',          // alias/error-50
  'color-bg-error-bold':                      '#B4001E',          // alias/error-100
  'color-bg-warning-subtle':                  quinceYellow['0'],  // alias/warning-0
  'color-bg-warning':                         quinceYellow['25'], // alias/warning-25
  'color-bg-success-subtle':                  grass['0'],         // alias/success-0
  'color-bg-success':                         grass['25'],        // alias/success-25
  'color-bg-success-bold':                    '#006400',          // alias/success-100
  'color-bg-info-subtle':                     sky['0'],           // alias/info-0
  'color-bg-info':                            sky['25'],          // alias/info-25
  'color-bg-neutral-subtle':                  opacityBlack['8'],
  'color-bg-neutral-bold':                    gray['110'],
  'color-bg-overlay':                         opacityBlack['56'],
} as const

// — color-icon-* ——————————————————————————————————————————————————————————————
export const iconColors = {
  'color-icon-default':              gray['100'],
  'color-icon-default-inverse':      gray.white,
  'color-icon-default-highlight':    gray['125'],
  'color-icon-secondary':            gray['100'],
  'color-icon-secondary-inverse':    gray.white,
  'color-icon-action':               blue['75'],         // alias/action-75
  'color-icon-action-highlight':     blue['100'],        // alias/action-100
  'color-icon-action-destructive':   '#D40023',          // alias/error-75
  'color-icon-default-disabled':     gray['50'],
  'color-icon-error':                '#D40023',          // alias/error-75
  'color-icon-warning':              quinceYellow['75'], // alias/warning-75
  'color-icon-success':              '#006400',          // alias/success-100
  'color-icon-info':                 sky['75'],          // alias/info-75
} as const

// — color-surface-* ———————————————————————————————————————————————————————————
export const surfaceColors = {
  'color-surface-dim':                '#F0F0F2', // Figma raw value — no palette entry
  'color-surface-base':               '#F0F0F2', // Figma raw value — no palette entry
  'color-surface-bright':             '#F0F0F2', // Figma raw value — no palette entry
  'color-surface-container-lowest':   gray.white,
  'color-surface-container-low':      gray.white,
  'color-surface-container':          gray.white,
  'color-surface-container-high':     gray.white,
  'color-surface-container-highest':  gray.white,
} as const

// — color-data-* ——————————————————————————————————————————————————————————————
export const dataColors = {
  'color-data-categorical-1':  dataOrange['60'],
  'color-data-categorical-2':  dataOrange['20'],
  'color-data-categorical-3':  dataLavender['80'],
  'color-data-categorical-4':  dataSky['40'],
  'color-data-categorical-5':  dataMagenta['60'],
  'color-data-categorical-6':  dataYellow['40'],
  'color-data-categorical-7':  dataOrchid['40'],
  'color-data-categorical-8':  dataSky['80'],
  'color-data-categorical-9':  dataTeal['40'],
  'color-data-categorical-10': dataOrchid['80'],
  'color-data-comparison':     gray['30'],
} as const

// — color-shadow-* ————————————————————————————————————————————————————————————
// These are the color values used as shadow colors in CSS box-shadow declarations.
// The composed box-shadow strings live in shadows.ts.
export const shadowColors = {
  'color-shadow-subtle': opacityBlack['4'],
  'color-shadow':        opacityBlack['6'],
  'color-shadow-bold':   opacityBlack['8'],
} as const

// — Dark Mode Semantic Overrides ——————————————————————————————————————————————
// Activated via the `dark` CSS class on <html> (darkMode: 'class' in tailwind.config.ts)
// TODO: verify dark-mode token values from Figma global token table (KDS / dark mode columns)
export const darkSemanticColors = {
  'color-surface-dim':      coolGray['90'],
  'color-surface-base':     coolGray['80'],
  'color-surface-bright':   coolGray['70'],
  'color-bg-default':       coolGray['80'],
  'color-bg-overlay':       opacityBlack['56'],
  'color-text-default':     gray.white,
  'color-text-secondary':   gray['25'],
  'color-text-hint':        gray['50'],
  'color-border-default':   opacityWhite['20'],
  'color-border-subtle':    opacityWhite['8'],
} as const

// — Merged flat export for Tailwind config ————————————————————————————————————
export const semanticColors = {
  ...aliasColors,
  ...textColors,
  ...borderColors,
  ...backgroundColors,
  ...iconColors,
  ...surfaceColors,
  ...dataColors,
  ...shadowColors,
} as const

export type ColorToken = typeof semanticColors
