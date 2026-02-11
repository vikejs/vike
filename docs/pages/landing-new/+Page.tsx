import React from 'react'

import FlexibilitySection from './sections/Flexibility'
import IntroSection from './sections/Intro'
import StabilitySection from './sections/Stability'
import DxSection from './sections/Dx'

import './tailwind.css'

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
