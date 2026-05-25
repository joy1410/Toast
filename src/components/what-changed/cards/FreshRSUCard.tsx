// Figma: Frame "RSU" (155:19034) — rebuilt to match RewardsCard layout
// Layout: flex-col justify-between, title + value+badge row, detail grid

export interface FreshRSUCardProps {
  shares: number
  grantType: string
  vestingYears: number
  sharesPerYear: number
}

export function FreshRSUCard({ shares, grantType, vestingYears, sharesPerYear }: FreshRSUCardProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      gap: 42, height: '100%',
    }}>

      {/* ── Title + value row ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#666', lineHeight: 1 }}>
          Fresh RSU awarded
        </p>

        {/* Value + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#252525', letterSpacing: '-0.3px' }}>
            {shares.toLocaleString()} shares
          </span>

          {/* Mint badge pill */}
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            backgroundColor: '#c7f2ef', color: '#0a7a74',
            fontSize: 11, fontWeight: 700, lineHeight: 1.8,
            padding: '4px 12px', borderRadius: 9999,
            letterSpacing: '0.5px',
            textTransform: 'uppercase' as const,
            whiteSpace: 'nowrap' as const,
          }}>
            {grantType}
          </span>
        </div>
      </div>

      {/* ── Detail rows ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto auto',
        columnGap: 22, rowGap: 8, justifyContent: 'start',
      }}>
        <span style={{ fontSize: 16, fontWeight: 400, color: '#666' }}>Vesting period</span>
        <span style={{ fontSize: 14, fontWeight: 400, color: '#252525' }}>{vestingYears} years</span>
        <span style={{ fontSize: 16, fontWeight: 400, color: '#666' }}>Per year</span>
        <span style={{ fontSize: 14, fontWeight: 400, color: '#252525' }}>{sharesPerYear.toLocaleString()} shares</span>
      </div>

    </div>
  )
}
