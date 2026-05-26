'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GRANTS, VestingEvent, TODAY, fmtDate, fmtMoney, quarterLabel } from './equityData'

interface Props {
  events: VestingEvent[]
  sharePrice: number
  defaultStart: Date
  defaultEnd: Date
  scrollToQuarter?: string | null
  scrollNonce?: number
}

interface TableRow {
  date: Date
  dateKey: string
  quarter: string
  grantEvents: { grant: typeof GRANTS[0]; event: VestingEvent }[]
  total: { shares: number; value: number }
  isVested: boolean
  isTodayBoundary?: boolean
}

function buildRows(events: VestingEvent[], sharePrice: number, start: Date, end: Date): TableRow[] {
  const dateMap = new Map<string, VestingEvent[]>()
  for (const e of events) {
    const key = e.date.toISOString().split('T')[0]
    if (!dateMap.has(key)) dateMap.set(key, [])
    dateMap.get(key)!.push(e)
  }

  const rows: TableRow[] = []
  for (const [key, evts] of dateMap) {
    const d = evts[0].date
    if (d < start || d > end) continue
    let totalShares = 0
    const grantEvents = evts
      .map(e => ({ grant: GRANTS.find(g => g.id === e.grantId)!, event: e }))
      .filter(x => x.grant)
    grantEvents.forEach(x => { totalShares += x.event.shares })
    rows.push({
      date: d,
      dateKey: key,
      quarter: quarterLabel(d),
      grantEvents,
      total: { shares: totalShares, value: totalShares * sharePrice },
      isVested: d <= TODAY,
    })
  }
  rows.sort((a, b) => a.date.getTime() - b.date.getTime())

  let lastVestedIdx = -1
  rows.forEach((r, i) => { if (r.isVested) lastVestedIdx = i })
  if (lastVestedIdx >= 0 && lastVestedIdx + 1 < rows.length) {
    rows[lastVestedIdx + 1].isTodayBoundary = true
  }

  return rows
}

