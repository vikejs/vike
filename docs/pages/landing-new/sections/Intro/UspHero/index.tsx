import React, { type MouseEvent, useCallback, useMemo } from 'react'
import { landingPageHeroUsps } from '../../../util/constants'
import type { UspHoverTarget } from '../intro.types'

import useUspHero from './useUspHero'
import UspStaticContent from './StaticContent'
import UspStickyContent from './StickyContent'
import { SharedOuterGrid } from './styled'

interface UspHeroProps {
  activeUspId: string | null
  onHoverChange?: (hoverTarget: UspHoverTarget | null) => void
}

const UspHero = ({ onHoverChange, activeUspId }: UspHeroProps) => {
  const { rootRef, activeSectionId, isCompactDocked } = useUspHero()
  const effectiveActiveUspId = activeUspId ?? activeSectionId

  const uspVisualStateById = useMemo(() => {
    const shouldMuteAllUsps = isCompactDocked && effectiveActiveUspId === null

    return new Map(
      landingPageHeroUsps.map((usp) => {
        const isActive = effectiveActiveUspId === usp.id
        const isMuted = shouldMuteAllUsps || (effectiveActiveUspId !== null && !isActive)
        return [
          usp.id,
          {
            isActive,
            toneClass: isMuted ? 'grayscale opacity-65' : 'grayscale-0 opacity-100',
          },
        ] as const
      }),
    )
  }, [effectiveActiveUspId, isCompactDocked])

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLDivElement>, uspId: string, dotColor: UspHoverTarget['color']) => {
      const rect = event.currentTarget.getBoundingClientRect()
      onHoverChange?.({
        id: uspId,
        color: dotColor,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    },
    [onHoverChange],
  )

  const handleMouseLeave = useCallback(() => {
    onHoverChange?.(null)
  }, [onHoverChange])

  return (
    <div ref={rootRef} className="w-full hidden sm:block" data-usp-hero>
      {/* sticky */}
      <UspStickyContent isCompactDocked={isCompactDocked} uspVisualStateById={uspVisualStateById} />

      {/* static scrolling */}
      <UspStaticContent uspVisualStateById={uspVisualStateById} />

      <div className="relative h-1 w-full left-0 -top-80 z-50 mx-auto">
        <SharedOuterGrid className="z-40 min-h-80 top-0">
          {landingPageHeroUsps.map((usp) => (
            <div
              key={`${usp.id}-interaction`}
              className="relative z-300 cursor-pointer"
              onMouseEnter={(event) => handleMouseEnter(event, usp.id, usp.dotColor)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </SharedOuterGrid>
      </div>
    </div>
  )
}
export default UspHero
