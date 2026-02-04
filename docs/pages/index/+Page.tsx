import React from 'react'

import FlexibilitySection from './_landingnew/sections/Flexibility'
import IntroSection from './_landingnew/sections/Intro'
import StabilitySection from './_landingnew/sections/Stability'
import DxSection from './_landingnew/sections/Dx'

import './_landingnew/tailwind.css'

const LandingPage = () => {
  return (
    <div id="tailwind-portal" data-theme="vike" className="bg-base-300">
      <IntroSection />
      <FlexibilitySection />
      <StabilitySection />
      <DxSection />
    </div>
  )
}

export default LandingPage
