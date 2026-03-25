import React from 'react'
import { UiColorVariantKey, UiVariantBgColor } from '../util/ui.constants'
import cm from '@classmatejs/react'
import { H4Headline } from './Headline'

type BarChartData = {
  label: string
  percentage: number
  minWidth?: number
}

const defaultPollData: [BarChartData, BarChartData] = [
  { label: 'Vike', percentage: 100 },
  { label: 'Other framework', percentage: 33, minWidth: 110 },
]

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  pollData?: [BarChartData, BarChartData]
  color: UiColorVariantKey
  label?: React.ReactNode
}

const BarChart = ({ color, className, label, ...props }: BarChartProps) => {
  const { pollData = defaultPollData, ...divProps } = props
  const winningEntry = pollData.reduce((prev, current) => (prev.percentage > current.percentage ? prev : current))

  return (
    <div className={className} {...divProps}>
      <H4Headline className="mb-1 md:mb-2">{label}:</H4Headline>
      <div className="flex flex-col gap-1">
        {pollData.map((data) => {
          const barStyle = {
            width: `${data.percentage}%`,
            minWidth: data.minWidth,
          }
          return (
            <div key={data.label}>
              <div className="w-full h-4 md:h-5 to-base-200 via-base-200 via-60% bg-linear-to-l">
                <StyledBar style={barStyle} $color={color} $won={data.label === winningEntry.label}>
                  <span className="text-xs md:text-sm font-mono whitespace-nowrap relative md:top-[1px]">
                    {data.label}
                  </span>
                </StyledBar>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BarChart

const StyledBar = cm.div.variants<{ $color: UiColorVariantKey; $won: boolean }>({
  base: 'h-full rounded-md md:rounded-lg flex items-center pl-3 relative',
  variants: {
    $color: UiVariantBgColor,
    $won: {
      false: 'bg-grey-100 text-white',
      true: ' text-primary-content',
    },
  },
})
