import cm, { cmMerge } from '@classmatejs/react'
import React from 'react'
import vikeLogo from '../../../../../assets/logo/vike.svg'
import { landingPageHeroUsps, UspId } from '../../../util/constants'
import { uiConfig, UiVariantBgColor } from '../../../util/ui.constants'
import BlurDot from '../../../components/BlurDot'
import { SharedOuterGrid } from './styled'
import GradientText from '../../../components/GradientText'

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
          <SharedOuterGrid>
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
          </SharedOuterGrid>
        </StyledHeroChrome>

        <div
          data-usp-sticky-logo="true"
          className="pointer-events-none absolute top-0 z-30 hidden lg:flex h-16 w-20 items-center opacity-0 "
        >
          <img src={vikeLogo} alt="" className="ml-4 h-auto w-10" />
        </div>

        <SharedOuterGrid>
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
                  `h-16 -mt-2 relative cursor-pointer transition-[filter,opacity] ${uiConfig.transition.mediumDurationTw} ${uiConfig.transition.easeInOutTw} rounded-lg`,
                  toneClass,
                )}
              >
                <div
                  data-usp-extra-hitbox="true"
                  data-usp-id={usp.id}
                  className="absolute w-full h-full translate-x-20 text-left pl-16 pt-4.5 hidden lg:block opacity-0"
                >
                  <GradientText color={usp.dotColor} className="text-center font-bold">
                    {usp.title}
                  </GradientText>
                </div>
                <div className="pointer-events-none relative z-8 flex flex-col items-center pt-4">
                  <StyledIconWrapper data-usp-icon="true" data-usp-icon-id={usp.id}>
                    {usp.icon}
                  </StyledIconWrapper>
                  {/* <div className="absolute left-[40%] top-3 w-50 hidden lg:block">
                    <GradientText color={usp.dotColor} className="text-center font-bold">
                      {usp.title}
                    </GradientText>
                  </div> */}
                  <div
                    data-usp-sticky-progress-track={usp.id}
                    className={cmMerge(
                      `top-12 lg:left-24 w-32 lg:w-44 absolute mt-2 h-0.5 rounded-full bg-base-content/3 transition-opacity ${uiConfig.transition.mediumDurationTw} ${uiConfig.transition.easeInOutTw}`,
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
        </SharedOuterGrid>
        {/* the real hitboxes and titles here.. */}
        {/* <div className='bg-error absolute w-full h-16 top-0 left-0'>
          <SharedOuterGrid className='items-start translate-x-20 !gap-10 mt-7'>
              {landingPageHeroUsps.map((usp) => {
                return (
                  <div
                    key={`${usp.id}-sticky-hitbox`}
                    className="h-16 bg-warning text-left"
                  >
                    <div className="mt-4 hidden lg:block">
                      <GradientText color={usp.dotColor} className="text-left font-bold">
                        {usp.title}
                      </GradientText>
                    </div>
                  </div>
                )
              })}
          </SharedOuterGrid>
        </div> */}
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
