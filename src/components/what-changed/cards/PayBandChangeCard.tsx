// Figma: Frame "Pay band" (155:19041)
// Chart: staircase of two rects (short left + tall right), orange 10% fill + 1px top stroke
// Tooltip badge (gray pill) + dark vertical stem at newBaseK position

export interface PayBandChangeCardProps {
  newBase: string
  minK: number
  midK: number
  maxK: number
  oldBaseK: number
  newBaseK: number
}

const CHART_W = 242         // fills full content width (290px card − 48px padding)
const TALL_H = 54          // right rect height (Figma)
const SHORT_H = 35          // left rect height  (Figma)
const BADGE_H = 28          // tooltip badge height
const BADGE_W = 140         // tooltip badge width (increased for more padding)
const BADGE_R = BADGE_H / 2 // = 12 — pill radius (rx = ry = h/2, not 9999 which makes ellipse)
const BADGE_GAP = 17         // gap: badge bottom → tall bar top (Figma: 143−126=17)
const AXIS_GAP = 9          // gap: bar bottom → axis label baseline (Figma: 206−197=9)
const ORANGE = '#ff4c00'
const ORANGE_BG = 'rgba(255,76,0,0.10)'

// SVG y-coordinates (badge at top of SVG, bars below, axis labels at bottom)
const TALL_TOP_Y = BADGE_H + BADGE_GAP              // 41
const BAR_BOTTOM = TALL_TOP_Y + TALL_H               // 95
const SHORT_TOP_Y = BAR_BOTTOM - SHORT_H              // 60
const AXIS_TEXT_Y = BAR_BOTTOM + AXIS_GAP + 14        // 118  (9px gap + 14px text ascender)
const SVG_H = AXIS_TEXT_Y + 4                   // 122

function toX(k: number, minK: number, maxK: number) {
  return (k - minK) / (maxK - minK) * CHART_W
}

export function PayBandChangeCard({ newBase, minK, midK, maxK, oldBaseK, newBaseK }: PayBandChangeCardProps) {
  const oldX = toX(oldBaseK, minK, maxK)
  const newX = toX(newBaseK, minK, maxK)
  const midX = toX(midK, minK, maxK)

  // Clamp badge so it never bleeds outside chart
  const badgeLeft = Math.max(0, Math.min(newX - BADGE_W / 2, CHART_W - BADGE_W))

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 20,
      height: '100%',
    }}>

      {/* Title — matches FreshRSUCard: 18/700/#666 */}
      <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#666', lineHeight: 1 }}>
        Pay band change
      </p>

      {/* Chart SVG */}
      <svg
        width={CHART_W}
        height={SVG_H}
        viewBox={`0 0 ${CHART_W} ${SVG_H}`}
        style={{ overflow: 'visible', display: 'block' }}
        aria-label={`Pay band change — new base ${newBase}`}
      >
        {/* ── Tooltip badge (pill: rx = ry = h/2) ─────────────────────────── */}
        <rect
          x={badgeLeft} y={0}
          width={BADGE_W} height={BADGE_H}
          rx={BADGE_R} ry={BADGE_R}
          fill="#666"
        />
        <text
          x={badgeLeft + BADGE_W / 2} y={BADGE_H / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12} fontWeight={600} fill="#fff"
          fontFamily="inherit" letterSpacing="0.4"
        >
          NEW BASE {newBase}
        </text>

        {/* ── Vertical stem: badge bottom → bar bottom ─────────────────────── */}
        <line
          x1={newX} y1={BADGE_H}
          x2={newX} y2={BAR_BOTTOM}
          stroke="#252525" strokeWidth={1}
        />

        {/* ── Left rect (shorter) — 0 to oldBaseK ─────────────────────────── */}
        <rect x={0} y={SHORT_TOP_Y} width={oldX} height={SHORT_H} fill={ORANGE_BG} />
        <line x1={0} y1={SHORT_TOP_Y} x2={oldX} y2={SHORT_TOP_Y} stroke={ORANGE} strokeWidth={1} />

        {/* ── Right rect (taller) — oldBaseK to maxK ──────────────────────── */}
        <rect x={oldX} y={TALL_TOP_Y} width={CHART_W - oldX} height={TALL_H} fill={ORANGE_BG} />
        <line x1={oldX} y1={TALL_TOP_Y} x2={CHART_W} y2={TALL_TOP_Y} stroke={ORANGE} strokeWidth={1} />

        {/* ── X-axis labels ────────────────────────────────────────────────── */}
        <text x={0} y={AXIS_TEXT_Y} fontSize={14} fill="#bbb" fontFamily="inherit" fontWeight={400}>{minK}k</text>
        <text x={midX} y={AXIS_TEXT_Y} fontSize={14} fill="#bbb" fontFamily="inherit" fontWeight={400} textAnchor="middle">{midK}k</text>
        <text x={CHART_W} y={AXIS_TEXT_Y} fontSize={14} fill="#bbb" fontFamily="inherit" fontWeight={400} textAnchor="end">{maxK}k</text>
      </svg>

    </div>
  )
}
