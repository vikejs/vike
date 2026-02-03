import React from 'react'
import LayoutComponent from '../../components/LayoutComponent'
import GradientText from '../../components/GradientText'
import UspHero from './UspHero'
import Headline, { H1Headline } from '../../components/Headline'

const IntroSection = () => {
  return (
    <LayoutComponent $size="sm" className="flex flex-col justify-center text-center pt-18">
      <span className="inline-flex flex-col sm:flex-row gap-1 mx-auto mb-8">
        <span className="block badge badge-secondary badge-soft badge-sm">👍 Replaces Next.js / Nuxt / ...</span>
        <span className="block badge badge-secondary badge-soft badge-sm">🏗️ Powered By Vite</span>
      </span>
      <Headline as="h1" variant="xlarge" className="mb-4">
        {'Build '}
        <GradientText color="blue">fast.</GradientText>
        {' Build '}
        <GradientText color="blue" rotation={45}>
          right.
        </GradientText>
      </Headline>
      <p className="text-xl md:text-2xl text-gray text-center w-3/4 lg:w-3/5 mx-auto mb-6">
        Composable framework to build advanced applications with stability and flexibility.
      </p>
      <div className="flex gap-2 items-center justify-center mb-14">
        <a className="btn btn-primary">Get Started</a>
        <a className="btn btn-accent btn-outline">Scaffold new App</a>
      </div>
      <UspHero />
    </LayoutComponent>
  )
}

export default IntroSection