export function VestingTable({ events, sharePrice, defaultStart, defaultEnd, scrollToQuarter, scrollNonce = 0 }: Props) {
  const [showAll, setShowAll] = useState(false)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [highlightedQuarter, setHighlightedQuarter] = useState<string | null>(null)
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map())
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const allRowsInPeriod = buildRows(events, sharePrice, defaultStart, defaultEnd)
  const allRowsFull     = buildRows(events, sharePrice, defaultStart, new Date(8640000000000000))
  const visibleRows     = showAll ? allRowsFull : allRowsInPeriod

  // Scroll to quarter when chart bar is clicked
  useEffect(() => {
    if (!scrollToQuarter) return
    const inDefault = allRowsInPeriod.some(r => r.quarter === scrollToQuarter)
    if (!inDefault) setShowAll(true)
  }, [scrollToQuarter, scrollNonce])

  useEffect(() => {
    if (!scrollToQuarter) return
    const rows = showAll ? allRowsFull : allRowsInPeriod
    const row = rows.find(r => r.quarter === scrollToQuarter)
    if (!row) return
    requestAnimationFrame(() => {
      const el = rowRefs.current.get(row.dateKey)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Highlight all rows for this quarter then fade out
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
      setHighlightedQuarter(scrollToQuarter)
      highlightTimerRef.current = setTimeout(() => setHighlightedQuarter(null), 1800)
    })
  }, [scrollToQuarter, scrollNonce, showAll])

  function toggleRow(dateKey: string) {
    setExpandedRow(prev => prev === dateKey ? null : dateKey)
  }

  return (
    <div className="w-full font-ui">
      <style>{`
        @keyframes row-highlight-fade {
          0%   { background-color: var(--color-bg-info-subtle); }
          100% { background-color: transparent; }
        }
        .row-highlight {
          animation: row-highlight-fade 1.8s ease-out forwards;
        }
      `}</style>
      <table className="w-full border-collapse text-sm table-fixed">
        <colgroup>
          <col style={{ width: '12%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '34%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '14%' }} />
        </colgroup>

        <thead>
          <tr className="bg-surface-muted border-b border-border">
            <th className="pl-4 pr-2 py-2 text-left font-semibold text-ink">Quarter</th>
            <th className="px-2 py-2 text-left font-semibold text-ink">Vesting date</th>
            <th className="pl-2 pr-5 py-2 text-left font-semibold text-ink">Grants vested</th>
            <th className="px-2 py-2 text-left font-semibold text-ink">Total vesting</th>
            <th className="px-2 py-2 text-left font-semibold text-ink">Status</th>
          </tr>
        </thead>

        <tbody>
          {visibleRows.map((row) => {
            const isExpanded = expandedRow === row.dateKey
            const grantCount = row.grantEvents.length

            return (
              <React.Fragment key={row.dateKey}>
                {/* TODAY boundary */}
                {row.isTodayBoundary && (
                  <tr>
                    <td colSpan={5} className="p-0">
                      <div className="relative h-px bg-ink">
                        <span
                          className="absolute left-4 -top-[9px] bg-ink text-background text-chip font-semibold px-2 rounded-full tracking-chip flex items-center leading-none"
                          style={{ paddingTop: '3px', paddingBottom: '3px' }}
                        >
                          TODAY
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Main row — highlighted when expanded */}
                <tr
                  ref={el => { if (el) rowRefs.current.set(row.dateKey, el) }}
                  className={`border-b border-border-subtle cursor-pointer transition-colors ${isExpanded ? 'bg-surface-muted' : 'hover:bg-surface-muted'} ${highlightedQuarter === row.quarter ? 'row-highlight' : ''}`}
                  onClick={() => toggleRow(row.dateKey)}
                >
                  {/* Quarter */}
                  <td className="pl-4 pr-2 py-2.5 align-middle">
                    <span className={row.isVested ? 'text-secondary' : 'text-ink'}>{row.quarter}</span>
                  </td>

                  {/* Vesting date */}
                  <td className="px-2 py-2.5 align-middle">
                    <span className={`font-semibold ${row.isVested ? 'text-secondary' : 'text-ink'}`}>{fmtDate(row.date)}</span>
                  </td>

                  {/* Grants summary */}
                  <td className="pl-2 pr-5 py-2.5 align-middle">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Color circles — hidden when expanded */}
                        {!isExpanded && (
                          <div className="flex gap-1 shrink-0">
                            {[...row.grantEvents].reverse().map(({ grant }) => (
                              <span
                                key={grant.id}
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ background: grant.color }}
                              />
                            ))}
                          </div>
                        )}
                        <span className="text-ink truncate">
                          {grantCount === 1
                            ? row.grantEvents[0].grant.label
                            : `${grantCount} grants`}
                        </span>
                      </div>
                      <motion.svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        className="shrink-0"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path d="M7 10l5 5 5-5" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </div>
                  </td>

                  {/* Total vesting */}
                  <td className="px-2 py-2.5 align-middle">
                    <span className="font-semibold text-ink">{fmtMoney(Math.round(row.total.value))}</span>
                    <span className="text-tertiary ml-2">{row.total.shares.toLocaleString()} shares</span>
                  </td>

                  {/* Status */}
                  <td className="px-2 py-2.5 align-middle">
                    <span className={row.isVested ? 'text-tertiary' : 'text-ink'}>
                      {row.isVested ? 'Vested' : 'Unvested'}
                    </span>
                  </td>
                </tr>

                {/* Expanded breakdown */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <tr key={`${row.dateKey}-expanded`}>
                      <td colSpan={5} className="p-0 border-b border-border-subtle">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 0.03, 0.26, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <table className="w-full border-collapse table-fixed">
                            <colgroup>
                              <col style={{ width: '12%' }} />
                              <col style={{ width: '18%' }} />
                              <col style={{ width: '34%' }} />
                              <col style={{ width: '22%' }} />
                              <col style={{ width: '14%' }} />
                            </colgroup>
                            <tbody>
                              {[...row.grantEvents].reverse().map(({ grant, event }) => (
                                <tr key={grant.id} className="bg-surface-muted border-b border-border-subtle last:border-0">
                                  <td className="px-2 py-2 align-middle" />
                                  <td className="px-2 py-2 align-middle" />
                                  <td className="px-2 py-2 align-middle">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: grant.color }} />
                                      <span className="text-sm text-ink">{grant.label}, {fmtDate(grant.grantedDate)}</span>
                                      <span className="text-sm text-tertiary">· {event.quarterIndex}/16</span>
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 align-middle">
                                    <span className="text-sm font-semibold text-ink">{fmtMoney(Math.round(event.shares * sharePrice))}</span>
                                    <span className="text-sm text-tertiary ml-2">{event.shares} shares</span>
                                  </td>
                                  <td className="px-2 py-2 align-middle" />
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            )
          })}
        </tbody>
      </table>

      {allRowsFull.length > allRowsInPeriod.length && (
        <div className="flex justify-center py-3">
          <button
            onClick={() => setShowAll(v => !v)}
            className="flex items-center gap-1 bg-surface-muted border border-border rounded-full px-4 py-1 text-xs text-ink cursor-pointer font-ui"
          >
            {showAll ? 'Show less' : 'Show more'}
            <motion.svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M7 10l5 5 5-5" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </button>
        </div>
      )}
    </div>
  )
}
