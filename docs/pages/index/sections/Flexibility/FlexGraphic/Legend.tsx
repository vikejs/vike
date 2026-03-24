import React from 'react'
import { Link } from '@brillout/docpress'

import { flexGraphicHookRoutes, FlexGraphicHook } from '../../../util/constants'
import { StyledLegendItem } from './styled'
import { hookColors } from '../../../util/ui.constants'

interface LegendProps {
  onChangeHighlight: (hooks: FlexGraphicHook[] | null) => void
  activeHooks: FlexGraphicHook[] | null
  isSlideshowMode: boolean
}

const Legend = ({ onChangeHighlight, activeHooks, isSlideshowMode }: LegendProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 md:pr-4">
      {Object.entries(hookColors).map(([key, color]) => {
        const hookName = key as FlexGraphicHook
        const isActive = activeHooks?.includes(hookName)
        const isInteractiveActive = !isSlideshowMode && activeHooks?.length
        const type = isActive ? 'active' : isSlideshowMode ? 'disabled' : isInteractiveActive ? 'inactive' : 'paused'

        return (
          <Link href={flexGraphicHookRoutes[hookName]} key={key} className="text-inherit">
          <StyledLegendItem $type={type}>
            {/* extra hover area -> prevent style jitter on hover */}
            <div
              onMouseEnter={() => onChangeHighlight([hookName])}
              onMouseLeave={() => onChangeHighlight(null)}
              className="absolute inset-0"
            />
            <div className="w-1 md:w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
            <span className="text-xs">+{key}</span>
          </StyledLegendItem>
          </Link>
        )
      })}
    </div>
  )
}

export default Legend
