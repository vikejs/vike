import React from 'react'
import { BoxOrange } from './EcoComponents'
import { BoxBlue } from './VikeComponents'

type StableGraphicLegendKind = 'vike' | 'ecosystem' | 'hooks'

interface StableGraphicLegendProps {
  kind: StableGraphicLegendKind
}

const legendCopy: Record<StableGraphicLegendKind, string> = {
  vike: 'Vike internal components',
  ecosystem: 'JavaScript ecosystem',
  hooks: 'Vike hooks',
}

const legendToneClass: Record<StableGraphicLegendKind, string> = {
  vike: 'border-secondary/15 bg-white/90 text-secondary/90 shadow-secondary/10',
  ecosystem: 'border-accent/15 bg-white/90 text-accent/90 shadow-accent/10',
  hooks: 'border-base-300 bg-white/85 text-base-content/60 shadow-base-300/10',
}

const StableGraphicLegend = ({ kind }: StableGraphicLegendProps) => {
  const isVike = kind === 'vike'
  const isHooks = kind === 'hooks'

  return (
    <div className="flex justify-center">
      <div
        className={`inline-flex items-center gap-2.5 rounded-full border px-3 py-2 shadow-xs backdrop-blur-sm ${legendToneClass[kind]}`}
      >
        {isVike ? (
          <BoxBlue $size="big" className="m-0! h-6! w-8! flex-none!" />
        ) : isHooks ? (
          <span
            className="h-6 w-8 flex-none"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, #d8d8d8 0%, #d8d8d8 100%), linear-gradient(to right, #90e5d9 0%, #90e5d9 100%)',
              backgroundPosition: 'center top, center bottom',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '3px 100%, 16px 1px',
            }}
          />
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
