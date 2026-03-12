import React from 'react'
import ImageGroup from './ImageGroup'
import cm from '@classmatejs/react'
import VikeComponents from './VikeComponents'
import EcoComponents from './EcoComponents'

const Outer = cm.div`
  relative
  min-h-50 md:w-[90%] mt-40 md:mt-60
  mx-auto  
  bg-linear-to-t to-white via-white 
  rounded-box
`

const StableGraphic = () => {
  return (
    <Outer>
      <ImageGroup />
      <EcoComponents />
      <VikeComponents />
    </Outer>
  )
}

export default StableGraphic
