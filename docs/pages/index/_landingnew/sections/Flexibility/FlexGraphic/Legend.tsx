import React from 'react'

import { FlexGraphicHook, HOOK_COLORS } from '../../../util/constants'
import { StyledLegendItem } from './styled'

interface LegendProps {
  onChangeHightlight: (hooks: FlexGraphicHook[] | null) => void
  activeHooks: FlexGraphicHook[] | null
  isSlideshowMode: boolean
}

const Legend = ({ onChangeHightlight, activeHooks, isSlideshowMode }: LegendProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 mb-4">
      {Object.entries(HOOK_COLORS).map(([key, color]) => {
        const hookName = key as FlexGraphicHook
        const isActive = activeHooks?.includes(hookName)
        const isInteractiveActive = !isSlideshowMode && activeHooks?.length
        const type = isActive ? 'active' : isSlideshowMode ? 'disabled' : isInteractiveActive ? 'inactive' : 'paused'

        return (
          <StyledLegendItem
            onMouseEnter={() => onChangeHightlight([hookName])}
            onMouseLeave={() => onChangeHightlight(null)}
            key={key}
            $type={type}
          >
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
            <span className="text-sm">+{key}</span>
          </StyledLegendItem>
        )
      })}
    </div>
  )
}

export default Legend
