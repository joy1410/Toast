// Figma Foundations — Raw Color Palette
// Source: Figma variable collection ".Core"
// Last updated: 2026-05-14
//
// HOW TO UPDATE:
//   1. Export updated screenshots of each color group from the Figma variable panel.
//   2. Diff hex values against this file and update only changed entries.
//   3. Never edit colors in tailwind.config.ts directly — edit here only.
//
// RULE: Only colors.ts may import from here. Components import from colors.ts.

// — color/primary/orange ————————————————————————————————————————————————————
export const orange = {
  '0':         '#FCE8E5',
  '25':        '#FFA788',
  '50':        '#FF4C00',
  '75':        '#DB3B11',
  '100':       '#C12700',
  'dark-0':    '#8F4A29',
  'dark-25':   '#B8501E',
  'dark-50':   '#D35D26',
  'dark-75':   '#DE794B',
  'dark-100':  '#EAAD94',
} as const

// — color/primary/blue ——————————————————————————————————————————————————————
export const blue = {
  '0':         '#E7EAF6',
  '25':        '#9AA6DB',
  '50':        '#5069C3',
  '75':        '#2B4FB9',
  '100':       '#002182',
  'dark-0':    '#192964',
  'dark-25':   '#2F4483',
  'dark-50':   '#3E5598',
  'dark-75':   '#7887B5',
  'dark-100':  '#9DA9CA',
} as const

// — color/primary/yellow ————————————————————————————————————————————————————
export const yellow = {
  '0':   '#FEEDB4',
  '25':  '#FED850',
  '50':  '#FFB700',
  '75':  '#FF9300',
  '100': '#F76600',
} as const

// — color/neutral/gray ——————————————————————————————————————————————————————
export const gray = {
  white:  '#FFFFFF',
  '0':    '#F7F7F7',
  '25':   '#F0F0F0',
  '30':   '#E5E5E5',
  '50':   '#C0C0C0',
  '75':   '#7A7A7A',
  '100':  '#666666',
  '110':  '#474747',
  '125':  '#252525',
  black:  '#000000',
} as const

// — color/neutral/cool-gray ————————————————————————————————————————————————
export const coolGray = {
  '0':  '#676B76',
  '10': '#60636E',
  '20': '#4D505C',
  '30': '#484C57',
  '40': '#41444F',
  '50': '#32353F',
  '60': '#262A34',
  '70': '#1E222C',
  '80': '#181B23',
  '90': '#131419',
} as const

// — color/neutral/opacity-black (rgba(0,0,0,α)) ————————————————————————————
export const opacityBlack = {
  '0':  'rgba(0,0,0,0)',
  '4':  'rgba(0,0,0,0.04)',
  '6':  'rgba(0,0,0,0.06)',
  '8':  'rgba(0,0,0,0.08)',
  '12': 'rgba(0,0,0,0.12)',
  '16': 'rgba(0,0,0,0.16)',
  '20': 'rgba(0,0,0,0.20)',
  '30': 'rgba(0,0,0,0.30)',
  '50': 'rgba(0,0,0,0.50)',
  '56': 'rgba(0,0,0,0.56)',
  '80': 'rgba(0,0,0,0.80)',
} as const

// — color/neutral/opacity-white (rgba(255,255,255,α)) ——————————————————————
export const opacityWhite = {
  '0':  'rgba(255,255,255,0)',
  '4':  'rgba(255,255,255,0.04)',
  '6':  'rgba(255,255,255,0.06)',
  '8':  'rgba(255,255,255,0.08)',
  '12': 'rgba(255,255,255,0.12)',
  '16': 'rgba(255,255,255,0.16)',
  '20': 'rgba(255,255,255,0.20)',
  '30': 'rgba(255,255,255,0.30)',
  '60': 'rgba(255,255,255,0.60)',
  '80': 'rgba(255,255,255,0.80)',
} as const

// — color/secondary/grass ——————————————————————————————————————————————————
export const grass = {
  '0':        '#E8F7D4',
  '25':       '#AFE26C',
  '50':       '#71B314',
  '75':       '#227800',
  'dark-0':   '#113A00',
  'dark-25':  '#37570A',
  'dark-50':  '#556E34',
  'dark-75':  '#657552',
} as const

// — color/secondary/sky ————————————————————————————————————————————————————
export const sky = {
  '0':        '#E3F0FB',
  '25':       '#9FC5F8',
  '50':       '#558EDD',
  '75':       '#3D4089',
  'dark-0':   '#213554',
  'dark-25':  '#2A456B',
  'dark-50':  '#4D6074',
  'dark-75':  '#637486',
} as const

// — color/secondary/lavender ———————————————————————————————————————————————
export const lavender = {
  '0':        '#F2E7FA',
  '25':       '#DAB2F7',
  '50':       '#B26EE2',
  '75':       '#4A25A7',
  'dark-0':   '#25174F',
  'dark-25':  '#402960',
  'dark-50':  '#5E4776',
  'dark-75':  '#786B8A',
} as const

// — color/secondary/orchid ————————————————————————————————————————————————
export const orchid = {
  '0':        '#F0E4F7',
  '25':       '#F4B1EF',
  '50':       '#DD55D2',
  '75':       '#7903A4',
  'dark-0':   '#491254',
  'dark-25':  '#60295C',
  'dark-50':  '#743E70',
  'dark-75':  '#8D6286',
} as const

