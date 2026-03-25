import React from 'react'
import cm from '@classmatejs/react'
import VikeComponents from './VikeComponents'
import EcoComponents from './EcoComponents'
import StableGraphicLegend from './Legend'

// TODO/ai refactor this graphic: move JS ecosystem legend to the top, keep Vike interneal components to the bottom and separate top from botton with a line with a label "CLEAN DECOUPLING"

const Outer = cm.div`relative mx-auto`

const StableGraphic = () => {
  return (
    <Outer>
      <EcoComponents />
      <VikeComponents />
      <StableGraphicLegend />
    </Outer>
  )
}

export default StableGraphic
