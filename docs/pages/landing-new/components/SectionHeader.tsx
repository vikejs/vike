import React from 'react'
import { UiColorVariantKey } from '../util/ui.constants'
import HeadlineGroup from './HeadlineGroup'
import GradientText from './GradientText'
import { R } from '../util/gsap.utils'

interface SectionHeaderProps {
  icon: React.ReactNode
  badgeText?: string
  color: UiColorVariantKey
  main: string | React.ReactNode
  sub: string | React.ReactNode
}

const SectionHeader = ({ color, icon, main, sub }: SectionHeaderProps) => {
  // const speedValue = R(1.02, 1.06).toFixed(2)
  const speedValue = 1

  return (
    <div data-speed={`clamp(${speedValue})`}>
      <HeadlineGroup
        outerClassName="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 mx-auto"
        headingStyle="h1"
        pre={
          <span className="flex flex-col gap-4 mb-6">
            <span className="text-8xl">{icon}</span>
          </span>
        }
        main={main}
        sub={sub}
        blurColor={color}
      />
    </div>
  )
}

export default SectionHeader