// — color/secondary/terra-cotta ————————————————————————————————————————————
export const terraCotta = {
  '0':        '#FFE6E9',
  '25':       '#EFA49F',
  '50':       '#EB5F4C',
  '75':       '#B12010',
  'dark-0':   '#521914',
  'dark-25':  '#722E25',
  'dark-50':  '#74504D',
  'dark-75':  '#7E635D',
} as const

// — color/secondary/quince-yellow —————————————————————————————————————————
export const quinceYellow = {
  '0':        '#FEF6D9',
  '25':       '#FED850',
  '50':       '#FFA400',
  '75':       '#FF6A00',
  'dark-0':   '#633D09',
  'dark-25':  '#7C5009',
  'dark-50':  '#7B5F27',
  'dark-75':  '#7E6B44',
} as const

// — color/data viz/data-brand (data-orange) ————————————————————————————————
export const dataOrange = {
  '0':        '#FFE4D4',
  '20':       '#FFB094',
  '40':       '#FF8154',
  '60':       '#FF4C00',
  '80':       '#C22700',
  '100':      '#821A00',
  'dark-0':   '#AE2F04',
  'dark-20':  '#DA3F0B',
  'dark-40':  '#FF5C33',
  'dark-60':  '#FF704D',
  'dark-80':  '#FFB299',
  'dark-100': '#FFD9CC',
} as const

// — color/data viz/data-yellow —————————————————————————————————————————————
export const dataYellow = {
  '0':        '#FEEDB4',
  '20':       '#FFD875',
  '40':       '#FFB700',
  '60':       '#E98C00',
  '80':       '#AC5D00',
  '100':      '#7B3B00',
  'dark-0':   '#7B3B00',
  'dark-20':  '#AC5D00',
  'dark-40':  '#E98C00',
  'dark-60':  '#FFB700',
  'dark-80':  '#FFD875',
  'dark-100': '#FEEDB4',
} as const

// — color/data viz/data-teal ———————————————————————————————————————————————
export const dataTeal = {
  '0':        '#C7F2EF',
  '20':       '#8CD7D7',
  '40':       '#45BABA',
  '60':       '#219198',
  '80':       '#146570',
  '100':      '#08474F',
  'dark-0':   '#08474F',
  'dark-20':  '#146570',
  'dark-40':  '#219198',
  'dark-60':  '#45BABA',
  'dark-80':  '#8CD7D7',
  'dark-100': '#C7F2EF',
} as const

// — color/data viz/data-sky ————————————————————————————————————————————————
export const dataSky = {
  '0':        '#D0EAFF',
  '20':       '#95CAFF',
  '40':       '#5DA3EA',
  '60':       '#367EC7',
  '80':       '#265797',
  '100':      '#123869',
  'dark-0':   '#004C99',
  'dark-20':  '#0565C7',
  'dark-40':  '#007FFD',
  'dark-60':  '#4DA5FF',
  'dark-80':  '#8AC4FF',
  'dark-100': '#B2D8FF',
} as const

// — color/data viz/data-lavender ———————————————————————————————————————————
export const dataLavender = {
  '0':        '#ECDDFF',
  '20':       '#D0BCFA',
  '40':       '#AB88EB',
  '60':       '#8065C8',
  '80':       '#6543A8',
  '100':      '#3E1A79',
  'dark-0':   '#3E1A79',
  'dark-20':  '#6543A8',
  'dark-40':  '#8065C8',
  'dark-60':  '#AB88EB',
  'dark-80':  '#D0BCFA',
  'dark-100': '#ECDDFF',
} as const

// — color/data viz/data-orchid ————————————————————————————————————————————
export const dataOrchid = {
  '0':        '#FAD9F7',
  '20':       '#EEA5EF',
  '40':       '#D46CD4',
  '60':       '#A8459A',
  '80':       '#722B6B',
  '100':      '#4D1247',
  'dark-0':   '#4D1247',
  'dark-20':  '#722B6B',
  'dark-40':  '#A8459A',
  'dark-60':  '#D46CD4',
  'dark-80':  '#EEA5EF',
  'dark-100': '#FAD9F7',
} as const

// — color/data viz/data-magenta ————————————————————————————————————————————
export const dataMagenta = {
  '0':        '#FFDAE8',
  '20':       '#FFA8C8',
  '40':       '#E76896',
  '60':       '#BA2F64',
  '80':       '#85043A',
  '100':      '#5B0027',
  'dark-0':   '#5B0027',
  'dark-20':  '#85043A',
  'dark-40':  '#BA2F64',
  'dark-60':  '#E76896',
  'dark-80':  '#FFA8C8',
  'dark-100': '#FFDAE8',
} as const

// — Composite palette object (for Tailwind config and colors.ts) ————————————
export const palette = {
  // primary
  orange,
  blue,
  yellow,
  // neutral
  gray,
  coolGray,
  opacityBlack,
  opacityWhite,
  // secondary
  grass,
  sky,
  lavender,
  orchid,
  terraCotta,
  quinceYellow,
  // data viz
  dataOrange,
  dataYellow,
  dataTeal,
  dataSky,
  dataLavender,
  dataOrchid,
  dataMagenta,
} as const

export type PaletteHue = keyof typeof palette
