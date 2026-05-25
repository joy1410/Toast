import { WhatChangedCarousel } from '@/components/what-changed/WhatChangedCarousel'
import { RewardsCard } from '@/components/what-changed/cards/RewardsCard'
import { FreshRSUCard } from '@/components/what-changed/cards/FreshRSUCard'
import { PayBandChangeCard } from '@/components/what-changed/cards/PayBandChangeCard'
import { TotalRewardCard } from '@/components/what-changed/cards/TotalRewardCard'

export default function WhatChangedPage() {
  return (
    <div className="flex flex-col items-center bg-zinc-100 p-8 min-h-screen">
      <WhatChangedCarousel
        cards={[
          {
            id: 'rewards',
            content: <RewardsCard totalChange={12400} changePercent={8} cash={8000} benefits={4400} />,
          },
          {
            id: 'rsu',
            content: <FreshRSUCard shares={1450} grantType="Merit grant" vestingYears={4} sharesPerYear={362} />,
          },
          {
            id: 'payband',
            content: <PayBandChangeCard newBase="$142k" minK={80} midK={130} maxK={180} oldBaseK={128} newBaseK={142} />,
          },
          {
            id: 'total',
            content: <TotalRewardCard totalReward={243000} />,
          },
        ]}
      />
    </div>
  )
}
