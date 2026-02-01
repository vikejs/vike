import React, { useEffect } from 'react'
import FlexibilitySection from './_landingnew/sections/Flexibility'

import './_landingnew/tailwind.css'

const LandingPage = () => {
  // add later to onRenderHtml in docpress: data-theme="vike"
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'vike')
  }, [])

  return <FlexibilitySection />
}

export default LandingPage
