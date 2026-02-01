import React from 'react'
import cm from '@classmatejs/react'

import { FlexGraphicHookName, HOOK_COLORS } from '../../../util/constants'

interface LegendProps {
  onChangeHightlight: (hooks: FlexGraphicHookName[] | null) => void
  activeHooks: FlexGraphicHookName[] | null
  isSlideshowMode: boolean
}

const Legend = ({ onChangeHightlight, activeHooks, isSlideshowMode }: LegendProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 mb-4">
      {Object.entries(HOOK_COLORS).map(([key, color]) => {
        const hookName = key as FlexGraphicHookName
        const isActive = activeHooks?.includes(hookName)
        const isInteractiveActive = !isSlideshowMode && activeHooks?.length
        const type = isActive ? 'active' : isSlideshowMode ? 'disabled' : isInteractiveActive ? 'inactive' : 'active'

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

const StyledLegendItem = cm.div.variants<{ $type: 'disabled' | 'active' | 'inactive' }>({
  base: `
    transition-opacity 
    flex items-center gap-2 
    p-1
  `,
  variants: {
    $type: {
      disabled: 'opacity-50',
      active: 'opacity-100 font-bold',
      inactive: 'opacity-75',
    },
  },
  defaultVariants: {
    $type: 'disabled',
  },
})
