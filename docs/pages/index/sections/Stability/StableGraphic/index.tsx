import React from 'react'
import cm from '@classmatejs/react'
import VikeComponents from './VikeComponents'
import EcoComponents from './EcoComponents'
import StableGraphicLegend from './Legend'

const Outer = cm.div`relative mx-auto flex flex-col`

const SectionFrame = cm.div.variants<{ $tone: 'ecosystem' | 'vike' }>({
  base: `
    relative
    overflow-hidden
    rounded-[2rem]
    border
    px-3 py-4
    md:px-5 md:py-5
    shadow-[0_24px_80px_-44px_rgba(15,23,42,0.35)]
  `,
  variants: {
    $tone: {
      ecosystem: 'border-accent/15 bg-linear-to-b from-white via-white to-accent/4',
      vike: 'border-secondary/15 bg-linear-to-b from-white via-white to-secondary/5',
    },
  },
})

const DecouplingDivider = () => (
  <div className="relative flex min-h-28 items-center justify-center md:min-h-36">
    <div className="absolute inset-0 flex items-stretch justify-center gap-8 py-0 md:gap-12">
      {[0, 1, 2, 3, 4].map((barIndex) => (
        <span key={barIndex} className="relative h-full w-[3px] bg-[#d8d8d8] md:w-[4px]">
          <span className="absolute inset-y-0 left-0 w-px bg-white/70" />
          <span className="absolute inset-y-0 right-0 w-px bg-black/4" />
        </span>
      ))}
    </div>
    <div className="absolute bottom-0 left-1/2 h-px w-36 -translate-x-1/2 bg-[#90e5d9]/70 md:w-52" />
    <span className="relative rounded-full border border-base-300 bg-white/90 px-4 py-1 text-[10px] font-semibold tracking-[0.28em] text-secondary/80 shadow-xs shadow-base-300/40 md:text-xs">
      CLEAN DECOUPLING
    </span>
  </div>
)

const StableGraphic = () => {
  return (
    <Outer>
      <SectionFrame $tone="ecosystem">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <StableGraphicLegend kind="ecosystem" />
          <EcoComponents />
        </div>
      </SectionFrame>
      <DecouplingDivider />
      <SectionFrame $tone="vike">
        <div className="pointer-events-none absolute inset-x-10 bottom-0 h-28 rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <VikeComponents />
          <StableGraphicLegend kind="vike" />
        </div>
      </SectionFrame>
    </Outer>
  )
}

export default StableGraphic
