import React, { useEffect, useRef, useState } from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText, { defaultGradients } from '../../components/GradientText'
import UspHero from './UspHero'
import Headline from '../../components/Headline'
import BrandSubsection from './BrandSubsection'
import HeroBackgroundMotion from './HeroBackgroundMotion'
import HeroBackgroundColorFade from './HeroBackgroundColorFade'
import type { IntroBlobColor, UspHoverTarget } from './intro.types'
import useIntroHeadlineGradientMotion from './useIntroHeadlineGradientMotion'
import { landingPageHeroUsps } from '../../util/constants'
import { UiVariantTextColor } from '../../util/ui.constants'

const motionColors: IntroBlobColor[] = ['green', 'blue', 'orange']
const slideshowStepDurationMs = 4200
const initialCtaColor: IntroBlobColor = 'green'
type HeadlineKeyword = 'reliable' | 'empowering' | 'fast'
const activeHeadlineWordByColor: Record<IntroBlobColor, HeadlineKeyword> = {
  blue: 'reliable',
  green: 'empowering',
  orange: 'fast',
}

const HeadlineWord = ({
  word,
  isActive,
  color,
}: {
  word: string
  isActive: boolean
  color: IntroBlobColor
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
  const getStartedButtonRef = useRef<HTMLAnchorElement>(null)
  const slideshowUsp = landingPageHeroUsps[slideshowState.index] ?? landingPageHeroUsps[0]
  const activeColor = manualHoverTarget?.color ?? slideshowUsp?.dotColor ?? 'blue'
  const activeHeadlineWord = activeHeadlineWordByColor[activeColor]
  const activeUspId = manualHoverTarget?.id ?? slideshowUsp?.id ?? null
  const isSlideshowMode = manualHoverTarget === null

  useEffect(() => {
    if (!isSlideshowMode || landingPageHeroUsps.length <= 1) {
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
  }, [isSlideshowMode])

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
        {motionColors.map((color) => (
          <HeroBackgroundMotion key={color} color={color} isActive={activeColor === color} />
        ))}
        <LayoutComponent
          $size="sm"
          className="flex flex-col items-center text-center lg:min-h-[calc(100dvh-56*var(--spacing))] pb-20 overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            <span className="inline-flex flex-col sm:flex-row gap-1 mx-auto mb-4 mt-20">
              <span className="block badge badge-neutral badge-ghost badge-sm">⭐️ Replaces Next.js / Nuxt / ...</span>
              <span className="block badge badge-neutral badge-ghost badge-sm">🏗️ Powered By Vite</span>
            </span>
            <div className="relative">
              <Headline as="h1" variant="xlarge" className="mb-4">
                <HeadlineWord word="Open." isActive={activeHeadlineWord === 'empowering'} color="green" />{' '}
                <HeadlineWord word="Reliable." isActive={activeHeadlineWord === 'reliable'} color="blue" />{' '}
                <HeadlineWord word="Fast." isActive={activeHeadlineWord === 'fast'} color="orange" />
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
