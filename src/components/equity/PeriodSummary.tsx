'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { fmtMoney, type PeriodMode, type DisplayMode } from './equityData'
import { Chip } from './ui/Chip'

interface Props {
  periodMode: PeriodMode
  displayMode: DisplayMode
  vestedShares: number
  vestedValue: number
  unvestedShares: number
  unvestedValue: number
}

export function PeriodSummary({ periodMode, displayMode, vestedShares, vestedValue, unvestedShares, unvestedValue }: Props) {
  const sharesFirst = displayMode === 'shares'

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <AnimatePresence mode="popLayout">
        {periodMode === 'calYear26' && (
          <motion.div
            key="vested-summary"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: [0.22, 0.03, 0.26, 1] }}
            className="flex items-center gap-2"
          >
            {/* Striped SVG swatch — hatch pattern */}
            <svg width="16" height="16" className="shrink-0">
              <defs>
                <pattern id="sum-stripe" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="6" height="6" fill="var(--color-surface-neutral)" fillOpacity={0.25} />
                  <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-surface-neutral)" strokeWidth="3.5" />
                </pattern>
              </defs>
              <rect width="16" height="16" rx="3" fill="url(#sum-stripe)" />
            </svg>
            <span className="text-sm text-tertiary">Vested</span>
            <span className="text-value font-semibold text-ink">
              {sharesFirst ? `${vestedShares.toLocaleString()} shares` : fmtMoney(Math.round(vestedValue))}
            </span>
            <Chip>{sharesFirst ? fmtMoney(Math.round(vestedValue)) : `${vestedShares.toLocaleString()} shares`}</Chip>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {periodMode === 'calYear26' && (
          <motion.div
            key="divider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-px h-5 bg-border"
          />
        )}
      </AnimatePresence>

      {/* layout="position" smoothly pushes Unvested right as Vested slides in */}
      <motion.div layout="position" transition={{ duration: 0.25, ease: [0.22, 0.03, 0.26, 1] }} className="flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {periodMode === 'calYear26' && (
            <motion.div
              key="unvested-swatch"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="w-4 h-4 rounded-sm bg-surface-neutral shrink-0"
            />
          )}
        </AnimatePresence>
        <span className="text-sm text-tertiary">Unvested</span>
        <span className="text-value font-semibold text-ink">
          {sharesFirst ? `${unvestedShares.toLocaleString()} shares` : fmtMoney(Math.round(unvestedValue))}
        </span>
        <Chip>{sharesFirst ? fmtMoney(Math.round(unvestedValue)) : `${unvestedShares.toLocaleString()} shares`}</Chip>
      </motion.div>
    </div>
  )
}
