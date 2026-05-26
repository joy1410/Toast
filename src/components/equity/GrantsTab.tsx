'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GRANTS, Grant, VestingEvent, buildVestingSchedule, TODAY, fmtMoney } from './equityData'

interface Props {
  sharePrice: number
}

function fmtDateGranted(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtDateBar(d: Date): string {
  const day = d.getDate()
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  const year = d.getFullYear()
  return `${day} ${month}, ${year}`
}

interface GrantCardProps {
  grant: Grant
  vestedShares: number
  unvestedShares: number
  vestedValue: number
  unvestedValue: number
  vestedCount: number
  firstVestDate: Date | undefined
  fullyVestsDate: Date | undefined
  nextVest: VestingEvent | undefined
  sharePrice: number
  index: number
}

function GrantCard({
  grant, vestedShares, unvestedShares, vestedValue, unvestedValue,
  vestedCount, firstVestDate, fullyVestsDate, nextVest, sharePrice, index,
}: GrantCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tipW, setTipW] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const ro = new ResizeObserver(e => setBarWidth(e[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const TOTAL = 16
  const segPx    = barWidth / TOTAL
  const anchorPx = segPx * vestedCount + segPx / 2
  const boxLeft  = Math.min(Math.max(anchorPx - tipW / 2, 0), Math.max(barWidth - tipW, 0))
  const triLeft  = anchorPx - boxLeft

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 0.03, 0.26, 1], delay: index * 0.07 }}
      className="font-ui bg-background border border-border rounded-xl px-5 py-6 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          {/* headline-7 = 18px / 20px lh per typography.ts */}
          <span className="text-lg font-medium text-ink leading-5">{grant.label}</span>
          <span className="bg-surface-muted border border-border rounded-full px-3 py-0.5 text-xs font-semibold text-ink uppercase tracking-overline whitespace-nowrap">
            {grant.totalShares.toLocaleString()} shares
          </span>
        </div>
        <span className="text-sm text-secondary leading-5 whitespace-nowrap">
          Granted on {fmtDateGranted(grant.grantedDate)} · Vests over 4 years
        </span>
      </div>

      {/* Vested / Unvested grid — col widths are content-driven, inline grid-template required */}
      <div className="grid text-sm" style={{ gridTemplateColumns: 'auto 1fr', columnGap: 16, rowGap: 6 }}>
        <span className="text-ink leading-5">Vested</span>
        <span className="leading-5">
          <span className="font-semibold text-ink">{fmtMoney(Math.round(vestedValue))}</span>
          <span className="text-ink"> · </span>
          <span className="text-secondary">{vestedShares.toLocaleString()} shares</span>
        </span>
        <span className="text-ink leading-5">Unvested</span>
        <span className="leading-5">
          <span className="font-semibold text-ink">{fmtMoney(Math.round(unvestedValue))}</span>
          <span className="text-ink"> · </span>
          <span className="text-secondary">{unvestedShares.toLocaleString()} shares</span>
        </span>
      </div>

      {/* Progress bar + date labels + tooltip — hover on this whole section triggers tooltip */}
      <div
        className="flex flex-col gap-2"
        onMouseEnter={() => nextVest && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Date labels row — year markers sit between first/last labels */}
        <div className="relative flex justify-between">
          <div className="text-sm text-secondary leading-5">
            <div>First vesting</div>
            {firstVestDate && <div>{fmtDateBar(firstVestDate)}</div>}
          </div>
          {firstVestDate && [4, 8, 12].map((qi, idx) => (
            <span
              key={qi}
              className="absolute text-xs text-secondary text-center"
              style={{ left: `${(qi / TOTAL) * 100}%`, transform: 'translateX(-50%)', bottom: 0 }}
            >
              {['1st year', '2nd year', '3rd year'][idx]}
            </span>
          ))}
          <div className="text-sm text-secondary leading-5 text-right">
            <div>Fully vests</div>
            {fullyVestsDate && <div>{fmtDateBar(fullyVestsDate)}</div>}
          </div>
        </div>

        <div className="relative" ref={barRef}>
          {/* All 16 gray segments — instant, always visible */}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL }, (_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--color-surface-base)' }} />
            ))}
          </div>

          {/* Colored layer — same layout, clip-path sweeps left→right as one unit */}
          <motion.div
            className="absolute inset-0 flex gap-1.5 pointer-events-none"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: `inset(0 ${Math.max(0, (1 - vestedCount / TOTAL) * 100)}% 0 0)` }}
            transition={{ duration: 0.65, ease: [0.22, 0.03, 0.26, 1], delay: index * 0.08 }}
          >
            {Array.from({ length: TOTAL }, (_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: grant.color }} />
            ))}
          </motion.div>

          {/* Tooltip — box clamped to bar bounds; triangle tracks the true anchor */}
          {showTooltip && nextVest && barWidth > 0 && (
            <motion.div
              ref={(el) => { if (el) setTipW(el.offsetWidth) }}
              className="absolute pointer-events-none z-10 rounded-md px-3 py-2 text-xs text-background"
              style={{
                bottom: 'calc(100% + 10px)',
                left: boxLeft,
                width: 'max-content',
                background: 'var(--color-tooltip)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <div className="font-semibold text-label-sm whitespace-nowrap">
                Next vest on {fmtDateGranted(nextVest.date)}
              </div>
              <div className="mt-0.5 whitespace-nowrap" style={{ color: 'var(--color-tooltip-muted)' }}>
                {nextVest.shares} shares · Est. value {fmtMoney(Math.round(nextVest.shares * sharePrice))}
              </div>
              {/* Triangle offset to always point at the anchor segment center */}
              <div
                className="absolute top-full w-0 h-0"
                style={{
                  left: triLeft,
                  transform: 'translateX(-50%)',
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '5px solid var(--color-tooltip)',
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function GrantsTab({ sharePrice }: Props) {
  const allEvents = buildVestingSchedule()

  return (
    <div className="flex flex-col gap-6">
      {GRANTS.map((grant, index) => {
        const grantEvents = allEvents.filter(e => e.grantId === grant.id)
        const vestedEvents = grantEvents.filter(e => e.date <= TODAY)
        const unvestedEvents = grantEvents.filter(e => e.date > TODAY)
        const vestedShares = vestedEvents.reduce((s, e) => s + e.shares, 0)
        const unvestedShares = unvestedEvents.reduce((s, e) => s + e.shares, 0)

        return (
          <GrantCard
            key={grant.id}
            grant={grant}
            vestedShares={vestedShares}
            unvestedShares={unvestedShares}
            vestedValue={vestedShares * sharePrice}
            unvestedValue={unvestedShares * sharePrice}
            vestedCount={vestedEvents.length}
            firstVestDate={grantEvents[0]?.date}
            fullyVestsDate={grantEvents[grantEvents.length - 1]?.date}
            nextVest={grantEvents.find(e => e.date > TODAY)}
            sharePrice={sharePrice}
            index={index}
          />
        )
      })}
    </div>
  )
}
