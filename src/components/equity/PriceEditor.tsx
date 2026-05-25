'use client'
import { motion } from 'framer-motion'

const PRICE_DATE = '01.09.26'

export interface PriceEditorProps {
  defaultPrice: number
  currentPrice: number
  inputPrice: string
  inputRef: React.RefObject<HTMLInputElement | null>
  onInputChange: (v: string) => void
  onApply: () => void
  onSelectPreset: (price: number, label: string) => void
  onHide: () => void
}

export function PriceEditor({ defaultPrice, currentPrice, inputPrice, inputRef, onInputChange, onApply, onSelectPreset, onHide }: PriceEditorProps) {
  const presets = [
    { label: '20 day avg',   description: `20 day average as on ${PRICE_DATE}`, price: defaultPrice },
    { label: '+ 5% growth',  description: '+5% over 20 day avg',  price: Math.round(defaultPrice * 1.05 * 100) / 100 },
    { label: '+ 10% growth', description: '+10% over 20 day avg', price: Math.round(defaultPrice * 1.10 * 100) / 100 },
    { label: '+ 20% growth', description: '+20% over 20 day avg', price: Math.round(defaultPrice * 1.20 * 100) / 100 },
  ]

  return (
    <div className="bg-surface-card rounded-2xl px-6 pt-5 pb-6 flex flex-col gap-2">
      <style>{`.price-input::placeholder { color: var(--color-muted); }`}</style>
      <p className="m-0 text-base font-semibold text-ink leading-6">Select stock price</p>

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
