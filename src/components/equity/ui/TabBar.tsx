'use client'
import { motion } from 'framer-motion'

export interface TabOption { key: string; label: string }

export function TabBar({ tabs, value, onChange }: {
  tabs: TabOption[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex border-b border-border-mid mb-6">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative bg-transparent border-0 cursor-pointer px-2 pt-3 pb-3 text-base font-ui -mb-px ${value === tab.key ? 'font-semibold text-ink' : 'font-normal text-secondary'}`}
        >
          {tab.label}
          {value === tab.key && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand rounded-t-sm"
              transition={{ duration: 0.25, ease: [0.22, 0.03, 0.26, 1] }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
