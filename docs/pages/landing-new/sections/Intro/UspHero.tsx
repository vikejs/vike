import React, { type MouseEvent, useEffect, useRef, useState } from 'react'
import { H3Headline } from '../../components/Headline'
import cm, { cmMerge } from '@classmatejs/react'
import { landingPageHeroUsps } from '../../util/constants'
import GradientText from '../../components/GradientText'
import { uiConfig, UiVariantBtnColor } from '../../util/ui.constants'
import { ChevronsRight } from 'lucide-react'
import type { UspHoverTarget } from './intro.types'

interface UspHeroProps {
  onHoverChange?: (hoverTarget: UspHoverTarget | null) => void
}

const UspHero = ({ onHoverChange }: UspHeroProps) => {
  const [hoveredUsp, setHoveredUsp] = useState<string | null>(null)
  const hoverLeaveTimeoutRef = useRef<number | null>(null)
  const clearHoverLeaveTimeout = () => {
    if (hoverLeaveTimeoutRef.current === null) {
      return
    }
    window.clearTimeout(hoverLeaveTimeoutRef.current)
    hoverLeaveTimeoutRef.current = null
  }

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>, uspId: string, dotColor: UspHoverTarget['color']) => {
    clearHoverLeaveTimeout()
    const rect = event.currentTarget.getBoundingClientRect()
    setHoveredUsp(uspId)
    onHoverChange?.({
      color: dotColor,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  const handleMouseLeave = () => {
    clearHoverLeaveTimeout()
    hoverLeaveTimeoutRef.current = window.setTimeout(() => {
      setHoveredUsp(null)
      onHoverChange?.(null)
      hoverLeaveTimeoutRef.current = null
    }, 90)
  }

  useEffect(() => {
    return () => {
      clearHoverLeaveTimeout()
    }
  }, [])

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-0 md:w-6/7 mx-auto">
        {landingPageHeroUsps.map((usp) => {
          const isHovered = hoveredUsp === usp.id
          const isMuted = hoveredUsp !== null && !isHovered

          return (
            <div
              className={cmMerge(
                'relative p-4 cursor-pointer transition-[filter,opacity] duration-250 ease-out',
                isMuted ? 'grayscale opacity-25' : 'grayscale-0 opacity-100',
              )}
              data-usp-color={usp.dotColor}
              data-usp-id={usp.id}
              key={usp.title}
              onMouseEnter={(event) => handleMouseEnter(event, usp.id, usp.dotColor)}
              onMouseLeave={handleMouseLeave}
            >
              <StyledUspItemInner $hovered={isHovered} />
              {/* <div className="absolute -inset-1 z-3 bg-linear-to-t to-base-300" /> */}
              <StyledTextContent $hovered={isHovered}>
                {/* todo: use more classmatejs */}
                <StyledIconWrapper>{usp.icon}</StyledIconWrapper>
                <div className="text-center h-full flex flex-col flex-1">
                  <div className="flex-1">
                    <H3Headline as="h2" className="mb-3">
                      <span className="relative block w-fit mx-auto">
                        <StyledTitleShape $hovered={isHovered}>{usp.title}</StyledTitleShape>
                        <StyledTitle className={'absolute left-0 top-0 transition-opacity'}>
                          <GradientText color={usp.dotColor}>{usp.title}</GradientText>
                        </StyledTitle>
                      </span>
                    </H3Headline>
                    <p className="text-lg">{usp.description}</p>
                  </div>
                  <span
                    className={cmMerge(
                      UiVariantBtnColor[usp.dotColor],
                      'btn btn-sm btn-ghost opacity-75 pointer-events-none',
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
    </div>
  )
}
export default UspHero

const StyledUspItemInner = cm.div<{ $hovered?: boolean }>`
  pointer-events-none
  flex items-center
  absolute p-4 inset-0
  shadow-lg shadown-neutral/6
  transition-all rounded-box 
  origin-bottom-center
  bg-white
  opacity-0
  scale-95
  translate-y-1
  z-3
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeOutTw}
  ${({ $hovered }) => ($hovered ? 'scale-100 translate-y-0 opacity-70' : '')}
`

const StyledTitleShape = cm.span<{ $hovered?: boolean }>`
  transition-opacity z-3 relative
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeOutTw}
  ${({ $hovered }) => ($hovered ? `opacity-30` : `opacity-0`)}
`

const StyledTitle = cm.span`
  absolute left-0 top-0
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeOutTw}
`

const StyledIconWrapper = cm.div`
  text-3xl md:text-5xl lg:text-7xl 
  text-center block mb-2
`

const StyledTextContent = cm.div<{ $hovered?: boolean }>`
  relative z-6
  transition-transform
  min-h-56
  flex flex-col justify-between
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeOutTw}
  ${({ $hovered }) => ($hovered ? `-translate-y-1` : `translate-y-0`)}
`
