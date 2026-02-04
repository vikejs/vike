import React, { useState } from 'react'
import BlurDot from '../../components/BlurDot'
import { H3Headline } from '../../components/Headline'
import cm, { cmMerge } from '@classmatejs/react'
import { landingPageHeroUsps } from '../../util/constants'
import GradientText from '../../components/GradientText'
import { BlurDotOpacity } from '../../util/ui.constants'

const UspHero = () => {
  const [hoveredUsp, setHoveredUsp] = useState<string | null>(null)

  return (
    <div className='w-full'>
    <div className="grid grid-cols-3 gap-2 md:w-6/7 mx-auto">
      {landingPageHeroUsps.map((usp) => {
        const isHovered = hoveredUsp === usp.id

        return (
          <div
            className="relative p-4 cursor-pointer"
            key={usp.title}
            onMouseEnter={() => setHoveredUsp(usp.id)}
            onMouseLeave={() => setHoveredUsp(null)}
          >
            <StyledUspItemInner $hovered={isHovered} />
            <div className="absolute inset-0 flex justify-center items-center z-2">
              <StyledDot type={usp.dotColor} size="lg" visibility="high" $hovered={isHovered} />
            </div>
            <div className="absolute h-full -inset-3 z-1 bg-linear-to-t to-base-300" />
            <StyledTextContent $hovered={isHovered}>
              {/* todo: use more classmatejs */}
              <div className="text-3xl md:text-5xl lg:text-7xl text-center block mb-2">{usp.icon}</div>
              <div className="text-center">
                <H3Headline as="h2" className="mb-3">
                  <span className="relative block w-fit mx-auto">
                    <span
                      className={cmMerge(isHovered ? 'opacity-30' : 'opacity-0', 'transition-opacity  z-3 relative')}
                    >
                      {usp.title}
                    </span>
                    <span
                      className={cmMerge(
                        'absolute left-0 top-0',
                        isHovered ? 'opacity-100' : 'opacity-100',
                        'transition-opacity',
                      )}
                    >
                      <GradientText color={usp.dotColor}>{usp.title}</GradientText>
                    </span>
                  </span>
                </H3Headline>
                <p className="text-grey-100">{usp.description}</p>
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
  shadow-lg shadow-base-200
  transition-all rounded-box 
  origin-bottom-center
  bg-white
  opacity-0
  translate-y-1
  ${({ $hovered }) => ($hovered ? 'scale-102 translate-y-0 opacity-100' : '')}
`

const StyledDot = cm.extend(BlurDot)<{ $hovered?: boolean }>`
  -mt-20 
  transition-all
  ${({ $hovered }) => ($hovered ? `-translate-y-4 scale-120 ${BlurDotOpacity.medium}` : `translate-y-0 scale-100 ${BlurDotOpacity.low}`)}
`

const StyledTextContent = cm.div<{ $hovered?: boolean }>`
  relative z-3
  transition-transform
  ${({ $hovered }) => ($hovered ? `-translate-y-1` : `translate-y-0`)}
`
