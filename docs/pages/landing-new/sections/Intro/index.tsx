import React, { useEffect, useRef, useState } from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText, { defaultGradients } from '../../components/GradientText'
import UspHero from './UspHero'
import Headline from '../../components/Headline'
import BrandSubsection from './BrandSubsection'
import HeroBackgroundColorFade from './HeroBackgroundColorFade'
import type { UspHoverTarget } from './intro.types'
import useIntroHeadlineGradientMotion from './useIntroHeadlineGradientMotion'
import useMotionAllowed from '../../hooks/useMotionAllowed'
import { landingPageHeroUsps } from '../../util/constants'
import { UiColorVariantKey, UiVariantTextColor } from '../../util/ui.constants'

const slideshowStepDurationMs = 4200
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
    <span className="relative inline-block min-h-20">
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
  const [slideshowState, setSlideshowState] = useState({ index: 0, cycle: 0 })
  const [isSlideshowActive, setIsSlideshowActive] = useState(false)
  const getStartedButtonRef = useRef<HTMLAnchorElement>(null)
  const isMotionAllowed = useMotionAllowed()
  const shouldAnimateIntro = isMotionAllowed && isSlideshowActive
  const slideshowUsp = landingPageHeroUsps[slideshowState.index] ?? landingPageHeroUsps[0]
  const activeColor = manualHoverTarget?.color ?? slideshowUsp?.dotColor ?? 'blue'
  const activeHeadlineWord = UiColorVariantKey[activeColor]
  const activeUspId = manualHoverTarget?.id ?? slideshowUsp?.id ?? null
  const isSlideshowMode = manualHoverTarget === null

  useEffect(() => {
    if (!isSlideshowMode || !shouldAnimateIntro || landingPageHeroUsps.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      setSlideshowState((prevState) => ({
        index: (prevState.index + 1) % landingPageHeroUsps.length,
        cycle: prevState.cycle + 1,
      }))
    }, slideshowStepDurationMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isSlideshowMode, shouldAnimateIntro])

  useEffect(() => {
    if (shouldAnimateIntro) {
      return
    }
    setManualHoverTarget(null)
  }, [shouldAnimateIntro])

  const handleUspHoverChange = (hoverTarget: UspHoverTarget | null) => {
    if (hoverTarget) {
      setManualHoverTarget(hoverTarget)
      const hoveredIndex = landingPageHeroUsps.findIndex((usp) => usp.id === hoverTarget.id)
      if (hoveredIndex >= 0) {
        setSlideshowState((prevState) => ({ ...prevState, index: hoveredIndex }))
      }
      return
    }

    setManualHoverTarget(null)
    setSlideshowState((prevState) => ({ ...prevState, cycle: prevState.cycle + 1 }))
  }

  useIntroHeadlineGradientMotion({
    ctaButtonRef: getStartedButtonRef,
    hoveredColor: activeColor,
  })

  return (
    <>
      <div data-intro-section-root="true" className="relative">
        <div className="absolute top-0 left-0 h-1/2 w-full bg-linear-to-t to-white z-10" />
        <HeroBackgroundColorFade hoveredColor={activeColor} />
        <LayoutComponent
          $size="md"
          className="flex flex-col items-center text-center lg:min-h-[calc(100dvh-56*var(--spacing))] pb-20 overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            <span className="inline-flex flex-col sm:flex-row gap-1 mx-auto mb-4 mt-20">
              <span className="block badge badge-neutral badge-ghost badge-sm">⭐️ Replaces Next.js / Nuxt / ...</span>
              <span className="block badge badge-neutral badge-ghost badge-sm">🏗️ Powered By Vite</span>
            </span>
            <div className="relative">
              <Headline as="h1" variant="xlarge" className="mb-4">
                <HeadlineWord word="Flexible." isActive={activeHeadlineWord === 'green'} color="green" />{' '}
                <HeadlineWord word="Reliable." isActive={activeHeadlineWord === 'blue'} color="blue" />{' '}
                <HeadlineWord word="Fast." isActive={activeHeadlineWord === 'orange'} color="orange" />
              </Headline>
            </div>
            <p className="text-xl md:text-2xl text-grey text-center w-3/4 lg:w-3/5 mx-auto mb-6">
              The last JavaScript framework you'll need, powered by a next-gen architecture.
            </p>
            <div className="flex gap-2 items-center justify-center mb-16">
              <a
                ref={getStartedButtonRef}
                className="btn text-white border-0"
                style={
                  {
                    '--gradient-start': defaultGradients[initialCtaColor].startColor,
                    '--gradient-end': defaultGradients[initialCtaColor].endColor,
                    background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end))',
                  } as React.CSSProperties
                }
              >
                Get Started
              </a>
              <a className="btn btn-neutral btn-outline">Scaffold new App</a>
            </div>
            <UspHero
              onHoverChange={handleUspHoverChange}
              activeUspId={activeUspId}
              slideshowCycle={slideshowState.cycle}
              slideshowDurationMs={slideshowStepDurationMs}
              isSlideshowMode={isSlideshowMode}
              animationsEnabled={shouldAnimateIntro}
              onSlideshowActiveChange={setIsSlideshowActive}
            />
          </div>
        </LayoutComponent>
      </div>
      <LayoutComponent className="relative z-2">
        <BrandSubsection />
      </LayoutComponent>
    </>
  )
}

export default IntroSection
