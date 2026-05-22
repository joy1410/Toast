import { EquityCard } from '@/components/equity/EquityCard'

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-zinc-100 p-8">
      <div style={{ width: '100%', maxWidth: 1100 }}>
        <EquityCard />
      </div>
    </div>
  )
}
