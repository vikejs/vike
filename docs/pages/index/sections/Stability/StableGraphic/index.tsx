import React from 'react'
import cm from '@classmatejs/react'
import VikeComponents from './VikeComponents'
import EcoComponents from './EcoComponents'
import StableGraphicLegend from './Legend'

const Outer = cm.div`relative mx-auto flex flex-col gap-4 md:gap-6`

const DecouplingDivider = () => (
  <div className="relative flex items-center justify-center py-2 md:py-4">
    <div className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />
    <span className="relative bg-white px-3 text-[10px] font-semibold tracking-[0.28em] text-secondary/80 md:text-xs">
      CLEAN DECOUPLING
    </span>
  </div>
)

const StableGraphic = () => {
  return (
    <Outer>
      <StableGraphicLegend kind="ecosystem" />
      <EcoComponents />
      <DecouplingDivider />
      <VikeComponents />
      <StableGraphicLegend kind="vike" />
    </Outer>
  )
}

export default StableGraphic
