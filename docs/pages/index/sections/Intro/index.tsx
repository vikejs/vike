import React, { useRef } from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import UspHero from './UspHero'
import Headline from '../../components/Headline'
import BrandSubsection, { TeamQuote } from './BrandSubsection'
import UspHeroMobile from './UspHero/UspHeroMobile'

const taglineSecondary =
  "Minimal-lock-in framework that prioritizes application stability and development freedom, powered by an open foundation built for JavaScript's rapidly evolving ecosystem."

const IntroSection = () => {
  const getStartedButtonRef = useRef<HTMLAnchorElement>(null)

  return (
    <>
      <div data-intro-section-root="true" className="relative z-20" id="intro-section">
        {/* <div className="absolute top-0 left-0 h-1/2 w-full bg-linear-to-t to-white z-10" /> */}
        <LayoutComponent
          $size="md"
          className="flex flex-col items-center text-center min-h-[calc(100svh-48*var(--spacing))]  overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            <span className="sm:flex-row mb-4 lg:mb-8 mt-6 lg:mt-16 xl:mt-20 join rounded shadow">
              <span className="join-item py-1 px-2 bg-base-200 font-medium text-xs tracking-wide">REPLACES</span>
              <span className="join-item  py-1 px-2 bg-grey text-base-300 font-medium text-xs">
                Next.js / Nuxt / ...
              </span>
            </span>
            <div className="relative">
              <Headline as="h1" variant="xlarge" className="mx-auto">
                Framework for <br />
                <GradientText color="blue">Stability</GradientText> and{' '}
                <GradientText color="green">Freedom</GradientText>
              </Headline>
            </div>
            <p className="text-base md:text-2xl text-grey text-center w-9/10 md:w-3/4 mx-auto mb-6 mt-4">
              {taglineSecondary}
            </p>
            <div className="flex gap-2 items-center justify-center mb-8 sm:mb-12">
              <a
                ref={getStartedButtonRef}
                className="btn btn-md md:btn-lg text-white border-0 btn-neutral"
                href="/new"
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
            <TeamQuote />
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
