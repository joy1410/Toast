'use client'
import { Chip } from './Chip'

export interface KpiCardData {
  label: string
  primary: string
  secondary: string
  chip?: string
}

export function KpiCard({ label, primary, secondary, chip }: KpiCardData) {
  return (
    <div className="bg-surface-card border border-border rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="text-base font-normal text-ink leading-6 m-0">{label}</p>
        {chip && <Chip>{chip}</Chip>}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-lg font-semibold text-ink">{primary}</span>
        <span className="text-sm text-secondary">{secondary}</span>
      </div>
    </div>
  )
}
