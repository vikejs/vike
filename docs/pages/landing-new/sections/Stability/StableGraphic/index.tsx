import React from 'react'
import cm from '@classmatejs/react'
import VikeComponents from './VikeComponents'
import EcoComponents from './EcoComponents'
import StableGraphicLegend from './Legend'

const Outer = cm.div`
  relative
  mx-auto  
`

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
