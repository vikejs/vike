import React from 'react'
import { landingPageHeroUsps, UspId } from '../../../util/constants'
import cm, { cmMerge } from '@classmatejs/react'
import { uiConfig, UiVariantBtnColor } from '../../../util/ui.constants'

import BlurDot from '../../../components/BlurDot'
import GradientText from '../../../components/GradientText'
import { ChevronsDown } from 'lucide-react'
import { SharedOuterGrid } from './styled'

interface UspStaticContentProps {
  uspVisualStateById: Map<
    UspId,
    {
      isActive: boolean
      toneClass: string
    }
  >
}

const UspStaticContent = ({ uspVisualStateById }: UspStaticContentProps) => (
  <SharedOuterGrid className="pb-10">
    {landingPageHeroUsps.map((usp) => {
      const visualState = uspVisualStateById.get(usp.id)
      const toneClass = visualState?.toneClass ?? 'grayscale-0 opacity-100'
      const isHovered = !!visualState?.isActive

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
            {/* <img
              src={ledgeGraphic}
              alt=""
              data-usp-ledge="true"
              className="absolute w-full h-full z-2 object-fill hidden md:block"
            /> */}
          </StyledUspItemInner>
          <BlurDot
            type={usp.dotColor}
            size="md"
            visibility="low"
            className="left-1/2 top-14 z-4 -translate-x-1/2 -translate-y-40"
          />

          <div data-usp-content-progress-track={usp.id} className="relative h-0.5 w-18 mx-auto mb-2 rounded-full" />

          <StyledTextContent $hovered={isHovered}>
            <div data-usp-copy-large="true" className="text-center h-full flex flex-col flex-1">
              <div className="flex-1 ">
                <StyledHeadline>
                  <span className="relative block w-fit mx-auto">
                    <StyledTitleShape $hovered={isHovered}>{usp.title}</StyledTitleShape>
                    <StyledTitle className={'absolute left-0 top-0 transition-opacity'}>
                      <GradientText color={usp.dotColor}>{usp.title}</GradientText>
                    </StyledTitle>
                  </span>
                </StyledHeadline>
                <p className="">{usp.description}</p>
              </div>
              <span
                className={cmMerge(
                  UiVariantBtnColor[usp.dotColor],
                  'btn btn-sm btn-ghost opacity-100 pointer-events-none',
                )}
              >
                <ChevronsDown className="inline-block w-3 h-3" />
                Learn more
                <ChevronsDown className="inline-block w-3 h-3" />
              </span>
            </div>
          </StyledTextContent>
        </div>
      )
    })}
  </SharedOuterGrid>
)

export default UspStaticContent

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

const StyledTextContent = cm.div<{ $hovered?: boolean }>`
  relative z-6
  transition-transform
  text-sm lg:text-base 
  flex flex-col justify-between
  pointer-events-none
  min-h-24 lg:min-h-26
  mt-8
  ${uiConfig.transition.mediumDurationTw}
  ${uiConfig.transition.easeInOutTw}
  ${({ $hovered }) => ($hovered ? `-translate-y-0.5` : `translate-y-0`)}
`

const StyledHeadline = cm.h2`
  text-center
  mb-2
  relative
  z-10
  text-xl! lg:text-2xl!
  font-bold
`
