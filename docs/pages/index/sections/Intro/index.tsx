import React, { useRef } from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import UspHero from './UspHero'
import Headline from '../../components/Headline'
import Blockquote from '../../components/Quote'
import UspHeroMobile from './UspHero/UspHeroMobile'
import GlassContainer from '../../components/GlassContainer'
import { Link } from '@brillout/docpress'
import { brands } from '../../../../components'

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

const TeamQuote = () => {
  return (
    <Blockquote
      className="mt-15 mb-3 md:mt-2 md:mb-10 pb-10 md:w-4/5 mx-auto"
      authorPictures={[
        'https://github.com/phonzammi.png?size=100',
        'https://github.com/richard-unterberg.png?size=100',
        'https://github.com/nitedani.png?size=100',
        'https://github.com/magne4000.png?size=100',
        'https://github.com/brillout.png?size=100',
      ]}
    >
      We started Vike 5 years ago with a bold mission: build the last framework you'll need — a rock-solid foundation
      with powerful hooks, ready to embrace JavaScript's future.
    </Blockquote>
  )
}

const BrandSubsection = () => {
  return (
    <GlassContainer className="pt-2 pb-4 mt-1">
      <div className="flex items-center flex-wrap mb-6 gap-x-5 gap-y-2 justify-center lg:justify-between">
        <BrandsContent />
      </div>
      <div className="text-grey text-xs md:text-sm mx-auto -mt-2 basis-full px-4 text-center">
        Used by large organizations to build mission-critical applications, see <Link href="/use-cases">Use Cases</Link>
      </div>
    </GlassContainer>
  )
}

const BrandsContent = () => {
  return (
    <>
      {brands.map((e, i) => (
        <a
          href={e.website}
          target="_blank"
          key={i}
          aria-label={e.desc}
          data-label-position={i === brands.length - 1 ? 'top-left' : null}
          className="colorize-on-hover text-center py-2 text-xs lg:text-base"
        >
          <img
            className="decolorize-4"
            src={e.logo}
            style={{
              display: 'block',
              height: `${2 * (e.scale ?? 1)}em`,
              objectFit: 'contain',
              position: 'relative',
              top: e.top,
            }}
          />
        </a>
      ))}
    </>
  )
}
