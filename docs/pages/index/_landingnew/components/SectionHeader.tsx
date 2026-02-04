import React from 'react'
import { GradientTextColors } from '../util/ui.constants'
import HeadlineGroup from './HeadlineGroup'
import GradientText from './GradientText'

interface SectionHeaderProps {
  icon: React.ReactNode
  badgeText?: string
  color: GradientTextColors
  main: string | React.ReactNode
  sub: string | React.ReactNode
}

const SectionHeader = ({ color, icon, main, sub, badgeText }: SectionHeaderProps) => (
  <HeadlineGroup
    outerClassName="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 mx-auto"
    headingStyle="h1"
    pre={
      <span className="flex flex-col gap-4">
        <span className="text-8xl">{icon}</span>
        <span className="badge badge-sm badge-ghost badge-white mx-auto">
          <GradientText color={color}>{badgeText}</GradientText>
        </span>
      </span>
    }
    main={main}
    sub={sub}
    blurColor={color}
  />
)

export default SectionHeader