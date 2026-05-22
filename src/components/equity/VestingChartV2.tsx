'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scaleLinear } from '@visx/scale'
import { GRANTS, QuarterBar, fmtMoney, TODAY } from './equityData'

const CHART_H    = 180
const CHART_PAD  = 24   // top padding above bars (room for TODAY chip)
const LABEL_W    = 48
const BAR_MAX_W  = 96
const EASE: [number, number, number, number] = [0.22, 0.03, 0.26, 1]

type PeriodMode = 'next12' | 'calYear26' | 'allFuture'

interface Props {
  bars: QuarterBar[]
  sharePrice: number
  mode: 'shares' | 'value'
  highlightGrantId: string | null
  periodMode: PeriodMode
  onBarClick?: (quarter: string) => void
}

// Diagonal stripe CSS for vested segments (matches SVG hatch pattern)
function hatchBg(color: string): string {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `repeating-linear-gradient(
    -45deg,
    rgba(${r},${g},${b},0.25) 0px, rgba(${r},${g},${b},0.25) 2.5px,
    rgba(${r},${g},${b},1)    2.5px, rgba(${r},${g},${b},1)    5px
  )`
}

function getQuarterStatus(label: string): 'past' | 'current' | 'future' {
  const m = label.match(/Q(\d)'(\d{2})/)
  if (!m) return 'future'
  const q  = parseInt(m[1])
  const yr = 2000 + parseInt(m[2])
  const qStart = new Date(yr, (q - 1) * 3, 1)
  const qEnd   = new Date(yr, q * 3, 0)
  if (TODAY > qEnd)    return 'past'
  if (TODAY >= qStart) return 'current'
  return 'future'
}

function fmtTick(v: number, mode: 'shares' | 'value'): string {
  if (v === 0) return '0'
  if (mode === 'shares') return v >= 1000 ? `${+(v / 1000).toFixed(1)}K` : `${v}`
  return v >= 1000 ? `$${+(v / 1000).toFixed(0)}K` : `$${v}`
}

export function VestingChartV2({ bars, sharePrice, mode, highlightGrantId, periodMode, onBarClick }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(800)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(e => setContainerW(e[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Y scale — visx handles nice max + ticks
  const barTotals = bars.map(b =>
    b.segments.reduce((s, seg) => s + (mode === 'shares' ? seg.shares : seg.value), 0)
  )
  const yScale = scaleLinear({ domain: [0, Math.max(...barTotals, 1)], range: [CHART_H, 0] }).nice(4)
  const yTicks = yScale.ticks(4) as number[]

  // X layout — simple arithmetic (flex-1 handles actual widths)
  const slotW  = containerW > LABEL_W ? (containerW - LABEL_W) / Math.max(bars.length, 1) : 100
  const barW   = Math.min(BAR_MAX_W, Math.floor(slotW * 0.55))
  const barOff = Math.floor((slotW - barW) / 2)

  const todayBarIdx = periodMode === 'calYear26'
    ? bars.findIndex(b => getQuarterStatus(b.label) === 'current')
    : -1

  const chartKey = `${periodMode}-${mode}-${bars.length}`
  const totalH   = CHART_PAD + CHART_H + 28

  return (
    <div ref={containerRef} className="w-full relative z-0" style={{ height: totalH }}>

      {/* ── Y-axis labels ───────────────────────────────────────────────────── */}
      {yTicks.map(tick => {
        const top = CHART_PAD + (yScale(tick) as number)
        return (
          <span
            key={tick}
            className="absolute font-ui select-none"
            style={{
              top,
              left: 0,
              width: LABEL_W - 6,
              textAlign: 'right',
              fontSize: 12,
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-source-sans, sans-serif)',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            {fmtTick(tick, mode)}
          </span>
        )
      })}

      {/* ── Grid lines ──────────────────────────────────────────────────────── */}
      {yTicks.map(tick => {
        const top = CHART_PAD + (yScale(tick) as number) - (tick === 0 ? 1 : 0)
        return (
          <div
            key={tick}
            className="absolute pointer-events-none"
            style={{
              top,
              left: LABEL_W,
              right: 0,
              height: 1,
              background: tick === 0 ? 'var(--color-border-mid)' : 'var(--color-border-grid)',
            }}
          />
        )
      })}

      {/* ── Bars + labels (animated as a unit) ──────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chartKey}
          className="absolute"
          style={{ top: CHART_PAD, left: LABEL_W, right: 0, height: CHART_H + 28 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          {/* Bar columns */}
          <div className="flex" style={{ height: CHART_H }}>
            {bars.map((bar, bi) => (
              <div
                key={bar.label}
                className="flex-1 flex flex-col justify-end items-center cursor-pointer"
                onMouseEnter={() => setHoverIdx(bi)}
                onMouseLeave={() => setHoverIdx(null)}
                onClick={() => onBarClick?.(bar.label)}
              >
                {/* Segments — flex-col-reverse so index-0 is at bottom */}
                <motion.div
                  style={{
                    width: barW,
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    gap: 2,
                    transformOrigin: 'bottom center',
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: bi * 0.025, ease: EASE }}
                >
                  {bar.segments.map((seg, si) => {
                    const grant   = GRANTS.find(g => g.id === seg.grantId)!
                    const segVal  = mode === 'shares' ? seg.shares : seg.value
                    const h       = Math.max(2, CHART_H - (yScale(segVal) as number))
                    const useHatch = periodMode === 'calYear26' && seg.isVested
                    const opacity = highlightGrantId !== null && highlightGrantId !== seg.grantId ? 0.18 : 1
                    const isBottom = si === 0
                    return (
                      <motion.div
                        key={seg.grantId}
                        animate={{ opacity }}
                        transition={{ duration: 0.22 }}
                        style={{
                          width: barW,
                          height: h,
                          borderRadius: isBottom ? '3px 3px 0 0' : 3,
                          background: useHatch ? hatchBg(grant.color) : grant.color,
                          flexShrink: 0,
                        }}
                      />
                    )
                  })}
                </motion.div>
              </div>
            ))}
          </div>

          {/* TODAY vertical line — inside bars container so it paints over animated segments */}
          {todayBarIdx >= 0 && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: todayBarIdx * slotW + barOff + barW / 2,
                top: 0,
                width: 1.5,
                height: CHART_H,
                background: 'var(--color-ink)',
                transform: 'translateX(-50%)',
              }}
            />
          )}

          {/* TODAY chip — inside bars container, above the line */}
          {todayBarIdx >= 0 && (
            <div
              className="absolute pointer-events-none whitespace-nowrap font-ui bg-ink text-background text-chip font-semibold tracking-chip rounded-full flex items-center leading-none"
              style={{
                left: todayBarIdx * slotW + barOff + barW / 2,
                top: -16,
                transform: 'translateX(-50%)',
                padding: '3px 8px',
              }}
            >
              TODAY
            </div>
          )}

          {/* X-axis labels */}
          <div className="flex" style={{ height: 28 }}>
            {bars.map(bar => (
              <div
                key={bar.label}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 13,
                  lineHeight: '28px',
                  color: 'var(--color-muted)',
                  fontFamily: 'var(--font-source-sans, sans-serif)',
                }}
              >
                {bar.label}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Hover tooltip ───────────────────────────────────────────────────── */}
      {hoverIdx !== null && bars[hoverIdx] && (() => {
        const bar         = bars[hoverIdx]
        const visibleSegs = bar.segments.filter(s =>
          highlightGrantId === null || s.grantId === highlightGrantId
        )
        const totalShares = visibleSegs.reduce((s, seg) => s + seg.shares, 0)
        const totalValue  = visibleSegs.reduce((s, seg) => s + seg.value, 0)
        const barX        = LABEL_W + hoverIdx * slotW + barOff
        const tipW        = 240
        const left        = barX + barW + 8 + tipW > containerW ? barX - tipW - 8 : barX + barW + 8
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.12 }}
            className="absolute pointer-events-none z-10 rounded font-ui text-background"
            style={{
              top: CHART_PAD,
              left,
              width: tipW,
              background: 'var(--color-tooltip-chart)',
              fontSize: 12,
              padding: '10px 12px',
            }}
          >
            <div className="flex justify-between gap-3 mb-2 text-label-sm font-semibold">
              <span>{totalShares.toLocaleString()} shares</span>
              <span>{fmtMoney(totalValue)}</span>
            </div>
            {visibleSegs.map(seg => {
              const grant = GRANTS.find(g => g.id === seg.grantId)!
              return (
                <div
                  key={seg.grantId}
                  className="grid gap-x-1.5 gap-y-0.5 items-center mb-0.5"
                  style={{ gridTemplateColumns: '12px 1fr auto auto' }}
                >
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: grant.color }} />
                  <span className="text-caption-sm">{grant.label}</span>
                  <span className="text-caption-sm" style={{ color: 'var(--color-tooltip-muted)' }}>
                    {seg.shares} shares
                  </span>
                  <span className="font-semibold text-caption-sm">{fmtMoney(seg.value)}</span>
                </div>
              )
            })}
          </motion.div>
        )
      })()}
    </div>
  )
}
