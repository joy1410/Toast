// src/styles/index.ts — Barrel export for all design tokens
//
// Import from here in application code:
//   import { semanticColors, radiiAliases, shadows } from '@/styles'
//
// Import from here in tailwind.config.ts for zero-hardcode config.

export {
  palette,
  orange, blue, yellow,
  gray, coolGray, opacityBlack, opacityWhite,
  grass, sky, lavender, orchid, terraCotta, quinceYellow,
  dataOrange, dataYellow, dataTeal, dataSky,
  dataLavender, dataOrchid, dataMagenta,
} from './palette'
export type { PaletteHue } from './palette'

export {
  aliasColors,
  textColors,
  borderColors,
  backgroundColors,
  iconColors,
  surfaceColors,
  dataColors,
  shadowColors,
  darkSemanticColors,
  semanticColors,
} from './colors'
export type { ColorToken } from './colors'

export {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} from './typography'

export { spacing } from './spacing'
export type { SpacingToken } from './spacing'

export { radii, radiiAliases, borderWidth } from './radii'
export type { RadiiToken, BorderWidthToken } from './radii'

export { shadows, shadowBlur, shadowSpread, shadowPositioning } from './shadows'
export type { ShadowToken, ShadowBlurToken, ShadowSpreadToken, ShadowPositioningToken } from './shadows'

export { duration, easing } from './motion'
export type { DurationToken, EasingToken } from './motion'

export { breakpoints, contentWidths } from './breakpoints'
export type { BreakpointToken, ContentWidthToken } from './breakpoints'

export { opacity } from './opacity'
export type { OpacityToken } from './opacity'

export { zIndex } from './zIndex'
export type { ZIndexToken } from './zIndex'
