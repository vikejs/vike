import React, { type MouseEvent, useCallback, useMemo } from 'react'
import { landingPageHeroUsps } from '../../../util/constants'
import type { UspHoverTarget } from '../intro.types'

import useUspHero from './useUspHero'
import UspStaticContent from './StaticContent'
import UspStickyContent from './StickyContent'
import { SharedOuterGrid } from './styled'

// short circuit
const activeUspId = null

const UspHero = () => {
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
              data-usp-hero-interaction="true"
              data-usp-id={usp.id}
              className="relative z-300 cursor-pointer"
            />
          ))}
        </SharedOuterGrid>
      </div>
    </div>
  )
}
export default UspHero
