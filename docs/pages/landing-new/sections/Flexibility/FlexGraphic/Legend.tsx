import React from 'react'

import { FlexGraphicHook } from '../../../util/constants'
import { StyledLegendItem } from './styled'
import { hookColors } from '../../../util/ui.constants'

interface LegendProps {
  onChangeHightlight: (hooks: FlexGraphicHook[] | null) => void
  activeHooks: FlexGraphicHook[] | null
  isSlideshowMode: boolean
}

const Legend = ({ onChangeHightlight, activeHooks, isSlideshowMode }: LegendProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3">
      {Object.entries(hookColors).map(([key, color]) => {
        const hookName = key as FlexGraphicHook
        const isActive = activeHooks?.includes(hookName)
        const isInteractiveActive = !isSlideshowMode && activeHooks?.length
        const type = isActive ? 'active' : isSlideshowMode ? 'disabled' : isInteractiveActive ? 'inactive' : 'paused'

        return (
          <StyledLegendItem key={key} $type={type}>
            {/* extra hover area -> prevent style jitter on hover */}
            <div
              onMouseEnter={() => onChangeHightlight([hookName])}
              onMouseLeave={() => onChangeHightlight(null)}
              className="absolute inset-0"
            />
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
            <span className="text-xs">+{key}</span>
          </StyledLegendItem>
        )
      })}
    </div>
  )
}

export default Legend
