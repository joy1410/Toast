// Figma: Frame 77 (94:17124) — Iterations page, 2026-03-27
// Layout: VERTICAL auto-layout, padding 32px all sides, gap 29px
// Children: "Total Reward" label → Frame 56901 (value + subtitle, gap 12px)
//           more-horiz icon (layoutPositioning: ABSOLUTE, top 24px, right 24px)
// Background: linear gradient white → #EDF6FF, cornerRadius 16

export interface TotalRewardCardProps {
  totalReward: number
  reviewCycle?: string
  effectiveDate?: string
  onMenuClick?: () => void
}

export function TotalRewardCard({
  totalReward,
  reviewCycle = '2025 Annual Review Cycle',
  effectiveDate = 'Apr 1',
  onMenuClick,
}: TotalRewardCardProps) {
  const fmt = (n: number) => '$ ' + n.toLocaleString('en-US')

  return (
    // Frame 77 — VERTICAL auto-layout, gap 29px, padding 32px, cornerRadius 16
    // layoutSizing: FILL×FILL — let parent control dimensions
    <div className="relative flex flex-col gap-[29px] p-8 rounded-[16px] overflow-hidden bg-gradient-to-br from-white to-[#EDF6FF] w-full h-full">

      {/* more-horiz — ABSOLUTE positioned, top 24 right 24 (confirmed: layoutPositioning: ABSOLUTE) */}
      <button
        onClick={onMenuClick}
        aria-label="More options"
        className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center bg-transparent border-0 cursor-pointer text-[#252525] p-0"
      >
        <svg width="15" height="3" viewBox="0 0 15 3" fill="none" aria-hidden>
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
          <circle cx="7.5" cy="1.5" r="1.5" fill="currentColor" />
          <circle cx="13.5" cy="1.5" r="1.5" fill="currentColor" />
        </svg>
      </button>

      {/* "Total Reward" — 18px Effra Medium, lh 20px */}
      {/* ⚠ color #666666 — Figma var .../8531:884 (external lib) */}
      <p className="m-0 font-['Effra_Medium',sans-serif] text-[18px] font-normal leading-[20px] text-[#666666]">
        Total Reward
      </p>

      {/* Frame 56901 — VERTICAL auto-layout, gap 12px, contains value + subtitle */}
      <div className="flex flex-col gap-3">

        {/* "$ 243,000" — 38px Effra Medium, lh 42px */}
        {/* ⚠ color #252525 — Figma var .../8531:877 (external lib) */}
        <p className="m-0 font-['Effra_Medium',sans-serif] text-[38px] font-normal leading-[42px] text-[#252525]">
          {fmt(totalReward)}
        </p>

        {/* subtitle — 14px Source Sans Pro, lh 20px, ls 0.2px */}
        {/* ⚠ color #666666 — Figma var .../8531:884 (external lib) */}
        <p className="m-0 font-['Source_Sans_Pro',sans-serif] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#666666]">
          {reviewCycle} · Effective {effectiveDate}
        </p>

      </div>
    </div>
  )
}
