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

const legendTextClass: Record<StableGraphicLegendKind, string> = {
  vike: 'text-secondary/90',
  ecosystem: 'text-accent/90',
  hooks: 'text-base-content/60',
}

const StableGraphicLegend = ({ kind }: StableGraphicLegendProps) => {
  const isVike = kind === 'vike'
  const isHooks = kind === 'hooks'

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2.5 px-2 py-1">
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
        <p className={`text-xs font-semibold tracking-[0.02em] md:text-sm ${legendTextClass[kind]}`}>
          {legendCopy[kind]}
        </p>
      </div>
    </div>
  )
}

export default StableGraphicLegend
