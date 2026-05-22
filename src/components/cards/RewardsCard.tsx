// Figma: Frame "rewards" (155:19025) — updated auto-layout, 2026-03-26
// Layout: VERTICAL, justify flex-end (MAX), gap 36, padding t:24 r:22 b:24 l:22
// No divider. Title 18/400, value 20/400, badge pill #e8f7d4/#006400, rows grid.

export interface RewardsCardProps {
  totalChange: number
  changePercent: number
  cash: number
  benefits: number
}

export function RewardsCard({ totalChange, changePercent, cash, benefits }: RewardsCardProps) {
  const up = totalChange >= 0
  const fmt = (n: number) => `${n >= 0 ? '+ ' : '– '}$ ${Math.abs(n).toLocaleString()}`

  return (
    // Outer: flex-col, justify-end, gap 36 — mirrors Figma primaryAxisAlignItems MAX
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      gap: 42, height: '100%',
    }}>

      {/* ── Frame 56900: title + value row ─────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Title — 18px / 400 / #666 */}
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#666', lineHeight: 1 }}>
          Total rewards change
        </p>

        {/* Value + badge row — gap 9, align center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#252525', letterSpacing: '-0.3px' }}>
            {fmt(totalChange)}
          </span>

          {/* Numeric badge — pill, #e8f7d4 bg, #006400 text */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            backgroundColor: '#e8f7d4', color: '#006400',
            fontSize: 12, fontWeight: 600,
            padding: '4px 8px 4px 4px', borderRadius: 9999,
            whiteSpace: 'nowrap' as const,
          }}>
            {/* Arrow icon — 16×16 */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              {up
                ? <path d="M8 12V4M8 4L5 7M8 4L11 7" stroke="#006400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M8 4V12M8 12L5 9M8 12L11 9" stroke="#c62828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              }
            </svg>
            {changePercent}%
          </span>
        </div>
      </div>

      {/* ── Frame 56899: breakdown grid — 2 cols, row-gap 8, col-gap 22 ────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto auto',
        columnGap: 22, rowGap: 8, justifyContent: 'start',
      }}>
        <span style={{ fontSize: 16, fontWeight: 400, color: '#666' }}>Cash</span>
        <span style={{ fontSize: 14, fontWeight: 400, color: '#252525' }}>{fmt(cash)}</span>
        <span style={{ fontSize: 16, fontWeight: 400, color: '#666' }}>Benefits</span>
        <span style={{ fontSize: 14, fontWeight: 400, color: '#252525' }}>{fmt(benefits)}</span>
      </div>

    </div>
  )
}
