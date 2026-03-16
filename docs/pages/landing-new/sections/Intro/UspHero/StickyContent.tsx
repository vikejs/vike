import cm, { cmMerge } from '@classmatejs/react'
import React from 'react'
import vikeLogo from '../../../../../assets/logo/vike.svg'
import { landingPageHeroUsps, UspId } from '../../../util/constants'
import { uiConfig, UiVariantBgColor } from '../../../util/ui.constants'
import BlurDot from '../../../components/BlurDot'

interface UspStickyContentProps {
  isCompactDocked: boolean
  uspVisualStateById: Map<
    UspId,
    {
      isActive: boolean
      toneClass: string
    }
  >
}

const UspStickyContent = ({ isCompactDocked, uspVisualStateById }: UspStickyContentProps) => {
  return (
    <>
      <div className="fixed w-full h-24 top-0 left-0 z-20 bg-linear-to-t to-95% to-base-300 pointer-events-none" />
      <div data-usp-hero-nav="true" className="relative z-30 py-2">
        <StyledHeroChrome data-usp-hero-nav-chrome="true">
          <div className="relative z-10 grid grid-cols-3 md:w-6/7 mx-auto">
            {landingPageHeroUsps.map((usp) => {
              const visualState = uspVisualStateById.get(usp.id)
              const toneClass = visualState?.toneClass ?? 'grayscale-0 opacity-100'

              return (
                <div
                  key={`${usp.id}-nav`}
                  data-usp-nav-hit="true"
                  data-usp-id={usp.id}
                  className={cmMerge(
                    `z-1 relative transition-[filter,opacity] ${uiConfig.transition.mediumDurationTw} ${uiConfig.transition.easeInOutTw} rounded-lg`,
                    toneClass,
                  )}
                >
                  <div data-usp-scroll-dot={usp.id}>
                    <BlurDot
                      type={usp.dotColor}
                      size="sm"
                      visibility="low"
                      className="left-1/2 top-8 -translate-x-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </StyledHeroChrome>

        <div
          data-usp-sticky-logo="true"
          className="pointer-events-none absolute top-0 z-30 flex h-16 w-20 items-center"
        >
          <img src={vikeLogo} alt="" className="ml-4 h-auto w-10" />
        </div>

        <div className="relative z-10 grid grid-cols-3 md:w-6/7 mx-auto gap-10">
          {landingPageHeroUsps.map((usp) => {
            const visualState = uspVisualStateById.get(usp.id)
            const toneClass = visualState?.toneClass ?? 'grayscale-0 opacity-100'
            const showStickyProgress = isCompactDocked && visualState?.isActive

            return (
              <div
                key={`${usp.id}-sticky`}
                data-usp-sticky-hit="true"
                data-usp-id={usp.id}
                className={cmMerge(
                  `relative cursor-pointer transition-[filter,opacity] ${uiConfig.transition.mediumDurationTw} ${uiConfig.transition.easeInOutTw} rounded-lg`,
                  toneClass,
                )}
              >
                <div className="pointer-events-none relative z-8 flex flex-col items-center pt-2">
                  <StyledIconWrapper data-usp-icon="true" data-usp-icon-id={usp.id}>
                    {usp.icon}
                  </StyledIconWrapper>
                  <div
                    data-usp-sticky-progress-track={usp.id}
                    className={cmMerge(
                      `top-10 absolute mt-2 h-0.5 w-16 rounded-full bg-base-content/3 overflow-hidden transition-opacity ${uiConfig.transition.mediumDurationTw} ${uiConfig.transition.easeInOutTw}`,
                      showStickyProgress ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    <div
                      data-usp-sticky-progress-fill={usp.id}
                      data-usp-scroll-progress-fill={usp.id}
                      className={cmMerge(
                        'h-full w-full rounded-full origin-left scale-x-0 opacity-55',
                        UiVariantBgColor[usp.dotColor],
                      )}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default UspStickyContent

const StyledIconWrapper = cm.div`
  text-6xl
  text-center block mb-2
`

const StyledHeroChrome = cm.div`
  pointer-events-none 
  absolute 
  left-1/2 
  top-0 
  z-9 
  h-16 w-full
   max-w-[1100px] 
  -translate-x-1/2 
  shadow-neutral/10 shadow-lg 
  rounded-box opacity-0 
  overflow-hidden 
  bg-white/95
`
