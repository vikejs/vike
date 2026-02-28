import React, { type MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react'
import { H3Headline } from '../../../components/Headline'
import cm, { cmMerge } from '@classmatejs/react'
import { landingPageHeroUsps } from '../../../util/constants'
import GradientText from '../../../components/GradientText'
import { uiConfig, UiVariantBgColor, UiVariantBtnColor } from '../../../util/ui.constants'
import { ChevronsRight } from 'lucide-react'
import type { UspHoverTarget } from '../intro.types'
import BlurDot from '../../../components/BlurDot'
import ledgeGraphic from '../../../assets/decorators/box/ledge.png'
import useUspHero from './useUspHero'
import vikeLogo from '../../../../../assets/logo/vike.svg'

interface UspHeroProps {
  activeUspId: string | null
  onHoverChange?: (hoverTarget: UspHoverTarget | null) => void
}

const UspHero = ({ onHoverChange, activeUspId }: UspHeroProps) => {
  const hoverLeaveTimeoutRef = useRef<number | null>(null)
  const { rootRef } = useUspHero()

  const highlightedUspId = activeUspId
  const uspVisualStateById = useMemo(() => {
    return new Map(
      landingPageHeroUsps.map((usp) => {
        const isActive = highlightedUspId === usp.id
        const isMuted = highlightedUspId !== null && !isActive
        return [
          usp.id,
          {
            isActive,
            toneClass: isMuted ? 'grayscale opacity-65' : 'grayscale-0 opacity-100',
          },
        ] as const
      }),
    )
  }, [highlightedUspId])

  const clearHoverLeaveTimeout = useCallback(() => {
    if (hoverLeaveTimeoutRef.current === null) {
      return
    }
    window.clearTimeout(hoverLeaveTimeoutRef.current)
    hoverLeaveTimeoutRef.current = null
  }, [])

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLDivElement>, uspId: string, dotColor: UspHoverTarget['color']) => {
      clearHoverLeaveTimeout()
      const rect = event.currentTarget.getBoundingClientRect()
      onHoverChange?.({
        id: uspId,
        color: dotColor,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    },
    [clearHoverLeaveTimeout, onHoverChange],
  )

  const handleMouseLeave = useCallback(() => {
    clearHoverLeaveTimeout()
    hoverLeaveTimeoutRef.current = window.setTimeout(() => {
      onHoverChange?.(null)
      hoverLeaveTimeoutRef.current = null
    }, 90)
  }, [clearHoverLeaveTimeout, onHoverChange])

  useEffect(() => {
    return () => {
      clearHoverLeaveTimeout()
    }
  }, [clearHoverLeaveTimeout])

  return (
    <div ref={rootRef} className="w-full" data-usp-hero>
      <div className="fixed w-full h-24 top-0 left-0 z-20 bg-linear-to-t to-95% to-base-300 pointer-events-none" />
      <div data-usp-hero-nav="true" className="relative z-30 py-2">
        <div
          data-usp-hero-nav-chrome="true"
          className="pointer-events-none absolute left-1/2 top-0 z-9 h-16 w-full max-w-[1100px] -translate-x-1/2 shadow-neutral/10 shadow-lg rounded-box opacity-0 overflow-hidden bg-white/95"
        >
          <div className="relative z-10 grid grid-cols-3 md:w-6/7 mx-auto px-2">
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
        </div>

        {/* sticky */}
        <div
          data-usp-sticky-logo="true"
          className="pointer-events-none absolute top-0 z-30 flex h-16 w-20 items-center"
        >
          <img src={vikeLogo} alt="" className="ml-4 h-auto w-10" />
        </div>

        <div className="relative z-10 grid grid-cols-3 md:w-6/7 mx-auto px-2">
          {landingPageHeroUsps.map((usp) => {
            const visualState = uspVisualStateById.get(usp.id)
            const toneClass = visualState?.toneClass ?? 'grayscale-0 opacity-100'

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
                    className="top-9 absolute mt-2 h-0.5 w-16 rounded-full bg-base-content/3 overflow-hidden"
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

      {/* static scrolling */}
      <div className="relative z-10 grid grid-cols-3 md:w-6/7 mx-auto px-2 py-2 ">
        {landingPageHeroUsps.map((usp) => {
          const visualState = uspVisualStateById.get(usp.id)
          const toneClass = visualState?.toneClass ?? 'grayscale-0 opacity-100'
          const isHovered = visualState?.isActive ?? false

          return (
            <div
              className={cmMerge(
                `relative cursor-pointer transition-[filter,opacity] ${uiConfig.transition.mediumDurationTw} ${uiConfig.transition.easeInOutTw} rounded-lg -mt-5 `,
                toneClass,
              )}
              data-usp-content-hit="true"
              data-usp-color={usp.dotColor}
              data-usp-id={usp.id}
              key={usp.title}
            >
              {/* <div className="absolute right-0 left-0 -top-40 -bottom-50" /> */}
              <StyledUspItemInner $hovered={isHovered}>
                <img
                  src={ledgeGraphic}
                  alt=""
                  data-usp-ledge="true"
                  className="absolute w-full h-full z-2 object-fill"
                />
              </StyledUspItemInner>
              <BlurDot
                type={usp.dotColor}
                size="md"
                visibility="low"
                className="left-1/2 top-0 z-4 -translate-x-1/2 -translate-y-40"
              />

              <div data-usp-content-progress-track={usp.id} className="relative h-0.5 w-18 mx-auto mb-2 rounded-full" />

              <StyledTextContent $hovered={isHovered}>
                <div data-usp-copy-large="true" className="text-center h-full flex flex-col flex-1 p-5 pt-2">
                  <div className="flex-1 ">
                    <H3Headline as="h2" className="mb-2">
                      <span className="relative block w-fit mx-auto">
                        <StyledTitleShape $hovered={isHovered}>{usp.title}</StyledTitleShape>
                        <StyledTitle className={'absolute left-0 top-0 transition-opacity'}>
                          <GradientText color={usp.dotColor}>{usp.title}</GradientText>
                        </StyledTitle>
                      </span>
                    </H3Headline>
                    <p className="xl:text-lg">{usp.description}</p>
                  </div>
                  <span
                    className={cmMerge(
                      UiVariantBtnColor[usp.dotColor],
                      'btn btn-sm btn-ghost opacity-100 pointer-events-none',
                    )}
                  >
                    Learn more
                    <ChevronsRight className="inline-block w-3 h-3" />
                  </span>
                </div>
              </StyledTextContent>
            </div>
          )
        })}
      </div>
      <div className="relative h-1 w-full left-0 -top-80 z-50 md:w-6/7 mx-auto">
        <div className="z-40 grid grid-cols-3 gap-0 mx-auto w-full min-h-80 absolute top-0">
          {landingPageHeroUsps.map((usp) => (
            <div
              key={`${usp.id}-interaction`}
              className="relative z-300 cursor-pointer"
              onMouseEnter={(event) => handleMouseEnter(event, usp.id, usp.dotColor)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
export default UspHero

const StyledUspItemInner = cm.div<{ $hovered?: boolean }>`
  pointer-events-none
  flex items-center
  absolute inset-0
  transition-[scale,opacity, transform]
  origin-bottom-center
  opacity-0
  scale-100
  translate-y-1
  z-3
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeInOutTw}
  ${({ $hovered }) => ($hovered ? 'scale-104 translate-y-0 opacity-80' : '')}
`

const StyledTitleShape = cm.span<{ $hovered?: boolean }>`
  transition-opacity z-3 relative
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeInOutTw}
  ${({ $hovered }) => ($hovered ? `opacity-20` : `opacity-0`)}
`

const StyledTitle = cm.span`
  absolute left-0 top-0
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeInOutTw}
`

const StyledIconWrapper = cm.div`
  text-5xl lg:text-7xl 
  text-center block mb-2
`

const StyledTextContent = cm.div<{ $hovered?: boolean }>`
  relative z-6
  transition-transform

  flex flex-col justify-between
  pointer-events-none
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeInOutTw}
  ${({ $hovered }) => ($hovered ? `-translate-y-1` : `translate-y-0`)}
`
