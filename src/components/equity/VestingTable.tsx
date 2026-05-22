'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GRANTS, VestingEvent, TODAY, fmtDate, fmtMoney } from './equityData'

interface Props {
  events: VestingEvent[]
  sharePrice: number
  defaultStart: Date
  defaultEnd: Date
}

interface TableRow {
  date: Date
  dateKey: string
  perGrant: Record<string, VestingEvent | undefined>
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
    const perGrant: Record<string, VestingEvent | undefined> = {}
    let totalShares = 0
    for (const e of evts) {
      perGrant[e.grantId] = e
      totalShares += e.shares
    }
    rows.push({
      date: d,
      dateKey: key,
      perGrant,
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

export function VestingTable({ events, sharePrice, defaultStart, defaultEnd }: Props) {
  const [showAll, setShowAll] = useState(false)

  const allRowsInPeriod = buildRows(events, sharePrice, defaultStart, defaultEnd)
  const allRowsFull = buildRows(events, sharePrice, defaultStart, new Date(8640000000000000))
  const visibleRows = showAll ? allRowsFull : allRowsInPeriod

  return (
    <div className="w-full font-ui">
      {/* table-fixed is a Tailwind utility; col widths % set via inline since they're computed proportions */}
      <table className="w-full border-collapse text-sm table-fixed">
        <colgroup>
          <col style={{ width: '9%' }} />
          {/* column width is computed from GRANTS.length — dynamic inline required */}
          {GRANTS.map(g => <col key={g.id} style={{ width: `${62 / GRANTS.length}%` }} />)}
          <col style={{ width: '14%' }} />
          <col style={{ width: '8%' }} />
        </colgroup>

        <thead>
          <tr className="bg-surface-muted border-b border-border">
            <th className="px-2 py-2 text-left font-normal">
              <span className="font-semibold text-ink">Vesting date</span>
            </th>
            {GRANTS.map(g => (
              <th key={g.id} className="px-2 py-2 text-left font-normal">
                <div className="font-semibold text-ink leading-5 whitespace-nowrap overflow-hidden text-ellipsis">{g.label}</div>
                {/* text-xs = 12px caption size from typography.ts */}
                <div className="font-normal text-xs text-tertiary leading-4 whitespace-nowrap">Granted {fmtDate(g.grantedDate)}</div>
              </th>
            ))}
            <th className="px-2 py-2 text-left font-normal">
              <span className="font-semibold text-ink">Total vesting</span>
            </th>
            <th className="px-2 py-2 text-left font-normal">
              <span className="font-semibold text-ink">Status</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {visibleRows.map((row) => (
            <React.Fragment key={row.dateKey}>
              {row.isTodayBoundary && (
                <tr>
                  <td colSpan={GRANTS.length + 3} className="p-0">
                    <div className="relative h-px bg-ink">
                      {/* chip: text-chip=10px, tracking-chip=0.3px, rounded-full, bg-ink, text-background */}
                      <span className="absolute left-4 -top-[9px] bg-ink text-background text-chip font-semibold px-2 rounded-full tracking-chip flex items-center leading-none" style={{ paddingTop: '3px', paddingBottom: '3px' }}>
                        TODAY
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              <tr className="border-b border-border-subtle">
                <td className="px-2 py-2.5 align-middle overflow-hidden text-ellipsis">
                  <span className="font-semibold text-ink whitespace-nowrap">{fmtDate(row.date)}</span>
                </td>

                {GRANTS.map(g => {
                  const evt = row.perGrant[g.id]
                  if (!evt) return (
                    <td key={g.id} className="px-2 py-2.5 align-middle">
                      <span className="text-border-mid">—</span>
                    </td>
                  )
                  return (
                    <td key={g.id} className="px-2 py-2.5 align-middle overflow-hidden text-ellipsis">
                      <span className="font-semibold text-ink">{fmtMoney(Math.round(evt.shares * sharePrice))}</span>
                      <span className="text-tertiary ml-2">{evt.shares} shares</span>
                      <span className="text-action ml-2">{evt.quarterIndex}/16</span>
                    </td>
                  )
                })}

                <td className="px-2 py-2.5 align-middle whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="font-semibold text-ink">{fmtMoney(Math.round(row.total.value))}</span>
                  <span className="text-tertiary ml-2">{row.total.shares} shares</span>
                </td>

                <td className="px-2 py-2.5 align-middle">
                  <span className={row.isVested ? 'text-tertiary' : 'text-ink'}>
                    {row.isVested ? 'Vested' : 'Unvested'}
                  </span>
                </td>
              </tr>
            </React.Fragment>
          ))}
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
