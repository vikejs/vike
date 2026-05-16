import React from 'react'
import Headline from '../../components/Headline'
import GradientText from '../../components/GradientText'

export const heroTaglineSecondary = <>Build mission-critical applications with stability and development freedom.</>

export const Hero = () => (
  <>
    <div className="relative">
      <Headline as="h1" variant="xlarge" className="mx-auto">
        Framework for <br />
        <GradientText color="blue">Stability</GradientText> and <GradientText color="green">Freedom</GradientText>
      </Headline>
    </div>
    <p className="text-base md:text-2xl text-grey text-center w-9/10 md:w-3/4 mx-auto mb-6 mt-4">
      {heroTaglineSecondary}
    </p>
  </>
)
