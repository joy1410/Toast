'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GRANTS, TODAY, buildVestingSchedule, buildQuarterBars,
  computeSummary, fmtMoney, fmtDate,
} from './equityData'
import { VestingChartV2 } from './VestingChartV2'
import { VestingTable } from './VestingTable'
import { GrantsTab } from './GrantsTab'

const DEFAULT_PRICE = 37.25
const PRICE_DATE = '01.09.26'

function addMonths(d: Date, n: number): Date {
  const r = new Date(d)
  r.setMonth(r.getMonth() + n)
  return r
}

type PeriodMode = 'next12' | 'calYear26' | 'allFuture'
type DisplayMode = 'shares' | 'value'
type TabMode = 'schedule' | 'grants'

export function EquityCard() {
  const [sharePrice, setSharePrice] = useState(DEFAULT_PRICE)
  const [priceLabel, setPriceLabel] = useState<string>(`20 day average as on ${PRICE_DATE}`)
  const [inputPrice, setInputPrice] = useState(String(DEFAULT_PRICE))
  const [showPriceEditor, setShowPriceEditor] = useState(false)
  const [periodMode, setPeriodMode] = useState<PeriodMode>('next12')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('shares')
  const [tab, setTab] = useState<TabMode>('schedule')
  const [highlightGrantId, setHighlightGrantId] = useState<string | null>(null)
  const [grantDropdownOpen, setGrantDropdownOpen] = useState(false)
  const [scrollToQuarter, setScrollToQuarter] = useState<{ quarter: string; nonce: number } | null>(null)
  const grantDropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
  const summary = computeSummary(allEvents, sharePrice)

  const chartStart = periodMode === 'next12' ? TODAY
    : periodMode === 'calYear26' ? new Date('2026-01-01')
    : TODAY
  const chartEnd = periodMode === 'next12' ? addMonths(TODAY, 12)
    : periodMode === 'calYear26' ? new Date('2026-12-31')
    : new Date(8640000000000000)
  const chartBars = buildQuarterBars(allEvents, sharePrice, chartStart, chartEnd)

  const periodVestedShares = periodMode === 'calYear26'
    ? allEvents.filter(e => e.date >= chartStart && e.date <= chartEnd && e.date <= TODAY).reduce((s, e) => s + e.shares, 0)
    : 0
  const periodUnvestedShares = periodMode === 'next12'
    ? allEvents.filter(e => e.date > TODAY && e.date <= chartEnd).reduce((s, e) => s + e.shares, 0)
    : periodMode === 'calYear26'
    ? allEvents.filter(e => e.date >= chartStart && e.date <= chartEnd && e.date > TODAY).reduce((s, e) => s + e.shares, 0)
    : allEvents.filter(e => e.date > TODAY).reduce((s, e) => s + e.shares, 0)
  const periodVestedValue = periodVestedShares * sharePrice
  const periodUnvestedValue = periodUnvestedShares * sharePrice

  const tableStart = new Date('2026-01-01')
  const tableEnd = addMonths(TODAY, 12)

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

  const nextVestLabel = summary.nextVestDate
    ? summary.nextVestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  const summaryCards = [
    { label: 'Granted to date',           primary: `${summary.totalShares.toLocaleString()} shares`,  secondary: `${summary.grantCount} grants` },
    { label: 'Vested to date',            primary: `${summary.vestedShares.toLocaleString()} shares`,  secondary: fmtMoney(Math.round(summary.vestedValue)) },
    { label: 'Unvested',                  primary: `${summary.unvestedShares.toLocaleString()} shares`, secondary: fmtMoney(Math.round(summary.unvestedValue)) },
    { label: 'Next 12 months vesting',    primary: `${summary.next12Shares.toLocaleString()} shares`,  secondary: fmtMoney(Math.round(summary.next12Value)) },
    { label: 'Next vesting',              primary: nextVestLabel,                                       secondary: `${summary.nextVestShares.toLocaleString()} shares · ${fmtMoney(Math.round(summary.nextVestValue))}` },
  ]

  return (
    <div className="font-ui bg-background rounded-2xl w-full px-8 py-9">
      <style>{`
        .kpi-grid { grid-template-columns: repeat(5, 1fr); }
        @media (max-width: 860px) { .kpi-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 560px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 360px) { .kpi-grid { grid-template-columns: 1fr; } }
      `}</style>
      {/* Header */}
      <p className="text-base font-semibold text-ink leading-6 mb-4 m-0">Your equity rewards</p>

      {/* Summary cards */}
      <div className="kpi-grid grid gap-2.5 mb-2">
        {summaryCards.map(card => (
          <div
            key={card.label}
            className="bg-surface-card border border-border rounded-xl p-4 flex flex-col gap-3"
          >
            <p className="text-base font-normal text-ink leading-6 m-0">{card.label}</p>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-semibold text-ink">{card.primary}</span>
              <span className="text-sm text-secondary">{card.secondary}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Share price row */}
      <div className="mb-4">
        <AnimatePresence mode="wait">
          {!showPriceEditor ? (
            <motion.div
              key="price-display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center h-9"
            >
              <span className="text-base text-secondary">
                Calculated based on share price of{' '}
                <span className="text-ink">${sharePrice.toFixed(2)}</span>
                , {priceLabel}
              </span>
              <button
                onClick={() => { setShowPriceEditor(true); setInputPrice('') }}
                className="bg-transparent border-0 cursor-pointer text-action text-base font-normal px-2 font-ui"
              >
                Change
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="price-editor"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.22, 0.03, 0.26, 1] }}
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

      {/* Tabs */}
      <div className="flex border-b border-border-mid mb-6">
        {([['schedule', 'Vesting'], ['grants', 'Grants']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative bg-transparent border-0 cursor-pointer px-2 pt-3 pb-3 text-base font-ui -mb-px ${tab === key ? 'font-semibold text-ink' : 'font-normal text-secondary'}`}
          >
            {label}
            {tab === key && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand rounded-t-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
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

                  {/* Grant filter dropdown */}
                  <div ref={grantDropdownRef} className="relative">
                    {(() => {
                      const activeGrant = highlightGrantId ? GRANTS.find(g => g.id === highlightGrantId) : null
                      return (
                        <button
                          onClick={() => setGrantDropdownOpen(v => !v)}
                          className="flex items-center gap-2 border border-border rounded-md px-3 text-base text-ink bg-background cursor-pointer h-10 font-ui whitespace-nowrap"
                        >
                          {activeGrant && (
                            /* grant.color is a data-driven runtime value — inline style required */
                            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: activeGrant.color }} />
                          )}
                          <span className={activeGrant ? 'font-semibold' : 'font-normal'}>
                            {activeGrant ? activeGrant.label : 'All grants'}
                          </span>
                          {activeGrant && (
                            <span className="text-label-sm text-muted font-normal">{fmtDate(activeGrant.grantedDate)}</span>
                          )}
                          <motion.svg
                            width="18" height="18" viewBox="0 0 24 24" fill="none"
                            className="ml-0.5"
                            animate={{ rotate: grantDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path d="M7 10l5 5 5-5" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        </button>
                      )
                    })()}

                    <AnimatePresence>
                      {grantDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96, y: -6 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          style={{ transformOrigin: 'top left' }}
                          className="absolute top-[calc(100%+4px)] left-0 bg-background border border-border rounded-lg shadow-dropdown z-50 min-w-50 overflow-hidden"
                        >
                          {[
                            { id: null as string | null, label: 'All grants', date: null as Date | null },
                            ...GRANTS.map(g => ({ id: g.id, label: g.label, date: g.grantedDate })),
                          ].map(opt => {
                            const isSelected = highlightGrantId === opt.id
                            const grant = opt.id ? GRANTS.find(g => g.id === opt.id) : null
                            return (
                              <button
                                key={opt.id ?? '__all'}
                                onClick={() => { setHighlightGrantId(opt.id); setGrantDropdownOpen(false) }}
                                className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 border-0 cursor-pointer font-ui text-sm text-ink text-left whitespace-nowrap ${isSelected ? 'bg-surface-selected' : 'bg-transparent hover:bg-surface-muted'}`}
                              >
                                {/* grant.color is data-driven — inline style required */}
                                {grant && <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: grant.color }} />}
                                <span className={isSelected ? 'font-semibold' : 'font-normal'}>{opt.label}</span>
                                {opt.date && (
                                  <span className="text-xs text-muted ml-auto pl-2 whitespace-nowrap">{fmtDate(opt.date)}</span>
                                )}
                              </button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
                      {/* Striped SVG swatch — hatch pattern, static markup */}
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
                      {displayMode === 'shares' ? (
                        <>
                          <span className="text-value font-semibold text-ink">{periodVestedShares.toLocaleString()} shares</span>
                          <span className="bg-surface-muted border border-border rounded-full px-2.5 py-0.5 text-caption-sm font-semibold text-ink uppercase tracking-overline whitespace-nowrap">
                            {fmtMoney(Math.round(periodVestedValue))}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-value font-semibold text-ink">{fmtMoney(Math.round(periodVestedValue))}</span>
                          <span className="bg-surface-muted border border-border rounded-full px-2.5 py-0.5 text-caption-sm font-semibold text-ink uppercase tracking-overline whitespace-nowrap">
                            {periodVestedShares.toLocaleString()} shares
                          </span>
                        </>
                      )}
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
                  {displayMode === 'shares' ? (
                    <>
                      <span className="text-value font-semibold text-ink">{periodUnvestedShares.toLocaleString()} shares</span>
                      <span className="bg-surface-muted border border-border rounded-full px-2.5 py-0.5 text-caption-sm font-semibold text-ink uppercase tracking-overline whitespace-nowrap">
                        {fmtMoney(Math.round(periodUnvestedValue))}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-value font-semibold text-ink">{fmtMoney(Math.round(periodUnvestedValue))}</span>
                      <span className="bg-surface-muted border border-border rounded-full px-2.5 py-0.5 text-caption-sm font-semibold text-ink uppercase tracking-overline whitespace-nowrap">
                        {periodUnvestedShares.toLocaleString()} shares
                      </span>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Legend (hidden, preserved) */}
              <div className="hidden gap-4 flex-wrap">
                {GRANTS.map(g => (
                  <div key={g.id} className="flex items-center gap-1.5 text-label-sm text-secondary">
                    {/* g.color is data-driven — inline style required */}
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

// ─── PriceEditor ─────────────────────────────────────────────────────────────

interface PriceEditorProps {
  defaultPrice: number
  currentPrice: number
  inputPrice: string
  inputRef: React.RefObject<HTMLInputElement | null>
  onInputChange: (v: string) => void
  onApply: () => void
  onSelectPreset: (price: number, label: string) => void
  onHide: () => void
}

function PriceEditor({ defaultPrice, currentPrice, inputPrice, inputRef, onInputChange, onApply, onSelectPreset, onHide }: PriceEditorProps) {
  const presets = [
    { label: '20 day avg',  description: `20 day average as on ${PRICE_DATE}`,  price: defaultPrice },
    { label: '+ 5% growth',  description: '+5% over 20 day avg',  price: Math.round(defaultPrice * 1.05 * 100) / 100 },
    { label: '+ 10% growth', description: '+10% over 20 day avg', price: Math.round(defaultPrice * 1.10 * 100) / 100 },
    { label: '+ 20% growth', description: '+20% over 20 day avg', price: Math.round(defaultPrice * 1.20 * 100) / 100 },
  ]

  return (
    <div className="bg-surface-card rounded-2xl px-6 pt-5 pb-6 flex flex-col gap-2">
      <style>{`.price-input::placeholder { color: var(--color-muted); }`}</style>
      <p className="m-0 text-base font-semibold text-ink leading-6">Select stock price</p>

      {/* Preset cards — gap-[15px] is between sm(12) and md(16); nearest is gap-3.5 = 14px, close enough */}
      <div className="flex gap-3.5">
        {presets.map(p => {
          const isSelected = currentPrice === p.price
          return (
            <motion.button
              key={p.label}
              onClick={() => onSelectPreset(p.price, p.description)}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 bg-background cursor-pointer rounded-inner flex flex-col gap-2 text-left font-ui ${isSelected ? 'border-2 border-border-strong p-[15px]' : 'border border-border-mid p-4'}`}
            >
              <span className="text-base font-normal text-ink leading-6">{p.label}</span>
              <span className="text-base font-semibold text-ink leading-6">$ {p.price.toFixed(2)}</span>
            </motion.button>
          )
        })}
      </div>

      <div className="px-4 py-0.5">
        <span className="text-base text-secondary">or</span>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-ink leading-6">Enter a stock price</label>
            <div className="flex items-center border border-border rounded-lg h-12 overflow-hidden bg-background">
              <div className="bg-surface-badge h-full flex items-center px-3 border-r border-border">
                <span className="text-base text-ink">$</span>
              </div>
              <input
                ref={inputRef}
                type="number"
                className="price-input border-0 outline-none px-4 text-base text-ink font-ui w-30 bg-transparent"
                value={inputPrice}
                placeholder={currentPrice.toFixed(2)}
                onChange={e => onInputChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') onApply() }}
              />
            </div>
          </div>
          <button
            onClick={onApply}
            className="h-12 px-6 border-2 border-action rounded-lg bg-background text-action text-base font-semibold cursor-pointer font-ui whitespace-nowrap"
          >
            Apply
          </button>
        </div>
        <button
          onClick={onHide}
          className="bg-transparent border-0 cursor-pointer text-action text-base font-ui p-0"
        >
          Hide
        </button>
      </div>
    </div>
  )
}

// ─── ToggleGroup ─────────────────────────────────────────────────────────────

interface ToggleOption { key: string; label: string }

function ToggleGroup({ options, value, onChange, groupId }: {
  options: ToggleOption[]
  value: string
  onChange: (v: string) => void
  groupId: string
}) {
  return (
    <div className="flex bg-surface-control rounded-lg h-10 isolate">
      {options.map(opt => {
        const active = opt.key === value
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`relative border-0 rounded-md px-3.5 cursor-pointer text-base font-ui h-full whitespace-nowrap bg-transparent ${active ? 'font-semibold text-action' : 'font-normal text-secondary'}`}
          >
            {active && (
              <motion.span
                layoutId={`pill-${groupId}`}
                className="absolute inset-0 bg-background rounded-md border border-surface-badge shadow-toggle z-0"
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
