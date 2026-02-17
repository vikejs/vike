import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import UspHero from './UspHero'
import Headline from '../../components/Headline'
import BrandSubsection from './BrandSubsection'
import Blockquote from '../../components/Quote'

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
        <h1 style={{ fontSize: 65, fontWeight: 600 }}>
          {/*
          <span
            style={{
              fontWeight: 700,
              color: '#42d392',
              background: '-webkit-linear-gradient(315deg, #00C6FB 45%, #005BEA)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Reliable
          </span>
          {', '}
          <span
            style={{
              fontWeight: 700,
              color: '#42d392',
              background: '-webkit-linear-gradient(315deg, #FF8C00 25%, #FFFF00)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Empowering
          </span>
          */}
          Reliable, empowering.
        </h1>
        <p className="text-xl md:text-2xl text-grey text-center w-3/4 lg:w-3/5 mx-auto mb-6" style={{ fontSize: 30 }}>
          The last JavaScript framework you'll need.
        </p>
        <div className="flex gap-2 items-center justify-center mb-16">
          <a className="btn btn-neutral">Get Started</a>
          <a className="btn btn-neutral btn-outline">Scaffold new App</a>
        </div>
        <Blockquote
          className="md:w-4/5 mx-auto"
          style={{ marginBottom: 50, marginTop: -20 }}
          authorPictures={[
            'https://github.com/brillout.png?size=100',
            'https://github.com/magne4000.png?size=100',
            'https://github.com/nitedani.png?size=100',
            'https://github.com/phonzammi.png?size=100',
          ]}
        >
          We started Vike 5 years ago with a bold mission: build the most reliable and flexible framework and put an end
          to framework fatigue.
        </Blockquote>
        <UspHero />
      </LayoutComponent>
      <LayoutComponent>
        <BrandSubsection />
      </LayoutComponent>
    </>
  )
}

export default IntroSection
