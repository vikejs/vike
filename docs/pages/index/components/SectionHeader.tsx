import React from 'react'
import { UiColorVariantKey } from '../util/ui.constants'
import HeadlineGroup from './HeadlineGroup'
import { cmMerge } from '@classmatejs/react'

interface SectionHeaderProps {
  icon?: React.ReactNode
  iconSrc?: string
  badgeText?: string
  color: UiColorVariantKey
  main: string | React.ReactNode
  sub?: string | React.ReactNode
  outerClassName?: string
}

const SectionHeader = ({ color, icon, iconSrc, main, sub, outerClassName }: SectionHeaderProps) => {
  return (
    <div className={cmMerge('mt-24 lg:mt-32 mb-12 lg:mb-20', outerClassName)}>
      <HeadlineGroup
        outerClassName="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 mx-auto"
        headingStyle="h1"
        pre={
          <div className="flex flex-col gap-4 mb-6">
            {iconSrc ? (
              <img src={iconSrc} alt="" className="h-16 w-16 md:h-24 md:w-24 object-contain mx-auto" />
            ) : (
              <span className="text-6xl md:text-8xl">{icon}</span>
            )}
          </div>
        }
        main={main}
        sub={sub ? <div className="w-6/7 md:w-full block mx-auto">{sub}</div> : undefined}
        blurColor={color}
      />
    </div>
  )
}

export default SectionHeader
