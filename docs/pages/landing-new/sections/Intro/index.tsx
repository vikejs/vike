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

const motionColors: IntroBlobColor[] = ['green', 'blue', 'orange']
const slideshowStepDurationMs = 4200
const slideshowTickMs = 40
const initialCtaColor: IntroBlobColor = 'green'

const IntroSection = () => {
  const [manualHoverTarget, setManualHoverTarget] = useState<UspHoverTarget | null>(null)
  const [slideshowState, setSlideshowState] = useState({ index: 0, progress: 0 })
  const firstGradientRef = useRef<HTMLSpanElement>(null)
  const secondGradientRef = useRef<HTMLSpanElement>(null)
  const getStartedButtonRef = useRef<HTMLAnchorElement>(null)
  const slideshowUsp = landingPageHeroUsps[slideshowState.index] ?? landingPageHeroUsps[0]
  const activeColor = manualHoverTarget?.color ?? slideshowUsp?.dotColor ?? 'blue'
  const activeUspId = manualHoverTarget?.id ?? slideshowUsp?.id ?? null
  const isSlideshowMode = manualHoverTarget === null

  useEffect(() => {
    if (!isSlideshowMode || landingPageHeroUsps.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      setSlideshowState((prevState) => {
        const nextProgress = prevState.progress + slideshowTickMs / slideshowStepDurationMs
        if (nextProgress < 1) {
          return { ...prevState, progress: nextProgress }
        }
        return { index: (prevState.index + 1) % landingPageHeroUsps.length, progress: 0 }
      })
    }, slideshowTickMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isSlideshowMode])

  const handleUspHoverChange = (hoverTarget: UspHoverTarget | null) => {
    if (hoverTarget) {
      setManualHoverTarget(hoverTarget)
      const hoveredIndex = landingPageHeroUsps.findIndex((usp) => usp.id === hoverTarget.id)
      if (hoveredIndex >= 0) {
        setSlideshowState((prevState) => ({ ...prevState, index: hoveredIndex, progress: 0 }))
      } else {
        setSlideshowState((prevState) => ({ ...prevState, progress: 0 }))
      }
      return
    }

    setManualHoverTarget(null)
    setSlideshowState((prevState) => ({ ...prevState, progress: 0 }))
  }

  useIntroHeadlineGradientMotion({
    firstTextRef: firstGradientRef,
    secondTextRef: secondGradientRef,
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
                {'Build '}
                <GradientText ref={firstGradientRef} color="green">
                  fast.
                </GradientText>
                {' Build '}
                <GradientText ref={secondGradientRef} color="green" rotation={45}>
                  right.
                </GradientText>
              </Headline>
            </div>
            <p className="text-xl md:text-2xl text-grey text-center w-3/4 lg:w-3/5 mx-auto mb-6">
              Plug-and-play composable framework for building applications with speed, flexibility, and stability.
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
              slideshowProgress={slideshowState.progress}
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
