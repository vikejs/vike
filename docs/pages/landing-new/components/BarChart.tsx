import React from 'react'
import { UiColorVariantKey, UiVariantBgColor } from '../util/ui.constants'
import cm, { cmMerge } from '@classmatejs/react'

type BarChartData = {
  label: string
  percentage: number
}

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  pollData: [BarChartData, BarChartData]
  color: UiColorVariantKey
}

const BarChart = ({ pollData, color, className, ...props }: BarChartProps) => {
  const winningEntry = pollData.reduce((prev, current) => (prev.percentage > current.percentage ? prev : current))

  // bar chart only supports two entries, se want want to know how (x) is the winning entry ahead of the losing entry, so we can use that to determine the width of the winning bar
  const winMultiplier = (
    winningEntry.percentage / pollData.find((entry) => entry.label !== winningEntry.label)!.percentage
  ).toFixed(1)

  return (
    <div className={cmMerge('flex flex-col gap-1', className)} {...props}>
      {pollData.map((data) => {
        const barWidth = `${data.percentage}%`
        return (
          <div key={data.label}>
            <div className="w-full h-4 to-base-200 via-base-200 via-60% bg-linear-to-l rounded-box">
              <StyledBar style={{ width: barWidth }} $color={color} $won={data.label === winningEntry.label}>
                <span className="text-sm font-mono">{data.label}</span>
                {/* {data.label === winningEntry.label && (
                  <StyledWinDot $color={color}>{`~${winMultiplier}x`}</StyledWinDot>
                )} */}
              </StyledBar>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BarChart

const StyledBar = cm.div.variants<{ $color: UiColorVariantKey; $won: boolean }>({
  base: 'h-full rounded-box flex items-center pl-3 relative',
  variants: {
    $color: UiVariantBgColor,
    $won: {
      false: 'bg-grey-100 text-white',
      true: ' text-primary-content',
    },
  },
})

const StyledWinDot = cm.div.variants<{ $color: UiColorVariantKey }>({
  base: 'w-10 h-10 rounded-full absolute flex items-center justify-center text-sm font-bold -top-3 -right-3',
  variants: {
    $color: UiVariantBgColor,
  },
})
