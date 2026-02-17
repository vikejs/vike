import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import UspHero from './UspHero'
import Headline from '../../components/Headline'
import BrandSubsection from './BrandSubsection'

const IntroSection = () => {
  return (
    <>
      <LayoutComponent
        $size="sm"
        className="flex flex-col items-center text-center lg:min-h-[calc(100dvh-56*var(--spacing))] pb-20 overflow-hidden"
      >
        <span className="inline-flex flex-col sm:flex-row gap-1 mx-auto mb-4 mt-20">
          <span className="block badge badge-neutral badge-ghost badge-sm">⭐️ Replaces Next.js / Nuxt / ...</span>
          <span className="block badge badge-neutral badge-ghost badge-sm">🏗️ Powered By Vite</span>
        </span>
        <Headline as="h1" variant="xlarge" className="mb-4">
          {'Build '}
          <GradientText color="blue">fast.</GradientText>
          {' Build '}
          <GradientText color="blue" rotation={45}>
            right.
          </GradientText>
        </Headline>
        <p className="text-xl md:text-2xl text-grey text-center w-3/4 lg:w-3/5 mx-auto mb-6">
          Plug-and-play composable framework for building applications with speed, flexibility, and stability.
        </p>
        <div className="flex gap-2 items-center justify-center mb-16">
          <a className="btn btn-neutral">Get Started</a>
          <a className="btn btn-neutral btn-outline">Scaffold new App</a>
        </div>
        <UspHero />
      </LayoutComponent>
      <LayoutComponent>
        <BrandSubsection />
      </LayoutComponent>
    </>
  )
}

export default IntroSection
