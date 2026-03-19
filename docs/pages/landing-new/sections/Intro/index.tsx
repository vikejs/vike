import React, { useRef, useState } from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import UspHero from './UspHero'
import Headline from '../../components/Headline'
import BrandSubsection from './BrandSubsection'
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
  const getStartedButtonRef = useRef<HTMLAnchorElement>(null)

  return (
    <>
      <div data-intro-section-root="true" className="relative z-20">
        {/* <div className="absolute top-0 left-0 h-1/2 w-full bg-linear-to-t to-white z-10" /> */}
        <LayoutComponent
          $size="md"
          className="flex flex-col items-center text-center min-h-[calc(100svh-48*var(--spacing))]  overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            <span className="sm:flex-row mb-4 mt-6 lg:mt-16 xl:mt-20 join rounded shadow">
              <span className="join-item py-1 px-2 bg-base-200 uppercase font-medium text-xs">Replaces:</span>
              <span className="join-item  py-1 px-2 bg-grey text-base-300 font-medium text-xs">Next.js / Nuxt / ...</span>
            </span>
            <div className="relative">
              <Headline as="h1" variant="xlarge" className='mx-auto'>
                The  Framework for <br /><GradientText color="blue">Stability</GradientText> and {' '} <GradientText color="green">Freedom</GradientText>
                {/* <HeadlineWord word="Flexible." isActive={activeHeadlineWord === 'green'} color="green" />{' '}
                <HeadlineWord word="Reliable." isActive={activeHeadlineWord === 'blue'} color="blue" />{' '}
                <HeadlineWord word="Fast." isActive={activeHeadlineWord === 'orange'} color="orange" /> */}
              </Headline>
            </div>
            <p className="text-base md:text-2xl text-grey text-center w-3/4 lg:w-4/5 mx-auto mb-6 mt-4">
              Vike is a minimal-lock-in framework prioritizing application stability
              and development freedom, with a novel architecture that
              embraces JavaScript&apos;s fast-moving ecosystem.
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
            </div>
            <UspHero />
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
