export const TODAY = new Date('2026-09-04')

export type GrantType = 'new-hire' | 'promotion' | 'merit'

export interface Grant {
  id: string
  label: string         // e.g. "New hire grant"
  grantedDate: Date
  totalShares: number
  type: GrantType
  color: string         // chart bar color
}

// 4 grants, each vesting over 16 quarters
export const GRANTS: Grant[] = [
  {
    id: 'new-hire-24',
    label: 'New hire grant',
    grantedDate: new Date('2024-06-03'),
    totalShares: 1600,
    type: 'new-hire',
    color: '#45baba',
  },
  {
    id: 'promotion-24',
    label: 'Promotion grant',
    grantedDate: new Date('2024-09-03'),
    totalShares: 800,
    type: 'promotion',
    color: '#95caff',
  },
  {
    id: 'merit-25',
    label: 'Merit grant',
    grantedDate: new Date('2025-09-03'),
    totalShares: 2000,
    type: 'merit',
    color: '#5da3ea',
  },
  {
    id: 'promotion-26',
    label: 'Promotion grant',
    grantedDate: new Date('2026-09-03'),
    totalShares: 1450,
    type: 'promotion',
    color: '#bdf18b',
  },
]

export interface VestingEvent {
  date: Date
  grantId: string
  shares: number        // shares this quarter
  quarterIndex: number  // 1-based (1..16)
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d)
  r.setMonth(r.getMonth() + n)
  return r
}

function firstVestDate(grant: Grant): Date {
  if (grant.type === 'new-hire') {
    // First vesting: exactly 1 year after grant (cliff), then quarterly
    return addMonths(grant.grantedDate, 12)
  }
  // All others: April 1 of next calendar year
  const year = grant.grantedDate.getFullYear() + 1
  return new Date(year, 3, 1) // April 1
}

export function buildVestingSchedule(): VestingEvent[] {
  const events: VestingEvent[] = []
  for (const grant of GRANTS) {
    const startDate = firstVestDate(grant)
    const sharesPerQuarter = Math.floor(grant.totalShares / 16)
    for (let q = 0; q < 16; q++) {
      events.push({
        date: addMonths(startDate, q * 3),
        grantId: grant.id,
        shares: sharesPerQuarter,
        quarterIndex: q + 1,
      })
    }
  }
  return events.sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Group vesting events by date (same day vestings merge into one row)
export function groupByDate(events: VestingEvent[]): Map<string, VestingEvent[]> {
  const map = new Map<string, VestingEvent[]>()
  for (const e of events) {
    const key = e.date.toISOString().split('T')[0]
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(e)
  }
  return map
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
    .replace(',', '') // "3 Sep '26"
}

export function fmtMoney(n: number): string {
  return `$${n.toLocaleString('en-US')}`
}

// Quarter label e.g. Q3'26
export function quarterLabel(d: Date): string {
  const q = Math.floor(d.getMonth() / 3) + 1
  const yr = String(d.getFullYear()).slice(2)
  return `Q${q}'${yr}`
}

// Build quarterly bar chart data for a period
export interface QuarterBar {
  label: string
  segments: { grantId: string; shares: number; value: number; isVested: boolean }[]
}

export function buildQuarterBars(
  events: VestingEvent[],
  sharePrice: number,
  start: Date,
  end: Date
): QuarterBar[] {
  const bars = new Map<string, QuarterBar>()
  for (const e of events) {
    if (e.date < start || e.date > end) continue
    const ql = quarterLabel(e.date)
    if (!bars.has(ql)) bars.set(ql, { label: ql, segments: [] })
    const bar = bars.get(ql)!
    const vested = e.date <= TODAY
    const seg = bar.segments.find(s => s.grantId === e.grantId)
    if (seg) {
      seg.shares += e.shares
      seg.value += e.shares * sharePrice
      if (vested) seg.isVested = true
    } else {
      bar.segments.push({ grantId: e.grantId, shares: e.shares, value: e.shares * sharePrice, isVested: vested })
    }
  }
  // Sort segments by grant order (new-hire at bottom, most recent at top)
  const grantOrder = GRANTS.map(g => g.id)
  bars.forEach(bar => {
    bar.segments.sort((a, b) => grantOrder.indexOf(a.grantId) - grantOrder.indexOf(b.grantId))
  })
  return Array.from(bars.values())
}

// Summary stats
export function computeSummary(events: VestingEvent[], sharePrice: number) {
  const totalShares = GRANTS.reduce((s, g) => s + g.totalShares, 0)
  const vestedShares = events.filter(e => e.date <= TODAY).reduce((s, e) => s + e.shares, 0)
  const unvestedShares = totalShares - vestedShares
  const next12End = addMonths(TODAY, 12)
  const next12Shares = events
    .filter(e => e.date > TODAY && e.date <= next12End)
    .reduce((s, e) => s + e.shares, 0)
  return {
    grantCount: GRANTS.length,
    totalShares,
    vestedShares,
    vestedValue: vestedShares * sharePrice,
    unvestedShares,
    unvestedValue: unvestedShares * sharePrice,
    next12Shares,
    next12Value: next12Shares * sharePrice,
  }
}
