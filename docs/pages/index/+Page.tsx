import React from 'react'
import FlexibilitySection from './_landingnew/sections/Flexibility'

import './_landingnew/tailwind.css'
import IntroSection from './_landingnew/sections/Intro'

const LandingPage = () => {
  return (
    <div id="tailwind-portal" data-theme="vike" className="bg-base-300">
      <IntroSection />
      <FlexibilitySection />
    </div>
  )
}

export default LandingPage
