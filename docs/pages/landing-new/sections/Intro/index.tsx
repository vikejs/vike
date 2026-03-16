import React, { useRef, useState } from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import UspHero from './UspHero'
import Headline from '../../components/Headline'
import BrandSubsection from './BrandSubsection'
import type { UspHoverTarget } from './intro.types'
import useIntroHeadlineGradientMotion from './useIntroHeadlineGradientMotion'
import { UiColorVariantKey, UiVariantTextColor } from '../../util/ui.constants'
import UspHeroMobile from './UspHero/UspHeroMobile'

const initialCtaColor: UiColorVariantKey = 'green'

const HeadlineWord = ({
  word,
  isActive,
  color,
}: {
  word: string
  isActive: boolean
  color: UiColorVariantKey
}) => {
  return (
    <span className="relative inline-block">
      <span
        className={`${UiVariantTextColor.neutral} transition-opacity duration-450 ease-in-out ${isActive ? 'opacity-0' : 'opacity-100'}`}
      >
        {word}
      </span>
      <GradientText
        color={color}
        className={`absolute inset-0 transition-opacity duration-450 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
      >
        {word}
      </GradientText>
    </span>
  )
}

const IntroSection = () => {
  const [manualHoverTarget, setManualHoverTarget] = useState<UspHoverTarget | null>(null)
  const [lastHoveredColor, setLastHoveredColor] = useState<UiColorVariantKey>(initialCtaColor)
  const getStartedButtonRef = useRef<HTMLAnchorElement>(null)
  const activeColor = manualHoverTarget?.color ?? lastHoveredColor
  const fadeColor = manualHoverTarget?.color ?? null
  const activeHeadlineWord = UiColorVariantKey[activeColor]
  const activeUspId = manualHoverTarget?.id ?? null

  const handleUspHoverChange = (hoverTarget: UspHoverTarget | null) => {
    if (hoverTarget) {
      setLastHoveredColor(hoverTarget.color)
    }
    setManualHoverTarget(hoverTarget)
  }

  useIntroHeadlineGradientMotion({
    ctaButtonRef: getStartedButtonRef,
    hoveredColor: activeColor,
  })

  return (
    <>
      <div data-intro-section-root="true" className="relative">
        {/* <div className="absolute top-0 left-0 h-1/2 w-full bg-linear-to-t to-white z-10" /> */}
        <LayoutComponent
          $size="md"
          className="flex flex-col items-center text-center min-h-[calc(100svh-48*var(--spacing))]  overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            <span className="inline-flex sm:flex-row gap-1 mb-4 mt-6 lg:mt-16 xl:mt-20">
              <span className="block badge badge-neutral badge-ghost badge-xs md:badge-sm">
                ⭐️ Replaces Next.js / Nuxt / ...
              </span>
              <span className="block badge badge-neutral badge-ghost badge-xs md:badge-sm">🏗️ Powered By Vite</span>
            </span>
            <div className="relative">
              <Headline as="h1" variant="xlarge">
                Build <GradientText color="orange">fast</GradientText>, build{' '}
                <GradientText color="blue">right</GradientText>
                {/* <HeadlineWord word="Flexible." isActive={activeHeadlineWord === 'green'} color="green" />{' '}
                <HeadlineWord word="Reliable." isActive={activeHeadlineWord === 'blue'} color="blue" />{' '}
                <HeadlineWord word="Fast." isActive={activeHeadlineWord === 'orange'} color="orange" /> */}
              </Headline>
            </div>
            <p className="text-base md:text-2xl text-grey text-center w-3/4 lg:w-3/5 mx-auto mb-6 mt-4">
              The last JavaScript framework you'll need, <br className="hidden md:block" /> powered by a next-gen
              architecture.
            </p>
            <div className="flex gap-2 items-center justify-center mb-8 sm:mb-12">
              <a
                ref={getStartedButtonRef}
                className="btn btn-sm md:btn-md text-white border-0 btn-neutral"
                // style={
                //   {
                //     '--gradient-start': defaultGradients[initialCtaColor].startColor,
                //     '--gradient-end': defaultGradients[initialCtaColor].endColor,
                //     background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end))',
                //   } as React.CSSProperties
                // }
              >
                Get Started
              </a>
              <a className="btn btn-sm md:btn-md btn-neutral btn-outline">Scaffold new App</a>
            </div>
            <UspHero onHoverChange={handleUspHoverChange} activeUspId={activeUspId} />
            <UspHeroMobile />
          </div>
        </LayoutComponent>
      </div>
      <div className="w-full">
        <LayoutComponent className="relative z-2">
          <BrandSubsection />
        </LayoutComponent>
      </div>
    </>
  )
}

export default IntroSection
