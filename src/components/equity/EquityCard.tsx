'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GRANTS, TODAY, buildVestingSchedule, buildQuarterBars,
  computeSummary, fmtMoney, fmtDate,
  type PeriodMode, type DisplayMode, type TabMode,
} from './equityData'
import { VestingChartV2 } from './VestingChartV2'
import { VestingTable } from './VestingTable'
import { GrantsTab } from './GrantsTab'
import { Chip } from './ui/Chip'
import { ToggleGroup } from './ui/ToggleGroup'
import { TabBar } from './ui/TabBar'
import { KpiCard } from './ui/KpiCard'
import { GrantDropdown } from './GrantDropdown'
import { PeriodSummary } from './PeriodSummary'
import { PriceEditor } from './PriceEditor'

const DEFAULT_PRICE = 37.25
const PRICE_DATE    = '01.09.26'

function addMonths(d: Date, n: number): Date {
  const r = new Date(d)
  r.setMonth(r.getMonth() + n)
  return r
}

export function EquityCard() {
  const [sharePrice, setSharePrice]         = useState(DEFAULT_PRICE)
  const [priceLabel, setPriceLabel]         = useState<string>(`20 day average as on ${PRICE_DATE}`)
  const [inputPrice, setInputPrice]         = useState(String(DEFAULT_PRICE))
  const [showPriceEditor, setShowPriceEditor] = useState(false)
  const [periodMode, setPeriodMode]         = useState<PeriodMode>('next12')
  const [displayMode, setDisplayMode]       = useState<DisplayMode>('shares')
  const [tab, setTab]                       = useState<TabMode>('schedule')
  const [highlightGrantId, setHighlightGrantId] = useState<string | null>(null)
  const [grantDropdownOpen, setGrantDropdownOpen] = useState(false)
  const [scrollToQuarter, setScrollToQuarter] = useState<{ quarter: string; nonce: number } | null>(null)
  const grantDropdownRef = useRef<HTMLDivElement>(null)
  const inputRef         = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showPriceEditor) inputRef.current?.focus()
  }, [showPriceEditor])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (grantDropdownRef.current && !grantDropdownRef.current.contains(e.target as Node)) {
        setGrantDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const allEvents = buildVestingSchedule()
  const summary   = computeSummary(allEvents, sharePrice)

  const chartStart = periodMode === 'calYear26' ? new Date('2026-01-01') : TODAY
  const chartEnd   = periodMode === 'next12'    ? addMonths(TODAY, 12)
    : periodMode === 'calYear26' ? new Date('2026-12-31')
    : new Date(8640000000000000)
  const chartBars  = buildQuarterBars(allEvents, sharePrice, chartStart, chartEnd)

  const periodVestedShares = periodMode === 'calYear26'
    ? allEvents.filter(e => e.date >= chartStart && e.date <= chartEnd && e.date <= TODAY).reduce((s, e) => s + e.shares, 0)
    : 0
  const periodUnvestedShares = periodMode === 'next12'
    ? allEvents.filter(e => e.date > TODAY && e.date <= chartEnd).reduce((s, e) => s + e.shares, 0)
    : periodMode === 'calYear26'
    ? allEvents.filter(e => e.date >= chartStart && e.date <= chartEnd && e.date > TODAY).reduce((s, e) => s + e.shares, 0)
    : allEvents.filter(e => e.date > TODAY).reduce((s, e) => s + e.shares, 0)
  const periodVestedValue   = periodVestedShares * sharePrice
  const periodUnvestedValue = periodUnvestedShares * sharePrice

  const tableStart = new Date('2026-01-01')
  const tableEnd   = addMonths(TODAY, 12)

  function applyPrice() {
    const n = parseFloat(inputPrice)
    if (!isNaN(n) && n > 0) {
      setSharePrice(n)
      setPriceLabel('custom price')
      setShowPriceEditor(false)
    }
  }

  function applyPreset(price: number, label: string) {
    setSharePrice(price)
    setInputPrice('')
    setPriceLabel(label)
  }

  const vestedPct   = Math.round((summary.vestedShares / summary.totalShares) * 100)
  const unvestedPct = 100 - vestedPct

  const summaryCards = [
    { label: 'Granted to date',        primary: `${summary.totalShares.toLocaleString()} shares`,  secondary: `${summary.grantCount} grants` },
    { label: 'Vested to date',         primary: `${summary.vestedShares.toLocaleString()} shares`, secondary: fmtMoney(Math.round(summary.vestedValue)),   chip: `${vestedPct}%` },
    { label: 'Unvested',               primary: `${summary.unvestedShares.toLocaleString()} shares`, secondary: fmtMoney(Math.round(summary.unvestedValue)), chip: `${unvestedPct}%` },
    { label: 'Next 12 months vesting', primary: `${summary.next12Shares.toLocaleString()} shares`, secondary: fmtMoney(Math.round(summary.next12Value)) },
  ]

  const nextVestDateLabel = summary.nextVestDate
    ? summary.nextVestDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' }).replace(',', "'")
    : null

  return (
    <div className="font-ui bg-background rounded-2xl w-full px-8 py-9">
      <style>{`
        .kpi-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 720px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 360px) { .kpi-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* ── Header ── */}
      <p className="text-base font-semibold text-ink leading-6 m-0">Your equity rewards</p>

      {/* ── Share price row (always-visible line + expandable editor) ── */}
      <div className="mb-4">
        <div className="flex items-center h-9">
          <span className="text-base text-secondary">
            Calculated based on share price of{' '}
            <span className="text-ink">${sharePrice.toFixed(2)}</span>
            , {priceLabel}
          </span>
          {!showPriceEditor && (
            <button
              onClick={() => { setShowPriceEditor(true); setInputPrice('') }}
              className="bg-transparent border-0 cursor-pointer text-action text-base font-normal px-2 font-ui"
            >
              Change
            </button>
          )}
        </div>
        <AnimatePresence>
          {showPriceEditor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.03, 0.26, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <PriceEditor
                defaultPrice={DEFAULT_PRICE}
                currentPrice={sharePrice}
                inputPrice={inputPrice}
                inputRef={inputRef}
                onInputChange={setInputPrice}
                onApply={applyPrice}
                onSelectPreset={applyPreset}
                onHide={() => setShowPriceEditor(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── KPI cards ── */}
      <div className="kpi-grid grid gap-2.5 mb-0">
        {summaryCards.map(card => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Next vesting bar ── */}
      {nextVestDateLabel && (
        <div className="border border-border rounded-xl px-4 py-3 flex items-center gap-4 mt-3 mb-6">
          <div className="flex items-center gap-2 text-base leading-6">
            <span className="text-secondary font-normal">Next vesting on</span>
            <span className="font-semibold text-ink">{nextVestDateLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Chip>{summary.nextVestShares.toLocaleString()} shares</Chip>
            <Chip>{fmtMoney(Math.round(summary.nextVestValue))}</Chip>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <TabBar
        tabs={[
          { key: 'schedule', label: 'Vesting' },
          { key: 'grants',   label: 'Grants' },
        ]}
        value={tab}
        onChange={key => { setTab(key as TabMode); setScrollToQuarter(null) }}
      />

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        {tab === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-6"
          >
            {/* Chart card */}
            <div className="bg-background border border-border rounded-xl p-6 flex flex-col gap-5">

              {/* Controls row */}
              <div className="relative z-50 flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-5 items-center flex-wrap">
                  <ToggleGroup
                    groupId="period"
                    options={[
                      { key: 'next12',    label: 'Next 12 months' },
                      { key: 'calYear26', label: "Calendar year '26" },
                      { key: 'allFuture', label: 'All future' },
                    ]}
                    value={periodMode}
                    onChange={v => setPeriodMode(v as PeriodMode)}
                  />
                  <GrantDropdown
                    dropdownRef={grantDropdownRef}
                    open={grantDropdownOpen}
                    onToggle={() => setGrantDropdownOpen(v => !v)}
                    highlightGrantId={highlightGrantId}
                    onSelect={id => { setHighlightGrantId(id); setGrantDropdownOpen(false) }}
                  />
                </div>
                <ToggleGroup
                  groupId="display"
                  options={[
                    { key: 'shares', label: 'Shares' },
                    { key: 'value',  label: 'Value ($)' },
                  ]}
                  value={displayMode}
                  onChange={v => setDisplayMode(v as DisplayMode)}
                />
              </div>

              {/* Period vesting summary */}
              <PeriodSummary
                periodMode={periodMode}
                displayMode={displayMode}
                vestedShares={periodVestedShares}
                vestedValue={periodVestedValue}
                unvestedShares={periodUnvestedShares}
                unvestedValue={periodUnvestedValue}
              />

              {/* Grant legend (hidden, preserved) */}
              <div className="hidden gap-4 flex-wrap">
                {GRANTS.map(g => (
                  <div key={g.id} className="flex items-center gap-1.5 text-label-sm text-secondary">
                    <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: g.color }} />
                    <span>{g.label}</span>
                    <span className="text-muted">· {fmtDate(g.grantedDate)}</span>
                  </div>
                ))}
              </div>

              <VestingChartV2
                bars={chartBars}
                sharePrice={sharePrice}
                mode={displayMode}
                highlightGrantId={highlightGrantId}
                periodMode={periodMode}
                onBarClick={q => setScrollToQuarter({ quarter: q, nonce: Date.now() })}
              />
            </div>

            {/* Table */}
            <div className="bg-background">
              <p className="text-base font-semibold text-ink mb-3">Your vesting schedule, 2026 onwards</p>
              <VestingTable
                events={allEvents}
                sharePrice={sharePrice}
                defaultStart={tableStart}
                defaultEnd={tableEnd}
                scrollToQuarter={scrollToQuarter?.quarter ?? null}
                scrollNonce={scrollToQuarter?.nonce ?? 0}
              />
            </div>
          </motion.div>
        )}

        {tab === 'grants' && (
          <motion.div
            key="grants"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <GrantsTab sharePrice={sharePrice} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
