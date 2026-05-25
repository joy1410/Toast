'use client'
import { motion } from 'framer-motion'

export interface ToggleOption { key: string; label: string }

export function ToggleGroup({ options, value, onChange, groupId }: {
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
