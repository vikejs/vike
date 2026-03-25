import React from 'react'
import LayoutComponent from '../../../components/LayoutComponent'
import { BoxOrange } from './EcoComponents'
import { BoxBlue } from './VikeComponents'

type StableGraphicLegendKind = 'vike' | 'ecosystem'

interface StableGraphicLegendProps {
  kind: StableGraphicLegendKind
}

const legendCopy: Record<StableGraphicLegendKind, string> = {
  vike: 'Vike internal components',
  ecosystem: 'JavaScript ecosystem',
}

const StableGraphicLegend = ({ kind }: StableGraphicLegendProps) => {
  const isVike = kind === 'vike'

  return (
    <LayoutComponent $size="sm" className="w-full">
      <div className="flex justify-center">
        <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-xs shadow-base-300/40">
          {isVike ? (
            <BoxBlue $size="big" className="w-8! h-6! flex-none! m-0!" />
          ) : (
            <BoxOrange $size="big" $type="lib" className="w-8! h-6! flex-none! m-0!">
              <div className="bg-linear-to-bl to-accent/7 absolute inset-0 pointer-events-none select-none" />
              <span className="block h-4 w-10"></span>
            </BoxOrange>
          )}
          <p className="font-bold text-grey text-xs md:text-sm">{legendCopy[kind]}</p>
        </div>
      </div>
    </LayoutComponent>
  )
}

export default StableGraphicLegend
