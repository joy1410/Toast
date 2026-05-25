'use client'
import React from 'react'

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-surface-muted border border-border rounded-full px-2.5 py-0.5 text-caption-sm font-semibold text-ink uppercase tracking-overline whitespace-nowrap">
      {children}
    </span>
  )
}
