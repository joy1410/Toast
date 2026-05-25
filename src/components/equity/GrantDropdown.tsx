'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { GRANTS, fmtDate } from './equityData'

export function GrantDropdown({ dropdownRef, open, onToggle, highlightGrantId, onSelect }: {
  dropdownRef: React.RefObject<HTMLDivElement | null>
  open: boolean
  onToggle: () => void
  highlightGrantId: string | null
  onSelect: (id: string | null) => void
}) {
  const activeGrant = highlightGrantId ? GRANTS.find(g => g.id === highlightGrantId) : null
  const options = [
    { id: null as string | null, label: 'All grants', date: null as Date | null },
    ...GRANTS.map(g => ({ id: g.id, label: g.label, date: g.grantedDate })),
  ]

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 border border-border rounded-md px-3 text-base text-ink bg-background cursor-pointer h-10 font-ui whitespace-nowrap"
      >
        {activeGrant && (
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
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M7 10l5 5 5-5" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ transformOrigin: 'top left' }}
            className="absolute top-[calc(100%+4px)] left-0 bg-background border border-border rounded-lg shadow-dropdown z-50 min-w-50 overflow-hidden"
          >
            {options.map(opt => {
              const isSelected = highlightGrantId === opt.id
              const grant = opt.id ? GRANTS.find(g => g.id === opt.id) : null
              return (
                <button
                  key={opt.id ?? '__all'}
                  onClick={() => onSelect(opt.id)}
                  className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 border-0 cursor-pointer font-ui text-sm text-ink text-left whitespace-nowrap ${isSelected ? 'bg-surface-selected' : 'bg-transparent hover:bg-surface-muted'}`}
                >
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
  )
}
