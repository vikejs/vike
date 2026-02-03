import React, { useState } from 'react'
import BlurDot, { BlurDotType } from '../../components/BlurDot'
import { H3Headline, H4Headline } from '../../components/Headline'
import cm from '@classmatejs/react'

const StyledUspItem = cm.div`
  flex items-center 
  relative p-4 top-0 
  shadow-lg shadow-base-300 
  transition-all rounded-box 
  hover:shadow-shade/50
  hover:bg-white 
  hover:top-1
  hover:scale-102
  origin-bottom-center
`

const UspIds = {
  freedom: 'freedom',
  stability: 'stability',
  lightningDx: 'lightning-dx',
} as const
type UspId = (typeof UspIds)[keyof typeof UspIds]

type Usp = {
  id: UspId
  title: string
  description: string
  icon: string
  dotColor: BlurDotType
}

const usps: Usp[] = [
  {
    id: UspIds.freedom,
    title: 'Freedom',
    description: 'Small dummy text for usps. Small dummy text for usps.',
    icon: '🕊️',
    dotColor: 'green',
  },
  {
    id: UspIds.stability,
    title: 'Stability',
    description: 'Small dummy text for usps. Small dummy text for usps.',
    icon: '💎',
    dotColor: 'blue',
  },
  {
    id: UspIds.lightningDx,
    title: 'Lightning DX',
    description: 'Small dummy text for usps. Small dummy text for usps.',
    icon: '⚡️',
    dotColor: 'orange',
  },
]

const UspHero = () => {
  // todo: wire up to prevent flickery hover effects with css only solution
  const [hoveredUsp, setHoveredUsp] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-3 gap-2">
      {usps.map((usp) => (
        <StyledUspItem key={usp.title}>
          <div className="absolute inset-0 flex justify-center items-center z-2">
            <BlurDot type={usp.dotColor} size="lg" visibility="low" className="-mt-20" />
          </div>
          <div className="absolute h-full -inset-3 z-1 bg-linear-to-t to-base-300" />
          <div className="relative z-3">
            <div className="text-3xl md:text-5xl lg:text-8xl text-center block mb-2">{usp.icon}</div>
            <div className="text-center">
              <H3Headline as="h2" className="mb-3">
                {usp.title}
              </H3Headline>
              <p className=" text-gray">{usp.description}</p>
            </div>
          </div>
        </StyledUspItem>
      ))}
    </div>
  )
}
export default UspHero