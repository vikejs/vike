import React, { useEffect } from 'react'
import FlexibilitySection from './_landingnew/sections/Flexibility'

import './_landingnew/tailwind.css'
import IntroSection from './_landingnew/sections/Intro'

const LandingPage = () => {
  // add later to onRenderHtml in docpress: data-theme="vike"
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'vike')
  }, [])

  return (
    <>
      <IntroSection />
      <FlexibilitySection />
    </>
  )
}

export default LandingPage
