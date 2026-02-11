import React from 'react'
import { UiColorVariantKey } from '../util/ui.constants'
import HeadlineGroup from './HeadlineGroup'
import GradientText from './GradientText'

interface SectionHeaderProps {
  icon: React.ReactNode
  badgeText?: string
  color: UiColorVariantKey
  main: string | React.ReactNode
  sub: string | React.ReactNode
}

const SectionHeader = ({ color, icon, main, sub }: SectionHeaderProps) => (
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
)

export default SectionHeader
