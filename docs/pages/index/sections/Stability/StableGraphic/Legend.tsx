import React from 'react'
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

const legendToneClass: Record<StableGraphicLegendKind, string> = {
  vike: 'border-secondary/15 bg-white/90 text-secondary/90 shadow-secondary/10',
  ecosystem: 'border-accent/15 bg-white/90 text-accent/90 shadow-accent/10',
}

const StableGraphicLegend = ({ kind }: StableGraphicLegendProps) => {
  const isVike = kind === 'vike'

  return (
    <div className="flex justify-center">
      <div
        className={`inline-flex items-center gap-2.5 rounded-full border px-3 py-2 shadow-xs backdrop-blur-sm ${legendToneClass[kind]}`}
      >
        {isVike ? (
          <BoxBlue $size="big" className="m-0! h-6! w-8! flex-none!" />
        ) : (
          <BoxOrange $size="big" $type="lib" className="m-0! h-6! w-8! flex-none!">
            <div className="bg-linear-to-bl to-accent/7 absolute inset-0 pointer-events-none select-none" />
            <span className="block h-4 w-10"></span>
          </BoxOrange>
        )}
        <p className="text-xs font-semibold tracking-[0.02em] md:text-sm">{legendCopy[kind]}</p>
      </div>
    </div>
  )
}

export default StableGraphicLegend
